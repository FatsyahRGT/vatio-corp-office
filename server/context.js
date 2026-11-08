import {
  saveAgentSession,
  loadAgentSession,
  deleteAgentSession,
  clearAllSessions,
  deleteContextId,
  triggerLogRotation,
} from '../sys-agents/session-manager.js';
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { synthesizeAllDivisions } from '../sys-agents/notulen-master.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_CONTEXT_PATH = resolve(__dirname, '../SYSTEM_CONTEXT.md');
const TIER1_CONTEXT_PATH = resolve(__dirname, '../sys-agents/SYSTEM_CONTEXT.md');
const TIER2_SPRINT_LOG_PATH = resolve(__dirname, '../sys-agents/SPRINT_LOG.md');
const ARCHIVE_DIR_PATH = resolve(__dirname, '../sys-agents/archive');

let cachedContent = '';
let lastMtime = 0;

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  return (bytes / 1024).toFixed(1) + ' KB';
}

function formatDate(date) {
  return new Date(date).toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

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

  const indexMatch = tier1Text.match(/<!-- CONTEXT_INDEX_START -->([\s\S]*?)<!-- CONTEXT_INDEX_END -->/);
  const indexLines = indexMatch
    ? indexMatch[1].split('\n').map((l) => l.trim()).filter((l) => l.startsWith('-'))
    : [
        '- [CORE-01] Arsitektur: Kantor AI (Vatio Corp)',
        '- [TECH-01] Graphify Topologi: Active',
        '- [INFRA-01] API Gateway: 9Router Integration',
      ];

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

  let archiveCount = 0;
  if (existsSync(ARCHIVE_DIR_PATH)) {
    try {
      archiveCount = readdirSync(ARCHIVE_DIR_PATH).filter((f) => f.startsWith('HISTORY_')).length;
    } catch {}
  }

  return `### ⚡ 9Router: Protocol Tiered Memory Ready\n` +
    `**System Memory Rotation:** Enabled | **Cold Archives (Tier 3):** ${archiveCount} file\n\n` +
    `#### 📋 Master Blueprint Index (Tier 1)\n` +
    `${indexLines.join('\n')}\n\n` +
    `#### 🔄 Active Working Memory (Tier 2)\n` +
    `${sprintText.trim() || '*(Log sprint kosong)*'}\n\n` +
    `> 💡 *Gunakan \`load-clipping <ID>\` (contoh: \`load-clipping CORE-01\` atau \`load-clipping TECH-01\`) untuk mengambil detail potongan arsitektur tertentu.*`;
}

/**
 * Filter konteks berdasarkan ID Index kategori (misal: list-context TECH)
 */
export function listContext(category = '') {
  const cat = String(category || '').trim().toUpperCase();

  let tier1Text = '';
  if (existsSync(TIER1_CONTEXT_PATH)) {
    tier1Text = readFileSync(TIER1_CONTEXT_PATH, 'utf-8');
  }

  const indexMatch = tier1Text.match(/<!-- CONTEXT_INDEX_START -->([\s\S]*?)<!-- CONTEXT_INDEX_END -->/);
  const indexLines = indexMatch
    ? indexMatch[1].split('\n').map((l) => l.trim()).filter((l) => l.startsWith('-'))
    : [
        '- [CORE-01] Arsitektur: Kantor AI (Vatio Corp)',
        '- [TECH-01] Graphify Topologi: Active',
        '- [INFRA-01] API Gateway: 9Router Integration',
      ];

  const filtered = cat
    ? indexLines.filter((l) => l.toUpperCase().includes(cat))
    : indexLines;

  if (filtered.length === 0) {
    return `### 🔍 Hasil Filter Konteks: [${cat}]\n\nTidak ditemukan entri dengan kategori tersebut.\n\n**Index Tersedia:**\n${indexLines.join('\n')}`;
  }

  return `### 🔍 Visual Index Konteks Vatio Corp${cat ? ` [Kategori: ${cat}]` : ''}\n\n` +
    `${filtered.join('\n')}\n\n` +
    `> 💡 *Ketik \`load-clipping <ID>\` untuk melihat dokumen lengkap dari modul di atas.*`;
}

/**
 * Menampilkan struktur memori saat ini dalam format tabel rapi
 */
