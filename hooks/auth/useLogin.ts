import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { login as loginService } from '../../lib/services/authServices';
import { useAuth } from '../../lib/context/authContext';
import { AuthResponse } from '../../types/api';

interface LoginCredentials {
     email: string;
     password: string;
}

interface UseLoginReturn {
     isLoading: boolean;
     error: string | null;
     login: (credentials: LoginCredentials) => Promise<boolean>;
     clearError: () => void;
}

export const useLogin = (): UseLoginReturn => {
     const [isLoading, setIsLoading] = useState(false);
     const [error, setError] = useState<string | null>(null);
     const router = useRouter();
     const { login: authLogin } = useAuth();

     const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
          setIsLoading(true);
          setError(null);

          try {
               const authData: AuthResponse | null = await loginService(credentials);

               if (!authData?.access_token || !authData.user) {
                    setError('Invalid email or password');
                    setIsLoading(false);
                    return false;
               }

               // Use the auth context to store the token and user
               authLogin(authData.access_token, authData.user);

               // Redirect to dashboard
               router.push('/dashboard');
               return true;

          } catch (err: any) {
               console.error('Login error:', err);

               // Extract error message
               let errorMessage = 'An error occurred during login';

               if (err.response?.data) {
                    const { data } = err.response;

                    // Handle Laravel validation errors
                    if (data.errors) {
                         errorMessage = Object.values(data.errors).flat().join(', ');
                    } else if (data.message) {
                         errorMessage = data.message;
                    }
               } else if (err.message) {
                    errorMessage = err.message;
               }

               setError(errorMessage);
               return false;
          } finally {
               setIsLoading(false);
          }
     }, [authLogin, router]);

     const clearError = useCallback(() => {
          setError(null);
     }, []);

     return {
          isLoading,
          error,
          login,
          clearError,
     };
};