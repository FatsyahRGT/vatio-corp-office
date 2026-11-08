import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getSystemContext, getClipping } from '../server/context.js';
import { rotateLogs } from '../sys-agents/rotate-logs.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, '..');
const TIER1_PATH = resolve(ROOT_DIR, 'sys-agents/SYSTEM_CONTEXT.md');
const TIER2_PATH = resolve(ROOT_DIR, 'sys-agents/SPRINT_LOG.md');
const ARCHIVE_DIR = resolve(ROOT_DIR, 'sys-agents/archive');

test('Tiered Memory: Direktori dan File Master Blueprint (Tier 1 & Tier 2) Terbentuk', () => {
  assert.ok(existsSync(TIER1_PATH), 'sys-agents/SYSTEM_CONTEXT.md harus ada');
  assert.ok(existsSync(TIER2_PATH), 'sys-agents/SPRINT_LOG.md harus ada');
  assert.ok(existsSync(ARCHIVE_DIR), 'sys-agents/archive/ harus ada');

  const tier1Content = readFileSync(TIER1_PATH, 'utf-8');
  assert.ok(tier1Content.includes('Vatio Corp: Master Blueprint (Tier 1)'), 'Harus memiliki header Tier 1');
  assert.ok(tier1Content.includes('<!-- CONTEXT_INDEX_START -->'), 'Harus memiliki pembuka tag indexing');
  assert.ok(tier1Content.includes('<!-- CONTEXT_INDEX_END -->'), 'Harus memiliki penutup tag indexing');
  assert.ok(tier1Content.includes('[CORE-01]'), 'Harus memiliki entri CORE-01');
  assert.ok(tier1Content.includes('[TECH-01]'), 'Harus memiliki entri TECH-01');
  assert.ok(tier1Content.includes('[INFRA-01]'), 'Harus memiliki entri INFRA-01');
});

test('Tiered Memory: getClipping Mengembalikan Index Blueprint dan Detail ID', () => {
  // Test All Index
  const allClippings = getClipping();
  assert.ok(allClippings.includes('9Router: Protocol Tiered Memory Ready'), 'Harus mencantumkan status protokol 9Router');
  assert.ok(allClippings.includes('Master Blueprint Index (Tier 1)'), 'Harus mencantumkan Master Blueprint');
  assert.ok(allClippings.includes('CORE-01'), 'Harus menyertakan CORE-01 dalam daftar');

  // Test Specific ID Clipping
  const coreClipping = getClipping('CORE-01');
  assert.ok(coreClipping.includes('9Router Clipping: [CORE-01]'), 'Harus mengembalikan clipping spesifik CORE-01');
  assert.ok(coreClipping.includes('Kantor AI (Vatio Corp)'), 'Harus memuat deskripsi arsitektur kantor AI');

  const techClipping = getClipping('TECH-01');
  assert.ok(techClipping.includes('9Router Clipping: [TECH-01]'), 'Harus mengembalikan clipping spesifik TECH-01');

  const infraClipping = getClipping('INFRA-01');
  assert.ok(infraClipping.includes('9Router Clipping: [INFRA-01]'), 'Harus mengembalikan clipping spesifik INFRA-01');
});

test('Tiered Memory: Log Rotation Mengarsipkan SPRINT_LOG.md ke Cold Archive', () => {
  // Isi data dummy ke SPRINT_LOG.md
  writeFileSync(TIER2_PATH, '# Test Sprint Log\n- Dummy task selesai.', 'utf-8');

  // Jalankan rotasi log
  const res = rotateLogs();
  assert.equal(res.success, true, 'rotateLogs harus mengembalikan success: true');

  // Pastikan arsip terbentuk
  const files = readdirSync(ARCHIVE_DIR).filter((f) => f.startsWith('HISTORY_'));
  assert.ok(files.length > 0, 'Harus ada minimal 1 file HISTORY_ di direktori arsip');

  // Pastikan SPRINT_LOG.md di-reset
  const newSprintContent = readFileSync(TIER2_PATH, 'utf-8');
  assert.ok(newSprintContent.includes('Active Working Memory (Tier 2)'), 'Harus me-reset file SPRINT_LOG.md baru');
});

test('Tiered Memory: getSystemContext Mengintegrasikan Tier 1 Master Blueprint', () => {
  const fullContext = getSystemContext();
  assert.ok(fullContext.includes('TIER 1: MASTER BLUEPRINT'), 'Konteks harus menyertakan Tier 1 Master Blueprint');
  assert.ok(fullContext.includes('1. Project Overview'), 'Konteks harus tetap menyertakan Root System Context');
});
