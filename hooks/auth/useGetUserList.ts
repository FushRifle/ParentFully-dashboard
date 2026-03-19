import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllUsers } from '@/services/authService';
import { User } from '@/types/api';

export const useUser = (page: number = 1, perPage: number = 10) => {
     const [allUsers, setAllUsers] = useState<User[]>([]);
     const [paginatedUsers, setPaginatedUsers] = useState<User[]>([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);
     const [totalPages, setTotalPages] = useState(1);

     const loadAllUsers = useCallback(async () => {
          setLoading(true);
          setError(null);

          try {
               const apiUsers = await getAllUsers();

               if (apiUsers && Array.isArray(apiUsers)) {
                    setAllUsers(apiUsers);

                    const pages = Math.ceil(apiUsers.length / perPage);
                    setTotalPages(pages || 1);

                    return;
               }

               const cached = await AsyncStorage.getItem('users');
               if (cached) {
                    const cachedUsers = JSON.parse(cached);
                    setAllUsers(cachedUsers);

                    const pages = Math.ceil(cachedUsers.length / perPage);
                    setTotalPages(pages || 1);
               }
          } catch (e: any) {
               setError(e?.message ?? 'Failed to load users');
          } finally {
               setLoading(false);
          }
     }, [perPage]);

     useEffect(() => {
          if (allUsers.length > 0) {
               const start = (page - 1) * perPage;
               const end = start + perPage;
               const pageUsers = allUsers.slice(start, end);

               console.log(`Page ${page}: showing users ${start} to ${end - 1}, total: ${allUsers.length}`);
               setPaginatedUsers(pageUsers);
          } else {
               setPaginatedUsers([]);
          }
     }, [page, allUsers, perPage]);

     useEffect(() => {
          loadAllUsers();
     }, [loadAllUsers]);

     const refresh = useCallback(async () => {
          await loadAllUsers();
     }, [loadAllUsers]);

     return {
          users: paginatedUsers,
          allUsers,
          loading,
          error,
          totalPages,
          refresh,
          setUsers: setPaginatedUsers,
     };
};