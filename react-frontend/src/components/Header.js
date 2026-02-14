import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, switchRole, logout } = useAuth();
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const isActive = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  const handleRoleSwitch = (role) => {
    switchRole(role);
    setShowRoleSwitcher(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'ADMIN': return '#dc3545';
      case 'TECHNICIAN': return '#ffc107';
      case 'VIEWER': return '#28a745';
      default: return '#6c757d';
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <h1>Solar Panel Fault Detection</h1>
          </div>
          <nav className="nav">
            <Link to="/" className={isActive('/')}>
              Dashboard
            </Link>
            <Link to="/panels" className={isActive('/panels')}>
              Panels
            </Link>
            <Link to="/alerts" className={isActive('/alerts')}>
              Alerts
            </Link>
            <Link to="/analyze" className={isActive('/analyze')}>
              Analyze
            </Link>
            <Link to="/history" className={isActive('/history')}>
              Reports
            </Link>
            <Link to="/analytics" className={isActive('/analytics')}>
              Analytics
            </Link>
            <Link to="/settings" className={isActive('/settings')}>
              Settings
            </Link>
            <Link to="/admin/users" className={isActive('/admin/users')}>
              Users
            </Link>
          </nav>
          
          {/* Demo Role Switcher */}
          <div className="header-user-section">
            <div className="role-switcher-container">
              <button 
                className="role-badge"
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                style={{ backgroundColor: getRoleBadgeColor(user?.role) }}
                title="Switch role (Demo mode)"
              >
                👤 {user?.role || 'ADMIN'}
              </button>
              
              {showRoleSwitcher && (
                <div className="role-switcher-dropdown">
                  <div className="role-switcher-header">
                    <span>🎭 Demo Mode</span>
                    <button 
                      className="close-btn"
                      onClick={() => setShowRoleSwitcher(false)}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="role-switcher-options">
                    <button 
                      className={`role-option ${user?.role === 'ADMIN' ? 'active' : ''}`}
                      onClick={() => handleRoleSwitch('ADMIN')}
                    >
                      <span className="role-icon">👑</span>
                      <div className="role-info">
                        <strong>Admin</strong>
                        <small>Full access to all features</small>
                      </div>
                    </button>
                    <button 
                      className={`role-option ${user?.role === 'TECHNICIAN' ? 'active' : ''}`}
                      onClick={() => handleRoleSwitch('TECHNICIAN')}
                    >
                      <span className="role-icon">🔧</span>
                      <div className="role-info">
                        <strong>Technician</strong>
                        <small>Manage panels and alerts</small>
                      </div>
                    </button>
                    <button 
                      className={`role-option ${user?.role === 'VIEWER' ? 'active' : ''}`}
                      onClick={() => handleRoleSwitch('VIEWER')}
                    >
                      <span className="role-icon">👁️</span>
                      <div className="role-info">
                        <strong>Viewer</strong>
                        <small>Read-only access</small>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button 
              className="logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              <span className="logout-icon">🚪</span>
              <span className="logout-text">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;