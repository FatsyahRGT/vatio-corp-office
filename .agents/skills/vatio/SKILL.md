---
name: vatio
description: Integrasi sistem internal Vatio Corp (Kantor AI). Gunakan untuk menyimpan keputusan sesi (/save), sinkronisasi shared memory (/share-memory), sintesis notulen master (/notulen), atau cek topologi kode Graphify (/topologi).
---

# Vatio Corp: Internal System Shortcuts & Memory Bridge (Antigravity)

Skill ini menghubungkan sesi percakapan Antigravity dengan sistem internal Vatio Corp (Tiered Memory, Topologi Graphify, dan Notulen Master).

---

## 1. Perintah Cepat (Slash Commands)

Pak Fatsyah dapat menjalankan perintah berikut langsung di chat Antigravity:

| Perintah | Deskripsi | Aksi Antigravity |
| :--- | :--- | :--- |
| `/save [teks]` | Menyimpan keputusan aktif ke Sprint Memory & Log Divisi | Append ke `sys-agents/SPRINT_LOG.md` dan log divisi terkait (`tech-logs.md`, `biz-logs.md`, atau `venture-logs.md`). |
| `/share-memory` | Sinkronisasi memori kerja lintas divisi | Baca `sys-agents/SYSTEM_CONTEXT.md` (Tier 1) dan `sys-agents/SPRINT_LOG.md` (Tier 2), lalu tampilkan status sinkronisasi. |
| `/notulen` | Menjalankan sintesis Notulen Pusat | Jalankan `node sys-agents/notulen-master.js` untuk membuat `FINAL_MASTER_DOC.md` & `DOKUMEN_MASTER_INOVASI.md`. |
| `/topologi` | Memeriksa topologi sistem & god nodes | Jalankan `node scripts/sync-context.js` dan laporkan god nodes aktif serta skala dependensi. |
| `/status-memori` | Menampilkan matriks struktur memori | Baca struktur memori 3-tier (Tier 1 Blueprint, Tier 2 Sprint, Tier 3 Cold Archive). |
| `/reset-sessions` | Membersihkan berkas sesi percakapan agen | Jalankan fungsi `clearAllSessions()` dari `sys-agents/session-manager.js`. |

---

## 2. Prosedur Eksekusi Setiap Perintah

### A. Prosedur `/save [teks keputusan]`
1. Ekstrak pesan keputusan dari teks pengguna.
2. Tentukan divisi penanggung jawab:
   - **Tech:** Arga Pratama / Om Danu (arsitektur, topologi, database, refactor, backend) ➡️ catat ke `sys-agents/tech-logs.md`.
   - **Biz:** Arya Sena (inovasi, proses bisnis, unit economics, alur layanan warga) ➡️ catat ke `sys-agents/biz-logs.md`.
   - **Venture:** Nadira Zahrani (pitching, presentasi 3 menit, value proposition) ➡️ catat ke `sys-agents/venture-logs.md`.
3. Buat ID entri unik: `[DEC-YYMMDD-HHMM]`.
4. Tambahkan ke `sys-agents/SPRINT_LOG.md` di antara `<!-- SPRINT_LOG_START -->` dan `<!-- SPRINT_LOG_END -->`.
5. Beri konfirmasi ringkas dan hormat kepada Pak Fatsyah bahwa poin telah terkunci di Single Source of Truth.

### B. Prosedur `/share-memory`
1. Baca berkas `sys-agents/SYSTEM_CONTEXT.md` untuk merangkum indeks arsitektur Tier 1.
2. Baca berkas `sys-agents/SPRINT_LOG.md` untuk merangkum keputusan aktif Tier 2.
3. Laporkan kepada Pak Fatsyah bahwa seluruh 41 agen di 9 divisi telah tersinkronisasi ke memori yang sama.

### C. Prosedur `/notulen`
1. Jalankan `node sys-agents/notulen-master.js`.
2. Periksa apakah `FINAL_MASTER_DOC.md` dan `DOKUMEN_MASTER_INOVASI.md` berhasil diperbarui.
3. Tampilkan cuplikan Matriks Harmonisasi Keputusan Lintas Divisi kepada Pak Fatsyah.

### D. Prosedur `/topologi`
1. Jalankan `node scripts/sync-context.js` untuk merefleksikan perubahan graf terbaru ke `SYSTEM_CONTEXT.md`.
2. Tampilkan daftar top God Nodes dan status siklus dependensi (*circular dependencies*).
