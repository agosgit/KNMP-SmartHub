# Kalkulasi Konkret: KNMP Health Index & TOPSIS Ranking
## KNMP SmartHub — Decision Engine Example

---

## 1. Data Simulasi Operasional KNMP

Berikut adalah contoh data operasional dari **6 lokasi KNMP** selama periode Mei 2026.  
Nilai setiap indikator sudah dinormalisasi ke rentang **0–100** berdasarkan rumus standarisasi min-max.

| Kode | Nama KNMP | Provinsi | Produksi | Distribusi | Cold Storage | Infrastruktur | Koperasi | Pelaporan |
|------|-----------|----------|----------|------------|--------------|---------------|----------|-----------|
| K-01 | KNMP Muara Baru | DKI Jakarta | 82 | 75 | 88 | 70 | 65 | 90 |
| K-02 | KNMP Brondong | Jawa Timur | 55 | 60 | 45 | 50 | 40 | 70 |
| K-03 | KNMP Belawan | Sumatera Utara | 70 | 65 | 72 | 68 | 72 | 80 |
| K-04 | KNMP Bitung | Sulawesi Utara | 90 | 85 | 78 | 88 | 80 | 95 |
| K-05 | KNMP Palabuhanratu | Jawa Barat | 48 | 38 | 35 | 42 | 30 | 55 |
| K-06 | KNMP Ternate | Maluku Utara | 62 | 55 | 60 | 58 | 55 | 65 |

**Keterangan indikator (skala 0–100):**
- **Produksi** — Volume hasil tangkapan / target produksi × 100
- **Distribusi** — Proporsi ikan terdistribusi terhadap total produksi × 100
- **Cold Storage** — Utilisasi cold storage (nilai > 90 = overload, menjadi negatif)
- **Infrastruktur** — Persentase fasilitas aktif digunakan dari total fasilitas tersedia
- **Koperasi** — Tingkat aktivitas koperasi (jumlah transaksi, anggota aktif, dll.)
- **Pelaporan** — Kelengkapan & ketepatan waktu laporan bulanan (%)

---

## 2. Bobot KPI menggunakan AHP

### 2.1 Penentuan Bobot dengan AHP

Bobot setiap kriteria ditentukan melalui **Analytic Hierarchy Process (AHP)** berdasarkan penilaian pakar (penyuluh KKP dan akademisi perikanan).

#### Matriks Perbandingan Berpasangan (Pairwise Comparison)

Skala: 1 = sama penting, 3 = sedikit lebih penting, 5 = lebih penting, 7 = sangat lebih penting, 9 = mutlak lebih penting.

|  | Produksi | Distribusi | Cold Storage | Infrastruktur | Koperasi | Pelaporan |
|--|----------|------------|--------------|---------------|----------|-----------|
| **Produksi** | 1 | 2 | 3 | 3 | 3 | 5 |
| **Distribusi** | 1/2 | 1 | 2 | 2 | 3 | 4 |
| **Cold Storage** | 1/3 | 1/2 | 1 | 1 | 2 | 3 |
| **Infrastruktur** | 1/3 | 1/2 | 1 | 1 | 2 | 3 |
| **Koperasi** | 1/3 | 1/3 | 1/2 | 1/2 | 1 | 2 |
| **Pelaporan** | 1/5 | 1/4 | 1/3 | 1/3 | 1/2 | 1 |

#### Langkah AHP:

**Step 1 — Jumlah setiap kolom:**

| Kolom | Produksi | Distribusi | Cold Storage | Infrastruktur | Koperasi | Pelaporan |
|-------|----------|------------|--------------|---------------|----------|-----------|
| **Jumlah** | 2,733 | 4,583 | 7,833 | 7,833 | 11,5 | 18,0 |

**Step 2 — Normalisasi (bagi setiap elemen dengan jumlah kolom):**

