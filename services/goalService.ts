import { api } from '@/lib'
import { AxiosError, AxiosResponse } from 'axios';
import type { AgeGroupKey } from '@/hooks/goals/useAgeGroupComment'
import { Reminder, Goal, ApiResponse, CoreValue } from '@/types/api'
import { ChildGoal, ChildGoalsResponse } from '@/types/goalApi'
import { GoalPayload, UpdateGoalPayload } from '@/types/updateGoal';

const DEFAULT_PAGINATION = {
     type: 'active',
     page: 1,
     age_group: undefined,
     per_page: 10
} as const

const handleApiCall = async <T>(
     apiCall: Promise<AxiosResponse<ApiResponse<T>>>,
     endpoint: string
): Promise<T> => {
     try {
          const response = await apiCall;
          return response.data.data;
     } catch (error) {
          console.error(`API Error for ${endpoint}:`, error);

          if (error instanceof AxiosError && error.response) {
               console.error('Full error response:',
                    JSON.stringify(error.response.data, null, 2));

               if (error.response.data?.trace) {
                    console.error('Trace array:',
                         JSON.stringify(error.response.data.trace, null, 2));
               }
          }

          throw error;
     }
};

/* -------------------- Goal Category (Core Values) -------------------- */
export const goalCategoryApi = {
     getAll: (age_group?: AgeGroupKey): Promise<CoreValue[]> => {
          return handleApiCall(
               api.get<ApiResponse<CoreValue[]>>('/v1/goal-categories', {
                    params: { age_group },
               }),
               'GET /v1/goal-categories'
          ).then((res) => {
               return res;
          }).catch((err) => {
               console.error('Error in GET /v1/goal-categories:', err);
               throw err;
          });
     },

     getOne: (id: number): Promise<CoreValue> => {
          return handleApiCall(
               api.get<ApiResponse<CoreValue>>(`/v1/goal-categories/${id}`),
               `GET /v1/goal-categories/${id}`
          )
     },

     create: (data: Partial<CoreValue>): Promise<CoreValue> => {
          return handleApiCall(
               api.post<ApiResponse<CoreValue>>('/v1/goal-categories', data),
               'POST /v1/goal-categories'
          )
     },

     update: (id: number, data: Partial<CoreValue>): Promise<CoreValue> => {
          return handleApiCall(
               api.put<ApiResponse<CoreValue>>(`/v1/goal-categories/${id}`, data),
               `PUT /v1/goal-categories/${id}`
          )
     },

     delete: (id: number): Promise<void> => {
          return api.delete(`/v1/goal-categories/${id}`)
               .then(response => {
                    return response.data
               })
               .catch(error => {
                    console.error('GoalCategoryApi.delete failed', { id, error })
                    throw error
               })
     },

     restore: (id: number, data: Partial<CoreValue>): Promise<CoreValue> => {
          return handleApiCall(
               api.post<ApiResponse<CoreValue>>(`/v1/goal-categories/${id}/restore`, data),
               `POST /v1/goal-categories/${id}/restore`
          )
     }
}

/* -------------------- Custom Goals -------------------- */
export const goalApi = {

     createCustom: async (data: Partial<Goal>): Promise<Goal> => {
          try {
               const response = await api.post<ApiResponse<Goal>>(
                    '/v1/goals/custom',
                    data
               )
               return response.data.data
          } catch (err: any) {
               console.error(
                    '[createCustom] ERROR data stringified:',
                    JSON.stringify(err?.response?.data, null, 2)
               )

               throw err
          }
     },

     getAll: async (
          category_id?: number
     ): Promise<(Goal & { categoryDescription?: string })[]> => {
          try {
               const response = await api.get<ApiResponse<Goal[]>>('/v1/goals', {
                    params: { category_id },
               });

               return response.data.data.map(goal => ({
                    ...goal,
                    categoryDescription: goal.category?.description || '',
               }));
          } catch (err: any) {
               if (err.response) {
                    console.error('[GoalApi] getAll backend error:', {
                         status: err.response.status,
                         data: err.response.data,
                         params: { category_id },
                    });
               } else {
                    console.error('[GoalApi] getAll unexpected error:', err);
               }
               throw err;
          }
     },

     getOne: async (id: number): Promise<Goal> => {
          try {
               const response = await api.get<ApiResponse<Goal>>(`/v1/goals/${id}`);
               const goal = response.data.data;
               return goal;
          } catch (err: any) {
               console.error('[GoalApi] getOne error', {
                    message: err.message,
                    id,
                    response: err.response?.data,
                    status: err.response?.status,
               });
               throw err;
          }
     },

     createFromTemplate: (data: Partial<Goal>): Promise<Goal> => {
          return handleApiCall(
               api.post<ApiResponse<Goal>>('/v1/goals/from-template', data),
               'POST /v1/goals/from-template'
          )
     },

     assignGoalsToChild: (
          goalId: number,
          data: {
               child_ids: number[];
               user_id?: number;
               core_value_id?: number;
               category_id?: number;
               time_bound_count?: number;
               time_bound_value?: number;
               time_bound_period?: string;
               reward_name?: string;
               notes?: string;
               target_date?: string;
               reminder_time?: string;
               reminder_repeat_type?: string;
          }
     ): Promise<Goal> => {

          console.log('[GoalApi] POST /v1/goals/assign-children', {
               goalId,
               payload: data
          });

          return handleApiCall(
               api.post<ApiResponse<Goal>>(
                    `/v1/goals/${goalId}/assign-children`,
                    JSON.stringify(data),
                    {
                         headers: { "Content-Type": "application/json" }
                    }
               ),
               `POST /v1/goals/${goalId}/assign-children`
          ).then((response) => {

               console.log('[GoalApi] assignGoalsToChild success', {
                    goalId,
                    response
               });

               return response;
          }).catch((error) => {

               console.error('[GoalApi] assignGoalsToChild failed', {
                    goalId,
                    payload: data,
                    error: error?.response?.data || error.message
               });

               throw error;
          });
     },

     update: (id: number, data: Partial<GoalPayload>): Promise<Goal> => {
          return handleApiCall(
               api.put<ApiResponse<Goal>>(`/v1/goals/${id}`, data),
               `PUT /v1/goals/${id}`
          );
     },

     delete: (id: number): Promise<void> => {
          return api.delete(`/v1/goals/${id}`)
               .then(response => {
                    return response.data
               })
               .catch(error => {
                    console.error('GoalApi.delete failed', { id, error })
                    throw error
               })
     }
}

