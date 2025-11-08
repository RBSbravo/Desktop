/**
 * Tickets API service
 */
import httpClient from '../httpClient.js';

export const ticketsService = {
  async getTickets(params = {}) {
    const data = await httpClient.get('/tickets', params);
    // Handle backend response format consistency
    return data.tickets || data;
  },

  async addTicket(ticket) {
    return httpClient.post('/tickets', ticket);
  },

  async updateTicket(ticket) {
    return httpClient.put(`/tickets/${ticket.id}`, ticket);
  },

  async deleteTicket(id) {
    return httpClient.delete(`/tickets/${id}`);
  },

  async forwardTicket(ticketId, forwardData) {
    return httpClient.post(`/tickets/${ticketId}/forward`, forwardData);
  },

  async getTicketsForwardedToMe() {
    const data = await httpClient.get('/tickets/forwarded-to-me');
    // Handle both nested and direct response formats
    return data.tickets || data;
  }
};

export default ticketsService; 