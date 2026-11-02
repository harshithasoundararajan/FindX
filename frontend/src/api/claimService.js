import axiosInstance from './axiosInstance';

export const submitClaim = (payload) => axiosInstance.post('/claims', payload).then((r) => r.data);
export const getMyClaims = (params) => axiosInstance.get('/claims/mine', { params }).then((r) => r.data);
