import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ticketService = {
  getAllTickets: (status, sortBy) => {
    const params = {};
    if (status) params.status = status;
    if (sortBy) params.sortBy = sortBy;
    return api.get('/tickets', { params });
  },

  getTicketById: (id) => api.get(`/tickets/${id}`),

  createTicket: (data) => api.post('/tickets', data),

  updateTicket: (id, data) => api.patch(`/tickets/${id}`, data),
};

export default api;
