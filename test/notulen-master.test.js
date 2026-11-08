import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { synthesizeAllDivisions } from '../sys-agents/notulen-master.js';
import { synthesizeNotulen } from '../server/context.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, '..');
const FINAL_DOC_PATH = resolve(ROOT_DIR, 'FINAL_MASTER_DOC.md');
const HACKATHON_DOC_PATH = resolve(ROOT_DIR, 'DOKUMEN_VALID_HACKATHON.md');

test('Notulen Master: Ingesti Lintas Divisi dan Sintesis Menghasilkan Master Document', () => {
  const result = synthesizeAllDivisions();

  assert.equal(result.success, true, 'synthesizeAllDivisions harus mengembalikan success: true');
  assert.ok(result.stats.total >= 9, 'Harus mendeteksi minimal 9 keputusan dari tech, biz, dan venture');
  assert.ok(result.stats.techCount >= 3, 'Harus mendeteksi minimal 3 keputusan tech');
  assert.ok(result.stats.bizCount >= 3, 'Harus mendeteksi minimal 3 arahan biz');
  assert.ok(result.stats.ventureCount >= 3, 'Harus mendeteksi minimal 3 narasi venture');

  assert.ok(existsSync(FINAL_DOC_PATH), 'FINAL_MASTER_DOC.md harus berhasil dibuat');
  assert.ok(existsSync(HACKATHON_DOC_PATH), 'DOKUMEN_VALID_HACKATHON.md harus berhasil dibuat');

  const content = readFileSync(FINAL_DOC_PATH, 'utf-8');
  assert.ok(content.includes('DOKUMEN MASTER INOVASI & PROBLEM SOLVING: Vatio Corp Master Synthesis'), 'Harus memiliki header judul master');
  assert.ok(content.includes('Transformasi Layanan Komunitas & Produktivitas Operasional Modern'), 'Harus menyasar misi inovasi layanan komunitas');
  assert.ok(content.includes('1. Matriks Harmonisasi Keputusan Lintas Divisi'), 'Harus memuat matriks harmonisasi');
  assert.ok(content.includes('2. Keputusan Teknis & Arsitektur (Tech)'), 'Harus memuat bagian keputusan teknis');
  assert.ok(content.includes('3. Proyeksi & Efisiensi Proses Bisnis (Biz)'), 'Harus memuat bagian proyeksi bisnis');
  assert.ok(content.includes('4. Narasi Pitching & Dampak Sosial (Venture)'), 'Harus memuat bagian narasi venture');
  assert.ok(content.includes('5. Rencana Aksi & Milestone Eksekusi Tim'), 'Harus memuat action items');
});

test('Notulen Master: synthesizeNotulen Memberikan Ringkasan Cepat Siap Chat', () => {
  const reply = synthesizeNotulen();

  assert.ok(reply.includes('Notulen Pusat Vatio Corp: Sintesis Selesai!'), 'Harus memiliki salam pembuka notulen');
  assert.ok(reply.includes('Sedang melakukan merge'), 'Harus memiliki deskripsi proses merge');
  assert.ok(reply.includes('FINAL_MASTER_DOC.md'), 'Harus mereferensikan FINAL_MASTER_DOC.md');
  assert.ok(reply.includes('Cuplikan Matriks Harmonisasi'), 'Harus memuat cuplikan tabel matriks');
});
