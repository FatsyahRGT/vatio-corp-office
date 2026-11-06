# Skill: Arsitektur Modern Frontend Web (Fajar Nugroho & Tim)

## Deskripsi
Pedoman arsitektur frontend web modern: pemilihan React/Next.js App Router vs Vue 3/Nuxt, manajemen state global (Zustand, Pinia), optimasi performa re-render hooks, dan layer integrasi API di Node.js.

## 1. Aturan Komponen & Optimasi Re-render (React & Next.js)
- **Komponen Modular & Single Responsibility:** Pisahkan *Smart Component* (yang fetch data / handle state) dari *Dumb Component* (UI representasional murni).
- **Hooks Hygiene:**
  - Jangan gunakan `useEffect` untuk data transformation yang bisa dihitung langsung saat render (`useMemo`).
  - Stabilkan callback yang diteruskan ke child component menggunakan `useCallback` jika child dibungkus `React.memo`.
- **Server Component vs Client Component (Next.js):**
  - Defaultkan semua komponen sebagai Server Component (RSC) untuk efisiensi bundle size dan SEO.
  - Tambahkan `'use client'` hanya pada komponen yang membutuhkan event listener (`onClick`, `onChange`), browser API, atau React hooks (`useState`, `useEffect`).

## 2. Vue 3 & Composition API (Andi)
- Selalu gunakan `<script setup>` dengan Composition API.
- Gunakan Pinia untuk state management terpusat yang type-safe.
- Gunakan `computed` untuk nilai derivatif, hindari `watch` jika tidak melakukan side-effect.

## 3. Layer API Integration (Maya)
- Bungkus semua pemanggilan HTTP dalam layer terpisah (`api/client.js` atau React Query / TanStack Query).
- Jangan campur aduk `fetch()` mentah langsung di dalam JSX view.
