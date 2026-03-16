import { api } from '@/lib/api';
import { TaskChild } from '@/types/routine';

export const getOneChildTask = async (child_task_id: number): Promise<TaskChild> => {
     const url = '/v1/task-children/' + child_task_id;
     console.log('Fetching child task:', { child_task_id, url });
     const res = await api.get(url);
     console.log('Fetched child task result:', res.data.data);
     return res.data.data;
};

export const updateSpecificChildTask = async (
     child_task_id: number,
     payload: Partial<TaskChild>
): Promise<TaskChild> => {
     const url = '/v1/task-children/' + child_task_id;
     try {
          const res = await api.put(url, payload);
          return res.data.data;
     } catch (error: any) {
          throw error;
     } finally {
          console.log('Updated Succesfully');
     }
};

export const deleteOneChildTask = async (child_task_id: number): Promise<TaskChild> => {
     const url = '/v1/task-children/' + child_task_id;
     console.log('Deleting child task:', { child_task_id, url });
     const res = await api.delete(url);
     console.log('Delete result:', res.data.data);
     return res.data.data;
};
