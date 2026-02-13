import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8081/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('API instance created with baseURL:', api.defaults.baseURL);

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      console.error(`HTTP ${status}:`, data);
      
      if (status === 404) {
        throw new Error('Resource not found');
      } else if (status === 500) {
        throw new Error('Internal server error. Please try again later.');
      } else if (data && data.message) {
        throw new Error(data.message);
      }
    } else if (error.request) {
      // Network error
      throw new Error('Network error. Please check your connection and try again.');
    }
    
    throw error;
  }
);

// Solar Panel API
export const solarPanelAPI = {
  // Analyze sensor data
  analyzeSensorData: async (sensorData) => {
    try {
      const response = await api.post('/solar-panel/analyze', sensorData);
      return response.data;
    } catch (error) {
      throw new Error(`Analysis failed: ${error.message}`);
    }
  },

  // Get prediction history
  getHistory: async (params = {}) => {
    try {
      const response = await api.get('/solar-panel/history', { params });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch history: ${error.message}`);
    }
  },

  // Get recent predictions
  getRecentHistory: async () => {
    try {
      const response = await api.get('/solar-panel/history/recent');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch recent history: ${error.message}`);
    }
  },

  // Get prediction by ID
  getPredictionById: async (id) => {
    try {
      const response = await api.get(`/solar-panel/history/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch prediction: ${error.message}`);
    }
  },

  // Get analytics summary
  getAnalyticsSummary: async () => {
    try {
      const response = await api.get('/analytics/summary');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch analytics summary: ${error.message}`);
    }
  },

  // Get analytics trends
  getAnalyticsTrends: async (params = {}) => {
    try {
      const response = await api.get('/analytics/trends', { params });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch analytics trends: ${error.message}`);
    }
  },

  // Get fault type statistics
  getFaultTypeStatistics: async () => {
    try {
      const response = await api.get('/solar-panel/statistics/fault-types');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch statistics: ${error.message}`);
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/solar-panel/health');
      return response.data;
    } catch (error) {
      throw new Error(`Health check failed: ${error.message}`);
    }
  },

  // Analytics health check
  analyticsHealthCheck: async () => {
    try {
      const response = await api.get('/analytics/health');
      return response.data;
    } catch (error) {
      throw new Error(`Analytics health check failed: ${error.message}`);
    }
  }
};

// Solar Plant Management API
export const plantAPI = {
  // Create a new plant
  createPlant: async (plantData) => {
    try {
      const response = await api.post('/plants', plantData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create plant: ${error.message}`);
    }
  },

  // Get all plants
  getAllPlants: async () => {
    try {
      const response = await api.get('/plants');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch plants: ${error.message}`);
    }
  },

  // Get plant by ID
  getPlantById: async (id) => {
    try {
      const response = await api.get(`/plants/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch plant: ${error.message}`);
    }
  },

  // Update plant
  updatePlant: async (id, plantData) => {
    try {
      const response = await api.put(`/plants/${id}`, plantData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update plant: ${error.message}`);
    }
  },

  // Delete plant
  deletePlant: async (id) => {
    try {
      await api.delete(`/plants/${id}`);
    } catch (error) {
      throw new Error(`Failed to delete plant: ${error.message}`);
    }
  }
};

