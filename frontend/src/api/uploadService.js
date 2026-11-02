import axiosInstance from './axiosInstance';

// Uploads an image to the backend, which stores it in Amazon S3 and returns the public URL.
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axiosInstance
    .post('/files/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((r) => r.data);
};
