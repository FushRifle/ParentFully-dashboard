import { api } from '@/lib/api'
import dayjs from 'dayjs'
import { RoutineOrder, TaskOrder, BulkAssignTasksRequest } from '@/types/api'
import { Task, Routine, TaskChild } from '@/types/routine'
import { TaskCompletion } from '@/types/api'

/* -------------------- Template Routines -------------------- */
export const getTemplateRoutines = async (): Promise<Routine[]> => {
     const res = await api.get<{ success: boolean; data: Routine[] }>(
          '/v1/routine-templates',
          { params: { type: 'active', page: 1, per_page: 10 } }
     )
     return res.data.data
}

export const getOneTemplateRoutine = async (id: number): Promise<Routine> => {
     const res = await api.get<{ success: boolean; data: Routine }>(`/v1/routine-templates/${id}`)
     return res.data.data
}

export const createTemplateRoutine = async (data: Partial<Routine>): Promise<Routine> => {
     const res = await api.post<{ success: boolean; data: Routine }>('/v1/routines/from-template', data)
     return res.data.data
}

export const updateTemplateRoutine = async (id: number, data: Partial<Routine>): Promise<Routine> => {
     const res = await api.put<{ success: boolean; data: Routine }>(`/v1/routines/${id}`, data)
     return res.data.data
}

export const deleteTemplateRoutine = async (id: number): Promise<void> => {
     await api.delete(`/v1/routines/${id}`)
}

export const reorderTemplateRoutine = async (data: RoutineOrder): Promise<Routine[]> => {
     const res = await api.post<{ success: boolean; data: Routine[] }>('/v1/routines/reorder', data)
     return res.data.data
}

/* -------------------- Custom Routines -------------------- */
export const getRoutines = async (): Promise<Routine[]> => {
     const res = await api.get('/v1/routines', {
          params: { type: 'active', page: 1, per_page: 10 },
     });
     const routines = (res.data.data || []).map((r: any) => ({
          id: r.id,
          title: r.title,
          description: r.description,
          order: r.order,
          added_by: r.added_by,
          created_at: r.added_at,
          updated_at: r.updated_at,
          tasks: [],
     }));

     return routines;
};

export const getOneRoutine = async (id: number): Promise<Routine> => {
     const res = await api.get<{ success: boolean; data: Routine }>(`/v1/routines/${id}`)
     return res.data.data
}

export const createRoutine = async (data: Partial<Routine>): Promise<Routine> => {
     const res = await api.post<{ success: boolean; data: Routine }>('/v1/routines', data)
     return res.data.data
}

export const updateRoutine = async (id: number, data: Partial<Routine>): Promise<Routine> => {
     try {
          const res = await api.put<{
               success: boolean;
               data: Routine
          }>(`/v1/routines/${id}`, data);

          return res.data.data;
     } catch (error: any) {
          console.error("Update routine error:", error);
          console.error("Error response:", error.response?.data);
          throw error;
     }
}

export const deleteRoutine = async (id: number): Promise<void> => {
     await api.delete(`/v1/routines/${id}`)
}

export const reorderRoutine = async (data: RoutineOrder): Promise<Routine[]> => {
     try {
          const res = await api.post<{ success: boolean; data: Routine[] }>('/v1/routines/reorder', data);
          return res.data.data;
     } catch (error: any) {
          console.error("Reorder routine error:", error);
          console.error("Error details:", {
               url: '/v1/routines/reorder',
               payload: data,
               status: error.response?.status,
               statusText: error.response?.statusText,
               data: error.response?.data
          });
          throw error;
     }
}

/* -------------------- Tasks -------------------- */
export const createTask = async (data: Partial<Task>): Promise<Task> => {
     try {
          console.log('[createTask] Payload:', JSON.stringify(data, null, 2));
          const res = await api.post<{ success: boolean; data: Task }>('/v1/tasks', data);
          console.log('[createTask] Response:', JSON.stringify(res.data, null, 2));
          return res.data.data;
     } catch (error) {
          console.error('[createTask] Error:', error);
          throw error;
     }
};

export const completeTask = async (data: {
     task_id: number;
     child_id: number;
     completed_at: string;
}) => {
     const res = await api.post(`/v1/tasks/${data.task_id}/complete`, {
          child_id: data.child_id,
          completed_at: data.completed_at,
     });
     return res.data;
};

export const getAllTasks = async (): Promise<Task[]> => {
     try {
          const res = await api.get<{ success: boolean; data: Task[] }>('/v1/tasks');
          return res.data.data;
     } catch (error) {
          console.error('[getAllTasks] Error:', error);
          throw error;
     }
};

export const getOneTask = async (taskId: number): Promise<Task> => {
     try {
          const res = await api.get<{ success: boolean; data: Task }>(`/v1/tasks/${taskId}`);
          console.log('[getOneTask] Response data:', JSON.stringify(res.data, null, 2));
          return res.data.data;
     } catch (error) {
          console.error(`[getOneTask] Error fetching task ${taskId}:`, error);
          throw error;
     }
};

export const getCompleteTask = async (taskId: number): Promise<Task> => {
     const res = await api.get<{ success: boolean; data: Task }>(`/v1/tasks/${taskId}/complete`)
     return res.data.data
}

export const getTaskCompletions = async (
     childId: number
): Promise<TaskCompletion[]> => {
     const res = await api.get<{ success: boolean; data: TaskCompletion[] }>('/v1/tasks/completions', {
          params: {
               child_id: childId
          }
     });

     return res.data.data;
};

export const deleteTask = async (id: number): Promise<void> => {
     await api.delete(`/v1/tasks/${id}`)
}