/* -------------------- Child Goals Progress -------------------- */
export const childGoalApi = {

     getMasteredGoals: (childId: number): Promise<ChildGoal> => {
          return handleApiCall(
               api.get<ApiResponse<ChildGoal>>(`/v1/children/${childId}/mastered-goals`),
               `GET /v1/children/${childId}/mastered-goals`
          )
     },

     getChildGoals: (childId: number): Promise<ChildGoal[]> => {
          return handleApiCall(
               api.get<ApiResponse<ChildGoalsResponse>>(
                    `/v1/children/${childId}/goals`
               ),
               `GET /v1/children/${childId}/goals`
          ).then((response) => {
               const goals = response?.goals;

               if (Array.isArray(goals)) {
                    return goals;
               }

               console.error(
                    'Unexpected getChildGoals response structure:\n' +
                    JSON.stringify(response, null, 2)
               );

               return [];
          });
     },

     updateChildGoal: async (id: number, data: UpdateGoalPayload): Promise<Goal> => {
          const url = `/v1/goal-children/${id}`;
          const payload = {
               ...data,
               reminder_time: data.reminder_time || null,
               reminder_repeat_type: data.reminder_repeat_type || null,
          };

          try {
               console.log(JSON.stringify({
                    event: 'updateChildGoal_request',
                    id,
                    payload,
                    timestamp: new Date().toISOString()
               }));

               const res = await api.put<ApiResponse<Goal>>(url, payload);

               return res.data.data;
          } catch (error: any) {
               throw error;
          } finally {
               console.log(JSON.stringify({
                    event: 'updateChildGoal_completed',
                    id,
                    timestamp: new Date().toISOString()
               }));
          }
     },

     incrementProgress: (goalChildId: number): Promise<ChildGoal> => {
          return handleApiCall(
               api.post<ApiResponse<ChildGoal>>(`/v1/goal-children/${goalChildId}/increment`),
               `GET /v1/goal-children/${goalChildId}/increment`
          )
     },

     decrementProgress: (goalChildId: number): Promise<ChildGoal> => {
          return handleApiCall(
               api.post<ApiResponse<ChildGoal>>(`/v1/goal-children/${goalChildId}/decrement`),
               `GET /v1/goal-children/${goalChildId}/decrement`
          )
     },

     updateProgress: (goalChildId: number): Promise<ChildGoal> => {
          return handleApiCall(
               api.put<ApiResponse<ChildGoal>>(`/v1/goal-children/${goalChildId}/progress`),
               `PUT /v1/goal-children/${goalChildId}/progress`
          );
     },

     updateReminder: (goalChildId: number): Promise<Reminder> => {
          return handleApiCall(
               api.put<ApiResponse<Reminder>>(`/v1/goal-children/${goalChildId}/reminder`),
               `PUT /v1/goal-children/${goalChildId}/reminder`
          )
     },

     deleteChildGoal: (id: number): Promise<void> => {
          return api.delete(`/v1/goal-children/${id}`)
               .then(response => {
                    return response.data
               })
               .catch(error => {
                    console.error('GoalApi.delete failed', { id, error })
                    throw error
               })
     }
}

export const {
     getAll: getGoalByCategory,
     getOne: getOneGoalCategory,
     create: createGoalCategory,
     update: updateGoalCategory,
     delete: deleteGoalCategory,
     restore: restoreGoalCategory
} = goalCategoryApi

export const {
     getAll: getGoals,
     getOne: getOneGoal,
     createCustom: createCustomGoal,
     assignGoalsToChild: assignGoalsToChild,
     createFromTemplate: createGoalFromTemplate,
     update: updateGoal,
     delete: deleteGoal
} = goalApi

export const {
     getMasteredGoals,
     getChildGoals,
     deleteChildGoal: deleteChildGoal,
     updateChildGoal: updateChildGoal,
     incrementProgress: getGoalIncrement,
     decrementProgress: getGoalDecrement,
     updateProgress: updateProgressValue,
     updateReminder: updateGoalsReminder
} = childGoalApi
