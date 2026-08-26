const prisma = require('../lib/db');

/**
 * Mendapatkan status urgensi intervensi berdasarkan CC Score TOPSIS
 * @param {number} ccScore 
 * @returns {string} Status Urgensi
 */
const getUrgencyStatus = (ccScore) => {
  if (ccScore <= 0.2) return 'SANGAT_URGENT';
  if (ccScore <= 0.4) return 'URGENT';
  if (ccScore <= 0.55) return 'TINGGI';
  if (ccScore <= 0.7) return 'SEDANG';
  if (ccScore <= 0.85) return 'RENDAH';
  return 'SANGAT_RENDAH';
};

/**
 * Menjalankan algoritma TOPSIS untuk seluruh lokasi KNMP berdasarkan data KPI terupdate
 * @param {Date} [date] Tanggal perhitungan (default: saat ini)
 * @returns {Promise<Array>} List peringkat hasil TOPSIS
 */
const runTopsisCalculation = async (date = new Date()) => {
  // 1. Ambil kriteria KPI & bobotnya dari database
  const kpis = await prisma.kpiDefinition.findMany({
    orderBy: { key: 'asc' } // Urutkan agar indeks kolom konsisten
  });

  if (kpis.length === 0) {
    throw new Error('Kriteria KPI belum dikonfigurasi di database.');
  }

  // Bobot kriteria w
  const w = kpis.map(k => k.weight);

  // 2. Ambil semua lokasi KNMP
  const knmps = await prisma.knmp.findMany();
  if (knmps.length === 0) {
    return [];
  }

  // 3. Bangun Matriks Keputusan X (baris = KNMP, kolom = KPI)
  const X = []; // Menyimpan nilai skor mentah
  const validKnmps = [];

  for (const knmp of knmps) {
    const row = [];
    let hasAllScores = true;

    for (const kpi of kpis) {
      // Ambil skor KPI terbaru
      const latestScore = await prisma.kpiScore.findFirst({
        where: {
          knmpId: knmp.id,
          kpiDefinitionId: kpi.id
        },
        orderBy: { date: 'desc' }
      });

      // Jika belum ada skor, beri default 0
      const score = latestScore ? latestScore.score : 0;
      row.push(score);
    }

    X.push(row);
    validKnmps.push(knmp);
  }

  const numAlternatives = X.length; // Jumlah KNMP
  const numCriteria = kpis.length;   // Jumlah KPI (6)

  if (numAlternatives === 0) return [];

  // 4. Normalisasi Matriks (r_ij)
  // Hitung pembagi: akar dari jumlah kuadrat setiap kolom (kolom = kriteria)
  const columnSquareSums = Array(numCriteria).fill(0);
  for (let j = 0; j < numCriteria; j++) {
    let sum = 0;
    for (let i = 0; i < numAlternatives; i++) {
      sum += X[i][j] * X[i][j];
    }
    columnSquareSums[j] = Math.sqrt(sum);
  }

  const R = Array(numAlternatives).fill(0).map(() => Array(numCriteria).fill(0));
  for (let i = 0; i < numAlternatives; i++) {
    for (let j = 0; j < numCriteria; j++) {
      // Cegah pembagian dengan nol jika semua alternatif bernilai nol
      R[i][j] = columnSquareSums[j] > 0 ? X[i][j] / columnSquareSums[j] : 0;
    }
  }

  // 5. Matriks Ternormalisasi Terbobot (V)
  // v_ij = r_ij * w_j
  const V = Array(numAlternatives).fill(0).map(() => Array(numCriteria).fill(0));
  for (let i = 0; i < numAlternatives; i++) {
    for (let j = 0; j < numCriteria; j++) {
      V[i][j] = R[i][j] * w[j];
    }
  }

  // 6. Solusi Ideal Positif (A+) dan Solusi Ideal Negatif (A-)
  // Karena semua kriteria bertipe BENEFIT (makin tinggi makin baik):
  // A+ adalah nilai maksimum di setiap kolom
  // A- adalah nilai minimum di setiap kolom
  const A_plus = Array(numCriteria).fill(0);
  const A_minus = Array(numCriteria).fill(0);

  for (let j = 0; j < numCriteria; j++) {
    const columnValues = [];
    for (let i = 0; i < numAlternatives; i++) {
      columnValues.push(V[i][j]);
    }
    A_plus[j] = Math.max(...columnValues);
    A_minus[j] = Math.min(...columnValues);
  }

  // 7. Jarak Euclidean ke Solusi Ideal Positif (D+) & Negatif (D-)
  const D_plus = Array(numAlternatives).fill(0);
  const D_minus = Array(numAlternatives).fill(0);

  for (let i = 0; i < numAlternatives; i++) {
    let sumPlus = 0;
    let sumMinus = 0;
    for (let j = 0; j < numCriteria; j++) {
      sumPlus += Math.pow(V[i][j] - A_plus[j], 2);
      sumMinus += Math.pow(V[i][j] - A_minus[j], 2);
    }
    D_plus[i] = Math.sqrt(sumPlus);
    D_minus[i] = Math.sqrt(sumMinus);
  }

  // 8. Hitung Closeness Coefficient (CC Score)
  // CC = D- / (D+ + D-)
  const ccScores = [];
  for (let i = 0; i < numAlternatives; i++) {
    const divider = D_plus[i] + D_minus[i];
    // Cegah pembagian nol jika D+ dan D- sama-sama nol
    const cc = divider > 0 ? D_minus[i] / divider : 0;
    ccScores.push({
      index: i,
      knmp: validKnmps[i],
      ccScore: parseFloat(cc.toFixed(4)),
      dPlus: parseFloat(D_plus[i].toFixed(4)),
      dMinus: parseFloat(D_minus[i].toFixed(4))
    });
  }

  // 9. Urutkan berdasarkan CC Score secara ASCENDING (Makin rendah CC = Makin urgent / dekat ideal terburuk)
  ccScores.sort((a, b) => a.ccScore - b.ccScore);

  // 10. Simpan hasil ranking & status urgensi ke database
  const topsisResults = [];
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  for (let rank = 1; rank <= ccScores.length; rank++) {
    const item = ccScores[rank - 1];
    const status = getUrgencyStatus(item.ccScore);

    // Cek apakah data ranking untuk KNMP ini sudah ada (ambil yang terbaru)
    const existingRanking = await prisma.topsisRanking.findFirst({
      where: {
        knmpId: item.knmp.id
      },
      orderBy: { date: 'desc' }
    });

    let savedRanking;
    if (existingRanking) {
      savedRanking = await prisma.topsisRanking.update({
        where: { id: existingRanking.id },
        data: {
          ccScore: item.ccScore,
          ranking: rank,
          status,
          dPlus: item.dPlus,
          dMinus: item.dMinus,
          date
        }
      });

      // Bersihkan jika ada duplikat ranking lama untuk KNMP yang sama
      await prisma.topsisRanking.deleteMany({
        where: {
          knmpId: item.knmp.id,
          id: { not: savedRanking.id }
        }
      });
    } else {
      savedRanking = await prisma.topsisRanking.create({
        data: {
          knmpId: item.knmp.id,
          ccScore: item.ccScore,
          ranking: rank,
          status,
          dPlus: item.dPlus,
          dMinus: item.dMinus,
          date
        }
      });
    }

    topsisResults.push({
      ranking: rank,
      knmpId: item.knmp.id,
      knmpName: item.knmp.name,
      ccScore: item.ccScore,
      status,
      dPlus: item.dPlus,
      dMinus: item.dMinus,
      recordId: savedRanking.id
    });
  }

  return topsisResults;
};

module.exports = {
  runTopsisCalculation,
  getUrgencyStatus
};
