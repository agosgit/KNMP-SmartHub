import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import { ShieldAlert, Info, ArrowLeft, ArrowUpDown } from 'lucide-react';
import toast from 'react-hot-toast';

const Rankings = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await API.get('/dashboard/national');
        setRankings(response.data.rankings);
      } catch (error) {
        toast.error('Gagal mengambil data peringkat.');
      } finally {
        setLoading(false);
      }
    };
    fetchRankings();
  }, []);

  return (
    <div className="main-content">
      {/* Navbar */}
      <Navbar title="Prioritas Intervensi" />

      {/* Explanation Banner */}
      <div className="glass-card" style={styles.explainBanner}>
        <div style={styles.explainHeader}>
          <Info size={20} color="#00F2FE" />
          <h4 style={styles.explainTitle}>Metodologi Pendukung Keputusan: TOPSIS</h4>
        </div>
        <p style={styles.explainText}>
          Sistem ini menggunakan metode <strong>TOPSIS</strong> (Technique for Order Preference by Similarity to Ideal Solution) 
          untuk menentukan prioritas intervensi secara objektif. 
          Lokasi KNMP dengan <strong>CC Score terkecil (mendekati 0.0)</strong> diurutkan pada peringkat teratas karena posisinya 
          paling jauh dari kondisi ideal sukses (A+) dan paling dekat dengan kondisi ideal terburuk (A-). 
          Hal ini membantu alokasi anggaran dan perhatian pemerintah tepat sasaran secara ilmiah.
        </p>
      </div>

      {/* Main Ranking Table Card */}
      <div className="glass-card" style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Daftar Lengkap Peringkat Kebutuhan Intervensi</h3>
          <span style={styles.countText}>Total: {rankings.length} Lokasi</span>
        </div>

        <div style={styles.tableWrapper}>
          {loading ? (
            <div style={styles.tableLoading}>Memuat data peringkat...</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.tr}>
                  <th style={styles.th}>Peringkat</th>
                  <th style={styles.th}>Lokasi KNMP</th>
                  <th style={styles.th}>
                    <div style={styles.thCol}>
                      <span>Jarak Terdekat (D+)</span>
                    </div>
                  </th>
                  <th style={styles.th}>
                    <div style={styles.thCol}>
                      <span>Jarak Terjauh (D-)</span>
                    </div>
                  </th>
                  <th style={styles.th}>
                    <div style={styles.thCol}>
                      <span>CC Score</span>
                    </div>
                  </th>
                  <th style={styles.th}>Status Urgensi</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((item) => (
                  <tr key={item.id} style={styles.trBody}>
                    <td>
                      <span style={{
                        ...styles.rankCircle,
                        backgroundColor: item.ranking <= 2 ? 'rgba(239, 68, 68, 0.2)' : (item.ranking === 3 ? 'rgba(245, 175, 25, 0.2)' : 'rgba(255, 255, 255, 0.05)'),
                        color: item.ranking <= 2 ? '#EF4444' : (item.ranking === 3 ? '#F5AF19' : '#F3F4F6'),
                        borderColor: item.ranking <= 2 ? '#EF4444' : (item.ranking === 3 ? '#F5AF19' : 'rgba(255, 255, 255, 0.1)')
                      }}>
                        {item.ranking}
                      </span>
                    </td>
                    <td>
                      <div>
                        <span style={styles.knmpName}>{item.knmp.name}</span>
                      </div>
                    </td>
                    <td style={styles.tdMetric}>{item.dPlus || '0.000'}</td>
                    <td style={styles.tdMetric}>{item.dMinus || '0.000'}</td>
                    <td style={styles.tdCc}>{item.ccScore}</td>
                    <td>
                      <span className={`status-badge ${item.status.toLowerCase().replace('_', '-')}`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        onClick={() => navigate(`/knmp/${item.knmp.id}`)}
                        className="btn-secondary" 
                        style={styles.actionBtn}
                      >
                        Buka Analitik
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  explainBanner: {
    backgroundColor: 'rgba(0, 242, 254, 0.03)',
    borderColor: 'rgba(0, 242, 254, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  explainHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  explainTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#00F2FE',
  },
  explainText: {
    fontSize: '13px',
    color: '#9CA3AF',
    lineHeight: '1.6',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: '16px',
    color: '#F3F4F6',
  },
  countText: {
    fontSize: '12px',
    color: '#9CA3AF',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: '4px 10px',
    borderRadius: '6px',
  },
  tableWrapper: {
    width: '100%',
    overflowX: 'auto',
  },
  tableLoading: {
    textAlign: 'center',
    padding: '40px 0',
    color: '#9CA3AF',
    fontSize: '14px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  tr: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  th: {
    padding: '12px 16px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  thCol: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  trBody: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.01)',
    }
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
  knmpName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#F3F4F6',
  },
  tdMetric: {
    padding: '16px',
    fontSize: '14px',
    color: '#9CA3AF',
    fontFamily: 'monospace',
  },
  tdCc: {
    padding: '16px',
    fontSize: '14px',
    color: '#00F2FE',
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  actionBtn: {
    padding: '6px 12px',
    fontSize: '12px',
  },
};

export default Rankings;
