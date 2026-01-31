// hooks/usePagedUsers.ts
import { useState, useCallback, useEffect, useRef } from 'react';
import { getUserByID } from '../../lib/services/authServices';

export interface User {
     id: number;
     name: string;
     email: string;
     avatar?: string;
     role?: string;
     status?: string;
     rawData?: any;
}

interface UsePagedUsersReturn {
     users: User[];
     loading: boolean;
     error: string | null;
     loadPage: (page: number) => void;
     refresh: () => void;
}

const ITEMS_PER_PAGE = 10;
const MAX_LOOKAHEAD = 50; // max IDs to try to fill a page

export const usePagedUsers = (): UsePagedUsersReturn => {
     const [users, setUsers] = useState<User[]>([]);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState<string | null>(null);

     const fetchedPages = useRef<Set<number>>(new Set());

     // Fetch pageSize users starting from startId, in parallel
     const getUsersForPage = useCallback(async (startId: number, pageSize: number) => {
          const pageUsers: User[] = [];
          let id = startId;

          while (pageUsers.length < pageSize && id < startId + MAX_LOOKAHEAD) {
               const batch = Array.from({ length: pageSize * 2 }, (_, i) => id + i);
               const results = await Promise.allSettled(batch.map(getUserByID));

               for (const result of results) {
                    if (pageUsers.length >= pageSize) break;

                    if (result.status === 'fulfilled' && result.value) {
                         pageUsers.push(result.value);
                    }
               }

               id += pageSize * 2;
          }

          return pageUsers;
     }, []);

     const fetchPage = useCallback(
          async (page: number) => {
               if (fetchedPages.current.has(page)) return;

               setLoading(true);
               setError(null);

               const startId = (page - 1) * ITEMS_PER_PAGE + 1;

               try {
                    const pageUsers = await getUsersForPage(startId, ITEMS_PER_PAGE);
                    fetchedPages.current.add(page);
                    setUsers((prev) => [...prev, ...pageUsers]);
               } catch (err: any) {
                    setError(err instanceof Error ? err.message : 'Failed to fetch users');
               } finally {
                    setLoading(false);
               }
          },
          [getUsersForPage]
     );

     const refresh = useCallback(() => {
          fetchedPages.current.clear();
          setUsers([]);
          fetchPage(1);
     }, [fetchPage]);

     useEffect(() => {
          fetchPage(1);
     }, [fetchPage]);

     return {
          users,
          loading,
          error,
          loadPage: fetchPage,
          refresh,
     };
};
