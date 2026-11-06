# Kantor AI (Virtual 3D Office Agent)

**Kantor AI** adalah aplikasi web kantor virtual 3D isometrik interaktif berbasis Three.js yang menghadirkan tim agen AI untuk digital agency / software house lokal. Anda dapat menjelajahi kantor, memilih karyawan sesuai divisinya, berkonsultasi secara real-time melalui chat interaktif (SSE streaming), dan memanfaatkan fitur **delegasi tim** di mana divisi lead akan membagi pekerjaan ke anggota timnya secara otomatis.

---

## 🏢 Daftar Divisi & Karakter

Setiap divisi memiliki ruangan tersendiri di dalam kantor virtual 3D lengkap dengan **Team Lead** dan spesialis teknisnya:

| Divisi | Lead | Anggota & Keahlian |
| :--- | :--- | :--- |
| **Laravel** | **Bayu Firmansyah** (Lead Architect & Code Review) | • **Citra Lestari** (Backend, REST API, Sanctum)<br>• **Arief Setiawan** (Database, Queue, Migrasi)<br>• **Siti Nurhaliza** (Livewire, Blade, Filament) |
| **Project Analyst** | **Dita Anggraini** (Lead Analyst & Scope) | • **Gilang Ramadhan** (Activity Diagram, Swimlane, Mermaid)<br>• **Fauzan Alamsyah** (DFD Level 0-2, Kamus Data, P-Spec)<br>• **Lestari Handayani** (ERD Crow's Foot/Chen, Normalisasi 1NF-3NF)<br>• **Viona Maharani** (Agentic AI, Prompt Engineering, Tool Schemas)<br>• **Raka Wijaya** (User Story, Acceptance Criteria)<br>• **Nadia Safitri** (UX, User Flow, Wireframe) |
| **JavaScript Web** | **Fajar Nugroho** (Lead Frontend Architect) | • **Laras Ayuningtyas** (React, Next.js)<br>• **Andi Kurniawan** (Vue 3, Nuxt, Pinia)<br>• **Maya Anggraini** (Node.js, Express, NestJS) |
| **Mobile Apps** | **Hendra Gunawan** (Lead Mobile Architect) | • **Dewi Kartika** (Flutter UI, Widget, Animasi)<br>• **Yoga Pratama** (Riverpod, Bloc, State & Data)<br>• **Putri Maharani** (QA, Testing, Build APK/IPA) |
| **Bisnis & Data** | **Rizky Ramadhan** (Lead Business Analyst) | • **Kirana Dewanti** (Data Analyst, SQL, Dashboard)<br>• **Eko Saputra** (Data Engineer, ETL Pipeline)<br>• **Melati Handayani** (Market & Competitor Research) |
| **Notulen & Dokumen** | **Bagas Pratama** (Notulen Lead & Orchestrator) | • **Dian Kusuma** (Word / Docx & Laporan Resmi)<br>• **Ferry Hidayat** (Excel / CSV & Estimasi Biaya/Timeline)<br>• **Rina Amalia** (PDF Formatting & Presentasi Eksekutif) |
| **Akademisi & Riset** | **Prof. Bambang Sudiro, Ph.D.** (Dosen Pembimbing Utama) | • **Dr. Ira Kusumawati, M.Kom.** (Kaprodi: Kelayakan Judul & Sidang)<br>• **Anindya Putri, M.A.** (Editor Jurnal, Sitasi APA/IEEE & Anti-Plagiasi)<br>• **Dimas Wicaksono, M.Stat.** (Penulisan Akademik PUEBI & Olah Data Statistik) |

---

## ✨ Fitur Unggulan

1. **Kantor Isometrik 3D Prosedural**  
   Dibuat dengan Three.js tanpa asset 3D eksternal yang berat—seluruh meja, kursi, laptop, dispenser kopi, dan karakter dimodelkan secara prosedural dan ringan.
2. **Streaming AI Chat (SSE)**  
   Respon agen ditampilkan secara real-time kata-demi-kata via Server-Sent Events dengan kapasitas token panjang (8.000 tokens) sehingga penjelasan kode dan analisis tidak terpotong.
3. **Mode Tampilan Penuh ala WhatsApp Web**  
   Tombol perbesar layar di pojok kanan atas chat mengubah antarmuka menjadi mode layar lebar ala WhatsApp Web lengkap dengan sidebar daftar anggota, pencarian karakter, dan badge keahlian.
4. **Lampiran File & Gambar (Unggah Pengguna)**  
   Pengguna dapat mengunggah gambar (dengan thumbnail pratinjau instan) atau file teks/kode/dokumen untuk dianalisis bersama agen.
5. **Multi-Format Export & Generator File (Asisten AI)**  
   Setiap pesan asisten dilengkapi tombol *one-click download*:
   - 📦 **ZIP**: Mengekstrak seluruh blok kode dalam pesan menjadi file `.zip` lengkap dengan direktori path file dan dokumentasi proyek `CATATAN-PROYEK.md`.
   - 📽️ **PPT**: Mengubah dokumen/notulen menjadi slide presentasi HTML interaktif yang siap diproyeksikan (navigasi keyboard panah & spasi).
   - 📄 **Word**: Mengunduh dokumen `.doc` yang rapi dan kompatibel dengan Microsoft Word / Google Docs.
   - 📊 **Excel**: Mengonversi tabel Markdown secara instan menjadi format spreadsheet `.csv` (dengan UTF-8 BOM).
   - 📑 **PDF**: Membuka tampilan cetak bersih untuk disimpan sebagai PDF.
6. **Delegasi Tugas Tim (`/tim`)**  
   Ketik perintah `/tim` atau kata kunci seperti *"delegasikan ke tim"* saat berbicara dengan Team Lead. Leader akan menyusun rencana pembagian tugas, menugaskan anggota yang relevan, dan merangkum hasil kerja tim untuk Anda.
7. **Divisi Akademisi Khusus Skripsi**  
   Divisi pendamping skripsi yang siap memandu Anda dari evaluasi judul oleh Kaprodi, bimbingan Bab 1-5 oleh Dosen Pembimbing, penelusuran referensi Scopus/SINTA oleh Editor Literatur, hingga analisis data statistik oleh Olah Data.
8. **Proteksi & Pengaman Biaya**  
   Dilengkapi kode akses pengunjung (`ACCESS_CODE`), in-memory rate limiting per IP, serta batas kuota permintaan harian (`DAILY_MAX_REQUESTS`).
9. **Reset Sesi Cepat & Global**  
   Tersedia tombol reset obrolan per karyawan dan tombol *Reset Sesi Semua Divisi* (ikon tempat sampah di panel head dan tombol merah di sidebar WhatsApp Web) untuk membersihkan riwayat semua divisi secara instan ketika ingin membahas proyek berbeda.
10. **Rich Markdown & Tabel Responsif**  
    Mendukung perenderan tabel Markdown bergaris rapi dengan alignment semantik, multiline break `<br>`, kutipan *blockquote*, serta blok kode ber-syntax highlight.

---

## 📋 Prasyarat Sistem

- **Node.js**: Versi `20.x` atau lebih baru
- **Package Manager**: `npm` (atau `pnpm` / `yarn`)
- **API Key**: [Google AI Studio](https://aistudio.google.com/) (Gemini) atau [OpenRouter](https://openrouter.ai/) *(opsional untuk pengujian awal)*

---

## 🚀 Panduan Instalasi & Menjalankan

### 1. Clone Repositori
```bash
git clone https://github.com/FatsyahRGT/vatio-corp-office.git
cd vatio-corp-office
```

### 2. Pasang Dependensi
Buka terminal di root direktori proyek, lalu jalankan:
```bash
npm install
```

### 3. Konfigurasi Lingkungan (`.env`)
> [!IMPORTANT]
> File `.env` yang berisi API key atau kredensial pribadi **tidak disertakan di repositori (sudah di-ignore oleh `.gitignore`)** demi keamanan.
> Template dump/contoh konfigurasi sudah disediakan pada file `env.example` (atau `.env example`).
> **Anda wajib menyalin file template tersebut menjadi `.env` sebelum menjalankan aplikasi.**

Salin file template menjadi `.env`:
```bash
# Windows PowerShell:
Copy-Item env.example .env

# Windows CMD:
copy env.example .env

# Linux / macOS:
cp env.example .env
```

Buka file `.env` baru tersebut, lalu isi kredensial provider AI Anda:

#### Opsi A: Menggunakan 9Router (AI Gateway / Smart Fallback)
```env
NINEROUTER_API_KEY=api_key_gateway_9router
NINEROUTER_BASE_URL=http://localhost:20128/v1
MODEL_LEADER=9router:nama-combo-anda
MODEL_TEAM=9router:nama-combo-anda
```

#### Opsi B: Menggunakan OpenRouter
```env
OPENROUTER_API_KEY=sk-or-v1-...
MODEL_LEADER=openrouter:anthropic/claude-3.5-sonnet
MODEL_TEAM=openrouter:anthropic/claude-3.5-haiku
```

#### Opsi C: Menggunakan Google Gemini
```env
GOOGLE_API_KEY=AIzaSy...
MODEL_LEADER=gemini:gemini-2.0-flash-exp
MODEL_TEAM=gemini:gemini-2.0-flash-exp
```

*(Opsional)* Jika ingin mengaktifkan proteksi kode akses:
```env
ACCESS_CODE=rahasia123
```

### 3. Menjalankan di Mode Development
Jalankan backend API dan frontend Vite secara bersamaan:
```bash
npm run dev
```

- **Frontend (Vite UI)**: `http://localhost:5173`
- **Backend API (Express)**: `http://localhost:3001`

Buka browser di `http://localhost:5173` untuk mulai menjelajahi kantor.

---

## 🎮 Cara Penggunaan

1. **Navigasi 3D**:
   - **Klik Kiri + Geser**: Memutar sudut pandang kamera (orbit).
   - **Scroll Mouse**: Zoom in / zoom out.
   - **Klik Kanan + Geser**: Menggeser posisi pandangan (pan).
2. **Pilih Karyawan**:
   - Klik karakter atau kursi kerja di dalam scene 3D, atau pilih langsung melalui tab divisi dan chip nama karyawan di bagian atas layar.
3. **Mengirim Pesan**:
   - Klik quick prompt chips yang tersedia untuk pertanyaan siap pakai, atau ketik pertanyaan langsung di kolom input chat.
4. **Menggunakan Fitur Delegasi (`/tim`)**:
   - Buka chat dengan salah satu Team Lead (contoh: **Bayu Firmansyah** dari tim Laravel atau **Dita Anggraini** dari tim Analyst).
   - Tambahkan prefix `/tim` di pesan Anda, misalnya:
     ```text
     /tim tolong buatkan fitur autentikasi dengan Sanctum dan dashboard Filament
     ```
   - Lead akan memecah tugas tersebut ke Citra dan Siti, lalu menyatukan jawaban akhirnya untuk Anda.

---

## 🛠️ Script Tersedia

- `npm run dev` : Menjalankan backend (node watch) dan frontend (vite) secara paralel.
- `npm run dev:api` : Menjalankan server backend saja.
- `npm run dev:web` : Menjalankan development server Vite saja.
- `npm run build` : Melakukan build asset frontend ke folder `dist/`.
- `npm start` : Menjalankan server Express di mode produksi (otomatis menyajikan file dari `dist/`).

---

## 🛑 Cara Menghentikan / Mematikan Sistem

### 1. Cara Normal (Melalui Terminal Aktif)
Pada jendela terminal tempat Anda menjalankan `npm run dev`:
- Tekan **`Ctrl + C`**.
- Jika muncul pertanyaan `Terminate batch job (Y/N)?`, ketik **`Y`** lalu tekan **Enter**.

### 2. Cara Mengatasi Port Masih Nyangkut (*Zombie Process*)
Jika terminal sudah ditutup namun server masih terasa berjalan atau port `3001` / `5173` terkunci:

#### Di Windows (PowerShell):
```powershell
# Opsi Cepat: Matikan semua proses node yang masih menggantung
Stop-Process -Name node -Force

# Opsi Spesifik: Cek PID port 3001 lalu matikan sesuai PID-nya
Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | Select-Object LocalPort, OwningProcess
Stop-Process -Id <Nomor_PID> -Force
```

#### Di Linux / macOS:
```bash
# Matikan proses yang menggunakan port 3001 dan 5173
npx kill-port 3001 5173

# Atau menggunakan fuser / lsof
lsof -ti:3001 | xargs kill -9
```

---

## 📂 Struktur Direktori

```text
kantor-ai-agent-local/
├── skills/               # Playbook & Dokumen Standar Spesialisasi (.md)
│   ├── notulen/          # Skill notulensi, format Word, Excel RAB, & PDF
│   ├── academic/         # Skill dosen pembimbing, kaprodi, sitasi, olah data
│   ├── laravel/          # Skill Clean Architecture & query N+1
│   ├── analyst/          # Skill PRD & user stories Gherkin
│   ├── javascript/       # Skill Next.js / Vue 3 / state management
│   ├── mobile/           # Skill Flutter feature-first & Riverpod
│   └── bizdata/          # Skill Lean Canvas, metrik KPI, & data pipeline
├── server/               # Backend Express.js
│   ├── index.js          # Entry point server, SSE route, rate limiter & auth
│   ├── ninerouter.js     # Adapter streaming 9Router (OpenAI-compatible)
│   ├── skills.js         # Loader injeksi playbook skills ke LLM
│   ├── delegate.js       # Logika delegasi sub-task oleh Team Lead
│   └── prompts.js        # Persona dan system prompt masing-masing agen
├── shared/
│   └── roster.js         # Master data divisi, agen, visual look & quick prompts
├── src/                  # Frontend Three.js & UI
│   ├── main.js           # Inisialisasi visualizer & event listener
│   ├── stage.js          # Three.js Scene, Camera, Light, dan Controls
│   ├── office.js         # Tata letak ruangan divisi & lantai
│   ├── furniture.js      # Model 3D meja, kursi, tanaman, komputer, dll.
│   ├── character.js      # Model karakter 3D (kulit, pakaian, jilbab/rambut)
│   ├── panel.js          # Dialog chat overlay, history, & input
│   ├── chat.js           # Klien HTTP SSE handler
│   ├── md.js             # Parser markdown ringan untuk rendering pesan
│   └── style.css         # Styling CSS UI overlay
├── env.example           # Contoh konfigurasi environment variables
├── package.json          # Konfigurasi dependensi dan scripts npm
└── vite.config.js        # Konfigurasi bundling Vite & proxy API
```
