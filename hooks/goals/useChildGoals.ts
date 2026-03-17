import { useCallback, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import Toast from 'react-native-toast-message'
import { RootStackParamList } from '@/types/rootStack'
import { childGoalApi, goalApi } from '@/services/goalService'
import { ChildGoal } from '@/types/goalApi'
import { UpdateGoalPayload } from '@/types/updateGoal'
import { Alert } from 'react-native'

export const useChildGoals = (childId: number) => {
     const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
     const [goals, setGoals] = useState<ChildGoal[]>([])
     const [loading, setLoading] = useState(true)
     const [error, setError] = useState<string | null>(null)
     const [refreshing, setRefreshing] = useState(false)
     const [celebratingTask, setCelebratingTask] = useState<{
          visible: boolean;
          taskTitle: string
     }>({ visible: false, taskTitle: '' })

     const [masteredGoalsCount, setMasteredGoalsCount] = useState(0)
     const [navigatingGoalId, setNavigatingGoalId] = useState<number | null>(null)

     const fetchMasteredGoalsCount = useCallback(async () => {
          if (!childId) return

          try {
               const masteredGoals = await childGoalApi.getMasteredGoals(childId)
               if (typeof masteredGoals === 'number') {
                    setMasteredGoalsCount(masteredGoals)
               } else if (Array.isArray(masteredGoals)) {
                    setMasteredGoalsCount(masteredGoals.length)
               } else if (masteredGoals && typeof masteredGoals === 'object') {
                    setMasteredGoalsCount(masteredGoals.count || 0)
               } else {
                    setMasteredGoalsCount(0)
               }
          } catch (err) {
               console.error('Failed to fetch mastered goals count:', err)
               setMasteredGoalsCount(0)
          }
     }, [childId])

     const handleGoalCompleted = useCallback((goalId: number) => {
          setGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId));
     }, []);

     const fetchGoals = useCallback(async () => {
          if (!childId) {
               setLoading(false)
               setError("No child selected")
               return
          }

          try {
               setLoading(true)
               setError(null)

               const childGoals = await childGoalApi.getChildGoals(childId)

               if (!Array.isArray(childGoals)) {
                    setGoals([])
                    return
               }

               setGoals(childGoals)

               await fetchMasteredGoalsCount()
          } catch (err) {
               console.error('Failed to fetch goals:', err)
               setError("Failed to load goals. Please try again.")
               setGoals([])
               setMasteredGoalsCount(0)
          } finally {
               setLoading(false)
               setRefreshing(false)
          }
     }, [childId, fetchMasteredGoalsCount])

     const fetchGoalDetails = useCallback(async (goalId: number) => {
          try {
               const goalDetails = await goalApi.getOne(goalId);
               return goalDetails;
          } catch (err) {
               console.error('[useChildGoals] Failed to fetch goal details:', err);
               throw err;
          }
     }, [])

     const updateChildGoal = useCallback(async (goalId: number, payload: UpdateGoalPayload): Promise<ChildGoal> => {
          try {
               setLoading(true);
               const synchronizedPayload = {
                    ...payload,
                    ...(payload.time_bound_count !== undefined && {
                         time_bound_count: payload.time_bound_count,
                         total_target: payload.time_bound_count
                    }),
                    ...(payload.total_target !== undefined && payload.time_bound_count === undefined && {
                         total_target: payload.total_target,
                         time_bound_count: payload.total_target
                    }),
                    reminder_time: payload.reminder_time || null,
                    reminder_repeat_type: payload.reminder_repeat_type || null,
               };

               console.log('Synchronized payload - time_bound_count and total_target:', {
                    time_bound_count: synchronizedPayload.time_bound_count,
                    total_target: synchronizedPayload.total_target
               });

               const response = await childGoalApi.updateChildGoal(goalId, synchronizedPayload);
               setGoals(prevGoals => prevGoals.map(goal => {
                    if (goal.id === goalId) {
                         const updatedGoal: ChildGoal = {
                              ...goal,
                              ...response,
                              reminders: Array.isArray(response.reminders) ? response.reminders : (goal.reminders || []),
                              goal: {
                                   ...goal.goal,
                                   title: response.title || goal.goal.title,
                                   smart_specific: response.smart_specific || goal.goal.smart_specific,
                                   smart_measurable: response.smart_measurable || goal.goal.smart_measurable,
                                   smart_achievable: response.smart_achievable || goal.goal.smart_achievable,
                                   smart_relevant: response.smart_relevant || goal.goal.smart_relevant,
                                   time_bound_count: response.time_bound_count ?? synchronizedPayload.time_bound_count ?? goal.goal.time_bound_count,
                                   total_target: response.total_target ?? synchronizedPayload.total_target ?? goal.goal.total_target,
                                   time_bound_period: response.time_bound_period ?? goal.goal.time_bound_period,
                                   time_bound_value: response.time_bound_value ?? goal.goal.time_bound_value,
                                   reward_name: response.reward_name || goal.goal.reward_name,
                                   notes: response.notes || goal.goal.notes,
                                   status: response.status || goal.goal.status,
                              }
                         };

                         if (updatedGoal.goal.time_bound_count !== updatedGoal.goal.total_target) {
                              const synchronizedValue = updatedGoal.goal.total_target;
                              updatedGoal.goal.time_bound_count = synchronizedValue;
                              updatedGoal.goal.total_target = synchronizedValue;
                         }
                         return updatedGoal;
                    }
                    return goal;
               }));

               Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Goal updated successfully',
                    position: 'bottom'
               });

               const updatedChildGoal = goals.find(goal => goal.id === goalId) as ChildGoal;
               return updatedChildGoal;
          } catch (error) {
               console.error('Failed to update goal:', error);
               Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed to update goal',
                    position: 'bottom'
               });
               throw error;
          } finally {
               setLoading(false);
          }
     }, [childId]);

     const updateReminderData = useCallback((reminderData: { reminder_time?: string; reminder_repeat_type?: string }) => {
          setGoals(prev => {
               if (!prev) return prev;
               return {
                    ...prev,
                    ...reminderData
               };
          });
     }, [])

     const handleRefresh = useCallback(() => {
          setRefreshing(true)
          fetchGoals()
     }, [fetchGoals])

     const handleGoalDelete = useCallback((goalId: number) => {
          Alert.alert(
               'Confirm Delete',
               'Are you sure you want to delete this goal?',
               [
                    { text: 'Cancel', style: 'cancel' },
                    {
                         text: 'Delete',
                         style: 'destructive',
                         onPress: async () => {
                              try {
                                   await childGoalApi.deleteChildGoal(goalId);
                                   setGoals(prev => prev.filter(goal => goal.id !== goalId));
                                   await fetchGoals();
                                   Toast.show({
                                        type: 'success',
                                        text1: 'Success',
                                        text2: 'Goal deleted successfully',
                                        position: 'bottom',
                                   });

                              } catch (error) {
                                   console.error('Failed to delete goal:', error);

                                   Toast.show({
                                        type: 'error',
                                        text1: 'Error',
                                        text2: 'Failed to delete goal',
                                        position: 'bottom',
                                   });
                              }
                         },
                    },
               ]
          );
     }, [fetchGoals]);

     const handleStatusChange = useCallback(async (goalId: number, status: string) => {
          try {
               const updatedGoal = await childGoalApi.updateProgress(goalId)

               setGoals(prev => prev.map(goal => goal.id === goalId ? { ...goal, ...updatedGoal } : goal))

               if (status.toLowerCase() === 'mastered') {
                    console.log('Goal mastered, should show celebration modal');
                    await fetchMasteredGoalsCount()
               }
          } catch (err) {
               return
          }
     }, [fetchMasteredGoalsCount])

     const handleIncrementProgress = useCallback(async (goalId: number) => {
          try {
               const updatedGoal = await childGoalApi.incrementProgress(goalId)
               setGoals(prev => prev.map(goal => goal.id === goalId ? { ...goal, ...updatedGoal } : goal))

               Toast.show({
                    type: 'success',
                    text1: 'Progress updated',
                    position: 'bottom',
               })
          } catch (err) {
               console.error('Failed to increment progress:', err)
               Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed to increment progress',
                    position: 'bottom'
               })
          }
     }, [])

     const handleDecrementProgress = useCallback(async (goalId: number) => {
          try {
               const updatedGoal = await childGoalApi.decrementProgress(goalId)
               setGoals(prev => prev.map(goal => goal.id === goalId ? { ...goal, ...updatedGoal } : goal))

               Toast.show({
                    type: 'success',
                    text1: 'Progress updated',
                    position: 'bottom',
               })
          } catch (err) {
               console.error('Failed to decrement progress:', err)
               Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed to decrement progress',
                    position: 'bottom'
               })
          }
     }, [])

     const closeCelebrationModal = useCallback(() => {
          setCelebratingTask(prev => ({ ...prev, visible: false }))
     }, [])

     const navigateToAddGoal = useCallback(() => {
          navigation.navigate('CorePlan')
     }, [navigation])

     const navigateToGoalDetails = useCallback(async (childGoal: ChildGoal) => {
          try {
               setNavigatingGoalId(childGoal.id);

               const goalId = childGoal.goal_id || childGoal.goal?.id;
               const childId = childGoal.child_id;

               if (!goalId || !childId) {
                    Toast.show({ type: 'error', text1: 'Error', text2: 'Missing goal or child ID' });
                    return;
               }

               const goalDetails = await fetchGoalDetails(goalId);

               navigation.navigate('UpdateGoal', {
                    goal: goalDetails,
                    childId: childId,
                    onUpdate: (updatedGoal: any) => {
                         console.log('onUpdate callback triggered with:', updatedGoal);
                         setGoals(prev => prev.map(goal => {
                              if (goal.id === childGoal.id) {
                                   console.log('Updating goal from onUpdate callback');
                                   return {
                                        ...goal,
                                        ...updatedGoal,
                                        goal: {
                                             ...goal.goal,
                                             ...updatedGoal.goal
                                        }
                                   };
                              }
                              return goal;
                         }));
                    }
               });
          } catch (err) {
               console.error('Failed to fetch goal details:', err);
               navigation.navigate('UpdateGoal', {
                    goal: childGoal.goal as any,
                    childId: childGoal.child_id,
                    onUpdate: (updatedGoal: any) => {
                         setGoals(prev => prev.map(goal =>
                              goal.id === childGoal.id ? { ...goal, ...updatedGoal } : goal
                         ));
                    }
               });
          } finally {
               setNavigatingGoalId(null);
          }
     }, [navigation, fetchGoalDetails]);

     return {
          goals,
          loading,
          error,
          refreshing,
          celebratingTask,
          masteredGoalsCount,
          navigatingGoalId,
          updateReminderData,
          fetchGoals,
          fetchMasteredGoalsCount,
          fetchGoalDetails,
          handleRefresh,
          handleGoalDelete,
          handleGoalCompleted,
          handleStatusChange,
          handleIncrementProgress,
          handleDecrementProgress,
          closeCelebrationModal,
          navigateToAddGoal,
          navigateToGoalDetails,
          setGoals,
          updateChildGoal
     }
}