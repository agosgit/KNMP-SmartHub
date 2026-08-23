const jwt = require('jsonwebtoken');
const prisma = require('../lib/db');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token tidak valid atau tidak ditemukan.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'knmp_smarthub_secret_key_2026_KMIPN');

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        knmpId: true,
        knmp: {
          select: {
            id: true,
            name: true,
            regionId: true,
            region: {
              select: {
                id: true,
                name: true,
                type: true,
                parentId: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'User tidak ditemukan.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Sesi habis atau token tidak valid.', error: error.message });
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Anda tidak memiliki hak akses untuk melakukan tindakan ini.' });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  restrictTo
};
