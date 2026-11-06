# Skill: Data Flow Diagram (DFD) & Kamus Data (Fauzan Alamsyah)

## Deskripsi
Keahlian khusus dalam memodelkan transformasi data fungsional sistem menggunakan **Data Flow Diagram (DFD)** standar Gane-Sarson & Yourdon-DeMarco, dekomposisi hierarki bertingkat (Context Diagram Level 0, DFD Level 1, DFD Level 2), dan penyusunan **Kamus Data (Data Dictionary)** formal.

## 1. Aturan Baku & Validasi Konsistensi DFD
- **Black Hole**: Proses yang hanya menerima masukan (*data flow in*) tanpa menghasilkan luaran (*data flow out*) -> **DILARANG**.
- **Miracle**: Proses yang tiba-tiba menghasilkan luaran tanpa masukan apa pun -> **DILARANG**.
- **Gray Hole**: Masukan yang masuk tidak mencukupi untuk menghasilkan luaran yang dijanjikan -> **DILARANG**.
- **Data Flow Antar Data Store**: Data Store ke Data Store langsung tanpa perantara Proses -> **DILARANG**.
- **Data Flow Antar Terminator**: Entitas Luar ke Entitas Luar langsung tanpa lewat sistem -> **DILARANG**.
- **Balancing Rule**: Input/output pada DFD Level N wajib sama persis dengan input/output proses induk di Level N-1.

## 2. Struktur Dekomposisi DFD
1. **Context Diagram (Level 0)**:
   - Satu lingkaran/proses sentral (Sistem Informasi Utama, Process 0.0).
   - Menghubungkan seluruh Terminator (Entitas Luar: User, Admin, Bank API, dll.) dan aliran data utama.
2. **DFD Level 1**:
   - Dekomposisi sistem menjadi proses-proses sub-sistem utama (contoh: 1.0 Manajemen Akun, 2.0 Manajemen Transaksi, 3.0 Pelaporan).
   - Pengenalan Data Store (D1, D2, D3).
3. **DFD Level 2**:
   - Rincian proses atomik dari salah satu proses Level 1 yang kompleks (contoh: 2.1 Validasi Keranjang, 2.2 Hitung Ongkir, 2.3 Buat Invoice).

## 3. Format Standar Kamus Data (Data Dictionary)
Sajikan dalam tabel Markdown yang rapi:
| Nama Data Flow | Arus Data (Dari -> Ke) | Struktur Data / Elemen | Keterangan & Format |
| :--- | :--- | :--- | :--- |
| `Data_Pendaftaran` | User -> P1.0 Registrasi | `nama` + `email` + `password` + `no_hp` | Form pendaftaran akun baru |
| `Detail_Pesanan` | P2.0 -> D2 Tabel_Order | `order_id` + `user_id` + `total_harga` + `status` | Record order berstatus *pending* |
| `Token_Transaksi` | Payment Gateway -> P2.0 | `trans_id` + `token` + `expired_at` | Token otentikasi pembayaran |
