import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const { user, canAccessAnalytics, canAccessHistory, canAccessPanels, canAccessAlerts, canAccessSettings } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      path: '/',
      icon: '📊',
      label: 'Dashboard',
      show: true // All roles can access dashboard
    },
    {
      path: '/panels',
      icon: '☀️',
      label: 'Panels',
      show: canAccessPanels() // Admin + Technician
    },
    {
      path: '/alerts',
      icon: '🚨',
      label: 'Alerts',
      show: canAccessAlerts() // Admin + Technician
    },
    {
      path: '/plants',
      icon: '🏭',
      label: 'Plants',
      show: true // All roles can view plants
    },
    {
      path: '/manage-panels',
      icon: '🔧',
      label: 'Manage Panels',
      show: canAccessPanels() // Admin + Technician
    },
    {
      path: '/history',
      icon: '📋',
      label: 'Reports',
      show: canAccessHistory() // Admin only
    },
    {
      path: '/analytics',
      icon: '📈',
      label: 'Analytics',
      show: canAccessAnalytics() // Admin only
    },
    {
      path: '/settings',
      icon: '⚙️',
      label: 'Settings',
      show: canAccessSettings() // Admin only
    }
  ];

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <button 
          className="sidebar-toggle"
          onClick={onToggle}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? '▶️' : '◀️'}
        </button>
        {!isCollapsed && (
          <div className="sidebar-title">
            <span className="sidebar-icon">☀️</span>
            <span>Solar Monitor</span>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {menuItems.filter(item => item.show).map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
            title={isCollapsed ? item.label : ''}
          >
            <span className="sidebar-item-icon">{item.icon}</span>
            {!isCollapsed && <span className="sidebar-item-label">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {!isCollapsed && (
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {user?.firstName?.[0] || user?.username?.[0] || 'U'}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">
                {user?.firstName || user?.username}
              </div>
              <div className="sidebar-user-role">
                {user?.role}
              </div>
            </div>
          </div>
          <button 
            className="sidebar-logout-btn"
            onClick={() => {
              if (window.confirm('Are you sure you want to logout?')) {
                window.location.href = '/login';
              }
            }}
            title="Logout"
          >
            🚪
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;