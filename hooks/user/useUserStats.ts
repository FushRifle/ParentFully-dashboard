import { useCallback, useEffect, useState } from 'react';
import { getDashboardStats } from '@/services/adminService';
import type { AdminDashboardStats } from '@/types/api';

export const useUserStats = () => {
     const [stats, setStats] = useState<AdminDashboardStats | null>(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);

     const loadUsers = useCallback(async () => {
          setLoading(true);
          setError(null);

          try {
               setStats(await getDashboardStats());
          } catch (e: any) {
               setError(e?.message ?? 'Failed to load users');
          } finally {
               setLoading(false);
          }
     }, []);

     useEffect(() => {
          loadUsers();
     }, [loadUsers]);

     const totalUsers = stats?.total_users ?? 0;
     const newUsers = stats?.new_users_this_month ?? 0;
     const premiumUsers = stats?.active_subscriptions ?? 0;

     return {
          stats,
          totalUsers,
          newUsers,
          premiumUsers,
          loading,
          error,
          refresh: loadUsers,
     };
};
