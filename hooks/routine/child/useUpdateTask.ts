import { useState, useCallback } from 'react';
import { TaskChild } from '@/types/routine';
import {
     getOneChildTask,
     updateSpecificChildTask,
     deleteOneChildTask
} from '@/services/Child-Specific/routineService';

export const useChildTask = (child_task_id?: number) => {
     const [task, setTask] = useState<TaskChild | null>(null);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState<string | null>(null);

     const fetchTask = useCallback(async () => {
          if (!child_task_id) return;
          setLoading(true);
          setError(null);

          try {
               const data = await getOneChildTask(child_task_id);
               setTask(data);
          } catch (err: any) {
               setError(err?.message || 'Failed to fetch task');
               setTask(null);
          } finally {
               setLoading(false);
          }
     }, [child_task_id]);

     const updateTask = useCallback(
          async (payload: Partial<TaskChild>) => {
               if (!child_task_id) return null;
               setLoading(true);
               setError(null);

               try {
                    const updated = await updateSpecificChildTask(child_task_id, payload);
                    setTask(updated);
                    return updated;
               } catch (err: any) {
                    setError(err?.message || 'Failed to update task');
                    return null;
               } finally {
                    setLoading(false);
               }
          },
          [child_task_id]
     );

     const deleteTask = useCallback(async () => {
          if (!child_task_id) return null;
          setLoading(true);
          setError(null);

          try {
               const deleted = await deleteOneChildTask(child_task_id);
               setTask(null);
               return deleted;
          } catch (err: any) {
               setError(err?.message || 'Failed to delete task');
               return null;
          } finally {
               setLoading(false);
          }
     }, [child_task_id]);

     return {
          task,
          setTask,
          loading,
          error,
          fetchTask,
          updateTask,
          deleteTask
     };
};
