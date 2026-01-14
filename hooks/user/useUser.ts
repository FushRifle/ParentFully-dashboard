import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { api } from '../../lib';
import { User } from '../../types/api';


/* ----------------------------- LOCAL STORAGE HELPERS ----------------------------- */
const STORAGE_USER = 'user';
const STORAGE_TOKEN = 'auth_token';

const setStoredUser = (user: User) => localStorage.setItem(STORAGE_USER, JSON.stringify(user));
const removeStoredAuth = () => {
     localStorage.removeItem(STORAGE_USER);
     localStorage.removeItem(STORAGE_TOKEN);
};

export const getStoredUser = (): User | null => {
     if (typeof window === 'undefined') return null;
     const userJson = localStorage.getItem(STORAGE_USER);
     return userJson ? JSON.parse(userJson) : null;
};

export const getStoredToken = (): string | null => {
     if (typeof window === 'undefined') return null;
     return localStorage.getItem(STORAGE_TOKEN);
};
/* ----------------------------- HOOK ----------------------------- */
export const useUser = () => {
     const [user, setUser] = useState<User | null>(getStoredUser());
     const [isLoading, setIsLoading] = useState<boolean>(!user);
     const [error, setError] = useState<string | null>(null);

     const fetchUser = useCallback(async () => {
          setIsLoading(true);
          setError(null);
          try {
               const res = await api.get<{ success: boolean; data: User }>('/v1/user');
               const userData = res.data?.data ?? null;

               if (userData) setStoredUser(userData);
               setUser(userData);
               return userData;
          } catch (err: any) {
               console.error('Get user API failed:', err.response?.data || err.message || err);
               removeStoredAuth();
               setUser(null);
               setError('Failed to load user');
               return null;
          } finally {
               setIsLoading(false);
          }
     }, []);

     const updateProfile = useCallback(
          async (data: Partial<User> | FormData): Promise<User | null> => {
               try {
                    const isFormData = data instanceof FormData;
                    const config: AxiosRequestConfig = isFormData
                         ? { headers: { 'Content-Type': 'multipart/form-data' } }
                         : {};

                    const res = await api.post<{ success: boolean; data: User }>('/v1/user', data, config);
                    const updatedUser = res.data?.data ?? null;
                    if (updatedUser) setStoredUser(updatedUser);
                    setUser(updatedUser);
                    return updatedUser;
               } catch (err: any) {
                    console.error('Update profile failed:', err.response?.data || err.message || err);
                    return null;
               }
          },
          []
     );

     useEffect(() => {
          if (!user) {
               fetchUser();
          }
     }, [user, fetchUser]);

     return {
          user,
          isLoading,
          error,
          fetchUser,
          updateProfile,
     };
};
