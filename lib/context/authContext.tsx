import React, {
     createContext, useContext,
     useState, useEffect, ReactNode
} from 'react';
import { useRouter } from 'next/router';
import { User } from '../../types/api';

interface AuthContextType {
     user: User | null;
     token: string | null;
     isLoading: boolean;
     login: (token: string, user: User) => void;
     logout: () => void;
     updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
     children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
     const [user, setUser] = useState<User | null>(null);
     const [token, setToken] = useState<string | null>(null);
     const [isLoading, setIsLoading] = useState(true);
     const router = useRouter();

     useEffect(() => {
          const loadAuthData = () => {
               try {
                    const storedToken = localStorage.getItem('auth_token');
                    const storedUser = localStorage.getItem('user');

                    if (storedToken && storedUser) {
                         setToken(storedToken);
                         setUser(JSON.parse(storedUser));
                    }
               } catch (error) {
                    console.error('Error loading auth data from localStorage:', error);
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user');
               } finally {
                    setIsLoading(false);
               }
          };

          loadAuthData();
     }, []);

     // Login function
     const login = (newToken: string, newUser: User) => {
          setToken(newToken);
          setUser(newUser);
          localStorage.setItem('auth_token', newToken);
          localStorage.setItem('user', JSON.stringify(newUser));
     };

     // Logout function
     const logout = () => {
          setToken(null);
          setUser(null);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          router.push('/login');
     };

     const updateUser = (updatedUser: User) => {
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
     };

     const value: AuthContextType = {
          user,
          token,
          isLoading,
          login,
          logout,
          updateUser,
     };

     return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
     const context = useContext(AuthContext);
     if (!context) {
          throw new Error('useAuth must be used within an AuthProvider');
     }
     return context;
};
