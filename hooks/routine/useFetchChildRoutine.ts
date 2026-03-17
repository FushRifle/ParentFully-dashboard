import { useCallback, useMemo, useState } from "react";
import {
     getAssignedChildTasks,
     getChildRoutine,
     completeTask,
     getOneRoutine,
} from "@/services/routineService";

export interface GroupedRoutine {
     id: number;
     title: string;
     description?: string;
     reminders: Reminder[];
     tasks: TaskChild[];
}

export interface Reminder {
     id: number | string;
     time: string;
     repeat: string;
     enabled: boolean;
     reminder_time: string;
     repeat_type: string;
     routine_id?: number;
}

export interface Routine {
     id: number;
     title: string;
     description: string;
     order: number;
     time?: string;
     duration?: string | number;
     added_by: number;
     updated_by: number | null;
     created_at: string;
     updated_at: string;
     deleted_at: string | null;
     task_children: TaskChild[];
     reminders: Reminder[];
}

export interface TaskChild {
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
          added_by: number;
          updated_by: number | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          icon: string;
     };
     completions: any[];
     routine_title?: string;
     routine_description?: string;
     routine_reminder_time?: string;
}

export const useChildAssignedTasks = (childId?: number) => {
     const [loading, setLoading] = useState(false);
     const [reminders, setReminders] = useState<Reminder[]>([]);
     const [tasks, setTasks] = useState<TaskChild[]>([]);
     const [error, setError] = useState<string | null>(null);
     const [completedTasks, setCompletedTasks] = useState<number[]>([]);

     const fetchTasks = useCallback(async () => {
          if (!childId) return;

          setLoading(true);
          setError(null);

          try {
               const data = await getAssignedChildTasks(childId);
               setTasks(data || []);
          } catch (err: any) {
               console.error("Error fetching assigned tasks:", err);
               setError(err?.message || "Failed to fetch assigned tasks");
               setTasks([]);
          } finally {
               setLoading(false);
          }
     }, [childId]);

     const routines: GroupedRoutine[] = useMemo(() => {
          if (!tasks.length) return [];

          const routineMap = new Map<number, GroupedRoutine>();

          for (const task of tasks) {
               const existing = routineMap.get(task.routine_id);

               if (existing) {
                    existing.tasks.push(task);
               } else {
                    routineMap.set(task.routine_id, {
                         id: task.routine_id,
                         title: task.routine_title || task.task?.title || `Routine ${task.routine_id}`,
                         description: task.routine_description || "",
                         reminders: task.routine_reminder_time
                              ? [{
                                   id: `temp-${task.routine_id}`,
                                   time: task.time || "",
                                   repeat: "once",
                                   enabled: true,
                                   reminder_time: task.routine_reminder_time,
                                   repeat_type: "once",
                                   routine_id: task.routine_id,
                              }]
                              : [],
                         tasks: [task],
                    });
               }
          }

          return Array.from(routineMap.values());
     }, [tasks]);

     const fetchReminders = useCallback(async (rid?: number) => {
          if (!rid) {
               console.warn("Routine ID is undefined, skipping fetchReminders");
               return;
          }

          try {
               const routine = (await getOneRoutine(rid)) as Partial<Routine> | any;
               const routineReminders = routine?.reminders || [];
               console.log("Parsed reminders:", routineReminders);
               setReminders(routineReminders);
          } catch (err: any) {
               console.error("Failed to fetch routine reminders");
               console.error("Routine ID:", rid);
               console.error("Error response:", err?.response?.data || err?.message || err);
          }
     }, []);

     const fetchAllReminders = useCallback(async () => {
          if (!routines.length) return [];

          try {
               const results = await Promise.all(
                    routines.map(async (routine) => {
                         const data = await getChildRoutine(routine.id);
                         return (data?.reminders || []).map((r: any) => ({
                              ...r,
                              routine_id: routine.id,
                         }));
                    })
               );

               return results.flat();
          } catch (err) {
               console.error("Failed to fetch routine reminders:", err);
               return [];
          }
     }, [routines]);

     const getRemindersForRoutine = useCallback(
          (routineId?: number) => {
               if (!routineId) return [];
               return reminders.filter((r: Reminder) => r.routine_id === routineId);
          },
          [reminders]
     );

     return {
          loading,
          error,
          tasks,
          routines,
          reminders,
          fetchTasks,
          completeTask,
          refetch: fetchTasks,
          fetchAllReminders,
          fetchReminders,
          getRemindersForRoutine,
          completedTasks,
          setCompletedTasks,
     };
};