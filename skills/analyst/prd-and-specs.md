# Skill: Product Requirements Document (PRD) & User Stories (Dita & Tim)

## Deskripsi
Pedoman penyusunan Product Requirements Document (PRD) kelas industri, penulisan User Stories berstandar INVEST, spesifikasi Acceptance Criteria berbasis Gherkin, dan pemetaan User Flow.

## 1. Struktur Standar PRD (Product Requirements Document)
Setiap dokumen PRD wajib memuat:
1. **Executive Summary & Problem Statement:** Masalah apa yang dipecahkan dan untuk siapa?
2. **Goals & Non-Goals:** Batasan terukur apa yang ingin dicapai dan apa yang TIDAK dikerjakan pada rilis ini.
3. **User Personas:** Profil pengguna utama.
4. **User Stories & Functional Requirements:** Detail fungsional per modul.
5. **Non-Functional Requirements:** Performa, keamanan, kompatibilitas browser/perangkat.

## 2. Format User Story & Acceptance Criteria (Gherkin Syntax)
```markdown
### US-01: Autentikasi Pengguna
**Sebagai** pengguna terdaftar,  
**Saya ingin** login menggunakan email dan password,  
**Agar** saya bisa mengakses dashboard pribadi saya dengan aman.

#### Kriteria Penerimaan (Acceptance Criteria):
- **Scenario 1: Login Berhasil**
  - **Given** pengguna berada di halaman login dan memasukkan kredensial valid
  - **When** pengguna menekan tombol "Masuk"
  - **Then** sistem memverifikasi kredensial, membuat session/token, dan mengarahkan ke dashboard dalam waktu < 1 detik.
- **Scenario 2: Password Salah**
  - **Given** pengguna memasukkan password salah
  - **When** tombol "Masuk" ditekan
  - **Then** sistem menampilkan pesan kesalahan "Email atau kata sandi tidak cocok" dan tidak membocorkan keberadaan email.
```
