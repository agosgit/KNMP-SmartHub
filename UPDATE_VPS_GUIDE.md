# 🚀 Panduan Pembaruan Server VPS (KNMP-SmartHub)

Panduan ini digunakan setelah Anda melakukan perubahan kode di laptop (lokal) dan sudah melakukan `git push` ke GitHub, untuk menerapkan pembaruan tersebut ke server **VPS Production** (`https://knmpsmarthub.cloud`).

---

## ⚡ OPSI 1: Satu Baris Perintah Cepat (All-in-One Copy-Paste)

Setelah login ke server VPS (`ssh root@202.10.48.95`), Anda cukup menyalin dan menjalankan satu blok perintah berikut di terminal:

```bash
cd /var/www/knmp-smarthub && git reset --hard origin/main && git pull origin main && cd /var/www/knmp-smarthub/knmp-smarthub-backend && npm install && pm2 restart knmp-backend && cd /var/www/knmp-smarthub/knmp-smarthub-frontend && npm install && npm run build && echo "✅ Pembaruan VPS Selesai!"
```

---

## 📋 OPSI 2: Langkah demi Langkah (Step-by-Step)

### 1. Masuk ke Server VPS
Buka Terminal / PowerShell / Command Prompt di laptop:
```bash
ssh root@202.10.48.95
```

### 2. Tarik Kode Terbaru dari GitHub
```bash
cd /var/www/knmp-smarthub
git reset --hard origin/main
git pull origin main
```

### 3. Pembaruan Sisi Backend (Express.js)
```bash
cd /var/www/knmp-smarthub/knmp-smarthub-backend
npm install
pm2 restart knmp-backend
```
*(Catatan: Jika ada perubahan pada `prisma/schema.prisma`, jalankan `npx prisma db push` sebelum restart PM2).*

### 4. Pembaruan Sisi Frontend (React + Vite)
Build ulang aset frontend agar Nginx menyajikan antarmuka terbaru:
```bash
cd /var/www/knmp-smarthub/knmp-smarthub-frontend
npm install
npm run build
```

---

## 🔍 5. Verifikasi Status Sistem

Jalankan perintah berikut untuk memastikan semua service berjalan normal:
```bash
# Cek status proses backend di PM2
pm2 status

# Cek log error backend jika ada kendala
pm2 logs knmp-backend --lines 30

# Cek status web server Nginx
systemctl status nginx
```

Buka browser dan akses **[https://knmpsmarthub.cloud](https://knmpsmarthub.cloud)** untuk memastikan aplikasi berjalan dengan baik!
