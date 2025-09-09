import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  // needed to send/receive the refresh cookie
  withCredentials: true, 
});

// Attach token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers ||= {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh on 401 (queues pending requests)
let isRefreshing = false;
let pending = [];

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config || {};
    if (error.response?.status === 401 && !original._retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const { data } = await api.post('/auth/refresh');
          localStorage.setItem('accessToken', data.accessToken);
          pending.forEach((fn) => fn(data.accessToken));
          pending = [];
          isRefreshing = false;

          original._retry = true;
          original.headers ||= original.headers || {};
          original.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(original);
        } catch (e) {
          isRefreshing = false;
          pending = [];
          localStorage.removeItem('accessToken');
          return Promise.reject(e);
        }
      }

      return new Promise((resolve) => {
        pending.push((newToken) => {
          original._retry = true;
          original.headers ||= {};
          original.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(original));
        });
      });
    }

    return Promise.reject(error);
  }
);