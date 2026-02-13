import React, { useState } from 'react';
import PanelGrid from '../components/PanelGrid';
import LoadingSpinner from '../components/LoadingSpinner';

const Panels = () => {
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterStatus, setFilterStatus] = useState('all');

  const handlePanelClick = (panel) => {
    setSelectedPanel(panel);
  };

  return (
    <div className="panels-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Solar Panel Overview</h1>
          <p className="page-subtitle">
            Monitor individual panel performance and health status
          </p>
        </div>
        
        <div className="page-actions">
          <div className="view-controls">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              ⊞
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              ☰
            </button>
          </div>
          
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Panels</option>
            <option value="healthy">Healthy Only</option>
            <option value="warning">Warning Status</option>
            <option value="critical">Critical Status</option>
          </select>
        </div>
      </div>

      <div className="panels-stats">
        <div className="panel-stat">
          <div className="stat-icon healthy">✅</div>
          <div className="stat-content">
            <div className="stat-number">18</div>
            <div className="stat-label">Healthy</div>
          </div>
        </div>
        
        <div className="panel-stat">
          <div className="stat-icon warning">⚠️</div>
          <div className="stat-content">
            <div className="stat-number">4</div>
            <div className="stat-label">Warning</div>
          </div>
        </div>
        
        <div className="panel-stat">
          <div className="stat-icon critical">🚨</div>
          <div className="stat-content">
            <div className="stat-number">2</div>
            <div className="stat-label">Critical</div>
          </div>
        </div>
        
        <div className="panel-stat">
          <div className="stat-icon total">📊</div>
          <div className="stat-content">
            <div className="stat-number">6.0</div>
            <div className="stat-label">Total kW</div>
          </div>
        </div>
      </div>

      <div className="panels-content">
        {viewMode === 'grid' ? (
          <PanelGrid onPanelClick={handlePanelClick} />
        ) : (
          <div className="panels-list-view">
            <div className="panels-table">
              <div className="table-header">
                <div className="table-cell">Panel ID</div>
                <div className="table-cell">Status</div>
                <div className="table-cell">Power (W)</div>
                <div className="table-cell">Voltage (V)</div>
                <div className="table-cell">Current (A)</div>
                <div className="table-cell">Temperature (°C)</div>
                <div className="table-cell">Efficiency (%)</div>
                <div className="table-cell">Last Update</div>
              </div>
              
              {/* This would be populated with actual panel data */}
              <div className="table-loading">
                <LoadingSpinner message="Loading panel list..." />
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedPanel && (
        <div className="panel-details-sidebar">
          <div className="panel-details-header">
            <h3>Panel {selectedPanel.id}</h3>
            <button 
              className="close-btn"
              onClick={() => setSelectedPanel(null)}
            >
              ✕
            </button>
          </div>
          
          <div className="panel-details-content">
            <div className="detail-section">
              <h4>Current Status</h4>
              <div className={`status-badge ${selectedPanel.health}`}>
                {selectedPanel.health.toUpperCase()}
              </div>
            </div>
            
            <div className="detail-section">
              <h4>Performance Metrics</h4>
              <div className="metrics-list">
                <div className="metric-item">
                  <span>Power Output</span>
                  <span>{selectedPanel.power}W</span>
                </div>
                <div className="metric-item">
                  <span>Voltage</span>
                  <span>{selectedPanel.voltage}V</span>
                </div>
                <div className="metric-item">
                  <span>Current</span>
                  <span>{selectedPanel.current}A</span>
                </div>
                <div className="metric-item">
                  <span>Efficiency</span>
                  <span>{Math.round(selectedPanel.efficiency * 100)}%</span>
                </div>
              </div>
            </div>
            
            <div className="detail-section">
              <h4>Environmental</h4>
              <div className="metrics-list">
                <div className="metric-item">
                  <span>Temperature</span>
                  <span>{selectedPanel.temperature}°C</span>
                </div>
                <div className="metric-item">
                  <span>Irradiance</span>
                  <span>{selectedPanel.irradiance}W/m²</span>
                </div>
              </div>
            </div>
            
            {selectedPanel.faultType !== 'NORMAL' && (
              <div className="detail-section">
                <h4>Fault Information</h4>
                <div className="fault-info">
                  <div className="fault-type">{selectedPanel.faultType}</div>
                  <div className="fault-severity">{selectedPanel.severity}</div>
                </div>
              </div>
            )}
            
            <div className="detail-section">
              <h4>Actions</h4>
              <div className="action-buttons">
                <button className="btn btn-primary btn-sm">
                  📊 View History
                </button>
                <button className="btn btn-secondary btn-sm">
                  🔧 Schedule Maintenance
                </button>
                <button className="btn btn-warning btn-sm">
                  ⚙️ Configure
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Panels;