# Log Keputusan Divisi Teknis & Arsitektur (Tech)
Kontributor: Arga Pratama (Systems Topology) & Om Danu (Chief Architect)

<!-- DECISION_START -->
- [TECH-DEC-01] Arsitektur Backend: Menggunakan Node.js native stream dengan 9Router SSE untuk latensi respons <200ms pada antrean layanan publik komunitas.
- [TECH-DEC-02] Prinsip Minimalis (Ponytail Filter): Menolak dependensi berat yang tidak perlu; manajemen antrean dan inventaris diselesaikan dengan struktur data memori terindeks tanpa ORM bloat.
- [TECH-DEC-03] Topologi & Decoupled State: Frontend 3D terpisah bersih dari state chat dan panel, memastikan performa 60fps tanpa memory leak saat render layanan komunitas.
<!-- DECISION_END -->
