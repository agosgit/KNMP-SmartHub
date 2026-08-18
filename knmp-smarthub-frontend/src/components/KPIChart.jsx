import React from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';

const KPIChart = ({ data }) => {
  // Model data yang diharapkan dari props:
  // [
  //   { subject: 'Produksi', A: 82, fullMark: 100 },
  //   { subject: 'Distribusi', A: 75, fullMark: 100 },
  //   ...
  // ]

  // Custom Tooltip yang cocok dengan tema gelap glassmorphism
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={styles.tooltip}>
          <p style={styles.tooltipLabel}>{payload[0].payload.subject}</p>
          <p style={styles.tooltipValue}>Skor: <span style={styles.highlight}>{payload[0].value}</span> / 100</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card" style={styles.card}>
      <h3 style={styles.title}>Profil Kinerja KPI (Radar)</h3>
      <p style={styles.subtitle}>Batas kelayakan minimal: 60</p>

      <div style={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={260}>
          <RadarChart cx="50%" cy="50%" r="80%" data={data}>
            <PolarGrid stroke="var(--border-color)" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 500 }}
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 100]} 
              tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
              stroke="var(--border-color)"
            />
            <Radar
              name="Skor KPI"
              dataKey="A"
              stroke="var(--color-primary)"
              fill="var(--color-primary)"
              fillOpacity={0.2}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  title: {
    fontSize: '16px',
    color: 'var(--text-primary)',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginBottom: '16px',
  },
  chartContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tooltip: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    padding: '10px 14px',
    borderRadius: '10px',
    boxShadow: '0 10px 20px -5px rgba(0,0,0,0.5)',
  },
  tooltipLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '4px',
  },
  tooltipValue: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
  },
  highlight: {
    color: 'var(--color-primary)',
    fontWeight: '700',
  },
};

export default KPIChart;
