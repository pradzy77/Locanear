# Product Requirements Document (PRD)
## ZenLoc - Real-time Friend Map Tracker

---

### 1. Executive Summary

- **Problem Statement:**  
  Keluarga dan lingkaran pertemanan dekat sering mengalami kecemasan atau kesulitan koordinasi ketika bepergian (apakah sudah sampai tujuan, sisa baterai perangkat, status perjalanan), sementara aplikasi peta komersial umumnya memakan banyak data, sarat iklan/pelacak pihak ketiga, atau tidak lagi menyediakan fitur sosial real-time interaktif seperti Zenly terdahulu.

- **Proposed Solution:**  
  ZenLoc menghadirkan aplikasi web pelacak lokasi real-time yang ringan, berfokus pada privasi, dan tanpa biaya langganan. Memadukan visual interaktif bergaya Zenly (Google Maps layer, status baterai langsung, riwayat jejak 7 hari, mode Ghost), login instan berbasis biometrik (WebAuthn Face ID / Touch ID), dan arsitektur 100% serverless di Cloudflare Pages + D1 Database.

- **Success Criteria (Measurable KPIs):**
  1. **Latency Pembaruan Lokasi:** Latensi propagasi koordinat GPS antar-teman <= 1,5 detik pada koneksi 4G standar.
  2. **Kecepatan Login Biometrik:** Waktu verifikasi login via Face ID / Touch ID <= 800ms dari klik hingga peta terbuka.
  3. **Efisiensi Beban Perangkat:** Konsumsi memori browser di perangkat mobile <= 120MB dan konsumsi baterai <= 4% per jam saat aktif di foreground.
  4. **Zero Hosting Cost:** 100% operasional tetap berada dalam Cloudflare Free Tier (<= 100.000 requests/hari, database D1 <= 5 juta baris/bulan).
  5. **Tingkat Akurasi GPS & Geofencing:** Akurasi deteksi lokasi rata-rata <= 15 meter pada area terbuka.

---

### 2. User Experience & Functionality

#### User Personas
1. **Persona A: "Anggota Keluarga / Pasangan Peduli" (Budi & Siska)**
   - *Kebutuhan:* Memastikan pasangan/anak telah sampai di rumah atau kantor dengan selamat tanpa harus terus-menerus mengirim pesan chat manual "sudah sampai mana?".
   - *Pain Point:* Sering lupa mengabari, cemas jika baterai handphone pasangan sekarat.
2. **Persona B: "Lingkaran Sahabat Nongkrong" (Kelompok Teman 5–15 Orang)**
   - *Kebutuhan:* Koordinasi titik kumpul (meetup) secara spontan di kafe/kampus dan melihat siapa saja yang sedang OTW atau masih di rumah.
   - *Pain Point:* Teman sering berbohong "sudah OTW" padahal baru bangun tidur.

#### User Stories & Acceptance Criteria

- **US-01: Autentikasi Cepat Biometrik (Face ID / WebAuthn)**
  - *Story:* Sebagai pengguna terdaftar, saya ingin masuk ke peta secara instan menggunakan Face ID / Touch ID di iPhone atau Android saya tanpa harus mengetik username dan password setiap kali membuka browser.
  - *Acceptance Criteria:*
    - Tombol "Masuk Cepat via Face ID" muncul otomatis jika perangkat telah didaftarkan.
    - Autentikasi biometrik berhasil memverifikasi akun dan langsung mengarahkan pengguna ke peta dalam < 1 detik.
    - Pengguna dapat mengaktifkan atau mencabut izin Face ID kapan saja melalui menu Pengaturan.

- **US-02: Pemantauan Lokasi & Baterai Real-time**
  - *Story:* Sebagai pengguna, saya ingin melihat lokasi teman-teman saya di peta lengkap dengan level persentase baterai mereka.
  - *Acceptance Criteria:*
    - Marker avatar teman diperbarui secara otomatis setiap kali ada perubahan koordinat.
    - Indikator baterai menampilkan status pengisian daya (charging) dan persentase numerik yang akurat.
    - Terdapat indikator akurasi GPS (High/Medium/Low) untuk mengukur presisi titik lokasi.

- **US-03: Mode Privasi (Ghost Mode)**
  - *Story:* Sebagai pengguna, saya ingin dapat menyamarkan lokasi saya saat membutuhkan ruang privat tanpa harus keluar dari aplikasi.
  - *Acceptance Criteria:*
    - Toggle "Privasi & Ghost Mode" tersedia di menu Pengaturan.
    - Saat aktif, koordinat yang dikirim ke teman otomatis diacak/disamarkan sejauh ±500 meter dari titik asli.
    - Status Ghost Mode terlihat transparan oleh pengguna itu sendiri pada profilnya.

- **US-04: Geofencing & Notifikasi Kedatangan (Prioritas v1.1)**
  - *Story:* Sebagai pengguna, saya ingin menerima notifikasi otomatis ketika sahabat/keluarga saya tiba di atau meninggalkan lokasi tertentu (contoh: "Rumah", "Kampus", "Kantor").
  - *Acceptance Criteria:*
    - Pengguna dapat menandai lokasi favorit dengan radius lingkaran geofence (misal: 100m – 300m).
    - Ketika marker teman memasuki radius geofence, sistem memicu notifikasi visual (toast banner) dan audio ringan di layar penerima.
    - Pengguna dapat menyalakan/mematikan peringatan untuk setiap lokasi yang disimpan.

