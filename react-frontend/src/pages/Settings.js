import React, { useState, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Settings = () => {
  const { isDark, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('notifications');
  
  // Refs for each section
  const notificationsRef = useRef(null);
  const dashboardRef = useRef(null);
  const alertsRef = useRef(null);
  const systemRef = useRef(null);
  const appearanceRef = useRef(null);
  
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      sms: false,
      criticalOnly: false
    },
    dashboard: {
      refreshInterval: 30,
      showWeather: true,
      compactView: false,
      autoRefresh: true
    },
    alerts: {
      autoAcknowledge: false,
      soundEnabled: true,
      maxAlerts: 100,
      retentionDays: 30
    },
    system: {
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      temperatureUnit: 'C',
      powerUnit: 'W'
    }
  });

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    // Here you would save settings to backend
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
  };

  const scrollToSection = (sectionRef, sectionName) => {
    setActiveSection(sectionName);
    sectionRef.current?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">System Settings</h1>
          <p className="page-subtitle">
            Configure system preferences and behavior
          </p>
        </div>
        
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={() => window.location.reload()}>
            🔄 Reset
          </button>
          <button className="btn btn-primary" onClick={handleSaveSettings}>
            💾 Save Settings
          </button>
        </div>
      </div>

      <div className="settings-content">
        <div className="settings-nav">
          <div 
            className={`settings-nav-item ${activeSection === 'notifications' ? 'active' : ''}`}
            onClick={() => scrollToSection(notificationsRef, 'notifications')}
          >
            <span className="nav-icon">🔔</span>
            <span>Notifications</span>
          </div>
          <div 
            className={`settings-nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => scrollToSection(dashboardRef, 'dashboard')}
          >
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </div>
          <div 
            className={`settings-nav-item ${activeSection === 'alerts' ? 'active' : ''}`}
            onClick={() => scrollToSection(alertsRef, 'alerts')}
          >
            <span className="nav-icon">🚨</span>
            <span>Alerts</span>
          </div>
          <div 
            className={`settings-nav-item ${activeSection === 'system' ? 'active' : ''}`}
            onClick={() => scrollToSection(systemRef, 'system')}
          >
            <span className="nav-icon">⚙️</span>
            <span>System</span>
          </div>
          <div 
            className={`settings-nav-item ${activeSection === 'appearance' ? 'active' : ''}`}
            onClick={() => scrollToSection(appearanceRef, 'appearance')}
          >
            <span className="nav-icon">🎨</span>
            <span>Appearance</span>
          </div>
        </div>

        <div className="settings-main">
          {/* Appearance Settings */}
          <div className="settings-section" ref={appearanceRef}>
            <h3>Appearance</h3>
            <div className="setting-item">
              <div className="setting-info">
                <label>Theme</label>
                <p>Choose between light and dark theme</p>
              </div>
              <div className="setting-control">
                <button 
                  className={`theme-toggle ${isDark ? 'dark' : 'light'}`}
                  onClick={toggleTheme}
                >
                  <div className="theme-toggle-slider">
                    {isDark ? '🌙' : '☀️'}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="settings-section" ref={notificationsRef}>
            <h3>Notifications</h3>
            
            <div className="setting-item">
              <div className="setting-info">
                <label>Email Notifications</label>
                <p>Receive alerts via email</p>
              </div>
              <div className="setting-control">
                <input
                  type="checkbox"
                  checked={settings.notifications.email}
                  onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                />
              </div>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <label>Push Notifications</label>
                <p>Browser push notifications</p>
              </div>
              <div className="setting-control">
                <input
                  type="checkbox"
                  checked={settings.notifications.push}
                  onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                />
              </div>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <label>Critical Alerts Only</label>
                <p>Only notify for critical issues</p>
              </div>
              <div className="setting-control">
                <input
                  type="checkbox"
                  checked={settings.notifications.criticalOnly}
                  onChange={(e) => handleSettingChange('notifications', 'criticalOnly', e.target.checked)}
                />
              </div>
            </div>
          </div>

          {/* Dashboard Settings */}
          <div className="settings-section" ref={dashboardRef}>
            <h3>Dashboard</h3>
            
            <div className="setting-item">
              <div className="setting-info">
                <label>Refresh Interval</label>
                <p>How often to update dashboard data (seconds)</p>
              </div>
              <div className="setting-control">
                <select
                  value={settings.dashboard.refreshInterval}
                  onChange={(e) => handleSettingChange('dashboard', 'refreshInterval', parseInt(e.target.value))}
                >
                  <option value={10}>10 seconds</option>
                  <option value={30}>30 seconds</option>
                  <option value={60}>1 minute</option>
                  <option value={300}>5 minutes</option>
                </select>
              </div>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <label>Show Weather Information</label>
                <p>Display weather data on dashboard</p>
              </div>
              <div className="setting-control">
                <input
                  type="checkbox"
                  checked={settings.dashboard.showWeather}
                  onChange={(e) => handleSettingChange('dashboard', 'showWeather', e.target.checked)}
                />
              </div>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <label>Auto Refresh</label>
                <p>Automatically refresh dashboard data</p>
              </div>
              <div className="setting-control">
                <input
                  type="checkbox"
                  checked={settings.dashboard.autoRefresh}
                  onChange={(e) => handleSettingChange('dashboard', 'autoRefresh', e.target.checked)}
                />
              </div>
            </div>
          </div>

          {/* Alert Settings */}
          <div className="settings-section" ref={alertsRef}>
            <h3>Alert Management</h3>
            
            <div className="setting-item">
              <div className="setting-info">
                <label>Sound Notifications</label>
                <p>Play sound for new alerts</p>
              </div>
              <div className="setting-control">
                <input
                  type="checkbox"
                  checked={settings.alerts.soundEnabled}
                  onChange={(e) => handleSettingChange('alerts', 'soundEnabled', e.target.checked)}
                />
              </div>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <label>Maximum Alerts</label>
                <p>Maximum number of alerts to display</p>
              </div>
              <div className="setting-control">
                <input
                  type="number"
                  min="10"
                  max="1000"
                  value={settings.alerts.maxAlerts}
                  onChange={(e) => handleSettingChange('alerts', 'maxAlerts', parseInt(e.target.value))}
                />
              </div>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <label>Alert Retention</label>
                <p>Days to keep alert history</p>
              </div>
              <div className="setting-control">
                <select
                  value={settings.alerts.retentionDays}
                  onChange={(e) => handleSettingChange('alerts', 'retentionDays', parseInt(e.target.value))}
                >
                  <option value={7}>7 days</option>
                  <option value={30}>30 days</option>
                  <option value={90}>90 days</option>
                  <option value={365}>1 year</option>
                </select>
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="settings-section" ref={systemRef}>
            <h3>System Configuration</h3>
            
            <div className="setting-item">
              <div className="setting-info">
                <label>Timezone</label>
                <p>System timezone for timestamps</p>
              </div>
              <div className="setting-control">
                <select
                  value={settings.system.timezone}
                  onChange={(e) => handleSettingChange('system', 'timezone', e.target.value)}
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <label>Temperature Unit</label>
                <p>Display temperature in Celsius or Fahrenheit</p>
              </div>
              <div className="setting-control">
                <select
                  value={settings.system.temperatureUnit}
                  onChange={(e) => handleSettingChange('system', 'temperatureUnit', e.target.value)}
                >
                  <option value="C">Celsius (°C)</option>
                  <option value="F">Fahrenheit (°F)</option>
                </select>
              </div>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <label>Power Unit</label>
                <p>Display power in Watts or Kilowatts</p>
              </div>
              <div className="setting-control">
                <select
                  value={settings.system.powerUnit}
                  onChange={(e) => handleSettingChange('system', 'powerUnit', e.target.value)}
                >
                  <option value="W">Watts (W)</option>
                  <option value="kW">Kilowatts (kW)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;