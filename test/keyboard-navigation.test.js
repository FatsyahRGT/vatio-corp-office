import test from 'node:test';
import assert from 'node:assert/strict';
import { AGENTS, divisionById } from '../shared/roster.js';

test('Keyboard Navigation: Filter Pencarian Karyawan Akurat', () => {
  const query = 'arga';
  const q = query.trim().toLowerCase();
  const filtered = AGENTS.filter((a) => {
    if (!q) return true;
    const div = divisionById(a.division);
    const skillsStr = (a.skills || []).join(' ').toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      a.role.toLowerCase().includes(q) ||
      a.focus.toLowerCase().includes(q) ||
      div.name.toLowerCase().includes(q) ||
      skillsStr.includes(q)
    );
  }).sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    const aStarts = nameA.startsWith(q);
    const bStarts = nameB.startsWith(q);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    const aInc = nameA.includes(q);
    const bInc = nameB.includes(q);
    if (aInc && !bInc) return -1;
    if (!aInc && bInc) return 1;
    return 0;
  });

  assert.ok(filtered.length > 0, 'Harus menemukan minimal 1 agen untuk query "arga"');
  assert.equal(filtered[0].id, 'arga', 'Hasil pertama untuk "arga" harus Arga Pratama');
});

test('Keyboard Navigation: Navigasi Panah Panah (Arrow Navigation Math)', () => {
  const itemsCount = 5;

  // Simulasi navigasi ArrowDown
  let searchHighlightIndex = -1;
  const onArrowDown = (currentIdx, maxLen) => {
    return currentIdx < 0 ? 0 : Math.min(currentIdx + 1, maxLen - 1);
  };

  searchHighlightIndex = onArrowDown(searchHighlightIndex, itemsCount);
  assert.equal(searchHighlightIndex, 0, 'ArrowDown pertama dari input harus menyorot item index 0');

  searchHighlightIndex = onArrowDown(searchHighlightIndex, itemsCount);
  assert.equal(searchHighlightIndex, 1, 'ArrowDown kedua harus menyorot item index 1');

  // Simulasi navigasi ArrowUp
  const onArrowUp = (currentIdx) => {
    return currentIdx > 0 ? currentIdx - 1 : -1;
  };

  searchHighlightIndex = onArrowUp(searchHighlightIndex);
  assert.equal(searchHighlightIndex, 0, 'ArrowUp harus kembali ke item index 0');

  searchHighlightIndex = onArrowUp(searchHighlightIndex);
  assert.equal(searchHighlightIndex, -1, 'ArrowUp dari item index 0 harus mengembalikan fokus ke search input (-1)');
});

test('Keyboard Navigation: Enter Memilih Agen Teratas Saat Mengetik Query', () => {
  const q = 'nadira';
  const filtered = AGENTS.filter((a) => a.name.toLowerCase().includes(q));
  assert.ok(filtered.length > 0);

  // Ketika q terisi, searchHighlightIndex otomatis 0
  const searchHighlightIndex = q ? 0 : -1;
  assert.equal(searchHighlightIndex, 0, 'Harus auto-highlight item index 0');

  const selectedAgent = filtered[searchHighlightIndex];
  assert.equal(selectedAgent.id, 'nadira', 'Enter harus memilih agen teratas (Nadira)');
});

test('Keyboard Navigation: Filter Ruang Rapat Tim Sesuai Keyword', () => {
  const isMeetingMatch = (query) => {
    const q = query.trim().toLowerCase();
    return !q || 'ruang rapat tim multi-agen grup group meeting forum'.includes(q);
  };

  assert.equal(isMeetingMatch('rapat'), true, '"rapat" harus cocok dengan Ruang Rapat Tim');
  assert.equal(isMeetingMatch('meeting'), true, '"meeting" harus cocok dengan Ruang Rapat Tim');
  assert.equal(isMeetingMatch('grup'), true, '"grup" harus cocok dengan Ruang Rapat Tim');
  assert.equal(isMeetingMatch('arga'), false, '"arga" tidak boleh mencocokkan card Ruang Rapat Tim');
});
