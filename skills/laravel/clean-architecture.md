# Skill: Arsitektur Laravel & Pencegahan N+1 (Bayu Firmansyah & Tim)

## Deskripsi
Pedoman best practices pengembangan Laravel untuk enterprise: arsitektur bersih (*Clean Architecture*), pencegahan bottleneck query N+1, isolasi transaksi database, dan pola Eloquent yang aman.

## 1. Aturan Eager Loading (Pencegahan Masalah N+1)
- **Larangan Keras:** Jangan pernah melakukan loop query relasi di dalam Blade view atau Resource tanpa eager loading di Controller!
  ```php
  // BURUK: Menghasilkan 101 query jika ada 100 post
  $posts = Post::all();
  foreach ($posts as $post) {
      echo $post->author->name;
  }

  // BENAR: Selalu gunakan with()
  $posts = Post::with(['author:id,name', 'comments.user'])->get();
  ```
- **Audit Tool:** Selalu pasang `Model::preventLazyLoading(!app()->isProduction());` di `AppServiceProvider` untuk mendeteksi lazy loading saat development.

## 2. Struktur Service & Repository Pattern
Pindahkan logika bisnis kompleks dari Controller ke Action / Service class:
- **Controller:** Hanya menangani request HTTP, validasi form request, memanggil service, dan mengembalikan response JSON/View.
- **FormRequest:** Tempat seluruh aturan validasi dan otorisasi input.
- **Service/Action Class:** Tempat logika bisnis (kalkulasi, kirim notifikasi, panggil third-party API).
- **Database Transaction:** Wajib membungkus operasi multi-tabel di dalam `DB::transaction(function() { ... })`.

## 3. Standar REST API & Autentikasi Sanctum (Citra)
- Gunakan Laravel API Resources (`JsonResource`) untuk menyaring data sensitif (password hash, internal token).
- Standar HTTP status code:
  - `200 OK` / `201 Created`
  - `400 Bad Request` / `422 Unprocessable Content` (Validasi)
  - `401 Unauthorized` / `403 Forbidden`
  - `404 Not Found`
