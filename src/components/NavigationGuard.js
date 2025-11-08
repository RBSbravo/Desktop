import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const NavigationGuard = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      setLoading(true);
      
      // Simulate authentication check delay
      setTimeout(() => {
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        let authenticated = false;
        if (user && token) {
          try {
            const parsed = JSON.parse(user);
            authenticated = parsed && parsed.role === 'admin';
          } catch (e) {
            authenticated = false;
          }
        }
        setIsAuthenticated(authenticated);
        setLoading(false);
      }, 500);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <LoadingSpinner 
        message="Checking authentication..." 
        size="large"
      />
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default NavigationGuard; 