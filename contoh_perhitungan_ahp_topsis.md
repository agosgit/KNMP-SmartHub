# Contoh Perhitungan AHP dan TOPSIS: KNMP SmartHub
## Kategori: Hackathon (KMIPN 2026)

Dokumen ini berisi simulasi perhitungan lengkap metode **AHP (Analytic Hierarchy Process)** untuk pembobotan KPI dan **TOPSIS (Technique for Order of Preference by Similarity to Ideal Solution)** untuk penentuan prioritas lokasi KNMP. Seluruh rumus ditulis menggunakan format teks biasa agar mudah dibaca oleh aplikasi pembaca markdown apa pun.

---

## 1. Data Kriteria dan Alternatif

### A. Kriteria Evaluasi (KPI)
Ada 6 kriteria yang digunakan untuk menilai performa lokasi KNMP:
1. **C1 - Produksi Perikanan** (Volume hasil tangkapan)
2. **C2 - Distribusi** (Efektivitas rantai pasok pemasaran)
3. **C3 - Cold Storage** (Optimalisasi fasilitas pendingin)
4. **C4 - Infrastruktur** (Kondisi dermaga & TPI)
5. **C5 - Koperasi** (Aktivitas koperasi nelayan)
6. **C6 - Pelaporan** (Kedisiplinan laporan bulanan)

*Semua kriteria di atas bersifat **Benefit** (semakin tinggi nilainya, semakin baik).*

### B. Alternatif Lokasi KNMP (Sampel)
Untuk menyederhanakan perhitungan, kita gunakan 3 contoh lokasi KNMP dengan nilai kinerja (skala 0–100):
1. **K-01 (Muara Baru)**
   * Produksi = 82 | Distribusi = 75 | Cold Storage = 88 | Infrastruktur = 70 | Koperasi = 65 | Pelaporan = 90
2. **K-04 (Bitung)**
   * Produksi = 90 | Distribusi = 85 | Cold Storage = 78 | Infrastruktur = 88 | Koperasi = 80 | Pelaporan = 95
3. **K-05 (Palabuhanratu)**
   * Produksi = 48 | Distribusi = 38 | Cold Storage = 35 | Infrastruktur = 42 | Koperasi = 30 | Pelaporan = 55

---

## 2. Bagian I: Perhitungan AHP (Pembobotan Kriteria)

AHP digunakan untuk mencari seberapa penting masing-masing kriteria berdasarkan penilaian pakar perikanan.

### Langkah 1: Membuat Matriks Perbandingan Berpasangan (Pairwise Comparison)
Skala penilaian pakar (1 = Sama penting, 3 = Sedikit lebih penting, 5 = Lebih penting, dst):

| Kriteria | C1 (Prod) | C2 (Dist) | C3 (Cold) | C4 (Infra) | C5 (Kop) | C6 (Lapor) |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **C1** | 1,000 | 2,000 | 3,000 | 3,000 | 3,000 | 5,000 |
| **C2** | 0,500 | 1,000 | 2,000 | 2,000 | 3,000 | 4,000 |
| **C3** | 0,333 | 0,500 | 1,000 | 1,000 | 2,000 | 3,000 |
| **C4** | 0,333 | 0,500 | 1,000 | 1,000 | 2,000 | 3,000 |
| **C5** | 0,333 | 0,333 | 0,500 | 0,500 | 1,000 | 2,000 |
| **C6** | 0,200 | 0,250 | 0,333 | 0,333 | 0,500 | 1,000 |
| **Jumlah** | **2,700** | **4,583** | **7,833** | **7,833** | **11,500** | **18,000** |

*(Jumlah kolom C1 = 1 + 0.5 + 0.333 + 0.333 + 0.333 + 0.2 = 2.7)*

### Langkah 2: Normalisasi Matriks AHP
Bagi setiap sel dengan jumlah total kolomnya. 
*Contoh C1-C1 = 1.0 / 2.7 = 0.370*

Setelah dibagi semua, hitung nilai rata-rata dari setiap baris untuk mendapatkan **Bobot Prioritas Kriteria (w)**:

| Kriteria | C1 | C2 | C3 | C4 | C5 | C6 | **Rata-rata (Bobot Akhir)** |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **C1** | 0,370 | 0,436 | 0,383 | 0,383 | 0,261 | 0,278 | **w1 = 0,352** |
| **C2** | 0,185 | 0,218 | 0,255 | 0,255 | 0,261 | 0,222 | **w2 = 0,233** |
| **C3** | 0,123 | 0,109 | 0,128 | 0,128 | 0,174 | 0,167 | **w3 = 0,138** |
| **C4** | 0,123 | 0,109 | 0,128 | 0,128 | 0,174 | 0,167 | **w4 = 0,138** |
| **C5** | 0,123 | 0,073 | 0,064 | 0,064 | 0,087 | 0,111 | **w5 = 0,087** |
| **C6** | 0,074 | 0,055 | 0,043 | 0,043 | 0,043 | 0,056 | **w6 = 0,052** |

