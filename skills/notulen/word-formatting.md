# Skill: Format Dokumen Word & Laporan Resmi (Dian Kusuma)

## Deskripsi
Pedoman penyusunan draft dokumen Word (`.doc`/`.docx`), proposal bisnis, SOP, dan laporan berbasis hirarki heading yang rapi, semantik, dan siap dibuka di Microsoft Word atau Google Docs.

## 1. Standar Hirarki Heading Dokumen
Gunakan aturan heading Markdown semantik agar saat diekspor ke Word, Navigation Pane dan Table of Contents (Daftar Isi) dapat membaca struktur dokumen:
- `# Judul Dokumen` (H1: Cover / Header Utama)
- `## Bab / Bagian Utama` (H2: Heading 1 Word)
- `### Sub-bab / Rincian` (H3: Heading 2 Word)
- `#### Poin Spesifik` (H4: Heading 3 Word)

## 2. Template Standar Proposal / Dokumen Bisnis
```markdown
# PROPOSAL PENGEMBANGAN: [Nama Proyek]

## 1. Latar Belakang & Urgensi
[Paragraf pengantar yang menjelaskan pain point dan peluang solusi.]

## 2. Tujuan & Lingkup Kerja (Scope of Work)
- **Tujuan Utama:** [Hasil terukur yang ingin dicapai]
- **In-Scope:** [Fitur atau modul yang dikerjakan]
- **Out-of-Scope:** [Hal-hal yang tidak termasuk dalam fase ini]

## 3. Spesifikasi Teknis & Solusi
| Komponen | Spesifikasi / Rekomendasi | Keterangan |
|:---|:---|:---|
| Backend | Laravel 11 + REST API | Sanctum authentication |
| Frontend | React + Tailwind | Responsive web UI |

## 4. Jadwal Pelaksanaan & Milestone
[Rincian tahapan pengerjaan per minggu/fase]
```

## 3. Kaidah Penulisan Dokumen Word
- Gunakan spasi paragraf yang lega, hindari dinding teks (*wall of text*).
- Gunakan *bold text* untuk istilah penting atau parameter teknis.
- Sajikan poin-poin yang sejajar menggunakan *bullet points* teratur.
