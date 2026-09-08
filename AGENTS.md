# 🌊 KNMP SmartHub — Context untuk AI Assistant

File ini dibaca otomatis oleh Antigravity IDE setiap sesi baru.
Tidak perlu jelaskan ulang project ini ke AI.

---

## 📌 Identitas Project

- **Nama**: KNMP SmartHub — Government Decision Intelligence Platform
- **Tim**: JOSJIS TEAM — Politeknik Perkapalan Negeri Surabaya (PPNS)
- **Kompetisi**: KMIPN VIII 2026, Kategori **E-Government**
- **Website Live**: https://knmpsmarthub.cloud
- **IP VPS**: `202.10.48.95` (Rumahweb Indonesia, Ubuntu 22.04)
- **Tagline**: *"Data Cerdas, Keputusan Tepat, Nelayan Sejahtera Menuju Indonesia Emas 2045"*

---

## 🏗️ Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React 19 + Vite 8, React Router 7, Zustand, Recharts, Leaflet.js (GIS), jsPDF, Lucide |
| Backend | Node.js + Express 5, Prisma ORM 7.8 |
| Database | PostgreSQL 14 |
| Auth | JWT + bcryptjs, RBAC (7 role) |
| Security | Helmet, CORS, Rate Limiting, Audit Trail |
| Web Server | Nginx (reverse proxy), PM2 (process manager) |
| SSL | Let's Encrypt via Certbot (auto-renew) |

---

## 📁 Struktur Folder

```
KMIPN/
├── knmp-smarthub-backend/     # Node.js + Express + Prisma
│   ├── prisma/schema.prisma   # 13 model database
│   ├── src/
│   │   ├── app.js
│   │   ├── controllers/       # admin, auth, dashboard, history, operational
│   │   ├── services/          # healthIndex, topsis, recommendation
│   │   ├── routes/
│   │   └── middleware/
│   └── tests/
├── knmp-smarthub-frontend/    # React + Vite
│   └── src/
│       ├── pages/             # Login, Dashboard, GISMap, Rankings, KNMPDetail, OperationalInput, AdminPanel, ActivityHistory
│       ├── components/        # Sidebar, Navbar, EarlyWarningBanner, HealthIndexCard, KPIChart
│       ├── services/          # Axios API layer
│       └── store/             # Zustand state management
├── PPT/                       # 12 slide presentasi (1.png - 12.png)
├── DEPLOYMENT_AND_SETUP_GUIDE.md
├── alur_sistem_knmp_smarthub.md
├── contoh_perhitungan_ahp_topsis.md
├── daftar_qna_juri.md
└── AGENTS.md                  # File ini
```

---

## 🧠 Decision Engine (Inti Inovasi)

### 6 KPI + Bobot AHP
| KPI | Bobot |
|---|---|
| C1: Produksi Perikanan | 35,2% |
| C2: Distribusi Tangkapan | 23,3% |
| C3: Cold Storage | 13,8% |
| C4: Infrastruktur TPI | 13,8% |
| C5: Aktivitas Koperasi | 8,7% |
| C6: Kelengkapan Laporan | 5,2% |

**Consistency Ratio (CR)** = 0,019 ✅ (valid, < 0.10)

### Health Index
`HI = Σ(Skor KPI × Bobot AHP)` → skala 0–100
- ≥80: Sangat Baik | 60–79: Baik | 40–59: Perlu Perhatian | <40: Kritis

### TOPSIS
Closeness Coefficient (CC) 0–1. CC mendekati 0 = paling kritis = prioritas utama intervensi.

### EWS (Early Warning System)
3 level: Kritis / Waspada / Monitor — notifikasi otomatis ke pemangku kebijakan.

### Recommendation Engine
Rekomendasi aksi tindak lanjut otomatis per indikator, berbasis knowledge base pakar perikanan.

---

## 👥 Hierarki Pengguna (RBAC — 3 Tingkat Pengguna Sesuai Bab 2.3.6 Proposal)

| Tingkat | Role | Level | Akses Utama |
|---|---|---|---|
| **Tingkat 1** | KKP | G2G Pusat | Monitoring nasional, rekalkulasi AHP+TOPSIS, ekspor PDF |
| **Tingkat 2** | PEMDA | G2G Daerah | Dashboard regional wilayah provinsi/kabupaten |
| **Tingkat 3** | TPI | G2E Lapangan | Input hasil tangkapan harian & kelaikan cold storage |
| **Tingkat 3** | KOPERASI | G2E Lapangan | Input distribusi hasil laut & transaksi anggota |
| **Tingkat 3** | PENYULUH | G2E Lapangan | Input monitoring fasilitas & pelaporan darurat EWS |
| *Internal* | ADMIN | Superuser | Akses teknis manajemen master data (manual login) |

---

## 🔑 Akun Demo (Seed Data)

**Akun Pusat:**
- KKP: `kkp@smarthub.go.id` / `password123`
- Admin: `admin@smarthub.go.id` / `password123`
- PEMDA DKI: `pemda.dki@smarthub.go.id` / `password123`

**Akun Lapangan** (format: `[role].[lokasi]@smarthub.go.id` / `password123`):
- Role: `tpi`, `kop`, `pen`
- Lokasi: `muarabaru`, `cilacap`, `brondong`, `bitung`, `palabuhanratu`, `ternate`

---

## 🗓️ Info KMIPN VIII 2026

- **Technical Meeting**: Senin, 7 September 2026 — 15:00–16:30 WITA (Zoom)
- **Hari Lomba**: Kamis–Jumat, 10–11 September 2026 (Online Zoom)
- **Format Presentasi**: 10 menit presentasi + demo → 15 menit QnA → 5 menit jeda
- **Bobot Penilaian**: Karya 40% | Presentasi 60%
- **Kontribusi**: Rp 1.000.000/tim (Online)

### Kriteria Penilaian
- **Karya (40%)**: Fungsi & fitur, Keunikan, Implementasi (sudah ada mitra)
- **Presentasi (60%)**: Pemaparan, Komunikatif, Kreativitas gagasan, Diskusi/QnA

---

## 🖥️ VPS Cheatsheet

```bash
# SSH masuk
ssh root@202.10.48.95

# Cek status semua service
pm2 status
sudo systemctl status nginx
sudo systemctl status postgresql

# Restart semua
pm2 restart knmp-backend
sudo systemctl restart nginx

# Update dari Git
cd /var/www/knmp-smarthub
git pull origin main
cd knmp-smarthub-backend && pm2 restart knmp-backend
cd ../knmp-smarthub-frontend && npm run build

# Lihat log
pm2 logs knmp-backend
sudo tail -50 /var/log/nginx/error.log
```

---

## 📎 Catatan Penting

- VPS pernah down karena masalah dari Rumahweb (7 Sep 2026) — sudah kembali normal
- Naskah presentasi 10 menit sudah dibuat di artifact `naskah_presentasi_10_menit.md`
- QnA antisipasi juri ada di `daftar_qna_juri.md`
- Strategi demo: selipkan live demo di menit ke-3 (setelah slide Solusi), bukan di akhir
