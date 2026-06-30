import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import useAppStore from '../store/useAppStore';
import { 
  PlusSquare, 
  Anchor, 
  Send, 
  Ship, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

const OperationalInput = () => {
  const { user } = useAppStore();
  const [knmps, setKnmps] = useState([]);
  const [loadingKnmps, setLoadingKnmps] = useState(true);
  
  // Tab State: 'production' | 'distribution' | 'cooperative' | 'report'
  const [activeTab, setActiveTab] = useState('production');
  const [submitting, setSubmitting] = useState(false);

  // Form States
  const [knmpId, setKnmpId] = useState('');
  
  // Tab 1: Production
  const [fishType, setFishType] = useState('');
  const [volumeKg, setVolumeKg] = useState('');
  
  // Tab 2: Distribution
  const [destination, setDestination] = useState('');
  const [distVolumeKg, setDistVolumeKg] = useState('');
  
  // Tab 3: Cooperative
  const [coopName, setCoopName] = useState('');
  const [coopMembers, setCoopMembers] = useState('');
  const [coopTransactions, setCoopTransactions] = useState('');
  const [coopValue, setCoopValue] = useState('');
  
  // Tab 4: Monitoring Report
  const [reportTitle, setReportTitle] = useState('');
  const [reportNotes, setReportNotes] = useState('');
  const [reportStatus, setReportStatus] = useState('NORMAL');

  useEffect(() => {
    const fetchKnmps = async () => {
      try {
        const response = await API.get('/operational/knmps');
        setKnmps(response.data);
        if (response.data.length > 0) {
          setKnmpId(response.data[0].id.toString());
        }
      } catch (error) {
        toast.error('Gagal mengambil daftar lokasi KNMP.');
      } finally {
        setLoadingKnmps(false);
      }
    };
    fetchKnmps();
  }, []);

  // Periksa otorisasi role untuk tab tertentu
  const isTabAllowed = (tabName) => {
    if (!user) return false;
    const role = user.role;
    if (role === 'ADMIN' || role === 'PENGELOLA') return true;

    switch (tabName) {
      case 'production':
        return role === 'TPI';
      case 'distribution':
      case 'cooperative':
        return role === 'KOPERASI';
      case 'report':
        return role === 'PENYULUH';
      default:
        return false;
    }
  };

  // Reset form setelah sukses submit
  const resetForms = () => {
    setFishType('');
    setVolumeKg('');
    setDestination('');
    setDistVolumeKg('');
    setCoopName('');
    setCoopMembers('');
    setCoopTransactions('');
    setCoopValue('');
    setReportTitle('');
    setReportNotes('');
    setReportStatus('NORMAL');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!knmpId) {
      toast.error('Silakan pilih lokasi KNMP terlebih dahulu.');
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading('Mengirimkan data operasional...');

    try {
      if (activeTab === 'production') {
        await API.post('/operational/production', {
          knmpId,
          fishType,
          volumeKg
        });
      } else if (activeTab === 'distribution') {
        await API.post('/operational/distribution', {
          knmpId,
          destination,
          volumeKg: distVolumeKg
        });
      } else if (activeTab === 'cooperative') {
        await API.post('/operational/cooperative', {
          knmpId,
          name: coopName,
          activeMembers: coopMembers,
          transactions: coopTransactions,
          transactionValue: coopValue
        });
      } else if (activeTab === 'report') {
        await API.post('/operational/report', {
          knmpId,
          title: reportTitle,
          notes: reportNotes,
          status: reportStatus
        });
      }

      toast.success('Data operasional berhasil disimpan dan kalkulasi model terupdate!', { id: toastId });
      resetForms();
    } catch (error) {
      toast.error('Gagal mengirimkan data: ' + (error.response?.data?.message || error.message), { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="main-content">
      <Navbar title="Input Operasional Data" />

      {/* Selector Lokasi KNMP Utama */}
      <div className="glass-card" style={styles.selectorCard}>
        <label className="form-label">Pilih Lokasi Kampung Nelayan Merah Putih (KNMP)</label>
        {loadingKnmps ? (
          <div>Memuat lokasi...</div>
        ) : (
          <select 
            value={knmpId} 
            onChange={(e) => setKnmpId(e.target.value)} 
            className="form-input"
            style={styles.dropdown}
          >
            {knmps.map(k => (
              <option key={k.id} value={k.id}>{k.name} ({k.address})</option>
            ))}
          </select>
        )}
      </div>

      {/* Tabs Navigation */}
      <div style={styles.tabsContainer}>
        <button 
          onClick={() => setActiveTab('production')}
          style={{ ...styles.tabButton, ...(activeTab === 'production' ? styles.tabButtonActive : {}) }}
        >
          <Ship size={16} />
          <span>Produksi Tangkapan</span>
        </button>

        <button 
          onClick={() => setActiveTab('distribution')}
          style={{ ...styles.tabButton, ...(activeTab === 'distribution' ? styles.tabButtonActive : {}) }}
        >
          <TrendingUp size={16} />
          <span>Distribusi Ikan</span>
        </button>

        <button 
          onClick={() => setActiveTab('cooperative')}
          style={{ ...styles.tabButton, ...(activeTab === 'cooperative' ? styles.tabButtonActive : {}) }}
        >
          <Users size={16} />
          <span>Aktivitas Koperasi</span>
        </button>

        <button 
          onClick={() => setActiveTab('report')}
          style={{ ...styles.tabButton, ...(activeTab === 'report' ? styles.tabButtonActive : {}) }}
        >
          <AlertTriangle size={16} />
          <span>Laporan / Kendala</span>
        </button>
      </div>

      {/* Form Card */}
      <div className="glass-card" style={styles.formCard}>
        {!isTabAllowed(activeTab) ? (
          <div style={styles.unauthorizedContainer}>
            <AlertTriangle size={48} color="#EF4444" />
            <h4 style={styles.unauthTitle}>Akses Ditolak</h4>
            <p style={styles.unauthText}>
              Role akun Anda (<strong>{user?.role}</strong>) tidak memiliki otorisasi untuk menginput data pada modul ini.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* TAB 1: PRODUCTION */}
            {activeTab === 'production' && (
              <>
                <div style={styles.formHeader}>
                  <h3 style={styles.formTitle}>Form Input Produksi Hasil Tangkapan (TPI)</h3>
                  <p style={styles.formSubtitle}>Input data volume ikan terkumpul di Tempat Pelelangan Ikan</p>
                </div>

                <div style={styles.inputGroup}>
                  <label className="form-label">Jenis Komoditas Ikan Utama</label>
                  <input
                    type="text"
                    placeholder="Contoh: Cakalang, Layang, Tongkol, Tuna"
                    value={fishType}
                    onChange={(e) => setFishType(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label className="form-label">Volume Hasil Tangkapan (Kilogram)</label>
                  <input
                    type="number"
                    placeholder="Contoh: 12500"
                    value={volumeKg}
                    onChange={(e) => setVolumeKg(e.target.value)}
                    className="form-input"
                    required
                    min="1"
                  />
                </div>
              </>
            )}

            {/* TAB 2: DISTRIBUTION */}
            {activeTab === 'distribution' && (
              <>
                <div style={styles.formHeader}>
                  <h3 style={styles.formTitle}>Form Input Distribusi Hasil Perikanan</h3>
                  <p style={styles.formSubtitle}>Input data logistik dan pengiriman ikan ke pasar</p>
                </div>

                <div style={styles.inputGroup}>
                  <label className="form-label">Tujuan Pemasaran / Distribusi</label>
                  <input
                    type="text"
                    placeholder="Contoh: Pasar Induk Jakarta, Eksportir Lokal"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label className="form-label">Volume Terdistribusi (Kilogram)</label>
                  <input
                    type="number"
                    placeholder="Contoh: 8000"
                    value={distVolumeKg}
                    onChange={(e) => setDistVolumeKg(e.target.value)}
                    className="form-input"
                    required
                    min="1"
                  />
                </div>
              </>
            )}

            {/* TAB 3: COOPERATIVE */}
            {activeTab === 'cooperative' && (
              <>
                <div style={styles.formHeader}>
                  <h3 style={styles.formTitle}>Form Input Aktivitas Koperasi Nelayan</h3>
                  <p style={styles.formSubtitle}>Laporan volume transaksi dan partisipasi koperasi bulanan</p>
                </div>

                <div style={styles.inputGroup}>
                  <label className="form-label">Nama Koperasi Nelayan</label>
                  <input
                    type="text"
                    placeholder="Contoh: Koperasi Mina Jaya Sakti"
                    value={coopName}
                    onChange={(e) => setCoopName(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div style={styles.rowInputs}>
                  <div style={{ ...styles.inputGroup, flex: 1 }}>
                    <label className="form-label">Jumlah Anggota Aktif</label>
                    <input
                      type="number"
                      placeholder="Contoh: 150"
                      value={coopMembers}
                      onChange={(e) => setCoopMembers(e.target.value)}
                      className="form-input"
                      required
                      min="1"
                    />
                  </div>

                  <div style={{ ...styles.inputGroup, flex: 1 }}>
                    <label className="form-label">Total Transaksi (Kali)</label>
                    <input
                      type="number"
                      placeholder="Contoh: 85"
                      value={coopTransactions}
                      onChange={(e) => setCoopTransactions(e.target.value)}
                      className="form-input"
                      required
                      min="1"
                    />
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label className="form-label">Total Nilai Transaksi (Rupiah)</label>
                  <input
                    type="number"
                    placeholder="Contoh: 450000000"
                    value={coopValue}
                    onChange={(e) => setCoopValue(e.target.value)}
                    className="form-input"
                    required
                    min="1"
                  />
                </div>
              </>
            )}

            {/* TAB 4: MONITORING REPORT */}
            {activeTab === 'report' && (
              <>
                <div style={styles.formHeader}>
                  <h3 style={styles.formTitle}>Form Input Laporan Lapangan & Kendala</h3>
                  <p style={styles.formSubtitle}>Kirimkan catatan kerusakan alat, kendala cuaca, atau administrasi</p>
                </div>

                <div style={styles.inputGroup}>
                  <label className="form-label">Judul Masalah / Laporan</label>
                  <input
                    type="text"
                    placeholder="Contoh: Kerusakan Mesin Pabrik Es, Gelombang Tinggi"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label className="form-label">Catatan Deskripsi Lengkap</label>
                  <textarea
                    rows="4"
                    placeholder="Deskripsikan secara detail permasalahan fisik atau non-fisik yang terjadi di lokasi KNMP..."
                    value={reportNotes}
                    onChange={(e) => setReportNotes(e.target.value)}
                    className="form-input"
                    style={styles.textarea}
                    required
                  ></textarea>
                </div>

                <div style={styles.inputGroup}>
                  <label className="form-label">Status Keparahan Masalah</label>
                  <select
                    value={reportStatus}
                    onChange={(e) => setReportStatus(e.target.value)}
                    className="form-input"
                  >
                    <option value="NORMAL">NORMAL (Hanya Informasi)</option>
                    <option value="WARNING">WARNING (Kendala Ringan)</option>
                    <option value="CRITICAL">CRITICAL (Butuh Tindakan Cepat)</option>
                  </select>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={submitting} 
              className="btn-primary" 
              style={styles.submitBtn}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Mengirimkan Data...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Kirim Data</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const styles = {
  selectorCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  dropdown: {
    height: '46px',
    backgroundColor: '#0F131D',
  },
  tabsContainer: {
    display: 'flex',
    gap: '12px',
    overflowX: 'auto',
    paddingBottom: '4px',
  },
  tabButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
    color: '#9CA3AF',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  tabButtonActive: {
    backgroundColor: 'rgba(0, 242, 254, 0.06)',
    borderColor: '#00F2FE',
    color: '#00F2FE',
  },
  formCard: {
    minHeight: '360px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formHeader: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '16px',
    marginBottom: '8px',
  },
  formTitle: {
    fontSize: '16px',
    color: '#F3F4F6',
  },
  formSubtitle: {
    fontSize: '12px',
    color: '#6B7280',
    marginTop: '4px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  rowInputs: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  textarea: {
    resize: 'vertical',
    minHeight: '100px',
  },
  submitBtn: {
    marginTop: '12px',
    alignSelf: 'flex-start',
    height: '44px',
  },
  unauthorizedContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    gap: '16px',
    padding: '60px 0',
  },
  unauthTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#EF4444',
  },
  unauthText: {
    fontSize: '14px',
    color: '#9CA3AF',
    maxWidth: '360px',
    lineHeight: '1.5',
  },
};

export default OperationalInput;