Maka didapatkan **Vektor Bobot Kriteria (w)**:
* **Produksi (w1) = 0,352**
* **Distribusi (w2) = 0,233**
* **Cold Storage (w3) = 0,138**
* **Infrastruktur (w4) = 0,138**
* **Koperasi (w5) = 0,087**
* **Pelaporan (w6) = 0,052**

### Langkah 3: Uji Konsistensi (Consistency Ratio - CR)
Untuk memastikan jawaban pakar konsisten:

1. Hitung Lambda Maksimum (L_maks):
   `L_maks = jumlah kolom * bobot kriteria`
   `L_maks = (2.700 * 0.352) + (4.583 * 0.233) + (7.833 * 0.138) + (7.833 * 0.138) + (11.500 * 0.087) + (18.000 * 0.052) = 6.121`

2. Hitung Consistency Index (CI):
   `CI = (L_maks - n) / (n - 1)`  *(di mana n = jumlah kriteria = 6)*
   `CI = (6.121 - 6) / (6 - 1) = 0.121 / 5 = 0.024`

3. Hitung Consistency Ratio (CR) menggunakan Random Index (RI) Saaty untuk n=6 adalah 1.24:
   `CR = CI / RI`
   `CR = 0.024 / 1.24 = 0.019`

Karena **CR = 0.019 (kurang dari 0.10)**, matriks perbandingan ini dinyatakan **Konsisten** dan bobot AHP valid untuk digunakan pada perhitungan TOPSIS.

---

## 3. Bagian II: Perhitungan TOPSIS (Perangkingan Prioritas)

### Langkah 1: Membuat Matriks Keputusan (D)
Data kinerja dari 3 sampel lokasi KNMP:

| Kode | Nama KNMP | C1 (Prod) | C2 (Dist) | C3 (Cold) | C4 (Infra) | C5 (Kop) | C6 (Lapor) |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **K-01** | Muara Baru | 82 | 75 | 88 | 70 | 65 | 90 |
| **K-04** | Bitung | 90 | 85 | 78 | 88 | 80 | 95 |
| **K-05** | Palabuhanratu | 48 | 38 | 35 | 42 | 30 | 55 |

### Langkah 2: Normalisasi Matriks Keputusan (r)
Tujuan normalisasi adalah mengubah nilai dari skala yang berbeda menjadi skala seragam antara 0 dan 1.

`Rumus r = Nilai_Lokasi / akar( jumlah nilai kuadrat kolom tersebut )`

**Proses perhitungan pembagi (akar jumlah kuadrat):**
* Kolom C1 (Produksi): `akar( 82^2 + 90^2 + 48^2 ) = akar( 6724 + 8100 + 2304 ) = akar( 17128 ) = 130.87`
* Kolom C2 (Distribusi): `akar( 75^2 + 85^2 + 38^2 ) = akar( 5625 + 7225 + 1444 ) = akar( 14294 ) = 119.56`
* Kolom C3 (Cold Storage): `akar( 88^2 + 78^2 + 35^2 ) = akar( 7744 + 6084 + 1225 ) = akar( 15053 ) = 122.69`
* Kolom C4 (Infrastruktur): `akar( 70^2 + 88^2 + 42^2 ) = akar( 4900 + 7744 + 1764 ) = akar( 14408 ) = 120.03`
* Kolom C5 (Koperasi): `akar( 65^2 + 80^2 + 30^2 ) = akar( 4225 + 6400 + 900 ) = akar( 11525 ) = 107.35`
* Kolom C6 (Pelaporan): `akar( 90^2 + 95^2 + 55^2 ) = akar( 8100 + 9025 + 3025 ) = akar( 20150 ) = 141.95`

**Matriks Ternormalisasi (r):**
*Untuk K-01 kolom C1:* `82 / 130.87 = 0.627`
*Untuk K-05 kolom C1:* `48 / 130.87 = 0.367`

Tabel lengkap matriks ternormalisasi (r):

| Kode | C1 (Prod) | C2 (Dist) | C3 (Cold) | C4 (Infra) | C5 (Kop) | C6 (Lapor) |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **K-01** | 0,627 | 0,627 | 0,717 | 0,583 | 0,606 | 0,634 |
| **K-04** | 0,688 | 0,711 | 0,636 | 0,733 | 0,745 | 0,669 |
| **K-05** | 0,367 | 0,318 | 0,285 | 0,350 | 0,279 | 0,387 |

### Langkah 3: Membuat Matriks Ternormalisasi Terbobot (v)
Kalikan setiap nilai ternormalisasi (r) dengan bobot AHP (w) masing-masing kolom.

`Rumus v = r * bobot_AHP`

* **Bobot AHP:** w = [0.352, 0.233, 0.138, 0.138, 0.087, 0.052]
* *Contoh K-01 kolom C1:* `0.627 * 0.352 = 0.221`
* *Contoh K-05 kolom C1:* `0.367 * 0.352 = 0.129`

Tabel lengkap matriks terbobot (v):

| Kode | C1 (Prod) | C2 (Dist) | C3 (Cold) | C4 (Infra) | C5 (Kop) | C6 (Lapor) |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **K-01** | 0,221 | 0,146 | 0,099 | 0,080 | 0,053 | 0,033 |
| **K-04** | 0,242 | 0,166 | 0,088 | 0,101 | 0,065 | 0,035 |
| **K-05** | 0,129 | 0,074 | 0,039 | 0,048 | 0,024 | 0,020 |

