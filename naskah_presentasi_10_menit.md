# 🎤 Naskah Presentasi + Demo: KNMP SmartHub
## KMIPN VIII 2026 — Kategori E-Government | JOSJIS TEAM — PPNS
### Total Durasi: 10 Menit

---

## 🧭 STRATEGI PRESENTASI

> [!IMPORTANT]
> **Jangan pisahkan PPT dan Demo!** Strategi terbaik: **selipkan live demo di tengah presentasi** (setelah slide Solusi, sebelum slide teknis AHP). Ini membuat juri langsung "merasakan" produk saat rasa penasaran mereka paling tinggi, lalu ditutup penjelasan teknis yang melegitimasi apa yang baru saja mereka lihat.

### Alur Presentasi

```
PPT Slide 1-4 (Masalah → Solusi)     ≈ 3 menit
        ↓
🖥️ LIVE DEMO PRODUK               ≈ 3.5 menit  ← KLIMAKS
        ↓
PPT Slide 6-12 (Teknis → Penutup)   ≈ 3.5 menit
```

### Pembagian Peran (Rekomendasi 3 Anggota)

| Peran | Bagian | Durasi |
|---|---|---|
| **Presenter 1 (Ketua)** | Opening, Urgensi, Gap Analysis, Solusi, Kesimpulan, Penutup | ~4 menit |
| **Presenter 2 (Programmer)** | Live Demo produk + Arsitektur Sistem | ~3.5 menit |
| **Presenter 3 (Analis)** | Decision Engine AHP, TOPSIS, Dampak & Roadmap | ~2.5 menit |

> [!TIP]
> Transisi antar presenter harus **halus dan tanpa jeda**. Gunakan kalimat penghubung seperti:
> *"Untuk menunjukkan bagaimana sistem ini bekerja secara nyata, saya persilakan rekan saya untuk mendemonstrasikan..."*

---

## 📝 NASKAH LENGKAP

---

### 🟢 SLIDE 1 — COVER (30 detik)
**[Presenter 1 — Ketua]**

> *"Assalamualaikum Wr. Wb. Salam sejahtera untuk kita semua.*
>
> *Yang terhormat Bapak/Ibu Dewan Juri KMIPN VIII 2026.*
>
> *Perkenalkan, kami dari **JOSJIS TEAM, Politeknik Perkapalan Negeri Surabaya**.*
>
> *Hari ini kami mempersembahkan karya berjudul:*
> ***KNMP SmartHub — Government Decision Intelligence Platform untuk Monitoring, Evaluasi, dan Penentuan Prioritas Tindak Lanjut Program Kampung Nelayan Merah Putih Berbasis Data Terintegrasi.***
>
> *Produk kami sudah **live dan dapat diakses** di **knmpsmarthub.cloud**."*

⏱️ **Target waktu: 00:00 – 00:30**

---

### 🔴 SLIDE 2 — URGENSI MASALAH (50 detik)
**[Presenter 1 — Ketua]**

> *"Bapak/Ibu Juri, program Kampung Nelayan Merah Putih atau KNMP adalah program strategis nasional yang tersebar di **1.000 lokasi, 97 kabupaten/kota**, dan melibatkan **ribuan penyuluh lapangan**.*
>
> *Namun di lapangan, kami menemukan **3 permasalahan kritis** yang menghambat keberhasilan program ini:*
>
> ***Pertama, Fragmentasi Kanal Pelaporan.*** *Data tersebar di WhatsApp, spreadsheet lepas, dan laporan kertas tanpa validasi terpusat. Tidak ada **single source of truth**.*
>
> ***Kedua, Keterlambatan Deteksi Masalah.*** *Kendala di lapangan baru diketahui pusat setelah siklus laporan bulanan. Artinya masalah bisa terlambat **30 hari** untuk ditangani.*
>
> ***Ketiga, Evaluasi yang Subjektif.*** *Belum ada standarisasi indikator kuantitatif yang terotomasi antar kabupaten/kota. Semua masih bergantung pada narasi dan persepsi individu."*

⏱️ **Target waktu: 00:30 – 01:20**

