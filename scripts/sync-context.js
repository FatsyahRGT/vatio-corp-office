import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, '..');
const CONTEXT_PATH = resolve(ROOT_DIR, 'SYSTEM_CONTEXT.md');
const REPORT_PATH = resolve(ROOT_DIR, 'graphify-out/GRAPH_REPORT.md');
const GRAPH_JSON_PATH = resolve(ROOT_DIR, 'graphify-out/graph.json');

export function syncGraphifyToContext() {
  if (!existsSync(CONTEXT_PATH)) {
    console.error('❌ SYSTEM_CONTEXT.md tidak ditemukan di root!');
    return false;
  }

  if (!existsSync(REPORT_PATH) && !existsSync(GRAPH_JSON_PATH)) {
    console.warn('⚠️ graphify-out belum dibuat. Jalankan /graphify terlebih dahulu.');
    return false;
  }

  let reportText = '';
  if (existsSync(REPORT_PATH)) {
    reportText = readFileSync(REPORT_PATH, 'utf-8');
  }

  // Ekstrak data dari GRAPH_REPORT.md jika ada
  const today = new Date().toISOString().slice(0, 10);
  let summaryLine = 'Topology terdeteksi';
  let godNodesList = [];
  let cyclesInfo = '0 (Decoupled & bersih)';

  const summaryMatch = reportText.match(/## Summary\s*\n-\s*([^\n]+)/);
  if (summaryMatch) {
    summaryLine = summaryMatch[1];
  }

  const godsMatch = reportText.match(/## God Nodes[^\n]*\n([\s\S]*?)(?=\n##|\Z)/);
  if (godsMatch) {
    const rawGods = godsMatch[1]
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.startsWith('1.') || l.startsWith('2.') || l.startsWith('3.') || l.startsWith('4.') || l.startsWith('5.'))
      .slice(0, 5);
    if (rawGods.length > 0) {
      godNodesList = rawGods;
    }
  }

  const cyclesMatch = reportText.match(/## Import Cycles\s*\n-?\s*([^\n]+)/);
  if (cyclesMatch) {
    cyclesInfo = cyclesMatch[1];
  }

  const godNodesFormatted = godNodesList.length > 0
    ? godNodesList.map((g) => `  ${g}`).join('\n')
    : '  1. `createPanel()` - UI Hub\n  2. `box()` - 3D Generator\n  3. `submit()` - Chat Stream';

  const newSection2 = `## 2. Graphify Analysis Summary
*(Bagian ini otomatis diperbarui oleh Graphify Sync pada ${today})*
- **Date Last Scan:** ${today}
- **Topology Scale:** ${summaryLine}
- **God Nodes (Pusat Beban Sistem):**
${godNodesFormatted}
- **Circular Dependencies:** ${cyclesInfo}`;

  let contextContent = readFileSync(CONTEXT_PATH, 'utf-8');
  const section2Regex = /## 2\. Graphify Analysis Summary[\s\S]*?(?=\n## 3\.|\Z)/;

  if (section2Regex.test(contextContent)) {
    contextContent = contextContent.replace(section2Regex, newSection2 + '\n\n');
    writeFileSync(CONTEXT_PATH, contextContent, 'utf-8');
    console.log('✅ SYSTEM_CONTEXT.md berhasil disinkronkan dengan data Graphify terbaru!');
    return true;
  } else {
    console.warn('⚠️ Section 2 tidak ditemukan dengan format standar di SYSTEM_CONTEXT.md.');
    return false;
  }
}

// Jalankan jika dipanggil via CLI: node scripts/sync-context.js
if (process.argv[1] && process.argv[1].endsWith('sync-context.js')) {
  syncGraphifyToContext();
}
