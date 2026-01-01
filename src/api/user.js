import { userRequest as request } from './request';

export const UserApi = {
  /**
   * Fetch all users from the database
   */
  getAll: () => request.get('/users'),

  /**
   * Create a new user record
   */
  create: (data) => request.post('/users', data),

  /**
   * Update user details by ID
   */
  update: (id, data) => request.put(`/users/${id}`, data),

  /**
   * Delete a user record by ID
   */
  delete: (id) => request.delete(`/users/${id}`),
};