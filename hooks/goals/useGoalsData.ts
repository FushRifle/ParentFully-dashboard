import { useState, useCallback } from 'react';
import { goalApi, childGoalApi, certificateApi } from '@/services/goalService';
import { GoalPayload } from '@/types/api';
import { useProfileData } from '../auth/useProfileData';

type AsyncGoalFunction<T = any> = (...args: any[]) => Promise<T>;

export const useGoals = () => {
     const { user } = useProfileData();
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

     const createGoal = useCallback(
          (data: GoalPayload) =>
               handleAsync(() => goalApi.createCustom(data), 'Failed to create goal'),
          [handleAsync]
     );

     const createGoalFromTemplate = useCallback(
          (data: GoalPayload) =>
               handleAsync(() => goalApi.createFromTemplate(data), 'Failed to create goal from template'),
          [handleAsync]
     );

     const updateGoal = useCallback(
          (id: number, data: Partial<GoalPayload>) =>
               handleAsync(() => goalApi.update(id, data), 'Failed to update goal'),
          [handleAsync]
     );

     const deleteGoal = useCallback(
          (id: number) =>
               handleAsync(() => goalApi.delete(id), 'Failed to delete goal'),
          [handleAsync]
     );

     const getGoal = useCallback(
          (id: number) =>
               handleAsync(() => goalApi.getOne(id), 'Failed to fetch goal'),
          [handleAsync]
     );

     const getGoalsByCategory = useCallback(
          (categoryId?: number) =>
               handleAsync(() => goalApi.getAll(categoryId), 'Failed to fetch goals by category'),
          [handleAsync]
     );

     const assignGoalsToChild = useCallback(
          (goalId: number, childIds: number[], coreValueId?: number, additionalData?: Partial<GoalPayload>) =>
               handleAsync(
                    () => goalApi.assignGoalsToChild(goalId, {
                         child_ids: childIds,
                         user_id: user?.id,
                         core_value_id: coreValueId,
                         category_id: coreValueId,
                         ...additionalData
                    }),
                    'Failed to assign goals to child'
               ),
          [handleAsync, user?.id]
     );

     const updateGoalProgress = useCallback(
          (goalChildId: number) =>
               handleAsync(
                    () => childGoalApi.updateProgress(goalChildId),
                    'Failed to update progress'
               ),
          [handleAsync]
     );

     const incrementProgress = useCallback(
          (goalChildId: number) =>
               handleAsync(
                    () => childGoalApi.incrementProgress(goalChildId),
                    'Failed to increment progress'
               ),
          [handleAsync]
     );

     const decrementProgress = useCallback(
          (goalChildId: number) =>
               handleAsync(
                    () => childGoalApi.decrementProgress(goalChildId),
                    'Failed to decrement progress'
               ),
          [handleAsync]
     );

     const restoreGoal = useCallback(
          (id: number) =>
               handleAsync(() => goalApi.restore(id), 'Failed to restore goal'),
          [handleAsync]
     );

     const restoreChildGoal = useCallback(
          (id: number) =>
               handleAsync(() => childGoalApi.restoreChildGoal(id), 'Failed to restore child goal'),
          [handleAsync]
     );

     const toggleChildGoalActive = useCallback(
          (id: number) =>
               handleAsync(() => childGoalApi.toggleActiveStatus(id), 'Failed to toggle child goal status'),
          [handleAsync]
     );

     const bulkUpdateGoalOrder = useCallback(
          (items: { id: number; order: number }[]) =>
               handleAsync(() => childGoalApi.bulkUpdateGoalOrder(items), 'Failed to bulk update goal order'),
          [handleAsync]
     );

     const generateCertificate = useCallback(
          (goalChildId: number) =>
               handleAsync(() => certificateApi.generate(goalChildId), 'Failed to generate certificate'),
          [handleAsync]
     );

     const getCertificate = useCallback(
          (certId: number) =>
               handleAsync(() => certificateApi.get(certId), 'Failed to get certificate'),
          [handleAsync]
     );

     const downloadCertificate = useCallback(
          (certId: number) =>
               handleAsync(() => certificateApi.download(certId), 'Failed to download certificate'),
          [handleAsync]
     );

     const getChildCertificates = useCallback(
          (childId: number) =>
               handleAsync(() => certificateApi.getChildCertificates(childId), 'Failed to get child certificates'),
          [handleAsync]
     );

     return {
          loading,
          error,
          createGoal,
          createGoalFromTemplate,
          updateGoal,
          deleteGoal,
          getGoal,
          getGoalsByCategory,
          assignGoalsToChild,
          updateGoalProgress,
          incrementProgress,
          decrementProgress,
          restoreGoal,
          restoreChildGoal,
          toggleChildGoalActive,
          bulkUpdateGoalOrder,
          generateCertificate,
          getCertificate,
          downloadCertificate,
          getChildCertificates,
     };
};