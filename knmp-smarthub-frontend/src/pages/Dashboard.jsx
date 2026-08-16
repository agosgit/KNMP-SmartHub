import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import HealthIndexCard from '../components/HealthIndexCard';
import KPIChart from '../components/KPIChart';
import EarlyWarningBanner from '../components/EarlyWarningBanner';
import { 
  Building2, 
  Settings, 
  MapPin, 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight,
  TrendingDown,
  Gauge
} from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
                      backgroundColor: rank.ranking === 1 ? 'rgba(239, 68, 68, 0.2)' : (rank.ranking === 2 ? 'rgba(245, 175, 25, 0.2)' : 'rgba(255, 255, 255, 0.05)'),
                      color: rank.ranking === 1 ? '#EF4444' : (rank.ranking === 2 ? '#F5AF19' : '#F3F4F6'),
                      borderColor: rank.ranking === 1 ? '#EF4444' : (rank.ranking === 2 ? '#F5AF19' : 'rgba(255, 255, 255, 0.1)')
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
    backgroundColor: '#080B11',
    gap: '20px',
  },
  loadingText: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '18px',
    fontWeight: '600',
    color: '#00F2FE',
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
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statLabel: {
    fontSize: '11px',
    color: '#9CA3AF',
    fontWeight: '500',
    display: 'block',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  statValue: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '26px',
    fontWeight: '800',
    color: '#F3F4F6',
    marginTop: '2px',
  },
  statMax: {
    fontSize: '14px',
    color: '#9CA3AF',
    fontWeight: '500',
  },
  statSubText: {
    fontSize: '11px',
    color: '#6B7280',
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
    color: '#F3F4F6',
  },
  sectionSubtitle: {
    fontSize: '12px',
    color: '#6B7280',
    marginTop: '4px',
  },
  viewMoreBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#00F2FE',
    fontSize: '13px',
    fontWeight: '600',
    padding: '8px 12px',
    borderRadius: '8px',
    backgroundColor: 'rgba(0, 242, 254, 0.03)',
    border: '1px solid rgba(0, 242, 254, 0.1)',
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
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  th: {
    padding: '12px 16px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  trBody: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.01)',
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
    color: '#F3F4F6',
  },
  tdCc: {
    padding: '16px',
    fontSize: '14px',
    color: '#F3F4F6',
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
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '8px',
    color: '#F3F4F6',
    fontSize: '12px',
    fontWeight: '600',
    padding: '8px 14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
      borderColor: 'rgba(255, 255, 255, 0.12)',
    }
  },
};

export default Dashboard;
