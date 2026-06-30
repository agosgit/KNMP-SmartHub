# Tech Stack & Sprint Plan — KNMP SmartHub
## Deadline: 11 Juli 2026 (~11 hari tersisa)

> Semua pilihan teknologi diprioritaskan berdasarkan: **sudah familiar + cepat dibangun + gratis untuk demo**

---

## ✅ Tech Stack Final (Disesuaikan dengan Skill Anda)

### Ringkasan Stack

```
┌──────────────────────────────────────────────────────────────┐
│  Frontend        React.js + Vite + Recharts + Leaflet        │
│  Backend         Node.js + Express.js + Prisma ORM           │
│  Database        PostgreSQL ✅ (Supabase — gratis & cepat)   │
│  Auth            JWT (jsonwebtoken + bcrypt)                  │
│  Decision Engine Node.js (AHP + TOPSIS — pure JS)            │
│  GIS Map         Leaflet.js + OpenStreetMap (gratis)         │
│  Deployment      Railway.app (backend) + Vercel (frontend)   │
└──────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database: PostgreSQL — Pilihan yang Tepat untuk Proyek Ini

> [!NOTE]
> **PostgreSQL adalah database yang paling cocok** untuk KNMP SmartHub karena kemampuan analitiknya yang superior, terutama untuk kalkulasi TOPSIS dan agregasi KPI lintas lokasi.

| Fitur yang Dibutuhkan | PostgreSQL | Keterangan |
|---|:---:|---|
| Relational data (KNMP, KPI, dll.) | ✅ | Fitur utama, lebih mature dari MySQL |
| **JSONB column** (bobot AHP, config DSS) | ✅ | Native & jauh lebih cepat dari MySQL JSON |
| **Window functions** (ranking TOPSIS) | ✅ | Mature, reliable, tidak ada bug edge case |
| **Analytical query** (agregasi KPI) | ✅ | Didesain untuk query kompleks & reporting |
| Geospatial (lat/lng + PostGIS opsional) | ✅ | Simpan lat/lng biasa, render di Leaflet |
| Free hosting | ✅ | **Supabase** (512MB gratis) atau Railway |
| Prisma ORM support | ✅ | First-class support, dokumentasi lengkap |
| Standar industri enterprise/pemerintah | ✅ | Digunakan di sistem pemerintah skala besar |

> **Kesimpulan**: PostgreSQL + Prisma adalah kombinasi terbaik. Dengan Prisma, Anda **tidak perlu menulis SQL baru** — syntax ORM-nya sama persis, hanya ganti `provider = "postgresql"` di satu file.

### Hosting Database: Supabase (Rekomendasi Utama)

```
┌─────────────────────────────────────────────────────────────┐
│  Supabase — https://supabase.com                            │
│                                                             │
│  ✅ PostgreSQL managed (gratis 512MB)                       │
│  ✅ Setup < 5 menit (UI visual seperti phpMyAdmin)          │
│  ✅ Connection string langsung pakai di Prisma              │
│  ✅ Ada Supabase Studio untuk lihat & edit data visual      │
│  ✅ Tidak perlu install PostgreSQL di lokal (opsional)      │
└─────────────────────────────────────────────────────────────┘
```

**Cara setup Supabase (5 menit):**
```bash
# 1. Daftar di https://supabase.com (gratis)
# 2. Create new project → pilih region Asia (Singapore)
# 3. Copy connection string dari Settings → Database
# 4. Paste ke DATABASE_URL di .env
# 5. Jalankan: npx prisma migrate dev
# Selesai! Database siap digunakan.
```

---

## 🎨 Frontend — React.js + Vite

**Setup awal:**
```bash
npm create vite@latest knmp-smarthub-frontend -- --template react
cd knmp-smarthub-frontend
npm install
```

### Library yang Direkomendasikan

| Library | Fungsi | Alasan Pilih |
|---|---|---|
| **`react-router-dom`** | Routing halaman | Wajib, sudah familiar |
| **`axios`** | HTTP request ke API | Lebih mudah dari fetch |
| **`recharts`** | Grafik KPI, Health Index, bar chart | Simple API, tampilan bagus |
| **`leaflet` + `react-leaflet`** | Peta GIS sebaran KNMP | Gratis, tidak butuh API key |
| **`react-hot-toast`** | Notifikasi Early Warning | 1 baris kode, profesional |
| **`lucide-react`** | Icon set | Ringan, modern |
| **`date-fns`** | Format tanggal | Ringan vs moment.js |
| **`zustand`** | State management global | Jauh lebih simple dari Redux |

**Install sekaligus:**
```bash
npm install react-router-dom axios recharts leaflet react-leaflet \
            react-hot-toast lucide-react date-fns zustand
