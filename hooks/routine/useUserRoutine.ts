import { useAuth } from "@/context/AuthContext";
import { useCallback, useState, useMemo } from "react";
import { Alert } from "react-native";
import { TaskCompletion } from "@/types/api";
import {
     getRoutines,
     getAssignedChildTasks,
     getTaskCompletions,
     updateRoutine,
     getAllTasks,
     getOneRoutine
} from "@/services/routineService";

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

// ---------- Routine Data Hook ----------
export const useRoutineData = (childId?: number) => {
     const { user } = useAuth();
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);
     const [assignedChildTasks, setAssignedChildTasks] = useState<Task[]>([]);
     const [routines, setRoutines] = useState<Routine[]>([]);
     const [reminders, setReminders] = useState<Reminder[]>([]);

     const fetchAssignedTasks = useCallback(async () => {
          if (!childId) return;
          try {
               const tasks = await getAssignedChildTasks(childId);
               setAssignedChildTasks(tasks || []);
          } catch (err: any) {
               console.error("Error fetching assigned child tasks:", err);
               setAssignedChildTasks([]);
          }
     }, [childId]);

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

     const filteredRoutines = useMemo(() => {
          if (!childId) return routines;
          return routines
               .filter((r) => r.child_id === childId)
               .map((r) => ({
                    ...r,
                    tasks: assignedChildTasks.filter((t) => t.routine_id === r.id),
               }));
     }, [routines, childId, assignedChildTasks]);

     const loadAllData = useCallback(async () => {
          setLoading(true);
          try {
               const [apiRoutines, allTasks] = await Promise.all([
                    getRoutines(),
                    getAllTasks()
               ]);

               const routinesWithTasks: Routine[] = apiRoutines.map((r) => ({
                    ...r,
                    tasks: allTasks.filter((t) => t.routine_id === r.id),
                    reminders: r.reminders || [],
                    order: r.order || 0,
                    title: r.title || "Untitled Routine",
                    description: r.description || "No description available",
               }));

               setRoutines(routinesWithTasks);

               // Fetch reminders for all routines in parallel
               const routineIds = routinesWithTasks.map(r => r.id);
               await fetchAllReminders(routineIds);

               await fetchAssignedTasks();
          } catch (err: any) {
               console.error("Error loading routine data:", err);
               setError("Failed to load routines.");
          } finally {
               setLoading(false);
          }
     }, [fetchAssignedTasks, fetchAllReminders]);

     return {
          loading,
          error,
          routines: filteredRoutines,
          allRoutines: routines,
          reminders,
          getRemindersForRoutine,
          loadAllData,
          fetchReminders,
          fetchAllReminders,
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
          Alert.alert("Info", "Delete functionality needs to be implemented.");
     }, []);

     const handleStartEdit = useCallback((routine: Routine) => {
          setEditingRoutine(routine);
          setEditName(routine.title);
          setEditDescription(routine.description || "");
     }, []);

     const handleSaveEdit = useCallback(async () => {
          if (!editingRoutine || !user) return;
          try {
               const updated = await updateRoutine(editingRoutine.id, {
                    title: editName.trim(),
                    description: editDescription.trim(),
               });
               return {
                    type: "update" as const,
                    routine: { ...editingRoutine, ...updated },
               };
          } catch (err: any) {
               console.error("Error saving routine:", err);
               throw err;
          }
     }, [editingRoutine, editName, editDescription, user]);

     const handleSelectPlan = useCallback((id: number) => {
          setSelectedIds((prev) =>
               prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
          );
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
export const useCompletedTasks = (childId: number) => {
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
               console.error("Error in fetchCompletedTasks:", err);
               setError(err?.message || "Failed to fetch completed tasks");
               setCompletedTasks([]);
          } finally {
               setLoading(false);
          }
     }, [childId]);

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