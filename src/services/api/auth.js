/**
 * Authentication API service
 */
import httpClient from '../httpClient.js';

export const authService = {
  async login(email, password) {
    const data = await httpClient.postPublic('/auth/login', { email, password });
    
    if (data.user.role !== 'admin') {
      throw new Error('Only admin users can log in from the desktop app.');
    }
    
    // Store token and user info
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data.user;
  },

  async registerAdmin({ firstname, lastname, email, password }) {
    return httpClient.postPublic('/auth/register', { 
      firstname, 
      lastname, 
      email, 
      password 
    });
  },

  async changePassword({ currentPassword, newPassword }) {
    return httpClient.post('/auth/change-password', { 
      currentPassword, 
      newPassword 
    });
  },

  async forgotPassword(email) {
    return httpClient.postPublic('/auth/forgot-password', { email });
  },

  async resetPassword(token, password) {
    return httpClient.postPublic('/auth/reset-password', { token, password });
  }
};

export default authService; 