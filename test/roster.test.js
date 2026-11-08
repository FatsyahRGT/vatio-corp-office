import test from 'node:test';
import assert from 'node:assert/strict';
import { DIVISIONS, AGENTS, agentById, divisionById, agentsOf, allLeaders } from '../shared/roster.js';

test('Roster: Validasi Divisi Kantor (3x3 Grid)', () => {
  assert.equal(DIVISIONS.length, 9, 'Harus ada tepat 9 divisi');

  const divIds = new Set();
  const coords = new Set();

  DIVISIONS.forEach((d) => {
    assert.ok(d.id, 'Divisi harus punya ID');
    assert.ok(d.name, 'Divisi harus punya nama');
    assert.ok(d.color && d.color.startsWith('#'), 'Divisi harus punya warna hex');
    assert.ok(d.row >= 0 && d.row <= 2, 'Row harus antara 0 dan 2');
    assert.ok(d.col >= 0 && d.col <= 2, 'Col harus antara 0 dan 2');

    assert.ok(!divIds.has(d.id), `ID Divisi tidak boleh duplikat: ${d.id}`);
    divIds.add(d.id);

    const coordKey = `${d.row},${d.col}`;
    assert.ok(!coords.has(coordKey), `Koordinat ruangan (row, col) bentrok di ${coordKey}`);
    coords.add(coordKey);
  });

  // Pastikan divisi baru ada di slot simetris baris ke-2
  const coreDiv = divisionById('core');
  assert.ok(coreDiv, 'Divisi Core Architecture harus terdaftar');
  assert.equal(coreDiv.row, 2);
  assert.equal(coreDiv.col, 0);

  const solutionDiv = divisionById('solution');
  assert.ok(solutionDiv, 'Divisi Solution Architecture harus terdaftar');
  assert.equal(solutionDiv.row, 2);
  assert.equal(solutionDiv.col, 2);
});

test('Roster: Validasi Karyawan & Karakter', () => {
  assert.equal(AGENTS.length, 41, 'Harus ada tepat 41 karyawan terdaftar');

  const agentIds = new Set();
  const validStyles = ['short', 'long', 'bun', 'ponytail'];

  AGENTS.forEach((a) => {
    assert.ok(a.id, 'Agent harus punya ID unik');
    assert.ok(!agentIds.has(a.id), `ID Agent duplikat: ${a.id}`);
    agentIds.add(a.id);

    assert.ok(a.name, `Agent ${a.id} harus punya nama`);
    assert.ok(a.role, `Agent ${a.id} harus punya role`);
    assert.ok(a.focus, `Agent ${a.id} harus punya fokus keahlian`);
    assert.ok(divisionById(a.division), `Divisi ${a.division} untuk ${a.id} tidak valid`);

    assert.ok(a.look, `Agent ${a.id} harus punya konfigurasi look 3D`);
    assert.ok(typeof a.look.skin === 'number' && a.look.skin >= 0 && a.look.skin <= 4, `Skin index ${a.id} harus 0-4`);
    assert.ok(validStyles.includes(a.look.style), `Style rambut ${a.id} (${a.look.style}) tidak valid`);

    assert.ok(Array.isArray(a.quick) && a.quick.length > 0, `Agent ${a.id} harus punya quick prompts`);
    assert.ok(Array.isArray(a.skills) && a.skills.length > 0, `Agent ${a.id} harus punya daftar skills`);
  });

  // Cek Om Danu (Ponytail Lead)
  const danu = agentById('danu');
  assert.ok(danu, 'Danang "Om Danu" Prasetyo harus terdaftar');
  assert.equal(danu.division, 'core');
  assert.equal(danu.leader, true);
  assert.equal(danu.look.style, 'ponytail', 'Om Danu harus bergaya rambut ponytail');

  // Cek Arya Sena (Solution Lead)
  const sena = agentById('sena');
  assert.ok(sena, 'Arya "Sena" Pradipta harus terdaftar');
  assert.equal(sena.division, 'solution');
  assert.equal(sena.leader, true);
});

test('Roster: Validasi Jumlah Leader Kantor', () => {
  const leaders = allLeaders();
  assert.equal(leaders.length, 9, 'Harus ada tepat 9 Team Leader (satu untuk setiap divisi)');

  DIVISIONS.forEach((d) => {
    const divLeaders = agentsOf(d.id).filter((a) => a.leader);
    assert.equal(divLeaders.length, 1, `Divisi ${d.name} harus punya tepat 1 Leader`);
  });
});
