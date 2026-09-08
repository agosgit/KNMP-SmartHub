import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../store/useAppStore';
import API from '../services/api';
import { 
  Anchor, 
  Mail, 
  Lock, 
  Loader2, 
  Sun, 
  Moon, 
  Landmark, 
  Ship, 
  Users, 
  ClipboardList, 
  TrendingUp, 
  Shield, 
  Sparkles, 
  ArrowRight,
  KeyRound,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

const DEMO_ACCOUNTS = [
  {
    role: 'KKP',
    title: 'Pimpinan KKP Pusat',
    subtitle: 'Budi Santoso',
    badge: 'G2G PUSAT',
    email: 'kkp@smarthub.go.id',
    desc: 'Monitoring Nasional, Rekalkulasi TOPSIS & Ekspor PDF',
    accent: '#00F2FE',
    borderCol: 'rgba(0, 242, 254, 0.3)',
    bgCol: 'rgba(0, 242, 254, 0.06)',
    icon: Landmark,
  },
  {
    role: 'TPI',
    title: 'Petugas TPI (Muara Baru)',
    subtitle: 'Petugas Pelelangan',
    badge: 'G2E LAPANGAN',
    email: 'tpi.muarabaru@smarthub.go.id',
    desc: 'Input Hasil Tangkapan Harian & Kelaikan Cold Storage',
    accent: '#10B981',
    borderCol: 'rgba(16, 185, 129, 0.3)',
    bgCol: 'rgba(16, 185, 129, 0.06)',
    icon: Ship,
  },
  {
    role: 'KOPERASI',
    title: 'Koperasi Nelayan',
    subtitle: 'Pengurus Koperasi',
    badge: 'G2E LAPANGAN',
    email: 'kop.muarabaru@smarthub.go.id',
    desc: 'Pencatatan Rantai Distribusi & Transaksi Anggota',
    accent: '#F5AF19',
    borderCol: 'rgba(245, 175, 25, 0.3)',
    bgCol: 'rgba(245, 175, 25, 0.06)',
    icon: Users,
  },
  {
    role: 'PENYULUH',
    title: 'Penyuluh Perikanan',
    subtitle: 'Penyuluh Lapangan',
    badge: 'G2E LAPANGAN',
    email: 'pen.muarabaru@smarthub.go.id',
    desc: 'Monitoring Kondisi Fasilitas & Pelaporan Anomali EWS',
    accent: '#A855F7',
    borderCol: 'rgba(168, 85, 247, 0.3)',
    bgCol: 'rgba(168, 85, 247, 0.06)',
    icon: ClipboardList,
  },
  {
    role: 'PEMDA',
    title: 'Dinas Kelautan DKI',
    subtitle: 'Ratna Dewi',
    badge: 'G2G DAERAH',
    email: 'pemda.dki@smarthub.go.id',
    desc: 'Dashboard Wilayah Provinsi & Laporan Rekapitulasi',
    accent: '#38BDF8',
    borderCol: 'rgba(56, 189, 248, 0.3)',
    bgCol: 'rgba(56, 189, 248, 0.06)',
    icon: TrendingUp,
  },
  {
    role: 'ADMIN',
    title: 'Administrator Sistem',
    subtitle: 'Suhartono',
    badge: 'SUPERUSER',
    email: 'admin@smarthub.go.id',
    desc: 'Manajemen Pengguna, Lokasi KNMP & Konfigurasi Master',
    accent: '#EC4899',
    borderCol: 'rgba(236, 72, 153, 0.3)',
    bgCol: 'rgba(236, 72, 153, 0.06)',
    icon: Shield,
  },
];

const Login = () => {
  const [activeTab, setActiveTab] = useState('demo'); // 'demo' | 'manual'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingRole, setLoadingRole] = useState(null);

  const { login, theme, toggleTheme } = useAppStore();
  const navigate = useNavigate();

  // Handle Manual Form Submit
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

  // Handle 1-Click Quick Demo Login
  const handleQuickLogin = async (account) => {
    if (loading || loadingRole) return;
    setLoadingRole(account.role);
    try {
      const response = await API.post('/auth/login', { 
        email: account.email, 
        password: 'password123' 
      });
      const { user, token } = response.data;
      
      login(user, token);
      toast.success(`Berhasil masuk sebagai ${user.name} (${account.badge})`);
      navigate('/');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Gagal masuk dengan akun demo.';
      toast.error(errorMsg);
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div style={styles.container}>
      {/* Theme Toggle */}
      <button 
        onClick={toggleTheme} 
        style={styles.themeToggle}
        title={theme === 'dark' ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
        aria-label="Ubah Tema Tampilan"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="glass-card" style={styles.loginCard}>
        {/* Logo and Brand */}
        <div style={styles.brandContainer}>
          <div style={styles.logoCircle}>
            <Anchor size={36} color="var(--color-primary)" />
          </div>
          <h2 style={styles.brandName}>
            KNMP <span style={styles.brandHighlight}>SmartHub</span>
          </h2>
          <p style={styles.brandSub}>Government Decision Intelligence Platform</p>
          <div style={styles.govTag}>
            <span>🏆 Finalis KMIPN VIII 2026 — E-Government</span>
          </div>
        </div>

        {/* Tab Switcher (Demo Cepat vs Manual) */}
        <div style={styles.tabContainer}>
          <button
            type="button"
            onClick={() => setActiveTab('demo')}
            style={{
              ...styles.tabBtn,
              ...(activeTab === 'demo' ? styles.tabBtnActive : styles.tabBtnInactive)
            }}
          >
            <Zap size={15} color={activeTab === 'demo' ? 'var(--color-primary)' : 'var(--text-muted)'} />
            <span>Akses Cepat Demo (1-Click)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            style={{
              ...styles.tabBtn,
              ...(activeTab === 'manual' ? styles.tabBtnActive : styles.tabBtnInactive)
            }}
          >
            <KeyRound size={15} color={activeTab === 'manual' ? 'var(--color-primary)' : 'var(--text-muted)'} />
            <span>Input Manual</span>
          </button>
        </div>

        {/* TAB 1: QUICK DEMO ACCOUNTS (REKOMENDASI UNTUK JURI & PRESENTASI) */}
        {activeTab === 'demo' && (
          <div>
            <div style={styles.demoIntroBox}>
              <Sparkles size={16} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={styles.demoIntroText}>
                <strong>Mode Pengujian Juri:</strong> Klik salah satu peran di bawah untuk langsung mengeksplorasi hierarki hak akses (RBAC Multi-Role) tanpa mengetik password.
              </p>
            </div>

            <div style={styles.demoGrid}>
              {DEMO_ACCOUNTS.map((account) => {
                const Icon = account.icon;
                const isSelected = loadingRole === account.role;

                return (
                  <button
                    key={account.role}
                    type="button"
                    onClick={() => handleQuickLogin(account)}
                    disabled={loading || loadingRole !== null}
                    style={{
                      ...styles.demoCard,
                      borderColor: account.borderCol,
                      backgroundColor: account.bgCol,
                      opacity: loadingRole && !isSelected ? 0.45 : 1,
                    }}
                    className="demo-account-card"
                  >
                    <div style={styles.demoCardTop}>
                      <div style={{ ...styles.demoIconWrapper, color: account.accent, backgroundColor: `${account.accent}18` }}>
                        <Icon size={18} />
                      </div>
                      <span style={{ ...styles.demoBadge, color: account.accent, borderColor: account.borderCol }}>
                        {account.badge}
                      </span>
                    </div>

                    <div style={styles.demoCardBody}>
                      <div style={styles.demoTitle}>{account.title}</div>
                      <div style={styles.demoDesc}>{account.desc}</div>
                    </div>

                    <div style={styles.demoCardFooter}>
                      <span style={styles.demoActionText}>
                        {isSelected ? 'Menghubungkan...' : 'Masuk Sekarang'}
                      </span>
                      {isSelected ? (
                        <Loader2 size={14} className="animate-spin" color={account.accent} />
                      ) : (
                        <ArrowRight size={14} color={account.accent} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: MANUAL LOGIN FORM */}
        {activeTab === 'manual' && (
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
                  autoComplete="email"
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
                  autoComplete="current-password"
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

            <div style={styles.defaultCredsHint}>
              <span>Password default semua akun demo: <code>password123</code></span>
            </div>
          </form>
        )}
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
    padding: '24px 16px',
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
    maxWidth: '560px',
    padding: '36px 32px',
    boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 25px 0 rgba(0, 242, 254, 0.06)',
    borderRadius: '16px',
  },
  brandContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '24px',
  },
  logoCircle: {
    width: '68px',
    height: '68px',
    borderRadius: '50%',
    backgroundColor: 'var(--border-glow)',
    border: '1px solid var(--border-glow)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '14px',
    boxShadow: '0 0 15px 0 var(--border-glow)',
  },
  brandName: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '24px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    margin: 0,
  },
  brandHighlight: {
    color: 'var(--color-primary)',
  },
  brandSub: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginTop: '5px',
    fontWeight: '600',
  },
  govTag: {
    marginTop: '10px',
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 12px',
    borderRadius: '20px',
    backgroundColor: 'rgba(0, 242, 254, 0.08)',
    border: '1px solid rgba(0, 242, 254, 0.2)',
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--color-primary)',
  },
  tabContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    padding: '4px',
    borderRadius: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    marginBottom: '20px',
    border: '1px solid var(--border-color)',
  },
  tabBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px 12px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  tabBtnActive: {
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
  },
  tabBtnInactive: {
    backgroundColor: 'transparent',
    color: 'var(--text-muted)',
  },
  demoIntroBox: {
    display: 'flex',
    gap: '10px',
    padding: '12px 14px',
    borderRadius: '10px',
    backgroundColor: 'rgba(0, 242, 254, 0.05)',
    border: '1px solid rgba(0, 242, 254, 0.15)',
    marginBottom: '16px',
  },
  demoIntroText: {
    fontSize: '12px',
    lineHeight: '1.45',
    color: 'var(--text-secondary)',
    margin: 0,
  },
  demoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
    gap: '12px',
  },
  demoCard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '14px',
    borderRadius: '12px',
    borderWidth: '1px',
    borderStyle: 'solid',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  demoCardTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  demoIconWrapper: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoBadge: {
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '0.04em',
    padding: '2px 7px',
    borderRadius: '12px',
    borderWidth: '1px',
    borderStyle: 'solid',
  },
  demoCardBody: {
    marginBottom: '12px',
  },
  demoTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '4px',
  },
  demoDesc: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    lineHeight: '1.35',
  },
  demoCardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '8px',
    borderTop: '1px solid var(--border-color)',
  },
  demoActionText: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
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
    marginTop: '6px',
    width: '100%',
    height: '46px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: '600',
  },
  defaultCredsHint: {
    textAlign: 'center',
    fontSize: '11px',
    color: 'var(--text-muted)',
    marginTop: '4px',
  },
};

export default Login;
