# 🧪 Panduan Lengkap Unit Test: KNMP SmartHub

Dokumen ini adalah panduan praktis untuk menjalankan, memahami, dan mengembangkan **Unit Testing** pada sistem **KNMP SmartHub**.

---

## 🎯 1. Tujuan Pengujian (Test Objectives)

Unit testing pada KNMP SmartHub dirancang untuk menjamin integritas logika bisnis dan keakuratan matematis pada 4 modul inti:
1. **Decision Support Engine (TOPSIS):** Memastikan kebenaran normalisasi matriks $R$, matriks terbobot $V$, jarak Euclidean ($D^+/D^-$), nilai *Closeness Coefficient* (CC Score), dan urutan prioritas intervensi.
2. **Health Index Scoring:** Memastikan perhitungan nilai indeks kesehatan komposit $\sum (\text{Skor}_i \times \text{Bobot}_i)$ dan klasifikasi status (`SANGAT_BAIK`, `BAIK`, `PERLU_PERHATIAN`, `KRITIS`) berjalan akurat.
3. **Logika Akumulasi Transaksi:** Memastikan input operasional harian berakumulasi dalam rentang 30 hari terhadap target bulanan tanpa merusak skor secara prematur.
4. **Otomasi Fasilitas & Infrastruktur:** Memastikan rasio fasilitas aktif terhadap total fasilitas berbanding lurus dengan nilai KPI `INFRASTRUCTURE`.

---

## 🚀 2. Cara Menjalankan Unit Test

Unit test telah dikonfigurasi sebagai *standalone test runner* menggunakan *built-in module* Node.js (`assert`), sehingga dapat dijalankan seketika di laptop lokal maupun server VPS tanpa perlu menginstall *dependency testing* tambahan yang berat.

### A. Menjalankan di Laptop Lokal
Buka terminal dan masuk ke direktori backend:
```bash
cd knmp-smarthub-backend
npm test
```

### B. Menjalankan di Server VPS
```bash
cd /var/www/knmp-smarthub/knmp-smarthub-backend
npm test
```

---

## 📊 3. Rincian Test Suite & Skenario Uji

File test berada di: `knmp-smarthub-backend/tests/unit_tests.js`

### Test Suite 1: Health Index & Klasifikasi Status
* **Skenario 1.1:** Validasi batas nilai skor $\ge 80 \rightarrow$ `SANGAT_BAIK`.
* **Skenario 1.2:** Validasi batas nilai skor $60 \le \text{skor} < 80 \rightarrow$ `BAIK`.
* **Skenario 1.3:** Validasi batas nilai skor $40 \le \text{skor} < 60 \rightarrow$ `PERLU_PERHATIAN`.
* **Skenario 1.4:** Validasi batas nilai skor $< 40 \rightarrow$ `KRITIS`.
* **Skenario 1.5:** Simulasi perkalian matriks komposit data K-01 Muara Baru menghasilkan **78.48** (Status: `BAIK`).

### Test Suite 2: Algoritma TOPSIS
* **Skenario 2.1:** Pemetaan status urgensi berdasarkan rentang CC Score ($0.0 \rightarrow \text{SANGAT\_URGENT}$, $1.0 \rightarrow \text{SANGAT\_RENDAH}$).
* **Skenario 2.2:** Simulasi 3 lokasi alternatif (Muara Baru, Bitung, Palabuhanratu):
  * Memvalidasi normalisasi matriks $R_{ij} = \frac{X_{ij}}{\sqrt{\sum X_{ij}^2}}$.
  * Memvalidasi matriks terbobot $V_{ij} = R_{ij} \times w_j$.
  * Memvalidasi penetapan solusi ideal $A^+ = \max(V)$ dan $A^- = \min(V)$.
  * Memvalidasi Palabuhanratu (lokasi terburuk) mendapatkan $\text{CC Score} = 0.0$ dan ditempatkan pada **Peringkat 1 (Paling Urgent Intervensi)**.

### Test Suite 3: Rasio Fasilitas & Infrastruktur
* **Skenario 3.1:** 5 dari 5 fasilitas berstatus `ACTIVE` $\rightarrow$ Skor 100%.
* **Skenario 3.2:** 4 dari 5 fasilitas `ACTIVE` (1 `MAINTENANCE`) $\rightarrow$ Skor 80%.

### Test Suite 4: Akumulasi Transaksi 30 Hari
* **Skenario 4.1:** 4 input bertahap @ 5.000 kg terhadap target 20.000 kg $\rightarrow$ Akumulasi mencapai 100%.
* **Skenario 4.2:** 1 kali input 5.000 kg $\rightarrow$ Menghasilkan nilai proporsional 25% (mencegah skor anjlok akibat single-input).
* **Skenario 4.3:** Input melebihi target (30.000 kg / 20.000 kg) $\rightarrow$ Dibatasi maksimal *capped* di 100%.

---

## 🛠️ 4. Menambahkan Skenario Test Case Baru

Jika Anda ingin menambahkan test case baru pada file `tests/unit_tests.js`:

```javascript
runTest('Nama Pengujian / Skenario Baru', () => {
  const hasil = fungsiYangDiuji(inputParameter);
  const ekspektasi = 'Nilai Yang Diharapkan';

  // Gunakan modul assert
  assert.strictEqual(hasil, ekspektasi, 'Pesan error jika pengujian gagal');
});
```

---

## 🤖 5. Integrasi CI/CD (Otomatisasi di GitHub Actions)

Jika ingin menjalankan test ini secara otomatis setiap kali ada `git push` atau `pull request` ke GitHub, buat file `.github/workflows/test.yml`:

```yaml
name: Node.js Unit Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4
    - name: Use Node.js 20.x
      uses: actions/setup-node@v4
      with:
        node-version: 20.x

    - name: Run Backend Unit Tests
      run: |
        cd knmp-smarthub-backend
        npm install
        npm test
```
