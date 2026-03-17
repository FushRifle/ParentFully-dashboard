import { useCallback, useEffect, useMemo, useState } from "react";
import { useTheme } from "@/styles/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Alert } from "react-native";
import { getChildren } from "@/services/childService";
import { Task, ChildData, Reminder, TaskOrder } from '@/types/api';
import { useRoutineData, useRoutineOperations } from '@/hooks/routine/useUserRoutine';
import { Routine } from "@/types/api";
import {
     createTask, deleteTask,
     reorderTask, bulkAssignTasksToChildren,
     getOneRoutine
} from "@/services/routineService";

export const useRoutineDetails = () => {
     const { user } = useAuth();
     const { colors } = useTheme();
     const navigation = useNavigation<any>();
     const route = useRoute<any>();
     const { routineId } = route.params;
     const userId = user?.user?.id;

     const { routines, loading, loadAllData } = useRoutineData();
     const {
          editingRoutine,
          editName,
          editDescription,
          setEditName,
          setEditDescription,
          handleSaveEdit,
          closeEditModal,
          handleStartEdit
     } = useRoutineOperations(routines);

     // State
     const [editing, setEditing] = useState(false);
     const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
     const [reminders, setReminders] = useState<Reminder[]>([]);
     const [refreshing, setRefreshing] = useState(false);
     const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
     const [showOptions, setShowOptions] = useState(false);
     const [activeMenu, setActiveMenu] = useState<number | null>(null);
     const [tasks, setTasks] = useState<Task[]>([]);
     const [saving, setSaving] = useState(false);
     const [children, setChildren] = useState<ChildData[]>([]);
     const [childrenLoading, setChildrenLoading] = useState(false);
     const [childrenError, setChildrenError] = useState<string | null>(null);
     const [selectedChildren, setSelectedChildren] = useState<ChildData[]>([]);
     const [assignSheetOpen, setAssignSheetOpen] = useState(false);
     const [showAssignmentSuccess, setShowAssignmentSuccess] = useState(false);
     const routine = useMemo(() =>
          routines.find(r => r.id === parseInt(routineId)) || null,
          [routines, routineId]
     );

     const fetchRoutineAndTasks = useCallback(async () => {
          try {
               await loadAllData();
          } catch (err) {
               console.error("Error fetching routine and tasks:", err);
               Alert.alert("Error", "Failed to load routine");
          }
     }, [loadAllData]);

     const fetchReminders = useCallback(async (rid: number) => {
          try {

               const routine = (await getOneRoutine(rid)) as Partial<Routine> | any;
               const routineReminders = routine?.reminders || [];
               setReminders(routineReminders);
          } catch (err: any) {
               console.error("Failed to fetch routine reminders");

               console.error("Routine ID:", rid);

               console.error(
                    "Error response:",
                    err?.response?.data || err?.message || err
               );
          }
     }, []);

     const fetchChildren = useCallback(async () => {
          try {
               setChildrenLoading(true);
               setChildrenError(null);
               const childrenData = await getChildren();
               setChildren(childrenData as ChildData[]);
          } catch (err: any) {
               console.error("Error fetching children:", err?.message ?? err);
               setChildrenError("Failed to load children");
          } finally {
               setChildrenLoading(false);
          }
     }, [userId]);

     useEffect(() => {
          fetchRoutineAndTasks();
          fetchReminders(routineId);
     }, [fetchRoutineAndTasks, fetchReminders, routineId]);

     useEffect(() => {
          fetchChildren();
     }, [fetchChildren]);

     useEffect(() => {
          if (routine?.tasks) {
               setTasks(routine.tasks as unknown as Task[]);
          }
     }, [routine]);

     const onRefresh = useCallback(() => {
          setRefreshing(true);
          Promise.all([fetchRoutineAndTasks(), fetchReminders(routineId), fetchChildren()]).finally(() =>
               setRefreshing(false)
          );
     }, [fetchRoutineAndTasks, fetchReminders, fetchChildren, routineId]);

     const toggleTask = useCallback((index: number) => {
          setSelectedTasks((prev) =>
               prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
          );
     }, []);

     const toggleSelectAll = useCallback(() => {
          if (selectedTasks.length === tasks.length) {
               setSelectedTasks([]);
          } else {
               setSelectedTasks(tasks.map((_, index) => index));
          }
     }, [tasks, selectedTasks]);

     const handleSaveRoutine = async () => {
          if (!routine) return;

          try {
               const result = await handleSaveEdit();
               if (result) {
                    setEditing(false);
                    await fetchRoutineAndTasks();
                    Alert.alert("Success", "Routine updated successfully");
               }
          } catch (err: any) {
               console.error("Failed to save routine:", err);
               Alert.alert(
                    "Update Failed",
                    "We're experiencing technical issues updating routines. Please try again later or contact support if the problem continues."
               );
               setEditing(false);
          }
     };

     const handleCancel = useCallback(() => {
          setEditing(false);
          closeEditModal();
          fetchRoutineAndTasks();
     }, [fetchRoutineAndTasks, closeEditModal]);

     const handleAssignToChild = useCallback(() => {
          setAssignSheetOpen(true);
     }, []);

     const handleAddCustomRoutine = useCallback(() => {
          navigation.navigate("CustomTask", {
               onSave: async (savedTask: Task, isEditing: boolean) => {
                    if (isEditing) {
                         const updatedTasks = tasks.map(t =>
                              t.id === savedTask.id ? savedTask : t
                         );
                         setTasks(updatedTasks);
                    } else {
                         try {
                              const newTask = await createTask({
                                   title: savedTask.title,
                                   routine_id: parseInt(routineId),
                                   time: savedTask.time || "00:00",
                                   duration: savedTask.duration || 15,
                              });
                              setTasks(prev => [...prev, newTask as Task]);
                              fetchRoutineAndTasks();
                         } catch (err) {
                              Alert.alert("Error", "Failed to create task");
                         }
                    }
               },
               routineId: routineId,
          });
     }, [navigation, tasks, routineId, fetchRoutineAndTasks]);

     const handleAssignRoutine = useCallback(async () => {
          if (!selectedChildren || selectedChildren.length === 0) {
               console.log("No children selected.");
               return;
          }

          if (!selectedTasks || selectedTasks.length === 0) {
               console.log("No tasks selected.");
               return;
          }

          const tasksToAssign = selectedTasks
               .map((index) => tasks[index])
               .filter(Boolean);

          try {
               const childIds = selectedChildren.map((child) => child.id);
               const taskIds = tasksToAssign.map((task) => task.id);

               await bulkAssignTasksToChildren({
                    routine_id: parseInt(routineId),
                    child_ids: childIds,
                    task_ids: taskIds,
               });

               setAssignSheetOpen(false);
               setSelectedChildren([]);
               setSelectedTasks([]);
               setShowAssignmentSuccess(true);

          } catch (err) {
               console.error("=== Assign Routine: ERROR ===");
               console.error(err);
               Alert.alert("Error", "Failed to assign routine");
          }
     }, [selectedChildren, selectedTasks, tasks, routineId]);

     const handleDeleteTask = async (taskId: number) => {
          try {
               await deleteTask(taskId);
               setTasks(prev => prev.filter(t => t.id !== taskId));
               setOpenDropdownIndex(null);
               fetchRoutineAndTasks();
          } catch (error) {
               console.error("Error deleting task:", error);
               Alert.alert("Error", "Failed to delete task");
          }
     };

     const handleDragEnd = useCallback(async ({ data }: { data: Task[] }) => {
          setTasks(data);
          try {
               const taskOrder: TaskOrder = {
                    tasks: data.map((task, index) => ({
                         id: task.id,
                         order: index + 1
                    }))
               };

               await reorderTask(taskOrder);
          } catch (error) {
               console.error("Error saving task order:", error);
               Alert.alert("Error", "Failed to save task order");
               fetchRoutineAndTasks();
          }
     }, [routineId, fetchRoutineAndTasks]);

     const keyExtractor = useCallback(
          (item: Task, index: number) => item.id?.toString() ?? `task-${index}`,
          []
     );

     return {
          // State
          colors: useTheme().colors,
          routine,
          loading,
          editing,
          openDropdownIndex,
          reminders,
          refreshing,
          selectedTasks,
          showOptions,
          tasks,
          saving,
          children,
          childrenLoading,
          childrenError,
          selectedChildren,
          assignSheetOpen,
          showAssignmentSuccess,
          editName,
          editDescription,

          // Setters
          setEditing,
          setOpenDropdownIndex,
          setShowOptions,
          setSelectedChildren,
          setAssignSheetOpen,
          setShowAssignmentSuccess,
          setEditName,
          setEditDescription,

          // Functions
          navigation,
          handleSaveRoutine,
          handleCancel,
          handleAssignToChild,
          handleAddCustomRoutine,
          handleAssignRoutine,
          handleDeleteTask,
          handleDragEnd,
          toggleTask,
          toggleSelectAll,
          keyExtractor,
          onRefresh,
          fetchReminders,
          handleStartEdit,
          closeEditModal,
     };
};