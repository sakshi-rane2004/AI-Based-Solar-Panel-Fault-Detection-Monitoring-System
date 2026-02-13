import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import MetricCard from '../components/MetricCard';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardAPI.getStats();
      setStats(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Solar Panel Monitoring Dashboard</h1>
          <p>Real-time system overview and performance metrics</p>
        </div>
        <div className="dashboard-status">
          <div className="status-indicator online">
            <div className="status-dot"></div>
            <span>System Online</span>
          </div>
        </div>
      </div>

      <ErrorAlert error={error} />

      <div className="dashboard-content">
        {/* System Overview */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>System Overview</h2>
          </div>
          <div className="metrics-grid">
            <MetricCard
              title="Total Plants"
              value={stats?.totalPlants || 0}
              unit=""
              trend="stable"
              icon="🏭"
            />
            <MetricCard
              title="Total Panels"
              value={stats?.totalPanels || 0}
              unit=""
              trend="stable"
              icon="☀️"
            />
            <MetricCard
              title="Active Panels"
              value={stats?.activePanels || 0}
              unit=""
              trend="up"
              icon="✅"
            />
            <MetricCard
              title="Maintenance"
              value={stats?.maintenancePanels || 0}
              unit=""
              trend="stable"
              icon="🔧"
            />
          </div>
        </div>

        {/* Alert Statistics */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Alert Statistics</h2>
          </div>
          <div className="metrics-grid">
            <MetricCard
              title="Total Alerts"
              value={stats?.totalAlerts || 0}
              unit=""
              trend="stable"
              icon="🚨"
            />
            <MetricCard
              title="Critical"
              value={stats?.criticalAlerts || 0}
              unit=""
              trend="down"
              icon="⚠️"
            />
            <MetricCard
              title="High Priority"
              value={stats?.highAlerts || 0}
              unit=""
              trend="stable"
              icon="❗"
            />
            <MetricCard
              title="Open Alerts"
              value={stats?.openAlerts || 0}
              unit=""
              trend="stable"
              icon="📋"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="quick-actions-grid">
            <Link to="/plant-management" className="quick-action-card">
              <div className="quick-action-icon">🏭</div>
              <div className="quick-action-content">
                <h4>Manage Plants</h4>
                <p>Add and configure solar plants</p>
              </div>
            </Link>
            
            <Link to="/panel-management" className="quick-action-card">
              <div className="quick-action-icon">☀️</div>
              <div className="quick-action-content">
                <h4>Manage Panels</h4>
                <p>Configure solar panels</p>
              </div>
            </Link>
            
            <Link to="/alerts" className="quick-action-card">
              <div className="quick-action-icon">🚨</div>
              <div className="quick-action-content">
                <h4>View Alerts</h4>
                <p>Check system alerts</p>
              </div>
            </Link>
            
            <Link to="/analyze" className="quick-action-card">
              <div className="quick-action-icon">🔍</div>
              <div className="quick-action-content">
                <h4>Analyze</h4>
                <p>Run fault detection</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
