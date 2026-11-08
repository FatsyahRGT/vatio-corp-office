import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { rotateLogs } from './rotate-logs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SESSIONS_DIR = path.resolve(__dirname, 'sessions');
const SYSTEM_CONTEXT_PATH = path.resolve(__dirname, 'SYSTEM_CONTEXT.md');
const ROOT_CONTEXT_PATH = path.resolve(__dirname, '../SYSTEM_CONTEXT.md');

// Pastikan direktori sessions ada
if (!fs.existsSync(SESSIONS_DIR)) {
  fs.mkdirSync(SESSIONS_DIR, { recursive: true });
}

function normalizeAgentName(name) {
  return String(name || '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
}

/**
 * Menyimpan / memperbarui sesi percakapan agen tertentu
 * @param {string} agentName - Nama agen (arga, sena, nadira, rian, dll.)
 * @param {string} content - Konten obrolan
 */
export function saveAgentSession(agentName, content) {
  const norm = normalizeAgentName(agentName);
  if (!norm) return false;
  const filePath = path.join(SESSIONS_DIR, `session_${norm}.md`);
  fs.writeFileSync(filePath, String(content || ''), 'utf-8');
  return true;
}

/**
 * Memuat isi sesi percakapan agen tertentu
 * @param {string} agentName
 */
export function loadAgentSession(agentName) {
  const norm = normalizeAgentName(agentName);
  const filePath = path.join(SESSIONS_DIR, `session_${norm}.md`);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf-8');
  }
  return '';
}

/**
 * Menghapus/mengosongkan sesi percakapan agen tertentu
 * @param {string} agentName - Nama agen (arga, sena, nadira, rian)
 */
export function deleteAgentSession(agentName) {
  const norm = normalizeAgentName(agentName);
  const filePath = path.join(SESSIONS_DIR, `session_${norm}.md`);
  if (fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '', 'utf-8'); // Kosongkan isi file
    console.log(`[SessionManager] Sesi untuk ${agentName} berhasil dihapus.`);
    return { success: true, agentName, filePath };
  }
  return { success: false, agentName, message: 'Berkas sesi belum ada.' };
}

/**
 * Menghapus seluruh sesi dari semua agen (Hard Reset Session)
 */
export function clearAllSessions() {
  if (!fs.existsSync(SESSIONS_DIR)) return { success: true, count: 0 };
  const files = fs.readdirSync(SESSIONS_DIR).filter((f) => f.startsWith('session_'));
  files.forEach((file) => {
    fs.writeFileSync(path.join(SESSIONS_DIR, file), '', 'utf-8');
  });
  console.log(`[SessionManager] Seluruh sesi agen telah dibersihkan.`);
  return { success: true, count: files.length };
}

/**
 * Menghapus 1 poin topik tertentu dari Master Blueprint berdasarkan ID (delete-context [ID])
 * @param {string} contextId - Contoh: 'CORE-01', 'TECH-01', 'INFRA-01'
 */
export function deleteContextId(contextId) {
  const targetId = String(contextId || '').trim().toUpperCase();
  if (!targetId) {
    return { success: false, message: 'ID context tidak boleh kosong.' };
  }

  let deleted = false;

  // 1. Update sys-agents/SYSTEM_CONTEXT.md
  if (fs.existsSync(SYSTEM_CONTEXT_PATH)) {
    let content = fs.readFileSync(SYSTEM_CONTEXT_PATH, 'utf-8');
    const lines = content.split('\n');
    const newLines = lines.filter((line) => {
      if (line.toUpperCase().includes(`[${targetId}]`)) {
        deleted = true;
        return false;
      }
      return true;
    });
    if (deleted) {
      fs.writeFileSync(SYSTEM_CONTEXT_PATH, newLines.join('\n'), 'utf-8');
    }
  }

  // 2. Update root SYSTEM_CONTEXT.md jika ada tag ID tersebut
  if (fs.existsSync(ROOT_CONTEXT_PATH)) {
    let rootContent = fs.readFileSync(ROOT_CONTEXT_PATH, 'utf-8');
    if (rootContent.toUpperCase().includes(`[${targetId}]`)) {
      const rootLines = rootContent.split('\n').filter((line) => !line.toUpperCase().includes(`[${targetId}]`));
      fs.writeFileSync(ROOT_CONTEXT_PATH, rootLines.join('\n'), 'utf-8');
      deleted = true;
    }
  }

  if (deleted) {
    console.log(`[SessionManager] Topik [${targetId}] berhasil dihapus dari Master Blueprint.`);
    return { success: true, contextId: targetId, message: `Poin topik [${targetId}] telah dihapus dari SYSTEM_CONTEXT.md.` };
  }

  return { success: false, contextId: targetId, message: `Poin topik [${targetId}] tidak ditemukan.` };
}

/**
 * Memicu Log Rotation mingguan (memindahkan SPRINT_LOG.md ke /archive/)
 */
export function triggerLogRotation() {
  return rotateLogs();
}
