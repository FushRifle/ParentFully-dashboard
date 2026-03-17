import { useState, useCallback } from 'react';
import { goalCategoryApi, goalApi } from '@/services/goalService';
import { useCoreValueAgeDescription } from '@/hooks/goals/useCoreValueAgeDescription';
import type { AgeGroupKey } from '@/hooks/goals/useAgeGroupComment';
import type { CoreValue, Goal } from '@/types/api';
import { ageGroupDescriptions } from '@/hooks/goals/useAgeGroupComment';

export const useCorePlanHandlers = (initialAgeGroup: AgeGroupKey) => {
     const [coreValues, setCoreValues] = useState<CoreValue[]>([]);
     const [goals, setGoals] = useState<Goal[]>([]);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState<string | null>(null);
     const [activeTab, setActiveTab] = useState<AgeGroupKey>(initialAgeGroup);

     const { getDescription } = useCoreValueAgeDescription();

     const fetchCoreValues = useCallback(async (ageGroup: AgeGroupKey) => {
          setLoading(true);
          setError(null);
          try {
               const data = await goalCategoryApi.getAll(ageGroup);
               setCoreValues(data);
          } catch (err) {
               setError(err instanceof Error ? err.message : 'Failed to fetch core values');
               console.error('fetchCoreValues failed for age group', ageGroup, err);
          } finally {
               setLoading(false);
          }
     }, []); // Remove activeTab dependency since we pass ageGroup as parameter

     const handleTabChange = useCallback(async (tab: AgeGroupKey) => {
          setActiveTab(tab);
          setGoals([]);
          setError(null);
          await fetchCoreValues(tab);
     }, [fetchCoreValues]);

     const handleCardClick = useCallback(async (coreValue: CoreValue) => {
          if (!coreValue.id) {
               setError('Invalid core value ID');
               return;
          }

          setLoading(true);
          setError(null);
          try {
               const id = typeof coreValue.id === 'string' ? parseInt(coreValue.id, 10) : coreValue.id;
               const data = await goalApi.getAll(id);
               setGoals(data);
          } catch (err) {
               setError(err instanceof Error ? err.message : 'Failed to fetch goals');
               console.error('handleCardClick failed', err);
          } finally {
               setLoading(false);
          }
     }, []);

     const currentAgeGroupInfo = ageGroupDescriptions[activeTab];

     return {
          coreValues,
          goals,
          loading,
          error, // Added error state
          activeTab,
          currentAgeGroupInfo,
          fetchCoreValues: useCallback(() => fetchCoreValues(activeTab), [fetchCoreValues, activeTab]), // Wrapper for current tab
          handleTabChange,
          handleCardClick,
          ageGroups: Object.keys(ageGroupDescriptions) as AgeGroupKey[],
     };
};