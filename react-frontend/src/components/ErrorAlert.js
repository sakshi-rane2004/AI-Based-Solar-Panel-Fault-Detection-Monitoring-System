import React from 'react';

const ErrorAlert = ({ error, onRetry }) => {
  if (!error) return null;

  return (
    <div className="alert alert-danger">
      <strong>Error:</strong> {error}
      {onRetry && (
        <button 
          className="btn btn-secondary" 
          onClick={onRetry}
          style={{ marginLeft: '10px', padding: '5px 10px', fontSize: '12px' }}
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorAlert;