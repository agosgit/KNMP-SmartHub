require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const operationalRoutes = require('./routes/operational.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust Nginx Reverse Proxy (Wajib untuk express-rate-limit)
app.set('trust proxy', 1);

// Middleware Keamanan & Optimasi Produksi
app.use(helmet()); // Menyembunyikan header Express dan mengamankan HTTP headers
app.use(compression()); // Melakukan GZIP compression pada response API

// Konfigurasi CORS ketat untuk Production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://knmpsmarthub.cloud', 'https://www.knmpsmarthub.cloud'] 
    : '*', // Izinkan semua di development
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

// Rate Limiting (Mencegah Spam/DDoS/Brute Force)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // Batasi setiap IP maksimal 100 request per windowMs
  message: {
    message: 'Terlalu banyak permintaan dari IP ini, coba lagi dalam 15 menit.'
  }
});
app.use('/api/', limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing API
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/operational', operationalRoutes);
app.use('/api/admin', adminRoutes);

// Root Route untuk cek server
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to KNMP SmartHub API — Government Decision Intelligence Platform',
    status: 'ONLINE',
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Terjadi kesalahan pada server.',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
});
