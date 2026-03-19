import { api } from '@/lib';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
     AuthResponse, User,
     GoogleSignInPayload, AppleSignInPayload
} from '@/types/api';

interface VerifyResetCodeResponse {
     token: string
     message?: string
     status?: string
}

/* ----------------------------- AUTHENTICATION ----------------------------- */
export const register = async (data: {
     name: string;
     email: string;
     password: string;
     phone_number: string;
     country: string;
     referral_code?: string;
     password_confirmation: string;
     terms_accepted: boolean;
}): Promise<AuthResponse | null> => {
     try {
          const res = await api.post<{
               success: boolean;
               data: AuthResponse
          }>('/v1/register', data);
          const authData = res.data?.data;

          if (authData?.access_token) {
               await AsyncStorage.setItem('auth_token', authData.access_token);
               if (authData.user) await AsyncStorage.setItem('user', JSON.stringify(authData.user));
               return authData;
          } else {
               console.warn('No token returned from API', JSON.stringify(res.data, null, 2));
               return null;
          }
     } catch (err: any) {
          console.error(
               'Register API failed:',
               JSON.stringify(
                    {
                         message: err.message,
                         responseData: err.response?.data,
                         stack: err.stack,
                    },
                    null,
                    2
               )
          );
          return null;
     }
};

