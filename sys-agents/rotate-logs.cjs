const fs = require('fs');
const path = require('path');

const sprintLog = path.resolve(__dirname, 'SPRINT_LOG.md');
const archiveDir = path.resolve(__dirname, 'archive');

if (!fs.existsSync(archiveDir)) {
  fs.mkdirSync(archiveDir, { recursive: true });
}

const today = new Date().toISOString().split('T')[0];
const dest = path.resolve(archiveDir, 'HISTORY_' + today + '.md');

if (fs.existsSync(sprintLog)) {
  const content = fs.readFileSync(sprintLog, 'utf-8');
  if (content.trim()) {
    fs.renameSync(sprintLog, dest);
  }
}
fs.writeFileSync(sprintLog, '# Sprint Log - Active Working Memory (Tier 2)\n<!-- SPRINT_LOG_START -->\n- [ACTIVE] Log baru dimulai pada ' + today + '.\n<!-- SPRINT_LOG_END -->\n');
console.log('9Router: Protocol Tiered Memory Ready. System Memory Rotation: Enabled.');