```

> [!TIP]
> **Jangan pakai UI component library besar** seperti Material UI atau Ant Design — install-nya lama dan sering konflik CSS. Lebih baik buat komponen sendiri dengan CSS custom agar bisa kontrol penuh tampilan untuk kesan "premium."

---

## ⚙️ Backend — Node.js + Express.js

**Setup awal:**
```bash
mkdir knmp-smarthub-backend && cd knmp-smarthub-backend
npm init -y
npm install express
```

### Library yang Direkomendasikan

| Library | Fungsi | Alasan Pilih |
|---|---|---|
| **`prisma`** | ORM untuk PostgreSQL | Ganti query manual → lebih cepat dev |
| **`@prisma/client`** | Client Prisma | Pasangan wajib |
| **`jsonwebtoken`** | Generate & verify JWT | Auth standar |
| **`bcryptjs`** | Hash password | Keamanan user |
| **`cors`** | Allow request dari React | Wajib untuk dev |
| **`dotenv`** | Kelola environment variable | Wajib |
| **`express-validator`** | Validasi request body | Cegah data kotor masuk DB |
| **`nodemon`** | Auto-restart saat dev | Developer experience |
| **`multer`** | Upload file (opsional) | Kalau butuh import Excel |

**Install sekaligus:**
```bash
npm install express prisma @prisma/client jsonwebtoken bcryptjs \
            cors dotenv express-validator multer
npm install --save-dev nodemon
```

### Kenapa Prisma? Bukan `pg` / query manual biasa?

```js
// ❌ Cara lama — query manual pg, rawan typo & SQL injection
const result = await pool.query('SELECT * FROM knmp WHERE region_id = $1', [id]);

// ✅ Prisma — otomatis aman, autocomplete, tidak perlu hafal SQL
const knmp = await prisma.knmp.findMany({
  where: { regionId: id },
  include: { facilities: true, productions: true }
});

// ✅ Prisma juga support query analitik kompleks untuk TOPSIS:
const kpiData = await prisma.kpiScore.groupBy({
  by: ['knmpId'],
  _avg: { score: true },
  orderBy: { _avg: { score: 'asc' } }
});
```

> Prisma menghemat waktu development **sangat signifikan** dan schema langsung jadi dokumentasi.

---

## 🧠 Decision Engine — Pure Node.js (Tidak Butuh Library Khusus)

Implementasikan AHP + TOPSIS langsung di Express.js sebagai service:

```
backend/
└── src/
    └── services/
        ├── ahp.service.js       ← Hitung bobot kriteria
        ├── healthIndex.service.js ← Hitung Health Index
        ├── topsis.service.js    ← Ranking prioritas
        └── recommendation.service.js ← Generate rekomendasi