export const login = async (data: { email: string; password: string }): Promise<AuthResponse | null> => {
     try {
          const res = await api.post<{ success: boolean; data: AuthResponse }>('/v1/login', data);
          const authData = res.data?.data;

          if (authData?.access_token) {
               await AsyncStorage.setItem('auth_token', authData.access_token);
               if (authData.user) await AsyncStorage.setItem('user', JSON.stringify(authData.user));
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
          await AsyncStorage.multiRemove(['auth_token', 'user']);
     }
};

export const googleSignIn = async (
     payload: GoogleSignInPayload
): Promise<AuthResponse> => {
     const res = await api.post<{ data: AuthResponse }>(
          "/v1/auth/google/sign-in",
          payload
     );
     return res.data.data;
};

export const appleSignIn = async (
     payload: AppleSignInPayload
): Promise<AuthResponse> => {
     const res = await api.post<{ data: AuthResponse }>(
          "/v1/auth/apple/sign-in",
          payload
     );
     return res.data.data;
};

/* ----------------------------- GOOGLE AUTHENTICATION ----------------------------- */
export const getGoogleRedirectUrl = async (): Promise<string | null> => {
     try {
          const res = await api.get<{ success: boolean; redirectUrl: string }>('/v1/auth/google');
          return res.data.redirectUrl ?? null;
     } catch (err: any) {
          console.error('Google redirect URL failed:', err.response?.data || err.message || err);
          return null;
     }
};

export const loginWithGoogleCallback = async (code: string): Promise<AuthResponse | null> => {
     try {
          const res = await api.post<{ success: boolean; data: AuthResponse }>(
               `/v1/auth/google/callback?code=${code}`
          );

          const authData = res.data?.data;

          if (authData?.access_token) {
               await AsyncStorage.setItem('auth_token', authData.access_token);
               if (authData.user) await AsyncStorage.setItem('user', JSON.stringify(authData.user));
               return authData;
          } else {
               console.warn('No token returned from Google callback', JSON.stringify(res.data, null, 2));
               return null;
          }
     } catch (err: any) {
          console.error(
               'Google login callback failed:',
               JSON.stringify(
                    {
                         message: err.message,
                         responseData: err.response?.data,
                         stack: err.stack,
                    },
                    null,
                    2
               )
          );
          return null;
     }
};

/* ----------------------------- Social AUTHENTICATION ----------------------------- */
export const loginWithApple = async (identityToken: string): Promise<AuthResponse | null> => {
     try {
          const res = await api.post<{ success: boolean; data: AuthResponse }>('/v1/auth/apple/callback', {
               token: identityToken,
          });

          const authData = res.data?.data;

          if (authData?.access_token) {
               await AsyncStorage.setItem('auth_token', authData.access_token);
               if (authData.user) await AsyncStorage.setItem('user', JSON.stringify(authData.user));
               return authData;
          } else {
               console.warn('No token returned from Apple callback', JSON.stringify(res.data, null, 2));
               return null;
          }
     } catch (err: any) {
          console.error(
               'Apple login failed:',
               JSON.stringify(
                    {
                         message: err.message,
                         responseData: err.response?.data,
                         stack: err.stack,
                    },
                    null,
                    2
               )
          );
          return null;
     }
};

/* --------------------------------- PROFILE -------------------------------- */
export const getUser = async (): Promise<User | null> => {
     try {
          const res = await api.get<{
               success: boolean;
               data: User;
          }>('/v1/user');

          const userData = res.data?.data;

          if (userData) {
               await AsyncStorage.setItem('user', JSON.stringify(userData));
          }

          return userData ?? null;
     } catch (err: any) {
          console.error(
               'Get user API failed:',
               JSON.stringify(
                    err?.response?.data || err?.message || err,
                    null,
                    2
               )
          );

          await AsyncStorage.removeItem('auth_token');
          return null;
     }
};

// services/authService.ts
export const getAllUsers = async (): Promise<User[] | null> => {
     try {
          const initialRes = await api.get<{
               success: boolean;
               data: User[];
               total?: number;
          }>('/v1/users', {
               params: {
                    page: 1,
                    per_page: 100
               }
          });

          let allUsers = [...(initialRes.data?.data || [])];
          const total = initialRes.data?.total || allUsers.length;
          const perPage = 100;
          const possiblePages = Math.ceil(total / perPage);

          if (possiblePages > 1) {
               for (let page = 2; page <= possiblePages; page++) {
                    const res = await api.get<{
                         success: boolean;
                         data: User[];
                    }>('/v1/users', {
                         params: {
                              page,
                              per_page: 100
                         }
                    });

                    if (res.data?.data) {
                         allUsers = [...allUsers, ...res.data.data];
                         console.log(`Page ${page}: added ${res.data.data.length} users`);
                    }

                    if (!res.data?.data || res.data.data.length === 0) {
                         break;
                    }
               }
          }

          console.log(`Total users fetched: ${allUsers.length}`);

          await AsyncStorage.setItem('users', JSON.stringify(allUsers));

          return allUsers;
     } catch (err: any) {
          console.error('Failed to fetch all users:', err);
          return null;
     }
};

export const getUserByID = async (id: number): Promise<User | null> => {
     try {
          const res = await api.get<{ success: boolean; data: User }>(`/v1/users/${id}`);
          const userData = res.data?.data;
          return userData ?? null;
     } catch (err: any) {
          console.error('Error fetching user:', err.response?.data || err.message || err);
          return null;
     }
};

export const updateProfile = async (
     data: Partial<User> | FormData
): Promise<User | null> => {
     try {
          const isFormData = data instanceof FormData;

          const config: AxiosRequestConfig = isFormData
               ? {
                    headers: {
                         'Content-Type': 'multipart/form-data',
                    },
               }
               : {};

          const res = await api.post<{
               success: boolean;
               data: User;
          }>('/v1/user', data, config);
          const updatedUser = res.data?.data;
          if (updatedUser) {
               await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
          }

          return updatedUser ?? null;
     } catch (err: any) {
          console.error(
               'Update profile failed:',
               err.response?.data || err.message || err
          );
          return null;
     }
};

export const getStoredUser = async (): Promise<User | null> => {
     try {
          const userJson = await AsyncStorage.getItem('/v1/user');
          return userJson ? JSON.parse(userJson) : null;
     } catch (err) {
          console.error('Error getting stored user:', err);
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

          if (updatedUser) await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
          return updatedUser ?? null;
     } catch (err: any) {
          console.error('Update user flags failed:', err.response?.data || err.message || err);
          throw err;
     }
};

/* ---------------------------- PASSWORD RECOVERY --------------------------- */
export const sendVerifyCode = async (email: string): Promise<boolean> => {
     const startTime = Date.now();

     console.log('[sendVerifyCode] Request started', {
          email,
          endpoint: '/v1/forgot-password',
     });

     try {
          const res = await api.post('/v1/forgot-password', { email });

          console.log('[sendVerifyCode] Request success', {
               email,
               status: res.status,
               response: res.data,
               durationMs: Date.now() - startTime,
          });

          // Treat any 200 status as success
          if (res.status === 200) {
               return true;
          }

          // fallback in case backend returns 200 but unexpected body
          return false;
     } catch (err: unknown) {
          if (axios.isAxiosError(err)) {
               console.error('[sendVerifyCode] Axios error', {
                    email,
                    message: err.message,
                    status: err.response?.status,
                    responseData: err.response?.data,
                    headers: err.response?.headers,
                    durationMs: Date.now() - startTime,
               });
          } else {
               console.error('[sendVerifyCode] Unexpected error', {
                    email,
                    error: err,
                    durationMs: Date.now() - startTime,
               });
          }

          return false;
     }
};

export const verifyResetCode = async (data: { email: string; code: string }): Promise<VerifyResetCodeResponse> => {
     const startTime = Date.now()
     console.log('[verifyResetCode] Request started', { email: data.email, code: '***' })

     try {
          const res = await api.post('/v1/verify-reset-code', data)

          console.log('[verifyResetCode] Request success', {
               email: data.email,
               status: res.status,
               response: res.data,
               durationMs: Date.now() - startTime,
          })

          return res.data.data
     } catch (err: unknown) {
          if (axios.isAxiosError(err)) {
               console.error('[verifyResetCode] Axios error', {
                    email: data.email,
                    message: err.message,
                    status: err.response?.status,
                    responseData: err.response?.data,
               })
          } else {
               console.error('[verifyResetCode] Unexpected error', err)
          }

          throw err // propagate so caller can handle
     }
}

export const resetPassword = async (data: {
     email: string;
     code: string;
     password: string;
     password_confirmation: string;
     token: string;
}): Promise<boolean> => {
     const startTime = Date.now();

     console.log('[resetPassword] Request started', {
          email: data.email,
          endpoint: '/v1/reset-password',
          // hide sensitive info in logs
          code: data.code ? '***' : undefined,
          token: data.token ? '***' : undefined,
     });

     try {
          const res = await api.post('/v1/reset-password', data);

          console.log('[resetPassword] Request success', {
               email: data.email,
               status: res.status,
               response: res.data,
               durationMs: Date.now() - startTime,
          });

          // treat 200 as success
          return res.status === 200;
     } catch (err: unknown) {
          if (axios.isAxiosError(err)) {
               console.error('[resetPassword] Axios error', {
                    email: data.email,
                    message: err.message,
                    status: err.response?.status,
                    responseData: err.response?.data,
                    headers: err.response?.headers,
                    durationMs: Date.now() - startTime,
               });
          } else {
               console.error('[resetPassword] Unexpected error', {
                    email: data.email,
                    error: err,
                    durationMs: Date.now() - startTime,
               });
          }
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