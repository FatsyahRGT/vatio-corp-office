import test from 'node:test';
import assert from 'node:assert/strict';
import { AGENTS, agentById } from '../shared/roster.js';
import { getSkillForAgent } from '../server/skills.js';
import { buildSystemPrompt, buildMeetingPrompt } from '../server/prompts.js';

test('Skills: Seluruh Agen Memiliki File SOP/Keahlian Khusus', () => {
  AGENTS.forEach((agent) => {
    const skillContent = getSkillForAgent(agent);
    assert.ok(
      typeof skillContent === 'string' && skillContent.length > 50,
      `Skill file untuk ${agent.name} (${agent.id}) tidak boleh kosong atau terlalu pendek (panjang: ${skillContent?.length})`
    );
  });
});

test('Prompts: System Prompt Menyuntikkan Identitas, Konteks, dan Sop Karyawan', () => {
  const danu = agentById('danu');
  const prompt = buildSystemPrompt(danu);

  assert.ok(prompt.includes('Danang "Om Danu" Prasetyo'), 'Harus menyertakan nama karyawan');
  assert.ok(prompt.includes('Core Architecture & Quality'), 'Harus menyertakan nama divisi');
  assert.ok(prompt.includes('Team Leader'), 'Harus menyertakan status leader');
  assert.ok(prompt.includes('Pak Fatsyah'), 'Harus menyertakan panggilan hormat Pak Fatsyah');
  assert.ok(prompt.includes('STANDAR OPERASIONAL & KEAHLIAN KHUSUS'), 'Harus menyertakan SOP skill karyawan');
  assert.ok(prompt.includes('The Ladder of Laziness') || prompt.includes('YAGNI'), 'Harus menyertakan ruh Ponytail');
});

test('Prompts: System Prompt Menyuntikkan SYSTEM_CONTEXT.md & Memori Lintas Divisi', () => {
  const sena = agentById('sena');
  const mockCrossContext = [
    {
      id: 'dita',
      name: 'Dita Anggraini',
      role: 'Lead Analyst · Divisi Project Analyst',
      snippet: 'Pak Fatsyah: Rancang PRD WargaDesk\nDita: Siap, fokus kita adalah aduan warga dan antrean posyandu.',
    },
    {
      id: 'danu',
      name: 'Danang "Om Danu" Prasetyo',
      role: 'Principal Architect · Divisi Core Architecture',
      snippet: 'Pak Fatsyah: Stack-nya apa Danu?\nDanu: Pake Gemini Flash + SQLite, jangan over-engineered.',
    },
  ];

  const prompt = buildSystemPrompt(sena, { crossContext: mockCrossContext });

  // Cek injeksi dokumen jangkar
  assert.ok(prompt.includes('DOKUMEN JANGKAR SISTEM (SYSTEM_CONTEXT.MD)'), 'Harus menyertakan heading dokumen jangkar');
  assert.ok(prompt.includes('Kantor AI (Virtual 3D Office Agent)'), 'Harus memuat konten SYSTEM_CONTEXT.md');

  // Cek injeksi memori percakapan lintas divisi
  assert.ok(prompt.includes('MEMORI PERCAKAPAN LINTAS DIVISI TERAKHIR (SHARED OFFICE MEMORY)'), 'Harus menyertakan heading memori lintas divisi');
  assert.ok(prompt.includes('Dita Anggraini'), 'Harus memuat riwayat sesi Dita');
  assert.ok(prompt.includes('Danang "Om Danu" Prasetyo'), 'Harus memuat riwayat sesi Danu');
  assert.ok(prompt.includes('JANGAN meminta Pak Fatsyah mengulang penjelasan'), 'Harus menyertakan instruksi memori cerdas');
});

test('Prompts: Meeting Prompt Menyertakan Anggota Hadir & Konteks Rapat', () => {
  const danu = agentById('danu');
  const sena = agentById('sena');
  const nadira = agentById('nadira');

  const participants = [danu, sena, nadira];
  const meetingPrompt = buildMeetingPrompt(sena, participants);

  assert.ok(meetingPrompt.includes('RUANG RAPAT TIM BERSAMA (GROUP MEETING)'), 'Harus menyertakan konteks ruang rapat');
  assert.ok(meetingPrompt.includes('Danang "Om Danu" Prasetyo'), 'Harus menyertakan rekan rapat Om Danu');
  assert.ok(meetingPrompt.includes('Nadira Zahrani'), 'Harus menyertakan rekan rapat Nadira');
  assert.ok(meetingPrompt.includes('DOKUMEN JANGKAR SISTEM (SYSTEM_CONTEXT.MD)'), 'Meeting prompt harus tetap memuat SYSTEM_CONTEXT.md');
});
