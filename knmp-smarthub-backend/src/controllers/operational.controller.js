const prisma = require('../lib/db');
const { calculateKnmpHealthIndex } = require('../services/healthIndex.service');
const { runTopsisCalculation } = require('../services/topsis.service');

// Target konstanta untuk simulasi kalkulasi skor KPI (0 - 100)
const TARGETS = {
  PRODUCTION_KG: 20000,   // Target produksi 20.000 kg per bulan/periode
  DISTRIBUTION_KG: 15000, // Target distribusi 15.000 kg per bulan/periode
  COOP_TRANSACTIONS: 100  // Target transaksi koperasi 100 kali per bulan/periode
};

// 1. Input Data Produksi Perikanan (Oleh Aktor: Petugas TPI / Pengelola)
const addProduction = async (req, res) => {
  try {
    const { knmpId, fishType, volumeKg, date } = req.body;
    const reporterId = req.user.id; // Diambil dari token JWT verified

    if (!knmpId || !fishType || !volumeKg) {
      return res.status(400).json({ message: 'Data KNMP, jenis ikan, dan volume (kg) harus diisi.' });
    }

    const inputDate = date ? new Date(date) : new Date();

    // A. Simpan data produksi mentah
    const production = await prisma.fishProduction.create({
      data: {
        knmpId: parseInt(knmpId),
        fishType,
        volumeKg: parseFloat(volumeKg),
        reporterId,
        date: inputDate
      }
    });

    // B. Hitung skor KPI Produksi (0 - 100)
    // Skor = (Volume Terkumpul / Target) * 100, max 100
    const calculatedScore = Math.min(100, (parseFloat(volumeKg) / TARGETS.PRODUCTION_KG) * 100);

    // C. Cari definisi KPI untuk PRODUCTION
    const kpiDefinition = await prisma.kpiDefinition.findUnique({
      where: { key: 'PRODUCTION' }
    });

    if (kpiDefinition) {
      // Simpan skor KPI ke database
      await prisma.kpiScore.create({
        data: {
          knmpId: parseInt(knmpId),
          kpiDefinitionId: kpiDefinition.id,
          score: parseFloat(calculatedScore.toFixed(2)),
          date: inputDate
        }
      });

      // D. Trigger kalkulasi Health Index & TOPSIS secara otomatis (Real-time update)
      await calculateKnmpHealthIndex(parseInt(knmpId));
      await runTopsisCalculation();
    }

    return res.status(201).json({
      message: 'Data produksi berhasil disimpan dan skor KPI terupdate.',
      production
    });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal menyimpan data produksi.', error: error.message });
  }
};

// 2. Input Data Distribusi Hasil Tangkapan (Oleh Aktor: Koperasi / Pengelola)
const addDistribution = async (req, res) => {
  try {
    const { knmpId, destination, volumeKg, date } = req.body;
    const reporterId = req.user.id;

    if (!knmpId || !destination || !volumeKg) {
      return res.status(400).json({ message: 'Data KNMP, tujuan distribusi, dan volume (kg) harus diisi.' });
    }

    const inputDate = date ? new Date(date) : new Date();

    // A. Simpan data distribusi mentah
    const distribution = await prisma.fishDistribution.create({
      data: {
        knmpId: parseInt(knmpId),
        destination,
        volumeKg: parseFloat(volumeKg),
        reporterId,
        date: inputDate
      }
    });

    // B. Hitung skor KPI Distribusi (0 - 100)
    const calculatedScore = Math.min(100, (parseFloat(volumeKg) / TARGETS.DISTRIBUTION_KG) * 100);

    // C. Update skor KPI
    const kpiDefinition = await prisma.kpiDefinition.findUnique({
      where: { key: 'DISTRIBUTION' }
    });

    if (kpiDefinition) {
      await prisma.kpiScore.create({
        data: {
          knmpId: parseInt(knmpId),
          kpiDefinitionId: kpiDefinition.id,
          score: parseFloat(calculatedScore.toFixed(2)),
          date: inputDate
        }
      });

      // D. Trigger recalculation
      await calculateKnmpHealthIndex(parseInt(knmpId));
      await runTopsisCalculation();
    }

    return res.status(201).json({
      message: 'Data distribusi berhasil disimpan dan skor KPI terupdate.',
      distribution
    });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal menyimpan data distribusi.', error: error.message });
  }
};