| Kriteria | Produksi | Distribusi | Cold Storage | Infrastruktur | Koperasi | Pelaporan | **Rata-rata (Bobot)** |
|----------|----------|------------|--------------|---------------|----------|-----------|----------------------|
| Produksi | 0,366 | 0,436 | 0,383 | 0,383 | 0,261 | 0,278 | **0,351** |
| Distribusi | 0,183 | 0,218 | 0,255 | 0,255 | 0,261 | 0,222 | **0,232** |
| Cold Storage | 0,122 | 0,109 | 0,128 | 0,128 | 0,174 | 0,167 | **0,138** |
| Infrastruktur | 0,122 | 0,109 | 0,128 | 0,128 | 0,174 | 0,167 | **0,138** |
| Koperasi | 0,122 | 0,073 | 0,064 | 0,064 | 0,087 | 0,111 | **0,087** |
| Pelaporan | 0,073 | 0,055 | 0,043 | 0,043 | 0,043 | 0,056 | **0,052** |

**Hasil Bobot AHP:**

| Kriteria | Bobot AHP | Bobot (%) |
|----------|-----------|-----------|
| Produksi Perikanan | **0,351** | 35,1% |
| Distribusi | **0,232** | 23,2% |
| Cold Storage | **0,138** | 13,8% |
| Infrastruktur | **0,138** | 13,8% |
| Koperasi | **0,087** | 8,7% |
| Pelaporan | **0,052** | 5,2% |
| **Total** | **1,000** | **100%** |

**Step 3 — Uji Konsistensi (Consistency Ratio):**

```
λ_max = Σ (jumlah kolom × bobot kriteria)
      = (2,733 × 0,351) + (4,583 × 0,232) + (7,833 × 0,138)
      + (7,833 × 0,138) + (11,5 × 0,087) + (18,0 × 0,052)
      = 0,959 + 1,063 + 1,081 + 1,081 + 1,001 + 0,936
      = 6,121

CI  = (λ_max - n) / (n - 1)
    = (6,121 - 6) / (6 - 1)
    = 0,121 / 5
    = 0,024

RI  = 1,24  (nilai acak untuk n=6, tabel Saaty)

CR  = CI / RI
    = 0,024 / 1,24
    = 0,019 ✅
```

> **CR = 0,019 < 0,10** → Matriks perbandingan **KONSISTEN** dan bobot AHP valid digunakan.

---

## 3. Kalkulasi KNMP Health Index

### Formula Health Index

```
Health Index = (Produksi × 0,351) + (Distribusi × 0,232) + 
               (Cold Storage × 0,138) + (Infrastruktur × 0,138) +
               (Koperasi × 0,087) + (Pelaporan × 0,052)
```

### Perhitungan per Lokasi

#### K-01 — KNMP Muara Baru (DKI Jakarta)
```
Health Index = (82 × 0,351) + (75 × 0,232) + (88 × 0,138) + 
               (70 × 0,138) + (65 × 0,087) + (90 × 0,052)
             = 28,782 + 17,400 + 12,144 + 9,660 + 5,655 + 4,680
             = 78,32  → Status: BAIK 🟢
```

#### K-02 — KNMP Brondong (Jawa Timur)
```
Health Index = (55 × 0,351) + (60 × 0,232) + (45 × 0,138) + 
               (50 × 0,138) + (40 × 0,087) + (70 × 0,052)
             = 19,305 + 13,920 + 6,210 + 6,900 + 3,480 + 3,640
             = 53,46  → Status: PERLU PERHATIAN 🟡
```

#### K-03 — KNMP Belawan (Sumatera Utara)
```
Health Index = (70 × 0,351) + (65 × 0,232) + (72 × 0,138) + 
               (68 × 0,138) + (72 × 0,087) + (80 × 0,052)
             = 24,570 + 15,080 + 9,936 + 9,384 + 6,264 + 4,160
             = 69,39  → Status: MODERAT 🟡
```

#### K-04 — KNMP Bitung (Sulawesi Utara)
```
Health Index = (90 × 0,351) + (85 × 0,232) + (78 × 0,138) + 
               (88 × 0,138) + (80 × 0,087) + (95 × 0,052)
             = 31,590 + 19,720 + 10,764 + 12,144 + 6,960 + 4,940
             = 86,12  → Status: SANGAT BAIK 🟢
```

#### K-05 — KNMP Palabuhanratu (Jawa Barat)
```
Health Index = (48 × 0,351) + (38 × 0,232) + (35 × 0,138) + 
               (42 × 0,138) + (30 × 0,087) + (55 × 0,052)
             = 16,848 + 8,816 + 4,830 + 5,796 + 2,610 + 2,860
             = 41,76  → Status: KRITIS 🔴
```