export const reorderTask = async (data: TaskOrder): Promise<Task[]> => {
     const res = await api.post<{ success: boolean; data: Task[] }>('/v1/tasks/reorder', data)
     return res.data.data
}

export const updateTask = async (id: number, data: Partial<Task>): Promise<Task> => {
     const res = await api.put<{
          success: boolean;
          data: {
               id: number;
               routine_id: number;
               title: string;
               time: string | null;
               duration: number;
               order: number;
               added_by: number;
               updated_by: number | null;
               created_at: string;
               updated_at: string;
               deleted_at: string | null;
               icon: string;
          }
     }>(`/v1/tasks/${id}`, data);

     const taskData = res.data.data;
     return {
          id: taskData.id,
          routine_id: taskData.routine_id,
          title: taskData.title,
          time: taskData.time,
          duration: taskData.duration,
          is_completed: false,
          order: taskData.order,
          added_by: taskData.added_by,
          icon: taskData.icon,
          routine_title: undefined,
          routine_description: undefined,
          routine_reminder_time: undefined
     };
}

export const updateChildTask = async (childTaskId: number, data: Partial<Task> & { child_id?: number }): Promise<any> => {
     const res = await api.put<{
          success: boolean;
          data: any
     }>(`/v1/child-tasks/${childTaskId}`, data);
     return res.data.data;
}

export const createChildTask = async (data: Partial<Task> & { child_id: number }): Promise<any> => {
     const res = await api.post<{ success: boolean; data: any }>('/v1/child-tasks', data);
     return res.data.data;
}

export const assignTasksToChildren = async (
     taskId: number,
     childIds: number[]
): Promise<Task[]> => {
     const res = await api.post<{ success: boolean; data: Task[] }>(
          `/v1/tasks/${taskId}/assign-children`,
          { child_ids: childIds }
     )
     return res.data.data
}

export const bulkAssignTasksToChildren =
     async (data: BulkAssignTasksRequest): Promise<Task[]> => {
          const res = await api.post<{
               success: boolean;
               data: Task[]
          }>('/v1/tasks/bulk-assign-children', data)
          return res.data.data
     }

/* -------------------- Child Routines -------------------- */
export const getChildRoutine = async (child_id: number): Promise<Routine> => {
     try {
          const res = await api.get<{
               success: boolean;
               data: Routine;
          }>(`/v1/children/${child_id}/routines`);
          return res.data.data;
     } catch (error) {
          console.error('Error fetching child routines:', error);
          throw error;
     }
};

export const getChildTasks = async (routineId: number): Promise<Task[]> => {
     const today = dayjs().format('YYYY-MM-DD')
     const res = await api.get<{ success: boolean; data: Task[] }>('/v1/children/routines', {
          params: { routine_id: routineId, date: today }
     })
     return res.data.data
}

export const getAssignedChildTasks = async (child_id: number): Promise<TaskChild[]> => {
     try {
          const res = await api.get<{
               success: boolean;
               data: {
                    child: any;
                    routines: Array<{
                         id: number;
                         title: string;
                         description: string;
                         task_children: Array<{
                              id: number;
                              task_id: number;
                              child_id: number;
                              routine_id: number;
                              title: string;
                              icon: string;
                              time: string | null;
                              duration: number;
                              order: number;
                              is_active: boolean;
                              is_completed: boolean;
                              points_reward: number | null;
                              notes: string | null;
                              completion_count: number;
                              last_completed_at: string | null;
                              added_by: number;
                              updated_by: number | null;
                              created_at: string;
                              updated_at: string;
                              deleted_at: string | null;
                              task: {
                                   id: number;
                                   routine_id: number;
                                   title: string;
                                   time: string | null;
                                   duration: number;
                                   order: number;
                                   is_completed: boolean;
                                   added_by: number;
                                   updated_by: number | null;
                                   created_at: string;
                                   updated_at: string;
                                   deleted_at: string | null;
                                   icon: string;
                              };
                              completions: any[];
                         }>;
                         reminders: Array<{ id: number; reminder_time: string;[key: string]: any }>;
                    }>;
               };
               message: string;
          }>(`/v1/children/${child_id}/routines`);

          const routines = res.data?.data?.routines ?? [];

          const tasks: TaskChild[] = routines.flatMap(routine =>
               (routine.task_children ?? []).map(taskChild => ({
                    id: taskChild.id,
                    task_id: taskChild.task_id,
                    child_id: taskChild.child_id,
                    routine_id: routine.id,
                    title: taskChild.title,
                    is_completed: taskChild.is_completed,
                    icon: taskChild.icon,
                    time: taskChild.time,
                    duration: taskChild.duration,
                    order: taskChild.order,
                    is_active: taskChild.is_active,
                    points_reward: taskChild.points_reward,
                    notes: taskChild.notes,
                    completion_count: taskChild.completion_count,
                    last_completed_at: taskChild.last_completed_at,
                    added_by: taskChild.added_by,
                    updated_by: taskChild.updated_by,
                    created_at: taskChild.created_at,
                    updated_at: taskChild.updated_at,
                    deleted_at: taskChild.deleted_at,
                    task: { ...taskChild.task },
                    completions: taskChild.completions ?? [],
                    routine_title: routine.title,
                    routine_description: routine.description,
                    routine_reminder_time: routine.reminders?.[0]?.reminder_time,
               }))
          );

          return tasks;
     } catch (error: any) {
          console.error("Error fetching child routines:", error?.message || error);
          console.error("Full error object:", JSON.stringify(error, null, 2));
          throw error;
     }
};

