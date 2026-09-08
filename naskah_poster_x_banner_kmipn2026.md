# 📐 NASKAH DAN STRUKTUR LENGKAP POSTER X-BANNER (60 x 160 cm)
**Kategori:** E-Government, KMIPN VIII 2026  
**Karya:** KNMP SmartHub (Government Decision Intelligence Platform)  
**Tim:** JOSJIS TEAM, Politeknik Perkapalan Negeri Surabaya (PPNS)  

---

## 🎨 SPESIFIKASI TEKNIS DESAIN (CANVA / FIGMA / ILLUSTRATOR)
* **Ukuran Canvas:** 60 cm x 160 cm (Orientasi Portrait / Vertikal X-Banner)
* **Dimensi Digital Rekomendasi:** 
  * 1417 x 3780 piksel (60 DPI): Sangat aman di bawah 2 MB
  * Atau 2362 x 6299 piksel (100 DPI) diekspor ke JPG Kualitas 85-90% (Maksimal file size 2 MB)
* **Format File Ekspor:** `.png` atau `.jpg`
* **Palet Warna Utama:**
  * Navy Blue (`#0F172A` / `#1E293B`): Dominasi latar header dan footer (kesan kredibel dan kokoh)
  * Oceanic Cyan / Teal (`#0EA5E9` / `#06B6D4`): Aksen teknologi dan elemen kelautan
  * Sunset Coral / Alert Red (`#EF4444` / `#F59E0B`): Status Kritis / Waspada
  * Emerald Green (`#10B981`): Status Sehat / Optimal
  * Card White / Slate Light (`#FFFFFF` / `#F8FAFC`): Latar belakang kartu konten agar kontras tinggi

---

## 🏛️ ZONA 1: HEADER DAN IDENTITAS RESMI (Bagian Paling Atas)

### 1. Barisan Logo Resmi (Rata Tengah / Kiri-Kanan Seimbang)
* Logo 1: **Kementerian Pendidikan Tinggi, Sains, dan Teknologi (Kemendiktisaintek)**
* Logo 2: **Badan Koordinasi Kemahasiswaan Politeknik Se-Indonesia (BAKORMA)**
* Logo 3: **KMIPN VIII 2026 (Politeknik Negeri Ujung Pandang)**
* Logo 4: **Politeknik Perkapalan Negeri Surabaya (PPNS)**

### 2. Badge Kategori
`FINALIS E-GOVERNMENT | KMIPN VIII 2026`

### 3. Judul Utama dan Sub-Judul
* **JUDUL UTAMA (Besar dan Tegas):**  
  # KNMP SMARTHUB
* **SUB-JUDUL (Medium dan Elegan):**  
  **Government Decision Intelligence Platform untuk Monitoring, Evaluasi, dan Penentuan Prioritas Tindak Lanjut Program Kampung Nelayan Merah Putih Berbasis Data Terintegrasi**

### 4. Box Identitas Tim Pengusul
* **Institusi:** Politeknik Perkapalan Negeri Surabaya
* **Nama Tim:** JOSJIS TEAM
* **Ketua Tim:** Agus Tri Sucipto
* **Anggota Tim:** Moh. Faiz Dwi Hermawan | Muhammad Farras Nadhif
* **Dosen Pembimbing:** *(Sertakan nama dan gelar dosen pembimbing)*

---

## ⚠️ ZONA 2: LATAR BELAKANG DAN URGENSI MASALAH (The "Why")

### Headline:
**Tantangan Tata Kelola 1.000 Kawasan Pesisir Nasional**

### Narasi Pengantar Singkat:
Program Strategis Nasional Kampung Nelayan Merah Putih (KNMP) menargetkan **1.000 lokasi di 97 kabupaten/kota pada 2026** (tahap awal 65 lokasi menyerap 17.550 tenaga kerja). Namun, pengawasan program dihadapkan pada **3 kendala fundamental**:

