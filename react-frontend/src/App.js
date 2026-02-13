import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Panels from './pages/Panels';
import Alerts from './pages/Alerts';
import Analyze from './pages/Analyze';
import History from './pages/History';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AdminUserManagement from './pages/AdminUserManagement';
import PlantManagement from './pages/PlantManagement';
import PanelManagement from './pages/PanelManagement';
import Login from './pages/Login';
import Register from './pages/Register';
import ApiTest from './components/ApiTest';
import './App.css';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Auth routes without sidebar */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Main app routes with sidebar */}
              <Route path="/*" element={
                <>
                  <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />
                  <div className={`main-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                    <Header />
                    <main className="main-content">
                      <div className="container">
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/panels" element={<Panels />} />
                          <Route path="/alerts" element={<Alerts />} />
                          <Route path="/analyze" element={<Analyze />} />
                          <Route path="/history" element={<History />} />
                          <Route path="/analytics" element={<Analytics />} />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="/admin/users" element={<AdminUserManagement />} />
                          <Route path="/plants" element={<PlantManagement />} />
                          <Route path="/manage-panels" element={<PanelManagement />} />
                          <Route path="/test" element={<ApiTest />} />
                          
                          {/* Redirect unknown routes to dashboard */}
                          <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                      </div>
                    </main>
                  </div>
                </>
              } />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;