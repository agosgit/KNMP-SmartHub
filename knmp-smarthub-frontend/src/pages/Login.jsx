import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../store/useAppStore';
import API from '../services/api';
import { Anchor, Mail, Lock, Loader2, Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, theme, toggleTheme } = useAppStore();
  const navigate = useNavigate();

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
      {/* Theme Toggle for Login Page */}
      <button 
        onClick={toggleTheme} 
        style={styles.themeToggle}
        title={theme === 'dark' ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="glass-card" style={styles.loginCard}>
        {/* Logo and Brand */}
        <div style={styles.brandContainer}>
          <div style={styles.logoCircle}>
            <Anchor size={36} color="var(--color-primary)" />
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
              <Mail size={18} color="var(--text-muted)" style={styles.inputIcon} />
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
              <Lock size={18} color="var(--text-muted)" style={styles.inputIcon} />
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
    backgroundColor: 'var(--bg-primary)',
    background: 'radial-gradient(circle at center, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
    padding: '20px',
    position: 'relative',
  },
  themeToggle: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'all 0.2s',
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
    backgroundColor: 'var(--border-glow)',
    border: '1px solid var(--border-glow)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    boxShadow: '0 0 15px 0 var(--border-glow)',
  },
  brandName: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '24px',
    fontWeight: '800',
    color: 'var(--text-primary)',
  },
  brandHighlight: {
    color: 'var(--color-primary)',
  },
  brandSub: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
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
    color: 'var(--text-secondary)',
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
};

export default Login;
