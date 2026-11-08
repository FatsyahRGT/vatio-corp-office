import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILLS_DIR = resolve(__dirname, '../skills');

// Peta agent ID / divisi ke file skill .md
const AGENT_SKILL_MAP = {
  // Notulen
  bagas: 'notulen/orchestration-and-minutes.md',
  dian: 'notulen/word-formatting.md',
  ferry: 'notulen/excel-spreadsheets.md',
  rina: 'notulen/pdf-presentation.md',
  // Akademisi
  bambang: 'academic/dosen-pembimbing.md',
  ira: 'academic/kaprodi-approval.md',
  anindya: 'academic/jurnal-sitasi.md',
  dimas: 'academic/metodologi-olahdata.md',
  // Project Analyst, Management & Modeling
  radit: 'analyst/project-manager.md',
  clara: 'analyst/use-case-diagram.md',
  gilang: 'analyst/activity-diagram.md',
  fauzan: 'analyst/dfd-process.md',
  tari: 'analyst/erd-database.md',
  viona: 'analyst/prompt-agentic-ai.md',
  // Divisi lain
  laravel: 'laravel/clean-architecture.md',
  analyst: 'analyst/prd-and-specs.md',
  js: 'javascript/frontend-architecture.md',
  mobile: 'mobile/flutter-architecture.md',
  bizdata: 'bizdata/business-and-data.md',
  // Core Architecture & Code Quality
  danu: 'core/ponytail-minimalist.md',
  aditya: 'core/code-slop-detector.md',
  farhan: 'core/database-performance.md',
  saras: 'core/clean-code-and-debt.md',
  core: 'core/ponytail-minimalist.md',
  // Divisi Inovasi & Problem Solving
  sena: 'solution/business-tech-convergence.md',
  nadira: 'solution/venture-strategy-pitch.md',
  rian: 'solution/system-performance-sre.md',
  arga: 'solution/code-topology-graphify.md',
  solution: 'solution/business-tech-convergence.md',
};

const cache = new Map();

export function getSkillForAgent(agent) {
  const fileRel = AGENT_SKILL_MAP[agent.id] || AGENT_SKILL_MAP[agent.division];
  if (!fileRel) return '';

  if (cache.has(fileRel)) return cache.get(fileRel);

  const fullPath = resolve(SKILLS_DIR, fileRel);
  if (existsSync(fullPath)) {
    try {
      const content = readFileSync(fullPath, 'utf-8');
      cache.set(fileRel, content);
      return content;
    } catch {
      return '';
    }
  }
  return '';
}
