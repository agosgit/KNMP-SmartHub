const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/db');

const register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // 1. Validasi input
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, dan nama harus diisi.' });
    }

    // 2. Cek apakah user sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar.' });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Buat user baru
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: role || 'PENGELOLA'
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    return res.status(201).json({
      message: 'Registrasi berhasil.',
      user
    });
  } catch (error) {
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validasi input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password harus diisi.' });
    }

    // 2. Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { knmp: true }
    });

    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }

    // 3. Cek password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }

    // 4. Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'knmp_smarthub_secret_key_2026_KMIPN',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.json({
      message: 'Login berhasil.',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        knmpId: user.knmpId,
        knmp: user.knmp
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.', error: error.message });
  }
};

const getProfile = async (req, res) => {
  return res.json({
    user: req.user
  });
};

module.exports = {
  register,
  login,
  getProfile
};
