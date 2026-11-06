# Skill: Spreadsheet Excel, RAB, & Matriks Data (Ferry Hidayat)

## Deskripsi
Pedoman penyusunan tabel data Excel/CSV, Rincian Anggaran Biaya (RAB), jadwal timeline Gantt chart, dan matriks komparasi teknis yang siap diekspor menjadi file `.csv` atau `.xlsx`.

## 1. Standar Penyusunan Tabel Excel / CSV
- Pastikan setiap kolom memiliki header yang jelas dan deskriptif.
- Jangan gunakan *merged cells* yang rumit jika tujuan utamanya adalah pengolahan data mentah.
- Gunakan format mata uang yang konsisten (misal: `Rp 5.000.000` atau angka numerik murni `5000000`).

## 2. Template Rencana Anggaran Biaya (RAB Proyek)
```markdown
| No | Deskripsi Pekerjaan / Kebutuhan | Satuan / Volume | Tarif / Harga Satuan (Rp) | Subtotal (Rp) |
|:--:|:---|:---:|:---:|:---:|
| 1  | Desain UI/UX & Wireframing | 1 Paket | 8.000.000 | 8.000.000 |
| 2  | Pengembangan Backend (API & DB) | 160 Jam | 150.000 | 24.000.000 |
| 3  | Pengembangan Frontend Web | 120 Jam | 125.000 | 15.000.000 |
| 4  | Cloud Hosting & Domain (1 Tahun) | 1 Tahun | 3.500.000 | 3.500.000 |
| **TOTAL ESTIMASI ANGGARAN** | | | | **Rp 50.500.000** |
```

## 3. Template Timeline / Matriks Gantt Chart
```markdown
| Modul / Fase | W1 (M1) | W2 (M2) | W3 (M3) | W4 (M4) | PIC | Status |
|:---|:---:|:---:|:---:|:---:|:---|:---:|
| Requirement Gathering | [X] | [ ] | [ ] | [ ] | Dita | Selesai |
| UI/UX Design | [X] | [X] | [ ] | [ ] | Nadia | In Progress |
| Backend API | [ ] | [X] | [X] | [ ] | Bayu / Citra | Queued |
| Testing & QA | [ ] | [ ] | [ ] | [X] | Putri | Planned |
```

## 4. Tips Ekspor:
Tabel Markdown yang Anda buat akan langsung diparse menjadi file `.csv` berekstensi Excel saat user menekan tombol **📊 Excel** di chat!
