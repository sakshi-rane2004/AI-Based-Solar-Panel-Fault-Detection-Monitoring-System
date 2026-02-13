import React, { useState, useEffect } from 'react';
import { solarPanelAPI } from '../services/api';

const PanelGrid = ({ onPanelClick }) => {
  const [panels, setPanels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPanel, setSelectedPanel] = useState(null);

  // Generate mock panel data based on recent predictions
  useEffect(() => {
    const generatePanelData = async () => {
      try {
        setLoading(true);
        const history = await solarPanelAPI.getHistory({ limit: 50 });
        
        // Generate 24 panels (4x6 grid) with mock data
        const mockPanels = Array.from({ length: 24 }, (_, index) => {
          const panelId = `P${String(index + 1).padStart(3, '0')}`;
          
          // Use some real data from history if available
          const relatedPrediction = history[index % history.length];
          
          // Generate realistic sensor values
          const baseVoltage = 30 + Math.random() * 10;
          const baseCurrent = 8 + Math.random() * 4;
          const baseTemp = 25 + Math.random() * 15;
          const baseIrradiance = 800 + Math.random() * 400;
          
          // Determine health status based on fault type
          let health = 'healthy';
          let faultType = 'NORMAL';
          let severity = 'LOW';
          
          if (relatedPrediction) {
            faultType = relatedPrediction.predictedFault;
            severity = relatedPrediction.severity;
            
            if (faultType !== 'NORMAL') {
              if (severity === 'CRITICAL') {
                health = 'critical';
              } else if (severity === 'HIGH') {
                health = 'warning';
              } else {
                health = 'warning';
              }
            }
          } else {
            // Random health for demo
            const rand = Math.random();
            if (rand < 0.1) {
              health = 'critical';
              faultType = 'INVERTER_FAULT';
              severity = 'CRITICAL';
            } else if (rand < 0.25) {
              health = 'warning';
              faultType = 'PARTIAL_SHADING';
              severity = 'HIGH';
            }
          }
          
          // Adjust values based on health
          let voltage = baseVoltage;
          let current = baseCurrent;
          let power = voltage * current;
          
          if (health === 'critical') {
            voltage *= 0.6;
            current *= 0.5;
            power = voltage * current;
          } else if (health === 'warning') {
            voltage *= 0.8;
            current *= 0.7;
            power = voltage * current;
          }
          
          return {
            id: panelId,
            health,
            faultType,
            severity,
            voltage: Math.round(voltage * 10) / 10,
            current: Math.round(current * 10) / 10,
            power: Math.round(power * 10) / 10,
            temperature: Math.round(baseTemp * 10) / 10,
            irradiance: Math.round(baseIrradiance),
            efficiency: Math.round((power / (baseIrradiance * 0.2)) * 100) / 100,
            lastUpdate: new Date(Date.now() - Math.random() * 3600000).toISOString()
          };
        });
        
        setPanels(mockPanels);
      } catch (error) {
        console.error('Error generating panel data:', error);
        // Fallback to basic mock data
        const fallbackPanels = Array.from({ length: 24 }, (_, index) => ({
          id: `P${String(index + 1).padStart(3, '0')}`,
          health: Math.random() < 0.8 ? 'healthy' : Math.random() < 0.5 ? 'warning' : 'critical',
          faultType: 'NORMAL',
          severity: 'LOW',
          voltage: 30 + Math.random() * 10,
          current: 8 + Math.random() * 4,
          power: 200 + Math.random() * 100,
          temperature: 25 + Math.random() * 15,
          irradiance: 800 + Math.random() * 400,
          efficiency: 0.15 + Math.random() * 0.1,
          lastUpdate: new Date().toISOString()
        }));
        setPanels(fallbackPanels);
      } finally {
        setLoading(false);
      }
    };

    generatePanelData();
    
    // Refresh every 30 seconds
    const interval = setInterval(generatePanelData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (health) => {
    switch (health) {
      case 'healthy': return '#28a745';
      case 'warning': return '#ffc107';
      case 'critical': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getHealthIcon = (health) => {
    switch (health) {
      case 'healthy': return '✅';
      case 'warning': return '⚠️';
      case 'critical': return '🚨';
      default: return '❓';
    }
  };

  const handlePanelClick = (panel) => {
    setSelectedPanel(panel);
    if (onPanelClick) {
      onPanelClick(panel);
    }
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
            <span>Healthy</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#ffc107' }}></div>
            <span>Warning</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#dc3545' }}></div>
            <span>Critical</span>
          </div>
        </div>
      </div>

      <div className="panel-grid">
        {panels.map((panel) => (
          <div
            key={panel.id}
            className={`panel-tile ${panel.health} ${selectedPanel?.id === panel.id ? 'selected' : ''}`}
            onClick={() => handlePanelClick(panel)}
            style={{ borderColor: getHealthColor(panel.health) }}
          >
            <div className="panel-tile-header">
              <span className="panel-tile-id">{panel.id}</span>
              <span className="panel-tile-status">{getHealthIcon(panel.health)}</span>
            </div>
            <div className="panel-tile-power">
              {Math.round(panel.power)}W
            </div>
            <div className="panel-tile-efficiency">
              {Math.round(panel.efficiency * 100)}%
            </div>
          </div>
        ))}
      </div>

      {selectedPanel && (
        <div className="panel-details-modal" onClick={() => setSelectedPanel(null)}>
          <div className="panel-details-content" onClick={(e) => e.stopPropagation()}>
            <div className="panel-details-header">
              <h4>Panel {selectedPanel.id} Details</h4>
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
                <div className={`panel-status ${selectedPanel.health}`}>
                  {getHealthIcon(selectedPanel.health)} {selectedPanel.health.toUpperCase()}
                </div>
              </div>
              
              <div className="panel-detail-item">
                <label>Fault Type</label>
                <div>{selectedPanel.faultType}</div>
              </div>
              
              <div className="panel-detail-item">
                <label>Voltage</label>
                <div>{selectedPanel.voltage}V</div>
              </div>
              
              <div className="panel-detail-item">
                <label>Current</label>
                <div>{selectedPanel.current}A</div>
              </div>
              
              <div className="panel-detail-item">
                <label>Power Output</label>
                <div>{selectedPanel.power}W</div>
              </div>
              
              <div className="panel-detail-item">
                <label>Temperature</label>
                <div>{selectedPanel.temperature}°C</div>
              </div>
              
              <div className="panel-detail-item">
                <label>Irradiance</label>
                <div>{selectedPanel.irradiance}W/m²</div>
              </div>
              
              <div className="panel-detail-item">
                <label>Efficiency</label>
                <div>{Math.round(selectedPanel.efficiency * 100)}%</div>
              </div>
            </div>
            
            <div className="panel-details-footer">
              <small>Last updated: {new Date(selectedPanel.lastUpdate).toLocaleString()}</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelGrid;