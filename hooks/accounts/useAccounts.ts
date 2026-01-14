import { useState, useEffect, useCallback } from 'react';
import { getUserByID } from '../../lib/services/authServices';

interface UseAllUsersReturn {
     users: User[];
     loading: boolean;
     error: string | null;
     refresh: () => void;
     hasMore: boolean;
     loadMore: () => void;
}

interface User {
     id: number;
     name: string;
     email: string;
     avatar?: string;
     role?: string;
     status?: string;
     phone?: string;
     createdAt?: string;
     updatedAt?: string;

     rawData?: any;
}

const BATCH_SIZE = 20;
const MAX_CONSECUTIVE_FAILURES = 10;

export const useSequentialUsers = (startId = 1): UseAllUsersReturn => {
     const [users, setUsers] = useState<User[]>([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);
     const [nextId, setNextId] = useState(startId);
     const [hasMore, setHasMore] = useState(true);

     const fetchBatch = useCallback(async (startingId: number) => {
          setLoading(true);
          setError(null);
          const batchUsers: User[] = [];
          let failures = 0;

          try {
               for (let id = startingId; id < startingId + BATCH_SIZE; id++) {
                    try {
                         const user = await getUserByID(id);
                         if (user) {
                              batchUsers.push(user);
                              failures = 0;
                         } else {
                              failures++;
                              if (failures >= MAX_CONSECUTIVE_FAILURES) break;
                         }
                    } catch {
                         failures++;
                         if (failures >= MAX_CONSECUTIVE_FAILURES) break;
                    }
               }

               if (batchUsers.length === 0) setHasMore(false);

               setUsers(prev => [...prev, ...batchUsers]);
               setNextId(startingId + BATCH_SIZE);
          } catch (err) {
               setError(err instanceof Error ? err.message : 'Failed to fetch users');
               setHasMore(false);
          } finally {
               setLoading(false);
          }
     }, []);

     const loadMore = useCallback(() => {
          if (!loading && hasMore) fetchBatch(nextId);
     }, [loading, hasMore, nextId, fetchBatch]);

     const refresh = useCallback(() => {
          setUsers([]);
          setNextId(startId);
          setHasMore(true);
          fetchBatch(startId);
     }, [startId, fetchBatch]);

     useEffect(() => {
          fetchBatch(startId);
     }, [startId, fetchBatch]);

     return { users, loading, error, refresh, hasMore, loadMore };
};