---

### 🟡 SLIDE 3 — ANALISIS GAP SOLUSI EKSISTING (50 detik)
**[Presenter 1 — Ketua]**

> *"Lalu, apakah pemerintah belum punya sistem sama sekali? **Sudah ada**, tapi belum memadai.*
>
> ***e-Logbook KKP*** *fokusnya hanya pencatatan aktivitas kapal dan tangkapan ikan — bersifat **ship-side**. Sistem ini **tidak memantau** infrastruktur pesisir, cold storage, dan kelembagaan koperasi di darat.*
>
> ***Portal Satu Data KKP*** *mempublikasikan data agregat statistik perikanan, namun bersifat **historis dan pasif** — tanpa sistem deteksi dini dan tanpa mekanisme penentuan prioritas.*
>
> ***SIMKADA atau Krisna Bappenas*** *memantau serapan anggaran dan progres fisik proyek, namun **tidak memiliki analitik multi-kriteria** untuk evaluasi operasional berkelanjutan.*
>
> *Ketiga gap inilah yang dijawab oleh **KNMP SmartHub** — sebuah platform **Decision Intelligence** yang bukan hanya mencatat, tapi **berpikir dan memberi rekomendasi**."*

⏱️ **Target waktu: 01:20 – 02:10**

---

### 🔵 SLIDE 4 — SOLUSI: KNMP SMARTHUB (50 detik)
**[Presenter 1 — Ketua]**

> *"KNMP SmartHub hadir dengan **4 pilar solusi utama**:*
>
> ***Pertama, Dashboard Real-Time dan GIS Mapping*** *— Pemetaan spasial interaktif lokasi KNMP di seluruh Indonesia menggunakan Leaflet.js, dengan indikator warna status kesehatan otomatis: Hijau, Kuning, dan Merah.*
>
> ***Kedua, Decision Engine berbasis AHP-TOPSIS*** *— AHP menghitung skor **Health Index** berbobot dari 6 indikator kinerja, sementara TOPSIS meranking prioritas intervensi secara **objektif dan matematis**.*
>
> ***Ketiga, Early Warning System*** *— Sistem peringatan dini otomatis 3 level yang memicu notifikasi langsung ke pemangku kebijakan begitu KPI melewati ambang batas.*
>
> ***Dan Keempat, Automated Recommendation Engine*** *— Menghasilkan rekomendasi aksi tindak lanjut **per indikator** secara otomatis berdasarkan knowledge base standar pakar perikanan.*
>
> *Untuk membuktikan ini bukan sekadar konsep, izinkan **rekan saya mendemonstrasikan** sistem yang sudah beroperasi secara live."*

⏱️ **Target waktu: 02:10 – 03:00**

---

### 🖥️ LIVE DEMO PRODUK (3 menit 30 detik)
**[Presenter 2 — Programmer | Buka browser: knmpsmarthub.cloud]**

> [!IMPORTANT]
> **Pastikan sudah login sebelumnya!** Buka tab browser dengan akun Admin/KKP supaya tidak buang waktu login di depan juri. Siapkan juga tab cadangan dengan screenshot kalau internet bermasalah.

#### Demo Bagian 1 — Dashboard Nasional (60 detik)

> *"Terima kasih. Bapak/Ibu Juri, yang Anda lihat sekarang adalah **Dashboard Nasional KNMP SmartHub**.*
>
> *Di bagian atas, terlihat **ringkasan statistik real-time**: jumlah lokasi KNMP yang terpantau, total fasilitas aktif, dan **rata-rata Health Index nasional**.*
>
> *(TUNJUK Health Index Card)*
> *Skor **Health Index** ini dihitung secara dinamis dari agregasi 6 kriteria kinerja berbobot AHP. Status-nya otomatis berubah antara Sangat Baik, Baik, Perlu Perhatian, dan Kritis.*
>
> *(TUNJUK Radar Chart)*
> *Radar Chart ini menampilkan profil 6 dimensi KPI secara visual — sehingga pengambil kebijakan bisa langsung melihat **dimensi mana yang paling lemah** tanpa harus membaca spreadsheet panjang.*
>
> *(TUNJUK Early Warning Banner — jika muncul)*
> *Dan perhatikan banner merah di sini — ini adalah **Early Warning System** kami. Sistem mendeteksi ada **lokasi berstatus Kritis** yang butuh intervensi darurat, dan menampilkan peringatan ini secara otomatis."*

