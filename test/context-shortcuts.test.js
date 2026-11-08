import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  saveQuickDecision,
  getSharedMemorySummary,
  getTopologySummary,
} from '../server/context.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, '..');
const SPRINT_LOG_PATH = resolve(ROOT_DIR, 'sys-agents/SPRINT_LOG.md');
const BIZ_LOGS_PATH = resolve(ROOT_DIR, 'sys-agents/biz-logs.md');

test('Shortcuts: saveQuickDecision Menyimpan Keputusan ke Sprint Log & Biz Log', () => {
  const result = saveQuickDecision('Model adopsi zero-friction untuk layanan warga', 'sena');

  assert.ok(result.includes('Keputusan Berhasil Disimpan ke Sistem Vatio!'), 'Harus mengembalikan kartu konfirmasi');
  assert.ok(result.includes('Bisnis & Inovasi Layanan (Biz)'), 'Harus mengidentifikasi kategori Biz');
  assert.ok(result.includes('Model adopsi zero-friction'), 'Harus menyertakan teks keputusan');

  const sprintText = readFileSync(SPRINT_LOG_PATH, 'utf-8');
  assert.ok(sprintText.includes('Model adopsi zero-friction'), 'SPRINT_LOG.md harus memuat keputusan baru');

  const bizText = readFileSync(BIZ_LOGS_PATH, 'utf-8');
  assert.ok(bizText.includes('Model adopsi zero-friction'), 'biz-logs.md harus memuat keputusan baru');
});

test('Shortcuts: getSharedMemorySummary Menghasilkan Laporan Sinkronisasi Memori', () => {
  const summary = getSharedMemorySummary();

  assert.ok(summary.includes('Status Shared Memory Lintas Divisi'), 'Harus memiliki header status memori');
  assert.ok(summary.includes('Tier 1: Master Blueprint'), 'Harus memuat bagian Tier 1');
  assert.ok(summary.includes('Tier 2: Sprint Working Memory'), 'Harus memuat bagian Tier 2');
  assert.ok(summary.includes('Sesi Percakapan Aktif'), 'Harus memuat bagian sesi aktif');
});

test('Shortcuts: getTopologySummary Menghasilkan Ringkasan Graf Kode Graphify', () => {
  const summary = getTopologySummary();

  assert.ok(summary.includes('Status Topologi Kode & Graphify'), 'Harus memiliki header status topologi');
  assert.ok(summary.includes('God Nodes'), 'Harus memuat bagian God Nodes');
  assert.ok(summary.includes('createPanel()'), 'Harus menyebutkan god node utama');
});
