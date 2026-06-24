import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import { message } from 'antd';

const api = axios.create({ baseURL: '/api', timeout: 10000 });

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    message.error(err.response?.data?.message || '请求失败');
    return Promise.reject(err);
  },
);

export default api;
