import { api } from '@/lib/api'
import { DisciplinePlan, Rule, PlansOrder, AssignedChildPlansResponse } from '@/types/api'

//---Templates--//
export const getTemplatePlans = async (): Promise<DisciplinePlan[]> => {
     const res = await api.get<{
          success: boolean;
          data: DisciplinePlan[]
     }>('/v1/plans-templates')
     return res.data.data
}

export const getSingleTemplatePlan = async (id: number): Promise<DisciplinePlan> => {
     const res = await api.get<{
          success: boolean;
          data: DisciplinePlan
     }>(`/v1/plans-templates/${id}`)
     return res.data.data
}

export const createTemplatePlan = async (data: Partial<DisciplinePlan>): Promise<DisciplinePlan> => {
     const res = await api.post<{
          success: boolean;
          data: DisciplinePlan
     }>('/v1/plans/from-template', data)
     return res.data.data
}

// --- Custom Plans --- //
export const getPlans = async (): Promise<DisciplinePlan[]> => {
     try {
          const res = await api.get<{
               success: boolean;
               data: DisciplinePlan[]
          }>('/v1/plans')
          return res.data.data
     } catch (error) {
          console.error('Error fetching custom plans:', error);
          throw error;
     }
}

export const getSinglePlan = async (id: number): Promise<DisciplinePlan> => {
     const res = await api.get<{ success: boolean; data: DisciplinePlan }>(`/v1/plans/${id}`)
     return res.data.data
}

export const createPlan = async (data: Partial<DisciplinePlan>): Promise<DisciplinePlan> => {
     const res = await api.post<{ success: boolean; data: DisciplinePlan }>('/v1/plans', data)
     return res.data.data
}

export const updatePlan = async (id: number, data: Partial<DisciplinePlan>): Promise<DisciplinePlan> => {
     const res = await api.put<{ success: boolean; data: DisciplinePlan }>(`/v1/plans/${id}`, data)
     return res.data.data
}

export const deletePlan = async (id: number): Promise<void> => {
     await api.delete(`/v1/plans/${id}`)
}

export const reorderPlans = async (data: PlansOrder): Promise<DisciplinePlan[]> => {
     const res = await api.post<{ success: boolean; data: DisciplinePlan[] }>('/v1/plans/reorder', data)
     return res.data.data
}

// --- Rules --- //
export const getRules = async (plan_id: number): Promise<Rule[]> => {
     try {
          const res = await api.get<{ success: boolean; data: Rule[] }>(`/v1/rules`)
          const rulesForPlan = res.data.data.filter(rule => rule.plan_id === plan_id);
          return rulesForPlan;
     } catch (error) {
          console.error(`Error fetching rules for plan ${plan_id}:`, error);
          return [];
     }
}

export const getSingleRule = async (id: number): Promise<Rule> => {
     const res = await api.get<{ success: boolean; data: Rule }>(`/v1/rules/${id}`)
     return res.data.data
}

export const createRule = async (data: Partial<Rule>): Promise<Rule> => {
     const res = await api.post<{ success: boolean; data: Rule }>('/v1/rules', data)
     return res.data.data
}

export const updateRule = async (id: number, data: Partial<Rule>): Promise<Rule> => {
     const res = await api.put<{ success: boolean; data: Rule }>(`/v1/rules/${id}`, data)
     return res.data.data
}

export const deleteRule = async (id: number): Promise<void> => {
     await api.delete(`/v1/rules/${id}`)
}

// --- Child --- //
export const getChildPlans = async (childId: number): Promise<DisciplinePlan> => {
     const res = await api.get<{
          success: boolean;
          data: DisciplinePlan
     }>(`/v1/children/${childId}/plans`)
     return res.data.data
}

export const assignPlanToChild = async (planId: number, childIds: number[]): Promise<void> => {
     if (!planId || !childIds?.length) {
          throw new Error("Missing plan ID or child IDs");
     }
     await api.post(`/v1/plans/${planId}/assign-children`, {
          child_ids: childIds
     });
};

export const getAssignedChildPlans = async (childId: number): Promise<AssignedChildPlansResponse> => {
     try {
          const res = await api.get<{
               success: boolean;
               data: AssignedChildPlansResponse;
               message: string;
          }>(`/v1/children/${childId}/plans`);
          return res.data.data;
     } catch (error) {
          console.error("Error fetching assigned child plans:", error);
          if ((error as any)?.response?.data) {
               console.error("Backend error data:", (error as any).response.data);
          }
          throw error;
     }
};
