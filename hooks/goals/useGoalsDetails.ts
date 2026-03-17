import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useGoals } from '@/hooks/goals/useGoalsData';
import { useProfileData } from '@/hooks/auth/useProfileData';
import { Goal, Reward, Reminder } from '@/types/api';
import { GoalPayload } from '@/types/api';
import { normalizeFrequencyUnit } from '@/utils/Goals';

interface UseGoalDetailsProps {
     goalId?: number;
     goal?: Goal;
}

export const useGoalDetails = ({ goalId, goal: initialGoal }: UseGoalDetailsProps = {}) => {
     const router = useRouter();
     const { updateGoal, getGoal, loading: apiLoading } = useGoals();
     const { user, children, loading: profileLoading } = useProfileData();

     const [fetchedGoal, setFetchedGoal] = useState<Goal | null>(initialGoal || null);
     const [isEditing, setIsEditing] = useState(false);
     const [showCelebration, setShowCelebration] = useState(false);
     const [frequencyCount, setFrequencyCount] = useState<number>(0);
     const [frequencyDuration, setFrequencyDuration] = useState<number>(0);
     const [frequencyUnit, setFrequencyUnit] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('weekly');
     const [reminders, setReminders] = useState<Reminder[]>([]);
     const [selectedChildren, setSelectedChildren] = useState<number[]>([]);
     const [reward, setReward] = useState<Reward>({ name: '', notes: '' });
     const [editedFields, setEditedFields] = useState<Partial<GoalPayload>>({});

     const fetchReminders = async (goalId: number) => {
          // Implement your reminders fetch logic here
          return [];
     };

     const loadGoal = useCallback(async () => {
          const targetId = goalId || fetchedGoal?.id || initialGoal?.id;

          if (targetId) {
               try {
                    const goalDetails = await getGoal(targetId);
                    setFetchedGoal(prev => {
                         const updatedGoal = {
                              ...goalDetails,
                              reminder_time: goalDetails.reminder_time || prev?.reminder_time,
                              reminder_repeat_type: goalDetails.reminder_repeat_type || prev?.reminder_repeat_type
                         };
                         return updatedGoal;
                    });

                    const timeBoundCount = goalDetails.time_bound_count || 0;
                    const timeBoundValue = goalDetails.time_bound_value || 1;
                    const timeBoundPeriod = goalDetails.time_bound_period || 'weekly';

                    setFrequencyCount(timeBoundCount);
                    setFrequencyDuration(timeBoundValue);
                    setFrequencyUnit(normalizeFrequencyUnit(goalDetails.time_bound_period));

                    if (goalDetails.child_ids && goalDetails.child_ids.length > 0) {
                         setSelectedChildren(goalDetails.child_ids);
                    } else if (goalDetails.child_id) {
                         setSelectedChildren([goalDetails.child_id]);
                    } else if (goalDetails.goal_children && goalDetails.goal_children.length > 0) {
                         const childIds = goalDetails.goal_children.map((gc: any) => gc.child_id);
                         setSelectedChildren(childIds);
                    }

                    setReward({
                         name: goalDetails.reward_name || '',
                         notes: goalDetails.notes || '',
                    });

                    fetchReminders(goalDetails.id).then(setReminders);
               } catch (error) {
                    console.error('Failed to fetch goal details', error);
               }
          }
     }, [goalId, fetchedGoal?.id, initialGoal?.id, getGoal]);

     useEffect(() => {
          if (!fetchedGoal && (goalId || initialGoal)) {
               loadGoal();
          }
     }, [fetchedGoal, goalId, initialGoal, loadGoal]);

     const handleSave = async () => {
          if (!fetchedGoal) {
               console.error('No goal data found');
               // You might want to use a toast notification here instead of Alert
               alert('Error: No goal data found');
               return;
          }

          const actualUser = user?.user ?? user;
          if (!actualUser?.id) {
               console.error('No user ID found');
               alert('Error: No user information found');
               return;
          }

          const normalizeTimeBoundPeriod = (unit: 'daily' | 'weekly' | 'monthly' | 'yearly') => {
               switch (unit) {
                    case 'daily':
                         return 'days';
                    case 'weekly':
                         return 'weeks';
                    case 'monthly':
                         return 'months';
                    case 'yearly':
                         return 'years';
                    default:
                         return unit;
               }
          };

          const payload = {
               title: editedFields.title || fetchedGoal.title || 'Untitled Goal',
               description: editedFields.description || fetchedGoal.description || '',
               smart_specific: editedFields.smart_specific || fetchedGoal.smart_specific || '',
               smart_measurable: editedFields.smart_measurable || fetchedGoal.smart_measurable || '',
               smart_achievable: editedFields.smart_achievable || fetchedGoal.smart_achievable || '',
               smart_relevant: editedFields.smart_relevant || fetchedGoal.smart_relevant || '',
               time_bound_count: frequencyCount,
               time_bound_value: frequencyDuration,
               time_bound_period: normalizeTimeBoundPeriod(frequencyUnit),
               reward_name: reward.name || editedFields.reward_name || fetchedGoal.reward_name || '',
               notes: reward.notes || editedFields.notes || fetchedGoal.notes || '',
               status: editedFields.status || fetchedGoal.status || 'active',
               user_id: actualUser.id,
               category_id: fetchedGoal.category_id || fetchedGoal.goal_category_id || 0,
               reminder_time: fetchedGoal.reminder_time,
               reminder_repeat_type: fetchedGoal.reminder_repeat_type,
          };

          try {
               const savedGoal = await updateGoal(fetchedGoal.id, payload as any);
               setFetchedGoal(prev => prev ? { ...prev, ...savedGoal } : savedGoal);
               setEditedFields({});
               setShowCelebration(true);
          } catch (error: any) {
               console.error('Update failed:', error);
               console.error('Error response:', error.response?.data);
               alert(`Error: Failed to update goal - ${error.message}`);
          }
     };

     const handleChange = useCallback((field: keyof GoalPayload, value: string | number | number[]) => {
          setEditedFields(prev => ({ ...prev, [field]: value }));
     }, []);

     const handleDeleteReminder = async (reminderId: number) => {
          console.log('Delete reminder would be implemented here:', reminderId);
     };

     const updateRewardField = useCallback((field: keyof Reward, value: string) => {
          setReward(prev => ({ ...prev, [field]: value }));
     }, []);

     const getFieldValue = useCallback((field: keyof GoalPayload): string => {
          return (editedFields[field] as string) ?? (fetchedGoal ? (fetchedGoal[field] as string) : '') ?? '';
     }, [editedFields, fetchedGoal]);

     const handleCancelEdit = useCallback(() => {
          setIsEditing(false);
          setEditedFields({});
          if (fetchedGoal) {
               const timeBoundCount = fetchedGoal.time_bound_count || 0;
               const timeBoundValue = fetchedGoal.time_bound_value || 1;
               const timeBoundPeriod = fetchedGoal.time_bound_period || 'weeks';

               setFrequencyCount(timeBoundCount);
               setFrequencyDuration(timeBoundValue);
               setFrequencyUnit(timeBoundPeriod as 'daily' | 'weekly' | 'monthly' | 'yearly');

               if (fetchedGoal.child_ids && fetchedGoal.child_ids.length > 0) {
                    setSelectedChildren(fetchedGoal.child_ids);
               } else if (fetchedGoal.child_id) {
                    setSelectedChildren([fetchedGoal.child_id]);
               }

               setReward({
                    name: fetchedGoal.reward_name || '',
                    notes: fetchedGoal.notes || '',
               });
          }
     }, [fetchedGoal]);

     const handleCloseCelebration = useCallback(() => {
          setIsEditing(false);
          setShowCelebration(false);
          router.back();
     }, [router]);

     const toggleChildSelection = useCallback((childId: number) => {
          setSelectedChildren(prev =>
               prev.includes(childId)
                    ? prev.filter(id => id !== childId)
                    : [...prev, childId]
          );
     }, []);

     const refreshGoal = useCallback(async () => {
          if (fetchedGoal?.id) {
               try {
                    const updatedGoal = await getGoal(fetchedGoal.id);
                    setFetchedGoal(prev => ({
                         ...updatedGoal,
                         reminder_time: updatedGoal.reminder_time || prev?.reminder_time,
                         reminder_repeat_type: updatedGoal.reminder_repeat_type || prev?.reminder_repeat_type
                    }));
               } catch (error) {
                    console.error('Failed to refresh goal:', error);
               }
          }
     }, [fetchedGoal?.id, getGoal]);

     const updateReminderData = useCallback((reminderData: { reminder_time?: string; reminder_repeat_type?: string }) => {
          setFetchedGoal(prev => {
               if (!prev) return prev;
               return {
                    ...prev,
                    ...reminderData
               };
          });
     }, []);

     const goBack = useCallback(() => {
          router.back();
     }, [router]);

     return {
          fetchedGoal,
          setFetchedGoal,
          isEditing,
          showCelebration,
          frequencyCount,
          frequencyDuration,
          frequencyUnit,
          reminders,
          selectedChildren,
          reward,
          editedFields,
          apiLoading,
          profileLoading,
          children,
          user,

          handleSave,
          handleChange,
          handleDeleteReminder,
          updateRewardField,
          fetchReminders,
          getFieldValue,
          handleCancelEdit,
          handleCloseCelebration,
          toggleChildSelection,
          refreshGoal,
          loadGoal,
          updateReminderData,
          goBack,

          setIsEditing,
          setShowCelebration,
          setFrequencyCount,
          setFrequencyDuration,
          setFrequencyUnit,
          setReminders,
          setSelectedChildren,
          setReward,
          setEditedFields,
     };
};