```

> [!TIP]
> Tidak perlu library eksternal untuk AHP dan TOPSIS. Semua bisa dilakukan dengan array dan matematika dasar di JavaScript. Kodenya sederhana ~100-150 baris per file.

**Contoh struktur endpoint:**
```
POST /api/engine/calculate-health-index  → input data KPI → output Health Index
POST /api/engine/run-topsis              → input semua KNMP → output ranking
GET  /api/engine/recommendations/:id     → output rekomendasi per lokasi
GET  /api/engine/early-warning           → output daftar KNMP warning/kritis
```

---

## 🗺️ GIS Map — Leaflet.js (Gratis, No API Key)

```bash
npm install leaflet react-leaflet
```

**Cara simpan data lokasi di PostgreSQL (via Prisma schema):**
```prisma
// prisma/schema.prisma
model Knmp {
  id        Int     @id @default(autoincrement())
  name      String
  latitude  Float   // simpan sebagai Float biasa
  longitude Float
  // ... kolom lainnya
}
```

**Tidak perlu PostGIS atau extension tambahan.** Leaflet akan render titik/marker langsung dari lat/lng yang dikirim API. PostgreSQL `Float` lebih presisi dari `DECIMAL` MySQL untuk koordinat geografis.

**Tampilan yang akan dibuat:**
- Peta Indonesia dengan marker setiap KNMP
- Warna marker = status Health Index (🔴 kritis / 🟡 perlu perhatian / 🟢 baik)
- Klik marker → popup info singkat + link ke dashboard KNMP

---

## 🚀 Deployment — Railway.app (Gratis untuk Demo)

Railway.app adalah platform deploy paling mudah dan gratis untuk kebutuhan hackathon:

| Komponen | Layanan | Biaya |
|---|---|---|
| Backend (Node.js) | Railway.app — Node.js service | Gratis $5 credit/bulan |
| **Database (PostgreSQL)** | **Supabase** — managed PostgreSQL | **Gratis 512MB** |
| Frontend (React) | **Vercel** | Gratis selamanya |

**Langkah deploy:**
```bash
# Database → Supabase (lakukan ini PERTAMA)
# 1. Buat project di https://supabase.com
# 2. Salin connection string dari Settings → Database → URI
# 3. Paste ke DATABASE_URL di .env backend
# 4. Jalankan: npx prisma migrate deploy

# Backend → Railway
# 1. Push backend ke GitHub
# 2. Connect repo di railway.app → New Project
# 3. Set semua environment variables (DATABASE_URL dari Supabase, JWT_SECRET, dll.)
# 4. Railway otomatis detect Node.js dan deploy

# Frontend → Vercel
# 1. Push frontend ke GitHub
# 2. Import di vercel.com → Add New Project
# 3. Set VITE_API_URL ke URL Railway backend (contoh: https://knmp-api.railway.app/api)
# 4. Deploy otomatis, dapat URL production
```

> [!IMPORTANT]
> **Pastikan ada backup video demo** (screen recording ~3-5 menit) sebelum presentasi. Kalau koneksi internet saat lomba bermasalah, video adalah penyelamat.

---

## 📁 Struktur Project yang Direkomendasikan

```
KMIPN/
├── knmp-smarthub-frontend/          ← React + Vite
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx        ← Dashboard utama
│   │   │   ├── KNMPDetail.jsx       ← Detail per lokasi
│   │   │   ├── GISMap.jsx           ← Peta sebaran
│   │   │   ├── Rankings.jsx         ← TOPSIS ranking
│   │   │   └── Login.jsx
│   │   ├── components/
│   │   │   ├── HealthIndexCard.jsx  ← Kartu Health Index
│   │   │   ├── KPIChart.jsx         ← Grafik KPI (Recharts)
│   │   │   ├── EarlyWarningBanner.jsx
│   │   │   └── RecommendationPanel.jsx
│   │   ├── services/
│   │   │   └── api.js               ← Semua axios calls
│   │   └── store/
│   │       └── useAppStore.js       ← Zustand global state
│   └── package.json
│
└── knmp-smarthub-backend/           ← Node.js + Express
    ├── prisma/
    │   ├── schema.prisma            ← Definisi semua tabel
    │   └── seed.js                  ← Mock data 20 lokasi KNMP
    ├── src/
    │   ├── routes/
    │   │   ├── auth.routes.js
    │   │   ├── knmp.routes.js
    │   │   ├── dashboard.routes.js
    │   │   └── engine.routes.js     ← AHP/TOPSIS/DSS endpoint
    │   ├── controllers/
    │   ├── services/
    │   │   ├── ahp.service.js
    │   │   ├── healthIndex.service.js
    │   │   ├── topsis.service.js
    │   │   └── recommendation.service.js
    │   └── middleware/
    │       ├── auth.middleware.js   ← JWT verify
    │       └── validate.middleware.js
    ├── app.js
    └── package.json
```

---

## 📅 Sprint Plan — 11 Hari Menuju 11 Juli

> [!IMPORTANT]
> Fokus pada **3 hal utama yang juri paling lihat**: Dashboard visual, Health Index engine yang berjalan, dan TOPSIS ranking. Fitur lain adalah bonus.

### Hari 1-2 (30 Jun – 1 Jul) — Foundation
- [ ] Buat project Supabase + salin DATABASE_URL PostgreSQL
- [ ] Setup project React + Vite (frontend)
- [ ] Setup Express.js + Prisma + PostgreSQL (backend) — `provider = "postgresql"`
- [ ] Buat schema database di `prisma/schema.prisma`
- [ ] Jalankan `npx prisma migrate dev` untuk buat semua tabel
- [ ] Buat seed data simulasi **20 lokasi KNMP** (mock data)
- [ ] Auth endpoint (login/register) + JWT middleware
- [ ] Test koneksi frontend ↔ backend

### Hari 3-4 (2-3 Jul) — Decision Engine
- [ ] Implementasi `healthIndex.service.js` (formula berbobot)
- [ ] Implementasi `topsis.service.js` (6 langkah TOPSIS)
- [ ] Implementasi `recommendation.service.js`
- [ ] Implementasi `earlyWarning.service.js`
- [ ] Test engine dengan data seed, verifikasi hasil ranking

### Hari 5-6 (4-5 Jul) — Dashboard Utama
- [ ] Layout dashboard: sidebar + header + main content
- [ ] Card summary: total KNMP, rata-rata Health Index, jumlah warning
- [ ] Grafik KPI (bar/radar chart dengan Recharts)
- [ ] Tabel ranking prioritas intervensi (hasil TOPSIS)
- [ ] Early Warning notification banner

### Hari 7 (6 Jul) — GIS Map
- [ ] Integrasi Leaflet.js di halaman GIS
- [ ] Marker per lokasi KNMP (merah/kuning/hijau)
- [ ] Popup info saat klik marker
- [ ] Layer kontrol (filter by status/provinsi)

### Hari 8 (7 Jul) — Detail KNMP & Rekomendasi
- [ ] Halaman detail per lokasi KNMP
- [ ] Radar chart 6 dimensi (profil kondisi KNMP)
- [ ] Panel rekomendasi otomatis
- [ ] Tabel riwayat monitoring

### Hari 9 (8 Jul) — Polish & QA
- [ ] Responsif (minimal untuk layar 1366px dan 1920px)
- [ ] Animasi transisi antar halaman
- [ ] Loading state & error handling
- [ ] Test semua endpoint ulang

### Hari 10 (9 Jul) — Deploy & Demo Prep
- [ ] Deploy backend ke Railway.app
- [ ] Deploy frontend ke Vercel
- [ ] Tes demo end-to-end di URL production
- [ ] Rekam video demo backup (3-5 menit)
- [ ] Siapkan skenario demo presentasi

### Hari 11 (10 Jul) — Buffer & Final Check
- [ ] Perbaikan bug terakhir
- [ ] Finalisasi dokumen proposal
- [ ] Latihan presentasi + antisipasi Q&A

---

## 🎯 Prioritas Jika Waktu Tidak Cukup

Kalau mepet, ini urutan prioritas yang HARUS selesai:

```
WAJIB ADA (tanpa ini tidak bisa demo):
1. ✅ Auth login + JWT
2. ✅ Seed data 20 KNMP
3. ✅ Health Index calculation (API + tampilan)
4. ✅ TOPSIS ranking (API + tabel ranking)
5. ✅ Dashboard utama (cards + 1-2 grafik)

SANGAT DIREKOMENDASIKAN:
6. 🔥 GIS Map (visual impact tinggi di depan juri)
7. 🔥 Early Warning banner

BONUS (kalau sempat):
8. ⭐ Detail per KNMP
9. ⭐ Rekomendasi otomatis per indikator
10. ⭐ Export laporan
```

---

## 💻 Environment Variables (.env)

**Backend `.env`:**
```env
# Format Supabase PostgreSQL (salin dari Supabase Dashboard → Settings → Database → URI)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Untuk development lokal (jika install PostgreSQL di lokal):
# DATABASE_URL="postgresql://postgres:password@localhost:5432/knmp_smarthub"

JWT_SECRET="knmp_smarthub_secret_2026"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
```

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📦 Package.json Scripts (Backend)

```json
{
  "scripts": {
    "dev": "nodemon src/app.js",
    "start": "node src/app.js",
    "db:migrate": "prisma migrate dev",
    "db:seed": "node prisma/seed.js",
    "db:studio": "prisma studio"
  }
}
```

---

*Stack ini dirancang untuk: familiar, cepat, dan hasilnya tetap terlihat profesional saat demo.*