// 3. Input Aktivitas Koperasi Nelayan (Oleh Aktor: Koperasi / Pengelola)
const addCooperativeActivity = async (req, res) => {
  try {
    const { knmpId, name, activeMembers, transactions, transactionValue, date } = req.body;

    if (!knmpId || !name || !activeMembers || !transactions || !transactionValue) {
      return res.status(400).json({ message: 'Semua kolom aktivitas koperasi wajib diisi.' });
    }

    const inputDate = date ? new Date(date) : new Date();

    // A. Simpan data koperasi mentah
    const coop = await prisma.cooperative.create({
      data: {
        knmpId: parseInt(knmpId),
        name,
        activeMembers: parseInt(activeMembers),
        transactions: parseInt(transactions),
        transactionValue: parseFloat(transactionValue),
        date: inputDate
      }
    });

    // B. Hitung skor KPI Koperasi (0 - 100)
    const calculatedScore = Math.min(100, (parseInt(transactions) / TARGETS.COOP_TRANSACTIONS) * 100);

    // C. Update skor KPI
    const kpiDefinition = await prisma.kpiDefinition.findUnique({
      where: { key: 'COOPERATIVE' }
    });

    if (kpiDefinition) {
      await prisma.kpiScore.create({
        data: {
          knmpId: parseInt(knmpId),
          kpiDefinitionId: kpiDefinition.id,
          score: parseFloat(calculatedScore.toFixed(2)),
          date: inputDate
        }
      });

      await calculateKnmpHealthIndex(parseInt(knmpId));
      await runTopsisCalculation();
    }

    return res.status(201).json({
      message: 'Data aktivitas koperasi berhasil disimpan dan skor KPI terupdate.',
      cooperative: coop
    });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal menyimpan data koperasi.', error: error.message });
  }
};

// 4. Input Laporan Lapangan / Monitoring Report (Oleh Aktor: Penyuluh)
const addMonitoringReport = async (req, res) => {
  try {
    const { knmpId, title, notes, status, date } = req.body;
    const reporterId = req.user.id;

    if (!knmpId || !title || !notes || !status) {
      return res.status(400).json({ message: 'Data KNMP, judul laporan, catatan, dan status (NORMAL, WARNING, CRITICAL) harus diisi.' });
    }

    const inputDate = date ? new Date(date) : new Date();

    // A. Simpan data laporan
    const report = await prisma.monitoringReport.create({
      data: {
        knmpId: parseInt(knmpId),
        title,
        notes,
        status,
        reporterId,
        date: inputDate
      }
    });

    // B. Sesuaikan status kesehatan global KNMP jika status laporannya WARNING atau CRITICAL
    if (status === 'WARNING' || status === 'CRITICAL') {
      await prisma.knmp.update({
        where: { id: parseInt(knmpId) },
        data: { status }
      });
    }

    return res.status(201).json({
      message: 'Laporan monitoring lapangan berhasil disimpan.',
      report
    });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal menyimpan laporan monitoring.', error: error.message });
  }
};

// 5. Update Status Utilisasi Cold Storage (Oleh Aktor: Pengelola)
const updateColdStorageScore = async (req, res) => {
  try {
    const { knmpId, score, date } = req.body;

    if (!knmpId || score === undefined) {
      return res.status(400).json({ message: 'KNMP ID dan skor utilisasi cold storage (0-100) harus diisi.' });
    }

    const inputDate = date ? new Date(date) : new Date();

    const kpiDefinition = await prisma.kpiDefinition.findUnique({
      where: { key: 'COLD_STORAGE' }
    });

    if (!kpiDefinition) {
      return res.status(404).json({ message: 'Definisi KPI COLD_STORAGE tidak ditemukan.' });
    }

    // Simpan skor
    const kpiScore = await prisma.kpiScore.create({
      data: {
        knmpId: parseInt(knmpId),
        kpiDefinitionId: kpiDefinition.id,
        score: parseFloat(score),
        date: inputDate
      }
    });

    // Recalculate
    await calculateKnmpHealthIndex(parseInt(knmpId));
    await runTopsisCalculation();

    return res.status(201).json({
      message: 'Skor KPI Cold Storage berhasil diperbarui.',
      kpiScore
    });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal memperbarui skor Cold Storage.', error: error.message });
  }
};

// Helper: Get list lokasi KNMP untuk dropdown forms di frontend
const getKnmpsList = async (req, res) => {
  try {
    const knmps = await prisma.knmp.findMany({
      select: {
        id: true,
        name: true,
        address: true
      },
      orderBy: { name: 'asc' }
    });
    return res.json(knmps);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil daftar KNMP.', error: error.message });
  }
};

module.exports = {
  addProduction,
  addDistribution,
  addCooperativeActivity,
  addMonitoringReport,
  updateColdStorageScore,
  getKnmpsList
};
