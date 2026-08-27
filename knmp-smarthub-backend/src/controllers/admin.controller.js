const bcrypt = require('bcryptjs');
const prisma = require('../lib/db');
const { calculateKnmpHealthIndex } = require('../services/healthIndex.service');
const { runTopsisCalculation } = require('../services/topsis.service');

// Helper: Sinkronisasi otomatis skor KPI Infrastruktur dan Cold Storage berdasarkan kondisi fasilitas riil
const syncKnmpFacilityKpis = async (knmpId) => {
  if (!knmpId) return;

  const facilities = await prisma.facility.findMany({
    where: { knmpId: parseInt(knmpId) }
  });

  if (facilities.length === 0) return;

  // 1. Hitung Skor KPI INFRASTRUCTURE: (Fasilitas ACTIVE / Total Fasilitas) * 100
  const activeCount = facilities.filter(f => f.status === 'ACTIVE').length;
  const infraScore = parseFloat(((activeCount / facilities.length) * 100).toFixed(2));

  const infraKpi = await prisma.kpiDefinition.findUnique({
    where: { key: 'INFRASTRUCTURE' }
  });

  if (infraKpi) {
    await prisma.kpiScore.create({
      data: {
        knmpId: parseInt(knmpId),
        kpiDefinitionId: infraKpi.id,
        score: infraScore,
        date: new Date()
      }
    });
  }

  // 2. Cek status Cold Storage
  const coldStorageFacilities = facilities.filter(f => f.type === 'COLD_STORAGE');
  if (coldStorageFacilities.length > 0) {
    const csKpi = await prisma.kpiDefinition.findUnique({
      where: { key: 'COLD_STORAGE' }
    });

    if (csKpi) {
      const activeCs = coldStorageFacilities.filter(f => f.status === 'ACTIVE');
      const maintenanceCs = coldStorageFacilities.filter(f => f.status === 'MAINTENANCE');

      let csScore;
      if (activeCs.length === coldStorageFacilities.length) {
        const existingScore = await prisma.kpiScore.findFirst({
          where: { knmpId: parseInt(knmpId), kpiDefinitionId: csKpi.id },
          orderBy: { date: 'desc' }
        });
        csScore = existingScore ? existingScore.score : 85.0;
      } else if (activeCs.length > 0 || maintenanceCs.length > 0) {
        csScore = 50.0;
      } else {
        csScore = 20.0;
      }

      await prisma.kpiScore.create({
        data: {
          knmpId: parseInt(knmpId),
          kpiDefinitionId: csKpi.id,
          score: csScore,
          date: new Date()
        }
      });
    }
  }

  // Trigger recalculate Health Index & TOPSIS
  await calculateKnmpHealthIndex(parseInt(knmpId));
  await runTopsisCalculation();
};

// ============================================================
// USER MANAGEMENT
// ============================================================

// GET /admin/users — Daftar semua user
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        knmpId: true,
        knmp: {
          select: { id: true, name: true }
        },
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil daftar user.', error: error.message });
  }
};

// POST /admin/users — Buat user baru dari Admin Panel
const createUser = async (req, res) => {
  try {
    const { email, password, name, role, knmpId } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, dan nama harus diisi.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: role || 'PENGELOLA',
        knmpId: knmpId ? parseInt(knmpId) : null
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        knmpId: true,
        knmp: { select: { id: true, name: true } },
        createdAt: true
      }
    });

    return res.status(201).json({
      message: 'User baru berhasil dibuat.',
      user
    });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal membuat user baru.', error: error.message });
  }
};

// PUT /admin/users/:id/role — Update role & KNMP assignment user
const updateUserRole = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { role, knmpId } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID user tidak valid.' });
    }

    // Jangan biarkan admin menghapus role dirinya sendiri
    if (id === req.user.id) {
      return res.status(400).json({ message: 'Tidak dapat mengubah role akun Anda sendiri.' });
    }

    const validRoles = ['ADMIN', 'PENGELOLA', 'TPI', 'KOPERASI', 'PENYULUH', 'PEMDA', 'KKP'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ message: 'Role tidak valid.' });
    }

    const updateData = {};
    if (role) updateData.role = role;
    if (knmpId !== undefined) updateData.knmpId = knmpId ? parseInt(knmpId) : null;

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        knmpId: true,
        knmp: { select: { id: true, name: true } },
        updatedAt: true
      }
    });

    return res.json({
      message: 'Data user berhasil diperbarui.',
      user
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'User tidak ditemukan.' });
    }
    return res.status(500).json({ message: 'Gagal mengubah data user.', error: error.message });
  }
};

