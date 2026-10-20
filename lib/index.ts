import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { BASE_URL } from '../config';

let isLoggingOut = false;

const api: AxiosInstance = axios.create({
     baseURL: BASE_URL,
     headers: {
          'Content-Type':
               'application/json',
          Accept: 'application/json'
     },
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
     (config: InternalAxiosRequestConfig) => {
          const token = typeof window !== 'undefined'
               ? window.localStorage.getItem('auth_token')
               : null;
          if (token && config.headers) {
               config.headers['Authorization'] = `Bearer ${token}`;
          }
          return config;
     },
     (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
     (response) => response,
     async (error: AxiosError) => {
          const requestUrl = error.config?.url || '';
          if (error.response?.status === 401 && requestUrl.includes('/admin/') && !isLoggingOut) {
               isLoggingOut = true;

               console.warn('Unauthenticated. Logging out...');

               try {
                    if (typeof window !== 'undefined') {
                         window.localStorage.removeItem('auth_token');
                         window.localStorage.removeItem('user');
                         window.dispatchEvent(new Event('parentfully:unauthorized'));
                    }
               } finally {
                    setTimeout(() => {
                         isLoggingOut = false;
                    }, 1000);
               }
          }

          return Promise.reject(error);
     }
);

export { api };
