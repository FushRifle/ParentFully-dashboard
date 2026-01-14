import { api } from '../lib';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { AuthResponse, User } from '../types/api';

/* ----------------------------- LOCAL STORAGE HELPERS ----------------------------- */
const STORAGE_TOKEN = 'auth_token';
const STORAGE_USER = 'user';

const setStoredToken = (token: string) => localStorage.setItem(STORAGE_TOKEN, token);
const setStoredUser = (user: User) => localStorage.setItem(STORAGE_USER, JSON.stringify(user));
const removeStoredAuth = () => {
     localStorage.removeItem(STORAGE_TOKEN);
     localStorage.removeItem(STORAGE_USER);
};
const getStoredUser = (): User | null => {
     const json = localStorage.getItem(STORAGE_USER);
     return json ? JSON.parse(json) : null;
};

/* ----------------------------- AUTHENTICATION ----------------------------- */
export const register = async (data: {
     name: string;
     email: string;
     password: string;
     phone_number: string;
     referral_code?: string;
     password_confirmation: string;
     terms_accepted: boolean;
}): Promise<AuthResponse | null> => {
     try {
          const res = await api.post<{ success: boolean; data: AuthResponse }>('/v1/register', data);
          const authData = res.data?.data;

          if (authData?.access_token) {
               setStoredToken(authData.access_token);
               if (authData.user) setStoredUser(authData.user);
               return authData;
          } else {
               console.warn('No token returned from API', res.data);
               return null;
          }
     } catch (err: any) {
          console.error('Register API failed:', err.response?.data || err.message || err);
          return null;
     }
};

export const login = async (data: { email: string; password: string }): Promise<AuthResponse | null> => {
     try {
          const res = await api.post<{ success: boolean; data: AuthResponse }>('/v1/login', data);
          const authData = res.data?.data;

          if (authData?.access_token) {
               setStoredToken(authData.access_token);
               if (authData.user) setStoredUser(authData.user);
               return authData;
          } else {
               console.warn('No token returned from API', res.data);
               return null;
          }
     } catch (err: any) {
          console.error('Login API failed:', err.response?.data || err.message || err);
          return null;
     }
};

export const logout = async (): Promise<void> => {
     try {
          await api.post('/v1/logout');
     } catch (err: any) {
          console.error('Logout API failed:', err.response?.data || err.message || err);
     } finally {
          removeStoredAuth();
     }
};

/* --------------------------------- PROFILE -------------------------------- */
export const getUser = async (): Promise<User | null> => {
     try {
          const res = await api.get<{ success: boolean; data: User }>('/v1/user');
          const userData = res.data?.data;

          if (userData) setStoredUser(userData);
          return userData ?? null;
     } catch (err: any) {
          console.error('Get user API failed:', err.response?.data || err.message || err);
          removeStoredAuth();
          return null;
     }
};

export const getUserByID = async (id: number): Promise<User | null> => {
     try {
          const res = await api.get<{ success: boolean; data: User }>(`/v1/users/${id}`);
          return res.data?.data ?? null;
     } catch (err: any) {
          console.error('Error fetching user:', err.response?.data || err.message || err);
          return null;
     }
};

export const updateProfile = async (data: Partial<User> | FormData): Promise<User | null> => {
     try {
          const isFormData = data instanceof FormData;
          const config: AxiosRequestConfig = isFormData
               ? { headers: { 'Content-Type': 'multipart/form-data' } }
               : {};

          const res = await api.post<{ success: boolean; data: User }>('/v1/user', data, config);
          const updatedUser = res.data?.data;
          if (updatedUser) setStoredUser(updatedUser);
          return updatedUser ?? null;
     } catch (err: any) {
          console.error('Update profile failed:', err.response?.data || err.message || err);
          return null;
     }
};

export const updateUserFlags = async (flags: {
     has_completed_onboarding?: boolean;
     has_sent_invite?: boolean;
     has_seen_success?: boolean;
}): Promise<User | null> => {
     try {
          const res = await api.put<{ success: boolean; data: User }>('/v1/user', flags);
          const updatedUser = res.data?.data;
          if (updatedUser) setStoredUser(updatedUser);
          return updatedUser ?? null;
     } catch (err: any) {
          console.error('Update user flags failed:', err.response?.data || err.message || err);
          throw err;
     }
};

/* ---------------------------- PASSWORD RECOVERY --------------------------- */
export const sendVerifyCode = async (email: string): Promise<boolean> => {
     try {
          const res = await api.post<{ success: boolean }>('/v1/forgot-password', { email });
          return res.data?.success ?? false;
     } catch (err: unknown) {
          if (axios.isAxiosError(err)) {
               console.error('[sendVerifyCode] Axios error', {
                    message: err.message,
                    responseData: err.response?.data,
                    status: err.response?.status,
               });
          } else {
               console.error('[sendVerifyCode] Unexpected error', err);
          }
          return false;
     }
};

export const verifyResetCode = async (data: { email: string; code: string }): Promise<boolean> => {
     try {
          const res = await api.post('/v1/verify-reset-code', data);
          return res.data?.success ?? false;
     } catch (err: any) {
          console.error('Verify reset code failed:', err.response?.data || err.message || err);
          return false;
     }
};

export const resetPassword = async (data: {
     email: string;
     code: string;
     password: string;
     password_confirmation: string;
}): Promise<boolean> => {
     try {
          const res = await api.post('/v1/reset-password', data);
          return res.data?.success ?? false;
     } catch (err: any) {
          console.error('Reset password failed:', err.response?.data || err.message || err);
          return false;
     }
};

export const resendVerifyCode = async (email: string): Promise<boolean> => {
     try {
          const res = await api.post('/v1/resend-reset-code', { email });
          return res.data?.success ?? false;
     } catch (err: any) {
          console.error('Resend verify code failed:', err.response?.data || err.message || err);
          return false;
     }
};

/* ---------------------------- UTILITY --------------------------- */
export const getStoredUserData = (): User | null => getStoredUser();
export const getStoredToken = (): string | null => localStorage.getItem(STORAGE_TOKEN);
