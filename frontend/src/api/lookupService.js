import axiosInstance from './axiosInstance';

export const getCategories = () => axiosInstance.get('/categories').then((r) => r.data);
export const getLocations = () => axiosInstance.get('/locations').then((r) => r.data);
