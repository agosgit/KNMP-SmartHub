import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Loader2, Navigation, Info } from 'lucide-react';
import toast from 'react-hot-toast';

// Tambahkan CSS Keyframe ke DOM untuk animasi berkedip (pulsing) marker peta
const style = document.createElement('style');
style.innerHTML = `
  @keyframes pulse-marker {
    0% { transform: scale(0.9); opacity: 0.9; }
    50% { transform: scale(1.1); opacity: 1; box-shadow: 0 0 12px var(--glow); }
    100% { transform: scale(0.9); opacity: 0.9; }
  }
  .custom-gps-marker {
    background: transparent;
    border: none;
  }
`;
document.head.appendChild(style);

const createCustomMarker = (status) => {
  let color = '#10B981'; // Green (Normal)
  let glow = 'rgba(16, 185, 129, 0.5)';
  if (status === 'WARNING') {
    color = '#F5AF19'; // Yellow (Warning)
    glow = 'rgba(245, 175, 25, 0.5)';
  } else if (status === 'CRITICAL' || status === 'SANGAT_URGENT') {
    color = '#EF4444'; // Red (Critical)
    glow = 'rgba(239, 68, 68, 0.5)';
  }

  return L.divIcon({
    className: 'custom-gps-marker',
    html: `<div style="
      width: 16px;
      height: 16px;
      background-color: ${color};
      border: 2px solid #F3F4F6;
      border-radius: 50%;
      box-shadow: 0 0 0 4px ${glow};
      --glow: ${glow};
      animation: pulse-marker 2s infinite ease-in-out;
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

const GISMap = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Posisi tengah Indonesia (default map center)
  const centerPosition = [-2.5489, 118.0149];
  const zoomLevel = 5;

  useEffect(() => {
    const fetchMapLocations = async () => {
      try {
        const response = await API.get('/dashboard/map');
        setLocations(response.data);
      } catch (error) {
        toast.error('Gagal mengambil data peta lokasi.');
      } finally {
        setLoading(false);
      }
    };
    fetchMapLocations();
  }, []);

  return (
    <div className="main-content">
      {/* Navbar */}
      <Navbar title="Peta Sebaran GIS" />

      {/* Map Control Info Info */}
      <div className="glass-card" style={styles.infoBanner}>
        <div style={styles.infoHeader}>
          <Info size={18} color="#00F2FE" />
          <span style={styles.infoTitle}>Legenda Status Kesehatan KNMP:</span>
        </div>
        <div style={styles.legendContainer}>
          <div style={styles.legendItem}>
            <div style={{ ...styles.dot, backgroundColor: '#10B981', boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)' }}></div>
            <span style={styles.legendLabel}>Normal / Baik (HI &ge; 60)</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{ ...styles.dot, backgroundColor: '#F5AF19', boxShadow: '0 0 8px rgba(245, 175, 25, 0.5)' }}></div>
            <span style={styles.legendLabel}>Warning / Rawan (HI 40 - 59)</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{ ...styles.dot, backgroundColor: '#EF4444', boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)' }}></div>
            <span style={styles.legendLabel}>Kritis / Urgent (HI &lt; 40)</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="glass-card" style={styles.mapCard}>
        {loading ? (
          <div style={styles.mapLoading}>
            <Loader2 className="animate-spin" size={32} color="#00F2FE" />
            <span style={styles.loadingText}>Menyiapkan Sistem Peta Nasional...</span>
          </div>
        ) : (
          <div style={styles.mapWrapper}>
            <MapContainer 
              center={centerPosition} 
              zoom={zoomLevel} 
              style={{ height: '560px', width: '100%' }}
              zoomControl={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {locations.map((loc) => (
                <Marker 
                  key={loc.id} 
                  position={[loc.latitude, loc.longitude]}
                  icon={createCustomMarker(loc.status)}
                >
                  <Popup>
                    <div style={styles.popupContent}>
                      <h4 style={styles.popupTitle}>{loc.name}</h4>
                      <p style={styles.popupRegion}>{loc.region}</p>
                      
                      <div style={styles.popupMetrics}>
                        <div style={styles.metricRow}>
                          <span style={styles.metricLabel}>Health Index:</span>
                          <span style={{ 
                            ...styles.metricValue, 
                            color: loc.healthIndex >= 80 ? '#10B981' : (loc.healthIndex >= 60 ? '#4FACFE' : (loc.healthIndex >= 40 ? '#F5AF19' : '#EF4444'))
                          }}>
                            {loc.healthIndex}
                          </span>
                        </div>
                        <div style={styles.metricRow}>
                          <span style={styles.metricLabel}>Status:</span>
                          <span className={`status-badge ${loc.status.toLowerCase().replace('_', '-')}`} style={styles.popupBadge}>
                            {loc.healthStatus.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      <button 
                        onClick={() => navigate(`/knmp/${loc.id}`)}
                        className="btn-primary" 
                        style={styles.popupBtn}
                      >
                        <Navigation size={12} />
                        <span>Buka Analitik</span>
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  infoBanner: {
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
  },
  infoHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  infoTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  legendContainer: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  legendLabel: {
    fontSize: '13px',
    color: '#9CA3AF',
    fontWeight: '500',
  },
  mapCard: {
    padding: '0px',
    overflow: 'hidden',
  },
  mapLoading: {
    height: '560px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    color: '#9CA3AF',
  },
  loadingText: {
    fontSize: '14px',
    fontWeight: '500',
  },
  mapWrapper: {
    height: '560px',
    width: '100%',
  },
  popupContent: {
    padding: '4px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    minWidth: '200px',
  },
  popupTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#F3F4F6',
    margin: '0',
  },
  popupRegion: {
    fontSize: '11px',
    color: '#9CA3AF',
    margin: '0',
    marginTop: '-4px',
  },
  popupMetrics: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '8px 0',
  },
  metricRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: '12px',
    color: '#9CA3AF',
  },
  metricValue: {
    fontSize: '12px',
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  popupBadge: {
    fontSize: '10px',
    padding: '2px 8px',
  },
  popupBtn: {
    width: '100%',
    height: '34px',
    fontSize: '12px',
    padding: '0',
  },
};

export default GISMap;