#### Demo Bagian 2 — Peta GIS (40 detik)

> *(KLIK menu Peta GIS)*
>
> *"Ini adalah **Peta Sebaran GIS** — menampilkan semua lokasi KNMP di Indonesia.*
>
> *Perhatikan **pin berwarna** di peta: **Hijau** artinya Normal, **Kuning** artinya Rawan, dan **Merah** artinya Kritis.*
>
> *(KLIK salah satu pin merah/kuning)*
> *Saat saya klik salah satu lokasi, muncul **detail singkat** status kesehatan lokasi tersebut.*
>
> *Dengan visualisasi ini, Direktorat KKP dan Dinas Kelautan Daerah bisa langsung melihat **hotspot masalah** di mana saja di seluruh Indonesia, secara real-time — bukan menunggu laporan bulanan."*

#### Demo Bagian 3 — Prioritas Intervensi TOPSIS (50 detik)

> *(KLIK menu Prioritas Intervensi)*
>
> *"Ini adalah halaman yang **paling bernilai** bagi pengambil kebijakan.*
>
> *Sistem kami menggunakan metode **TOPSIS** untuk meranking lokasi KNMP berdasarkan **Closeness Coefficient (CC Score)**.*
>
> *(TUNJUK tabel ranking)*
> *Perhatikan — lokasi dengan CC Score **paling rendah mendekati 0** berada di **peringkat 1**, artinya paling dekat dengan kondisi terburuk dan **paling mendesak** untuk menerima bantuan pemerintah.*
>
> *Setiap lokasi memiliki status urgensi otomatis: Sangat Urgent, Urgent, Sedang, hingga Rendah. Dan yang terpenting, ada tombol **Buka Analitik** untuk melihat detail rekomendasi per lokasi.*
>
> *(KLIK Buka Analitik / Detail salah satu lokasi kritis)*
> *Di sini kita bisa melihat **indikator mana yang bermasalah** dan sistem memberikan **rekomendasi tindak lanjut yang spesifik dan otomatis** — misalnya untuk Cold Storage rendah: jadwalkan audit fisik, sediakan subsidi genset darurat, dan sebagainya.*
>
> *Ini bukan narasi generik — ini adalah **instruksi konkret berbasis knowledge base** standar pakar perikanan."*

#### Demo Bagian 4 — Klik Kalkulasi Ulang (20 detik)

> *(KLIK tombol Kalkulasi Ulang)*
>
> *"Dan perhatikan tombol **Kalkulasi Ulang** ini. Begitu ada data baru masuk dari penyuluh di lapangan, admin atau KKP Pusat bisa menekan tombol ini, dan seluruh **Health Index dan ranking TOPSIS** dihitung ulang secara otomatis oleh backend kami dalam hitungan detik.*
>
> *Inilah yang membedakan kami dari sistem pelaporan pasif — **KNMP SmartHub berpikir, bukan hanya mencatat**."*

⏱️ **Target waktu: 03:00 – 06:30**

---

### 🟣 SLIDE 6 — DECISION ENGINE: AHP (45 detik)
**[Presenter 3 — Analis | Kembali ke PPT]**

> *"Terima kasih. Sekarang izinkan saya menjelaskan **fondasi ilmiah** di balik kalkulasi yang baru saja Anda saksikan.*
>
> *Kami menggunakan **6 KPI utama** dengan bobot yang dihitung melalui metode **AHP — Analytic Hierarchy Process**:*
> - *Produksi Perikanan: **35,1%** — bobot tertinggi karena menjadi indikator utama keberhasilan nelayan*
> - *Distribusi Tangkapan: **23,2%***
> - *Cold Storage dan Infrastruktur TPI masing-masing **13,8%***
> - *Aktivitas Koperasi: **8,7%***
> - *Kelengkapan Laporan: **5,2%***
>
> *Yang paling penting — uji konsistensi AHP kami menghasilkan **CR = 0,019**, jauh di bawah ambang batas 0,10. Artinya pembobotan ini **valid dan sangat konsisten** secara matematis.*
>
> *Health Index dihitung dari penjumlahan skor KPI dikali bobotnya, menghasilkan skor 0 sampai 100 dengan 4 klasifikasi status."*

