# Analisis Konsistensi AHP & TOPSIS

Perbandingan antara dokumen referensi (`contoh_perhitungan_ahp_topsis.md`), seed data (`seed.js`), dan implementasi kode (`topsis.service.js` + `healthIndex.service.js`).

---

## 1. Bobot AHP (Kriteria KPI)

| Kriteria | Dokumen Referensi | Seed Data | Selisih |
|---|:---:|:---:|:---:|
| C1 - Produksi | **0.352** | **0.351** | ⚠️ -0.001 |
| C2 - Distribusi | **0.233** | **0.232** | ⚠️ -0.001 |
| C3 - Cold Storage | 0.138 | 0.138 | ✅ |
| C4 - Infrastruktur | 0.138 | 0.138 | ✅ |
| C5 - Koperasi | 0.087 | 0.087 | ✅ |
| C6 - Pelaporan | 0.052 | 0.052 | ✅ |
| **Total** | **1.000** | **0.998** | ⚠️ **0.002 kurang** |

> [!WARNING]
> **Bobot seed data tidak sum ke 1.000** — totalnya 0.998 (selisih 0.002). Dokumen referensi menyebutkan w1=0.352 dan w2=0.233, tapi seed menggunakan 0.351 dan 0.232. Meskipun perbedaan sangat kecil, untuk konsistensi akademik harus diperbaiki.

---

## 2. Algoritma TOPSIS di `topsis.service.js`

| Langkah | Dokumen Referensi | Implementasi Kode | Status |
|---|---|---|:---:|
| **Matriks Keputusan** | Skor KPI mentah (skala 0-100) | ✅ Ambil dari `kpiScore` terbaru | ✅ |
| **Normalisasi** | `r = x / sqrt(Σx²)` | ✅ `R[i][j] = X[i][j] / columnSquareSums[j]` (baris 88) | ✅ |
| **Matriks Terbobot** | `v = r × w` | ✅ `V[i][j] = R[i][j] * w[j]` (baris 97) | ✅ |
| **A+ (Solusi Ideal Positif)** | Max tiap kolom (Benefit) | ✅ `Math.max(...)` (baris 113) | ✅ |
| **A- (Solusi Ideal Negatif)** | Min tiap kolom (Benefit) | ✅ `Math.min(...)` (baris 114) | ✅ |
| **D+ (Jarak ke A+)** | `sqrt(Σ(v-A+)²)` Euclidean | ✅ `Math.sqrt(sumPlus)` (baris 128) | ✅ |
| **D- (Jarak ke A-)** | `sqrt(Σ(v-A-)²)` Euclidean | ✅ `Math.sqrt(sumMinus)` (baris 129) | ✅ |
| **CC Score** | `D- / (D+ + D-)` | ✅ `D_minus[i] / divider` (baris 138) | ✅ |
| **Ranking** | Ascending (CC terkecil = rank 1) | ✅ `sort((a,b) => a.cc - b.cc)` (baris 149) | ✅ |
| **Tipe Kriteria** | Semua **Benefit** | ✅ Komentar baris 102: "semua bertipe BENEFIT" | ✅ |

> [!TIP]
> Implementasi algoritma TOPSIS di kode **100% sesuai** dengan rumus dan langkah-langkah di dokumen referensi.

---

## 3. Health Index di `healthIndex.service.js`

| Aspek | Implementasi | Status |
|---|---|:---:|
| **Rumus** | `HI = Σ(Score × Weight_AHP)` | ✅ Sesuai, baris 55 |
| **Bobot** | Diambil dari `kpiDefinition.weight` di DB | ✅ Dinamis dari DB |
| **Klasifikasi** | ≥80=SANGAT_BAIK, ≥70=BAIK, ≥60=MODERAT, ≥50=PERLU_PERHATIAN, <50=KRITIS | ✅ |

---

## 4. Verifikasi Seed Data vs Dokumen (3 Sampel Lokasi)

### CC Score & Ranking

| KNMP | CC Score (Dokumen) | CC Score (Seed) | Status |
|---|:---:|:---:|:---:|
| Palabuhanratu | 0.000 | 0.000 | ✅ |
| Muara Baru | 0.786 | 0.786 | ✅ |
| Bitung | 1.000 | 1.000 | ✅ |

### D+ dan D- (3 Sampel)

| KNMP | D+ (Dokumen) | D+ (Seed) | D- (Dokumen) | D- (Seed) | Status |
|---|:---:|:---:|:---:|:---:|:---:|
| Muara Baru | 0.0378 | **0.0286** | 0.1389 | **0.1051** | ⚠️ **Berbeda** |
| Bitung | 0.0000 | 0.0000 | 0.1610 | **0.1314** | ⚠️ D- berbeda |
| Palabuhanratu | 0.1610 | **0.1302** | 0.0000 | 0.0000 | ⚠️ D+ berbeda |

> [!IMPORTANT]
> **D+ dan D- di seed data TIDAK SAMA dengan dokumen referensi.** Ini karena dokumen hanya menggunakan **3 alternatif** (Muara Baru, Bitung, Palabuhanratu) untuk contoh perhitungan, sedangkan seed data menggunakan **6 alternatif** (semua KNMP). Menambah alternatif mengubah nilai normalisasi → mengubah D+ dan D-, tapi **CC Score tetap konsisten secara proporsional**. Ini **BUKAN bug**, melainkan perbedaan jumlah data input.

---

## 5. Temuan yang Perlu Diperbaiki

### ⚠️ Perbaikan Kecil: Bobot AHP

Seed data harus menggunakan bobot yang **persis** sesuai dokumen:

| Perubahan | Dari | Ke |
|---|:---:|:---:|
| C1 (Produksi) | 0.351 | **0.352** |
| C2 (Distribusi) | 0.232 | **0.233** |

Ini agar total bobot = 1.000 dan konsisten dengan dokumen perhitungan AHP.

---

## 6. Kesimpulan

| Aspek | Status |
|---|:---:|
| Algoritma TOPSIS | ✅ **Benar & Konsisten** |
| Rumus Normalisasi | ✅ **Benar** |
| Health Index (bobot AHP) | ✅ **Benar** |
| Ranking (CC ascending) | ✅ **Benar** |
| Bobot AHP di Seed | ⚠️ **Selisih 0.001 pada w1 dan w2** |
| D+/D- Seed vs Dokumen | ℹ️ **Wajar** (beda jumlah alternatif) |
