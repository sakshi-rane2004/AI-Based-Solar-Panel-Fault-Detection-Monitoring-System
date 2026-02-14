import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { switchRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState('ADMIN');
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    {
      id: 'ADMIN',
      icon: '👑',
      title: 'Administrator',
      description: 'Full system access and management',
      color: '#dc3545',
      features: ['Manage all panels', 'View analytics', 'User management', 'System settings']
    },
    {
      id: 'TECHNICIAN',
      icon: '🔧',
      title: 'Technician',
      description: 'Panel maintenance and alerts',
      color: '#ffc107',
      features: ['Manage panels', 'Handle alerts', 'Run diagnostics', 'View reports']
    },
    {
      id: 'VIEWER',
      icon: '👁️',
      title: 'Viewer',
      description: 'Read-only dashboard access',
      color: '#28a745',
      features: ['View dashboard', 'Monitor status', 'Check alerts', 'Read reports']
    }
  ];

  const handleLogin = () => {
    setIsLoading(true);
    
    // Simulate login delay for better UX
    setTimeout(() => {
      switchRole(selectedRole);
      setIsLoading(false);
      navigate('/');
    }, 800);
  };

  const handleQuickLogin = (role) => {
    setSelectedRole(role);
    setIsLoading(true);
    
    setTimeout(() => {
      switchRole(role);
      setIsLoading(false);
      navigate('/');
    }, 600);
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="solar-animation">
          <div className="sun"></div>
          <div className="panel panel-1"></div>
          <div className="panel panel-2"></div>
          <div className="panel panel-3"></div>
        </div>
      </div>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <span className="logo-icon">☀️</span>
              <h1>Solar Panel Monitor</h1>
            </div>
            <p className="login-subtitle">Intelligent Fault Detection System</p>
            <div className="demo-badge">
              <span>🎭</span> Demo Mode
            </div>
          </div>

          <div className="login-content">
            <h2 className="section-title">Select Your Role</h2>
            
            <div className="role-cards">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className={`role-card ${selectedRole === role.id ? 'selected' : ''}`}
                  onClick={() => setSelectedRole(role.id)}
                  style={{
                    '--role-color': role.color
                  }}
                >
                  <div className="role-card-header">
                    <span className="role-card-icon">{role.icon}</span>
                    <div className="role-card-info">
                      <h3>{role.title}</h3>
                      <p>{role.description}</p>
                    </div>
                    <div className="role-card-check">
                      {selectedRole === role.id && <span>✓</span>}
                    </div>
                  </div>
                  
                  <div className="role-card-features">
                    {role.features.map((feature, index) => (
                      <div key={index} className="feature-item">
                        <span className="feature-dot">•</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    className="quick-login-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickLogin(role.id);
                    }}
                    disabled={isLoading}
                  >
                    Quick Login as {role.title}
                  </button>
                </div>
              ))}
            </div>

            <div className="login-actions">
              <button
                className="login-btn"
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Logging in...
                  </>
                ) : (
                  <>
                    Continue as {roles.find(r => r.id === selectedRole)?.title}
                    <span className="arrow">→</span>
                  </>
                )}
              </button>
            </div>

            <div className="login-info">
              <div className="info-card">
                <span className="info-icon">ℹ️</span>
                <div className="info-text">
                  <strong>Demo Mode Active</strong>
                  <p>No password required. Select a role to explore the system.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="login-footer">
            <p>Powered by AI & Machine Learning</p>
            <div className="footer-links">
              <a href="#about">About</a>
              <span>•</span>
              <a href="#docs">Documentation</a>
              <span>•</span>
              <a href="#support">Support</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
