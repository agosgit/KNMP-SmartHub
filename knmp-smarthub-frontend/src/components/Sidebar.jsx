import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAppStore from '../store/useAppStore';
import { 
  LayoutDashboard, 
  Map, 
  TrendingUp, 
  PlusSquare, 
  LogOut, 
  User as UserIcon,
  Anchor
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAppStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Peta GIS', path: '/map', icon: Map },
    { name: 'Prioritas Intervensi', path: '/priorities', icon: TrendingUp },
  ];

  // Tambahkan menu input data operasional jika rolenya diizinkan
  const allowedInputRoles = ['ADMIN', 'PENGELOLA', 'TPI', 'KOPERASI', 'PENYULUH'];
  if (user && allowedInputRoles.includes(user.role)) {
    navItems.push({ name: 'Input Operasional', path: '/input', icon: PlusSquare });
  }

  return (
    <aside style={styles.sidebar}>
      {/* Brand Header */}
      <div style={styles.brand}>
        <Anchor size={28} color="#00F2FE" />
        <span style={styles.brandText}>KNMP <span style={styles.brandHighlight}>SmartHub</span></span>
      </div>

      {/* Navigation Links */}
      <nav style={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              ...styles.navLink,
              ...(isActive ? styles.navLinkActive : {}),
            })}
          >
            {({ isActive }) => {
              const Icon = item.icon;
              return (
                <>
                  <Icon size={20} color={isActive ? '#00F2FE' : '#9CA3AF'} />
                  <span>{item.name}</span>
                </>
              );
            }}
          </NavLink>
        ))}
      </nav>

      {/* User Info / Profile Section */}
      {user && (
        <div style={styles.userProfile}>
          <div style={styles.userAvatarContainer}>
            <div style={styles.avatar}>
              <UserIcon size={20} color="#F3F4F6" />
            </div>
            <div style={styles.userInfo}>
              <span style={styles.userName}>{user.name}</span>
              <span className={`status-badge ${user.role.toLowerCase()}`} style={styles.roleBadge}>
                {user.role}
              </span>
            </div>
          </div>

          <button onClick={handleLogout} style={styles.logoutButton}>
            <LogOut size={16} />
            <span>Keluar</span>
          </button>
        </div>
      )}
    </aside>
  );
};

const styles = {
  sidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: '260px',
    backgroundColor: '#0F1420',
    borderRight: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 16px',
    zIndex: 100,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingBottom: '24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    marginBottom: '24px',
  },
  brandText: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '20px',
    fontWeight: '700',
    color: '#F3F4F6',
  },
  brandHighlight: {
    color: '#00F2FE',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderTopLeftRadius: '10px',
    borderBottomLeftRadius: '10px',
    borderTopRightRadius: '10px',
    borderBottomRightRadius: '10px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#9CA3AF',
    transition: 'all 0.2s ease',
  },
  navLinkActive: {
    backgroundColor: 'rgba(0, 242, 254, 0.06)',
    color: '#00F2FE',
    borderLeft: '3px solid #00F2FE',
    borderTopLeftRadius: '0px',
    borderBottomLeftRadius: '0px',
  },
  userProfile: {
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    paddingTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  userAvatarContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    maxWidth: '160px',
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#F3F4F6',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  roleBadge: {
    fontSize: '10px',
    padding: '2px 8px',
    alignSelf: 'flex-start',
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px',
    width: '100%',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    border: '1px solid rgba(239, 68, 68, 0.15)',
    borderRadius: '10px',
    color: '#EF4444',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};

export default Sidebar;
