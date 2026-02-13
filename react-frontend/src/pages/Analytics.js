import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import { solarPanelAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const Analytics = () => {
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trendDays, setTrendDays] = useState(30);

  const fetchAnalytics = async (days = 30) => {
    try {
      setLoading(true);
      setError(null);

      const [summaryData, trendsData] = await Promise.all([
        solarPanelAPI.getAnalyticsSummary(),
        solarPanelAPI.getAnalyticsTrends({ days })
      ]);

      setSummary(summaryData);
      setTrends(trendsData);
    } catch (err) {
      setError(err.message);
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(trendDays);
  }, [trendDays]);

  const handleTrendDaysChange = (days) => {
    setTrendDays(days);
  };

  // Prepare fault type pie chart data
  const getFaultTypePieData = () => {
    if (!summary || !summary.faultTypeCounts) return null;

    const colors = {
      'NORMAL': '#28a745',
      'PARTIAL_SHADING': '#ffc107',
      'PANEL_DEGRADATION': '#fd7e14',
      'INVERTER_FAULT': '#dc3545',
      'DUST_ACCUMULATION': '#6c757d'
    };

    return {
      labels: Object.keys(summary.faultTypeCounts),
      datasets: [
        {
          data: Object.values(summary.faultTypeCounts),
          backgroundColor: Object.keys(summary.faultTypeCounts).map(key => colors[key] || '#6c757d'),
          borderWidth: 2,
          borderColor: '#fff'
        }
      ]
    };
  };

  // Prepare severity pie chart data
  const getSeverityPieData = () => {
    if (!summary || !summary.severityCounts) return null;

    const colors = {
      'None': '#28a745',
      'Low': '#ffc107',
      'Medium': '#fd7e14',
      'High': '#dc3545',
      'Critical': '#6f42c1'
    };

    return {
      labels: Object.keys(summary.severityCounts),
      datasets: [
        {
          data: Object.values(summary.severityCounts),
          backgroundColor: Object.keys(summary.severityCounts).map(key => colors[key] || '#6c757d'),
          borderWidth: 2,
          borderColor: '#fff'
        }
      ]
    };
  };

  // Prepare trends line chart data
  const getTrendsLineData = () => {
    if (!trends || !trends.dailyTrends) return null;

    const labels = trends.dailyTrends.map(point => 
      new Date(point.date).toLocaleDateString()
    );
    const data = trends.dailyTrends.map(point => point.totalCount);

    return {
      labels,
      datasets: [
        {
          label: 'Daily Predictions',
          data,
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true
        }
      }
    }
  };

  const lineChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    },
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: `Prediction Trends (Last ${trendDays} Days)`
      }
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading analytics..." />;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Analytics Dashboard</h1>
        <p className="page-subtitle">
          Comprehensive analytics and insights for fault detection patterns
        </p>
      </div>

      <ErrorAlert error={error} onRetry={() => fetchAnalytics(trendDays)} />

      {/* Summary Statistics */}
      {summary && (
        <div className="stats-grid">
          <div className="stat-card info">
            <div className="stat-value">{summary.totalPredictions || 0}</div>
            <div className="stat-label">Total Predictions</div>
          </div>
          <div className="stat-card normal">
            <div className="stat-value">{summary.normalOperations || 0}</div>
            <div className="stat-label">Normal Operations</div>
          </div>
          <div className="stat-card danger">
            <div className="stat-value">{summary.criticalFaults || 0}</div>
            <div className="stat-label">Critical Faults</div>
          </div>
          <div className="stat-card warning">
            <div className="stat-value">{summary.mostCommonFault || 'N/A'}</div>
            <div className="stat-label">Most Common Fault</div>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-2">
        {/* Fault Type Distribution */}
        <div className="card">
          <h3 style={{ marginBottom: '20px', color: '#333' }}>Fault Type Distribution</h3>
          {getFaultTypePieData() ? (
            <div className="chart-container chart-small">
              <Pie data={getFaultTypePieData()} options={chartOptions} />
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <p>No fault type data available</p>
            </div>
          )}
        </div>

        {/* Severity Distribution */}
        <div className="card">
          <h3 style={{ marginBottom: '20px', color: '#333' }}>Severity Distribution</h3>
          {getSeverityPieData() ? (
            <div className="chart-container chart-small">
              <Pie data={getSeverityPieData()} options={chartOptions} />
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <p>No severity data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Trends Chart */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: '#333' }}>Prediction Trends</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className={`btn ${trendDays === 7 ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleTrendDaysChange(7)}
              style={{ fontSize: '12px', padding: '5px 10px' }}
            >
              7 Days
            </button>
            <button
              className={`btn ${trendDays === 30 ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleTrendDaysChange(30)}
              style={{ fontSize: '12px', padding: '5px 10px' }}
            >
              30 Days
            </button>
            <button
              className={`btn ${trendDays === 90 ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleTrendDaysChange(90)}
              style={{ fontSize: '12px', padding: '5px 10px' }}
            >
              90 Days
            </button>
          </div>
        </div>

        {getTrendsLineData() ? (
          <div className="chart-container">
            <Line data={getTrendsLineData()} options={lineChartOptions} />
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📈</div>
            <p>No trend data available for the selected period</p>
          </div>
        )}

        {trends && (
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
            <div className="grid grid-4">
              <div>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>
                  Total Period
                </div>
                <div style={{ fontWeight: '600' }}>
                  {trends.totalPredictionsInPeriod || 0} predictions
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>
                  Most Active Fault
                </div>
                <div style={{ fontWeight: '600' }}>
                  {trends.mostActiveFaultType || 'N/A'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>
                  Trend Direction
                </div>
                <div style={{ fontWeight: '600' }}>
                  {trends.trendDirection || 'N/A'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>
                  Period
                </div>
                <div style={{ fontWeight: '600' }}>
                  {trends.totalDays || 0} days
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Statistics */}
      {summary && (
        <div className="grid grid-2">
          {/* Fault Type Percentages */}
          <div className="card">
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Fault Type Breakdown</h3>
            {summary.faultTypePercentages ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Object.entries(summary.faultTypePercentages).map(([faultType, percentage]) => (
                  <div key={faultType} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '500' }}>{faultType}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span>{percentage.toFixed(1)}%</span>
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        ({summary.faultTypeCounts[faultType]} predictions)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#666' }}>No fault type data available</p>
            )}
          </div>

          {/* Severity Percentages */}
          <div className="card">
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Severity Breakdown</h3>
            {summary.severityPercentages ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Object.entries(summary.severityPercentages).map(([severity, percentage]) => (
                  <div key={severity} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '500' }}>{severity}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span>{percentage.toFixed(1)}%</span>
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        ({summary.severityCounts[severity]} predictions)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#666' }}>No severity data available</p>
            )}
          </div>
        </div>
      )}

      {summary && summary.lastUpdated && (
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#666' }}>
          Last updated: {new Date(summary.lastUpdated).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default Analytics;