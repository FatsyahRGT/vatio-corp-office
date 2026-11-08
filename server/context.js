import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_CONTEXT_PATH = resolve(__dirname, '../SYSTEM_CONTEXT.md');
const TIER1_CONTEXT_PATH = resolve(__dirname, '../sys-agents/SYSTEM_CONTEXT.md');
const TIER2_SPRINT_LOG_PATH = resolve(__dirname, '../sys-agents/SPRINT_LOG.md');
const ARCHIVE_DIR_PATH = resolve(__dirname, '../sys-agents/archive');

let cachedContent = '';
let lastMtime = 0;

/**
 * Mengambil ringkasan context sistem lengkap (Tier 1 Master Blueprint + Root Context Master + Tier 2 Sprint)
 */
export function getSystemContext() {
  const parts = [];

  // 1. Tier 1: Master Blueprint (ID-based indexing) bila ada
  if (existsSync(TIER1_CONTEXT_PATH)) {
    try {
      const tier1 = readFileSync(TIER1_CONTEXT_PATH, 'utf-8');
      if (tier1.trim()) {
        parts.push('=== TIER 1: MASTER BLUEPRINT (SYS-AGENTS) ===\n' + tier1.trim());
      }
    } catch (err) {
      console.error('[context] gagal membaca sys-agents/SYSTEM_CONTEXT.md:', err?.message || err);
    }
  }

  // 2. Root Single Source of Truth SYSTEM_CONTEXT.md
  if (existsSync(ROOT_CONTEXT_PATH)) {
    try {
      const stats = statSync(ROOT_CONTEXT_PATH);
      if (stats.mtimeMs !== lastMtime || !cachedContent) {
        cachedContent = readFileSync(ROOT_CONTEXT_PATH, 'utf-8');
        lastMtime = stats.mtimeMs;
      }
      if (cachedContent.trim()) {
        parts.push(cachedContent.trim());
      }
    } catch (err) {
      console.error('[context] gagal membaca root SYSTEM_CONTEXT.md:', err?.message || err);
    }
  }

  // 3. Tier 2: Active Working Memory Sprint Log bila ada
  if (existsSync(TIER2_SPRINT_LOG_PATH)) {
    try {
      const sprint = readFileSync(TIER2_SPRINT_LOG_PATH, 'utf-8');
      if (sprint.trim()) {
        parts.push('=== TIER 2: SPRINT WORKING MEMORY ===\n' + sprint.trim());
      }
    } catch {}
  }

  return parts.join('\n\n---\n\n');
}

/**
 * Mengambil indeks blueprint atau potongan konteks spesifik (Protocol 9Router: load-clipping)
 * @param {string} key ID indeks (misal: 'CORE-01', 'TECH-01', 'INFRA-01', atau kosong/all)
 */
export function getClipping(key = '') {
  const targetKey = String(key || '').trim().toUpperCase();

  let tier1Text = '';
  if (existsSync(TIER1_CONTEXT_PATH)) {
    tier1Text = readFileSync(TIER1_CONTEXT_PATH, 'utf-8');
  }

  let sprintText = '';
  if (existsSync(TIER2_SPRINT_LOG_PATH)) {
    sprintText = readFileSync(TIER2_SPRINT_LOG_PATH, 'utf-8');
  }

  // Ekstrak baris-baris index <!-- CONTEXT_INDEX_START --> ... <!-- CONTEXT_INDEX_END -->
  const indexMatch = tier1Text.match(/<!-- CONTEXT_INDEX_START -->([\s\S]*?)<!-- CONTEXT_INDEX_END -->/);
  const indexLines = indexMatch
    ? indexMatch[1].split('\n').map((l) => l.trim()).filter((l) => l.startsWith('-'))
    : [
        '- [CORE-01] Arsitektur: Kantor AI (Vatio Corp)',
        '- [TECH-01] Graphify Topologi: Active',
        '- [INFRA-01] API Gateway: 9Router Integration',
      ];

  // Jika user meminta specific ID (misal: CORE-01)
  if (targetKey && targetKey !== 'ALL') {
    const found = indexLines.find((line) => line.toUpperCase().includes(`[${targetKey}]`));
    if (found) {
      return `### 🔖 9Router Clipping: [${targetKey}]\n\n` +
        `**Definisi:** ${found.replace(/^-\s*/, '')}\n\n` +
        `*Sumber: Master Blueprint Tier 1 (` + './sys-agents/SYSTEM_CONTEXT.md' + `)*\n\n` +
        `**Konteks Blueprint:**\n` +
        `\`\`\`markdown\n${tier1Text.trim()}\n\`\`\``;
    }
  }

  // Menghitung arsip yang tersedia di Tier 3
  let archiveCount = 0;
  if (existsSync(ARCHIVE_DIR_PATH)) {
    try {
      archiveCount = readdirSync(ARCHIVE_DIR_PATH).filter((f) => f.startsWith('HISTORY_')).length;
    } catch {}
  }

  // Default: Menampilkan seluruh clipping index & status Tiered Memory
  return `### ⚡ 9Router: Protocol Tiered Memory Ready\n` +
    `**System Memory Rotation:** Enabled | **Cold Archives (Tier 3):** ${archiveCount} file\n\n` +
    `#### 📋 Master Blueprint Index (Tier 1)\n` +
    `${indexLines.join('\n')}\n\n` +
    `#### 🔄 Active Working Memory (Tier 2)\n` +
    `${sprintText.trim() || '*(Log sprint kosong)*'}\n\n` +
    `> 💡 *Gunakan \`load-clipping <ID>\` (contoh: \`load-clipping CORE-01\` atau \`load-clipping TECH-01\`) untuk mengambil detail potongan arsitektur tertentu.*`;
}
