import { useState, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";
import { RootStackParamList } from "@/types/rootStack";
import { getChildren } from "@/services/childService";
import { createRoutine, createTask } from "@/services/routineService";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useCreateNotification } from '@/hooks/notification/useCreateNotification';
import { ROUTINE_ICON_OPTIONS } from "@/constants/Icons";
import { ChildData } from '@/types/api';

type AddRoutineScreenRouteProp = RouteProp<RootStackParamList, "AddRoutine">;

export interface LocalTask {
     id: number;
     title: string;
     icon: string;
     duration: number | string;
     time?: string;
}

export const useCustomRoutine = () => {
     const { user } = useAuth();
     const navigation = useNavigation<any>();
     const route = useRoute<AddRoutineScreenRouteProp>();
     const params = route.params ?? {};
     const tasksFromParams = (params as any).tasks ?? [];

     const [loading, setLoading] = useState(false);
     const [savedRoutineId, setSavedRoutineId] = useState<string | null>(null);
     const [showCelebration, setShowCelebration] = useState(false);
     const [showSuccessModal, setShowSuccessModal] = useState(false);
     const [showTimePicker, setShowTimePicker] = useState(false);

     const [routineName, setRoutineName] = useState('');
     const [routineDescription, setRoutineDescription] = useState('');
     const [selectedTime, setSelectedTime] = useState(new Date());
     const [completedTasks, setCompletedTasks] = useState<LocalTask[]>([]);
     const [children, setChildren] = useState<ChildData[]>([]);
     const [selectedChild, setSelectedChild] = useState<ChildData | null>(null);

     const {
          createNotification,
          isLoading: creatingNotification
     } = useCreateNotification()

     const [currentTask, setCurrentTask] = useState<{
          title: string;
          duration?: number;
          time?: string;
          iconId: string;
     }>({
          title: '',
          duration: undefined,
          time: undefined,
          iconId: ROUTINE_ICON_OPTIONS[0].id,
     });

     const [tasks, setTasks] = useState<LocalTask[]>(
          Array.isArray(tasksFromParams) && tasksFromParams.length > 0
               ? tasksFromParams.map((task: any, index: number) => ({
                    id: task.id ?? Date.now() + index,
                    title: typeof task === "string" ? task : task.title || '',
                    duration: task.duration ?? 5,
                    icon: task.icon || ROUTINE_ICON_OPTIONS[0].id,
               }))
               : [
                    {
                         id: Date.now(),
                         title: '',
                         duration: 5,
                         icon: ROUTINE_ICON_OPTIONS[0].id,
                    },
               ]
     );

     useEffect(() => {
          getChildren()
               .then((data) => {
                    setChildren(data as ChildData[]);
                    if (data.length) setSelectedChild(data[0] as ChildData);
               })
               .catch((err) => console.error('Error fetching children:', err));
     }, []);

     const formatTime = (date: Date) =>
          date.toLocaleTimeString([], {
               hour: '2-digit',
               minute: '2-digit',
               hour12: true,
          });

     const convertTo24HourFormat = (time: string) => {
          let [timePart, modifier] = time.split(' ');
          let [hours, minutes] = timePart.split(':');

          let hour = parseInt(hours, 10);
          const minute = parseInt(minutes, 10);

          if (modifier?.toLowerCase() === 'pm' && hour < 12) hour += 12;
          if (modifier?.toLowerCase() === 'am' && hour === 12) hour = 0;

          return `${hour.toString().padStart(2, '0')}:${minute
               .toString()
               .padStart(2, '0')}`;
     };

     const handleEditTask = (task: LocalTask) => {
          setCompletedTasks((prev) => prev.filter((t) => t.id !== task.id));

          setCurrentTask({
               title: task.title,
               duration: Number(task.duration) || 5,
               time: task.time,
               iconId: task.icon || ROUTINE_ICON_OPTIONS[0].id,
          });

          if (task.time) {
               const [timePart, modifier] = task.time.split(' ');
               let [hours, minutes] = timePart.split(':');

               if (modifier === 'PM' && hours !== '12')
                    hours = String(parseInt(hours) + 12);
               if (modifier === 'AM' && hours === '12') hours = '00';

               const newTime = new Date();
               newTime.setHours(parseInt(hours));
               newTime.setMinutes(parseInt(minutes));
               setSelectedTime(newTime);
          }
     };

     const addTask = () => {
          if (!currentTask.title.trim()) return;

          const newTask: LocalTask = {
               id: Date.now(),
               title: currentTask.title.trim(),
               duration: currentTask.duration || 5,
               time: formatTime(selectedTime),
               icon: currentTask.iconId,
          };

          setCompletedTasks((prev) => [...prev, newTask]);

          setCurrentTask({
               title: '',
               duration: undefined,
               time: undefined,
               iconId: ROUTINE_ICON_OPTIONS[0].id,
          });

          setShowSuccessModal(true);
          setTimeout(() => setShowSuccessModal(false), 2000);
     };

     const removeTask = (id: number) =>
          setCompletedTasks((prev) => prev.filter((task) => task.id !== id));

     const updateTaskName = (title: string) =>
          setCurrentTask((prev) => ({ ...prev, title }));

     const updateTaskDuration = (duration: number) =>
          setCurrentTask((prev) => ({ ...prev, duration }));

     const handleTimeChange = (_: any, time?: Date) => {
          setShowTimePicker(false);
          if (time) setSelectedTime(time);
     };

     const handleSave = async () => {
          if (!user?.user?.id || completedTasks.length === 0) return;

          try {
               setLoading(true);

               const childrenList = await getChildren();
               if (!childrenList.length) return;

               const defaultTime =
                    completedTasks.map((t) => t.time).filter(Boolean)[0] || '09:00';

               const routinePayload = {
                    title: routineName || "Morning Routine",
                    description: routineDescription || "Daily routine tasks",
                    added_by: Number(user.user.id),
               };

               const createdRoutine = await createRoutine(routinePayload);
               const routineId = createdRoutine.id;

               setSavedRoutineId(String(routineId));

               for (let index = 0; index < completedTasks.length; index++) {
                    const task = completedTasks[index];

                    await createTask({
                         routine_id: routineId,
                         title: task.title,
                         time: task.time
                              ? convertTo24HourFormat(task.time)
                              : defaultTime,
                         duration: parseInt(String(task.duration)) || 5,
                         order: index + 1,
                         icon: task.icon,
                    });
               }

               setShowCelebration(true);
          } catch (err) {
               console.error('Error saving routine:', err);
          } finally {
               setLoading(false);
          }
     };

     const handlePress = async () => {
          try {
               await handleSave();
          } catch (err) {
               console.error("Save routine error:", err);
          }
     };

     const navigateToRoutine = () => {
          setShowCelebration(false);
          navigation.navigate("Routine", { routineId: savedRoutineId });
     };

     return {
          loading,
          routineName,
          routineDescription,
          selectedTime,
          completedTasks,
          currentTask,
          showTimePicker,
          showSuccessModal,
          showCelebration,
          savedRoutineId,

          setRoutineName,
          setRoutineDescription,
          setSelectedTime,
          setShowTimePicker,
          setShowCelebration,
          setCurrentTask,

          handleEditTask,
          addTask,
          removeTask,
          updateTaskName,
          updateTaskDuration,
          handleTimeChange,
          handlePress,
          formatTime,
          navigateToRoutine,
     };
};
