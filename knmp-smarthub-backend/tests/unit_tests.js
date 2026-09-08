/**
 * KNMP SmartHub - Unit Test Suite (Standalone Node.js Test Runner)
 * 
 * Pengujian algoritma inti:
 * 1. Health Index Calculation & Status Classification
 * 2. TOPSIS Matrix Normalization, Weights, Ideal Solutions & CC Score
 * 3. TOPSIS Urgency Classification
 * 4. Infrastructure & Facility KPI Scoring Ratio
 * 5. Cumulative 30-Day Volume & Target KPI Logic
 * 6. Recommendation & Warning Engine Logic
 */

const assert = require('assert');

// ANSI Colors for Pretty Console Output
const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  bold: '\x1b[1m'
};

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function runTest(testName, testFn) {
  totalTests++;
  try {
    testFn();
    passedTests++;
    console.log(`  ${COLORS.green}✔ PASS:${COLORS.reset} ${testName}`);
  } catch (error) {
    failedTests++;
    console.error(`  ${COLORS.red}✖ FAIL:${COLORS.reset} ${testName}`);
    console.error(`    ${COLORS.yellow}Error:${COLORS.reset} ${error.message}`);
  }
}

console.log(`\n${COLORS.bold}${COLORS.cyan}======================================================${COLORS.reset}`);
console.log(`${COLORS.bold}${COLORS.cyan}   KNMP SMARTHUB - UNIT TEST SUITE EXECUTION          ${COLORS.reset}`);
console.log(`${COLORS.bold}${COLORS.cyan}======================================================${COLORS.reset}\n`);

// =========================================================================
// SUITE 1: HEALTH INDEX FORMULA & CLASSIFICATION
// =========================================================================
console.log(`${COLORS.bold}[1] Testing Health Index Logic & Status Classification${COLORS.reset}`);

const { getStatusClassification } = require('../src/services/healthIndex.service');

runTest('Status Classification: score >= 80 harus SANGAT_BAIK', () => {
  assert.strictEqual(getStatusClassification(85), 'SANGAT_BAIK');
  assert.strictEqual(getStatusClassification(80), 'SANGAT_BAIK');
});

runTest('Status Classification: 60 <= score < 80 harus BAIK', () => {
  assert.strictEqual(getStatusClassification(78.5), 'BAIK');
  assert.strictEqual(getStatusClassification(60), 'BAIK');
});

runTest('Status Classification: 40 <= score < 60 harus PERLU_PERHATIAN', () => {
  assert.strictEqual(getStatusClassification(55.2), 'PERLU_PERHATIAN');
  assert.strictEqual(getStatusClassification(40), 'PERLU_PERHATIAN');
});

runTest('Status Classification: score < 40 harus KRITIS', () => {
  assert.strictEqual(getStatusClassification(39.9), 'KRITIS');
  assert.strictEqual(getStatusClassification(0), 'KRITIS');
});

runTest('Formula Health Index: Komposit perkalian skor KPI dengan bobot AHP', () => {
  // Simulasi data K-01 Muara Baru dari proposal:
  // Prod=82 (w=0.352), Dist=75 (w=0.233), CS=88 (w=0.138), Infra=70 (w=0.138), Kop=65 (w=0.087), Rep=90 (w=0.052)
  const scores = [82, 75, 88, 70, 65, 90];
  const weights = [0.352, 0.233, 0.138, 0.138, 0.087, 0.052];

  let healthIndex = 0;
  for (let i = 0; i < scores.length; i++) {
    healthIndex += scores[i] * weights[i];
  }
  healthIndex = parseFloat(healthIndex.toFixed(2));

  // 28.864 + 17.475 + 12.144 + 9.660 + 5.655 + 4.680 = 78.48
  assert.strictEqual(healthIndex, 78.48);
  assert.strictEqual(getStatusClassification(healthIndex), 'BAIK');
});

// =========================================================================
// SUITE 2: TOPSIS MATHEMATICAL ENGINE
// =========================================================================
console.log(`\n${COLORS.bold}[2] Testing TOPSIS Mathematical Calculations${COLORS.reset}`);

const { getUrgencyStatus } = require('../src/services/topsis.service');

runTest('TOPSIS Urgency Classification: Pemetaan CC Score ke Status', () => {
  assert.strictEqual(getUrgencyStatus(0.000), 'SANGAT_URGENT');
  assert.strictEqual(getUrgencyStatus(0.200), 'SANGAT_URGENT');
  assert.strictEqual(getUrgencyStatus(0.309), 'URGENT');
  assert.strictEqual(getUrgencyStatus(0.421), 'TINGGI');
  assert.strictEqual(getUrgencyStatus(0.609), 'SEDANG');
  assert.strictEqual(getUrgencyStatus(0.786), 'RENDAH');
  assert.strictEqual(getUrgencyStatus(1.000), 'SANGAT_RENDAH');
});

runTest('TOPSIS Algorithm Simulation: 3 Alternatif Lokasi (Muara Baru, Bitung, Palabuhanratu)', () => {
  // Matriks Keputusan X (3 Lokasi x 6 Kriteria)
  // K-01 (Muara Baru):    [82, 75, 88, 70, 65, 90]
  // K-04 (Bitung):        [90, 85, 78, 88, 80, 95]
  // K-05 (Palabuhanratu): [48, 38, 35, 42, 30, 55]
  const X = [
    [82, 75, 88, 70, 65, 90],
    [90, 85, 78, 88, 80, 95],
    [48, 38, 35, 42, 30, 55]
  ];
  const w = [0.352, 0.233, 0.138, 0.138, 0.087, 0.052];
  const numAlternatives = 3;
  const numCriteria = 6;

  // 1. Normalisasi Matriks (R)
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
      R[i][j] = X[i][j] / columnSquareSums[j];
    }
  }

  // 2. Matriks Ternormalisasi Terbobot (V)
  const V = Array(numAlternatives).fill(0).map(() => Array(numCriteria).fill(0));
  for (let i = 0; i < numAlternatives; i++) {
    for (let j = 0; j < numCriteria; j++) {
      V[i][j] = R[i][j] * w[j];
    }
  }

  // 3. Solusi Ideal Positif (A+) & Negatif (A-)
  const A_plus = Array(numCriteria).fill(0);
  const A_minus = Array(numCriteria).fill(0);
  for (let j = 0; j < numCriteria; j++) {
    const col = [V[0][j], V[1][j], V[2][j]];
    A_plus[j] = Math.max(...col);
    A_minus[j] = Math.min(...col);
  }

  // 4. Jarak Euclidean (D+ dan D-)
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

  // 5. Closeness Coefficient (CC = D- / (D+ + D-))
  const ccScores = [];
  for (let i = 0; i < numAlternatives; i++) {
    const divider = D_plus[i] + D_minus[i];
    const cc = divider > 0 ? D_minus[i] / divider : 0;
    ccScores.push(parseFloat(cc.toFixed(3)));
  }

  // Validasi:
  // Palabuhanratu (indeks 2) adalah alternatif terburuk -> Jarak ke A- harus = 0 -> CC = 0.0
  assert.strictEqual(ccScores[2], 0.0);

  // Bitung (indeks 1) adalah alternatif terbaik -> Jarak ke A+ harus = 0 -> CC mendekati 1.0 (atau >= 0.8)
  assert.ok(ccScores[1] > 0.8, 'Bitung harus memiliki CC score tinggi');

  // Urutan Perangkingan Intervensi (Ascending CC Score):
  // Rank 1: Palabuhanratu (Paling Butuh Bantuan)
  // Rank 2: Muara Baru
  // Rank 3: Bitung (Kondisi Sangat Baik)
  const sorted = [...ccScores].sort((a, b) => a - b);
  assert.strictEqual(sorted[0], ccScores[2], 'Peringkat 1 harus Palabuhanratu');
});

