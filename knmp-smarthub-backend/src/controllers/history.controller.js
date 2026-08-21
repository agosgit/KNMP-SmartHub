const prisma = require('../lib/db');

// GET /history/productions — Riwayat produksi yang diinput user ini
const getMyProductions = async (req, res) => {
  try {
    const where = {};
    // Admin & Pengelola bisa lihat semua, role lain hanya miliknya
    if (req.user.role !== 'ADMIN' && req.user.role !== 'PENGELOLA') {
      where.reporterId = req.user.id;
    }

    const productions = await prisma.fishProduction.findMany({
      where,
      include: {
        knmp: { select: { id: true, name: true } },
        reporter: { select: { name: true, role: true } }
      },
      orderBy: { date: 'desc' }
    });

    return res.json(productions);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil riwayat produksi.', error: error.message });
  }
};

// GET /history/distributions — Riwayat distribusi yang diinput user ini
const getMyDistributions = async (req, res) => {
  try {
    const where = {};
    if (req.user.role !== 'ADMIN' && req.user.role !== 'PENGELOLA') {
      where.reporterId = req.user.id;
    }

    const distributions = await prisma.fishDistribution.findMany({
      where,
      include: {
        knmp: { select: { id: true, name: true } },
        reporter: { select: { name: true, role: true } }
      },
      orderBy: { date: 'desc' }
    });

    return res.json(distributions);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil riwayat distribusi.', error: error.message });
  }
};

// GET /history/cooperatives — Riwayat aktivitas koperasi
const getMyCooperatives = async (req, res) => {
  try {
    // Koperasi tidak punya reporterId, jadi filter by knmpId jika user punya
    const where = {};
    if (req.user.role !== 'ADMIN' && req.user.role !== 'PENGELOLA') {
      // Jika user terikat KNMP tertentu, filter berdasarkan KNMP-nya
      const user = await prisma.user.findUnique({ where: { id: req.user.id } });
      if (user?.knmpId) {
        where.knmpId = user.knmpId;
      }
    }

    const cooperatives = await prisma.cooperative.findMany({
      where,
      include: {
        knmp: { select: { id: true, name: true } }
      },
      orderBy: { date: 'desc' }
    });

    return res.json(cooperatives);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil riwayat koperasi.', error: error.message });
  }
};

// GET /history/reports — Riwayat laporan monitoring yang diinput user ini
const getMyReports = async (req, res) => {
  try {
    const where = {};
    if (req.user.role !== 'ADMIN' && req.user.role !== 'PENGELOLA') {
      where.reporterId = req.user.id;
    }

    const reports = await prisma.monitoringReport.findMany({
      where,
      include: {
        knmp: { select: { id: true, name: true } },
        reporter: { select: { name: true, role: true } }
      },
      orderBy: { date: 'desc' }
    });

    return res.json(reports);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil riwayat laporan.', error: error.message });
  }
};

// GET /history/all — Ringkasan gabungan semua data (untuk ADMIN/PENGELOLA)
const getMyActivity = async (req, res) => {
  try {
    const [productions, distributions, cooperatives, reports] = await Promise.all([
      prisma.fishProduction.findMany({
        include: {
          knmp: { select: { id: true, name: true } },
          reporter: { select: { name: true, role: true } }
        },
        orderBy: { date: 'desc' },
        take: 50
      }),
      prisma.fishDistribution.findMany({
        include: {
          knmp: { select: { id: true, name: true } },
          reporter: { select: { name: true, role: true } }
        },
        orderBy: { date: 'desc' },
        take: 50
      }),
      prisma.cooperative.findMany({
        include: {
          knmp: { select: { id: true, name: true } }
        },
        orderBy: { date: 'desc' },
        take: 50
      }),
      prisma.monitoringReport.findMany({
        include: {
          knmp: { select: { id: true, name: true } },
          reporter: { select: { name: true, role: true } }
        },
        orderBy: { date: 'desc' },
        take: 50
      })
    ]);

    return res.json({
      productions,
      distributions,
      cooperatives,
      reports
    });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil riwayat aktivitas.', error: error.message });
  }
};

module.exports = {
  getMyProductions,
  getMyDistributions,
  getMyCooperatives,
  getMyReports,
  getMyActivity
};
