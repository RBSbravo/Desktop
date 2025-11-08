/**
 * Notifications API service
 */
import httpClient from '../httpClient.js';

export const notificationsService = {
  async getNotifications() {
    return httpClient.get('/notifications');
  },

  async getUnreadNotifications() {
    return httpClient.get('/notifications/unread');
  },

  async getUnreadNotificationCount() {
    const data = await httpClient.get('/notifications/unread/count');
    return data.count;
  },

  async markNotificationAsRead(id) {
    return httpClient.put(`/notifications/${id}/read`);
  },

  async markAllNotificationsAsRead() {
    return httpClient.put('/notifications/read-all');
  },

  async deleteNotification(id) {
    return httpClient.delete(`/notifications/${id}`);
  }
};

export default notificationsService; 