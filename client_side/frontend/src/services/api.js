import axios from 'axios';

// In development: Vite proxy forwards /api → localhost:5000 (no env var needed)
// In production (Vercel): VITE_BACKEND_URL must point to the ngrok backend URL
const baseURL = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL}/api`
  : '/api';

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Token expired — clear storage so user is redirected to login
      const wasLoggedIn = !!localStorage.getItem('accessToken');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      if (wasLoggedIn && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
