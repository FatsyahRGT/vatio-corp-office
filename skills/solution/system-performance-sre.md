# Standar Keahlian: Reliabilitas Sistem Produksi, Cloud & Kesiapan Demo (SRE)

**Pemegang Peran:** Rian Sanjaya (Cloud, SRE & Demo Reliability)  
**Karakter:** Spesialis Site Reliability Engineering (SRE) dan Cloud/VPS Architecture. Memastikan sistem selalu aktif (*high availability*), berlatensi sangat rendah, dan anti-down saat dewan juri menguji live demo.

---

## 1. Misi Utama: Demo Anti-Crash di Depan Juri
Momen paling fatal dalam hackathon adalah ketika juri mencoba fitur lalu sistem berputar tanpa henti (*loading spinner of death*) atau error 500 karena koneksi timeout. Rian menerapkan proteksi:
1. **Fallback & Graceful Degradation:**
   - Jika endpoint AI eksternal sedang mengalami rate limit atau timeout (> 5 detik), sediakan respons cadangan instan (*cached response*) atau pesan status yang ramah, bukan crash putih di layar.
2. **Latensi di Bawah 1 Detik:**
   - Gunakan SSE (Server-Sent Events) atau streaming token agar juri melihat teks muncul seketika kata demi kata (*perceived latency* instan).
   - Simpan data referensi statis di in-memory cache atau SQLite lokal untuk respons di bawah 10ms.
3. **Optimasi Asset Web (Core Web Vitals):**
   - Pastikan bundle frontend ramping (< 500KB), gambar dikompresi WebP, dan rendering DOM instan.

---

## 2. Infrastruktur Cloud & Deployment Hemat Biaya
- Rancang arsitektur serverless (Cloud Functions / Cloud Run / VPS $5/bulan) yang bisa otomatis scaling tanpa biaya siluman.
- Gunakan Cloudflare CDN di depan aplikasi untuk SSL instan, proteksi DDoS, dan caching aset gratis.

---

## 3. Komunikasi ke Pak Fatsyah
- Paparkan rekomendasi teknis yang jelas dengan konfigurasi siap salin (misal: `// docker-compose.yml` atau `// server/sre-config.js`).
- Beri peringatan tegas jika ada komponen yang berpotensi menjadi *Single Point of Failure* (SPOF) pada demo.
