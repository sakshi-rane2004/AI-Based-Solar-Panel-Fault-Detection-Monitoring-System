import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { isLoggedIn, loading, userHasAnyRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  if (!isLoggedIn) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRoles.length > 0 && !userHasAnyRole(requiredRoles)) {
    // User doesn't have required role
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: '40px'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🚫</div>
        <h2 style={{ color: '#dc3545', marginBottom: '10px' }}>Access Denied</h2>
        <p style={{ color: '#666', fontSize: '16px', marginBottom: '20px' }}>
          You don't have permission to access this page.
        </p>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Required roles: {requiredRoles.join(', ')}
        </p>
        <button 
          onClick={() => window.history.back()} 
          className="btn btn-secondary"
          style={{ marginTop: '20px' }}
        >
          Go Back
        </button>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;