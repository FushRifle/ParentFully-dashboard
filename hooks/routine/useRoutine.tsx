import { useAuth } from "@/context/AuthContext";
import {
     getRoutines,
     getTemplateRoutines,
     getOneRoutine,
     getAssignedChildTasks,
     updateRoutine,
     getTaskCompletions
} from "@/services/routineService";
import { useCallback, useState, useMemo } from "react";
import { Alert } from "react-native";
import { TaskCompletion } from "@/types/api";

export interface Task {
     id: number;
     routine_id: number;
     title: string;
     time: string;
     duration?: number;
     is_completed: boolean;
}

export interface Routine {
     id: number;
     child_id: number;
     title: string;
     description?: string;
     reminder_time?: string;
     order?: number;
     added_by: number;
     tasks?: Task[];
     created_at: string;
     updated_at: string;
     reminders: Reminder[];
}

export interface Reminder {
     id: number | string;
     time: string;
     repeat: string;
     enabled: boolean;
     reminder_time: string;
     repeat_type: string;
}

export const useRoutineData = (childId?: number) => {
     const { user } = useAuth();
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);
     const [routines, setRoutines] = useState<Routine[]>([]);
     const [reminders, setReminders] = useState<Reminder[]>([]);
     const [assignedChildTasks, setAssignedChildTasks] = useState<Task[]>([]);

     const fetchAssignedTasks = useCallback(async () => {
          if (!childId) return [];
          try {
               const tasks = await getAssignedChildTasks(childId);
               setAssignedChildTasks(tasks || []);
               return tasks || [];
          } catch (err: any) {
               console.error("Error fetching assigned child tasks:", err);
               setAssignedChildTasks([]);
               return [];
          }
     }, [childId]);

     const fetchUserRoutines = useCallback(async (): Promise<Routine[]> => {
          try {
               const [apiRoutines, apiTemplateRoutines] = await Promise.all([
                    getRoutines(),
                    getTemplateRoutines(),
               ]);


               const allRoutines = [...apiRoutines, ...apiTemplateRoutines];

               const routinesWithEmptyTasks: Routine[] = allRoutines.map(
                    (routine) => ({
                         ...routine,
                         title: routine.title || "Untitled Routine",
                         description: routine.description || "No description available",
                         reminder_time: routine.reminder_time || undefined,
                         order: routine.order || 0,
                         tasks: [],
                    })
               );

               return routinesWithEmptyTasks;
          } catch (err) {
               console.error("Error fetching routines:", err);
               throw err;
          }
     }, []);

     const filteredRoutines = useMemo(() => {
          if (!childId) return routines;

          const routineIdsWithTasks = [...new Set(assignedChildTasks.map(task => task.routine_id))];

          const childRoutines = routines
               .filter((routine) => routineIdsWithTasks.includes(routine.id))
               .map((routine) => {
                    const routineTasks = assignedChildTasks.filter((task) => task.routine_id === routine.id);

                    return {
                         ...routine,
                         child_id: childId,
                         tasks: routineTasks,
                    };
               });
          return childRoutines;
     }, [routines, childId, assignedChildTasks]);

     const loadAllData = useCallback(async () => {
          if (!childId) {
               setLoading(false);
               return;
          }

          setLoading(true);
          setError(null);
          try {
               const [routinesData, assignedTasksData] = await Promise.all([
                    fetchUserRoutines(),
                    fetchAssignedTasks()
               ]);

               setRoutines(routinesData);
          } catch (err: any) {
               console.error("Failed to load routines:", err);
               setError("Failed to load routines");
          } finally {
               setLoading(false);
          }
     }, [fetchUserRoutines, fetchAssignedTasks, childId]);

     const fetchAllReminders = useCallback(async (routineIds: number[]) => {
          try {
               const reminderPromises = routineIds.map(id => getOneRoutine(id));
               const routinesWithReminders = await Promise.all(reminderPromises);

               const allReminders = routinesWithReminders.flatMap(routine =>
                    routine.reminders || []
               );

               setReminders(allReminders);
               return allReminders;
          } catch (err) {
               console.error('Failed to fetch routine reminders', err);
               return [];
          }
     }, []);

     const fetchReminders = useCallback(async (routineId: number) => {
          try {
               const routine: Routine = await getOneRoutine(routineId);
               const routineReminders = routine.reminders || [];

               setReminders(prev => {
                    const existingIds = new Set(prev.map(r => r.id));
                    const newReminders = routineReminders.filter(r => !existingIds.has(r.id));
                    return [...prev, ...newReminders];
               });

               return routineReminders;
          } catch (err) {
               console.error('Failed to fetch routine reminders', err);
               return [];
          }
     }, []);

     const getRemindersForRoutine = useCallback((routineId: number) => {
          return reminders.filter(reminder => {
               return (reminder as any).routine_id === routineId;
          });
     }, [reminders]);

     return {
          loading,
          error,
          routines: filteredRoutines,
          allRoutines: routines,
          assignedChildTasks,
          getRemindersForRoutine,
          fetchAllReminders,
          fetchReminders,
          loadAllData,
          refetchAssignedTasks: fetchAssignedTasks,
     };
};

// ---------- Routine Operations Hook ----------
export const useRoutineOperations = (routines: Routine[]) => {
     const { user } = useAuth();
     const [selectedIds, setSelectedIds] = useState<number[]>([]);
     const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
     const [editName, setEditName] = useState("");
     const [editDescription, setEditDescription] = useState("");

     const handleDelete = useCallback(async (id: number) => {
          try {
               Alert.alert("Info", "Delete functionality needs to be implemented.");
          } catch (err) {
               console.error("Error deleting routine:", err);
               throw err;
          }
     }, []);

     const handleStartEdit = useCallback((routine: Routine) => {
          setEditingRoutine(routine);
          setEditName(routine.title);
          setEditDescription(routine.description || "");
     }, []);

     const handleSaveEdit = useCallback(async () => {
          if (!editingRoutine || !user) return;

          try {
               const updateData = {
                    title: editName.trim(),
                    description: editDescription.trim(),
               };

               const updated = await updateRoutine(editingRoutine.id, updateData);

               return {
                    type: "update" as const,
                    routine: { ...editingRoutine, ...updated },
               };
          } catch (err: any) {
               console.error("Error saving routine:", err);
               console.error("Error details:", {
                    message: err.message,
                    response: err.response?.data,
                    status: err.response?.status,
                    statusText: err.response?.statusText,
               });
               if (err.response?.status === 500) {
                    throw new Error("Server error: Unable to update routine. Please try again.");
               }
               throw err;
          }
     }, [editingRoutine, editName, editDescription, user]);

     const handleSelectPlan = useCallback((id: number) => {
          setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
     }, []);

     const clearSelection = useCallback(() => setSelectedIds([]), []);

     const closeEditModal = useCallback(() => {
          setEditingRoutine(null);
          setEditName("");
          setEditDescription("");
     }, []);

     return useMemo(
          () => ({
               selectedIds,
               editingRoutine,
               editName,
               editDescription,
               setEditName,
               setEditDescription,
               handleDelete,
               handleStartEdit,
               handleSaveEdit,
               handleSelectPlan,
               clearSelection,
               closeEditModal,
          }),
          [
               selectedIds,
               editingRoutine,
               editName,
               editDescription,
               handleDelete,
               handleStartEdit,
               handleSaveEdit,
               handleSelectPlan,
               clearSelection,
               closeEditModal,
          ]
     );
};

// ---------- Completed Tasks Hook ----------
export const useCompletedTasks = (childId: number, startDate?: string, endDate?: string) => {
     const [completedTasks, setCompletedTasks] = useState<number[]>([]);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState<string | null>(null);

     const fetchCompletedTasks = useCallback(async () => {
          if (!childId) {
               setCompletedTasks([]);
               return;
          }

          setLoading(true);
          setError(null);

          try {
               const completions: TaskCompletion[] = await getTaskCompletions(childId);
               const taskIds = completions.map((c) => c.task_id);
               setCompletedTasks(taskIds);
          } catch (err: any) {
               console.error("Hook: Error in fetchCompletedTasks:", err);

               let errorMessage = "Failed to fetch completed tasks";
               if (err.response?.data?.message) {
                    errorMessage = err.response.data.message;
               } else if (err.message) {
                    errorMessage = err.message;
               }

               setError(errorMessage);
               setCompletedTasks([]);
          } finally {
               setLoading(false);
          }
     }, [childId, startDate, endDate]);

     return useMemo(
          () => ({
               completedTasks,
               fetchCompletedTasks,
               loading,
               error,
          }),
          [completedTasks, fetchCompletedTasks, loading, error]
     );
};

// ---------- Assigned Child Tasks Hook ----------
export const useAssignedChildTasks = (childId?: number) => {
     const [tasks, setTasks] = useState<Task[]>([]);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState<string | null>(null);

     const fetchAssignedChildTasksHook = useCallback(async () => {
          if (!childId) return;

          setLoading(true);
          setError(null);

          try {
               const res = await getAssignedChildTasks(childId);
               setTasks(res || []);
          } catch (err: any) {
               console.error("Error fetching assigned child tasks:", err);
               setError(err?.message || "Failed to fetch assigned tasks");
          } finally {
               setLoading(false);
          }
     }, [childId]);

     return useMemo(
          () => ({
               tasks,
               loading,
               error,
               fetchAssignedChildTasks: fetchAssignedChildTasksHook,
          }),
          [tasks, loading, error, fetchAssignedChildTasksHook]
     );
};
