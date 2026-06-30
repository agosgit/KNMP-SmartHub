const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { verifyToken, restrictTo } = require('../middleware/auth.middleware');

// Ambil Ringkasan Dashboard Nasional (Semua user yang login)
router.get('/national', verifyToken, dashboardController.getNationalSummary);

// Ambil data koordinat GIS Map
router.get('/map', verifyToken, dashboardController.getMapLocations);

// Ambil detail KNMP per ID
router.get('/knmp/:id', verifyToken, dashboardController.getKnmpDetails);

// Kalkulasi ulang Decision Engine (Hanya ADMIN & KKP)
router.post('/recalculate', verifyToken, restrictTo('ADMIN', 'KKP'), dashboardController.recalculateEngineData);

module.exports = router;
