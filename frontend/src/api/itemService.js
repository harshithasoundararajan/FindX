import axiosInstance from './axiosInstance';

export const searchItems = (params) => axiosInstance.get('/items', { params }).then((r) => r.data);
export const getItem = (id) => axiosInstance.get(`/items/${id}`).then((r) => r.data);
export const createItem = (payload) => axiosInstance.post('/items', payload).then((r) => r.data);
export const updateItem = (id, payload) => axiosInstance.put(`/items/${id}`, payload).then((r) => r.data);
export const deleteItem = (id) => axiosInstance.delete(`/items/${id}`).then((r) => r.data);
export const getMyItems = (params) => axiosInstance.get('/items/mine', { params }).then((r) => r.data);
export const markItemReturned = (id) => axiosInstance.patch(`/items/${id}/return`).then((r) => r.data);
