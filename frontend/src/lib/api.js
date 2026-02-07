import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

// Tickets API
export const ticketsApi = {
  getAll: (params) => api.get('/tickets', { params }),
  getById: (id) => api.get(`/tickets/${id}`),
  create: (data) => api.post('/tickets', data),
  update: (id, data) => api.patch(`/tickets/${id}`, data),
  delete: (id) => api.delete(`/tickets/${id}`),
};

// Comments API
export const commentsApi = {
  getByTicketId: (ticketId, params) => api.get(`/tickets/${ticketId}/comments`, { params }),
  create: (ticketId, data) => api.post(`/tickets/${ticketId}/comments`, data),
};

export default api;
