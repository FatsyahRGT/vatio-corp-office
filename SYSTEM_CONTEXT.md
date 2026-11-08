# Vatio Corp: System Context Master

Dokumen ini adalah **Single Source of Truth (Dokumen Jangkar)** yang dibaca oleh seluruh agen AI di Kantor AI (lintas divisi). Segala keputusan arsitektur, fokus sprint, batasan sistem, dan analisis topologi kode berpusat di sini.

---

## 1. Project Overview & Active Mission
- **Nama Sistem:** Kantor AI (Virtual 3D Office Agent)
- **Misi Aktif:** Persiapan Solusi Hackathon GDG di ITB (Case 2: Stronger Communities and Everyday Services)
- **Problem Statement Utama:** Menghubungkan kebutuhan operasional komunitas lokal & organisasi kecil (aduan warga, antrean layanan, inventaris manual, jadwal relawan) dengan otomatisasi proses berbasis Google AI & Cloud tanpa hambatan adopsi (*zero-friction adoption*).
- **Tech Stack:**
  - **Frontend:** Pure Three.js (prosedural 3D), Vanilla JavaScript, Vite, SSE Stream Reader.
  - **Backend:** Node.js (ESM), Express.js, Server-Sent Events (SSE), 9Router Gateway / Google Gemini API.
  - **Data & Shared Models:** In-memory rate limiting, localStorage persistent state, zero external DB dependencies for core demo.

---

## 2. Graphify Analysis Summary
*(Bagian ini otomatis diperbarui oleh Graphify Sync pada 2026-11-08)*
- **Date Last Scan:** 2026-11-08
- **Topology Scale:** 245 nodes · 513 edges · 8 communities
- **God Nodes (Pusat Beban Sistem):**
  1. `createPanel()` - 40 edges
  2. `box()` - 34 edges
  3. `submit()` - 19 edges
  4. `divisionById()` - 17 edges
  5. `agentById()` - 15 edges
- **Circular Dependencies:** None detected.


## 3. Active Development Focus & Decisions
- **Fokus Sprint:**
  1. Mengintegrasikan Kurva Proses Bisnis Komunitas dengan Teknologi AI Google (Dipimpin oleh Arya Sena).
  2. Memastikan kesiapan demo 3 menit dan pertahanan tanya jawab dewan juri GDG ITB (Dipimpin oleh Nadira Zahrani).
  3. Menjaga arsitektur kode tetap minimalis, anti-overengineering, dan berbasis fungsi standar bawaan/stdlib (Dipimpin oleh Danang "Om Danu" Prasetyo).
  4. Menghubungkan memori percakapan lintas divisi agar seluruh agen saling terkoordinasi.

---

## 4. Constraints & Architectural Rules
1. **Zero Unnecessary Dependencies:** Dilarang menginstal library berat jika bisa diselesaikan dengan 10–20 baris kode standar atau API bawaan (Prinsip Ponytail).
2. **Structured Outputs First:** Ekstraksi data wajib menggunakan skema JSON terstruktur (*responseSchema*) dan sanitasi data pribadi (PII masking) sebelum inferensi publik.
3. **Streaming First:** Semua interaksi chat wajib berlatensi rendah (< 1.5 detik) menggunakan SSE streaming kata demi kata.
4. **Panggilan Pengguna:** Seluruh agen wajib menyapa pengguna secara konsisten dan terhormat sebagai **Pak Fatsyah**.
