import api from './client.js';

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials).then((r) => r.data),
  registerUser: (payload) => api.post('/auth/register-normal-user', payload).then((r) => r.data),
  registerAdmin: (payload) => api.post('/admin/registeradminuser', payload).then((r) => r.data),
};

export const noticeApi = {
  getAll: () => api.get('/api/notices/allnotices').then((r) => r.data),
  getById: (id) => api.get(`/api/notices/notice/${id}`).then((r) => r.data),
  create: (payload) => api.post('/api/notices/create-notices', payload).then((r) => r.data),
  update: (id, payload) =>
    api.put(`/api/notices/update-notice-details/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/api/notices/delete-notice/${id}`),
};