#### K-06 — KNMP Ternate (Maluku Utara)
```
Health Index = (62 × 0,351) + (55 × 0,232) + (60 × 0,138) + 
               (58 × 0,138) + (55 × 0,087) + (65 × 0,052)
             = 21,762 + 12,760 + 8,280 + 8,004 + 4,785 + 3,380
             = 58,97  → Status: PERLU PERHATIAN 🟡
```

### Ringkasan KNMP Health Index

| Kode | Nama KNMP | Health Index | Status |
|------|-----------|:------------:|--------|
| K-04 | KNMP Bitung | **86,12** | 🟢 SANGAT BAIK |
| K-01 | KNMP Muara Baru | **78,32** | 🟢 BAIK |
| K-03 | KNMP Belawan | **69,39** | 🟡 MODERAT |
| K-06 | KNMP Ternate | **58,97** | 🟡 PERLU PERHATIAN |
| K-02 | KNMP Brondong | **53,46** | 🟡 PERLU PERHATIAN |
| K-05 | KNMP Palabuhanratu | **41,76** | 🔴 KRITIS |

**Klasifikasi Health Index:**
- 🟢 **80–100**: Sangat Baik — implementasi berjalan optimal
- 🟡 **60–79**: Baik — ada beberapa aspek yang perlu ditingkatkan  
- 🟡 **40–59**: Perlu Perhatian — intervensi moderat diperlukan
- 🔴 **0–39**: Kritis — intervensi segera dan prioritas tinggi

---

## 4. Penentuan Prioritas Intervensi dengan TOPSIS

TOPSIS (*Technique for Order Preference by Similarity to Ideal Solution*) digunakan untuk menentukan **urutan prioritas intervensi** dengan mempertimbangkan seluruh kriteria secara bersamaan.

> **Logika**: Lokasi KNMP yang paling jauh dari kondisi ideal (A+) dan paling dekat dengan kondisi terburuk (A-) → **paling prioritas untuk diintervensi.**

### Step 1 — Matriks Keputusan (D)

Data mentah dari 6 lokasi KNMP:

| Kode | Produksi (C1) | Distribusi (C2) | Cold Storage (C3) | Infrastruktur (C4) | Koperasi (C5) | Pelaporan (C6) |
|------|:---:|:---:|:---:|:---:|:---:|:---:|
| K-01 | 82 | 75 | 88 | 70 | 65 | 90 |
| K-02 | 55 | 60 | 45 | 50 | 40 | 70 |
| K-03 | 70 | 65 | 72 | 68 | 72 | 80 |
| K-04 | 90 | 85 | 78 | 88 | 80 | 95 |
| K-05 | 48 | 38 | 35 | 42 | 30 | 55 |
| K-06 | 62 | 55 | 60 | 58 | 55 | 65 |

**Tipe kriteria**: Semua kriteria bertipe **Benefit** (semakin tinggi, semakin baik).  
*Catatan: Cold Storage bertipe Benefit karena nilai sudah dinormalisasi (utilisasi optimal, bukan overload).*

---

### Step 2 — Normalisasi Matriks (r_ij)

Formula normalisasi:

```
r_ij = x_ij / √(Σ x_kj²)
```

**Hitung akar jumlah kuadrat setiap kolom:**

| Kolom | C1 (Produksi) | C2 (Distribusi) | C3 (Cold Storage) | C4 (Infrastruktur) | C5 (Koperasi) | C6 (Pelaporan) |
|-------|:---:|:---:|:---:|:---:|:---:|:---:|
| K-01² | 6.724 | 5.625 | 7.744 | 4.900 | 4.225 | 8.100 |
| K-02² | 3.025 | 3.600 | 2.025 | 2.500 | 1.600 | 4.900 |
| K-03² | 4.900 | 4.225 | 5.184 | 4.624 | 5.184 | 6.400 |
| K-04² | 8.100 | 7.225 | 6.084 | 7.744 | 6.400 | 9.025 |
| K-05² | 2.304 | 1.444 | 1.225 | 1.764 | 900 | 3.025 |
| K-06² | 3.844 | 3.025 | 3.600 | 3.364 | 3.025 | 4.225 |
| **Σx²** | **28.897** | **25.144** | **25.862** | **24.896** | **21.334** | **35.675** |
| **√Σx²** | **170,0** | **158,6** | **160,8** | **157,8** | **146,1** | **188,9** |

