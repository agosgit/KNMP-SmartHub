const express = require('express');
const router = express.Router();
const operationalController = require('../controllers/operational.controller');
const { verifyToken, restrictTo } = require('../middleware/auth.middleware');

// Dropdown Helper (Semua role login)
router.get('/knmps', verifyToken, operationalController.getKnmpsList);

// Input Produksi (ADMIN, TPI, PENGELOLA, PEMDA)
router.post('/production', verifyToken, restrictTo('ADMIN', 'TPI', 'PENGELOLA', 'PEMDA'), operationalController.addProduction);

// Input Distribusi (ADMIN, KOPERASI, PENGELOLA, PEMDA)
router.post('/distribution', verifyToken, restrictTo('ADMIN', 'KOPERASI', 'PENGELOLA', 'PEMDA'), operationalController.addDistribution);

// Input Aktivitas Koperasi (ADMIN, KOPERASI, PENGELOLA, PEMDA)
router.post('/cooperative', verifyToken, restrictTo('ADMIN', 'KOPERASI', 'PENGELOLA', 'PEMDA'), operationalController.addCooperativeActivity);

// Input Laporan Monitoring (ADMIN, PENYULUH, PENGELOLA, PEMDA)
router.post('/report', verifyToken, restrictTo('ADMIN', 'PENYULUH', 'PENGELOLA', 'PEMDA'), operationalController.addMonitoringReport);

// Update Cold Storage Score (ADMIN, PENGELOLA, PEMDA)
router.post('/cold-storage', verifyToken, restrictTo('ADMIN', 'PENGELOLA', 'PEMDA'), operationalController.updateColdStorageScore);

module.exports = router;
