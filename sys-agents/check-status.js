import { existsSync, readFileSync, statSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TIER1_PATH = resolve(__dirname, 'SYSTEM_CONTEXT.md');
const TIER2_PATH = resolve(__dirname, 'SPRINT_LOG.md');
const ARCHIVE_DIR = resolve(__dirname, 'archive');

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

console.log('=================================================');
console.log('        STATUS TIERED MEMORY VATIO CORP         ');
console.log('=================================================\n');

// 1. TIER 1: Master Blueprint
console.log('[TIER 1] MASTER BLUEPRINT:');
console.log('Location: ./sys-agents/SYSTEM_CONTEXT.md');
if (existsSync(TIER1_PATH)) {
  const stat = statSync(TIER1_PATH);
  console.log(`Size: ${formatBytes(stat.size)} | Updated: ${formatDate(stat.mtime)}`);
  const lines = readFileSync(TIER1_PATH, 'utf-8').split('\n').slice(0, 14);
  console.log(lines.join('\n'));
} else {
  console.log('❌ File belum dibuat.');
}

console.log('\n-------------------------------------------------');

// 2. TIER 2: Sprint Working Memory
console.log('[TIER 2] SPRINT WORKING MEMORY:');
console.log('Location: ./sys-agents/SPRINT_LOG.md');
if (existsSync(TIER2_PATH)) {
  const stat = statSync(TIER2_PATH);
  console.log(`Size: ${formatBytes(stat.size)} | Updated: ${formatDate(stat.mtime)}`);
  const lines = readFileSync(TIER2_PATH, 'utf-8').split('\n').slice(0, 8);
  console.log('Preview Log:\n' + lines.join('\n'));
} else {
  console.log('❌ File belum dibuat.');
}

console.log('\n-------------------------------------------------');

// 3. TIER 3: Cold Archive
console.log('[TIER 3] COLD ARCHIVE SUMMARY:');
console.log('Location: ./sys-agents/archive/');
if (existsSync(ARCHIVE_DIR)) {
  const files = readdirSync(ARCHIVE_DIR).filter((f) => f.startsWith('HISTORY_'));
  console.log(`Jumlah File Arsip: ${files.length}`);
  files.forEach((f) => {
    const fPath = resolve(ARCHIVE_DIR, f);
    const fStat = statSync(fPath);
    console.log(` - ${f} (${formatBytes(fStat.size)}, ${formatDate(fStat.mtime)})`);
  });
} else {
  console.log('❌ Direktori archive belum ada.');
}

console.log('=================================================');
console.log('9Router Protocol: Ready | Graphify Sync: Active');
console.log('=================================================');
