import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';
import {
     getPlans,
     deletePlan,
     getRules,
     reorderPlans,
     getTemplatePlans,
     getAssignedChildPlans
} from '@/services/disciplineService';

export interface DisciplinePlan {
     id: number
     name: string
     description?: string
     notes?: string
     type: 'preset' | 'custom'
     isTemplate?: boolean
     rules: Rule[];
}

export interface Rule {
     id: number
     plan_id: number
     name: string
     consequences?: string
     consiquences?: string
     notes?: string
}

export type PlanWithMetadata = DisciplinePlan & {
     isTemplate?: boolean;
     ruleCount?: number;
     rules?: Rule[];
     color?: string;
};

export const useDisciplinePlans = (childId?: string) => {
     const { user } = useAuth();
     const userId = user?.user?.id;

     const [loading, setLoading] = useState(true);
     const [refreshing, setRefreshing] = useState(false);
     const [error, setError] = useState<string | null>(null);
     const [plans, setPlans] = useState<PlanWithMetadata[]>([]);
     const [selectedIds, setSelectedIds] = useState<number[]>([]);

     const fetchUserPlans = useCallback(async (): Promise<PlanWithMetadata[]> => {
          if (!userId) return [];

          try {
               const [customPlans, templatePlans] = await Promise.all([
                    getPlans(),
                    getTemplatePlans().catch(err => {
                         console.warn("Failed to fetch template plans, using empty array:", err);
                         return [];
                    }),
               ]);

               const markedTemplatePlans = templatePlans.map(plan => ({ ...plan, isTemplate: true }));
               const markedCustomPlans = customPlans.map(plan => ({ ...plan, isTemplate: false }));

               const combinedPlans = [...markedCustomPlans, ...markedTemplatePlans];

               const plansWithRules = await Promise.all(
                    combinedPlans.map(async (plan) => {
                         try {
                              const rules = await getRules(plan.id);
                              return { ...plan, rules, ruleCount: rules.length };
                         } catch {
                              return { ...plan, rules: [], ruleCount: 0 };
                         }
                    })
               );

               return plansWithRules;
          } catch (err) {
               console.error("Error fetching plans from API:", err);
               throw err;
          }
     }, [userId]);

     const loadPlans = useCallback(async () => {
          setLoading(true);
          setError(null);
          try {
               const fetchedPlans = await fetchUserPlans();
               setPlans(fetchedPlans);
          } catch (err) {
               console.error(err);
               setError("Failed to load discipline plans");
          } finally {
               setLoading(false);
          }
     }, [fetchUserPlans]);

     useFocusEffect(
          useCallback(() => {
               loadPlans();
          }, [loadPlans])
     );

     const handleSelectPlan = useCallback((id: number) => {
          setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
     }, []);

     const handleSelectPlansWithRules = useCallback(() => {
          const plansWithRules = plans.filter(plan => plan.ruleCount && plan.ruleCount > 0).map(plan => plan.id);
          setSelectedIds(plansWithRules);
     }, [plans]);

     const handleSelectAllPlans = useCallback(() => {
          setSelectedIds(plans.map(plan => plan.id));
     }, [plans]);

     const handleClearSelection = useCallback(() => setSelectedIds([]), []);

     const handleTogglePlansWithRules = useCallback(() => {
          const plansWithRules = plans.filter(plan => plan.ruleCount && plan.ruleCount > 0).map(plan => plan.id);
          const allRulesSelected = plansWithRules.every(id => selectedIds.includes(id));
          if (allRulesSelected) {
               setSelectedIds(prev => prev.filter(id => !plansWithRules.includes(id)));
          } else {
               setSelectedIds(prev => [...new Set([...prev, ...plansWithRules])]);
          }
     }, [plans, selectedIds]);

     const handleDragEnd = useCallback(async ({ data }: { data: PlanWithMetadata[] }) => {
          const customPlans = data.filter(plan => !plan.isTemplate);
          const templatePlans = data.filter(plan => plan.isTemplate);
          setPlans([...customPlans, ...templatePlans]);
          try {
               await reorderPlans({ plans: customPlans.map((plan, index) => ({ id: plan.id, order: index })) });
          } catch (err) {
               console.error("Error saving plan order:", err);
               Alert.alert("Error", "Failed to save plan order");
               loadPlans();
          }
     }, [loadPlans]);

     const handleDeletePlan = useCallback(async (planId: number) => {
          try {
               await deletePlan(planId);
               setPlans(prev => prev.filter(plan => plan.id !== planId));
               setSelectedIds(prev => prev.filter(id => id !== planId));
               Alert.alert("Success", "Plan deleted successfully");
               return true;
          } catch (err) {
               console.error("Error deleting plan:", err);
               Alert.alert("Error", "Failed to delete plan");
               return false;
          }
     }, []);

     const clearSelected = useCallback(() => setSelectedIds([]), []);
     const getSelectedPlans = useCallback(() => plans.filter(plan => selectedIds.includes(plan.id)), [plans, selectedIds]);
     const planHasRules = useCallback((planId: number) => !!plans.find(p => p.id === planId)?.ruleCount, [plans]);
     const getPlansWithRules = useCallback(() => plans.filter(plan => plan.ruleCount && plan.ruleCount > 0), [plans]);

     return {
          plans,
          loading,
          refreshing,
          setLoading,
          error,
          selectedIds,
          handleSelectPlan,
          handleSelectPlansWithRules,
          handleSelectAllPlans,
          handleClearSelection,
          handleTogglePlansWithRules,
          handleDragEnd,
          handleDeletePlan,
          clearSelected,
          refetch: loadPlans,
          getSelectedPlans,
          planHasRules,
          getPlansWithRules
     };
};
