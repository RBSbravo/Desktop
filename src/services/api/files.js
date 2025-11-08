/**
 * Files API service
 */
import httpClient from '../httpClient.js';

export const filesService = {
  async getFiles(ticketId) {
    return httpClient.get(`/files/ticket/${ticketId}`);
  },

  async uploadFile(file, ticketId) {
    const formData = new FormData();
    formData.append('file', file);
    return httpClient.post(`/files/ticket/${ticketId}`, formData, true);
  },

  async deleteFile(fileId) {
    return httpClient.delete(`/files/${fileId}`);
  },

  async downloadFile(fileId) {
    return httpClient.download(`/files/${fileId}/download`);
  }
};

export default filesService; 