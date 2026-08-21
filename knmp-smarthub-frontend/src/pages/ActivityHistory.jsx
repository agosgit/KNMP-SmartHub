import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import useAppStore from '../store/useAppStore';
import {
  ClipboardList,
  Ship,
  TrendingUp,
  Users,
  AlertTriangle,
  Loader2,
  Database,
  Calendar,
  MapPin
} from 'lucide-react';
import toast from 'react-hot-toast';

// Helper: Format tanggal
const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Helper: Format angka ribuan
const formatNumber = (num) => {
  if (!num) return '0';
  return Number(num).toLocaleString('id-ID');
};

// ============================================================
// TABEL PRODUKSI
// ============================================================
const ProductionTable = ({ data, loading }) => {
  if (loading) return <LoadingState text="Memuat riwayat produksi..." />;
  if (!data || data.length === 0) return <EmptyState text="Belum ada data produksi yang diinput." />;

  return (
    <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Lokasi KNMP</th>
              <th>Jenis Ikan</th>
              <th>Volume (Kg)</th>
              <th>Pelapor</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={13} color="var(--text-muted)" />
                    <span style={{ fontSize: '12px' }}>{formatDate(item.date)}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={13} color="var(--color-primary)" />
                    <span style={{ fontWeight: '600' }}>{item.knmp?.name || '-'}</span>
                  </div>
                </td>
                <td>{item.fishType}</td>
                <td style={{ fontFamily: 'monospace', fontWeight: '600' }}>{formatNumber(item.volumeKg)}</td>
                <td style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{item.reporter?.name || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================
// TABEL DISTRIBUSI
// ============================================================
const DistributionTable = ({ data, loading }) => {
  if (loading) return <LoadingState text="Memuat riwayat distribusi..." />;
  if (!data || data.length === 0) return <EmptyState text="Belum ada data distribusi yang diinput." />;

  return (
    <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Lokasi KNMP</th>
              <th>Tujuan Distribusi</th>
              <th>Volume (Kg)</th>
              <th>Pelapor</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={13} color="var(--text-muted)" />
                    <span style={{ fontSize: '12px' }}>{formatDate(item.date)}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={13} color="var(--color-primary)" />
                    <span style={{ fontWeight: '600' }}>{item.knmp?.name || '-'}</span>
                  </div>
                </td>
                <td>{item.destination}</td>
                <td style={{ fontFamily: 'monospace', fontWeight: '600' }}>{formatNumber(item.volumeKg)}</td>
                <td style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{item.reporter?.name || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================
// TABEL KOPERASI
// ============================================================
const CooperativeTable = ({ data, loading }) => {
  if (loading) return <LoadingState text="Memuat riwayat koperasi..." />;
  if (!data || data.length === 0) return <EmptyState text="Belum ada data aktivitas koperasi." />;

  return (
    <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Lokasi KNMP</th>
              <th>Nama Koperasi</th>
              <th>Anggota Aktif</th>
              <th>Transaksi</th>
              <th>Nilai (Rp)</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={13} color="var(--text-muted)" />
                    <span style={{ fontSize: '12px' }}>{formatDate(item.date)}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={13} color="var(--color-primary)" />
                    <span style={{ fontWeight: '600' }}>{item.knmp?.name || '-'}</span>
                  </div>
                </td>
                <td>{item.name}</td>
                <td style={{ fontFamily: 'monospace' }}>{item.activeMembers}</td>
                <td style={{ fontFamily: 'monospace' }}>{item.transactions}</td>
                <td style={{ fontFamily: 'monospace', fontWeight: '600' }}>Rp {formatNumber(item.transactionValue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================
// TABEL LAPORAN MONITORING
// ============================================================
const ReportTable = ({ data, loading }) => {
  if (loading) return <LoadingState text="Memuat riwayat laporan..." />;
  if (!data || data.length === 0) return <EmptyState text="Belum ada laporan monitoring." />;

  return (
    <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Lokasi KNMP</th>
              <th>Judul Laporan</th>
              <th>Status</th>
              <th>Pelapor</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={13} color="var(--text-muted)" />
                    <span style={{ fontSize: '12px' }}>{formatDate(item.date)}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={13} color="var(--color-primary)" />
                    <span style={{ fontWeight: '600' }}>{item.knmp?.name || '-'}</span>
                  </div>
                </td>
                <td style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.title}
                </td>
                <td>
                  <span className={`status-badge ${item.status?.toLowerCase()}`}>
                    {item.status}
                  </span>
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{item.reporter?.name || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================
// SHARED COMPONENTS
// ============================================================
const LoadingState = ({ text }) => (
  <div className="admin-empty-state">
    <Loader2 size={36} className="animate-spin" color="var(--color-primary)" />
    <span>{text}</span>
  </div>
);

const EmptyState = ({ text }) => (
  <div className="glass-card">
    <div className="admin-empty-state">
      <Database size={32} />
      <span>{text}</span>
    </div>
  </div>
);

// ============================================================
// MAIN PAGE
// ============================================================
const ActivityHistory = () => {
  const { user } = useAppStore();
  const [activeTab, setActiveTab] = useState(null);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState({});

  // Tentukan tab yang tersedia berdasarkan role
  const getAvailableTabs = () => {
    const role = user?.role;
    if (role === 'ADMIN' || role === 'PENGELOLA') {
      return [
        { key: 'productions', label: 'Produksi Tangkapan', icon: Ship },
        { key: 'distributions', label: 'Distribusi Ikan', icon: TrendingUp },
        { key: 'cooperatives', label: 'Aktivitas Koperasi', icon: Users },
        { key: 'reports', label: 'Laporan Monitoring', icon: AlertTriangle },
      ];
    }
    if (role === 'TPI') {
      return [{ key: 'productions', label: 'Produksi Tangkapan', icon: Ship }];
    }
    if (role === 'KOPERASI') {
      return [
        { key: 'distributions', label: 'Distribusi Ikan', icon: TrendingUp },
        { key: 'cooperatives', label: 'Aktivitas Koperasi', icon: Users },
      ];
    }
    if (role === 'PENYULUH') {
      return [{ key: 'reports', label: 'Laporan Monitoring', icon: AlertTriangle }];
    }
    return [];
  };

  const tabs = getAvailableTabs();

  // Set default active tab
  useEffect(() => {
    if (tabs.length > 0 && !activeTab) {
      setActiveTab(tabs[0].key);
    }
  }, [tabs.length]);

  // Fetch data when tab changes
  useEffect(() => {
    if (!activeTab) return;
    if (data[activeTab]) return; // sudah di-fetch

    const fetchData = async () => {
      setLoading(prev => ({ ...prev, [activeTab]: true }));
      try {
        const res = await API.get(`/history/${activeTab}`);
        setData(prev => ({ ...prev, [activeTab]: res.data }));
      } catch (err) {
        toast.error('Gagal mengambil data riwayat.');
      } finally {
        setLoading(prev => ({ ...prev, [activeTab]: false }));
      }
    };

    fetchData();
  }, [activeTab]);

  // Guard: role yang tidak punya akses
  if (tabs.length === 0) {
    return (
      <div className="main-content">
        <Navbar title="Riwayat Data" />
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <ClipboardList size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '8px' }}>Tidak Tersedia</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Role <strong>{user?.role}</strong> tidak memiliki riwayat input data operasional.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <Navbar title="Riwayat Data Saya" />

      {/* Tab Navigation */}
      <div style={tabStyles.tabsContainer}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          const count = data[tab.key]?.length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                ...tabStyles.tabButton,
                ...(isActive ? tabStyles.tabButtonActive : {})
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {count !== undefined && (
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  backgroundColor: isActive ? 'rgba(0, 242, 254, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                  color: isActive ? 'var(--color-primary)' : 'var(--text-muted)',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  minWidth: '24px',
                  textAlign: 'center'
                }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'productions' && (
        <ProductionTable data={data.productions} loading={loading.productions} />
      )}
      {activeTab === 'distributions' && (
        <DistributionTable data={data.distributions} loading={loading.distributions} />
      )}
      {activeTab === 'cooperatives' && (
        <CooperativeTable data={data.cooperatives} loading={loading.cooperatives} />
      )}
      {activeTab === 'reports' && (
        <ReportTable data={data.reports} loading={loading.reports} />
      )}
    </div>
  );
};

const tabStyles = {
  tabsContainer: {
    display: 'flex',
    gap: '10px',
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
    paddingBottom: '6px',
  },
  tabButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    color: 'var(--text-secondary)',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  tabButtonActive: {
    backgroundColor: 'var(--border-glow)',
    borderColor: 'var(--color-primary)',
    color: 'var(--color-primary)',
  },
};

export default ActivityHistory;
