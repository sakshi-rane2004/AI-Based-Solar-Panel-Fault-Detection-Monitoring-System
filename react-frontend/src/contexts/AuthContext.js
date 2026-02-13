import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, getCurrentUser, isAuthenticated, hasRole, hasAnyRole } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const initializeAuth = async () => {
      try {
        if (isAuthenticated()) {
          const currentUser = getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            setIsLoggedIn(true);
            
            // Validate token with server
            try {
              await authAPI.validateToken();
            } catch (error) {
              console.error('Token validation failed:', error);
              logout();
            }
          }
        } else {
          // Auto-login as admin for demo purposes
          const defaultUser = {
            id: 1,
            username: 'admin',
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@solarpanel.com',
            role: 'ADMIN'
          };
          setUser(defaultUser);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Set default user even on error
        const defaultUser = {
          id: 1,
          username: 'admin',
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@solarpanel.com',
          role: 'ADMIN'
        };
        setUser(defaultUser);
        setIsLoggedIn(true);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authAPI.login(credentials);
      
      setUser(response);
      setIsLoggedIn(true);
      
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authAPI.register(userData);
      
      setUser(response);
      setIsLoggedIn(true);
      
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  const updateProfile = async () => {
    try {
      const profile = await authAPI.getProfile();
      setUser(profile);
      return profile;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await authAPI.changePassword(currentPassword, newPassword);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Role-based access control helpers
  const userHasRole = (role) => {
    return user && user.role === role;
  };

  const userHasAnyRole = (roles) => {
    return user && roles.includes(user.role);
  };

  const isAdmin = () => {
    return userHasRole('ADMIN');
  };

  const isTechnician = () => {
    return userHasRole('TECHNICIAN');
  };

  const isViewer = () => {
    return userHasRole('VIEWER');
  };

  // Access control based on new role requirements
  const canAccessAnalytics = () => {
    return userHasAnyRole(['ADMIN']); // Only Admin can access analytics
  };

  const canAccessHistory = () => {
    return userHasAnyRole(['ADMIN']); // Only Admin can access reports
  };

  const canAnalyze = () => {
    return userHasAnyRole(['ADMIN', 'TECHNICIAN']); // Admin and Technician can analyze
  };

  const canAccessPanels = () => {
    return userHasAnyRole(['ADMIN', 'TECHNICIAN']); // Admin and Technician can access panels
  };

  const canAccessAlerts = () => {
    return userHasAnyRole(['ADMIN', 'TECHNICIAN']); // Admin and Technician can access alerts
  };

  const canAccessSettings = () => {
    return isAdmin(); // Only Admin can access settings
  };

  const canAccessUserManagement = () => {
    return isAdmin(); // Only Admin can manage users
  };

  const canAssignWork = () => {
    return isAdmin(); // Only Admin can assign work
  };

  const hasFullAccess = () => {
    return isAdmin(); // Only Admin has full access
  };

  const value = {
    user,
    loading,
    isLoggedIn,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    userHasRole,
    userHasAnyRole,
    isAdmin,
    isTechnician,
    isViewer,
    canAccessAnalytics,
    canAccessHistory,
    canAnalyze,
    canAccessPanels,
    canAccessAlerts,
    canAccessSettings,
    canAccessUserManagement,
    canAssignWork,
    hasFullAccess
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};