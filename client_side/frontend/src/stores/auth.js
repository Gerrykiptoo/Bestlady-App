import { defineStore } from 'pinia';
import api from '@/services/api';

const safeParseJson = (key, defaultValue = null) => {
  const item = localStorage.getItem(key);
  if (!item || item === 'undefined') return defaultValue;
  try {
    return JSON.parse(item);
  } catch (e) {
    console.error(`Failed to parse ${key} from localStorage`, e);
    return defaultValue;
  }
};

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: safeParseJson('user'),
    token: localStorage.getItem('accessToken') || null,
    loading: false,
    error: null
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    role: (state) => state.user?.role || 'user'
  },
  actions: {
    async login(credentials) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.post('/auth/login', credentials);
        this.token = data.accessToken;
        this.user = data.user;
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Login failed';
        throw err;
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    },
    updateUser(userData) {
      this.user = { ...this.user, ...userData };
      localStorage.setItem('user', JSON.stringify(this.user));
    },
    async refreshUserData() {
      try {
        const { data } = await api.get('/auth/me');
        this.user = data.user;
        localStorage.setItem('user', JSON.stringify(data.user));
        return data.user;
      } catch (error) {
        console.error('Failed to refresh user data:', error);
        throw error;
      }
    }
  }
});