import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import HealthIndexCard from '../components/HealthIndexCard';
import KPIChart from '../components/KPIChart';
import EarlyWarningBanner from '../components/EarlyWarningBanner';
import useAppStore from '../store/useAppStore';
import { 
  Building2, 
  Settings, 
  MapPin, 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight,
  TrendingDown,
  Gauge,
  FileDown
} from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAppStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const navigate = useNavigate();

  const isAllowedToExport = user && ['ADMIN', 'KKP', 'PEMDA'].includes(user.role);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await API.get('/dashboard/national');
        setData(response.data);
      } catch (error) {
        toast.error('Gagal mengambil data dashboard.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Gauge className="animate-spin" size={48} color="#00F2FE" />
        <span style={styles.loadingText}>Memuat Platform Analitik...</span>
      </div>
    );
  }

  // Format data KPI untuk Recharts Radar
  const radarData = data?.kpiAverages.map(item => ({
    subject: item.name,
    A: item.averageScore,
    fullMark: 100
  })) || [];

  const summary = data?.summary || { totalKnmps: 0, totalFacilities: 0, averageHealthIndex: 0, statusCounts: {} };

  return (
    <div className="main-content">
      {/* Top Navbar */}
      <Navbar title="Dashboard Nasional" />

      {/* Export PDF Button for PEMDA/KKP/ADMIN */}
      {isAllowedToExport && data && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={async () => {
              setExporting(true);
              const toastId = toast.loading('Generating laporan PDF...');
              try {
                const { default: jsPDF } = await import('jspdf');
                await import('jspdf-autotable');

                const doc = new jsPDF('p', 'mm', 'a4');
                const pageWidth = doc.internal.pageSize.getWidth();
                const now = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

                // Header
                doc.setFontSize(18);
                doc.setFont('helvetica', 'bold');
                doc.text('KNMP SmartHub - Laporan Dashboard Nasional', pageWidth / 2, 20, { align: 'center' });
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text(`Government Decision Intelligence Platform | Tanggal: ${now}`, pageWidth / 2, 28, { align: 'center' });
                doc.text(`Diekspor oleh: ${user?.name || '-'} (${user?.role || '-'})`, pageWidth / 2, 34, { align: 'center' });

                doc.setDrawColor(0, 242, 254);
                doc.setLineWidth(0.5);
                doc.line(14, 38, pageWidth - 14, 38);

                // Section 1: Ringkasan
                doc.setFontSize(13);
                doc.setFont('helvetica', 'bold');
                doc.text('1. Ringkasan Statistik Nasional', 14, 46);

                doc.autoTable({
                  startY: 50,
                  head: [['Indikator', 'Nilai']],
                  body: [
                    ['Total Lokasi KNMP', String(summary.totalKnmps)],
                    ['Total Fasilitas Aktif', String(summary.totalFacilities)],
                    ['Rata-rata Health Index', `${summary.averageHealthIndex} / 100`],
                    ['Lokasi Sangat Baik', String(summary.statusCounts?.SANGAT_BAIK || 0)],
                    ['Lokasi Baik', String(summary.statusCounts?.BAIK || 0)],
                    ['Lokasi Moderat', String(summary.statusCounts?.MODERAT || 0)],
                    ['Lokasi Perlu Perhatian', String(summary.statusCounts?.PERLU_PERHATIAN || 0)],
                    ['Lokasi Kritis', String(summary.statusCounts?.KRITIS || 0)],
                  ],
                  theme: 'grid',
                  headStyles: { fillColor: [0, 150, 200], fontSize: 10 },
                  styles: { fontSize: 9, cellPadding: 3 },
                  columnStyles: { 0: { fontStyle: 'bold' } },
                });

                // Section 2: Peringkat TOPSIS
                let currentY = doc.lastAutoTable.finalY + 10;
                doc.setFontSize(13);
                doc.setFont('helvetica', 'bold');
                doc.text('2. Peringkat Prioritas Intervensi (TOPSIS)', 14, currentY);

                const rankingRows = (data?.rankings || []).map(r => [
                  String(r.ranking),
                  r.knmp?.name || '-',
                  String(r.dPlus || 0),
                  String(r.dMinus || 0),
                  String(r.ccScore),
                  r.status?.replace('_', ' ') || '-'
                ]);

                doc.autoTable({
                  startY: currentY + 4,
                  head: [['Ranking', 'Lokasi KNMP', 'D+', 'D-', 'CC Score', 'Status Urgensi']],
                  body: rankingRows,
                  theme: 'grid',
                  headStyles: { fillColor: [0, 150, 200], fontSize: 9 },
                  styles: { fontSize: 8, cellPadding: 3 },
                  columnStyles: { 0: { halign: 'center', cellWidth: 18 } },
                });

                // Section 3: Early Warning
                if (data?.activeWarnings?.length > 0) {
                  currentY = doc.lastAutoTable.finalY + 10;
                  doc.setFontSize(13);
                  doc.setFont('helvetica', 'bold');
                  doc.text('3. Peringatan Dini Aktif', 14, currentY);

                  const warningRows = data.activeWarnings.map(w => [
                    w.knmpName || '-',
                    w.message || w.indicator || '-',
                    w.severity || 'WARNING'
                  ]);

                  doc.autoTable({
                    startY: currentY + 4,
                    head: [['Lokasi', 'Peringatan', 'Keparahan']],
                    body: warningRows,
                    theme: 'grid',
                    headStyles: { fillColor: [220, 50, 50], fontSize: 9 },
                    styles: { fontSize: 8, cellPadding: 3 },
                  });
                }

                // Footer
                const pageCount = doc.internal.getNumberOfPages();
                for (let i = 1; i <= pageCount; i++) {
                  doc.setPage(i);
                  doc.setFontSize(8);
                  doc.setFont('helvetica', 'italic');
                  doc.text(
                    `KNMP SmartHub - Halaman ${i} dari ${pageCount}`,
                    pageWidth / 2, doc.internal.pageSize.getHeight() - 8,
                    { align: 'center' }
                  );
                }

                doc.save(`Laporan_KNMP_SmartHub_${new Date().toISOString().slice(0, 10)}.pdf`);
                toast.success('Laporan PDF berhasil di-download!', { id: toastId });
              } catch (err) {
                console.error(err);
                toast.error('Gagal membuat laporan PDF.', { id: toastId });
              } finally {
                setExporting(false);
              }
            }}
            disabled={exporting}
            className="btn-primary"
            style={{ fontSize: '13px', padding: '10px 18px', height: 'auto' }}
          >
            <FileDown size={16} />
            <span>{exporting ? 'Generating...' : 'Export Laporan PDF'}</span>
          </button>
        </div>
      )}

      {/* Early Warning Banner if there are warnings */}
      {data?.activeWarnings && data.activeWarnings.length > 0 && (
        <EarlyWarningBanner warnings={data.activeWarnings} />
      )}

      {/* Row 1: Summary Cards Grid */}
      <div style={styles.summaryGrid}>
        {/* Card 1: Total KNMP */}
        <div className="glass-card" style={styles.statCard}>
          <div style={styles.statIconContainer}>
            <MapPin size={24} color="#00F2FE" />
          </div>
          <div>
            <span style={styles.statLabel}>Lokasi KNMP</span>
            <h3 style={styles.statValue}>{summary.totalKnmps}</h3>
            <p style={styles.statSubText}>Tersebar di 97 Kab/Kota</p>
          </div>
        </div>

        {/* Card 2: Total Fasilitas */}
        <div className="glass-card" style={styles.statCard}>
          <div style={styles.statIconContainer}>
            <Building2 size={24} color="#34D399" />
          </div>
          <div>
            <span style={styles.statLabel}>Total Fasilitas Aktif</span>
            <h3 style={styles.statValue}>{summary.totalFacilities}</h3>
            <p style={styles.statSubText}>Cold Storage, TPI, Pabrik Es, dll.</p>
          </div>
        </div>

        {/* Card 3: Rerata Health Index */}
        <div className="glass-card" style={styles.statCard}>
          <div style={styles.statIconContainer}>
            <TrendingUp size={24} color={summary.averageHealthIndex >= 60 ? '#00F2FE' : '#EF4444'} />
          </div>
          <div>
            <span style={styles.statLabel}>Rata-Rata Health Index</span>
            <h3 style={styles.statValue}>{summary.averageHealthIndex} <span style={styles.statMax}>/100</span></h3>
            <p style={styles.statSubText}>Kondisi Kesehatan Nasional</p>
          </div>
        </div>
      </div>

      {/* Row 2: Radar Chart + circular Health Index summary */}
      <div style={styles.rowTwoGrid}>
        {/* Circular indicator card */}
        <div style={{ flex: 1 }}>
          <HealthIndexCard 
            score={summary.averageHealthIndex} 
            status={summary.averageHealthIndex >= 80 ? 'SANGAT_BAIK' : (summary.averageHealthIndex >= 70 ? 'BAIK' : (summary.averageHealthIndex >= 60 ? 'MODERAT' : (summary.averageHealthIndex >= 50 ? 'PERLU_PERHATIAN' : 'KRITIS')))}
            title="Index Kesehatan Rata-Rata"
          />
        </div>

        {/* Radar Chart */}
        <div style={{ flex: 1.5 }}>
          <KPIChart data={radarData} />
        </div>
      </div>

      {/* Row 3: TOPSIS Priorities Table */}
      <div className="glass-card" style={styles.rankSection}>
        <div style={styles.sectionHeader}>
          <div>
            <h3 style={styles.sectionTitle}>Peringkat Prioritas Intervensi (TOPSIS)</h3>
            <p style={styles.sectionSubtitle}>
              Metode pengambilan keputusan multi-kriteria untuk mengurutkan lokasi yang mendesak mendapat tindakan
            </p>
          </div>
          <Link to="/priorities" style={styles.viewMoreBtn}>
            <span>Lihat Semua Detail</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tr}>
                <th style={styles.th}>Peringkat</th>
                <th style={styles.th}>Lokasi KNMP</th>
                <th style={styles.th}>CC Score</th>
                <th style={styles.th}>Urgensi Intervensi</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {data?.rankings.slice(0, 4).map((rank, idx) => (
                <tr key={rank.id} style={styles.trBody}>
                  <td style={styles.tdRank}>
                    <span style={{
                      ...styles.rankCircle,
                      backgroundColor: rank.ranking === 1 ? 'rgba(239, 68, 68, 0.2)' : (rank.ranking === 2 ? 'rgba(245, 175, 25, 0.2)' : 'var(--bg-secondary)'),
                      color: rank.ranking === 1 ? '#EF4444' : (rank.ranking === 2 ? '#F5AF19' : 'var(--text-secondary)'),
                      borderColor: rank.ranking === 1 ? '#EF4444' : (rank.ranking === 2 ? '#F5AF19' : 'var(--border-color)')
                    }}>
                      {rank.ranking}
                    </span>
                  </td>
                  <td style={styles.tdName}>
                    <span style={styles.knmpNameText}>{rank.knmp.name}</span>
                  </td>
                  <td style={styles.tdCc}>{rank.ccScore}</td>
                  <td style={styles.tdStatus}>
                    <span className={`status-badge ${rank.status.toLowerCase().replace('_', '-')}`}>
                      {rank.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ ...styles.tdAction, textAlign: 'right' }}>
                    <button 
                      onClick={() => navigate(`/knmp/${rank.knmp.id}`)}
                      style={styles.detailBtn}
                    >
                      Buka Analitik
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: 'var(--bg-primary)',
    gap: '20px',
  },
  loadingText: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--color-primary)',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '16px',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
  },
  statIconContainer: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statLabel: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    fontWeight: '500',
    display: 'block',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  statValue: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '26px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    marginTop: '2px',
  },
  statMax: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    fontWeight: '500',
  },
  statSubText: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },
  rowTwoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  rankSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
  },
  sectionTitle: {
    fontSize: '16px',
    color: 'var(--text-primary)',
  },
  sectionSubtitle: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginTop: '4px',
  },
  viewMoreBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--color-primary)',
    fontSize: '13px',
    fontWeight: '600',
    padding: '8px 12px',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    whiteSpace: 'nowrap',
  },
  tableWrapper: {
    width: '100%',
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
  table: {
    width: '100%',
    minWidth: '600px',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  tr: {
    borderBottom: '1px solid var(--border-color)',
  },
  th: {
    padding: '12px 16px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
  },
  trBody: {
    borderBottom: '1px solid var(--border-color)',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: 'var(--bg-secondary)',
    }
  },
  tdRank: {
    padding: '16px',
  },
  rankCircle: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '700',
    border: '1px solid',
  },
  tdName: {
    padding: '16px',
  },
  knmpNameText: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  tdCc: {
    padding: '16px',
    fontSize: '14px',
    color: 'var(--text-primary)',
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  tdStatus: {
    padding: '16px',
  },
  tdAction: {
    padding: '16px',
  },
  detailBtn: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '12px',
    fontWeight: '600',
    padding: '8px 14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
    ':hover': {
      backgroundColor: 'var(--bg-secondary)',
      borderColor: 'var(--color-primary)',
    }
  },
};

export default Dashboard;