⏱️ **Target waktu: 06:30 – 07:15**

---

### 🟤 SLIDE 7 — DECISION ENGINE: TOPSIS (40 detik)
**[Presenter 3 — Analis]**

> *"Untuk menentukan **lokasi mana yang paling prioritas**, kami menggunakan **TOPSIS**.*
>
> *Prinsipnya sederhana namun powerful — TOPSIS mengukur jarak setiap lokasi terhadap **Solusi Ideal Positif (A+)** dan **Solusi Ideal Negatif (A-)**, lalu menghitung **Closeness Coefficient**.*
>
> *CC mendekati **0** berarti lokasi tersebut paling kritis, CC mendekati **1** berarti lokasi tersebut sudah mandiri.*
>
> *Seperti simulasi yang ditampilkan — Palabuhanratu dengan CC 0,00 otomatis menjadi **prioritas utama** intervensi, sedangkan Bitung dengan CC 1,00 sudah dalam kondisi mandiri.*
>
> *Ranking ini sepenuhnya **objektif, kuantitatif, dan bebas bias kepentingan**."*

⏱️ **Target waktu: 07:15 – 07:55**

---

### ⚪ SLIDE 8 — ARSITEKTUR SISTEM (40 detik)
**[Presenter 2 — Programmer]**

> *"Dari sisi arsitektur, sistem kami mengakomodasi **hierarki pengguna pemerintahan** — mulai dari **Admin KKP Pusat (G2G)** yang mengakses agregasi nasional, **Operator Dinas Kelautan Daerah** yang memvalidasi laporan regional, hingga **Penyuluh Perikanan (G2E)** yang menginput data langsung dari lapangan.*
>
> *Untuk tata kelola, kami menerapkan **Audit Trail Terenkripsi** — setiap aktivitas tercatat permanen untuk akuntabilitas publik, serta **Quality Control** untuk mencegah anomali data.*
>
> *Tech stack kami: **React.js dengan Vite** di frontend, **Node.js Express** di backend, dan **PostgreSQL dengan Prisma ORM** sebagai database relasional yang menjamin integritas data pemerintahan."*

⏱️ **Target waktu: 07:55 – 08:35**

---

### 🟠 SLIDE 9 — PREDIKSI DAMPAK & SDGs (35 detik)
**[Presenter 3 — Analis]**

> *"Dengan hadirnya KNMP SmartHub, kami mentransformasi:*
> - *Kecepatan deteksi dari **siklus bulanan** menjadi **near real-time***
> - *Penentuan prioritas dari **subjektif** menjadi **objektif kuantitatif***
> - *Rekomendasi aksi dari **manual** menjadi **otomatis dan terstandar***
> - *Tata kelola data dari **tersebar di WhatsApp** menjadi **Single Source of Truth***
>
> *Karya ini berkontribusi pada **4 SDGs**: Kesejahteraan, Industri & Infrastruktur, Ekosistem Laut, dan Kelembagaan Akuntabel — serta mendukung **Visi Indonesia Emas 2045** di bidang Blue Economy."*

⏱️ **Target waktu: 08:35 – 09:10**

---

### 🔷 SLIDE 10 — ROADMAP (25 detik)
**[Presenter 1 — Ketua]**

> *"Roadmap implementasi kami berjenjang:*
> - *Tahun pertama: validasi prototipe dan kesepahaman dengan instansi*
> - *Tahun kedua: pilot project di 65 lokasi*
> - *Tahun ketiga: roll-out di seluruh Pulau Jawa*
> - *Tahun keempat hingga kelima: **ekspansi penuh nasional** untuk 1.000 lokasi KNMP."*