export function getMemoryStructureTable() {
  const rows = [];

  // Tier 1
  if (existsSync(TIER1_CONTEXT_PATH)) {
    const stat = statSync(TIER1_CONTEXT_PATH);
    rows.push({
      tier: 'Tier 1 (Master Blueprint)',
      file: 'SYSTEM_CONTEXT.md',
      path: './sys-agents/SYSTEM_CONTEXT.md',
      size: formatBytes(stat.size),
      mtime: formatDate(stat.mtime),
      desc: 'Master topologi sistem, ID indexing, dan status God Nodes',
    });
  }

  // Tier 2
  if (existsSync(TIER2_SPRINT_LOG_PATH)) {
    const stat = statSync(TIER2_SPRINT_LOG_PATH);
    rows.push({
      tier: 'Tier 2 (Working Memory)',
      file: 'SPRINT_LOG.md',
      path: './sys-agents/SPRINT_LOG.md',
      size: formatBytes(stat.size),
      mtime: formatDate(stat.mtime),
      desc: 'Log aktif sprint mingguan & working context sebelum rotasi',
    });
  }

  // Tier 3
  let archiveCount = 0;
  let archiveSize = 0;
  if (existsSync(ARCHIVE_DIR_PATH)) {
    try {
      const files = readdirSync(ARCHIVE_DIR_PATH).filter((f) => f.startsWith('HISTORY_'));
      archiveCount = files.length;
      files.forEach((f) => {
        archiveSize += statSync(resolve(ARCHIVE_DIR_PATH, f)).size;
      });
    } catch {}
  }
  rows.push({
    tier: 'Tier 3 (Cold Archive)',
    file: `${archiveCount} file tersimpan`,
    path: './sys-agents/archive/',
    size: formatBytes(archiveSize),
    mtime: 'Rotasi Otomatis Mingguan',
    desc: 'Histori log backup mingguan Vatio Corp',
  });

  let md = `### 🏢 Struktur Memori Vatio Corp Saat Ini\n\n`;
  md += `| Tingkatan (Tier) | Berkas | Ukuran | Terakhir Diperbarui | Peran & Deskripsi |\n`;
  md += `| :--- | :--- | :--- | :--- | :--- |\n`;
  rows.forEach((r) => {
    md += `| **${r.tier}** | \`${r.file}\` | ${r.size} | ${r.mtime} | ${r.desc} |\n`;
  });
  md += `\n> 💡 *Gunakan \`list-context\` untuk filter ID, atau ketik "Arga, apa saja yang ada di archive?" untuk daftar histori.*`;
  return md;
}

/**
 * Menampilkan daftar berkas mingguan di direktori cold archive
 */
export function getArchiveList() {
  if (!existsSync(ARCHIVE_DIR_PATH)) {
    return '### 📦 Cold Archive Vatio Corp\n\nDirektori arsip belum ditemukan.';
  }

  const files = readdirSync(ARCHIVE_DIR_PATH).filter((f) => f.startsWith('HISTORY_'));
  if (files.length === 0) {
    return '### 📦 Cold Archive Vatio Corp (`./sys-agents/archive/`)\n\nBelum ada file arsip mingguan yang tersimpan. Jalankan `npm run logs:rotate` untuk rotasi log sprint saat ini.';
  }

  let md = `### 📦 Cold Archive Vatio Corp: Daftar Arsip Histori Mingguan (` + './sys-agents/archive/' + `)\n\n`;
  md += `Total: **${files.length} arsip tersimpan**\n\n`;
  md += `| Nama Berkas Arsip | Ukuran | Tanggal Rotasi | Status |\n`;
  md += `| :--- | :--- | :--- | :--- |\n`;
  files.forEach((f) => {
    const fStat = statSync(resolve(ARCHIVE_DIR_PATH, f));
    md += `| \`${f}\` | ${formatBytes(fStat.size)} | ${formatDate(fStat.mtime)} | ✅ Terarsip Aman |\n`;
  });
  return md;
}

/**
 * Menjalankan sintesis notulensi lintas divisi dan menghasilkan ringkasan respons chat
 */
export function synthesizeNotulen() {
  const result = synthesizeAllDivisions();
  const { stats } = result;

  return `### 📝 Notulen Pusat Vatio Corp: Sintesis Selesai!\n\n` +
    `*Sistem Notulen:* "Sedang melakukan merge... Mendeteksi **${stats.techCount} keputusan teknis** dari Arga & Danu, **${stats.bizCount} arahan bisnis** dari Arya Sena, dan **${stats.ventureCount} narasi pitching** dari Nadira."\n\n` +
    `📄 **Dokumen final master valid berhasil diterbitkan ke:**\n` +
    `- \`FINAL_MASTER_DOC.md\`\n` +
    `- \`DOKUMEN_VALID_HACKATHON.md\`\n\n` +
    `#### 📑 Cuplikan Matriks Harmonisasi:\n` +
    `| Divisi | ID | Status |\n` +
    `| :--- | :--- | :--- |\n` +
    `| ⚙️ Teknis (Arga & Danu) | \`TECH-DEC-01..03\` | ✅ Terverifikasi Topologi |\n` +
    `| 💼 Bisnis (Arya Sena) | \`BIZ-DEC-01..03\` | ✅ Aligned Case 2 GDG ITB |\n` +
    `| 🎯 Venture (Nadira) | \`VENTURE-DEC-01..03\` | ✅ Ready for Pitching |\n\n` +
    `> 💡 *Buka file \`FINAL_MASTER_DOC.md\` untuk melihat dokumen utuh dengan Executive Summary, Matriks Harmonisasi, Feasibility Anti-Slop, dan Action Items.*`;
}

export {
  saveAgentSession,
  loadAgentSession,
  deleteAgentSession,
  clearAllSessions,
  deleteContextId,
  triggerLogRotation,
};
