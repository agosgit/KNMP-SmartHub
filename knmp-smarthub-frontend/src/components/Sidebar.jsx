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
  Anchor,
  X
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout, isSidebarOpen, closeSidebar } = useAppStore();
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
    <>
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={closeSidebar} 
          aria-hidden="true"
        />
      )}

      <aside className={`app-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        {/* Brand Header with Mobile Close Button */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-content">
            <Anchor size={28} color="var(--color-primary)" />
            <span className="sidebar-brand-text">
              KNMP <span className="sidebar-brand-highlight">SmartHub</span>
            </span>
          </div>

          {/* Close Button for Mobile */}
          <button 
            className="sidebar-close-btn" 
            onClick={closeSidebar}
            aria-label="Tutup Menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={({ isActive }) => 
                `sidebar-nav-link ${isActive ? 'active' : ''}`
              }
            >
              {({ isActive }) => {
                const Icon = item.icon;
                return (
                  <>
                    <Icon size={20} color={isActive ? 'var(--color-primary)' : 'var(--text-secondary)'} />
                    <span>{item.name}</span>
                  </>
                );
              }}
            </NavLink>
          ))}
        </nav>

        {/* User Info / Profile Section */}
        {user && (
          <div className="sidebar-user-profile">
            <div className="sidebar-user-avatar-row">
              <div className="sidebar-avatar">
                <UserIcon size={20} color="var(--text-primary)" />
              </div>
              <div className="sidebar-user-info">
                <span className="sidebar-user-name">{user.name}</span>
                <span className="sidebar-agency-name">
                  {user.knmp ? `Wilayah: ${user.knmp.name}` : 'Pusat / Nasional'}
                </span>
                <span className={`status-badge ${user.role.toLowerCase()}`}>
                  {user.role}
                </span>
              </div>
            </div>

            <button onClick={handleLogout} className="sidebar-logout-btn">
              <LogOut size={16} />
              <span>Keluar</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
