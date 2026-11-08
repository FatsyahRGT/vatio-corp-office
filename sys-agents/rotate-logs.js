import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function rotateLogs() {
  const sprintLog = path.resolve(__dirname, 'SPRINT_LOG.md');
  const archiveDir = path.resolve(__dirname, 'archive');

  if (!fs.existsSync(archiveDir)) {
    fs.mkdirSync(archiveDir, { recursive: true });
  }

  const today = new Date().toISOString().split('T')[0];
  const dest = path.resolve(archiveDir, `HISTORY_${today}.md`);

  if (fs.existsSync(sprintLog)) {
    const content = fs.readFileSync(sprintLog, 'utf-8');
    if (content.trim()) {
      fs.renameSync(sprintLog, dest);
      console.log(`[Tiered Memory] Archived: ${dest}`);
    } else {
      console.log('[Tiered Memory] SPRINT_LOG.md kosong, melewati pemindahan file kosong.');
    }
  }

  fs.writeFileSync(
    sprintLog,
    `# Sprint Log - Active Working Memory (Tier 2)\n<!-- SPRINT_LOG_START -->\n- [ACTIVE] Log baru dimulai pada ${today}.\n<!-- SPRINT_LOG_END -->\n`,
    'utf-8'
  );
  console.log('9Router: Protocol Tiered Memory Ready. System Memory Rotation: Enabled.');
  return { success: true, dest };
}

// Eksekusi otomatis jika dipanggil langsung via CLI: node ./sys-agents/rotate-logs.js
if (process.argv[1] && process.argv[1].endsWith('rotate-logs.js')) {
  rotateLogs();
}
