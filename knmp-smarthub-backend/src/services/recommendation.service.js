const prisma = require('../lib/db');

// Map rekomendasi berdasarkan key KPI
const KPI_RECOMMENDATIONS = {
  PRODUCTION: {
    title: 'Produksi Hasil Tangkapan Rendah',
    warningText: 'Volume produksi perikanan berada di bawah target operasional.',
    suggestion: 'Lakukan evaluasi daerah penangkapan ikan (catch area), pendampingan teknis metode penangkapan bagi nelayan, dan cek ketersediaan bahan bakar (BBM) solar di SPBN.'
  },
  DISTRIBUTION: {
    title: 'Hambatan Rantai Distribusi',
    warningText: 'Tingkat efisiensi distribusi hasil tangkapan nelayan tidak optimal.',
    suggestion: 'Lakukan perluasan akses pasar, fasilitasi kerja sama dengan mitra industri logistik perikanan, serta optimalkan armada pengangkutan berpendingin.'
  },
  COLD_STORAGE: {
    title: 'Kinerja Cold Storage Lemah',
    warningText: 'Utilisasi cold storage tidak efisien atau mengalami kendala kapasitas.',
    suggestion: 'Audit operasional fasilitas cold storage, jadwalkan pemeliharaan kompresor pendingin secara berkala, dan evaluasi tarif penyimpanan bagi nelayan.'
  },
  INFRASTRUCTURE: {
    title: 'Underutilized Asset / Kerusakan Infrastruktur',
    warningText: 'Pemanfaatan fasilitas fisik pelabuhan/dermaga di bawah standar minimal.',
    suggestion: 'Jadwalkan audit fisik kelayakan dermaga & TPI, lakukan pembinaan intensif terhadap pengelola fasilitas, dan perbaiki fasilitas yang rusak.'
  },
  COOPERATIVE: {
    title: 'Aktivitas Koperasi Nelayan Pasif',
    warningText: 'Volume transaksi dan partisipasi anggota koperasi mengalami penurunan.',
    suggestion: 'Berikan bantuan permodalan bergulir (dana talangan), tingkatkan kapasitas manajemen pengurus koperasi, dan aktivasikan unit usaha simpan-pinjam nelayan.'
  },
  REPORTING: {
    title: 'Keterlambatan Pelaporan Data',
    warningText: 'Kualitas pelaporan bulanan tidak lengkap atau sering terlambat.',
    suggestion: 'Kirimkan reminder otomatis pengisian data, lakukan pelatihan administrasi digital bagi penyuluh/pengelola, dan sederhanakan proses input data.'
  }
};

/**
 * Mendapatkan rekomendasi kebijakan secara otomatis untuk lokasi tertentu berdasarkan skor KPI-nya
 * @param {number} knmpId 
 * @returns {Promise<object>} Detail rekomendasi dan warning list
 */
const generateKnmpRecommendations = async (knmpId) => {
  // 1. Ambil info KNMP
  const knmp = await prisma.knmp.findUnique({
    where: { id: knmpId },
    include: {
      healthIndices: {
        orderBy: { date: 'desc' },
        take: 1
      }
    }
  });

  if (!knmp) {
    throw new Error('Lokasi KNMP tidak ditemukan.');
  }

  // 2. Ambil skor KPI terbaru
  const kpis = await prisma.kpiDefinition.findMany();
  const recommendationsList = [];
  const warningList = [];
  let isCritical = false;

  for (const kpi of kpis) {
    const latestScore = await prisma.kpiScore.findFirst({
      where: {
        knmpId,
        kpiDefinitionId: kpi.id
      },
      orderBy: { date: 'desc' }
    });

    const scoreValue = latestScore ? latestScore.score : 0;
    
    // Threshold warning: skor di bawah 60
    if (scoreValue < 60) {
      const rec = KPI_RECOMMENDATIONS[kpi.key];
      if (rec) {
        warningList.push({
          kpiKey: kpi.key,
          kpiName: kpi.name,
          score: scoreValue,
          title: rec.title,
          description: rec.warningText,
          severity: scoreValue < 40 ? 'CRITICAL' : 'WARNING'
        });

        recommendationsList.push({
          kpiKey: kpi.key,
          kpiName: kpi.name,
          score: scoreValue,
          action: rec.suggestion
        });

        if (scoreValue < 40) {
          isCritical = true;
        }
      }
    }
  }

  const latestHealth = knmp.healthIndices[0];
  const healthIndexValue = latestHealth ? latestHealth.healthIndex : 0;

  return {
    knmpId,
    knmpName: knmp.name,
    healthIndex: healthIndexValue,
    overallStatus: latestHealth ? latestHealth.status : 'BAIK',
    isUrgent: healthIndexValue < 60,
    warnings: warningList,
    recommendations: recommendationsList
  };
};

/**
 * Mendapatkan semua Early Warning aktif (WARNING & CRITICAL) di seluruh lokasi KNMP
 * @returns {Promise<Array>} List lokasi beserta indikator warningnya
 */
const getActiveEarlyWarnings = async () => {
  const knmps = await prisma.knmp.findMany({
    include: {
      healthIndices: {
        orderBy: { date: 'desc' },
        take: 1
      },
      monitoringReports: {
        where: {
          status: { in: ['WARNING', 'CRITICAL'] }
        },
        orderBy: { date: 'desc' },
        take: 5
      }
    }
  });

  const activeWarnings = [];

  for (const knmp of knmps) {
    const health = knmp.healthIndices[0];
    const healthValue = health ? health.healthIndex : 100;
    
    const kpiWarnings = [];
    const kpis = await prisma.kpiDefinition.findMany();

    // Check individual KPIs
    for (const kpi of kpis) {
      const latestScore = await prisma.kpiScore.findFirst({
        where: { knmpId: knmp.id, kpiDefinitionId: kpi.id },
        orderBy: { date: 'desc' }
      });
      const score = latestScore ? latestScore.score : 100;
      if (score < 60) {
        kpiWarnings.push({
          kpiKey: kpi.key,
          kpiName: kpi.name,
          score
        });
      }
    }

    // Jika Health Index < 60 atau ada KPI < 60 atau ada laporan manual WARNING/CRITICAL
    if (healthValue < 60 || kpiWarnings.length > 0 || knmp.monitoringReports.length > 0) {
      activeWarnings.push({
        knmpId: knmp.id,
        knmpName: knmp.name,
        healthIndex: healthValue,
        status: health ? health.status : 'NORMAL',
        kpiWarnings,
        manualReports: knmp.monitoringReports.map(r => ({
          id: r.id,
          title: r.title,
          notes: r.notes,
          status: r.status,
          date: r.date
        }))
      });
    }
  }

  return activeWarnings;
};

module.exports = {
  generateKnmpRecommendations,
  getActiveEarlyWarnings
};
