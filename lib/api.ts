import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// Request Interceptor to add JWT
// api.interceptors.request.use(
//   (config) => {
//     if (typeof window !== 'undefined') {
//       const authStorage = localStorage.getItem('auth-storage');
//       if (authStorage) {
//         try {
//           const parsed = JSON.parse(authStorage);
//           const token = parsed?.state?.token;
//           if (token && config.headers) {
//             config.headers.Authorization = `Bearer ${token}`;
//           }
//         } catch (e) {
//           console.error('Error parsing auth storage', e);
//         }
//       }
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );
