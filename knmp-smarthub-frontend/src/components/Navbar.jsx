import React, { useState } from 'react';
import useAppStore from '../store/useAppStore';
import API from '../services/api';
import { RefreshCw, Clock, Menu, Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = ({ title }) => {
  const { user, toggleSidebar, theme, toggleTheme } = useAppStore();
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
    <header className="app-navbar">
      {/* Left side: Hamburger Button (Mobile) + Title */}
      <div className="navbar-left">
        <button 
          className="navbar-menu-btn" 
          onClick={toggleSidebar}
          aria-label="Buka Menu"
        >
          <Menu size={22} color="var(--color-primary)" />
        </button>

        <div className="navbar-title-group">
          <h1 className="navbar-title">{title || 'Dashboard'}</h1>
          <p className="navbar-subtitle">Government Decision Intelligence Platform</p>
        </div>
      </div>

      {/* Right side: Action Buttons & Status */}
      <div className="navbar-actions">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme} 
          className="navbar-theme-btn"
          aria-label="Toggle Theme"
          title={theme === 'dark' ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
          style={{
            background: 'transparent', 
            border: 'none', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '6px',
            borderRadius: '50%',
            color: 'var(--text-primary)'
          }}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Last updated indicator */}
        <div className="navbar-timestamp">
          <Clock size={14} color="var(--text-secondary)" />
          <span className="navbar-timestamp-text">Sinkronisasi: {lastUpdate}</span>
        </div>

        {/* Recalculate button for Admin/KKP */}
        {isAllowedToCalculate && (
          <button 
            onClick={handleRecalculate} 
            disabled={loading} 
            className="navbar-recalc-btn"
            title="Picu kalkulasi ulang matriks TOPSIS & Health Index secara manual"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            <span>Kalkulasi Ulang</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