// DELETE /admin/users/:id — Hapus user
const deleteUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID user tidak valid.' });
    }

    // Jangan biarkan admin menghapus dirinya sendiri
    if (id === req.user.id) {
      return res.status(400).json({ message: 'Tidak dapat menghapus akun Anda sendiri.' });
    }

    await prisma.user.delete({ where: { id } });

    return res.json({ message: 'User berhasil dihapus.' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'User tidak ditemukan.' });
    }
    return res.status(500).json({ message: 'Gagal menghapus user.', error: error.message });
  }
};

// ============================================================
// KNMP MANAGEMENT
// ============================================================

// GET /admin/regions — Helper dropdown wilayah
const getRegions = async (req, res) => {
  try {
    const regions = await prisma.region.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        parentId: true
      },
      orderBy: { name: 'asc' }
    });

    return res.json(regions);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil daftar wilayah.', error: error.message });
  }
};

// POST /admin/knmps — Tambah lokasi KNMP baru
const createKnmp = async (req, res) => {
  try {
    const { name, address, latitude, longitude, regionId } = req.body;

    if (!name || !address || latitude === undefined || longitude === undefined || !regionId) {
      return res.status(400).json({ message: 'Nama, alamat, latitude, longitude, dan wilayah harus diisi.' });
    }

    const knmp = await prisma.knmp.create({
      data: {
        name,
        address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        regionId: parseInt(regionId)
      },
      include: {
        region: { select: { id: true, name: true } }
      }
    });

    return res.status(201).json({
      message: 'Lokasi KNMP baru berhasil ditambahkan.',
      knmp
    });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal menambahkan lokasi KNMP.', error: error.message });
  }
};

// PUT /admin/knmps/:id — Edit lokasi KNMP
const updateKnmp = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, address, latitude, longitude, regionId, status } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID KNMP tidak valid.' });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (address) updateData.address = address;
    if (latitude !== undefined) updateData.latitude = parseFloat(latitude);
    if (longitude !== undefined) updateData.longitude = parseFloat(longitude);
    if (regionId) updateData.regionId = parseInt(regionId);
    if (status) updateData.status = status;

    const knmp = await prisma.knmp.update({
      where: { id },
      data: updateData,
      include: {
        region: { select: { id: true, name: true } }
      }
    });

    return res.json({
      message: 'Data KNMP berhasil diperbarui.',
      knmp
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Lokasi KNMP tidak ditemukan.' });
    }
    return res.status(500).json({ message: 'Gagal memperbarui data KNMP.', error: error.message });
  }
};

// DELETE /admin/knmps/:id — Hapus lokasi KNMP dan data terkait
const deleteKnmp = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID KNMP tidak valid.' });
    }

    // Hapus data terkait terlebih dahulu (cascade manual)
    await prisma.$transaction([
      prisma.facility.deleteMany({ where: { knmpId: id } }),
      prisma.fishProduction.deleteMany({ where: { knmpId: id } }),
      prisma.fishDistribution.deleteMany({ where: { knmpId: id } }),
      prisma.cooperative.deleteMany({ where: { knmpId: id } }),
      prisma.kpiScore.deleteMany({ where: { knmpId: id } }),
      prisma.healthIndex.deleteMany({ where: { knmpId: id } }),
      prisma.topsisRanking.deleteMany({ where: { knmpId: id } }),
      prisma.monitoringReport.deleteMany({ where: { knmpId: id } }),
      prisma.user.updateMany({ where: { knmpId: id }, data: { knmpId: null } }),
      prisma.knmp.delete({ where: { id } })
    ]);

    return res.json({ message: 'Lokasi KNMP dan seluruh data terkait berhasil dihapus.' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Lokasi KNMP tidak ditemukan.' });
    }
    return res.status(500).json({ message: 'Gagal menghapus lokasi KNMP.', error: error.message });
  }
};

// ============================================================
// FACILITY MANAGEMENT
// ============================================================

