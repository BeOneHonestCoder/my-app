import { adminRequest as request } from './request';

export const WiremockApi = {
  /**
   * Fetch all stub mappings from WireMock
   */
  getAll: () => request.get('/mappings').then(res => res.mappings || []),

  /**
   * Create a new stub mapping
   */
  create: (data) => request.post('/mappings', data),

  /**
   * Update an existing stub mapping by ID
   */
  update: (id, data) => request.put(`/mappings/${id}`, data),

  /**
   * Remove a stub mapping by ID
   */
  delete: (id) => request.delete(`/mappings/${id}`),
};