// Solar Panel Management API
export const panelAPI = {
  // Create a new panel
  createPanel: async (panelData) => {
    try {
      const response = await api.post('/panels', panelData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create panel: ${error.message}`);
    }
  },

  // Get all panels
  getAllPanels: async () => {
    try {
      const response = await api.get('/panels');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch panels: ${error.message}`);
    }
  },

  // Get panels by plant
  getPanelsByPlant: async (plantId) => {
    try {
      const response = await api.get(`/panels/plant/${plantId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch panels: ${error.message}`);
    }
  },

  // Get panel by ID
  getPanelById: async (id) => {
    try {
      const response = await api.get(`/panels/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch panel: ${error.message}`);
    }
  },

  // Update panel
  updatePanel: async (id, panelData) => {
    try {
      const response = await api.put(`/panels/${id}`, panelData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update panel: ${error.message}`);
    }
  },

  // Delete panel
  deletePanel: async (id) => {
    try {
      await api.delete(`/panels/${id}`);
    } catch (error) {
      throw new Error(`Failed to delete panel: ${error.message}`);
    }
  }
};

// Alert API
export const alertAPI = {
  // Get all alerts
  getAllAlerts: async () => {
    try {
      const response = await api.get('/alerts');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch alerts: ${error.message}`);
    }
  },

  // Get unacknowledged alerts
  getUnacknowledgedAlerts: async () => {
    try {
      const response = await api.get('/alerts/unacknowledged');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch unacknowledged alerts: ${error.message}`);
    }
  },

  // Get alerts by panel
  getAlertsByPanel: async (panelId) => {
    try {
      const response = await api.get(`/alerts/panel/${panelId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch alerts for panel: ${error.message}`);
    }
  },

  // Get alerts by severity
  getAlertsBySeverity: async (severity) => {
    try {
      const response = await api.get(`/alerts/severity/${severity}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch alerts by severity: ${error.message}`);
    }
  },

  // Get alerts by status
  getAlertsByStatus: async (status) => {
    try {
      const response = await api.get(`/alerts/status/${status}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch alerts by status: ${error.message}`);
    }
  },

  // Acknowledge alert
  acknowledgeAlert: async (alertId, userId) => {
    try {
      const response = await api.post(`/alerts/${alertId}/acknowledge`, null, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to acknowledge alert: ${error.message}`);
    }
  },

  // Update alert status
  updateAlertStatus: async (alertId, status, userId) => {
    try {
      const response = await api.put(`/alerts/${alertId}/status`, null, {
        params: { status, userId }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update alert status: ${error.message}`);
    }
  },

  // Assign technician
  assignTechnician: async (alertId, technicianId) => {
    try {
      const response = await api.put(`/alerts/${alertId}/assign`, null, {
        params: { technicianId }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to assign technician: ${error.message}`);
    }
  },

  // Add technician notes
  addTechnicianNotes: async (alertId, notes) => {
    try {
      const response = await api.put(`/alerts/${alertId}/notes`, notes, {
        headers: { 'Content-Type': 'text/plain' }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to add notes: ${error.message}`);
    }
  },

  // Get statistics
  getUnacknowledgedCount: async () => {
    try {
      const response = await api.get('/alerts/stats/unacknowledged-count');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch unacknowledged count: ${error.message}`);
    }
  },

  getCriticalCount: async () => {
    try {
      const response = await api.get('/alerts/stats/critical-count');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch critical count: ${error.message}`);
    }
  }
};

// Dashboard API
export const dashboardAPI = {
  // Get dashboard statistics
  getStats: async () => {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch dashboard stats: ${error.message}`);
    }
  }
};

// Utility functions
export const formatError = (error) => {
  if (error.response && error.response.data) {
    return error.response.data.message || 'An error occurred';
  }
  return error.message || 'An unexpected error occurred';
};

export const isNetworkError = (error) => {
  return !error.response && error.request;
};

export default api;


// Authentication API
export const authAPI = {
  // Login
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      // Store token and user info
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        // Set token in axios headers
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      return response.data;
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  },

  // Register
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      // Store token and user info
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        // Set token in axios headers
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      return response.data;
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  },

  // Logout
  logout: async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Get profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch profile: ${error.message}`);
    }
  },

  // Validate token
  validateToken: async () => {
    try {
      const response = await api.get('/auth/validate');
      return response.data;
    } catch (error) {
      throw new Error(`Token validation failed: ${error.message}`);
    }
  },

  // Check password strength
  checkPasswordStrength: async (password) => {
    try {
      const response = await api.post('/auth/check-password-strength', { password });
      return response.data;
    } catch (error) {
      throw new Error(`Password strength check failed: ${error.message}`);
    }
  }
};

// Authentication helper functions
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  return null;
};

export const hasRole = (role) => {
  const user = getCurrentUser();
  return user && user.role === role;
};

export const hasAnyRole = (roles) => {
  const user = getCurrentUser();
  return user && roles.includes(user.role);
};

export const getToken = () => {
  return localStorage.getItem('token');
};

// Set token in axios headers on app load
const token = getToken();
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
