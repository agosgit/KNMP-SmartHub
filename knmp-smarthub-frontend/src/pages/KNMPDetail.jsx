import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import HealthIndexCard from '../components/HealthIndexCard';
import KPIChart from '../components/KPIChart';
import { 
  ArrowLeft, 
  Settings, 
  MapPin, 
  AlertTriangle, 
  Wrench, 
  CheckCircle,
  FileText,
  HelpCircle,
  Calendar,
  Layers
} from 'lucide-react';
import toast from 'react-hot-toast';

const KNMPDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await API.get(`/dashboard/knmp/${id}`);
        setData(response.data);
      } catch (error) {
        toast.error('Gagal mengambil data detail lokasi.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, navigate]);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <span style={styles.loadingText}>Membuat Profil Analitik Lokasi...</span>
      </div>
    );
  }

  const { knmp, kpiScores, recommendations, warnings } = data;
  const latestHealth = knmp.healthIndices[0] || { healthIndex: 0, status: 'MODERAT' };

  // Format data untuk Radar Chart Recharts
  const radarData = kpiScores.map(item => ({
    subject: item.name,
    A: item.score,
    fullMark: 100
  }));

  return (
    <div className="main-content">
      {/* Header dengan tombol back */}
      <div style={styles.headerRow}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          <ArrowLeft size={16} />
          <span>Kembali</span>
        </button>
        <span style={styles.locationMeta}>{knmp.region.name}</span>
      </div>

      <Navbar title={knmp.name} />

      {/* Alamat */}
      <div style={styles.addressContainer}>
        <MapPin size={16} color="#9CA3AF" />
        <span style={styles.addressText}>{knmp.address}</span>
      </div>

      {/* Row 1: Health Index Card + KPI Radar Chart */}
      <div style={styles.twoColumnGrid}>
        <div style={{ flex: 1 }}>
          <HealthIndexCard score={latestHealth.healthIndex} status={latestHealth.status} />
        </div>
        <div style={{ flex: 1.5 }}>
          <KPIChart data={radarData} />
        </div>
      </div>

      {/* Row 2: Rekomendasi Kebijakan & Peringatan Dini */}
      <div style={styles.twoColumnGrid}>
        {/* Peringatan Dini (Warnings) */}
        <div className="glass-card" style={{ flex: 1, borderColor: warnings.length > 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.08)' }}>
          <h3 style={styles.cardTitle}>Indikator Kinerja Bermasalah</h3>
          <p style={styles.cardSubtitle}>Item dengan skor di bawah standar minimum (60)</p>

          <div style={styles.warningList}>
            {warnings.length === 0 ? (
              <div style={styles.emptyState}>
                <CheckCircle size={32} color="#10B981" />
                <p style={styles.emptyText}>Semua parameter KPI berjalan optimal di atas batas standar.</p>
              </div>
            ) : (
              warnings.map((warn, index) => (
                <div key={index} style={styles.warnItem}>
                  <div style={styles.warnItemHeader}>
                    <div style={styles.warnTitleGroup}>
                      <AlertTriangle size={16} color={warn.score < 40 ? '#EF4444' : '#F5AF19'} />
                      <span style={styles.warnTitle}>{warn.title}</span>
                    </div>
                    <span style={{
                      ...styles.warnScore,
                      color: warn.score < 40 ? '#EF4444' : '#F5AF19',
                    }}>
                      Skor: {warn.score}
                    </span>
                  </div>
                  <p style={styles.warnDesc}>{warn.description}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Rekomendasi Tindak Lanjut (DSS) */}
        <div className="glass-card" style={{ flex: 1, borderColor: recommendations.length > 0 ? 'rgba(0, 242, 254, 0.2)' : 'rgba(255,255,255,0.08)' }}>
          <h3 style={styles.cardTitle}>Rekomendasi Tindak Lanjut (DSS)</h3>
          <p style={styles.cardSubtitle}>Instruksi kebijakan otomatis berbasis data multi-kriteria</p>

          <div style={styles.recList}>
            {recommendations.length === 0 ? (
              <div style={styles.emptyState}>
                <CheckCircle size={32} color="#10B981" />
                <p style={styles.emptyText}>Tidak ada rekomendasi tindakan darurat yang diperlukan.</p>
              </div>
            ) : (
              recommendations.map((rec, index) => (
                <div key={index} style={styles.recItem}>
                  <span style={styles.recBadge}>{rec.kpiName}</span>
                  <p style={styles.recAction}>{rec.action}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Daftar Fasilitas & Laporan Monitoring */}
      <div style={styles.twoColumnGrid}>
        {/* Fasilitas */}
        <div className="glass-card" style={{ flex: 1.2 }}>
          <h3 style={styles.cardTitle}>Fasilitas Pelabuhan & Infrastruktur</h3>
          <p style={styles.cardSubtitle}>Ketersediaan dan kapasitas aset di lokasi KNMP</p>

          <div style={styles.facTableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tr}>
                  <th style={styles.th}>Nama Aset</th>
                  <th style={styles.th}>Tipe</th>
                  <th style={styles.th}>Kapasitas</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {knmp.facilities.map((fac) => (
                  <tr key={fac.id} style={styles.trBody}>
                    <td style={styles.tdName}>{fac.name}</td>
                    <td style={styles.tdType}>{fac.type.replace('_', ' ')}</td>
                    <td style={styles.tdCapacity}>{fac.capacity} Unit/Ton</td>
                    <td>
                      <span className={`status-badge ${fac.status.toLowerCase()}`}>
                        {fac.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Laporan Monitoring Lapangan */}
        <div className="glass-card" style={{ flex: 1 }}>
          <h3 style={styles.cardTitle}>Laporan & Catatan Lapangan</h3>
          <p style={styles.cardSubtitle}>Catatan kendala fisik yang dilaporkan penyuluh</p>

          <div style={styles.reportsWrapper}>
            {knmp.monitoringReports.length === 0 ? (
              <div style={styles.emptyState}>
                <FileText size={32} color="#6B7280" />
                <p style={styles.emptyText}>Belum ada laporan catatan lapangan yang dikirimkan.</p>
              </div>
            ) : (
              knmp.monitoringReports.map((rep) => (
                <div key={rep.id} style={styles.reportCard}>
                  <div style={styles.reportHeader}>
                    <h4 style={styles.reportTitle}>{rep.title}</h4>
                    <span className={`status-badge ${rep.status.toLowerCase()}`}>
                      {rep.status}
                    </span>
                  </div>
                  <p style={styles.reportNotes}>{rep.notes}</p>
                  <div style={styles.reportMeta}>
                    <div style={styles.metaItem}>
                      <Calendar size={12} />
                      <span>{new Date(rep.date).toLocaleDateString()}</span>
                    </div>
                    <span style={styles.metaReporter}>
                      Oleh: {rep.reporter.name} ({rep.reporter.role})
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--color-primary)',
    fontSize: '16px',
    fontWeight: '600',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-secondary)',
    fontSize: '13px',
    fontWeight: '600',
    padding: '8px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  locationMeta: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--color-primary)',
    backgroundColor: 'var(--border-glow)',
    border: '1px solid var(--color-primary)',
    padding: '4px 10px',
    borderRadius: '6px',
  },
  addressContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '-16px',
  },
  addressText: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
  },
  twoColumnGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  cardTitle: {
    fontSize: '15px',
    color: 'var(--text-primary)',
  },
  cardSubtitle: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginTop: '4px',
    marginBottom: '20px',
  },
  warningList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  warnItem: {
    backgroundColor: 'rgba(239, 68, 68, 0.03)',
    border: '1px solid rgba(239, 68, 68, 0.1)',
    borderRadius: '10px',
    padding: '12px 14px',
  },
  warnItemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  warnTitleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  warnTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  warnScore: {
    fontSize: '12px',
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  warnDesc: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginTop: '6px',
    lineHeight: '1.4',
  },
  recList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  recItem: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    padding: '12px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  recBadge: {
    fontSize: '10px',
    fontWeight: '700',
    color: 'var(--color-primary)',
    backgroundColor: 'var(--border-glow)',
    padding: '2px 8px',
    borderRadius: '4px',
    alignSelf: 'flex-start',
    textTransform: 'uppercase',
  },
  recAction: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '12px',
    padding: '30px 0',
  },
  emptyText: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    maxWidth: '280px',
    lineHeight: '1.4',
  },
  facTableWrapper: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  tr: {
    borderBottom: '1px solid var(--border-color)',
  },
  th: {
    padding: '10px 12px',
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
  },
  trBody: {
    borderBottom: '1px solid var(--border-color)',
  },
  tdName: {
    padding: '12px',
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  tdType: {
    padding: '12px',
    fontSize: '12px',
    color: 'var(--text-secondary)',
    textTransform: 'capitalize',
  },
  tdCapacity: {
    padding: '12px',
    fontSize: '12px',
    color: 'var(--text-secondary)',
  },
  reportsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxHeight: '320px',
    overflowY: 'auto',
    paddingRight: '4px',
  },
  reportCard: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  reportHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  reportNotes: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
  },
  reportMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '8px',
    marginTop: '4px',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  metaReporter: {
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
};

export default KNMPDetail;