### Langkah 4: Menentukan Solusi Ideal Positif (A+) dan Solusi Ideal Negatif (A-)
Karena seluruh kriteria bertipe *Benefit* (makin besar makin bagus):
* **A+ (Solusi Terbaik)** = ambil nilai **maksimum** dari setiap kolom.
* **A- (Solusi Terburuk)** = ambil nilai **minimum** dari setiap kolom.

| Solusi Ideal | C1 (Prod) | C2 (Dist) | C3 (Cold) | C4 (Infra) | C5 (Kop) | C6 (Lapor) |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **A+ (Terbaik)** | **0,242** | **0,166** | **0,099** | **0,101** | **0,065** | **0,035** |
| **A- (Terburuk)** | **0,129** | **0,074** | **0,039** | **0,048** | **0,024** | **0,020** |

### Langkah 5: Menghitung Jarak ke Solusi Ideal Positif (D+) dan Solusi Ideal Negatif (D-)
Menggunakan rumus jarak Euclidean:

* `D+ = akar( jumlah dari (Nilai_Terbobot_Lokasi - Nilai_A+)^2 )`
* `D- = akar( jumlah dari (Nilai_Terbobot_Lokasi - Nilai_A-)^2 )`

**K-01 (Muara Baru):**
* `D+ = akar( (0.221-0.242)^2 + (0.146-0.166)^2 + (0.099-0.099)^2 + (0.080-0.101)^2 + (0.053-0.065)^2 + (0.033-0.035)^2 )`
  `D+ = akar( (-0.021)^2 + (-0.020)^2 + (0)^2 + (-0.021)^2 + (-0.012)^2 + (-0.002)^2 )`
  `D+ = akar( 0.000441 + 0.000400 + 0 + 0.000441 + 0.000144 + 0.000004 )`
  `D+ = akar( 0.001430 ) = 0.0378`
* `D- = akar( (0.221-0.129)^2 + (0.146-0.074)^2 + (0.099-0.039)^2 + (0.080-0.048)^2 + (0.053-0.024)^2 + (0.033-0.020)^2 )`
  `D- = akar( (0.092)^2 + (0.072)^2 + (0.060)^2 + (0.032)^2 + (0.029)^2 + (0.013)^2 )`
  `D- = akar( 0.008464 + 0.005184 + 0.003600 + 0.001024 + 0.000841 + 0.000169 )`
  `D- = akar( 0.019282 ) = 0.1389`

**K-04 (Bitung) — Kondisi Terbaik:**
* `D+ = 0.0000` (karena nilainya sama persis dengan batas ideal terbaik A+)
* `D- = akar( (0.242-0.129)^2 + (0.166-0.074)^2 + (0.088-0.039)^2 + (0.101-0.048)^2 + (0.065-0.024)^2 + (0.035-0.020)^2 )`
  `D- = 0.1610`

**K-05 (Palabuhanratu) — Kondisi Terburuk:**
* `D+ = akar( (0.129-0.242)^2 + (0.074-0.166)^2 + (0.039-0.099)^2 + (0.048-0.101)^2 + (0.024-0.065)^2 + (0.020-0.035)^2 )`
  `D+ = 0.1610`
* `D- = 0.0000` (karena nilainya sama persis dengan batas ideal terburuk A-)

### Langkah 6: Menghitung Kedekatan Relatif (Skor CC) dan Perangkingan
Skor CC berkisar antara 0 sampai 1.

`Rumus Skor CC = D- / (D+ + D-)`

* **K-04 (Bitung)**: `0.1610 / (0.0000 + 0.1610) = 1.000`
* **K-01 (Muara Baru)**: `0.1389 / (0.0378 + 0.1389) = 0.1389 / 0.1767 = 0.786`
* **K-05 (Palabuhanratu)**: `0.0000 / (0.1610 + 0.0000) = 0.000`

---

## 4. Kesimpulan Output Prioritas Intervensi

Di dalam platform **KNMP SmartHub**, karena tujuannya adalah memetakan lokasi yang paling kritis untuk segera dibantu (intervensi), kita mengurutkan rangking dari **Skor CC terkecil (mendekati 0)**:

| Ranking Prioritas | Kode Lokasi | Nama KNMP | Skor CC | Status Kelayakan | Tindakan Pemerintah |
| :---: | :---: |---| :---: | :---: |---|
| **🥇 Rank 1** | **K-05** | **KNMP Palabuhanratu** | **0.000** | 🔴 Kritis | **Prioritas Utama Intervensi Anggaran & Perbaikan Fasilitas** |
| **🥈 Rank 2** | **K-01** | **KNMP Muara Baru** | **0.786** | 🟢 Baik | Pemeliharaan berkala dan pembinaan rutin |
| **🥉 Rank 3** | **K-04** | **KNMP Bitung** | **1.000** | 🟢 Sangat Baik | Mandiri dan layak dijadikan lokasi percontohan (*Role Model*) |
