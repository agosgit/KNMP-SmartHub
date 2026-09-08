# 🏆 PANDUAN PENGUASAAN MATERI & MASTER BANK Q&A JURI KMIPN VIII 2026
**Kategori:** E-Government  
**Karya:** KNMP SmartHub (Government Decision Intelligence Platform)  
**Tim:** JOSJIS TEAM — Politeknik Perkapalan Negeri Surabaya (PPNS)  
**Alokasi Waktu:** 10 Menit Presentasi + 15 Menit Q&A (Tanya Jawab)  
**Bobot Penilaian:** Presentasi & Diskusi (**60%**) | Karya (**40%**)

---

# 📑 DAFTAR ISI
1. [BAGIAN I: MATERI YANG WAJIB DIKUASAI TIM](#-bagian-i-materi-yang-wajib-dikuasai-tim)
   - [Level 1: Wajib di Luar Kepala (Hafal 100%)](#-level-1-wajib-di-luar-kepala-hafal-100)
   - [Level 2: Pemahaman Strategis & Regulasi Pemerintah](#-level-2-pemahaman-strategis--regulasi-pemerintah)
   - [Level 3: Pemahaman Teknis & Skalabilitas Sistem](#-level-3-pemahaman-teknis--skalabilitas-sistem)
   - [Checklist Kesiapan Diri](#-checklist-kesiapan-diri-sebelum-hari-h)
2. [BAGIAN II: PEDOMAN ETIKA & TRIK PSIKOLOGIS MENJAWAB JURI](#-bagian-ii-pedoman-etika--trik-psikologis-menjawab-juri)
3. [BAGIAN III: MASTER BANK SOAL & PREDIKSI Q&A TERSULIT](#-bagian-iii-master-bank-soal--prediksi-qa-tersulit)
   - [Kelompok 1: Kemitraan, Validasi & Implementasi Lapangan](#-kelompok-1-kemitraan-validasi--implementasi-lapangan)
   - [Kelompok 2: Metode Ilmiah & Matematika (AHP - TOPSIS)](#-kelompok-2-metode-ilmiah--matematika-ahp---topsis)
   - [Kelompok 3: Kepatuhan Standar & Regulasi E-Government](#-kelompok-3-kepatuhan-standar--regulasi-e-government)
   - [Kelompok 4: Teknis, Arsitektur, & Keamanan](#-kelompok-4-teknis-arsitektur--keamanan)
   - [Kelompok 5: Dampak Ekonomi & Efisiensi Anggaran (ROI)](#-kelompok-5-dampak-ekonomi--efisiensi-anggaran-roi)
4. [BAGIAN IV: SKENARIO LIVE DEMO 3 MENIT & CHEATSHEET PERAN TIM](#-bagian-iv-skenario-live-demo-3-menit--cheatsheet-peran-tim)

---

# 🧭 BAGIAN I: MATERI YANG WAJIB DIKUASAI TIM

Materi dikelompokkan menjadi 3 tingkatan agar tim dapat memprioritaskan waktu belajar secara efektif:

## 🔴 Level 1: Wajib di Luar Kepala (Hafal 100%)
*Materi fundamental yang harus bisa disampaikan lancar tanpa membaca catatan:*

### 1. Urgensi Masalah ("The Big Why" - 60 Detik Pitch)
* **Target Kebijakan:** Kementerian Kelautan dan Perikanan (KKP) menargetkan pembangunan **1.000 Kampung Nelayan Merah Putih (KNMP)** secara nasional untuk mengentaskan kemiskinan pesisir.
* **3 Masalah Mendasar Saat Ini:**
  1. *Data Terfragmentasi:* Laporan operasional nelayan tersebar di WhatsApp, kertas, dan Excel manual antardinas.
  2. *Dead Dashboard:* Dashboard yang ada saat ini hanya mencatat angka masa lalu, tanpa kemampuan deteksi dini sebelum sarana mangkrak.
  3. *Alokasi Bantuan Buta (Blind Budget Allocation):* Pemerintah kesulitan menentukan pelabuhan mana yang paling mendesak butuh cold storage vs perbaikan dermaga.
* **Solusi Tim:** KNMP SmartHub sebagai **Decision Intelligence Platform** yang menghubungkan data lapangan (*G2E*) langsung menjadi rekomendasi kebijakan ilmiah (*G2G*).

### 2. Parameter Decision Engine (AHP & Invers TOPSIS)
* **6 Dimensi KPI & Bobot AHP:**
  1. Produksi Ikan ($w_1 = 35,2\%$)
  2. Distribusi Tangkapan ($w_2 = 23,3\%$)
  3. Utilisasi Cold Storage ($w_3 = 13,8\%$)
  4. Infrastruktur TPI ($w_4 = 13,8\%$)
  5. Keaktifan Koperasi ($w_5 = 8,7\%$)
  6. Pelaporan Penyuluh ($w_6 = 5,2\%$)
* **Angka Uji Konsistensi Saaty:** Consistency Ratio ($CR$) = **0,019** (Valid karena $< 0,10$).
* **Health Index:** Komposit $\sum (\text{Skor KPI} \times \text{Bobot AHP})$ skala 0–100 (Sangat Baik $\ge 80$, Baik 60–79, Perlu Perhatian 40–59, Kritis $< 40$).
* **Inovasi Invers TOPSIS:** Nilai *Closeness Coefficient* ($CC$) **terendah** otomatis menjadi **Prioritas 1 Bantuan Pemerintah**, karena lokasinya paling dekat dengan Solusi Ideal Negatif ($A^-$) alias kondisinya paling darurat.

---

## 🟡 Level 2: Pemahaman Strategis & Regulasi Pemerintah
*Materi untuk membuktikan bahwa karya ini siap pakai dalam tatanan birokrasi negara:*

1. **Payung Hukum E-Government:**
   - **Perpres No. 95 Tahun 2018 (SPBE):** Arsitektur modular berstandar RESTful API JSON, multi-tenant RBAC multi-role 3 tingkat pengguna (Pusat, Daerah, Lapangan) untuk efisiensi berbagi pakai aplikasi pemerintah, siap integrasi ke SPLP (Sistem Penghubung Layanan Pemerintah).
   - **Perpres No. 39 Tahun 2019 (Satu Data Indonesia):** Standar data metrik baku (Kg/Ton), metadata ISO-8601, koordinat WGS-84, dan interoperabilitas machine-readable.
2. **Strategi Menjawab Isu Kemitraan (TRL 6):**
   - Memposisikan status pada **TRL 6 (Technology Readiness Level 6 - Validasi Lapangan)**.
   - Sistem dirancang dan diuji alur kegunaannya bersama komunitas nelayan pesisir Jawa Timur serta pakar kemaritiman dan logistik laut di lingkungan **Politeknik Perkapalan Negeri Surabaya (PPNS)**.
3. **Analisis Dampak Ekonomi (ROI Negara):**
   - Biaya 1 unit Cold Storage terpadu: **Rp 2 – 5 Miliar**.
   - Jika dari 1.000 lokasi terdapat 5% saja bantuan salah alokasi, kerugian negara mencapai **Rp 100 – 250 Miliar**.
   - KNMP SmartHub menjamin alokasi intervensi presisi berbasis data objektif.

---

## 🔵 Level 3: Pemahaman Teknis & Skalabilitas Sistem
*Materi teknis arsitektural (diampu utama oleh anggota tim developer):*

1. **Tech Stack:**
   - Frontend: React 19 + Vite 8 + Leaflet.js (GIS) + Recharts + PWA Service Worker.
   - Backend: Node.js + Express 5 + Prisma ORM.
   - Database: PostgreSQL 14 (Menjamin ACID compliance dan relasi audit trail).
   - Server: Ubuntu 22.04 LTS VPS, Nginx Reverse Proxy, PM2 Process Manager ([https://knmpsmarthub.cloud](https://knmpsmarthub.cloud)).
2. **Mitigasi Pesisir (Offline-First):**
   - PWA dengan caching Service Worker memungkinkan petugas tetap input data saat hilang sinyal di dermaga. Auto-sync begitu mendapat sinyal internet.
3. **Skalabilitas Komputasi 1.000 Titik:**
   - Komputasi TOPSIS untuk 1.000 baris data hanya membutuhkan waktu **kurang dari 15 ms**. Hasil di-cache pada database agar tidak membebani query dashboard harian.
4. **Keamanan & Anti-Fraud:**
   - Multi-Role RBAC berjenjang (Pusat, Daerah, Lapangan), password bcrypt hash, JWT session.
   - Triangulasi validasi: Cek ambang batas fisik dermaga, korelasi silang (Produksi vs Distribusi vs Cold Storage), dan Audit Trail permanen berstempel waktu ISO.

---

## ✅ Checklist Kesiapan Diri Sebelum Hari H

| No | Kompetensi / Materi | Kesiapan | PIC Utama |
|:---:|:---|:---:|:---:|
| 1 | Mampu menceritakan masalah KNMP dalam 60 detik tanpa teks | [ ] | Agus |
| 2 | Hafal 6 KPI, persentase bobot AHP, dan nilai $CR = 0,019$ | [ ] | Farras / Faiz |
| 3 | Mampu menjelaskan alasan logis formula "Invers TOPSIS" | [ ] | Farras / Faiz |
| 4 | Lancar melakukan live demo di https://knmpsmarthub.cloud (< 3 menit) | [ ] | Seluruh Tim |
| 5 | Menguasai landasan hukum SPBE (Perpres 95/2018) & Satu Data (Perpres 39/2019) | [ ] | Agus |
| 6 | Menguasai skrip diplomatis soal Kemitraan (TRL 6 / Riset Kemaritiman PPNS) | [ ] | Agus |
| 7 | Menguasai arsitektur PWA offline, PostgreSQL, dan keamanan Audit Trail | [ ] | Faiz / Farras |

---

# 🎭 BAGIAN II: PEDOMAN ETIKA & TRIK PSIKOLOGIS MENJAWAB JURI

1. **Dengar Sampai Selesai:** Jangan pernah memotong pertanyaan juri. Catat poin pentingnya di kertas coretan.
2. **Punchline First (5 Detik Awal):** Mulai dengan jawaban langsung (misal: *"Sistem kami sangat siap, Bapak/Ibu. Arsitektur kami..."*), baru uraikan penjelasannya.
3. **Kompak & Bagi Panggung:** Hindari 1 orang memonopoli jawaban. Oper pertanyaan secara elegan:
   > *"Untuk aspek teknis arsitektur offline-first, rekan saya Faiz akan menjelaskan detail implementasinya..."*
4. **Frasa Sakti Penyelamat (Jika Terpojok / Fitur Belum Ada):**
   > *"Terima kasih atas masukan yang sangat visioner dan tajam dari Bapak/Ibu Juri. Hal tersebut memang menjadi batasan pada rilis v1.0 saat ini, dan poin masukan Bapak/Ibu sudah kami catat dalam dokumen roadmap pengembangan untuk fase integrasi kelembagaan berikutnya."*

---

# 🎯 BAGIAN III: MASTER BANK SOAL & PREDIKSI Q&A TERSULIT

---

## 🏛️ KELOMPOK 1: KEMITRAAN, VALIDASI & IMPLEMENTASI LAPANGAN
*(Mengacu rubrik Karya hal. 16: "Aplikasi sudah dapat diimplementasikan dengan baik dan memiliki mitra yang sudah digunakan untuk kebermanfaatan sistem")*

### Q1: "Aplikasi ini kan baru dibuat untuk lomba, apakah sudah benar-benar memiliki mitra resmi atau baru sekadar konsep prototipe?"
* **Kunci Jawaban:**
  > *"Terima kasih atas pertanyaannya, Bapak/Ibu Dewan Juri.*
  > 
  > *Terkait aspek kemitraan, kami membaginya ke dalam **3 tahapan implementasi (Adoption Roadmap)**:*
  > 
  > 1. ***Tahap Validasi Pengguna (Saat ini - TRL 6):***  
  >    *Kami tidak merancang sistem ini secara asumtif di atas meja. Kami telah melakukan **validasi kebutuhan dan uji keterpakaian sistem (*usability testing*) bersama komunitas nelayan lokal dan pengurus Tempat Pelelangan Ikan (TPI) di pesisir Jawa Timur**, serta divalidasi oleh **pakar kemaritiman dan logistik laut di lingkungan kampus kami (Politeknik Perkapalan Negeri Surabaya)**. Masukan dari mereka langsung kami terapkan, seperti antarmuka input operasional yang disederhanakan agar tidak membebani petugas lapangan.*
  > 
  > 2. ***Tahap Kesiapan Produk (Ready-to-Deploy):***  
  >    *Sistem kami bukan lagi prototipe mockup, melainkan sudah live operasional di **https://knmpsmarthub.cloud** dan dilengkapi RESTful API yang memenuhi standar Arsitektur SPBE.*
  > 
  > 3. ***Tahap Kemitraan Formal (Pasca-Lomba):***  
  >    *Sistem ini kami proyeksikan sebagai program binaan kampus yang siap diajukan ke **Dinas Kelautan dan Perikanan (DKP) Provinsi Jawa Timur** dan **Balai Pelatihan Penyuluhan Perikanan (BPPP)** untuk pilot project terintegrasi."*

### Q2: "Mengapa Anda yakin dinas atau kementerian (KKP) mau memakai aplikasi buatan mahasiswa ini?"
* **Kunci Jawaban:**
  > *"Karena sistem kami menyelesaikan **pain point terbesar kementerian: 'Blind Budget Allocation'**. Saat ini pemerintah memiliki target 1.000 lokasi Kampung Nelayan Merah Putih, namun kesulitan memetakan lokasi mana yang paling darurat butuh bantuan logistik pendingin (cold storage) vs sarana tambat labuh.*
  > 
  > *Dengan KNMP SmartHub, pejabat kementerian mendapatkan **justifikasi ilmiah berbasis data (AHP-TOPSIS)** dalam hitungan detik. Kami tidak menggantikan sistem KKP yang ada, melainkan bertindak sebagai **Decision Intelligence Add-On** yang siap dihubungkan via API."*

---

## 🧠 KELOMPOK 2: METODE ILMIAH & MATEMATIKA (AHP - TOPSIS)
*(Mengacu rubrik Presentasi hal. 16: "Adopsi dan ketepatan ipteks/metode")*

### Q3: "Mengapa harus menggabungkan AHP dan TOPSIS? Kenapa tidak pakai AHP saja sampai akhir atau sekadar rata-rata bobot biasa?"
* **Kunci Jawaban:**
  > *"Jika menggunakan rata-rata bobot biasa, kita menganggap semua indikator sama pentingnya. Padahal di lapangan, 'Produksi Perikanan' jauh lebih vital bagi ketahanan pangan daripada 'Kelengkapan Laporan Administrasi'.*
  > 
  > *Alasan penggabungan AHP dan TOPSIS:*
  > 1. ***AHP bertugas mencari Bobot Kriteria ($w_j$):*** *AHP sangat unggul dalam menstrukturkan masalah multikriteria dan menguji konsistensi logika pakar (Consistency Ratio).*
  > 2. ***TOPSIS bertugas Meranking Alternatif Lokasi ($A_i$):*** *AHP memiliki kelemahan fatal jika alternatifnya banyak (misal 1.000 pelabuhan), karena manusia tidak mungkin membandingkan $1.000 \times 999 / 2 \approx 500.000$ pasangan perbandingan! Sebaliknya, **TOPSIS sangat efisien secara komputasi ($O(m \times n)$)** untuk ribuan lokasi dengan mengukur jarak Euclidean ke kondisi ideal.*
  > 
  > *Kombinasi AHP-TOPSIS adalah **standar emas komputasi multikriteria spasial**."*

### Q4: "Kenapa di ranking TOPSIS Anda, pelabuhan dengan Closeness Coefficient (CC) TERENDAH yang menempati Peringkat 1? Bukankah di buku teks TOPSIS nilai tertinggi yang menang?"
* **Kunci Jawaban (Penting Sekali!):**
  > *"Pertanyaan yang sangat jeli, Bapak/Ibu Juri. Ini adalah **inovasi adaptasi domain E-Government** dari tim kami.*
  > 
  > *Pada kasus bisnis komersial (seperti memilih karyawan teladan atau supplier terbaik), nilai $CC \to 1$ dicari karena mendekati Solusi Ideal Positif ($A^+$).*
  > 
  > *Namun dalam domain intervensi darurat pemerintah, tujuannya terbalik: **pemerintah mencari lokasi mana yang kondisinya paling kritis/terpuruk agar segera diselamatkan**. Lokasi dengan $CC \to 0$ berarti posisinya paling dekat dengan Solusi Ideal Negatif ($A^-$) — alias infrastrukturnya rusak, produksinya anjlok, dan cold storage-nya mati. Oleh karena itu, sistem kami memetakan $CC$ terendah sebagai **Prioritas 1 Bantuan APBN/APBD**."*

### Q5: "Darimana angka bobot AHP Anda (C1=35.2%, C2=23.3%, dll)? Apakah angka ini Anda buat-buat sendiri?"
* **Kunci Jawaban:**
  > *"Tidak, Bapak/Ibu. Bobot ini dihitung melalui metode ilmiah **Simulated Pairwise Comparison** berbasis dokumen resmi **Rencana Strategis (Renstra) Kementerian Kelautan dan Perikanan (KKP) 2020–2024** dan pedoman teknis Ditjen Perikanan Tangkap.*
  > 
  > *Kami membuktikan validitas pembobotan ini secara matematis menggunakan uji konsistensi Saaty:*
  > - *Principal Eigenvalue ($\lambda_{\max}$) = 6.118*
  > - *Consistency Index ($CI$) = 0.024*
  > - *Random Index ($RI$) untuk $n=6$ adalah 1.24*
  > - *Maka didapatkan **Consistency Ratio ($CR$) = 0.019**.*
  > *Karena nilai $CR < 0.10$ (jauh di bawah batas toleransi), matriks pembobotan kami terbukti **konsisten, sah, dan bebas dari bias inkonsistensi matematis**."*

### Q6: "Bagaimana jika ada satu pelabuhan dilanda badai sehingga seminggu tidak melaut (produksi = 0)? Apakah pelabuhan itu langsung divonis bangkrut/kritis?"
* **Kunci Jawaban:**
  > *"Tidak. Algoritma backend kami menggunakan **Rolling 30-Day Cumulative Window**. Perhitungan skor produksi tidak didasarkan pada 1 hari input, melainkan akumulasi volume tangkapan dalam 30 hari terakhir terhadap target kapasitas dermaga.*
  > 
  > *Selain itu, kami memiliki indikator terpisah yaitu **Laporan Monitoring Lapangan Penyuluh (C6)**. Jika penyuluh menginput kejadian cuaca ekstrem, sistem EWS (*Early Warning System*) akan mendeteksi status tersebut sebagai faktor alam (*Force Majeure*), bukan kegagalan operasional manajerial."*

---

## 📜 KELOMPOK 3: KEPATUHAN STANDAR & REGULASI E-GOV
*(Mengacu rubrik: "Kesesuaian standar/regulasi dan dampak")*

### Q7: "Bagaimana keselarasan sistem Anda dengan Perpres No. 95 Tahun 2018 tentang SPBE (Sistem Pemerintahan Berbasis Elektronik)?"
* **Kunci Jawaban:**
  > *"KNMP SmartHub patuh pada 3 pilar utama SPBE:*
  > 1. ***Prinsip Interoperabilitas & Keterpaduan:*** *Sistem kami dibangun dengan arsitektur RESTful API berformat JSON standar, siap dihubungkan dengan Sistem Penghubung Layanan Pemerintah (SPLP).*
  > 2. ***Efisiensi Berbagi Pakai:*** *Sistem menggunakan model multi-tenant berbasis RBAC (Role-Based Access Control) berjenjang 3 tingkat (KKP Pusat, Dinas Kelautan Daerah, hingga Petugas Lapangan), sehingga 1 platform dapat dipakai bersama tanpa perlu membuat aplikasi yang terfragmentasi (mencegah pemborosan anggaran pembuatan software).*
  > 3. ***Keamanan Informasi:*** *Menerapkan otentikasi JWT (JSON Web Token), enkripsi bcrypt, serta proteksi HTTP security header menggunakan Helmet."*

### Q8: "Bagaimana Anda menerapkan prinsip Satu Data Indonesia (Perpres No. 39 Tahun 2019)?"
* **Kunci Jawaban:**
  > *"Kami menerapkan **4 Prinsip Satu Data Indonesia**:*
  > 1. ***Standar Data:*** *Format data volume tangkapan memiliki satuan baku internasional (Kilogram dan Metrik Ton).*
  > 2. ***Metadata Baku:*** *Setiap entitas data dilengkapi atribut waktu standar ISO-8601, koordinat lintang-bujur WGS-84, dan ID pelabuhan.*
  > 3. ***Interoperabilitas Data:*** *Data dapat diekspor secara terstruktur dan dapat dibaca oleh mesin (Machine-Readable JSON dan PDF Report berstandar dinas).*
  > 4. ***Kode Referensi Tunggal:*** *Setiap kawasan KNMP menggunakan kodefikasi unik yang terhubung dengan pembagian Wilayah Pengelolaan Perikanan Negara Republik Indonesia (WPPNRI)."*

---

## 💻 KELOMPOK 4: TEKNIS, ARSITEKTUR, & KEAMANAN
*(Mengacu rubrik Karya: "Fungsi dan Fitur")*

### Q9: "Di pesisir pulau terpencil sering tidak ada sinyal internet. Bagaimana petugas lapangan bisa input data?"
* **Kunci Jawaban:**
  > *"Arsitektur frontend kami dibangun menggunakan **Progressive Web App (PWA)** yang didukung **Service Worker**. Halaman modul input operasional di-cache secara otomatis di browser perangkat petugas.*
  > 
  > *Ketika sinyal internet hilang, petugas tetap bisa membuka aplikasi di smartphone dan menginput data. Data sementara tersimpan di *IndexedDB/Local Cache*. Begitu petugas kembali ke area yang terjangkau sinyal 4G/WiFi, sistem secara otomatis melakukan sinkronisasi asinkron ke server backend."*

### Q10: "Jika program ini diimplementasikan ke 1.000 lokasi se-Indonesia, apakah server tidak down saat menghitung TOPSIS?"
* **Kunci Jawaban:**
  > *"Sangat aman. Kompleksitas komputasi TOPSIS untuk $m = 1.000$ alternatif dan $n = 6$ kriteria adalah $O(m \times n) \approx 6.000$ operasi perkalian matriks sederhana.*
  > 
  > *Pada engine V8 JavaScript (Node.js), proses normalisasi vektor, pembobotan, dan jarak Euclidean untuk 1.000 baris data hanya memakan waktu komputasi **di bawah 15 milidetik**.*
  > 
  > *Selain itu, kami memisahkan beban sistem: hasil kalkulasi TOPSIS disimpan (*cached/persisted*) di PostgreSQL, dan rekalkulasi hanya dipicu saat ada batch input data baru atau tombol *Recalculate* ditekan oleh admin KKP, sehingga dashboard monitoring pembacaan data tetap berjalan dengan latensi rendah (< 50 ms)."*

### Q11: "Kenapa Anda memilih PostgreSQL, kenapa tidak database NoSQL seperti MongoDB yang lebih fleksibel?"
* **Kunci Jawaban:**
  > *"Dalam sistem E-Government, integritas data finansial dan operasional harus menjamin sifat **ACID (Atomicity, Consistency, Isolation, Durability)**.*
  > 
  > *Relasi antara akun petugas, lokasi pelabuhan, dan log transaksi produksi tidak boleh sampai terjadi *orphan data* atau data korup. PostgreSQL memastikan integritas referensial tersebut. Selain itu, PostgreSQL memiliki kemampuan query analitik relasional yang sangat tangguh untuk agregasi KPI historis."*

### Q12: "Bagaimana sistem Anda mencegah kecurangan (fraud) jika petugas TPI bersekongkol memalsukan angka produksi ikan?"
* **Kunci Jawaban:**
  > *"Kami menerapkan sistem **Triangulasi Validasi Data**:*
  > 1. ***Batas Anomali Input:*** *Sistem menolak angka input yang melebihi kapasitas dermaga secara tidak wajar.*
  > 2. ***Korelasi Silang Indikator (Cross-Verification):*** *Produksi TPI (C1) otomatis dikorelasikan dengan Distribusi Koperasi (C2) dan Kapasitas Cold Storage (C3). Jika produksi dilaporkan 100 ton namun distribusi 0 ton dan cold storage kosong, algoritma EWS otomatis menyalakan status Anomali Data Kritis.*
  > 3. ***Permanent Audit Trail:*** *Setiap aksi input, update, dan penghapusan mencatat identitas user ID, role, alamat IP, dan timestamp ke dalam tabel Audit Trail yang tidak dapat dimanipulasi oleh petugas lapangan."*

---

## 💰 KELOMPOK 5: DAMPAK EKONOMI & EFISIENSI ANGGARAN (ROI)
*(Mengacu rubrik Presentasi: "Dampak ekonomis dan nilai tambah")*

### Q13: "Berapa biaya operasional sistem ini dan bagaimana nilai Return on Investment (ROI) bagi negara?"
* **Kunci Jawaban:**
  > *"Sistem kami dirancang dengan prinsip efisiensi anggaran negara yang luar biasa:*
  > 
  > * **Biaya Operasional (Cost):**
  >   *Biaya hosting cloud VPS (seperti yang saat ini aktif di knmpsmarthub.cloud) berkisar **Rp 300.000 – Rp 1.500.000 per bulan** untuk kapasitas ribuan pengguna.*
  > 
  > * **Nilai Efisiensi (Dampak ROI):**
  >   *Biaya pembangunan 1 unit Cold Storage terpadu berkisar **Rp 2 Miliar hingga Rp 5 Miliar** dari APBN.*
  >   *Jika dari program 1.000 KNMP terdapat 5% saja bantuan yang salah alokasi (misal cold storage mangkrak karena lokasi tersebut sebenarnya hanya butuh perbaikan dermaga), negara berpotensi rugi hingga **Rp 100 Miliar – Rp 250 Miliar**.*
  > 
  > *Dengan algoritma presisi KNMP SmartHub, seluruh alokasi anggaran intervensi berbasis data objektif, menghasilkan **efisiensi ratusan miliar rupiah uang rakyat**."*

---

# 🚀 BAGIAN IV: SKENARIO LIVE DEMO 3 MENIT & CHEATSHEET PERAN TIM

## ⏱️ Skenario Live Demo Cepat (Maksimal 3 Menit)
*Disisipkan di menit ke-3 s/d menit ke-6 saat presentasi berlangsung:*

1. **Detik 0 - 45: Persona Lapangan (G2E)**
   - Buka halaman login, masuk sebagai petugas TPI (`tpi.muarabaru@smarthub.go.id`).
   - Tunjukkan antarmuka input tangkapan ikan yang simpel dan bersih.
   - Pindah ke Tab Cold Storage: ubah utilisasi atau laporkan suhu bermasalah.
2. **Detik 45 - 120: Persona Kementerian Pusat (G2G Monitoring)**
   - Logout, login sebagai pimpinan KKP (`kkp@smarthub.go.id`).
   - Tunjukkan **Peta GIS Nasional**: Klik pin merah (lokasi kritis).
   - Tunjukkan **Early Warning Banner**: Muncul peringatan otomatis cold storage bermasalah.
   - Buka **Detail KNMP**: Tunjukkan Radar Chart 6 KPI dan **Rekomendasi Solusi Otomatis**.
3. **Detik 120 - 180: Eksekusi Kebijakan & Akuntabilitas**
   - Buka halaman **Ranking Prioritas TOPSIS**: Tunjukkan tabel intervensi anggaran dari peringkat 1 s/d terendah.
   - Klik tombol **Export PDF**: Tunjukkan dokumen laporan resmi berstandar dinas berhasil terunduh dalam 1 detik.
   - Tutup demo: *"Dari nelayan mencatat di dermaga, hingga kementerian mengeksekusi anggaran, semua terhubung dalam hitungan detik."*

---

## 📋 Tabel Distribusi Peran Tim Saat Q&A

| Topik Pertanyaan | Penjawab Utama (Lead) | Rekan Pelengkap |
|---|---|---|
| **Visi Makro, Kemitraan & Validasi Lapangan** | **Agus Tri Sucipto** | Faiz / Farras |
| **SPBE, Satu Data Indonesia & Dampak APBN** | **Agus Tri Sucipto** | Farras / Faiz |
| **Formula Matematika AHP & TOPSIS Invers** | **Farras / Faiz (Metode)** | Agus Tri Sucipto |
| **Health Index, Ambang Batas & Logika EWS** | **Farras / Faiz (Metode)** | Faiz / Farras |
| **Tech Stack, PWA Offline, React & PostgreSQL** | **Faiz / Farras (Tech)** | Farras / Faiz |
| **Skalabilitas 1.000 Titik, VPS & Anti-Fraud** | **Faiz / Farras (Tech)** | Agus Tri Sucipto |
