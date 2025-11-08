// Environment Configuration for Desktop App
// This file sets the port and other configuration to avoid conflicts

const config = {
  // Port configuration to avoid conflicts with web app
  PORT: 3001,
  
  // React App Configuration
  REACT_APP_NAME: 'Desktop Task Management System',
  REACT_APP_VERSION: '1.0.0',
  
  // API Configuration (for Railway backend integration)
  REACT_APP_API_BASE_URL: 'https://backend-ticketing-system.up.railway.app/api',
  
  // Feature Flags
  REACT_APP_ENABLE_FILE_UPLOAD: true,
  REACT_APP_ENABLE_REAL_TIME_NOTIFICATIONS: true,
  
  // Development Settings
  REACT_APP_DEBUG_MODE: true,
  REACT_APP_MOCK_DATA_ENABLED: true,
  
  // File Upload Settings
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES_PER_TICKET: 5,
  ALLOWED_FILE_TYPES: ['*/*'],
  
  // Theme Settings
  DEFAULT_THEME: 'light',
  PRIMARY_COLOR: '#2E7D32',
  SECONDARY_COLOR: '#4CAF50'
};

// Set environment variables
Object.keys(config).forEach(key => {
  process.env[key] = config[key];
});

module.exports = config; 