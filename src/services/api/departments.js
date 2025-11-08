/**
 * Departments API service
 */
import httpClient from '../httpClient.js';

export const departmentsService = {
  async getDepartments() {
    return httpClient.get('/departments');
  },

  async addDepartment(department) {
    return httpClient.post('/departments', department);
  },

  async updateDepartment(department) {
    return httpClient.put(`/departments/${department.id}`, department);
  },

  async deleteDepartment(id) {
    return httpClient.delete(`/departments/${id}`);
  }
};

export default departmentsService; 