const express = require('express');
const router = express.Router();
const historyController = require('../controllers/history.controller');
const { verifyToken, restrictTo } = require('../middleware/auth.middleware');

// Semua endpoint butuh login
router.use(verifyToken);

// Riwayat Produksi (ADMIN, TPI, PENGELOLA, PEMDA)
router.get('/productions', restrictTo('ADMIN', 'TPI', 'PENGELOLA', 'PEMDA'), historyController.getMyProductions);

// Riwayat Distribusi (ADMIN, KOPERASI, PENGELOLA, PEMDA)
router.get('/distributions', restrictTo('ADMIN', 'KOPERASI', 'PENGELOLA', 'PEMDA'), historyController.getMyDistributions);

// Riwayat Koperasi (ADMIN, KOPERASI, PENGELOLA, PEMDA)
router.get('/cooperatives', restrictTo('ADMIN', 'KOPERASI', 'PENGELOLA', 'PEMDA'), historyController.getMyCooperatives);

// Riwayat Laporan Monitoring (ADMIN, PENYULUH, PENGELOLA, PEMDA)
router.get('/reports', restrictTo('ADMIN', 'PENYULUH', 'PENGELOLA', 'PEMDA'), historyController.getMyReports);

// Semua riwayat gabungan (ADMIN, PENGELOLA, PEMDA)
router.get('/all', restrictTo('ADMIN', 'PENGELOLA', 'PEMDA'), historyController.getMyActivity);

module.exports = router;
