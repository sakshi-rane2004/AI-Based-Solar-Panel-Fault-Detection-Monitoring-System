import React, { useState, useEffect } from 'react';
import { alertAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import SeverityBadge from '../components/SeverityBadge';

const Alerts = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');
  const [stats, setStats] = useState({
    critical: 0,
    high: 0,
    medium: 0,
    unacknowledged: 0
  });

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await alertAPI.getAllAlerts();
      setAlerts(data);
      setFilteredAlerts(data);
      calculateStats(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const calculateStats = (alertsData) => {
    const critical = alertsData.filter(a => a.severity === 'CRITICAL').length;
    const high = alertsData.filter(a => a.severity === 'HIGH').length;
    const medium = alertsData.filter(a => a.severity === 'MEDIUM').length;
    const unacknowledged = alertsData.filter(a => !a.acknowledged).length;
    setStats({ critical, high, medium, unacknowledged });
  };

  useEffect(() => {
    fetchAlerts();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = [...alerts];

    // Filter by severity
    if (filterSeverity !== 'all') {
      filtered = filtered.filter(alert => alert.severity === filterSeverity);
    }

    // Filter by status
    if (filterStatus === 'unacknowledged') {
      filtered = filtered.filter(alert => !alert.acknowledged);
    } else if (filterStatus === 'acknowledged') {
      filtered = filtered.filter(alert => alert.acknowledged);
    } else if (filterStatus !== 'all') {
      filtered = filtered.filter(alert => alert.status === filterStatus.toUpperCase());
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'timestamp') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'severity') {
        const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      } else if (sortBy === 'panel') {
        return a.panelId.localeCompare(b.panelId);
      } else if (sortBy === 'fault_type') {
        return a.faultType.localeCompare(b.faultType);
      }
      return 0;
    });

    setFilteredAlerts(filtered);
  }, [alerts, filterSeverity, filterStatus, sortBy]);

  const handleAcknowledge = async (alertId) => {
    try {
      await alertAPI.acknowledgeAlert(alertId, 1);
      fetchAlerts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusUpdate = async (alertId, newStatus) => {
    try {
      await alertAPI.updateAlertStatus(alertId, newStatus, 1);
      fetchAlerts();
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return <LoadingSpinner message="Loading alerts..." />;
  }

  return (
    <div className="alerts-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">System Alerts</h1>
          <p className="page-subtitle">
            Monitor and manage system alerts and fault notifications
          </p>
        </div>
        
        <div className="page-actions">
          <button className="btn btn-primary" onClick={fetchAlerts}>
            ↻ Refresh Alerts
          </button>
        </div>
      </div>

      <ErrorAlert error={error} />

      <div className="alerts-controls">
        <div className="alerts-filters">
          <div className="filter-group">
            <label>Severity:</label>
            <select 
              value={filterSeverity} 
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Status:</label>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Alerts</option>
              <option value="unacknowledged">Unacknowledged</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Sort by:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="timestamp">Timestamp</option>
              <option value="severity">Severity</option>
              <option value="panel">Panel ID</option>
              <option value="fault_type">Fault Type</option>
            </select>
          </div>
        </div>
      </div>

      <div className="alerts-overview">
        <div className="alert-summary-card critical">
          <div className="summary-icon">⚠</div>
          <div className="summary-content">
            <div className="summary-number">{stats.critical}</div>
            <div className="summary-label">Critical Alerts</div>
            <div className="summary-description">Require immediate attention</div>
          </div>
        </div>
        
        <div className="alert-summary-card high">
          <div className="summary-icon">!</div>
          <div className="summary-content">
            <div className="summary-number">{stats.high}</div>
            <div className="summary-label">High Priority</div>
            <div className="summary-description">Action needed soon</div>
          </div>
        </div>
        
        <div className="alert-summary-card medium">
          <div className="summary-icon">●</div>
          <div className="summary-content">
            <div className="summary-number">{stats.medium}</div>
            <div className="summary-label">Medium Priority</div>
            <div className="summary-description">Monitor closely</div>
          </div>
        </div>
        
        <div className="alert-summary-card unack">
          <div className="summary-icon">○</div>
          <div className="summary-content">
            <div className="summary-number">{stats.unacknowledged}</div>
            <div className="summary-label">Unacknowledged</div>
            <div className="summary-description">Need acknowledgment</div>
          </div>
        </div>
      </div>

      <div className="alerts-content">
        <div className="alerts-main">
          {filteredAlerts.length === 0 ? (
            <div className="alerts-empty">
              <div className="empty-icon">✓</div>
              <h3>No alerts found</h3>
              <p>All systems are operating normally</p>
            </div>
          ) : (
            <div className="alerts-list">
              {filteredAlerts.map((alert) => (
                <div key={alert.id} className={`alert-item ${alert.severity.toLowerCase()}`}>
                  <div className="alert-header">
                    <div className="alert-title-section">
                      <h3 className="alert-panel-id">{alert.panelId}</h3>
                      <SeverityBadge severity={alert.severity} />
                      <span className={`status-badge ${alert.status.toLowerCase()}`}>
                        {alert.status}
                      </span>
                    </div>
                    <div className="alert-actions">
                      {!alert.acknowledged && (
                        <button 
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleAcknowledge(alert.id)}
                        >
                          ✓ Acknowledge
                        </button>
                      )}
                      {alert.status === 'OPEN' && (
                        <button 
                          className="btn btn-sm btn-warning"
                          onClick={() => handleStatusUpdate(alert.id, 'IN_PROGRESS')}
                        >
                          → In Progress
                        </button>
                      )}
                      {alert.status === 'IN_PROGRESS' && (
                        <button 
                          className="btn btn-sm btn-success"
                          onClick={() => handleStatusUpdate(alert.id, 'RESOLVED')}
                        >
                          ✓ Resolve
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="alert-body">
                    <div className="alert-fault-type">
                      <strong>Fault Type:</strong> {alert.faultType}
                    </div>
                    <div className="alert-message">{alert.message}</div>
                    <div className="alert-confidence">
                      <strong>Confidence:</strong> {alert.confidence} ({(alert.confidenceScore * 100).toFixed(1)}%)
                    </div>
                  </div>
                  
                  <div className="alert-footer">
                    <div className="alert-timestamp">
                      <strong>Created:</strong> {formatDate(alert.createdAt)}
                    </div>
                    {alert.resolvedAt && (
                      <div className="alert-resolved">
                        <strong>Resolved:</strong> {formatDate(alert.resolvedAt)}
                      </div>
                    )}
                    {alert.acknowledged && (
                      <div className="alert-ack">
                        ✓ Acknowledged at {formatDate(alert.acknowledgedAt)}
                      </div>
                    )}
                  </div>
                  
                  {alert.technicianNotes && (
                    <div className="alert-notes">
                      <strong>Technician Notes:</strong> {alert.technicianNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alerts;
