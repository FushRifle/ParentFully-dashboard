import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@/lib/api';


class AuthManager {

     private token: string | null = null;
     private initializing: Promise<void> | null = null;

     async init() {
          if (!this.initializing) {
               this.initializing = this.loadToken();
          }
          return this.initializing;
     }

     private async loadToken() {
          const stored = await AsyncStorage.getItem('auth_token');

          if (stored) {
               this.token = stored;
               api.defaults.headers.common.Authorization = `Bearer ${stored}`;
          }
     }

     async setToken(token: string) {
          this.token = token;

          await AsyncStorage.setItem('auth_token', token);

          api.defaults.headers.common.Authorization = `Bearer ${token}`;
     }

     async getToken() {
          if (!this.token) {
               this.token = await AsyncStorage.getItem('auth_token');
          }

          return this.token;
     }

     async clearAuth() {
          this.token = null;

          delete api.defaults.headers.common.Authorization;

          await AsyncStorage.multiRemove([
               'auth_token',
               'user_local_flags'
          ]);
     }
}

export const authManager = new AuthManager();