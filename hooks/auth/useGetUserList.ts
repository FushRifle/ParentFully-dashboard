import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllUsers } from '@/services/authService';
import { User } from '@/types/api';

export const useUser = (page: number = 1) => {
     const [users, setUsers] = useState<User[]>([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);
     const [totalPages, setTotalPages] = useState(1);

     const loadUser = useCallback(async (pageNum: number = page) => {
          setLoading(true);
          setError(null);

          try {
               const apiUser = await getAllUsers();

               if (apiUser && Array.isArray(apiUser)) {
                    setUsers(apiUser);

                    return;
               }

               const cached = await AsyncStorage.getItem('user');
               if (cached) {
                    setUsers(JSON.parse(cached));
               }
          } catch (e: any) {
               setError(e?.message ?? 'Failed to load user');
          } finally {
               setLoading(false);
          }
     }, [page]);

     useEffect(() => {
          loadUser();
     }, [loadUser, page]);

     return {
          users,
          loading,
          error,
          totalPages,
          refresh: loadUser,
          setUsers,
     };
};