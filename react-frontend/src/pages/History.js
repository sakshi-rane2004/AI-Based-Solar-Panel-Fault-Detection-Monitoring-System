import React, { useState, useEffect } from 'react';
import { solarPanelAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import SeverityBadge from '../components/SeverityBadge';

const History = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    faultType: '',
    severity: ''
  });
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0
  });

  const fetchHistory = async (page = 0, size = 20, filterParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        size,
        ...filterParams
      };

      const response = await solarPanelAPI.getHistory(params);
      
      // Handle both paginated and non-paginated responses
      if (response.content) {
        // Paginated response
        setPredictions(response.content);
        setPagination({
          page: response.currentPage,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages
        });
      } else {
        // Non-paginated response (array)
        setPredictions(response);
        setPagination({
          page: 0,
          size: response.length,
          totalElements: response.length,
          totalPages: 1
        });
      }
    } catch (err) {
      setError(err.message);
      console.error('History fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(0, 20, filters);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: value || undefined
    };
    setFilters(newFilters);
    fetchHistory(0, pagination.size, newFilters);
  };

  const handlePageChange = (newPage) => {
    fetchHistory(newPage, pagination.size, filters);
  };

  const clearFilters = () => {
    const clearedFilters = { faultType: '', severity: '' };
    setFilters(clearedFilters);
    fetchHistory(0, pagination.size, {});
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getFaultTypeOptions = () => {
    const uniqueFaultTypes = [...new Set(predictions.map(p => p.predictedFault))];
    return uniqueFaultTypes.sort();
  };

  const getSeverityOptions = () => {
    const uniqueSeverities = [...new Set(predictions.map(p => p.severity))];
    return uniqueSeverities.sort();
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Prediction History</h1>
        <p className="page-subtitle">
          View and filter all fault detection predictions
        </p>
      </div>

      <ErrorAlert error={error} onRetry={() => fetchHistory(pagination.page, pagination.size, filters)} />

      {/* Filters */}
      <div className="card">
        <h3 style={{ marginBottom: '15px', color: '#333' }}>Filters</h3>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Fault Type</label>
            <select
              name="faultType"
              value={filters.faultType}
              onChange={handleFilterChange}
              className="form-control"
            >
              <option value="">All Fault Types</option>
              <option value="NORMAL">NORMAL</option>
              <option value="PARTIAL_SHADING">PARTIAL_SHADING</option>
              <option value="PANEL_DEGRADATION">PANEL_DEGRADATION</option>
              <option value="INVERTER_FAULT">INVERTER_FAULT</option>
              <option value="DUST_ACCUMULATION">DUST_ACCUMULATION</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Severity</label>
            <select
              name="severity"
              value={filters.severity}
              onChange={handleFilterChange}
              className="form-control"
            >
              <option value="">All Severities</option>
              <option value="None">None</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'end' }}>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      {!loading && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{pagination.totalElements}</strong> predictions found
              {(filters.faultType || filters.severity) && (
                <span style={{ color: '#666', marginLeft: '10px' }}>
                  (filtered)
                </span>
              )}
            </div>
            {pagination.totalPages > 1 && (
              <div style={{ fontSize: '14px', color: '#666' }}>
                Page {pagination.page + 1} of {pagination.totalPages}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Predictions Table */}
      <div className="card">
        {loading ? (
          <LoadingSpinner message="Loading prediction history..." />
        ) : predictions.length > 0 ? (
          <>
            <div className="table-container">
              <table className="table table-responsive">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Fault Type</th>
                    <th>Severity</th>
                    <th>Confidence</th>
                    <th>Voltage (V)</th>
                    <th>Current (A)</th>
                    <th>Temperature (°C)</th>
                    <th>Power (W)</th>
                    <th>Recommendation</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.map((prediction) => (
                    <tr key={prediction.id}>
                      <td style={{ minWidth: '150px' }}>
                        {formatTimestamp(prediction.timestamp)}
                      </td>
                      <td>
                        <span style={{ fontWeight: '500' }}>
                          {prediction.predictedFault}
                        </span>
                      </td>
                      <td>
                        <SeverityBadge severity={prediction.severity} />
                      </td>
                      <td>
                        <span className={`badge badge-${prediction.confidence?.toLowerCase() || 'none'}`}>
                          {prediction.confidence}
                        </span>
                        <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                          {prediction.confidenceScore ? 
                            `${(prediction.confidenceScore * 100).toFixed(1)}%` : 
                            'N/A'
                          }
                        </div>
                      </td>
                      <td>{prediction.inputValues?.voltage || 'N/A'}</td>
                      <td>{prediction.inputValues?.current || 'N/A'}</td>
                      <td>{prediction.inputValues?.temperature || 'N/A'}</td>
                      <td>{prediction.inputValues?.power || 'N/A'}</td>
                      <td style={{ maxWidth: '200px' }}>
                        <div 
                          style={{ 
                            fontSize: '12px', 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                          title={prediction.maintenanceRecommendation}
                        >
                          {prediction.maintenanceRecommendation || 'N/A'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: '10px', 
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '1px solid #eee'
              }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 0}
                  style={{ fontSize: '12px', padding: '5px 10px' }}
                >
                  Previous
                </button>
                
                <span style={{ fontSize: '14px', color: '#666' }}>
                  Page {pagination.page + 1} of {pagination.totalPages}
                </span>
                
                <button
                  className="btn btn-secondary"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages - 1}
                  style={{ fontSize: '12px', padding: '5px 10px' }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <h3>No Predictions Found</h3>
            <p>
              {(filters.faultType || filters.severity) 
                ? 'No predictions match your current filters. Try adjusting the filters or clearing them.'
                : 'No predictions have been made yet. Start by analyzing some sensor data.'
              }
            </p>
            {(filters.faultType || filters.severity) ? (
              <button className="btn btn-secondary" onClick={clearFilters}>
                Clear Filters
              </button>
            ) : (
              <a href="/analyze" className="btn btn-primary">
                Analyze Data
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;