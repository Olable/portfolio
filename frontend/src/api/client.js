import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem('refresh');
      if (refresh) {
        try {
          const { data } = await axios.post('/api/auth/refresh/', { refresh });
          localStorage.setItem('access', data.access);
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return api(originalRequest);
        } catch (e) {
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
