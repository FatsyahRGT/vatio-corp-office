import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTEXT_PATH = resolve(__dirname, '../SYSTEM_CONTEXT.md');

let cachedContent = '';
let lastMtime = 0;

export function getSystemContext() {
  if (!existsSync(CONTEXT_PATH)) return '';

  try {
    const stats = statSync(CONTEXT_PATH);
    if (stats.mtimeMs !== lastMtime) {
      cachedContent = readFileSync(CONTEXT_PATH, 'utf-8');
      lastMtime = stats.mtimeMs;
    }
    return cachedContent;
  } catch (err) {
    console.error('[context] gagal membaca SYSTEM_CONTEXT.md:', err?.message || err);
    return cachedContent || '';
  }
}
