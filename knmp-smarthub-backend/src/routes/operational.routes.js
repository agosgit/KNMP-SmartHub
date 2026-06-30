const express = require('express');
const router = express.Router();
const operationalController = require('../controllers/operational.controller');
const { verifyToken, restrictTo } = require('../middleware/auth.middleware');

// Dropdown Helper (Semua role login)
router.get('/knmps', verifyToken, operationalController.getKnmpsList);

// Input Produksi (ADMIN, TPI, PENGELOLA)
router.post('/production', verifyToken, restrictTo('ADMIN', 'TPI', 'PENGELOLA'), operationalController.addProduction);

// Input Distribusi (ADMIN, KOPERASI, PENGELOLA)
router.post('/distribution', verifyToken, restrictTo('ADMIN', 'KOPERASI', 'PENGELOLA'), operationalController.addDistribution);

// Input Aktivitas Koperasi (ADMIN, KOPERASI, PENGELOLA)
router.post('/cooperative', verifyToken, restrictTo('ADMIN', 'KOPERASI', 'PENGELOLA'), operationalController.addCooperativeActivity);

// Input Laporan Monitoring (ADMIN, PENYULUH, PENGELOLA)
router.post('/report', verifyToken, restrictTo('ADMIN', 'PENYULUH', 'PENGELOLA'), operationalController.addMonitoringReport);

// Update Cold Storage Score (ADMIN, PENGELOLA)
router.post('/cold-storage', verifyToken, restrictTo('ADMIN', 'PENGELOLA'), operationalController.updateColdStorageScore);

module.exports = router;
