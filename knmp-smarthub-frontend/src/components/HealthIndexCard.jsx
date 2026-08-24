import React from 'react';

const HealthIndexCard = ({ score, status, title = 'KNMP Health Index' }) => {
  // Tentukan warna utama berdasarkan status (4 Kategori sesuai Proposal: Sangat Baik, Baik, Perlu Perhatian, Kritis)
  const getColorScheme = (statusName) => {
    switch (statusName) {
      case 'SANGAT_BAIK':
        return { text: '#10B981', border: 'rgba(16, 185, 129, 0.2)', bg: 'rgba(16, 185, 129, 0.05)', shadow: 'rgba(16, 185, 129, 0.15)' };
      case 'BAIK':
        return { text: '#34D399', border: 'rgba(52, 211, 153, 0.2)', bg: 'rgba(52, 211, 153, 0.05)', shadow: 'rgba(52, 211, 153, 0.1)' };
      case 'PERLU_PERHATIAN':
        return { text: '#F5AF19', border: 'rgba(245, 175, 25, 0.2)', bg: 'rgba(245, 175, 25, 0.05)', shadow: 'rgba(245, 175, 25, 0.15)' };
      case 'KRITIS':
      default:
        return { text: '#EF4444', border: 'rgba(239, 68, 68, 0.2)', bg: 'rgba(239, 68, 68, 0.05)', shadow: 'rgba(239, 68, 68, 0.2)' };
    }
  };

  const scheme = getColorScheme(status);
  const formattedStatus = status ? status.replace('_', ' ') : 'BAIK';

  // Perhitungan lingkaran SVG
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="glass-card" style={{ ...styles.card, borderColor: scheme.border, boxShadow: `0 0 20px 0 ${scheme.shadow}` }}>
      <div style={styles.cardHeader}>
        <h3 style={styles.cardTitle}>{title}</h3>
        <span className={`status-badge ${status ? status.toLowerCase().replace('_', '-') : 'moderat'}`}>
          {formattedStatus}
        </span>
      </div>

      <div style={styles.cardContent}>
        {/* Radial Progress SVG */}
        <div style={styles.svgContainer}>
          <svg width="140" height="140" viewBox="0 0 120 120">
            {/* Background Circle */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="transparent"
              stroke="var(--bg-secondary)"
              strokeWidth="10"
            />
            {/* Colored Active Circle */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="transparent"
              stroke={scheme.text}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              style={styles.circleProgress}
            />
          </svg>
          {/* Centered Score Label */}
          <div style={styles.scoreTextContainer}>
            <span style={{ ...styles.scoreVal, color: scheme.text }}>{score}</span>
            <span style={styles.scoreMax}>/100</span>
          </div>
        </div>

        {/* Status descriptions */}
        <div style={styles.statusDescription}>
          <p style={styles.statusLabel}>Tingkat Kesehatan Program</p>
          <h4 style={{ ...styles.statusValue, color: scheme.text }}>{formattedStatus}</h4>
          <p style={styles.infoText}>
            Health Index dihitung secara dinamis dari agregasi berbobot 6 kriteria kinerja utama KNMP.
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: '16px',
    color: 'var(--text-primary)',
  },
  cardContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  },
  svgContainer: {
    position: 'relative',
    display: 'inline-flex',
  },
  circleProgress: {
    transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  scoreTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreVal: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '32px',
    fontWeight: '800',
    lineHeight: '1',
  },
  scoreMax: {
    fontSize: '10px',
    color: 'var(--text-secondary)',
    marginTop: '2px',
    fontWeight: '600',
  },
  statusDescription: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statusLabel: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    fontWeight: '500',
  },
  statusValue: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '22px',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  infoText: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    lineHeight: '1.4',
    marginTop: '6px',
  },
};

export default HealthIndexCard;
