const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyToken, restrictTo } = require('../middleware/auth.middleware');

// Semua route di sini hanya untuk role ADMIN
router.use(verifyToken, restrictTo('ADMIN'));

// ---- User Management ----
router.get('/users', adminController.getAllUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);

// ---- Region Helper ----
router.get('/regions', adminController.getRegions);

// ---- KNMP Management ----
router.post('/knmps', adminController.createKnmp);
router.put('/knmps/:id', adminController.updateKnmp);
router.delete('/knmps/:id', adminController.deleteKnmp);

// ---- Facility Management ----
router.get('/facilities', adminController.getAllFacilities);
router.post('/facilities', adminController.createFacility);
router.put('/facilities/:id', adminController.updateFacility);
router.delete('/facilities/:id', adminController.deleteFacility);

module.exports = router;
