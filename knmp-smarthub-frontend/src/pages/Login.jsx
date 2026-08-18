import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../store/useAppStore';
import API from '../services/api';
import { Anchor, Mail, Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAppStore();
  const navigate = useNavigate();

  const demoAccounts = [
    { label: 'Admin Pusat', email: 'admin@smarthub.go.id', role: 'ADMIN', color: '#8B5CF6' },
    { label: 'Pimpinan KKP', email: 'kkp@smarthub.go.id', role: 'KKP', color: '#3B82F6' },
    { label: 'Petugas TPI (Muara Baru)', email: 'tpi@smarthub.go.id', role: 'TPI', color: '#10B981' },
    { label: 'Penyuluh (Brondong)', email: 'penyuluh@smarthub.go.id', role: 'PENYULUH', color: '#F59E0B' },
  ];

  const handleDemoLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Silakan isi email dan password Anda.');
      return;
    }

    setLoading(true);
    try {
      const response = await API.post('/auth/login', { email, password });
      const { user, token } = response.data;
      
      login(user, token);
      toast.success(`Selamat datang kembali, ${user.name}!`);
      navigate('/');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Email atau password salah.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div className="glass-card" style={styles.loginCard}>
        {/* Logo and Brand */}
        <div style={styles.brandContainer}>
          <div style={styles.logoCircle}>
            <Anchor size={36} color="#00F2FE" />
          </div>
          <h2 style={styles.brandName}>KNMP <span style={styles.brandHighlight}>SmartHub</span></h2>
          <p style={styles.brandSub}>Government Decision Intelligence Platform</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Email Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Instansi / Petugas</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} color="#6B7280" style={styles.inputIcon} />
              <input
                type="email"
                placeholder="nama@smarthub.go.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={styles.input}
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} color="#6B7280" style={styles.inputIcon} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={styles.input}
                disabled={loading}
              />
            </div>
          </div>

          {/* Action button */}
          <button type="submit" disabled={loading} className="btn-primary" style={styles.submitBtn}>
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <span>Masuk Sistem</span>
            )}
          </button>
        </form>

        {/* Footer info for demo credentials */}
        <div style={styles.demoCredentials}>
          <span style={styles.demoTitle}>Pilih Akun Simulasi Demo:</span>
          <div style={styles.demoGrid}>
            {demoAccounts.map((acc, idx) => (
              <button 
                key={idx}
                type="button"
                onClick={() => handleDemoLogin(acc.email)}
                style={{...styles.demoBtn, borderLeftColor: acc.color}}
              >
                <span style={styles.demoBtnLabel}>{acc.label}</span>
                <span style={{...styles.demoBtnRole, color: acc.color}}>
                  {acc.role}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#080B11',
    background: 'radial-gradient(circle at center, #111827 0%, #080B11 100%)',
    padding: '20px',
  },
  loginCard: {
    width: '100%',
    maxWidth: '420px',
    padding: '40px 32px',
    boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 25px 0 rgba(0, 242, 254, 0.05)',
  },
  brandContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '32px',
  },
  logoCircle: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 242, 254, 0.05)',
    border: '1px solid rgba(0, 242, 254, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    boxShadow: '0 0 15px 0 rgba(0, 242, 254, 0.1)',
  },
  brandName: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '24px',
    fontWeight: '800',
    color: '#F3F4F6',
  },
  brandHighlight: {
    color: '#00F2FE',
  },
  brandSub: {
    fontSize: '11px',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginTop: '6px',
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#9CA3AF',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    zIndex: 10,
  },
  input: {
    paddingLeft: '44px',
  },
  submitBtn: {
    marginTop: '10px',
    width: '100%',
    height: '46px',
  },
  demoCredentials: {
    marginTop: '28px',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    paddingTop: '20px',
    textAlign: 'left',
  },
  demoTitle: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#9CA3AF',
    display: 'block',
    marginBottom: '8px',
    textTransform: 'uppercase',
  },
  demoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },
  demoBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderLeftWidth: '3px',
    borderRadius: '6px',
    padding: '8px 10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'left',
  },
  demoBtnLabel: {
    fontSize: '11px',
    color: '#D1D5DB',
    fontWeight: '600',
    marginBottom: '2px',
  },
  demoBtnRole: {
    fontSize: '9px',
    fontWeight: '800',
  }
};

export default Login;
