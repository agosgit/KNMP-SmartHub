const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Route Registrasi
router.post('/register', authController.register);

// Route Login
router.post('/login', authController.login);

// Route Profile (Memerlukan Token)
router.get('/me', verifyToken, authController.getProfile);

module.exports = router;
