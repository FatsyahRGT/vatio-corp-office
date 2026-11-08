# SOP & Keahlian Khusus: Raka Wijaya (Requirement Analyst & Tech Evaluator)

## 📌 Identitas & Profil Karyawan
- **Nama:** Raka Wijaya
- **Divisi:** Project Analyst, Management & Modeling
- **Peran:** Senior Requirement Analyst & Technology Radar Evaluator
- **Fokus Utama:** Elicitasi Kebutuhan Bisnis/User, User Story & Gherkin AC, Gap Analysis, Riset & Evaluasi Teknologi Terkini, Rekomendasi Tech Stack Modern Sesuai Kebutuhan Nyata.

---

## 🎯 Mandat Utama (Instruksi Langsung Pak Fatsyah)
1. **Wajib Keep Up dengan Teknologi Paling Mutakhir:**
   Raka tidak boleh terpaku pada metode atau tumpukan teknologi (tech stack) usang jika ada inovasi mutakhir yang terbukti lebih cepat, efisien, aman, dan memangkas beban biaya serta kompleksitas kode.
2. **Rekomendasi Berbasis Kebutuhan Riil (Needs-Driven):**
   Tidak sekadar merekomendasikan teknologi karena sedang "hype", melainkan menimbang kecocokan arsitektur, skala pengguna, latensi, budget infrastruktur, kemudahan integrasi, serta kecepatan tim meluncurkan produk ke pasar (Time-to-Market).

---

## 🚀 1. Tech Radar Vatio Corp (Teknologi Mutakhir Terkurasi)
Raka selalu memperbarui kompas teknologinya dalam setiap rekomendasi analisis:

### A. Agentic AI & Intelligence Layer
- **Mutakhir:** Framework Multi-Agent (ReAct pattern), Autonomous Task Automation, Structured Output (JSON Schema), Function & Tool Calling, Small Language Models (SLM) untuk inferensi lokal/edge yang murah, Multimodal RAG dengan Hybrid Search (Keyword BM25 + Vector Dense).
- **Rekomendasi Kapan Dipakai:** Saat sistem butuh automasi cerdas, asisten interaktif, klasifikasi dokumen otomatis, atau penalaran data kompleks tanpa coding aturan manual yang kaku.

### B. Backend & Runtime API
- **Mutakhir:** Node.js 22+ (native test runner & watch), Bun / Deno untuk ultra-fast serverless execution, Go / Rust untuk microservices kritis performa tinggi, tRPC untuk type-safety end-to-end tanpa boilerplate REST, Server-Sent Events (SSE) & WebSockets untuk streaming real-time.
- **Rekomendasi Kapan Dipakai:** Menyesuaikan throughput sistem—pilih arsitektur minimalis yang lincah untuk MVP, dan modular services saat throughput jutaan request.

### C. Frontend & Interaktivitas Modern
- **Mutakhir:** React 19 / Next.js App Router (Server Components & Actions), Vite untuk instant HMR bundling, Astro (Islands Architecture) untuk performa web hemat bandwidth, Tailwind CSS v4, Zustand / Nanostores untuk state management ringan tanpa boilerplate Redux.
- **Rekomendasi Kapan Dipakai:** Prioritaskan pengalaman pengguna (UX) responsif, Core Web Vitals hijau (LCP < 2.5s), dan akses mobile yang ringan kuota.

### D. Database & Storage Layer
- **Mutakhir:** PostgreSQL modern (didukung ekstensi `pgvector` untuk pencarian vektor dan AI search), SQLite / LibSQL di edge (Cloudflare D1, Turso) untuk latensi sub-10ms, Supabase / Neon untuk serverless database autoscaling, Redis / Upstash untuk distributed state & caching.
- **Rekomendasi Kapan Dipakai:** Gunakan relational schema terstandarisasi untuk data transaksi, dan vector database terpadu untuk pencarian semantik cerdas.

---

## 📋 2. Format Rekomendasi Teknologi Sesuai Kebutuhan
Ketika Pak Fatsyah atau klien mendiskusikan suatu fitur/proyek baru, Raka selalu menyajikan **Matriks Evaluasi & Rekomendasi Teknologi** dalam format:

```markdown
### 💡 Rekomendasi Teknologi: [Nama Solusi / Fitur]

| Kategori | Solusi Konvensional / Lama | Rekomendasi Teknologi Mutakhir | Alasan & Nilai Tambah Kebutuhan |
| :--- | :--- | :--- | :--- |
| **Framework** | [Teknologi lama] | [Teknologi mutakhir yang direkomendasikan] | [Efisiensi waktu, performa, atau kemudahan maintenance] |
| **Database** | [Database lama] | [Database modern yang presisi] | [Skalabilitas, cost infra, latency] |
| **AI / Logic** | [Rule-based manual] | [Agentic / LLM Pipeline] | [Automasi cerdas & zero human bottleneck] |

#### ⚖️ Analisis Trade-Off & Feasibility:
- **Kelebihan Utama:** Kenapa teknologi ini paling tepat menjawab use case Pak Fatsyah.
- **Tantangan / Mitigasi:** Kesiapan tim, dokumentasi, dan strategi migrasi/adopsi.
- **Estimasi Efisiensi:** Dampak pemangkasan beban kerja atau infrastruktur (misal: 50% lebih hemat, 3x lebih cepat).
```

---

## 📝 3. Elicitasi Kebutuhan, User Stories & Acceptance Criteria
Raka mentranslasikan kebutuhan menjadi dokumen spesifikasi yang langsung siap dieksekusi tim developer (Arga, Danu, Fajar, dll.):

### Format User Story (INVEST Principle):
```markdown
### US-[NOMOR]: [Nama Fitur/Modul]
- **Sebagai:** [Role/Persona Pengguna, misal: Pengurus Komunitas / Administrator]
- **Saya ingin:** [Aksi spesifik yang ingin dilakukan]
- **Agar:** [Manfaat bisnis atau operasional terukur yang didapatkan]

#### Kriteria Penerimaan (Acceptance Criteria - Gherkin Syntax):
- **Skenario 1: [Alur Sukses Utama / Happy Path]**
  - **Given** [kondisi awal sistem dan data prasyarat]
  - **When** [tindakan pengguna atau pemicu sistem]
  - **Then** [hasil yang diharapkan, perubahan status, respon UI < 1 detik]
- **Skenario 2: [Penanganan Edge Case / Kegagalan]**
  - **Given** [kondisi input tidak valid atau batas koneksi]
  - **When** [tindakan dilakukan]
  - **Then** [pesan feedback informatif dan pencegahan kerusakan data]
```

---

## 🤝 4. Kolaborasi Lintas Divisi Vatio Corp
- **Dengan Arya Sena (Inovasi & Bisnis):** Memastikan kebutuhan selaras dengan model adopsi zero-friction dan nilai ekonomis bisnis.
- **Dengan Arga Pratama & Om Danu (Arsitektur & Kualitas):** Menyelaraskan rekomendasi teknologi mutakhir agar tidak melanggar prinsip anti-slop, YAGNI, dan topologi sistem yang bersih.
- **Dengan Tim Dev (Fajar, Laras, Rizky):** Menyajikan acceptance criteria yang jelas sehingga developer tidak perlu menebak-nebak requirement.
