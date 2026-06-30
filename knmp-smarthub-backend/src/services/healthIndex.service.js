const prisma = require('../lib/db');

/**
 * Mendapatkan klasifikasi status berdasarkan nilai Health Index
 * @param {number} score 
 * @returns {string} Status
 */
const getStatusClassification = (score) => {
  if (score >= 80) return 'SANGAT_BAIK';
  if (score >= 70) return 'BAIK';
  if (score >= 60) return 'MODERAT';
  if (score >= 50) return 'PERLU_PERHATIAN';
  return 'KRITIS';
};

/**
 * Menghitung Health Index untuk sebuah lokasi KNMP berdasarkan skor KPI terbaru
 * @param {number} knmpId 
 * @param {Date} [date] Tanggal perhitungan (default: saat ini)
 * @returns {Promise<object>} Hasil perhitungan Health Index
 */
const calculateKnmpHealthIndex = async (knmpId, date = new Date()) => {
  // 1. Ambil semua definisi KPI beserta bobotnya
  const kpiDefinitions = await prisma.kpiDefinition.findMany();
  
  if (kpiDefinitions.length === 0) {
    throw new Error('Definisi KPI (KpiDefinition) belum di-setup di database.');
  }

  // 2. Ambil skor KPI terbaru untuk lokasi KNMP ini
  // Untuk masing-masing KPI, ambil rekaman paling baru
  const latestScores = [];
  for (const definition of kpiDefinitions) {
    const latestScore = await prisma.kpiScore.findFirst({
      where: {
        knmpId,
        kpiDefinitionId: definition.id
      },
      orderBy: {
        date: 'desc'
      }
    });

    latestScores.push({
      definition,
      score: latestScore ? latestScore.score : 0 // Default 0 jika belum ada input
    });
  }

  // 3. Hitung Health Index menggunakan bobot AHP: Health Index = Sum(Score * Weight)
  let healthIndex = 0;
  const kpiDetails = [];

  for (const item of latestScores) {
    const weightedContribution = item.score * item.definition.weight;
    healthIndex += weightedContribution;
    
    kpiDetails.push({
      kpiName: item.definition.name,
      kpiKey: item.definition.key,
      score: item.score,
      weight: item.definition.weight,
      contribution: parseFloat(weightedContribution.toFixed(4))
    });
  }

  healthIndex = parseFloat(healthIndex.toFixed(2));
  const status = getStatusClassification(healthIndex);

  // 4. Simpan hasil perhitungan ke tabel HealthIndex (upsert atau create baru)
  // Untuk keperluan history, kita selalu buat record baru per hari/periode
  // Namun untuk hari yang sama, kita bisa update record yang sudah ada
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const existingRecord = await prisma.healthIndex.findFirst({
    where: {
      knmpId,
      date: {
        gte: startOfDay,
        lte: endOfDay
      }
    }
  });

  let savedRecord;
  if (existingRecord) {
    savedRecord = await prisma.healthIndex.update({
      where: { id: existingRecord.id },
      data: {
        healthIndex,
        status,
        date
      }
    });
  } else {
    savedRecord = await prisma.healthIndex.create({
      data: {
        knmpId,
        healthIndex,
        status,
        date
      }
    });
  }

  // 5. Update status kesehatan global di tabel Knmp
  await prisma.knmp.update({
    where: { id: knmpId },
    data: { status: status === 'KRITIS' ? 'CRITICAL' : (status === 'PERLU_PERHATIAN' ? 'WARNING' : 'NORMAL') }
  });

  return {
    knmpId,
    healthIndex,
    status,
    kpiDetails,
    recordId: savedRecord.id
  };
};

/**
 * Menghitung Health Index untuk seluruh lokasi KNMP yang terdaftar
 * @returns {Promise<Array>} List hasil perhitungan Health Index
 */
const calculateAllHealthIndices = async () => {
  const knmps = await prisma.knmp.findMany({ select: { id: true, name: true } });
  const results = [];
  
  for (const knmp of knmps) {
    try {
      const result = await calculateKnmpHealthIndex(knmp.id);
      results.push({
        knmpName: knmp.name,
        ...result
      });
    } catch (error) {
      console.error(`Gagal menghitung Health Index untuk ${knmp.name}:`, error.message);
    }
  }

  return results;
};

module.exports = {
  calculateKnmpHealthIndex,
  calculateAllHealthIndices,
  getStatusClassification
};
