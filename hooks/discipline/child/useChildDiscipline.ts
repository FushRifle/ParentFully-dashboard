import { useCallback, useState, useMemo } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
     getChildPlans,
     getSpecificChildPlan,
     updateSpecificChildPlan,
     deleteSpecificChildPlan,
     updateSpecificChildRule,
     deleteOneChildRule
} from '@/services/Child-Specific/disciplineService';

export interface Rule {
     id: number;
     plan_id: number;
     name: string;
     consequences?: string;
     consiquences?: string;
     notes?: string;
     length: number;
}

export interface DisciplinePlan {
     id: number;
     plan_id: number;
     name: string;
     description?: string;
     notes?: string;
     type: 'preset' | 'custom';
     isTemplate?: boolean;
     rules: Rule[];
}

export type PlanWithMetadata = DisciplinePlan & { color?: string; ruleCount?: number; }

export const useChildDisciplinePlans = (childId?: number) => {
     const [plans, setPlans] = useState<PlanWithMetadata[]>([]);
     const [loading, setLoading] = useState(true);
     const [refreshing, setRefreshing] = useState(false);
     const [error, setError] = useState<string | null>(null);
     const [selectedIds, setSelectedIds] = useState<number[]>([]);

     const fetchChildPlans = useCallback(async () => {
          if (!childId) return;
          setError(null);
          if (plans.length === 0) setLoading(true);
          else setRefreshing(true);

          try {
               const data = await getChildPlans(childId);
               const formatted: PlanWithMetadata[] = data.plans.map(p => ({
                    id: p.id,
                    plan_id: p.plan_id,
                    name: p.name,
                    description: p.description,
                    notes: p.notes,
                    type: p.type,
                    isTemplate: p.isTemplate,
                    child_id: p.child_id,
                    rules: Array.isArray(p.rules) ? p.rules : [p.rules].filter(Boolean),
                    ruleCount: Array.isArray(p.rules) ? p.rules.length : 1,
               }));

               setPlans(formatted);
          } catch (err) {
               console.error('Failed to fetch child plans:', err);
               setError('Failed to load discipline plans');
               Alert.alert('Error', 'Failed to load discipline plans');
          } finally {
               setLoading(false);
               setRefreshing(false);
          }
     }, [childId]);

     useFocusEffect(useCallback(() => { fetchChildPlans(); }, [fetchChildPlans]));

     const handleSelectPlan = useCallback((id: number) => {
          setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
     }, []);

     const plansWithRulesIds = useMemo(() => plans.filter(p => p.ruleCount && p.ruleCount > 0).map(p => p.id), [plans]);
     const handleSelectPlansWithRules = useCallback(() => setSelectedIds(plansWithRulesIds), [plansWithRulesIds]);
     const handleSelectAllPlans = useCallback(() => setSelectedIds(plans.map(p => p.id)), [plans]);
     const handleClearSelection = useCallback(() => setSelectedIds([]), []);
     const handleTogglePlansWithRules = useCallback(() => {
          const allSelected = plansWithRulesIds.every(id => selectedIds.includes(id));
          setSelectedIds(prev => allSelected ? prev.filter(id => !plansWithRulesIds.includes(id)) : [...new Set([...prev, ...plansWithRulesIds])]);
     }, [plansWithRulesIds, selectedIds]);

     const handleDeletePlan = useCallback(async (childPlanId: number) => {
          try {
               await deleteSpecificChildPlan(childPlanId);
               setPlans(prev => prev.filter(p => p.id !== childPlanId));
               setSelectedIds(prev => prev.filter(id => id !== childPlanId));
               Alert.alert('Success', 'Plan deleted successfully');
               return true;
          } catch (err) {
               console.error('Failed to delete plan:', err);
               Alert.alert('Error', 'Failed to delete plan');
               return false;
          }
     }, []);

     const handleUpdatePlan = useCallback(async (childPlanId: number, payload: Partial<DisciplinePlan>) => {
          try {
               const updated = await updateSpecificChildPlan(childPlanId, payload);
               setPlans(prev => prev.map(p => p.id === childPlanId ? { ...p, ...updated } : p));
          } catch (err) {
               console.error('Failed to update plan:', err);
               Alert.alert('Error', 'Failed to update plan');
          }
     }, []);

     const handleUpdateRule = useCallback(async (ruleId: number, payload: Partial<Rule>) => {
          try {
               const updatedRule = await updateSpecificChildRule(ruleId, payload);
               setPlans(prev => prev.map(plan => ({
                    ...plan,
                    rules: plan.rules.map(r => r.id === ruleId ? { ...r, ...updatedRule.rules.find(nr => nr.id === ruleId) } : r)
               })));
          } catch (err) {
               console.error('Failed to update rule:', err);
               Alert.alert('Error', 'Failed to update rule');
          }
     }, []);

     const handleDeleteRule = useCallback(async (ruleId: number) => {
          try {
               await deleteOneChildRule(ruleId);
               setPlans(prev => prev.map(plan => ({
                    ...plan,
                    rules: plan.rules.filter(r => r.id !== ruleId)
               })));
          } catch (err) {
               console.error('Failed to delete rule:', err);
               Alert.alert('Error', 'Failed to delete rule');
          }
     }, []);

     const getSelectedPlans = useMemo(() => plans.filter(p => selectedIds.includes(p.id)), [plans, selectedIds]);
     const planHasRules = useCallback((planId: number) => !!plans.find(p => p.id === planId)?.ruleCount, [plans]);
     const getPlansWithRules = useMemo(() => plans.filter(p => p.ruleCount && p.ruleCount > 0), [plans]);

     return {
          plans,
          loading,
          refreshing,
          error,
          selectedIds,
          handleSelectPlan,
          handleSelectPlansWithRules,
          handleSelectAllPlans,
          handleClearSelection,
          handleTogglePlansWithRules,
          handleDeletePlan,
          handleUpdatePlan,
          handleUpdateRule,
          handleDeleteRule,
          clearSelected: handleClearSelection,
          refetch: fetchChildPlans,
          getSelectedPlans,
          planHasRules,
          getPlansWithRules
     };
};

