import { api } from '@/lib/api';
import { AssignedChildPlansResponse } from '@/types/api';

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

/** Child-specific Plans */
export const getSpecificChildPlan = async (childId: number): Promise<DisciplinePlan> => {
     const res = await api.get<{ success: boolean; data: DisciplinePlan }>(`/v1/plan-children/${childId}`);
     return res.data.data;
};

export const updateSpecificChildPlan = async (childPlanId: number, payload: Partial<DisciplinePlan>): Promise<DisciplinePlan> => {
     const res = await api.put<{ success: boolean; data: DisciplinePlan }>(`/v1/plan-children/${childPlanId}`, payload);
     return res.data.data;
};

export const deleteSpecificChildPlan = async (childPlanId: number): Promise<DisciplinePlan> => {
     const res = await api.delete<{ success: boolean; data: DisciplinePlan }>(`/v1/plan-children/${childPlanId}`);
     return res.data.data;
};

export const getChildPlans = async (childId: number): Promise<AssignedChildPlansResponse> => {
     const res = await api.get<{ success: boolean; data: AssignedChildPlansResponse; message: string }>(
          `/v1/children/${childId}/plans-custom`
     );
     return res.data.data;
};

/** Child-specific Rules */
export const getOneChildRule = async (childId: number): Promise<DisciplinePlan> => {
     const res = await api.get<{ success: boolean; data: DisciplinePlan }>(`/v1/rule-children/${childId}`);
     return res.data.data;
};

export const getAllChildRule = async (childId: number): Promise<DisciplinePlan> => {
     const res = await api.get<{
          success: boolean;
          data: DisciplinePlan
     }>(`/v1/plan-children/${childId}/rules`);
     return res.data.data;
};

export const updateSpecificChildRule = async (childRuleId: number, payload: Partial<DisciplinePlan>): Promise<DisciplinePlan> => {
     const res = await api.put<{ success: boolean; data: DisciplinePlan }>(`/v1/rule-children/${childRuleId}`, payload);
     return res.data.data;
};

export const deleteOneChildRule = async (childRuleId: number): Promise<DisciplinePlan> => {
     const res = await api.delete<{ success: boolean; data: DisciplinePlan }>(`/v1/rule-children/${childRuleId}`);
     return res.data.data;
};

export const createCustomizedChildRule = async (
     planId: number,
     ruleData: {
          name: string;
          consiquences?: string;
          notes?: string;
          color?: string;
          order?: number;
     }
): Promise<Rule> => {
     const res = await api.post<{ success: boolean; data: Rule; message: string }>(
          `/v1/plan-children/${planId}/rules/custom`,
          ruleData
     );
     return res.data.data;
};