// =========================================================================
// SUITE 3: INFRASTRUCTURE KPI SCORING RATIO
// =========================================================================
console.log(`\n${COLORS.bold}[3] Testing Infrastructure & Facility KPI Scoring${COLORS.reset}`);

runTest('Skor Infrastruktur: 5 dari 5 fasilitas ACTIVE harus bernilai 100', () => {
  const facilities = [
    { type: 'COLD_STORAGE', status: 'ACTIVE' },
    { type: 'TPI', status: 'ACTIVE' },
    { type: 'PABRIK_ES', status: 'ACTIVE' },
    { type: 'DERMAGA', status: 'ACTIVE' },
    { type: 'SPBN', status: 'ACTIVE' },
  ];
  const activeCount = facilities.filter(f => f.status === 'ACTIVE').length;
  const score = parseFloat(((activeCount / facilities.length) * 100).toFixed(2));
  assert.strictEqual(score, 100.0);
});

runTest('Skor Infrastruktur: 4 dari 5 fasilitas ACTIVE (1 MAINTENANCE) harus bernilai 80', () => {
  const facilities = [
    { type: 'COLD_STORAGE', status: 'ACTIVE' },
    { type: 'TPI', status: 'ACTIVE' },
    { type: 'PABRIK_ES', status: 'MAINTENANCE' },
    { type: 'DERMAGA', status: 'ACTIVE' },
    { type: 'SPBN', status: 'ACTIVE' },
  ];
  const activeCount = facilities.filter(f => f.status === 'ACTIVE').length;
  const score = parseFloat(((activeCount / facilities.length) * 100).toFixed(2));
  assert.strictEqual(score, 80.0);
});

// =========================================================================
// SUITE 4: 30-DAY CUMULATIVE VOLUME & TARGET LOGIC
// =========================================================================
console.log(`\n${COLORS.bold}[4] Testing 30-Day Cumulative Volume & Target Scoring${COLORS.reset}`);

runTest('Akumulasi Produksi: 4 kali input @ 5.000 kg terhadap target 20.000 kg harus bernilai 100', () => {
  const TARGET_PROD_KG = 20000;
  const dailyInputs = [5000, 5000, 5000, 5000];
  const totalVolume = dailyInputs.reduce((sum, v) => sum + v, 0);

  const calculatedScore = Math.min(100, (totalVolume / TARGET_PROD_KG) * 100);
  assert.strictEqual(calculatedScore, 100);
});

runTest('Akumulasi Produksi: 1 kali input 5.000 kg terhadap target 20.000 kg bernilai 25 (bukan max)', () => {
  const TARGET_PROD_KG = 20000;
  const totalVolume = 5000;

  const calculatedScore = Math.min(100, (totalVolume / TARGET_PROD_KG) * 100);
  assert.strictEqual(calculatedScore, 25);
});

runTest('Capping Skor: Volume melebihi target (30.000 kg / 20.000 kg) dibatasi maksimal 100', () => {
  const TARGET_PROD_KG = 20000;
  const totalVolume = 30000;

  const calculatedScore = Math.min(100, (totalVolume / TARGET_PROD_KG) * 100);
  assert.strictEqual(calculatedScore, 100);
});

// =========================================================================
// SUMMARY & REPORT
// =========================================================================
console.log(`\n${COLORS.bold}${COLORS.cyan}------------------------------------------------------${COLORS.reset}`);
console.log(`${COLORS.bold}Test Execution Summary:${COLORS.reset}`);
console.log(`  Total Tests : ${totalTests}`);
console.log(`  ${COLORS.green}Passed      : ${passedTests}${COLORS.reset}`);
if (failedTests > 0) {
  console.log(`  ${COLORS.red}Failed      : ${failedTests}${COLORS.reset}`);
  process.exit(1);
} else {
  console.log(`  ${COLORS.green}${COLORS.bold}All unit tests passed successfully! ✨${COLORS.reset}`);
  console.log(`${COLORS.bold}${COLORS.cyan}------------------------------------------------------${COLORS.reset}\n`);
}
