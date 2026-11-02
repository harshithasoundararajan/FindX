import axiosInstance from './axiosInstance';

export const register = (payload) => axiosInstance.post('/auth/register', payload).then((r) => r.data);
export const login = (payload) => axiosInstance.post('/auth/login', payload).then((r) => r.data);
