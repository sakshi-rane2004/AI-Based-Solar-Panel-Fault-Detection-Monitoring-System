import { useState, useEffect } from 'react';
import { solarPanelAPI } from '../services/api';

const AlertsList = ({ limit = 10 }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const generateAlerts = async () => {
      try {
        setLoading(true);
        
        let alertsData;
        try {
          // Try to fetch real data first
          const history = await solarPanelAPI.getHistory({ limit: 50 });
          
          // Convert predictions to alerts
          alertsData = history
            .filter(prediction => prediction.predictedFault !== 'NORMAL')
            .map((prediction, index) => ({
              id: `alert-${prediction.id || index}`,
              panelId: `P${String((index % 24) + 1).padStart(3, '0')}`,
              severity: prediction.severity || 'MEDIUM',
              faultType: prediction.predictedFault,
              message: generateAlertMessage(prediction.predictedFault, prediction.severity),
              timestamp: prediction.timestamp || new Date(Date.now() - Math.random() * 86400000).toISOString(),
              acknowledged: Math.random() < 0.3,
              confidence: prediction.confidence || 'MEDIUM'
            }))
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit);
        } catch (apiError) {
          console.warn('Backend API not available, using mock alerts:', apiError.message);
          
          // Generate mock alerts data
          alertsData = Array.from({ length: limit }, (_, index) => ({
            id: `alert-${index}`,
            panelId: `P${String((index % 24) + 1).padStart(3, '0')}`,
            severity: ['CRITICAL', 'HIGH', 'MEDIUM'][Math.floor(Math.random() * 3)],
            faultType: ['INVERTER_FAULT', 'PARTIAL_SHADING', 'PANEL_DEGRADATION', 'DUST_ACCUMULATION'][Math.floor(Math.random() * 4)],
            message: 'System detected anomaly in panel operation',
            timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
            acknowledged: Math.random() < 0.3,
            confidence: ['HIGH', 'MEDIUM', 'LOW'][Math.floor(Math.random() * 3)]
          }));
          
          // Generate proper messages for mock data
          alertsData = alertsData.map(alert => ({
            ...alert,
            message: generateAlertMessage(alert.faultType, alert.severity)
          }));
        }

        setAlerts(alertsData);
      } catch (error) {
        console.error('Error loading alerts:', error);
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };

    generateAlerts();
    
    // Refresh every 60 seconds
    const interval = setInterval(generateAlerts, 60000);
    return () => clearInterval(interval);
  }, [limit]);

  const generateAlertMessage = (faultType, severity) => {
    const messages = {
      'INVERTER_FAULT': {
        'CRITICAL': 'Inverter failure detected - immediate attention required',
        'HIGH': 'Inverter performance degraded - maintenance recommended',
        'MEDIUM': 'Inverter anomaly detected - monitor closely'
      },
      'PARTIAL_SHADING': {
        'CRITICAL': 'Severe shading affecting power output',
        'HIGH': 'Significant shading detected',
        'MEDIUM': 'Partial shading observed'
      },
      'PANEL_DEGRADATION': {
        'CRITICAL': 'Critical panel degradation - replacement needed',
        'HIGH': 'Significant panel degradation detected',
        'MEDIUM': 'Panel performance decline observed'
      },
      'DUST_ACCUMULATION': {
        'CRITICAL': 'Heavy dust accumulation - cleaning required',
        'HIGH': 'Dust buildup affecting efficiency',
        'MEDIUM': 'Dust accumulation detected'
      }
    };

    return messages[faultType]?.[severity] || 'System anomaly detected';
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL': return '#dc3545';
      case 'HIGH': return '#fd7e14';
      case 'MEDIUM': return '#ffc107';
      case 'LOW': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'CRITICAL': return '⚠';  // Warning triangle
      case 'HIGH': return '!';      // Exclamation mark
      case 'MEDIUM': return '●';    // Solid circle
      case 'LOW': return 'i';       // Info letter
      default: return '?';          // Question mark
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'unacknowledged') return !alert.acknowledged;
    return alert.severity === filter;
  });

  const acknowledgeAlert = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  if (loading) {
    return (
      <div className="alerts-loading">
        <div className="loading-spinner"></div>
        <p>Loading alerts...</p>
      </div>
    );
  }

  return (
    <div className="alerts-container">
      <div className="alerts-header">
        <h3>System Alerts</h3>
        <div className="alerts-filters">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="alerts-filter-select"
          >
            <option value="all">All Alerts</option>
            <option value="unacknowledged">Unacknowledged</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
          </select>
        </div>
      </div>

      <div className="alerts-summary">
        <div className="alert-count critical">
          <span className="count">{alerts.filter(a => a.severity === 'CRITICAL').length}</span>
          <span className="label">Critical</span>
        </div>
        <div className="alert-count high">
          <span className="count">{alerts.filter(a => a.severity === 'HIGH').length}</span>
          <span className="label">High</span>
        </div>
        <div className="alert-count medium">
          <span className="count">{alerts.filter(a => a.severity === 'MEDIUM').length}</span>
          <span className="label">Medium</span>
        </div>
        <div className="alert-count unack">
          <span className="count">{alerts.filter(a => !a.acknowledged).length}</span>
          <span className="label">Unack.</span>
        </div>
      </div>

      <div className="alerts-list">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`alert-item ${alert.severity.toLowerCase()} ${alert.acknowledged ? 'acknowledged' : ''}`}
            >
              <div className="alert-icon">
                {getSeverityIcon(alert.severity)}
              </div>
              
              <div className="alert-content">
                <div className="alert-header">
                  <span className="alert-panel">{alert.panelId}</span>
                  <span className="alert-fault-type">{alert.faultType}</span>
                  <span 
                    className="alert-severity"
                  >
                    {alert.severity}
                  </span>
                </div>
                
                <div className="alert-message">
                  {alert.message}
                </div>
                
                <div className="alert-footer">
                  <span className="alert-timestamp">
                    {new Date(alert.timestamp).toLocaleString()}
                  </span>
                  <span className="alert-confidence">
                    Confidence: {alert.confidence}
                  </span>
                </div>
              </div>
              
              <div className="alert-actions">
                {!alert.acknowledged && (
                  <button 
                    className="alert-ack-btn"
                    onClick={() => acknowledgeAlert(alert.id)}
                    title="Acknowledge alert"
                  >
                    ✓
                  </button>
                )}
                {alert.acknowledged && (
                  <span className="alert-ack-status" title="Acknowledged">
                    ✓
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="alerts-empty">
            <div className="alerts-empty-icon">✓</div>
            <h4>No alerts found</h4>
            <p>All systems are operating normally</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsList;