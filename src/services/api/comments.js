/**
 * Comments API service
 */
import httpClient from '../httpClient.js';

export const commentsService = {
  async getComments(ticketId) {
    return httpClient.get(`/comments/ticket/${ticketId}`);
  },

  async addComment(ticketId, comment) {
    return httpClient.post('/comments', { ...comment, ticketId });
  },

  async deleteComment(commentId) {
    return httpClient.delete(`/comments/${commentId}`);
  }
};

export default commentsService; 