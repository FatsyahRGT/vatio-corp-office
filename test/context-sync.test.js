import test from 'node:test';
import assert from 'node:assert/strict';
import { getSystemContext } from '../server/context.js';
import { syncGraphifyToContext } from '../scripts/sync-context.js';

test('Context: getSystemContext Membaca SYSTEM_CONTEXT.md Secara Dinamis', () => {
  const content = getSystemContext();
  assert.ok(typeof content === 'string' && content.length > 100, 'SYSTEM_CONTEXT.md harus ada dan tidak kosong');
  assert.ok(content.includes('Vatio Corp: System Context Master'), 'Harus memiliki judul master');
  assert.ok(content.includes('1. Project Overview'), 'Harus memiliki section 1');
  assert.ok(content.includes('2. Graphify Analysis Summary'), 'Harus memiliki section 2');
  assert.ok(content.includes('3. Active Development Focus'), 'Harus memiliki section 3');
  assert.ok(content.includes('4. Constraints & Architectural Rules'), 'Harus memiliki section 4');
});

test('Context Sync: Script Sinkronisasi Graphify Berjalan Tanpa Error', () => {
  const success = syncGraphifyToContext();
  assert.equal(success, true, 'syncGraphifyToContext harus berhasil mengeksekusi sinkronisasi');

  const updated = getSystemContext();
  assert.ok(updated.includes('God Nodes (Pusat Beban Sistem)'), 'Harus menyertakan ringkasan god nodes terkini');
});
