import { parseISO } from 'date-fns';
import { toZonedTime, format as tzFormat } from 'date-fns-tz';
import { Reminder } from '@/types/routine';
import { useEffect, useState, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getChildRoutine } from '@/services/routineService';

const CELEBRATED_ROUTINES_KEY = 'celebrated-routines';

interface RoutineDetails {
     id: number;
     title: string;
     reminders: Reminder[];
}

interface CelebratedRoutinesHook {
     celebratedRoutines: Set<number>;
     hasLoaded: boolean;
     addCelebratedRoutine: (id: number) => void;
     clearCelebratedRoutine: (id: number) => void;
}

export const useRoutineDetails = (routines: any[]) => {
     const [routineDetails, setRoutineDetails] = useState<Map<number, RoutineDetails>>(new Map());
     const [reminders, setReminders] = useState<Map<number, Reminder[]>>(new Map());
     const [isLoading, setIsLoading] = useState(false);
     const [error, setError] = useState<string | null>(null);

     const detailsCache = useRef<Map<number, RoutineDetails>>(new Map());

     const fetchRoutineDetails = useCallback(async (routineIds: number[]) => {
          if (!routineIds.length) return;

          setIsLoading(true);
          setError(null);

          try {
               const uncachedIds = routineIds.filter(id => !detailsCache.current.has(id));

               if (!uncachedIds.length) {
                    setRoutineDetails(new Map(detailsCache.current));
                    return;
               }

               const detailsMap = new Map(detailsCache.current);
               const reminderMap = new Map(reminders);

               const promises = uncachedIds.map(async (id) => {
                    try {
                         const routine = await getChildRoutine(id);

                         const routineDetail: RoutineDetails = {
                              id,
                              title: routine.title,
                              reminders: routine.reminders || []
                         };

                         detailsMap.set(id, routineDetail);
                         reminderMap.set(id, routine.reminders || []);

                         detailsCache.current.set(id, routineDetail);
                    } catch (err) {
                         console.error(`Failed to fetch routine ${id}`, err);

                         const fallbackDetail: RoutineDetails = {
                              id,
                              title: `Routine ${id}`,
                              reminders: []
                         };

                         detailsMap.set(id, fallbackDetail);
                         reminderMap.set(id, []);

                         detailsCache.current.set(id, fallbackDetail);
                    }
               });

               await Promise.all(promises);

               setRoutineDetails(detailsMap);
               setReminders(reminderMap);

          } catch (err) {
               const errorMessage = "Error fetching routine details";
               console.error(errorMessage, err);
               setError(errorMessage);
          } finally {
               setIsLoading(false);
          }
     }, [reminders]);

     useEffect(() => {
          if (!routines?.length) return;

          const routineIds = routines.map(r => r.id).filter(Boolean);
          fetchRoutineDetails(routineIds);

     }, [routines, fetchRoutineDetails]);

     const getRoutineDetail = useCallback((id: number) => {
          return routineDetails.get(id);
     }, [routineDetails]);

     const getRoutineReminders = useCallback((id: number) => {
          return reminders.get(id) || [];
     }, [reminders]);

     const refreshRoutineDetail = useCallback(async (id: number) => {
          detailsCache.current.delete(id);
          await fetchRoutineDetails([id]);
     }, [fetchRoutineDetails]);

     return {
          routineDetails,
          reminders,
          isLoading,
          error,
          getRoutineDetail,
          getRoutineReminders,
          refreshRoutineDetail
     };
};

export const useCelebratedRoutines = (): CelebratedRoutinesHook => {
     const [celebratedRoutines, setCelebratedRoutines] = useState<Set<number>>(new Set());
     const [hasLoaded, setHasLoaded] = useState(false);
     const isInitialMount = useRef(true);

     useEffect(() => {
          const loadCelebrated = async () => {
               try {
                    const stored = await AsyncStorage.getItem(CELEBRATED_ROUTINES_KEY);
                    if (stored) {
                         setCelebratedRoutines(new Set(JSON.parse(stored)));
                    }
               } catch (error) {
                    console.error('Failed to load celebrated routines:', error);
               } finally {
                    setHasLoaded(true);
               }
          };
          loadCelebrated();
     }, []);

     useEffect(() => {
          if (isInitialMount.current) {
               isInitialMount.current = false;
               return;
          }

          const saveCelebrated = async () => {
               try {
                    await AsyncStorage.setItem(
                         CELEBRATED_ROUTINES_KEY,
                         JSON.stringify([...celebratedRoutines])
                    );
               } catch (error) {
                    console.error('Failed to save celebrated routines:', error);
               }
          };

          const timeoutId = setTimeout(saveCelebrated, 500);
          return () => clearTimeout(timeoutId);
     }, [celebratedRoutines]);

     const addCelebratedRoutine = useCallback((id: number) => {
          setCelebratedRoutines(prev => new Set(prev).add(id));
     }, []);

     const clearCelebratedRoutine = useCallback((id: number) => {
          setCelebratedRoutines(prev => {
               const newSet = new Set(prev);
               newSet.delete(id);
               return newSet;
          });
     }, []);

     return {
          celebratedRoutines,
          hasLoaded,
          addCelebratedRoutine,
          clearCelebratedRoutine
     };
};

export const useTimeFormatter = () => {
     const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

     const formatReminderTime = useCallback((isoString?: string): string => {
          if (!isoString) return 'Not set';

          try {
               const zonedDate = toZonedTime(parseISO(isoString), userTimeZone);
               return tzFormat(zonedDate, 'h:mm a', { timeZone: userTimeZone });
          } catch {
               return 'Invalid time';
          }
     }, [userTimeZone]);

     const formatTaskTime = useCallback((timeString?: string): string => {
          if (!timeString) return '';

          try {
               if (timeString.includes('T') || timeString.includes(':')) {
                    const zonedDate = toZonedTime(parseISO(timeString), userTimeZone);
                    return tzFormat(zonedDate, 'h:mm a', { timeZone: userTimeZone });
               }

               const [hours, minutes] = timeString.split(':');
               const hour = parseInt(hours, 10);

               if (isNaN(hour)) return timeString;

               const ampm = hour >= 12 ? 'PM' : 'AM';
               const displayHour = hour % 12 || 12;
               return `${displayHour}:${minutes.padStart(2, '0')} ${ampm}`;
          } catch {
               return timeString;
          }
     }, [userTimeZone]);

     return { formatReminderTime, formatTaskTime };
};