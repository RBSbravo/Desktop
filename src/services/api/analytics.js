/**
 * Analytics API service
 */
import httpClient from '../httpClient.js';

export const analyticsService = {
  async getAnalytics() {
    return httpClient.get('/analytics');
  },

  async getDashboardStats() {
    return httpClient.get('/analytics/dashboard');
  },

  async getDepartmentAnalytics(departmentId, params = {}) {
    const data = await httpClient.get(`/analytics/department/${departmentId}/analytics`, params);
    if (!data) {
      throw new Error('No analytics data returned from server');
    }
    return data;
  },

  async getUserPerformance(userId, params = {}) {
    return httpClient.get(`/analytics/user/${userId}/performance`, params);
  }
};

export default analyticsService; 