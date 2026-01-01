import request from './request';

/**
 * User Module API
 * Endpoint: http://localhost:8080/api/v1/users
 */
export const UserApi = {
  // Get all users
  getAll: () => request.get('/users'),

  // Create user
  create: (data) => request.post('/users', data),

  // Update user
  update: (id, data) => request.put(`/users/${id}`, data),

  // Delete user
  delete: (id) => request.delete(`/users/${id}`),
};