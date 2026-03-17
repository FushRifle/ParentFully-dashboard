import { useState, useCallback } from 'react';
import { goalApi, childGoalApi } from '@/services/goalService';
import { getChildGoals } from '@/services/Child-Specific/goalService';
import { GoalPayload } from '@/types/api';

type AsyncGoalFunction<T = any> = (...args: any[]) => Promise<T>;

export const useGoals = () => {
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState<string | null>(null);

     const handleAsync = useCallback(
          async <T,>(fn: AsyncGoalFunction<T>, errorMsg: string) => {
               setLoading(true);
               setError(null);
               try {
                    const result = await fn();
                    return result;
               } catch (err) {
                    const message = err instanceof Error ? err.message : errorMsg;
                    setError(message);
                    throw err;
               } finally {
                    setLoading(false);
               }
          },
          []
     );

     const updateChildGoal = useCallback(
          (id: number, data: Partial<GoalPayload>) =>
               handleAsync(() => childGoalApi.updateChildGoal(id, data), 'Failed to update goal'),
          [handleAsync]
     );

     const deleteChildGoal = useCallback(
          (id: number) =>
               handleAsync(() => goalApi.delete(id), 'Failed to delete goal'),
          [handleAsync]
     );

     const getChildGoal = useCallback(
          (id: number) =>
               handleAsync(() => getChildGoals(id), 'Failed to fetch goal'),
          [handleAsync]
     );

     return {
          loading,
          error,
          updateChildGoal,
          deleteChildGoal,
          getChildGoal,
     };
};