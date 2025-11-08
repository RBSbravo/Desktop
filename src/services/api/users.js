/**
 * Users API service
 */
import httpClient from '../httpClient.js';

export const usersService = {
  async getUsers(params = {}) {
    return httpClient.get('/users', params);
  },

  async getPendingUsers() {
    return httpClient.get('/users', { status: 'pending' });
  },

  async getCurrentUserProfile() {
    return httpClient.get('/users/profile');
  },

  async addUser(user) {
    return httpClient.post('/users', user);
  },

  async updateUser(user) {
    return httpClient.put(`/users/${user.id}`, user);
  },

  async deleteUser(id) {
    return httpClient.delete(`/users/${id}`);
  },

  async approvePendingUser(id) {
    return httpClient.patch(`/users/${id}/approve`);
  },

  async rejectPendingUser(id) {
    return httpClient.patch(`/users/${id}/reject`);
  }
};

export default usersService; 