import React, { useState, useEffect } from 'react';
import PanelGrid from '../components/PanelGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import { panelAPI, plantAPI } from '../services/api';
import ErrorAlert from '../components/ErrorAlert';

const Panels = () => {
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [plants, setPlants] = useState([]);
  const [panels, setPanels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    panelId: '',
    plantId: '',
    capacity: '',
    status: 'ACTIVE',
    installationDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchPlants();
    fetchPanels();
  }, []);

  const fetchPlants = async () => {
    try {
      const data = await plantAPI.getAllPlants();
      setPlants(data);
    } catch (err) {
      console.error('Error fetching plants:', err);
    }
  };

  const fetchPanels = async () => {
    try {
      const data = await panelAPI.getAllPanels();
      // Sort panels by panelId alphabetically for consistent order
      const sortedPanels = data.sort((a, b) => {
        const idA = a.panelId || '';
        const idB = b.panelId || '';
        return idA.localeCompare(idB);
      });
      setPanels(sortedPanels);
    } catch (err) {
      console.error('Error fetching panels:', err);
    }
  };

  // Calculate stats from actual panel data
  const stats = {
    active: panels.filter(p => p.status === 'ACTIVE').length,
    maintenance: panels.filter(p => p.status === 'MAINTENANCE').length,
    offline: panels.filter(p => p.status === 'OFFLINE').length,
    totalCapacity: panels.reduce((sum, p) => sum + (p.capacity || 0), 0) / 1000 // Convert to kW
  };

  // Filter panels based on selected status
  const filteredPanels = filterStatus === 'all' 
    ? panels 
    : panels.filter(p => p.status === filterStatus);

  const handlePanelClick = (panel) => {
    setSelectedPanel(panel);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await panelAPI.createPanel(formData);
      setShowAddModal(false);
      setFormData({
        panelId: '',
        plantId: '',
        capacity: '',
        status: 'ACTIVE',
        installationDate: new Date().toISOString().split('T')[0]
      });
      // Refresh the panel grid
      fetchPanels();
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePanel = async (panelId) => {
    if (!window.confirm('Are you sure you want to delete this panel? This action cannot be undone.')) {
      return;
    }

    try {
      await panelAPI.deletePanel(panelId);
      setSelectedPanel(null);
      fetchPanels();
      window.location.reload();
    } catch (err) {
      setError(`Failed to delete panel: ${err.message}`);
    }
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
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            + Add Panel
          </button>
          
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
            <option value="ACTIVE">Active Only</option>
            <option value="MAINTENANCE">Maintenance Only</option>
            <option value="OFFLINE">Offline Only</option>
          </select>
        </div>
      </div>

      <ErrorAlert error={error} />

      <div className="panels-stats">
        <div className="panel-stat">
          <div className="stat-icon healthy">✅</div>
          <div className="stat-content">
            <div className="stat-number">{stats.active}</div>
            <div className="stat-label">Active</div>
          </div>
        </div>
        
        <div className="panel-stat">
          <div className="stat-icon warning">⚠️</div>
          <div className="stat-content">
            <div className="stat-number">{stats.maintenance}</div>
            <div className="stat-label">Maintenance</div>
          </div>
        </div>
        
        <div className="panel-stat">
          <div className="stat-icon critical">🚨</div>
          <div className="stat-content">
            <div className="stat-number">{stats.offline}</div>
            <div className="stat-label">Offline</div>
          </div>
        </div>
        
        <div className="panel-stat">
          <div className="stat-icon total">📊</div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalCapacity.toFixed(1)}</div>
            <div className="stat-label">Total kW</div>
          </div>
        </div>
      </div>

      <div className="panels-content">
        {viewMode === 'grid' ? (
          <PanelGrid onPanelClick={handlePanelClick} panels={filteredPanels} />
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
            <h3>Panel {selectedPanel.panelId || selectedPanel.id}</h3>
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
              <div className={`status-badge ${selectedPanel.status ? selectedPanel.status.toLowerCase() : 'unknown'}`}>
                {selectedPanel.status || 'UNKNOWN'}
              </div>
            </div>
            
            <div className="detail-section">
              <h4>Panel Information</h4>
              <div className="metrics-list">
                <div className="metric-item">
                  <span>Plant</span>
                  <span>{selectedPanel.plantName || 'N/A'}</span>
                </div>
                <div className="metric-item">
                  <span>Capacity</span>
                  <span>{selectedPanel.capacity || 0}W</span>
                </div>
                <div className="metric-item">
                  <span>Installation Date</span>
                  <span>{selectedPanel.installationDate ? new Date(selectedPanel.installationDate).toLocaleDateString() : 'N/A'}</span>
                </div>
                {selectedPanel.assignedTechnicianId && (
                  <div className="metric-item">
                    <span>Assigned Technician</span>
                    <span>ID: {selectedPanel.assignedTechnicianId}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="detail-section">
              <h4>Actions</h4>
              <div className="action-buttons">
                <button className="btn btn-primary btn-sm">
                  📊 View History
                </button>
                <button className="btn btn-secondary btn-sm">
                  🔧 Schedule Maintenance
                </button>
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeletePanel(selectedPanel.id)}
                >
                  🗑️ Delete Panel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Panel Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Panel</h2>
              <button 
                className="close-btn"
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="panelId">Panel ID *</label>
                <input
                  type="text"
                  id="panelId"
                  name="panelId"
                  value={formData.panelId}
                  onChange={handleInputChange}
                  placeholder="e.g., P001"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="plantId">Solar Plant *</label>
                <select
                  id="plantId"
                  name="plantId"
                  value={formData.plantId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a plant</option>
                  {plants.map(plant => (
                    <option key={plant.id} value={plant.id}>
                      {plant.name} - {plant.location}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="capacity">Capacity (W) *</label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  placeholder="e.g., 250"
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Status *</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="ACTIVE">Active</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="OFFLINE">Offline</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="installationDate">Installation Date *</label>
                <input
                  type="date"
                  id="installationDate"
                  name="installationDate"
                  value={formData.installationDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Panel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Panels;