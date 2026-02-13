import React from 'react';

const ConfidenceBar = ({ confidence, confidenceScore }) => {
  const getConfidenceClass = (confidence) => {
    if (!confidence) return 'confidence-low';
    
    const confidenceLower = confidence.toLowerCase();
    switch (confidenceLower) {
      case 'high':
        return 'confidence-high';
      case 'medium':
        return 'confidence-medium';
      case 'low':
      default:
        return 'confidence-low';
    }
  };

  const getWidth = (confidenceScore) => {
    if (typeof confidenceScore === 'number') {
      return `${Math.min(100, Math.max(0, confidenceScore * 100))}%`;
    }
    return '0%';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
        <span style={{ fontSize: '14px', fontWeight: '500' }}>
          Confidence: {confidence || 'Unknown'}
        </span>
        <span style={{ fontSize: '12px', color: '#666' }}>
          {confidenceScore ? `${(confidenceScore * 100).toFixed(1)}%` : 'N/A'}
        </span>
      </div>
      <div className="confidence-bar">
        <div 
          className={`confidence-fill ${getConfidenceClass(confidence)}`}
          style={{ width: getWidth(confidenceScore) }}
        ></div>
      </div>
    </div>
  );
};

export default ConfidenceBar;