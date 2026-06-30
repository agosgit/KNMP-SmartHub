require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting DB Seed...');

  // 1. Clear existing data
  await prisma.topsisRanking.deleteMany({});
  await prisma.healthIndex.deleteMany({});
  await prisma.kpiScore.deleteMany({});
  await prisma.kpiDefinition.deleteMany({});
  await prisma.cooperative.deleteMany({});
  await prisma.fishDistribution.deleteMany({});
  await prisma.fishProduction.deleteMany({});
  await prisma.facility.deleteMany({});
  await prisma.monitoringReport.deleteMany({});
  await prisma.knmp.deleteMany({});
  await prisma.region.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Cleaned up existing database tables.');

  // 2. Create Users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@smarthub.go.id',
      name: 'Administrator Pusat',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const kkpUser = await prisma.user.create({
    data: {
      email: 'kkp@smarthub.go.id',
      name: 'Direktorat Jenderal Perikanan KKP',
      password: hashedPassword,
      role: 'KKP',
    },
  });

  const pemdaUser = await prisma.user.create({
    data: {
      email: 'pemda@smarthub.go.id',
      name: 'Dinas Perikanan Provinsi',
      password: hashedPassword,
      role: 'PEMDA',
    },
  });

  const tpiUser = await prisma.user.create({
    data: {
      email: 'tpi@smarthub.go.id',
      name: 'Petugas TPI',
      password: hashedPassword,
      role: 'TPI',
    },
  });

  const koperasiUser = await prisma.user.create({
    data: {
      email: 'koperasi@smarthub.go.id',
      name: 'Koperasi Nelayan',
      password: hashedPassword,
      role: 'KOPERASI',
    },
  });

  const penyuluhUser = await prisma.user.create({
    data: {
      email: 'penyuluh@smarthub.go.id',
      name: 'Penyuluh Lapangan',
      password: hashedPassword,
      role: 'PENYULUH',
    },
  });

  console.log('Created Users.');

  // 3. Create Regions (Hierarchy)
  const dki = await prisma.region.create({
    data: { name: 'DKI Jakarta', type: 'PROVINSI' },
  });
  const jatim = await prisma.region.create({
    data: { name: 'Jawa Timur', type: 'PROVINSI' },
  });
  const sumut = await prisma.region.create({
    data: { name: 'Sumatera Utara', type: 'PROVINSI' },
  });
  const sulut = await prisma.region.create({
    data: { name: 'Sulawesi Utara', type: 'PROVINSI' },
  });
  const jabar = await prisma.region.create({
    data: { name: 'Jawa Barat', type: 'PROVINSI' },
  });
  const malut = await prisma.region.create({
    data: { name: 'Maluku Utara', type: 'PROVINSI' },
  });

  // Kabupaten / Kota
  const jakut = await prisma.region.create({
    data: { name: 'Jakarta Utara', type: 'KABUPATEN', parentId: dki.id },
  });
  const lamongan = await prisma.region.create({
    data: { name: 'Lamongan', type: 'KABUPATEN', parentId: jatim.id },
  });
  const medan = await prisma.region.create({
    data: { name: 'Medan', type: 'KABUPATEN', parentId: sumut.id },
  });
  const bitungKota = await prisma.region.create({
    data: { name: 'Bitung', type: 'KABUPATEN', parentId: sulut.id },
  });
  const sukabumi = await prisma.region.create({
    data: { name: 'Sukabumi', type: 'KABUPATEN', parentId: jabar.id },
  });
  const ternateKota = await prisma.region.create({
    data: { name: 'Ternate', type: 'KABUPATEN', parentId: malut.id },
  });

  console.log('Created Regions.');

  // 4. Create KNMPs (6 sample locations from proposal example)
  const knmps = [
    { name: 'KNMP Muara Baru', address: 'Pelabuhan Perikanan Samudera Nizam Zachman, Jakarta', latitude: -6.1042, longitude: 106.8028, regionId: jakut.id, status: 'NORMAL' },
    { name: 'KNMP Brondong', address: 'Pelabuhan Perikanan Nusantara Brondong, Lamongan', latitude: -6.8972, longitude: 112.2803, regionId: lamongan.id, status: 'WARNING' },
    { name: 'KNMP Belawan', address: 'Pelabuhan Perikanan Samudera Belawan, Medan', latitude: 3.7842, longitude: 98.6922, regionId: medan.id, status: 'NORMAL' },
    { name: 'KNMP Bitung', address: 'Pelabuhan Perikanan Samudera Bitung, Bitung', latitude: 1.4428, longitude: 125.1878, regionId: bitungKota.id, status: 'NORMAL' },
    { name: 'KNMP Palabuhanratu', address: 'Pelabuhan Perikanan Nusantara Palabuhanratu, Sukabumi', latitude: -6.9856, longitude: 106.5492, regionId: sukabumi.id, status: 'CRITICAL' },
    { name: 'KNMP Ternate', address: 'Pelabuhan Perikanan Nusantara Bastiong, Ternate', latitude: 0.7761, longitude: 127.3789, regionId: ternateKota.id, status: 'WARNING' },
  ];

  const knmpInstances = [];
  for (const knmpData of knmps) {
    const knmp = await prisma.knmp.create({
      data: knmpData,
    });
    knmpInstances.push(knmp);
  }

  console.log('Created KNMP Locations.');

  // 5. Create Facilities for each KNMP
  for (const knmp of knmpInstances) {
    await prisma.facility.createMany({
      data: [
        { name: 'Cold Storage Utama', type: 'COLD_STORAGE', capacity: 200.0, status: 'ACTIVE', knmpId: knmp.id },
        { name: 'Tempat Pelelangan Ikan (TPI)', type: 'TPI', capacity: 50.0, status: 'ACTIVE', knmpId: knmp.id },
        { name: 'Pabrik Es Balok', type: 'PABRIK_ES', capacity: 30.0, status: 'ACTIVE', knmpId: knmp.id },
        { name: 'Dermaga Tambat Labuh', type: 'DERMAGA', capacity: 40.0, status: 'ACTIVE', knmpId: knmp.id },
        { name: 'SPBN Nelayan', type: 'SPBN', capacity: 15.0, status: 'ACTIVE', knmpId: knmp.id },
      ],
    });
  }

  console.log('Created Facilities.');

  // 6. Create KPI Definitions with calculated weights
  const kpis = [
    { name: 'Produksi Perikanan', key: 'PRODUCTION', weight: 0.351, description: 'Mengukur pencapaian volume hasil tangkapan nelayan terhadap target' },
    { name: 'Efektivitas Distribusi', key: 'DISTRIBUTION', weight: 0.232, description: 'Mengukur kelancaran rantai distribusi hasil perikanan ke pasar' },
    { name: 'Utilisasi Cold Storage', key: 'COLD_STORAGE', weight: 0.138, description: 'Mengukur tingkat pemanfaatan ruang penyimpanan beku' },
    { name: 'Pemanfaatan Infrastruktur', key: 'INFRASTRUCTURE', weight: 0.138, description: 'Mengukur keaktifan seluruh fasilitas penunjang di lokasi KNMP' },
    { name: 'Aktivitas Koperasi', key: 'COOPERATIVE', weight: 0.087, description: 'Mengukur keaktifan transaksi dan keanggotaan koperasi nelayan' },
    { name: 'Kualitas Pelaporan', key: 'REPORTING', weight: 0.052, description: 'Mengukur ketepatan waktu dan kelengkapan data administrasi' },
  ];

  const kpiDefinitions = [];
  for (const kpi of kpis) {
    const def = await prisma.kpiDefinition.create({
      data: kpi,
    });
    kpiDefinitions.push(def);
  }

  console.log('Created KPI Definitions.');

  // 7. Input Historical/Mock Scores to match our proposal calculations
  // Muara Baru (K-01): Prod=82, Dist=75, CS=88, Infra=70, Kop=65, Rep=90 -> Health=78.32
  // Brondong (K-02): Prod=55, Dist=60, CS=45, Infra=50, Kop=40, Rep=70 -> Health=53.46
  // Belawan (K-03): Prod=70, Dist=65, CS=72, Infra=68, Kop=72, Rep=80 -> Health=69.39
  // Bitung (K-04): Prod=90, Dist=85, CS=78, Infra=88, Kop=80, Rep=95 -> Health=86.12
  // Palabuhanratu (K-05): Prod=48, Dist=38, CS=35, Infra=42, Kop=30, Rep=55 -> Health=41.76
  // Ternate (K-06): Prod=62, Dist=55, CS=60, Infra=58, Kop=55, Rep=65 -> Health=58.97

  const mockScores = {
    'KNMP Muara Baru': { scores: [82, 75, 88, 70, 65, 90], health: 78.32, status: 'BAIK', cc: 0.786, rank: 5, urgent: 'RENDAH', dPlus: 0.0286, dMinus: 0.1051 },
    'KNMP Brondong': { scores: [55, 60, 45, 50, 40, 70], health: 53.46, status: 'PERLU_PERHATIAN', cc: 0.309, rank: 2, urgent: 'URGENT', dPlus: 0.0943, dMinus: 0.0422 },
    'KNMP Belawan': { scores: [70, 65, 72, 68, 72, 80], health: 69.39, status: 'MODERAT', cc: 0.609, rank: 4, urgent: 'SEDANG', dPlus: 0.0460, dMinus: 0.0716 },
    'KNMP Bitung': { scores: [90, 85, 78, 88, 80, 95], health: 86.12, status: 'SANGAT_BAIK', cc: 1.000, rank: 6, urgent: 'SANGAT_RENDAH', dPlus: 0.0000, dMinus: 0.1314 },
    'KNMP Palabuhanratu': { scores: [48, 38, 35, 42, 30, 55], health: 41.76, status: 'KRITIS', cc: 0.000, rank: 1, urgent: 'SANGAT_URGENT', dPlus: 0.1302, dMinus: 0.0000 },
    'KNMP Ternate': { scores: [62, 55, 60, 58, 55, 65], health: 58.97, status: 'PERLU_PERHATIAN', cc: 0.421, rank: 3, urgent: 'TINGGI', dPlus: 0.0710, dMinus: 0.0517 },
  };

  const today = new Date();

  for (const knmp of knmpInstances) {
    const kData = mockScores[knmp.name];
    if (kData) {
      // Create individual KPI scores
      for (let i = 0; i < kData.scores.length; i++) {
        await prisma.kpiScore.create({
          data: {
            knmpId: knmp.id,
            kpiDefinitionId: kpiDefinitions[i].id,
            score: kData.scores[i],
            date: today,
          },
        });
      }

      // Create Health Index record
      await prisma.healthIndex.create({
        data: {
          knmpId: knmp.id,
          healthIndex: kData.health,
          status: kData.status,
          date: today,
        },
      });

      // Create Topsis Ranking record
      await prisma.topsisRanking.create({
        data: {
          knmpId: knmp.id,
          ccScore: kData.cc,
          ranking: kData.rank,
          status: kData.urgent,
          dPlus: kData.dPlus,
          dMinus: kData.dMinus,
          date: today,
        },
      });

      // Create raw operational data for simulation
      await prisma.fishProduction.create({
        data: {
          knmpId: knmp.id,
          fishType: 'Tuna/Cakalang',
          volumeKg: kData.scores[0] * 250, // mock volume
          reporterId: tpiUser.id,
          date: today,
        },
      });

      await prisma.fishDistribution.create({
        data: {
          knmpId: knmp.id,
          destination: 'Pasar Domestik & Ekspor',
          volumeKg: kData.scores[1] * 200,
          reporterId: koperasiUser.id,
          date: today,
        },
      });

      await prisma.cooperative.create({
        data: {
          knmpId: knmp.id,
          name: 'Koperasi Mina Sejahtera',
          activeMembers: Math.floor(kData.scores[4] * 2.5),
          transactions: Math.floor(kData.scores[4] * 1.8),
          transactionValue: kData.scores[4] * 1250000,
          date: today,
        },
      });
    }
  }

  // Create mock monitoring reports for warning/critical locations
  const palabuhanratu = knmpInstances.find(k => k.name === 'KNMP Palabuhanratu');
  if (palabuhanratu) {
    await prisma.monitoringReport.create({
      data: {
        knmpId: palabuhanratu.id,
        title: 'Kerusakan Mesin Cold Storage Utama',
        notes: 'Suhu cold storage utama melonjak naik karena kerusakan kompresor, menyebabkan penimbunan ikan hasil tangkapan di luar ruangan.',
        status: 'CRITICAL',
        reporterId: penyuluhUser.id,
        date: today,
      },
    });
  }

  const brondong = knmpInstances.find(k => k.name === 'KNMP Brondong');
  if (brondong) {
    await prisma.monitoringReport.create({
      data: {
        knmpId: brondong.id,
        title: 'Penurunan Aktivitas Transaksi Koperasi',
        notes: 'Banyak nelayan beralih menjual hasil tangkapan ke tengkulak luar karena keterbatasan likuiditas dana talangan di koperasi.',
        status: 'WARNING',
        reporterId: penyuluhUser.id,
        date: today,
      },
    });
  }

  console.log('Created Mock Operational Data, KPI Scores, Health Indices, TOPSIS rankings, and Reports.');
  console.log('Seed Completed Successfully! 🌟');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
