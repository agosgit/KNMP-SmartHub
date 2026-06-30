import React, { useState } from 'react';
import useAppStore from '../store/useAppStore';
import API from '../services/api';
import { RefreshCw, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = ({ title }) => {
  const { user } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());

  const handleRecalculate = async () => {
    setLoading(true);
    const toastId = toast.loading('Mengkalkulasi ulang data Decision Engine...');
    try {
      await API.post('/dashboard/recalculate');
      setLastUpdate(new Date().toLocaleTimeString());
      toast.success('Kalkulasi ulang AHP + TOPSIS sukses!', { id: toastId });
      // Reload halaman untuk refresh data baru
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error('Gagal menjalankan kalkulasi: ' + (error.response?.data?.message || error.message), { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const isAllowedToCalculate = user && ['ADMIN', 'KKP'].includes(user.role);

  return (
    <header style={styles.navbar}>
      {/* Title */}
      <div>
        <h1 style={styles.title}>{title || 'Dashboard'}</h1>
        <p style={styles.subtitle}>Government Decision Intelligence Platform</p>
      </div>

      {/* Action Buttons & Status */}
      <div style={styles.actions}>
        {/* Last updated indicator */}
        <div style={styles.timestampContainer}>
          <Clock size={14} color="#9CA3AF" />
          <span style={styles.timestampText}>Sinkronisasi: {lastUpdate}</span>
        </div>

        {/* Recalculate button for Admin/KKP */}
        {isAllowedToCalculate && (
          <button 
            onClick={handleRecalculate} 
            disabled={loading} 
            style={styles.recalcButton}
            title="Picu kalkulasi ulang matriks TOPSIS & Health Index secara manual"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Kalkulasi Ulang</span>
          </button>
        )}
      </div>
    </header>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    marginBottom: '8px',
  },
  title: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '28px',
    fontWeight: '700',
    color: '#F3F4F6',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '12px',
    color: '#9CA3AF',
    marginTop: '4px',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  timestampContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  timestampText: {
    fontSize: '12px',
    color: '#9CA3AF',
    fontWeight: '500',
  },
  recalcButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: 'rgba(0, 242, 254, 0.1)',
    border: '1px solid rgba(0, 242, 254, 0.25)',
    borderRadius: '10px',
    color: '#00F2FE',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};
export default Navbar;
