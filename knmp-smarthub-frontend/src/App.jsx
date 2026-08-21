import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAppStore from './store/useAppStore';

// Components & Layout
import Sidebar from './components/Sidebar';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import GISMap from './pages/GISMap';
import Rankings from './pages/Rankings';
import KNMPDetail from './pages/KNMPDetail';
import OperationalInput from './pages/OperationalInput';
import AdminPanel from './pages/AdminPanel';
import ActivityHistory from './pages/ActivityHistory';

// Layout Utama (Sidebar + Konten Utama)
const AppLayout = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <Outlet />
    </div>
  );
};

// Route Guard untuk Halaman Terproteksi
const ProtectedRoute = () => {
  const { isAuthenticated } = useAppStore();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  const { theme } = useAppStore();

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#0F131D',
            color: '#F3F4F6',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            fontFamily: "'Inter', sans-serif",
            fontSize: '13px',
          },
          success: {
            iconTheme: {
              primary: '#00F2FE',
              secondary: '#080B11',
            },
          },
        }}
      />
      
      <Routes>
        {/* Route Login (Bisa diakses tanpa login) */}
        <Route path="/login" element={<Login />} />

        {/* Route Terproteksi (Wajib Login) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/map" element={<GISMap />} />
            <Route path="/priorities" element={<Rankings />} />
            <Route path="/knmp/:id" element={<KNMPDetail />} />
            <Route path="/input" element={<OperationalInput />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/history" element={<ActivityHistory />} />
          </Route>
        </Route>

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
