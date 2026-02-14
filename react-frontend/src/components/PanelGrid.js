import React, { useState, useEffect } from 'react';
import { panelAPI } from '../services/api';

const PanelGrid = ({ onPanelClick, panels: propPanels }) => {
  const [panels, setPanels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [draggedPanel, setDraggedPanel] = useState(null);

  // Use panels from props if provided, otherwise fetch
  useEffect(() => {
    if (propPanels) {
      setPanels(propPanels);
      setLoading(false);
    } else {
      fetchPanels();
    }
  }, [propPanels]);

  // Fetch real panel data from database
  const fetchPanels = async () => {
    try {
      setLoading(true);
      const data = await panelAPI.getAllPanels();
      // Sort panels by panelId alphabetically for consistent order
      const sortedPanels = data.sort((a, b) => {
        const idA = a.panelId || '';
        const idB = b.panelId || '';
        return idA.localeCompare(idB);
      });
      setPanels(sortedPanels);
    } catch (error) {
      console.error('Error fetching panels:', error);
      setPanels([]);
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (status) => {
    switch (status) {
      case 'ACTIVE': return '#28a745';
      case 'MAINTENANCE': return '#ffc107';
      case 'OFFLINE': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getHealthIcon = (status) => {
    switch (status) {
      case 'ACTIVE': return '✅';
      case 'MAINTENANCE': return '⚠️';
      case 'OFFLINE': return '🚨';
      default: return '❓';
    }
  };

  const handlePanelClick = (panel) => {
    setSelectedPanel(panel);
    if (onPanelClick) {
      onPanelClick(panel);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e, panel) => {
    setDraggedPanel(panel);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    setDraggedPanel(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetPanel) => {
    e.preventDefault();
    
    if (!draggedPanel || draggedPanel.id === targetPanel.id) {
      return;
    }

    const draggedIndex = panels.findIndex(p => p.id === draggedPanel.id);
    const targetIndex = panels.findIndex(p => p.id === targetPanel.id);

    if (draggedIndex === -1 || targetIndex === -1) {
      return;
    }

    // Reorder panels
    const newPanels = [...panels];
    newPanels.splice(draggedIndex, 1);
    newPanels.splice(targetIndex, 0, draggedPanel);
    
    setPanels(newPanels);
  };

  if (loading) {
    return (
      <div className="panel-grid-loading">
        <div className="loading-spinner"></div>
        <p>Loading panel data...</p>
      </div>
    );
  }

  return (
    <div className="panel-grid-container">
      <div className="panel-grid-header">
        <h3>Solar Panel Grid</h3>
        <div className="panel-grid-legend">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#28a745' }}></div>
            <span>Active</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#ffc107' }}></div>
            <span>Maintenance</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#dc3545' }}></div>
            <span>Offline</span>
          </div>
        </div>
      </div>

      <div className="panel-grid">
        {panels.length === 0 ? (
          <div className="panel-grid-empty">
            <p>No panels found. Add panels using the "+ Add Panel" button above.</p>
          </div>
        ) : (
          panels.map((panel) => (
            <div
              key={panel.id}
              className={`panel-tile ${panel.status ? panel.status.toLowerCase() : 'unknown'} ${selectedPanel?.id === panel.id ? 'selected' : ''} ${draggedPanel?.id === panel.id ? 'dragging' : ''}`}
              onClick={() => handlePanelClick(panel)}
              draggable="true"
              onDragStart={(e) => handleDragStart(e, panel)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, panel)}
              style={{ 
                borderColor: getHealthColor(panel.status || 'OFFLINE'),
                cursor: 'move'
              }}
            >
              <div className="panel-tile-header">
                <span className="panel-tile-id">{panel.panelId || 'N/A'}</span>
                <span className="panel-tile-status">{getHealthIcon(panel.status || 'OFFLINE')}</span>
              </div>
              <div className="panel-tile-power">
                {Math.round(panel.capacity || 0)}W
              </div>
              <div className="panel-tile-plant">
                {panel.plantName || 'Unknown'}
              </div>
            </div>
          ))
        )}
      </div>

      {selectedPanel && (
        <div className="panel-details-modal" onClick={() => setSelectedPanel(null)}>
          <div className="panel-details-content" onClick={(e) => e.stopPropagation()}>
            <div className="panel-details-header">
              <h4>Panel {selectedPanel.panelId || 'N/A'} Details</h4>
              <button 
                className="panel-details-close"
                onClick={() => setSelectedPanel(null)}
              >
                ✕
              </button>
            </div>
            
            <div className="panel-details-grid">
              <div className="panel-detail-item">
                <label>Status</label>
                <div className={`panel-status ${selectedPanel.status ? selectedPanel.status.toLowerCase() : 'unknown'}`}>
                  {getHealthIcon(selectedPanel.status || 'OFFLINE')} {selectedPanel.status || 'UNKNOWN'}
                </div>
              </div>
              
              <div className="panel-detail-item">
                <label>Plant</label>
                <div>{selectedPanel.plantName || 'Unknown'}</div>
              </div>
              
              <div className="panel-detail-item">
                <label>Capacity</label>
                <div>{selectedPanel.capacity || 0}W</div>
              </div>
              
              <div className="panel-detail-item">
                <label>Installation Date</label>
                <div>{selectedPanel.installationDate ? new Date(selectedPanel.installationDate).toLocaleDateString() : 'N/A'}</div>
              </div>
              
              {selectedPanel.assignedTechnicianId && (
                <div className="panel-detail-item">
                  <label>Assigned Technician</label>
                  <div>ID: {selectedPanel.assignedTechnicianId}</div>
                </div>
              )}
            </div>
            
            <div className="panel-details-footer">
              <small>Created: {selectedPanel.createdAt ? new Date(selectedPanel.createdAt).toLocaleString() : 'N/A'}</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelGrid;