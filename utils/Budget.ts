import { useCallback, useMemo } from 'react';

export const useFinanceUtils = (
     apiExpenses: any[],
     apiPayments: any[],
     apiRequests: any[],
     selectedPeriod: string,
     expensesLoading: boolean,
     paymentsLoading: boolean,
     requestsLoading: boolean,
     expensesError: any,
     paymentsError: any,
     requestsError: any
) => {
     const safeParseFloat = useCallback((value: string | number | null | undefined): number => {
          if (value === null || value === undefined) return 0;
          const strValue = String(value).replace(/,/g, '');
          const parsed = parseFloat(strValue);
          return isNaN(parsed) ? 0 : parsed;
     }, []);

     const getDateRange = useCallback((period: string) => {
          const now = new Date();
          const startDate = new Date();
          switch (period) {
               case 'last_month':
                    startDate.setMonth(now.getMonth() - 1);
                    break;
               case 'last_3_months':
                    startDate.setMonth(now.getMonth() - 3);
                    break;
               case 'last_6_months':
                    startDate.setMonth(now.getMonth() - 6);
                    break;
               case 'last_year':
                    startDate.setFullYear(now.getFullYear() - 1);
                    break;
               default:
                    startDate.setMonth(now.getMonth() - 3);
          }
          return { startDate, endDate: now };
     }, []);

     const filterByPeriod = useCallback(<T extends { date: string }>(items: T[], period: string): T[] => {
          if (!items || items.length === 0) return [];
          const { startDate } = getDateRange(period);
          return items.filter(item => new Date(item.date) >= startDate);
     }, [getDateRange]);

     const computed = useMemo(() => {
          const filteredExpenses = filterByPeriod(apiExpenses, selectedPeriod);
          const filteredPayments = filterByPeriod(apiPayments, selectedPeriod);
          const filteredRequests = filterByPeriod(apiRequests, selectedPeriod);

          const totalExpenses = filteredExpenses.reduce((sum, e) => sum + safeParseFloat(e.amount), 0);
          const pendingExpenses = filteredExpenses.filter(e => e.status === 'pending').reduce((sum, e) => sum + safeParseFloat(e.amount), 0);
          const approvedExpenses = filteredExpenses.filter(e => e.status === 'approved').reduce((sum, e) => sum + safeParseFloat(e.amount), 0);

          const totalPayments = filteredPayments.reduce((sum, p) => sum + safeParseFloat(p.amount), 0);
          const pendingPayments = filteredPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + safeParseFloat(p.amount), 0);
          const approvedPayments = filteredPayments.filter(p => p.status === 'approved').reduce((sum, p) => sum + safeParseFloat(p.amount), 0);

          const totalRequests = filteredRequests.reduce((sum, r) => sum + safeParseFloat(r.amount), 0);
          const pendingRequests = filteredRequests.filter(r => r.status === 'pending_approval').reduce((sum, r) => sum + safeParseFloat(r.amount), 0);
          const approvedRequests = filteredRequests.filter(r => r.status === 'approved').reduce((sum, r) => sum + safeParseFloat(r.amount), 0);

          const recentExpenses = filteredExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
          const recentPayments = filteredPayments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
          const recentRequests = filteredRequests.sort((a, b) => new Date(b.created_at || b.date).getTime() - new Date(a.created_at || a.date).getTime()).slice(0, 5);

          const categoryMap = new Map<string, { total: number; count: number; cat_icon?: string }>();
          filteredExpenses.forEach(e => {
               const category = e.cat_name || 'Uncategorized';
               const amount = safeParseFloat(e.amount);
               if (categoryMap.has(category)) {
                    const cur = categoryMap.get(category)!;
                    cur.total += amount;
                    cur.count += 1;
               } else {
                    categoryMap.set(category, { total: amount, count: 1, cat_icon: e.cat_icon });
               }
          });

          const expensesByCategory = Array.from(categoryMap.entries()).map(([cat_name, data]) => ({
               cat_id: 0,
               cat_name,
               cat_icon: data.cat_icon || '📝',
               total: data.total.toString(),
               percentage: 0
          }));

          if (totalExpenses > 0) {
               expensesByCategory.forEach(cat => {
                    cat.percentage = Math.round((safeParseFloat(cat.total) / totalExpenses) * 100);
               });
          }

          const pendingItems = [
               ...filteredExpenses.filter(e => e.status === 'pending').map(e => ({ id: e.id, type: 'expense' as const, description: e.description, amount: e.amount, created_at: e.date })),
               ...filteredPayments.filter(p => p.status === 'pending').map(p => ({ id: p.id, type: 'payment' as const, description: p.description, amount: p.amount, created_at: p.date })),
               ...filteredRequests.filter(r => r.status === 'pending_approval').map(r => ({ id: r.id, type: 'request' as const, description: r.description, amount: r.amount, created_at: r.created_at || r.date }))
          ];

          const pendingActions = {
               count: pendingItems.length,
               expenses: filteredExpenses.filter(e => e.status === 'pending').length,
               payments: filteredPayments.filter(p => p.status === 'pending').length,
               requests: filteredRequests.filter(r => r.status === 'pending_approval').length
          };

          const approvedActions = {
               count: filteredExpenses.filter(e => e.status === 'approved').length + filteredPayments.filter(p => p.status === 'approved').length + filteredRequests.filter(r => r.status === 'approved').length,
               expenses: filteredExpenses.filter(e => e.status === 'approved').length,
               payments: filteredPayments.filter(p => p.status === 'approved').length,
               requests: filteredRequests.filter(r => r.status === 'approved').length
          };

          return {
               totalExpenses,
               pendingExpenses,
               approvedExpenses,
               totalPayments,
               pendingPayments,
               approvedPayments,
               totalRequests,
               pendingRequests,
               approvedRequests,
               recentExpenses,
               recentPayments,
               recentRequests,
               expensesByCategory,
               pendingItems,
               pendingActions,
               approvedActions
          };
     }, [apiExpenses, apiPayments, apiRequests, selectedPeriod, safeParseFloat, filterByPeriod]);

     const loading = expensesLoading || paymentsLoading || requestsLoading;
     const error = expensesError || paymentsError || requestsError;

     return { safeParseFloat, getDateRange, filterByPeriod, ...computed, loading, error };
};


