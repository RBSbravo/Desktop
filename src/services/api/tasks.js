/**
 * Tasks API service
 */
import httpClient from '../httpClient.js';

export const tasksService = {
  async getTasks() {
    return httpClient.get('/tasks');
  },

  async addTask(task) {
    return httpClient.post('/tasks', task);
  },

  async updateTask(task) {
    return httpClient.put(`/tasks/${task.id}`, task);
  },

  async deleteTask(id) {
    return httpClient.delete(`/tasks/${id}`);
  }
};

export default tasksService; 