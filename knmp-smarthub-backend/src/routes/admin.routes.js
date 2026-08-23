const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyToken, restrictTo } = require('../middleware/auth.middleware');

// Semua route di sini memerlukan login
router.use(verifyToken);

// ---- KPI / AHP Weight Management (ADMIN & KKP) ----
// KKP boleh melihat dan mengubah bobot AHP sesuai proposal
router.get('/kpi-definitions', restrictTo('ADMIN', 'KKP'), adminController.getKpiDefinitions);
router.put('/kpi-definitions/:id', restrictTo('ADMIN', 'KKP'), adminController.updateKpiDefinition);

// ---- Seluruh route di bawah ini hanya untuk ADMIN ----

// ---- User Management ----
router.get('/users', restrictTo('ADMIN'), adminController.getAllUsers);
router.post('/users', restrictTo('ADMIN'), adminController.createUser);
router.put('/users/:id/role', restrictTo('ADMIN'), adminController.updateUserRole);
router.delete('/users/:id', restrictTo('ADMIN'), adminController.deleteUser);

// ---- Region Helper ----
router.get('/regions', restrictTo('ADMIN'), adminController.getRegions);

// ---- KNMP Management ----
router.post('/knmps', restrictTo('ADMIN'), adminController.createKnmp);
router.put('/knmps/:id', restrictTo('ADMIN'), adminController.updateKnmp);
router.delete('/knmps/:id', restrictTo('ADMIN'), adminController.deleteKnmp);

// ---- Facility Management ----
router.get('/facilities', restrictTo('ADMIN'), adminController.getAllFacilities);
router.post('/facilities', restrictTo('ADMIN'), adminController.createFacility);
router.put('/facilities/:id', restrictTo('ADMIN'), adminController.updateFacility);
router.delete('/facilities/:id', restrictTo('ADMIN'), adminController.deleteFacility);

module.exports = router;

