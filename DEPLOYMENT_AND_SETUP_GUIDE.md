# Dokumentasi Deployment & Konfigurasi Server: KNMP-SmartHub

Dokumentasi lengkap mengenai proses instalasi, deployment, konfigurasi domain, SSL, dan optimasi responsivitas mobile untuk aplikasi **KNMP-SmartHub (Government Decision Intelligence Platform)**.

---

## 📌 Ringkasan Arsitektur & Informasi Server

| Komponen | Spesifikasi / Konfigurasi |
| :--- | :--- |
| **Penyedia VPS** | Rumahweb Indonesia (Region TechnoVillage) |
| **Alamat IP Server** | `202.10.48.95` |
| **Sistem Operasi** | Ubuntu 22.04 LTS (x86_64) |
| **Domain Resmi** | [https://knmpsmarthub.cloud](https://knmpsmarthub.cloud) & `www.knmpsmarthub.cloud` |
| **Protokol Keamanan** | HTTPS / SSL (Let's Encrypt via Certbot Auto-Renew) |
| **Web Server & Proxy** | Nginx Reverse Proxy |
| **Database** | PostgreSQL 14 (Database: `knmp_smarthub`) |
| **Backend Runtime** | Node.js v20 LTS + Express.js + Prisma ORM 7.x |
| **Process Manager** | PM2 (`knmp-backend`, auto-start on reboot) |
| **Frontend Framework** | React 19 + Vite + Zustand + Leaflet GIS + Recharts |

---

## 🛠️ Langkah & Konfigurasi yang Telah Dikerjakan

### 1. Inisialisasi & Persiapan Lingkungan VPS
* Mengakses VPS menggunakan protokol SSH (`ssh root@202.10.48.95`).
* Memperbarui repositori dan paket sistem Ubuntu (`apt update && apt upgrade -y`).
* Menyelesaikan penyesuaian konfigurasi paket bawaan (`openssh-server`, perizinan kernel upgrade, dan service restart).
* Menginstal dependensi utama: `curl`, `git`, `ufw`, `nginx`, `postgresql`, `postgresql-contrib`, `nodejs v20`, dan `pm2`.

### 2. Konfigurasi Database PostgreSQL & Prisma ORM
* Membuat basis data dan kredensial pengguna khusus:
  ```sql
  CREATE DATABASE knmp_smarthub;
  CREATE USER knmp_user WITH ENCRYPTED PASSWORD '...';
  GRANT ALL PRIVILEGES ON DATABASE knmp_smarthub TO knmp_user;
  ALTER DATABASE knmp_smarthub OWNER TO knmp_user;
  ```
* Memperbaiki penyesuaian sintaksis **Prisma 7** pada file `prisma/schema.prisma` (memindahkan definisi `url` ke `prisma.config.ts` dan adapter `@prisma/adapter-pg`).
* Melakukan sinkronisasi skema dan migrasi tabel (`npx prisma db push`).
* Mengisi data awal simulasi (*database seeding*) berupa 6 lokasi pelabuhan perikanan KNMP, data operasional, hierarki wilayah, user/role, serta perhitungan Health Index dan TOPSIS (`npm run db:seed`).

### 3. Setup & Daemonisasi Backend (Express.js)
* Membuat file lingkungan `.env` backend untuk konfigurasi `DATABASE_URL`, `PORT=5000`, `JWT_SECRET`, dan `NODE_ENV=production`.
* Mendaftarkan dan menjalankan aplikasi backend di latar belakang secara persisten menggunakan **PM2**:
  ```bash
  pm2 start src/app.js --name "knmp-backend"
  pm2 save
  pm2 startup
  ```

### 4. Konfigurasi Nginx Web Server & Reverse Proxy
* Membuat konfigurasi virtual host Nginx di `/etc/nginx/sites-available/knmp-smarthub`.
* Mengatur Nginx untuk melayani file statis produksi React dari folder `/dist` serta mem-proxy request API `/api/` langsung ke backend Express di `http://127.0.0.1:5000`.
* Mengamankan firewall server menggunakan UFW (`ufw allow OpenSSH`, `ufw allow 'Nginx Full'`).

### 5. Integrasi Custom Domain & Keamanan SSL (HTTPS)
* Mendaftarkan domain resmi **`knmpsmarthub.cloud`**.
* Mengaktifkan Managed DNS di Rumahweb dan mengonfigurasi **DNS A Record**:
  * Host `@` (Root) ➔ `202.10.48.95`
  * Host `www` ➔ `202.10.48.95`
* Menginstal dan menjalankan **Certbot Nginx Plugin** untuk menerbitkan sertifikat SSL Let's Encrypt gratis dengan konfigurasi redirect otomatis dari HTTP ke HTTPS:
  ```bash
  sudo certbot --nginx -d knmpsmarthub.cloud -d www.knmpsmarthub.cloud
  ```

### 6. Peningkatan Tampilan & Responsivitas Mobile (Mobile Responsive UI)
* **Drawer Sidebar Mobile (Off-Canvas):**
  * Sidebar otomatis tersembunyi (*hidden*) pada layar HP/tablet (≤ 1024px) agar tidak menutupi konten.
  * Dilengkapi tombol navigasi menu (**☰ Hamburger**) di navbar, tombol tutup (**✕ Close**) di sidebar, dan **Backdrop Gelap Transparan** (klik di luar sidebar untuk menutup).
  * Auto-close drawer saat item menu navigasi dipilih.
* **Layout & Grid Adaptif:**
  * Kartu indikator (*stat cards*) dan visualisasi chart radar KPI otomatis tersusun 1 kolom vertikal pada layar kecil.
  * Tabel peringkat kebutuhan intervensi TOPSIS dilengkapi fitur *smooth horizontal touch scroll*.
  * Tab input operasional dan form lapangan dapat digeser (*scrollable tabs*) dengan tata letak form yang proporsional di smartphone.
  * Peta GIS adaptif dengan tinggi dinamis (*clamp height*).

---

## 🔑 Kredensial Akun Simulasi & Demo

Sistem telah dilengkapi dengan akun simulasi bawaan sesuai peran (*Role-Based Access Control*):

| Role / Jabatan | Email | Password | Hak Akses Utama |
| :--- | :--- | :--- | :--- |
| **Direktorat KKP** | `kkp@smarthub.go.id` | `password123` | Monitoring Nasional, Radar KPI, Eksekusi Rekalkulasi AHP+TOPSIS |
| **Administrator** | `admin@smarthub.go.id` | `password123` | Akses Penuh Sistem, Input Seluruh Data Operasional |
| **Dinas Pemda** | `pemda@smarthub.go.id` | `password123` | Monitoring Wilayah Provinsi/Kabupaten |
| **Petugas TPI** | `tpi@smarthub.go.id` | `password123` | Input Data Produksi & Tangkapan Harian Ikan |
| **Koperasi Nelayan** | `koperasi@smarthub.go.id` | `password123` | Input Distribusi Ikan & Transaksi Anggota Koperasi |
| **Penyuluh Lapangan**| `penyuluh@smarthub.go.id` | `password123`| Input Laporan Kendala Lapangan & Status Kerusakan Fisik |

---

## 🚀 Cheatsheet Operasional & Perawatan Server

### A. Memperbarui Kode Aplikasi dari Git (Update Workflow)
Jika Anda melakukan perubahan kode di laptop dan telah di-*push* ke GitHub:

```bash
# 1. Masuk ke root direktori proyek di VPS
cd /var/www/knmp-smarthub

# 2. Tarik kode terbaru dari repositori
git reset --hard origin/main
git pull origin main

# 3. Jika ada pembaruan pada Backend
cd /var/www/knmp-smarthub/knmp-smarthub-backend
npm install
# Jika ada perubahan skema database: npx prisma db push
pm2 restart knmp-backend

# 4. Jika ada pembaruan pada Frontend
cd /var/www/knmp-smarthub/knmp-smarthub-frontend
npm install
npm run build
```

### B. Perintah Pemantauan & Status Layanan

* **Memeriksa Log Aktivitas Backend:**
  ```bash
  pm2 logs knmp-backend
  ```
* **Memeriksa Status Proses PM2:**
  ```bash
  pm2 status
  ```
* **Memeriksa & Merestart Web Server Nginx:**
  ```bash
  sudo nginx -t
  sudo systemctl restart nginx
  ```
* **Memeriksa Status Database PostgreSQL:**
  ```bash
  sudo systemctl status postgresql
  ```
* **Memeriksa Pembaruan Otomatis Sertifikat SSL:**
  ```bash
  sudo certbot renew --dry-run
  ```