**Matriks Ternormalisasi (r_ij):**

| Kode | r_C1 | r_C2 | r_C3 | r_C4 | r_C5 | r_C6 |
|------|:---:|:---:|:---:|:---:|:---:|:---:|
| K-01 | 0,4824 | 0,4729 | 0,5473 | 0,4436 | 0,4449 | 0,4764 |
| K-02 | 0,3235 | 0,3783 | 0,2798 | 0,3168 | 0,2738 | 0,3706 |
| K-03 | 0,4118 | 0,4100 | 0,4478 | 0,4309 | 0,4928 | 0,4235 |
| K-04 | 0,5294 | 0,5360 | 0,4851 | 0,5576 | 0,5477 | 0,5029 |
| K-05 | 0,2824 | 0,2397 | 0,2177 | 0,2662 | 0,2053 | 0,2912 |
| K-06 | 0,3647 | 0,3469 | 0,3731 | 0,3676 | 0,3764 | 0,3441 |

---

### Step 3 — Matriks Terbobot (v_ij)

Kalikan setiap nilai normalisasi dengan bobot AHP:

```
v_ij = w_j × r_ij
```

Bobot: **w = [0,351 ; 0,232 ; 0,138 ; 0,138 ; 0,087 ; 0,052]**

| Kode | v_C1 | v_C2 | v_C3 | v_C4 | v_C5 | v_C6 |
|------|:---:|:---:|:---:|:---:|:---:|:---:|
| K-01 | 0,1693 | 0,1097 | 0,0755 | 0,0612 | 0,0387 | 0,0248 |
| K-02 | 0,1136 | 0,0878 | 0,0386 | 0,0437 | 0,0238 | 0,0193 |
| K-03 | 0,1445 | 0,0951 | 0,0618 | 0,0595 | 0,0429 | 0,0220 |
| K-04 | 0,1858 | 0,1244 | 0,0669 | 0,0769 | 0,0477 | 0,0262 |
| K-05 | 0,0991 | 0,0556 | 0,0300 | 0,0367 | 0,0179 | 0,0151 |
| K-06 | 0,1280 | 0,0805 | 0,0515 | 0,0507 | 0,0327 | 0,0179 |

---

### Step 4 — Solusi Ideal Positif (A+) dan Negatif (A-)

```
A+ = nilai MAKSIMUM setiap kolom (kondisi ideal terbaik)
A- = nilai MINIMUM setiap kolom (kondisi ideal terburuk)
```

| Solusi | v_C1 | v_C2 | v_C3 | v_C4 | v_C5 | v_C6 |
|--------|:---:|:---:|:---:|:---:|:---:|:---:|
| **A+ (Ideal Positif)** | **0,1858** | **0,1244** | **0,0755** | **0,0769** | **0,0477** | **0,0262** |
| **A- (Ideal Negatif)** | **0,0991** | **0,0556** | **0,0300** | **0,0367** | **0,0179** | **0,0151** |

---

### Step 5 — Jarak Euclidean ke A+ dan A-

**Jarak ke A+ (D+):**
```
D+_i = √[ Σ (v_ij - A+_j)² ]
```

**Jarak ke A- (D-):**
```
D-_i = √[ Σ (v_ij - A-_j)² ]
```

#### Perhitungan D+ dan D- secara detail:

**K-01 (Muara Baru):**
```
D+_K01 = √[(0,1693-0,1858)²+(0,1097-0,1244)²+(0,0755-0,0755)²+
           (0,0612-0,0769)²+(0,0387-0,0477)²+(0,0248-0,0262)²]
        = √[0,000272 + 0,000216 + 0 + 0,000246 + 0,000081 + 0,000002]
        = √0,000817 = 0,0286

D-_K01 = √[(0,1693-0,0991)²+(0,1097-0,0556)²+(0,0755-0,0300)²+
           (0,0612-0,0367)²+(0,0387-0,0179)²+(0,0248-0,0151)²]
        = √[0,004928 + 0,002925 + 0,002070 + 0,000600 + 0,000433 + 0,000094]
        = √0,011050 = 0,1051
```