### 3 Kartu Bottleneck Permasalahan (Gunakan Ikon dan Card Berwarna Lembut):
1. 📂 **Data Terfragmentasi (Siloed Data)**  
   Pelaporan operasional terpecah di berbagai kanal (formulir fisik, Excel, WhatsApp) tanpa format seragam, memperlambat konsolidasi data KKP pusat.
2. 📊 **Ketiadaan Standar KPI Terukur**  
   Evaluasi capaian program masih bersifat naratif-kualitatif sehingga memicu bias dan ketimpangan penilaian performa antar daerah.
3. ⏳ **Respon Kebijakan Reaktif dan Lambat**  
   Kerusakan fasilitas (misal: *cold storage*) atau anjloknya produksi baru terdeteksi berminggu-minggu kemudian, berisiko menyebabkan alokasi anggaran tidak tepat sasaran.

---

## ⚙️ ZONA 3: CORE ENGINE: AHP DAN TOPSIS DECISION INTELLIGENCE (The "How")

### Headline:
**Transformasi dari Pelaporan Pasif Menuju Decision Intelligence**

### 1. Pembobotan Ilmiah 6 KPI Menggunakan AHP (Analytic Hierarchy Process)
> Mengintegrasikan penilaian pakar dengan **Consistency Ratio (CR) = 0,019** (Konsisten teruji matematis, CR < 0,10):

* 🐟 **Produksi Perikanan (35,1%):** Produktivitas dan volume tangkapan nelayan
* 🚚 **Distribusi Hasil Tangkapan (23,2%):** Efektivitas rantai pasok dan akses pasar
* ❄️ **Utilisasi Cold Storage (13,8%):** Kelaikan suhu dan okupansi pendingin beku
* ⚓ **Kondisi Infrastruktur TPI (13,8%):** Ketersediaan 5 fasilitas operasional
* 🤝 **Aktivitas Koperasi Nelayan (8,7%):** Volume transaksi dan penguatan kelembagaan
* 📋 **Kelengkapan Pelaporan (5,2%):** Kepatuhan pelaporan rutin penyuluh lapangan

$$\text{Health Index} = \sum (\text{Skor KPI}_i \times \text{Bobot AHP}_i) \quad [0 - 100]$$

### 2. Algoritma TOPSIS (Technique for Order Preference by Similarity to Ideal Solution)
* Menghitung jarak relatif lokasi terhadap **Solusi Ideal Positif ($A^+$)** dan **Solusi Ideal Negatif ($A^-$)**.
* Menghasilkan **Closeness Coefficient ($CC$)** yang menyajikan **Peringkat Prioritas Intervensi Nasional** secara otomatis, adil, dan transparan.

---

## 💻 ZONA 4: SHOWCASE FITUR DAN MOCKUP ANTARMUKA APLIKASI

### Headline:
**Arsitektur Sistem Terintegrasi Multi-Role (G2G dan G2E)**

*(Sematkan 2-3 Screenshot UI Asli dalam Frame Laptop/Tablet Bersih)*

### 4 Pilar Fitur Kunci:
1. 🗺️ **GIS Interactive Heatmap (Leaflet.js + OSM)**  
   Pemetaan sebaran 1.000 lokasi KNMP di seluruh Indonesia dengan penanda status warna instan:  
   *🟢 Sangat Baik (80–100) • 🔵 Baik (60–79) • 🟡 Perlu Perhatian (40–59) • 🔴 Kritis (0–39)*
2. 🕸️ **Radar Chart 6 Dimensi Per Lokasi (Recharts)**  
   Mendiagnosis kelemahan spesifik setiap pelabuhan dalam satu pandangan visual (*single glance*).
3. 🚨 **Early Warning System (EWS) 3 Level Otomatis**  
   * **Kritis (<40):** Push notification langsung ke Dirjen/Admin KKP Pusat.
   * **Waspada (40–59):** Notifikasi tindak lanjut ke Dinas Kelautan Provinsi.
   * **Monitor (Tren 2 Bln Turun):** Instruksi evaluasi ke Penyuluh Lapangan.
4. 💡 **Recommendation Engine Otomatis**  
   Menyajikan rekomendasi intervensi konkret berbasis *rule-based knowledge base* tanpa perlu analisa manual berulang.

### Government-Grade Tech Stack:
`React.js + Vite` • `Node.js + Express` • `PostgreSQL + Prisma ORM` • `JWT & RBAC Security` • `100% Passed Unit Test`

---

## 📈 ZONA 5: PERBANDINGAN TATA KELOLA DAN DAMPAK SDGs

### Headline:
**Nilai Tambah dan Dampak Nyata Sebelum vs Sesudah**

### Tabel Perbandingan (Before vs After):

| Parameter Evaluasi | Sebelum (Konvensional) | Sesudah (KNMP SmartHub) |
| :--- | :--- | :--- |
| **Waktu Deteksi Masalah** | Berminggu-minggu / Bulanan | **Near Real-Time** via Notifikasi EWS |
| **Standar Evaluasi** | Narasi kualitatif, rentan bias | **Objektif dan Terstandar** (AHP $CR=0{,}019$) |
| **Penentuan Intervensi** | Subjektif dan rawan salah sasaran | **Presisi Tinggi** via Ranking TOPSIS |
| **Alur Pengambilan Keputusan** | Reaktif setelah timbul krisis | **Proaktif dan Terautomasi** |

### Dukungan Nyata Sustainable Development Goals (SDGs):
* 🐟 **SDG 14: Life Below Water:** Konservasi dan tata kelola sumber daya perikanan berkelanjutan.
* 🏛️ **SDG 16: Peace, Justice & Strong Institutions:** Transparansi dan akuntabilitas belanja publik.
* 🏗️ **SDG 9: Industry, Innovation & Infrastructure:** Digitalisasi dan modernisasi logistik pesisir.
* 🤝 **SDG 1: No Poverty:** Peningkatan taraf hidup dan pendapatan nelayan secara terukur.

---

## 🗺️ ZONA 6: ROADMAP 5 TAHUN DAN FOOTER RESMI

### Headline:
**Roadmap Implementasi Strategis 5 Tahun (2026–2030)**

```
[TAHUN 1] ───> [TAHUN 2] ───────> [TAHUN 3] ─────────> [TAHUN 4 - 5]
Validasi &     Pilot Project      Roll-out Skala       Replikasi Nasional
Pengembangan   1 Provinsi         Menengah Jawa        1.000 Lokasi di
MVP Teruji     (±65 Lokasi KNMP)  & Integrasi API      97 Kab/Kota (Nasional)
```

* **Tahun 1:** Validasi Kebutuhan, Pembobotan Pakar, dan Pengembangan MVP Teruji.
* **Tahun 2:** Pilot Project 1 Provinsi ($\pm 65$ Lokasi) dan Pelatihan Operator Daerah/Penyuluh.
* **Tahun 3:** Roll-out Regional Pulau Jawa dan Integrasi API Data KKP (e-Logbook dan Statistik).
* **Tahun 4–5:** Replikasi dan Skalabilitas Penuh ke **1.000 Lokasi di 97 Kabupaten/Kota**.

---

### 🌐 Footer dan Call-to-Action
* **Tagline Resmi:**  
  **"KNMP SmartHub: Data Cerdas, Keputusan Tepat, Nelayan Sejahtera Menuju Indonesia Emas 2045"**
* **QR Code:** *(Sematkan QR Code mengarah ke https://knmpsmarthub.cloud)*  
  *Label:* **Scan untuk Mengakses Live Demo dan Dokumentasi Sistem**
* **Copyright:** © 2026 JOSJIS TEAM, Politeknik Perkapalan Negeri Surabaya. All Rights Reserved.