// GET /admin/facilities — Daftar semua fasilitas (dengan filter opsional per KNMP)
const getAllFacilities = async (req, res) => {
  try {
    const { knmpId } = req.query;

    const where = {};
    if (knmpId) where.knmpId = parseInt(knmpId);

    const facilities = await prisma.facility.findMany({
      where,
      include: {
        knmp: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json(facilities);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil daftar fasilitas.', error: error.message });
  }
};

// POST /admin/facilities — Tambah fasilitas baru
const createFacility = async (req, res) => {
  try {
    const { knmpId, name, type, capacity, status } = req.body;

    if (!knmpId || !name || !type || capacity === undefined) {
      return res.status(400).json({ message: 'KNMP, nama, tipe, dan kapasitas harus diisi.' });
    }

    const validTypes = ['COLD_STORAGE', 'TPI', 'PABRIK_ES', 'DERMAGA', 'SPBN', 'LAINNYA'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: 'Tipe fasilitas tidak valid.' });
    }

    const facility = await prisma.facility.create({
      data: {
        knmpId: parseInt(knmpId),
        name,
        type,
        capacity: parseFloat(capacity),
        status: status || 'ACTIVE'
      },
      include: {
        knmp: { select: { id: true, name: true } }
      }
    });

    // Sinkronisasi otomatis KPI Infrastruktur & Cold Storage
    await syncKnmpFacilityKpis(facility.knmpId);

    return res.status(201).json({
      message: 'Fasilitas baru berhasil ditambahkan dan skor KPI disinkronkan.',
      facility
    });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal menambahkan fasilitas.', error: error.message });
  }
};

// PUT /admin/facilities/:id — Edit fasilitas
const updateFacility = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, type, capacity, status } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID fasilitas tidak valid.' });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (type) updateData.type = type;
    if (capacity !== undefined) updateData.capacity = parseFloat(capacity);
    if (status) updateData.status = status;

    const facility = await prisma.facility.update({
      where: { id },
      data: updateData,
      include: {
        knmp: { select: { id: true, name: true } }
      }
    });

    // Sinkronisasi otomatis KPI Infrastruktur & Cold Storage
    await syncKnmpFacilityKpis(facility.knmpId);

    return res.json({
      message: 'Data fasilitas berhasil diperbarui dan skor KPI disinkronkan.',
      facility
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Fasilitas tidak ditemukan.' });
    }
    return res.status(500).json({ message: 'Gagal memperbarui data fasilitas.', error: error.message });
  }
};

// DELETE /admin/facilities/:id — Hapus fasilitas
const deleteFacility = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID fasilitas tidak valid.' });
    }

    const facility = await prisma.facility.findUnique({
      where: { id },
      select: { knmpId: true }
    });

    if (!facility) {
      return res.status(404).json({ message: 'Fasilitas tidak ditemukan.' });
    }

    const targetKnmpId = facility.knmpId;

    await prisma.facility.delete({ where: { id } });

    // Sinkronisasi otomatis KPI Infrastruktur & Cold Storage
    await syncKnmpFacilityKpis(targetKnmpId);

    return res.json({ message: 'Fasilitas berhasil dihapus dan skor KPI disinkronkan.' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Fasilitas tidak ditemukan.' });
    }
    return res.status(500).json({ message: 'Gagal menghapus fasilitas.', error: error.message });
  }
};

// ============================================================
// KPI / AHP WEIGHT MANAGEMENT
// ============================================================

// GET /admin/kpi-definitions — Lihat semua definisi KPI dan bobot AHP
const getKpiDefinitions = async (req, res) => {
  try {
    const definitions = await prisma.kpiDefinition.findMany({
      orderBy: { id: 'asc' }
    });

    // Hitung total bobot untuk validasi
    const totalWeight = definitions.reduce((sum, d) => sum + d.weight, 0);

    return res.json({
      definitions,
      totalWeight: parseFloat(totalWeight.toFixed(3))
    });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil daftar definisi KPI.', error: error.message });
  }
};

// PUT /admin/kpi-definitions/:id — Update bobot dan deskripsi KPI
const updateKpiDefinition = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { weight, description } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID KPI tidak valid.' });
    }

    if (weight === undefined && description === undefined) {
      return res.status(400).json({ message: 'Minimal satu field (weight atau description) harus diisi.' });
    }

    const updateData = {};
    if (weight !== undefined) {
      const parsedWeight = parseFloat(weight);
      if (isNaN(parsedWeight) || parsedWeight < 0 || parsedWeight > 1) {
        return res.status(400).json({ message: 'Bobot harus berupa angka desimal antara 0 dan 1.' });
      }
      updateData.weight = parsedWeight;
    }
    if (description !== undefined) updateData.description = description;

    const updated = await prisma.kpiDefinition.update({
      where: { id },
      data: updateData
    });

    // Cek apakah total bobot masih konsisten (= 1.000)
    const allDefinitions = await prisma.kpiDefinition.findMany();
    const totalWeight = allDefinitions.reduce((sum, d) => sum + d.weight, 0);

    return res.json({
      message: 'Definisi KPI berhasil diperbarui.',
      definition: updated,
      totalWeight: parseFloat(totalWeight.toFixed(3)),
      isWeightValid: Math.abs(totalWeight - 1.0) < 0.005 // Toleransi pembulatan
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Definisi KPI tidak ditemukan.' });
    }
    return res.status(500).json({ message: 'Gagal memperbarui definisi KPI.', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUserRole,
  deleteUser,
  getRegions,
  createKnmp,
  updateKnmp,
  deleteKnmp,
  getAllFacilities,
  createFacility,
  updateFacility,
  deleteFacility,
  getKpiDefinitions,
  updateKpiDefinition
};
