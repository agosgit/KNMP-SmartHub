const prisma = require('../lib/db');
const { calculateAllHealthIndices } = require('../services/healthIndex.service');
const { runTopsisCalculation } = require('../services/topsis.service');
const { getActiveEarlyWarnings, generateKnmpRecommendations } = require('../services/recommendation.service');

/**
 * Membangun filter Prisma `where` untuk query KNMP berdasarkan role dan scope user.
 * - ADMIN, KKP, PENGELOLA: lihat semua (nasional)
 * - PEMDA: lihat KNMP di provinsi yang sama
 * - TPI, KOPERASI, PENYULUH: lihat hanya KNMP yang ditugaskan
 */
const buildKnmpFilter = async (user) => {
  const nationalRoles = ['ADMIN', 'KKP', 'PENGELOLA'];
  if (nationalRoles.includes(user.role)) return {};

  if (user.role === 'PEMDA' && user.knmp?.region) {
    // PEMDA melihat KNMP se-provinsi
    // Cari parentId (provinsi) dari kabupaten user
    const provinceId = user.knmp.region.type === 'PROVINSI'
      ? user.knmp.region.id
      : user.knmp.region.parentId;

    if (provinceId) {
      // Cari semua kabupaten di bawah provinsi ini
      const regionsInProvince = await prisma.region.findMany({
        where: {
          OR: [
            { id: provinceId },
            { parentId: provinceId }
          ]
        },
        select: { id: true }
      });
      const regionIds = regionsInProvince.map(r => r.id);
      return { regionId: { in: regionIds } };
    }
  }

  // TPI, KOPERASI, PENYULUH — hanya KNMP assigned
  if (user.knmpId) return { id: user.knmpId };

  return {};
};

/**
 * Mendapatkan label scope untuk ditampilkan di dashboard frontend
 */
const getScopeLabel = (user) => {
  const nationalRoles = ['ADMIN', 'KKP', 'PENGELOLA'];
  if (nationalRoles.includes(user.role)) return 'Nasional';
  if (user.role === 'PEMDA' && user.knmp?.region) {
    const regionName = user.knmp.region.type === 'PROVINSI'
      ? user.knmp.region.name
      : user.knmp.region.name; // kabupaten — tampilkan nama kabupaten
    return `Wilayah ${regionName}`;
  }
  if (user.knmp) return user.knmp.name;
  return 'Nasional';
};

// 1. Dapatkan Ringkasan Data Dashboard
const getNationalSummary = async (req, res) => {
  try {
    // Build filter berdasarkan role user
    const knmpFilter = await buildKnmpFilter(req.user);
    const scopeLabel = getScopeLabel(req.user);

    // A. Hitung total lokasi dan fasilitas (filtered)
    const totalKnmps = await prisma.knmp.count({ where: knmpFilter });
    const totalFacilities = await prisma.facility.count({
      where: knmpFilter.id
        ? { knmpId: knmpFilter.id }
        : knmpFilter.regionId
          ? { knmp: { regionId: knmpFilter.regionId } }
          : {}
    });

    // B. Hitung rata-rata Health Index (dari record terbaru, filtered)
    const knmps = await prisma.knmp.findMany({
      where: knmpFilter,
      include: {
        healthIndices: {
          orderBy: { date: 'desc' },
          take: 1
        }
      }
    });

    let sumHealth = 0;
    let countHealth = 0;
    const statusCounts = {
      SANGAT_BAIK: 0,
      BAIK: 0,
      PERLU_PERHATIAN: 0,
      KRITIS: 0
    };

    knmps.forEach(k => {
      if (k.healthIndices.length > 0) {
        const h = k.healthIndices[0];
        sumHealth += h.healthIndex;
        countHealth++;
        if (statusCounts[h.status] !== undefined) {
          statusCounts[h.status]++;
        }
      }
    });

    const averageHealthIndex = countHealth > 0 ? parseFloat((sumHealth / countHealth).toFixed(2)) : 0;

    // C. Ambil rata-rata skor per indikator KPI (filtered)
    const kpiDefinitions = await prisma.kpiDefinition.findMany();
    const kpiAverages = [];

    for (const definition of kpiDefinitions) {
      let sumScore = 0;
      let countScore = 0;

      for (const knmp of knmps) {
        const latestKpiScore = await prisma.kpiScore.findFirst({
          where: {
            knmpId: knmp.id,
            kpiDefinitionId: definition.id
          },
          orderBy: { date: 'desc' }
        });

        if (latestKpiScore) {
          sumScore += latestKpiScore.score;
          countScore++;
        }
      }

      kpiAverages.push({
        key: definition.key,
        name: definition.name,
        weight: definition.weight,
        averageScore: countScore > 0 ? parseFloat((sumScore / countScore).toFixed(2)) : 0
      });
    }

    // D. Ambil Peringkat TOPSIS Terupdate (filtered)
    const topsisFilter = knmpFilter.id
      ? { knmpId: knmpFilter.id }
      : knmpFilter.regionId
        ? { knmp: { regionId: knmpFilter.regionId } }
        : {};

    const rankings = await prisma.topsisRanking.findMany({
      where: topsisFilter,
      include: {
        knmp: {
          select: {
            id: true,
            name: true,
            status: true
          }
        }
      },
      orderBy: { ranking: 'asc' }
    });

    // E. Dapatkan daftar Peringatan Dini (Early Warning)
    const activeWarnings = await getActiveEarlyWarnings();
    // Filter warnings berdasarkan scope
    const knmpIds = knmps.map(k => k.id);
    const filteredWarnings = activeWarnings.filter(w =>
      knmpIds.length === 0 || knmpIds.includes(w.knmpId)
    );

    return res.json({
      scopeLabel,
      summary: {
        totalKnmps,
        totalFacilities,
        averageHealthIndex,
        statusCounts
      },
      kpiAverages,
      rankings,
      activeWarnings: filteredWarnings
    });
  } catch (error) {
    return res.status(500).json({ message: 'Terjadi kesalahan saat memproses data dashboard.', error: error.message });
  }
};

// 2. Dapatkan Detail Informasi Per Lokasi KNMP
const getKnmpDetails = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID KNMP tidak valid.' });
    }

    // A. Cari detail KNMP
    const knmp = await prisma.knmp.findUnique({
      where: { id },
      include: {
        region: true,
        facilities: true,
        healthIndices: {
          orderBy: { date: 'desc' },
          take: 6 // Ambil 6 riwayat terakhir untuk chart tren
        },
        topsisRankings: {
          orderBy: { date: 'desc' },
          take: 1
        },
        monitoringReports: {
          orderBy: { date: 'desc' },
          include: {
            reporter: {
              select: { name: true, role: true }
            }
          }
        }
      }
    });

    if (!knmp) {
      return res.status(404).json({ message: 'Lokasi KNMP tidak ditemukan.' });
    }

    // B. Ambil skor KPI terbaru
    const kpiDefinitions = await prisma.kpiDefinition.findMany();
    const latestKpis = [];

    for (const definition of kpiDefinitions) {
      const score = await prisma.kpiScore.findFirst({
        where: {
          knmpId: id,
          kpiDefinitionId: definition.id
        },
        orderBy: { date: 'desc' }
      });

      latestKpis.push({
        key: definition.key,
        name: definition.name,
        score: score ? score.score : 0,
        date: score ? score.date : null
      });
    }

    // C. Generate rekomendasi kebijakan otomatis
    const recommendationEngine = await generateKnmpRecommendations(id);

    return res.json({
      knmp,
      kpiScores: latestKpis,
      recommendations: recommendationEngine.recommendations,
      warnings: recommendationEngine.warnings
    });
  } catch (error) {
    return res.status(500).json({ message: 'Terjadi kesalahan saat mengambil detail KNMP.', error: error.message });
  }
};

// 3. Ambil data sebaran koordinat untuk GIS Map (filtered by scope)
const getMapLocations = async (req, res) => {
  try {
    const knmpFilter = await buildKnmpFilter(req.user);

    const locations = await prisma.knmp.findMany({
      where: knmpFilter,
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
        status: true,
        region: {
          select: { name: true }
        },
        healthIndices: {
          orderBy: { date: 'desc' },
          take: 1,
          select: {
            healthIndex: true,
            status: true
          }
        }
      }
    });

    const geoData = locations.map(loc => {
      const health = loc.healthIndices[0];
      return {
        id: loc.id,
        name: loc.name,
        latitude: loc.latitude,
        longitude: loc.longitude,
        status: loc.status,
        region: loc.region.name,
        healthIndex: health ? health.healthIndex : 0,
        healthStatus: health ? health.status : 'BAIK'
      };
    });

    return res.json(geoData);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil data peta lokasi.', error: error.message });
  }
};

// 4. Kalkulasi ulang seluruh indeks dan ranking (Trigger manual)
const recalculateEngineData = async (req, res) => {
  try {
    console.log('Memulai kalkulasi ulang Decision Engine...');
    
    // A. Hitung Health Index untuk semua KNMP
    const healthResults = await calculateAllHealthIndices();
    
    // B. Jalankan TOPSIS ranking baru
    const topsisResults = await runTopsisCalculation();

    return res.json({
      message: 'Kalkulasi ulang Decision Engine berhasil diselesaikan.',
      healthResultsCount: healthResults.length,
      topsisResults
    });
  } catch (error) {
    return res.status(500).json({ message: 'Kalkulasi Decision Engine gagal.', error: error.message });
  }
};

module.exports = {
  getNationalSummary,
  getKnmpDetails,
  getMapLocations,
  recalculateEngineData
};