#### Non-Goals
- Tidak membangun sistem jejaring sosial publik tanpa batas (tidak ada algoritma *explore feed*, *follower publik*, atau pencarian akun global).
- Tidak menyimpan rekaman suara ambient atau data sensor biometrik di server (seluruh data biometrik diproses lokal di hardware melalui WebAuthn).
- Tidak membebankan biaya atau model langganan berbayar kepada pengguna.

---

### 3. AI & Smart Features (Future Roadmap / Optional)

- **Smart ETA & Travel Mode Detection:**  
  Algoritma heuristik berbasis selisih koordinat dan kecepatan untuk mengkategorikan moda transportasi pengguna (Diam, Berjalan Kaki, Bersepeda, Berkendara Mobil/Motor) dan mengestimasi sisa waktu perjalanan menuju titik kumpul tanpa integrasi API berbayar.
- **Smart Battery Warning:**  
  Peringatan prediktif otomatis ketika baterai teman tersisa < 15% disertai estimasi waktu sebelum perangkat mati berdasarkan laju penurunan persentase.

---

### 4. Technical Specifications

#### Architecture Overview
```mermaid
graph TD
    Client[Web App Browser (PWA/Mobile Safari/Chrome)] -->|WebAuthn Local| SecureEnclave[Device Biometric Hardware]
    Client -->|HTTPS / Assets| CF[Cloudflare Pages CDN]
    Client -->|REST API / Realtime Poll| Worker[Cloudflare Pages Functions / API Worker]
    Worker -->|Read / Write State| D1[(Cloudflare D1 SQL Database)]
```

#### Integration Points & Tech Stack
1. **Frontend:** Vanilla HTML5, CSS3 Glassmorphism UI, Vanilla Modern JS (ES6+), Leaflet.js dengan Google Maps Tile Layer, Lucide Icons.
2. **Biometrik & Auth:** WebAuthn W3C Standard (`navigator.credentials.create` dan `navigator.credentials.get`), ES256/RS256 key pairing, SHA-256 password fallback.
3. **Backend & Compute:** Cloudflare Pages Functions (Serverless Edge Runtime V8 isolate).
4. **Database:** Cloudflare D1 SQL (SQLite Serverless Edge Database: tabel `users`, `locations`, `history_points`, `friendships`, `places`).
5. **Hosting & Deployment:** Cloudflare Pages dengan automatic zero-downtime deployment.

#### Security & Privacy Requirements
- **Enkripsi Transit:** Seluruh traffic wajib berjalan di atas HTTPS / TLS 1.3.
- **Isolasi Biometrik:** Wajah/sidik jari tidak pernah keluar dari hardware Secure Enclave perangkat pengguna; server hanya mengenali ID kuesioner kriptografis WebAuthn.
- **Kontrol Hak Akses Lokasi:** Lokasi pengguna hanya dapat diakses oleh teman yang sudah saling mengonfirmasi kode pertemanan (*mutual friend code approval*).

---

### 5. Risks & Roadmap

#### Phased Rollout Plan

| Tahap | Fitur Utama | Target Rilis |
|---|---|---|
| **MVP (Selesai)** | Tracking real-time, status baterai, login password & registrasi, Cloudflare D1 integration, WebAuthn Face ID login. | Q3 2026 (Live) |
| **v1.1 (Next)** | **Geofencing Otomatis** (Notifikasi Tiba di Rumah/Kampus), modularisasi file `app.js` untuk kecepatan ekstrem, optimasi PWA Offline fallback. | Q4 2026 |
| **v1.2** | Riwayat perjalanan ringkas harian (Timeline Day Recap) & estimasi status OTW otomatis. | Q1 2027 |
| **v2.0** | End-to-End Encrypted (E2EE) Chat langsung di atas peta untuk grup lingkaran pertemanan. | Q2 2027 |

#### Technical Risks & Mitigasi

1. **Limitasi Background Geolocation di Browser Mobile:**
   - *Risiko:* iOS Safari dan Android Chrome membatasi pembacaan GPS ketika layar mati atau tab berada di background.
   - *Mitigasi:* Mengimplementasikan konfigurasi PWA (Progressive Web App) dengan manifest dan Service Worker, serta mengedukasi pengguna untuk menambahkan icon ke Homescreen (*Add to Home Screen*) agar browser memberikan toleransi proses background lebih tinggi.
2. **Batas Free-Tier Cloudflare Pages & D1:**
   - *Risiko:* Lonjakan frekuensi polling koordinat dapat menghabiskan kuota request harian gratis (100.000 requests/hari).
   - *Mitigasi:* Menerapkan *adaptive polling* (interval pengiriman data koordinat diperpanjang menjadi 10–15 detik jika pengguna sedang diam/idle, dan dipercepat menjadi 3 detik saat bergerak aktif).
