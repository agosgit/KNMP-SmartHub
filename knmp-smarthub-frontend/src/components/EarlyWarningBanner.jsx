import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, BellRing } from 'lucide-react';

const EarlyWarningBanner = ({ warnings }) => {
  const [expanded, setExpanded] = useState(false);

  if (!warnings || warnings.length === 0) return null;

  // Hitung berapa yang kritis & warning
  const criticalCount = warnings.filter(w => w.healthIndex < 40 || w.kpiWarnings?.some(k => k.score < 40)).length;
  const totalWarnings = warnings.length;

  return (
    <div style={{
      ...styles.banner,
      borderColor: criticalCount > 0 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 175, 25, 0.3)',
      background: criticalCount > 0 
        ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(239, 68, 68, 0.02))' 
        : 'linear-gradient(135deg, rgba(245, 175, 25, 0.08), rgba(245, 175, 25, 0.02))',
    }}>
      {/* Summary Header */}
      <div style={styles.header}>
        <div style={styles.summaryLeft}>
          <div style={{
            ...styles.iconContainer,
            backgroundColor: criticalCount > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 175, 25, 0.15)'
          }}>
            <BellRing size={20} color={criticalCount > 0 ? '#EF4444' : '#F5AF19'} />
          </div>
          <div>
            <h4 style={styles.headline}>
              {criticalCount > 0 
                ? `${criticalCount} Lokasi KNMP Berstatus Kritis (Butuh Intervensi Darurat!)` 
                : 'Peringatan Dini Sistem (Early Warning)'}
            </h4>
            <p style={styles.subtext}>
              Terdeteksi {totalWarnings} lokasi dengan indikator kinerja di bawah batas kelayakan minimal (60).
            </p>
          </div>
        </div>

        <button onClick={() => setExpanded(!expanded)} style={styles.toggleBtn}>
          <span>{expanded ? 'Sembunyikan Detail' : 'Lihat Detail'}</span>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Expanded Details List */}
      {expanded && (
        <div style={styles.detailsList}>
          {warnings.map((item) => (
            <div key={item.knmpId} style={styles.warningItem}>
              <div style={styles.itemHeader}>
                <div style={styles.itemTitleGroup}>
                  <AlertTriangle size={16} color={item.healthIndex < 40 ? '#EF4444' : '#F5AF19'} />
                  <span style={styles.itemKnmpName}>{item.knmpName}</span>
                </div>
                <span className={`status-badge ${item.status.toLowerCase().replace('_', '-')}`} style={styles.itemBadge}>
                  Health Index: {item.healthIndex}
                </span>
              </div>

              {/* KPI Warnings */}
              {item.kpiWarnings && item.kpiWarnings.length > 0 && (
                <div style={styles.kpiList}>
                  <span style={styles.kpiListLabel}>Indikator Bermasalah:</span>
                  <div style={styles.kpiBadges}>
                    {item.kpiWarnings.map(kpi => (
                      <span key={kpi.kpiKey} style={{
                        ...styles.kpiBadge,
                        color: kpi.score < 40 ? '#EF4444' : '#F5AF19',
                        borderColor: kpi.score < 40 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 175, 25, 0.2)',
                        backgroundColor: kpi.score < 40 ? 'rgba(239, 68, 68, 0.05)' : 'rgba(245, 175, 25, 0.05)'
                      }}>
                        {kpi.kpiName} ({kpi.score})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Manual Reports */}
              {item.manualReports && item.manualReports.length > 0 && (
                <div style={styles.reportsList}>
                  <span style={styles.kpiListLabel}>Laporan Kendala Lapangan:</span>
                  <ul style={styles.reportUl}>
                    {item.manualReports.map(report => (
                      <li key={report.id} style={styles.reportLi}>
                        <strong style={styles.reportTitle}>{report.title}</strong> — {report.notes}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  banner: {
    border: '1px solid',
    borderRadius: '16px',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
  },
  summaryLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  iconContainer: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headline: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  subtext: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    marginTop: '2px',
  },
  toggleBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '12px',
    fontWeight: '600',
    padding: '8px 14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  detailsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '16px',
  },
  warningItem: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '14px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  itemKnmpName: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  itemBadge: {
    fontSize: '11px',
    padding: '4px 10px',
  },
  kpiList: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  kpiListLabel: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    fontWeight: '500',
  },
  kpiBadges: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  kpiBadge: {
    fontSize: '11px',
    fontWeight: '600',
    padding: '2px 8px',
    borderRadius: '6px',
    border: '1px solid',
  },
  reportsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    borderTop: '1px solid rgba(255, 255, 255, 0.03)',
    paddingTop: '8px',
  },
  reportUl: {
    listStyleType: 'none',
    paddingLeft: '0',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  reportLi: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
  },
  reportTitle: {
    color: 'var(--text-primary)',
  },
};

export default EarlyWarningBanner;
