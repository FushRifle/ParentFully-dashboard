import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllUsers } from '@/services/authService';
import { User } from '@/types/api';

export const useUserStats = () => {
     const [allUsers, setAllUsers] = useState<User[]>([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);

     const loadUsers = useCallback(async () => {
          setLoading(true);
          setError(null);

          try {
               const apiUsers = await getAllUsers();

               let users: User[] = [];
               if (apiUsers && Array.isArray(apiUsers)) {
                    users = apiUsers;
                    await AsyncStorage.setItem('user', JSON.stringify(users));
               } else {
                    const cached = await AsyncStorage.getItem('user');
                    if (cached) users = JSON.parse(cached);
               }

               setAllUsers(users);
          } catch (e: any) {
               setError(e?.message ?? 'Failed to load users');

               const cached = await AsyncStorage.getItem('user');
               if (cached) setAllUsers(JSON.parse(cached));
          } finally {
               setLoading(false);
          }
     }, []);

     useEffect(() => {
          loadUsers();
     }, [loadUsers]);

     const totalUsers = allUsers.length;
     const newUsers = [...allUsers]
          .filter(u => u.created_at)
          .sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime());
     const premiumUsers = [...allUsers]
          .filter((u) => u.is_premium)
          .sort((a, b) => Number(b.is_premium) - Number(a.is_premium));

     return {
          allUsers,
          totalUsers,
          newUsers,
          premiumUsers,
          loading,
          error,
          refresh: loadUsers,
          setAllUsers,
     };
};