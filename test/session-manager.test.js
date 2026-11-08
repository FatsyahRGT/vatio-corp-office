import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  saveAgentSession,
  loadAgentSession,
  deleteAgentSession,
  clearAllSessions,
  deleteContextId,
  triggerLogRotation,
} from '../sys-agents/session-manager.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, '..');
const SESSIONS_DIR = resolve(ROOT_DIR, 'sys-agents/sessions');
const TIER1_PATH = resolve(ROOT_DIR, 'sys-agents/SYSTEM_CONTEXT.md');

test('Session Manager: saveAgentSession dan loadAgentSession Bekerja Sesuai Nama Agen', () => {
  const agentName = 'arga';
  const testContent = 'Pesan uji coba sesi Arga Pratama';

  const saved = saveAgentSession(agentName, testContent);
  assert.equal(saved, true, 'saveAgentSession harus mengembalikan true');

  const loaded = loadAgentSession(agentName);
  assert.equal(loaded, testContent, 'loadAgentSession harus mengembalikan konten yang sesuai');
});

test('Session Manager: deleteAgentSession Mengosongkan Berkas Sesi Agen Tertentu', () => {
  const agentName = 'sena';
  saveAgentSession(agentName, 'Diskusi bisnis unit economics');

  const delResult = deleteAgentSession(agentName);
  assert.equal(delResult.success, true, 'deleteAgentSession harus berhasil');

  const loadedAfter = loadAgentSession(agentName);
  assert.equal(loadedAfter, '', 'Sesi setelah dihapus harus menjadi string kosong');
});

test('Session Manager: clearAllSessions Membersihkan Seluruh Berkas Sesi', () => {
  saveAgentSession('nadira', 'Pitching GDG ITB');
  saveAgentSession('rian', 'Task scheduling breakdown');

  const clearResult = clearAllSessions();
  assert.equal(clearResult.success, true, 'clearAllSessions harus berhasil');

  assert.equal(loadAgentSession('nadira'), '', 'Sesi Nadira harus kosong');
  assert.equal(loadAgentSession('rian'), '', 'Sesi Rian harus kosong');
});

test('Session Manager: deleteContextId Menghapus ID Tag Tertentu dari Master Blueprint', () => {
  // Tambahkan tag dummy sementara ke TIER1_PATH
  let currentTier1 = readFileSync(TIER1_PATH, 'utf-8');
  if (!currentTier1.includes('[TEST-DELETE-01]')) {
    currentTier1 = currentTier1.replace(
      '<!-- CONTEXT_INDEX_END -->',
      '- [TEST-DELETE-01] Dummy topic to be deleted\n<!-- CONTEXT_INDEX_END -->'
    );
    writeFileSync(TIER1_PATH, currentTier1, 'utf-8');
  }

  // Hapus tag dummy tersebut
  const res = deleteContextId('TEST-DELETE-01');
  assert.equal(res.success, true, 'deleteContextId harus mengembalikan success: true');

  const updatedTier1 = readFileSync(TIER1_PATH, 'utf-8');
  assert.ok(!updatedTier1.includes('[TEST-DELETE-01]'), 'Tag [TEST-DELETE-01] harus sudah terhapus');
});

test('Session Manager: triggerLogRotation Menjalankan Rotasi Log Mingguan', () => {
  const res = triggerLogRotation();
  assert.equal(res.success, true, 'triggerLogRotation harus mengembalikan success: true');
});
