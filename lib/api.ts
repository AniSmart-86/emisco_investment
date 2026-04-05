import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});


// api.ts
api.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem("auth-storage") || "{}")?.state?.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});