**K-05 (Palabuhanratu) — Lokasi Paling Kritis:**
```
D+_K05 = √[(0,0991-0,1858)²+(0,0556-0,1244)²+(0,0300-0,0755)²+
           (0,0367-0,0769)²+(0,0179-0,0477)²+(0,0151-0,0262)²]
        = √[0,007517 + 0,004732 + 0,002070 + 0,001616 + 0,000888 + 0,000123]
        = √0,016946 = 0,1302

D-_K05 = √[(0,0991-0,0991)²+(0,0556-0,0556)²+(0,0300-0,0300)²+
           (0,0367-0,0367)²+(0,0179-0,0179)²+(0,0151-0,0151)²]
        = √0 = 0,0000
```

#### Tabel Ringkasan Jarak:

| Kode | Nama KNMP | D+ (jarak ke ideal+) | D- (jarak ke ideal-) |
|------|-----------|:---:|:---:|
| K-01 | Muara Baru | 0,0286 | 0,1051 |
| K-02 | Brondong | 0,0943 | 0,0422 |
| K-03 | Belawan | 0,0460 | 0,0716 |
| K-04 | Bitung | 0,0000 | 0,1314 |
| K-05 | Palabuhanratu | 0,1302 | 0,0000 |
| K-06 | Ternate | 0,0710 | 0,0517 |

---

### Step 6 — Skor TOPSIS & Priority Ranking

**Formula Closeness Coefficient (CC):**
```
CC_i = D-_i / (D+_i + D-_i)
```

Nilai CC berkisar antara 0–1:
- **CC = 1** → Lokasi dalam kondisi **ideal terbaik**
- **CC = 0** → Lokasi dalam kondisi **ideal terburuk** → **Prioritas intervensi tertinggi**

| Kode | Nama KNMP | D+ | D- | **CC Score** | **Ranking** | **Prioritas** |
|------|-----------|:---:|:---:|:---:|:---:|:---:|
| K-05 | KNMP Palabuhanratu | 0,1302 | 0,0000 | **0,000** | 🥇 1 | 🔴 SANGAT URGENT |
| K-02 | KNMP Brondong | 0,0943 | 0,0422 | **0,309** | 🥈 2 | 🔴 URGENT |
| K-06 | KNMP Ternate | 0,0710 | 0,0517 | **0,421** | 🥉 3 | 🟠 TINGGI |
| K-03 | KNMP Belawan | 0,0460 | 0,0716 | **0,609** | 4 | 🟡 SEDANG |
| K-01 | KNMP Muara Baru | 0,0286 | 0,1051 | **0,786** | 5 | 🟢 RENDAH |
| K-04 | KNMP Bitung | 0,0000 | 0,1314 | **1,000** | 6 | 🟢 SANGAT RENDAH |

---

## 5. Output Decision Engine — Rekomendasi Akhir

### Ringkasan Eksekutif untuk Pemerintah

```
┌─────────────────────────────────────────────────────────────────────────┐
│              KNMP SmartHub — LAPORAN PRIORITAS INTERVENSI               │
│                         Periode: Mei 2026                                │
├──────┬──────────────────────┬───────────────┬──────────┬────────────────┤
│ Rank │ Nama KNMP            │ Health Index  │ CC Score │ Prioritas      │
├──────┼──────────────────────┼───────────────┼──────────┼────────────────┤
│  1   │ KNMP Palabuhanratu   │   41,76 🔴    │  0,000   │ SANGAT URGENT  │
│  2   │ KNMP Brondong        │   53,46 🟡    │  0,309   │ URGENT         │
│  3   │ KNMP Ternate         │   58,97 🟡    │  0,421   │ TINGGI         │
│  4   │ KNMP Belawan         │   69,39 🟡    │  0,609   │ SEDANG         │
│  5   │ KNMP Muara Baru      │   78,32 🟢    │  0,786   │ RENDAH         │
│  6   │ KNMP Bitung          │   86,12 🟢    │  1,000   │ SANGAT RENDAH  │
└──────┴──────────────────────┴───────────────┴──────────┴────────────────┘
```

### Rekomendasi Tindak Lanjut Otomatis (Recommendation Engine)

#### 🔴 K-05 KNMP Palabuhanratu — INTERVENSI SEGERA

