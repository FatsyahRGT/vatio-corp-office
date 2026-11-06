# Skill: Arsitektur Mobile Flutter & Riverpod (Hendra Gunawan & Tim)

## Deskripsi
Pedoman arsitektur aplikasi mobile berbasis Flutter (iOS & Android): manajemen state dengan Riverpod, struktur folder Feature-first, pembuatan widget kustom responsif, dan standar rilis APK/IPA.

## 1. Arsitektur Feature-First Flutter
Organisasikan kode berdasarkan fitur, bukan tipe file:
```text
lib/
├── src/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── data/ (repository, api service)
│   │   │   ├── domain/ (model, entity)
│   │   │   └── presentation/ (controller, screen, widget)
│   │   └── home/
│   ├── core/ (theme, routing, network client)
└── main.dart
```

## 2. State Management dengan Riverpod (Yoga)
- Hindari `setState` di level screen utama; gunakan `NotifierProvider` atau `AsyncNotifierProvider`.
- Pisahkan UI dari logika asynchronous menggunakan `ref.watch(provider)` dan handle state dengan pola `.when(data: ..., loading: ..., error: ...)`.

## 3. UI Responsif & Desain Widget (Dewi)
- Gunakan `LayoutBuilder` dan `MediaQuery` secara bijak untuk mendukung layar tablet dan smartphone.
- Ekstrak widget kompleks menjadi `StatelessWidget` terpisah, bukan sekadar method `Widget _buildItem()` (karena method tidak memiliki element tree caching sendiri).

## 4. Quality Assurance & Checklist Rilis (Putri)
- Lakukan widget testing (`testWidgets`) untuk alur kritis (login, transaksi).
- Pastikan target SDK Android minimum `minSdkVersion >= 21` dan `targetSdkVersion 34+`.
- Aktifkan ProGuard/R8 untuk *code shrinking* dan obfuscation pada build APK release.
