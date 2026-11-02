import axiosInstance from './axiosInstance';

export const getUsers = (params) => axiosInstance.get('/admin/users', { params }).then((r) => r.data);
export const setUserStatus = (id, enabled) =>
  axiosInstance.patch(`/admin/users/${id}/status`, null, { params: { enabled } }).then((r) => r.data);
export const getStats = () => axiosInstance.get('/admin/stats').then((r) => r.data);
export const getAllClaims = (params) => axiosInstance.get('/admin/claims', { params }).then((r) => r.data);
export const decideClaim = (id, decision) =>
  axiosInstance.patch(`/admin/claims/${id}/decision`, { decision }).then((r) => r.data);
export const createCategory = (payload) => axiosInstance.post('/admin/categories', payload).then((r) => r.data);
export const deleteCategory = (id) => axiosInstance.delete(`/admin/categories/${id}`).then((r) => r.data);
export const createLocation = (payload) => axiosInstance.post('/admin/locations', payload).then((r) => r.data);
export const deleteLocation = (id) => axiosInstance.delete(`/admin/locations/${id}`).then((r) => r.data);
