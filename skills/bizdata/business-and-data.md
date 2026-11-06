# Skill: Analisis Bisnis, Riset Pasar & Data Pipeline (Rizky Ramadhan & Tim)

## Deskripsi
Pedoman evaluasi model bisnis, penentuan KPI pertumbuhan, perancangan dashboard metrik analitik, pipeline data ETL/ELT, dan analisis lanskap kompetitor.

## 1. Framework Evaluasi Bisnis & Pasar (Rizky & Melati)
- **Lean Canvas Analysis:** Problem, Solution, Unique Value Proposition, Unfair Advantage, Customer Segments, Channels, Revenue Streams, Cost Structure, Key Metrics.
- **Perhitungan Ukuran Pasar:**
  - **TAM (Total Addressable Market):** Total permintaan pasar global secara keseluruhan.
  - **SAM (Serviceable Addressable Market):** Segmen pasar dalam jangkauan geografis/layanan kita.
  - **SOM (Serviceable Obtainable Market):** Target pangsa pasar realistis dalam 1-3 tahun ke depan.

## 2. Metrik Data & Dashboard (Kirana)
- Rumuskan metrik retensi dan akuisisi:
  - **CAC (Customer Acquisition Cost)** vs **LTV (Lifetime Value)** (Rasio sehat: LTV $\ge$ 3x CAC).
  - **Cohort Retention Analysis:** Pantau churn rate di hari ke-1, ke-7, dan ke-30 (D1, D7, D30).
- Penulisan query analitik SQL wajib mematuhi window functions (`ROW_NUMBER()`, `RANK()`, `LAG()`) dan CTE (`WITH ... AS`) untuk keterbacaan tinggi.

## 3. Data Engineering & Pipeline ETL (Eko)
- Desain skema data warehouse berbasis Star Schema (Fact Table & Dimension Tables) atau Snowflake Schema.
- Terapkan validasi schema mapping dan idempotency (data pipeline aman di-rerun tanpa duplikasi data).