| Indikator | Nilai | Status | Rekomendasi |
|-----------|:---:|:---:|---|
| Produksi | 48 | ⚠️ Rendah | Evaluasi lapangan & pendampingan teknis nelayan |
| Distribusi | 38 | 🚨 Kritis | Optimalisasi rantai pasok & perluasan akses pasar |
| Cold Storage | 35 | 🚨 Kritis | Audit fasilitas penyimpanan, cek kondisi operasional |
| Infrastruktur | 42 | ⚠️ Rendah | Audit fasilitas & pembinaan pengelola KNMP |
| Koperasi | 30 | 🚨 Kritis | Penguatan kelembagaan & peningkatan kapasitas koperasi |
| Pelaporan | 55 | ⚠️ Rendah | Reminder otomatis & pelatihan pengisian laporan |

> **Early Warning aktif**: Seluruh indikator di bawah ambang batas minimum (60).  
> **Estimasi prioritas alokasi anggaran**: KNMP Palabuhanratu masuk dalam **Top-3 lokasi yang memerlukan alokasi anggaran darurat**.

#### 🔴 K-02 KNMP Brondong — INTERVENSI DIPERLUKAN

| Indikator | Nilai | Status | Rekomendasi |
|-----------|:---:|:---:|---|
| Produksi | 55 | ⚠️ Rendah | Pendampingan teknis & review kuota tangkapan |
| Distribusi | 60 | ⚠️ Batas | Monitor rantai distribusi lokal |
| Cold Storage | 45 | ⚠️ Rendah | Optimalisasi kapasitas penyimpanan |
| Infrastruktur | 50 | ⚠️ Rendah | Evaluasi pemanfaatan fasilitas TPI & dermaga |
| Koperasi | 40 | 🚨 Rendah | Aktivasi program simpan-pinjam koperasi |
| Pelaporan | 70 | ✅ Cukup | Pertahankan kualitas pelaporan |

---

## 6. Visualisasi Output (untuk Dashboard)

### KNMP Health Index — Diagram Radar (contoh untuk K-05)

```
            Produksi (48)
                 ●
               / | \
              /  |  \
Pelaporan   ●   |   ●  Distribusi
(55)          \  |  /    (38)
               \ | /
     Koperasi  ●─●─●  Cold Storage
      (30)      |    (35)
                ●
           Infrastruktur (42)

⚠️ Seluruh dimensi berada di bawah garis merah (60)
→ Health Index: 41,76 — STATUS: KRITIS
```

### Priority Bar Chart

```
KNMP Bitung       ████████████████████████████████████████  CC: 1,000 🟢
KNMP Muara Baru   ████████████████████████████████          CC: 0,786 🟢
KNMP Belawan      ████████████████████████                  CC: 0,609 🟡
KNMP Ternate      █████████████████                         CC: 0,421 🟠
KNMP Brondong     ████████████                              CC: 0,309 🔴
KNMP Palabuhanratu                                          CC: 0,000 🔴
                  ← Semakin kiri = Semakin perlu diintervensi
```

---

## 7. Interpretasi untuk Pengambil Kebijakan

> **Bagaimana membaca hasil ini?**

1. **KNMP dengan CC mendekati 0** → Kondisi paling jauh dari ideal → Butuh intervensi segera
2. **KNMP dengan CC mendekati 1** → Kondisi paling dekat dengan ideal → Dapat dijadikan model percontohan (best practice)
3. **Health Index** memberi gambaran "seberapa sehat" sebuah KNMP secara keseluruhan
4. **TOPSIS Ranking** menentukan **urutan intervensi** yang objektif dan terukur

> **Mengapa TOPSIS lebih baik dari ranking manual?**
> - Mempertimbangkan **semua kriteria secara bersamaan**, bukan hanya satu indikator
> - Hasil ranking **dapat dipertanggungjawabkan** secara matematis
> - Bobot AHP memastikan kriteria yang lebih penting mendapat pengaruh lebih besar
> - **Tidak bias** terhadap subjektivitas pejabat tertentu

---

*Dokumen ini merupakan bagian dari proposal teknis KNMP SmartHub untuk KMIPN 2026.*  
*Semua data adalah data simulasi untuk keperluan demonstrasi sistem.*
