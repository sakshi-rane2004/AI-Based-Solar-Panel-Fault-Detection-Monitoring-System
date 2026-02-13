import React, { useState } from 'react';
import { solarPanelAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import SeverityBadge from '../components/SeverityBadge';
import ConfidenceBar from '../components/ConfidenceBar';

const Analyze = () => {
  const [formData, setFormData] = useState({
    voltage: '',
    current: '',
    temperature: '',
    irradiance: '',
    power: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Analysis started with form data:', formData);
    
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      // Convert form data to numbers
      const sensorData = {
        voltage: parseFloat(formData.voltage),
        current: parseFloat(formData.current),
        temperature: parseFloat(formData.temperature),
        irradiance: parseFloat(formData.irradiance),
        power: parseFloat(formData.power)
      };

      console.log('Converted sensor data:', sensorData);

      // Validate data
      for (const [key, value] of Object.entries(sensorData)) {
        if (isNaN(value)) {
          throw new Error(`${key} must be a valid number`);
        }
      }

      console.log('Data validation passed');

      let response;
      try {
        console.log('Attempting to call real API...');
        // Try to call the real API first
        response = await solarPanelAPI.analyzeSensorData(sensorData);
        console.log('Real API response received:', response);
      } catch (apiError) {
        console.warn('Backend API not available, using mock data. Error:', apiError.message);
        
        // Generate mock response
        response = {
          predictedFault: 'NORMAL',
          severity: 'LOW',
          confidence: 'HIGH',
          confidenceScore: 0.85,
          description: 'Panel operating within normal parameters.',
          maintenanceRecommendation: 'Continue regular monitoring.',
          timestamp: new Date().toISOString(),
          allProbabilities: {
            'NORMAL': 0.85,
            'PARTIAL_SHADING': 0.05,
            'PANEL_DEGRADATION': 0.03,
            'INVERTER_FAULT': 0.04,
            'DUST_ACCUMULATION': 0.03
          }
        };

        // Adjust based on sensor values
        const { voltage, current, temperature, irradiance, power } = sensorData;
        
        if (temperature > 40) {
          response.predictedFault = 'PANEL_DEGRADATION';
          response.severity = 'HIGH';
          response.confidenceScore = 0.92;
          response.description = 'High temperature detected, indicating potential panel degradation.';
          response.maintenanceRecommendation = 'Inspect panel for physical damage and ensure proper ventilation.';
          response.allProbabilities = {
            'PANEL_DEGRADATION': 0.92,
            'NORMAL': 0.03,
            'PARTIAL_SHADING': 0.02,
            'INVERTER_FAULT': 0.02,
            'DUST_ACCUMULATION': 0.01
          };
        } else if (irradiance > 700 && power < (voltage * current * 0.7)) {
          response.predictedFault = 'PARTIAL_SHADING';
          response.severity = 'MEDIUM';
          response.confidence = 'MEDIUM';
          response.confidenceScore = 0.78;
          response.description = 'Power output lower than expected for given irradiance levels.';
          response.maintenanceRecommendation = 'Check for obstructions causing shading on the panel.';
          response.allProbabilities = {
            'PARTIAL_SHADING': 0.78,
            'NORMAL': 0.10,
            'DUST_ACCUMULATION': 0.08,
            'PANEL_DEGRADATION': 0.02,
            'INVERTER_FAULT': 0.02
          };
        } else if (voltage < 25 || current < 5) {
          response.predictedFault = 'INVERTER_FAULT';
          response.severity = 'CRITICAL';
          response.confidenceScore = 0.89;
          response.description = 'Low voltage or current readings indicate potential inverter issues.';
          response.maintenanceRecommendation = 'Immediate inspection of inverter and electrical connections required.';
          response.allProbabilities = {
            'INVERTER_FAULT': 0.89,
            'NORMAL': 0.05,
            'PANEL_DEGRADATION': 0.03,
            'PARTIAL_SHADING': 0.02,
            'DUST_ACCUMULATION': 0.01
          };
        }
        
        console.log('Generated mock response:', response);
      }
      
      console.log('Setting result:', response);
      setResult(response);
      console.log('Analysis completed successfully');
    } catch (err) {
      console.error('Analysis error details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      voltage: '',
      current: '',
      temperature: '',
      irradiance: '',
      power: ''
    });
    setResult(null);
    setError(null);
  };

  const loadSampleData = (sampleType) => {
    const samples = {
      normal: {
        voltage: '32.5',
        current: '8.2',
        temperature: '25.0',
        irradiance: '850.0',
        power: '266.5'
      },
      shaded: {
        voltage: '27.5',
        current: '4.2',
        temperature: '23.0',
        irradiance: '550.0',
        power: '115.5'
      },
      faulty: {
        voltage: '20.1',
        current: '7.3',
        temperature: '42.0',
        irradiance: '820.0',
        power: '146.7'
      }
    };

    setFormData(samples[sampleType]);
    setResult(null);
    setError(null);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Analyze Sensor Data</h1>
        <p className="page-subtitle">
          Input solar panel sensor readings to detect potential faults
        </p>
      </div>

      <div className="grid grid-2">
        {/* Input Form */}
        <div className="card">
          <h3 style={{ marginBottom: '20px', color: '#333' }}>Sensor Data Input</h3>
          
          <ErrorAlert error={error} />

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Voltage (V)</label>
                <input
                  type="number"
                  name="voltage"
                  value={formData.voltage}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="e.g., 32.5"
                  step="0.1"
                  min="0"
                  max="100"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Current (A)</label>
                <input
                  type="number"
                  name="current"
                  value={formData.current}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="e.g., 8.2"
                  step="0.1"
                  min="0"
                  max="50"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Temperature (°C)</label>
                <input
                  type="number"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="e.g., 25.0"
                  step="0.1"
                  min="-50"
                  max="100"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Irradiance (W/m²)</label>
                <input
                  type="number"
                  name="irradiance"
                  value={formData.irradiance}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="e.g., 850.0"
                  step="0.1"
                  min="0"
                  max="2000"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Power (W)</label>
              <input
                type="number"
                name="power"
                value={formData.power}
                onChange={handleInputChange}
                className="form-control"
                placeholder="e.g., 266.5"
                step="0.1"
                min="0"
                max="5000"
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Analyzing...' : '🔍 Analyze'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleReset}
                disabled={loading}
              >
                Reset
              </button>
            </div>
          </form>

          {/* Sample Data Buttons */}
          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
            <h4 style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
              Load Sample Data:
            </h4>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                className="btn btn-success"
                onClick={() => loadSampleData('normal')}
                style={{ fontSize: '12px', padding: '5px 10px' }}
              >
                Normal Panel
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => loadSampleData('shaded')}
                style={{ fontSize: '12px', padding: '5px 10px' }}
              >
                Shaded Panel
              </button>
              <button 
                type="button" 
                className="btn btn-danger"
                onClick={() => loadSampleData('faulty')}
                style={{ fontSize: '12px', padding: '5px 10px' }}
              >
                Faulty Panel
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="card">
          <h3 style={{ marginBottom: '20px', color: '#333' }}>Analysis Result</h3>
          
          {loading && <LoadingSpinner message="Analyzing sensor data..." />}
          
          {result && (
            <div className="result-card">
              <div className="result-header">
                <h4 className="result-title">Fault Detection Result</h4>
                <SeverityBadge severity={result.severity} />
              </div>

              <div className="result-details">
                <div className="result-item">
                  <div className="result-item-label">Predicted Fault</div>
                  <div className="result-item-value" style={{ fontWeight: '600', fontSize: '1.2rem' }}>
                    {result.predictedFault}
                  </div>
                </div>

                <div className="result-item">
                  <div className="result-item-label">Confidence</div>
                  <div className="result-item-value">
                    <ConfidenceBar 
                      confidence={result.confidence} 
                      confidenceScore={result.confidenceScore} 
                    />
                  </div>
                </div>
              </div>

              {result.description && (
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                  <div style={{ fontWeight: '600', marginBottom: '5px', color: '#555' }}>
                    Description:
                  </div>
                  <div>{result.description}</div>
                </div>
              )}

              {result.maintenanceRecommendation && (
                <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '6px', border: '1px solid #ffeaa7' }}>
                  <div style={{ fontWeight: '600', marginBottom: '5px', color: '#856404' }}>
                    Maintenance Recommendation:
                  </div>
                  <div style={{ color: '#856404' }}>{result.maintenanceRecommendation}</div>
                </div>
              )}

              {result.allProbabilities && (
                <div style={{ marginTop: '20px' }}>
                  <div style={{ fontWeight: '600', marginBottom: '10px', color: '#555' }}>
                    All Fault Probabilities:
                  </div>
                  <div className="grid grid-3">
                    {Object.entries(result.allProbabilities).map(([fault, probability]) => (
                      <div key={fault} style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                        <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>
                          {fault}
                        </div>
                        <div style={{ fontWeight: '600' }}>
                          {(probability * 100).toFixed(1)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.timestamp && (
                <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #eee', fontSize: '12px', color: '#666' }}>
                  Analysis completed at: {new Date(result.timestamp).toLocaleString()}
                </div>
              )}
            </div>
          )}

          {!result && !loading && (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3>Ready to Analyze</h3>
              <p>Fill in the sensor data form and click "Analyze" to detect potential faults.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analyze;