⏱️ **Target waktu: 09:10 – 09:35**

---

### 🟢 SLIDE 11 — KESIMPULAN (15 detik)
**[Presenter 1 — Ketua]**

> *"Sebagai kesimpulan, KNMP SmartHub menawarkan 3 nilai utama:*
> ***Terintegrasi*** *sebagai Single Source of Truth,*
> ***Objektif dan Akuntabel*** *melalui Decision Intelligence berbasis AHP-TOPSIS,*
> *dan **Proaktif serta Tepat Sasaran*** *melalui Early Warning dan rekomendasi otomatis."*

⏱️ **Target waktu: 09:35 – 09:50**

---

### 🏁 SLIDE 12 — PENUTUP (10 detik)
**[Presenter 1 — Ketua]**

> *"**Data Cerdas, Keputusan Tepat, Nelayan Sejahtera Menuju Indonesia Emas 2045.***
>
> *Demikian presentasi kami. Terima kasih atas perhatiannya, Bapak/Ibu Juri.*
>
> *Wassalamualaikum Wr. Wb."*

⏱️ **Target waktu: 09:50 – 10:00 ✅**

---

## ⚡ TIPS DELIVERY

### Sebelum Presentasi
- [ ] **Buka browser** dan login ke knmpsmarthub.cloud (akun Admin/KKP) — **jangan login saat presentasi**
- [ ] **Siapkan tab cadangan** dengan screenshot semua halaman — kalau internet mati, bisa tunjukkan screenshot
- [ ] **Share screen PPT dulu**, nanti saat demo **switch ke browser** — latih transisi ini supaya mulus
- [ ] **Tes koneksi Zoom** minimal 30 menit sebelum giliran

### Saat Presentasi
- 🎯 **Bicara dengan energi** — juri menilai "Cara dan sikap presentasi"
- 🎯 **Kontak mata ke kamera** (bukan ke layar) saat bicara lewat Zoom
- 🎯 **Tekankan kata kunci** dengan nada lebih kuat: "Decision Intelligence", "Real-time", "Objektif", "Single Source of Truth"
- 🎯 Saat demo, **gerakkan kursor** untuk menunjuk elemen yang sedang dijelaskan
- 🎯 **Jangan baca layar** — narasi di atas adalah panduan, bukan teks yang harus dihafal kata per kata

### Timing
- ⏰ Latih beberapa kali — target **selesai di menit 9:50**, sisakan buffer 10 detik
- ⏰ Jika sudah menit ke-8 dan belum selesai demo, **langsung skip** ke slide Kesimpulan
- ⏰ Bagian yang **paling boleh dipotong** jika waktu mepet: Slide 10 (Roadmap)
- ⏰ Bagian yang **TIDAK BOLEH dipotong**: Live Demo dan Slide AHP/TOPSIS (ini inti keunikan karya)

---

## 📋 RINGKASAN ALOKASI WAKTU

| Waktu | Durasi | Konten | Presenter |
|---|---|---|---|
| 00:00 – 00:30 | 30" | Slide 1: Cover & Perkenalan | Ketua |
| 00:30 – 01:20 | 50" | Slide 2: Urgensi Masalah | Ketua |
| 01:20 – 02:10 | 50" | Slide 3: Gap Analysis | Ketua |
| 02:10 – 03:00 | 50" | Slide 4: Solusi 4 Pilar | Ketua |
| 03:00 – 06:30 | **3'30"** | **🖥️ LIVE DEMO PRODUK** | Programmer |
| 06:30 – 07:15 | 45" | Slide 6: AHP | Analis |
| 07:15 – 07:55 | 40" | Slide 7: TOPSIS | Analis |
| 07:55 – 08:35 | 40" | Slide 8: Arsitektur | Programmer |
| 08:35 – 09:10 | 35" | Slide 9: Dampak & SDGs | Analis |
| 09:10 – 09:35 | 25" | Slide 10: Roadmap | Ketua |
| 09:35 – 09:50 | 15" | Slide 11: Kesimpulan | Ketua |
| 09:50 – 10:00 | 10" | Slide 12: Penutup | Ketua |
