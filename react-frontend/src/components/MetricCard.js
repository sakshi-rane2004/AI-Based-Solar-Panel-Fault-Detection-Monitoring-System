import React from 'react';

const MetricCard = ({ 
  title, 
  value, 
  unit = '', 
  icon, 
  trend = null, 
  color = 'primary',
  loading = false 
}) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend > 0) return '📈';
    if (trend < 0) return '📉';
    return '➡️';
  };

  const getTrendColor = () => {
    if (!trend) return '#666';
    if (trend > 0) return '#28a745';
    if (trend < 0) return '#dc3545';
    return '#666';
  };

  return (
    <div className={`metric-card metric-card-${color}`}>
      <div className="metric-card-header">
        <div className="metric-card-icon">{icon}</div>
        {trend !== null && (
          <div className="metric-card-trend" style={{ color: getTrendColor() }}>
            {getTrendIcon()}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      
      <div className="metric-card-content">
        <div className="metric-card-value">
          {loading ? (
            <div className="metric-loading">...</div>
          ) : (
            <>
              {value}
              {unit && <span className="metric-card-unit">{unit}</span>}
            </>
          )}
        </div>
        <div className="metric-card-title">{title}</div>
      </div>
    </div>
  );
};

export default MetricCard;