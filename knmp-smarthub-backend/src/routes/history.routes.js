const express = require('express');
const router = express.Router();
const historyController = require('../controllers/history.controller');
const { verifyToken, restrictTo } = require('../middleware/auth.middleware');

// Semua endpoint butuh login
router.use(verifyToken);

// Riwayat Produksi (ADMIN, TPI, PENGELOLA)
router.get('/productions', restrictTo('ADMIN', 'TPI', 'PENGELOLA'), historyController.getMyProductions);

// Riwayat Distribusi (ADMIN, KOPERASI, PENGELOLA)
router.get('/distributions', restrictTo('ADMIN', 'KOPERASI', 'PENGELOLA'), historyController.getMyDistributions);

// Riwayat Koperasi (ADMIN, KOPERASI, PENGELOLA)
router.get('/cooperatives', restrictTo('ADMIN', 'KOPERASI', 'PENGELOLA'), historyController.getMyCooperatives);

// Riwayat Laporan Monitoring (ADMIN, PENYULUH, PENGELOLA)
router.get('/reports', restrictTo('ADMIN', 'PENYULUH', 'PENGELOLA'), historyController.getMyReports);

// Semua riwayat gabungan (ADMIN, PENGELOLA)
router.get('/all', restrictTo('ADMIN', 'PENGELOLA'), historyController.getMyActivity);

module.exports = router;
