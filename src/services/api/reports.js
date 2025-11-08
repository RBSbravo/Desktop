/**
 * Reports API service
 */
import httpClient from '../httpClient.js';

export const reportsService = {
  async getReports() {
    return httpClient.get('/analytics/reports');
  },

  async addReport(report) {
    return httpClient.post('/analytics/reports', report);
  },

  async updateReport(report) {
    return httpClient.put(`/analytics/reports/${report.id}`, report);
  },

  async deleteReport(id) {
    return httpClient.delete(`/analytics/reports/${id}`);
  }
};

export default reportsService; 