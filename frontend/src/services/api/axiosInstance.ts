import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { keysToCamel, keysToSnake } from '@/utils/caseConv';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

const getAccessToken = (): string | null => {
  return localStorage.getItem('access_token');
};

const getRefreshToken = (): string | null => {
  return localStorage.getItem('refresh_token');
};

const setAccessToken = (token: string | null): void => {
  if (token && token !== 'undefined') {
    localStorage.setItem('access_token', token);
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('access_token');
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

const setRefreshToken = (token: string | null): void => {
  if (token && token !== 'undefined') {
    localStorage.setItem('refresh_token', token);
  } else {
    localStorage.removeItem('refresh_token');
  }
};

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    // Don't transform FormData — browser must set the multipart boundary header
    if (config.data && !(config.data instanceof FormData)) {
      config.data = keysToSnake(config.data);
    }
    if (config.params) {
      config.params = keysToSnake(config.params);
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data) {
      response.data = keysToCamel(response.data);
    }
    return response;
  },
  async (error: AxiosError<{ detail?: string }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve: () => resolve(axiosInstance(originalRequest)), reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token available");
        
        const response = await axiosInstance.post<{ accessToken: string, refreshToken: string }>(`/auth/refresh?token=${refreshToken}`);
        const newToken = response.data.accessToken;
        
        setAccessToken(newToken);
        if (response.data.refreshToken) {
            setRefreshToken(response.data.refreshToken);
        }
        processQueue(null, newToken);
        
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        setAccessToken(null);
        setRefreshToken(null);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const status = error.response?.status;
    
    if (status === 429) {
      const retryAfter = error.response?.headers['retry-after'];
      console.warn(`Rate limited. Retry after ${retryAfter} seconds`);
    } else if (status && status >= 500) {
      console.error('Server error:', error.response?.data);
    }

    return Promise.reject(error);
  }
);

export { setAccessToken, getAccessToken, setRefreshToken, getRefreshToken };
