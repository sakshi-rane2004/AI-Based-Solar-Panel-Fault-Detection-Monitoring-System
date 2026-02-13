import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
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
        </div>
      </div>
    </header>
  );
};

export default Header;