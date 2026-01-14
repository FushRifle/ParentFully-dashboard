import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
     async (config: InternalAxiosRequestConfig) => {
          const token = await AsyncStorage.getItem('auth_token');
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
          if (error.response?.status === 401 && !isLoggingOut) {
               isLoggingOut = true;

               console.warn('Unauthenticated. Logging out...');

               try {
                    await AsyncStorage.multiRemove(['auth_token', 'user']);
               } catch (e) {
                    console.error('Error clearing auth data:', e);
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