export const useChildPlanDetails = (planId?: number) => {
     const [plan, setPlan] = useState<DisciplinePlan | null>(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);
     const [saving, setSaving] = useState(false);

     const fetchPlanDetails = useCallback(async () => {
          if (!planId) return;

          setLoading(true);
          setError(null);

          try {
               const planData = await getSpecificChildPlan(planId);
               setPlan(planData);
          } catch (err) {
               console.error('Failed to fetch plan details:', err);
               setError('Failed to load plan details');
               Alert.alert('Error', 'Failed to load plan details');
          } finally {
               setLoading(false);
          }
     }, [planId]);

     const handleUpdatePlan = useCallback(async (payload: Partial<DisciplinePlan>) => {
          if (!planId) return;

          setSaving(true);
          try {
               const updatedPlan = await updateSpecificChildPlan(planId, payload);
               setPlan(prev => prev ? { ...prev, ...updatedPlan } : updatedPlan);
               return true;
          } catch (err) {
               console.error('Failed to update plan:', err);
               Alert.alert('Error', 'Failed to update plan');
               return false;
          } finally {
               setSaving(false);
          }
     }, [planId]);

     const handleUpdateRule = useCallback(async (ruleId: number, payload: Partial<Rule>) => {
          setSaving(true);
          try {
               const updatedRule = await updateSpecificChildRule(ruleId, payload);
               setPlan(prev => {
                    if (!prev) return prev;
                    return {
                         ...prev,
                         rules: prev.rules.map(rule =>
                              rule.id === ruleId ? { ...rule, ...payload } : rule
                         )
                    };
               });
               return true;
          } catch (err) {
               console.error('Failed to update rule:', err);
               Alert.alert('Error', 'Failed to update rule');
               return false;
          } finally {
               setSaving(false);
          }
     }, []);

     const handleDeleteRule = useCallback((ruleId: number) => {
          Alert.alert(
               'Confirm Delete',
               'Are you sure you want to delete this rule?',
               [
                    {
                         text: 'Cancel',
                         style: 'cancel',
                    },
                    {
                         text: 'Delete',
                         style: 'destructive',
                         onPress: async () => {
                              setSaving(true);
                              try {
                                   await deleteOneChildRule(ruleId);
                                   setPlan(prev => {
                                        if (!prev) return prev;
                                        return {
                                             ...prev,
                                             rules: prev.rules.filter(rule => rule.id !== ruleId),
                                        };
                                   });
                                   Alert.alert('Success', 'Rule deleted successfully');
                              } catch (err) {
                                   console.error('Failed to delete rule:', err);
                                   Alert.alert('Error', 'Failed to delete rule');
                              } finally {
                                   setSaving(false);
                              }
                         },
                    },
               ]
          );
     }, []);


     useFocusEffect(useCallback(() => {
          fetchPlanDetails();
     }, [fetchPlanDetails]));

     return {
          plan,
          loading,
          error,
          saving,
          refetch: fetchPlanDetails,
          handleUpdatePlan,
          handleUpdateRule,
          handleDeleteRule
     };
};