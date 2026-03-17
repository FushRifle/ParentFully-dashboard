import { useCallback, useState } from 'react';
import { useGoals } from './useGoalsData';
import { Goal, Reward, SmartFields } from '@/types/api';
import { useProfileData } from '@/hooks/profile/useProfileData';
import { useAuth } from '@/context/AuthContext';
import { notifyGoalCreated } from '@/utils/notification';
import { useCreateNotification } from '../notification/useCreateNotification';

export const SMART_FIELDS_CONFIG = [
     { key: 'specific', Text: 'Specific', placeholder: 'What are the areas you need to focus on?' },
     { key: 'measurable', Text: 'Measurable', placeholder: 'How will you measure success?' },
     { key: 'achievable', Text: 'Achievable', placeholder: 'Is the goal realistic?' },
     { key: 'relevant', Text: 'Relevant', placeholder: 'Why is this goal important?' },
] as const;

export type TimeBoundPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly'

type ApiTimeBoundPeriod = 'days' | 'weeks' | 'months' | 'years'

const TIME_BOUND_API_MAP: Record<TimeBoundPeriod, ApiTimeBoundPeriod> = {
     daily: 'days',
     weekly: 'weeks',
     monthly: 'months',
     yearly: 'years',
}

export const FREQUENCY_UNITS = [
     { label: 'Days', value: 'daily' },
     { label: 'Weeks', value: 'weekly' },
     { label: 'Months', value: 'monthly' },
     { label: 'Years', value: 'yearly' },
] as const;

export const INITIAL_FORM_STATE = {
     area: '',
     goalText: '',
     status: 'Working on' as 'Working on' | 'Mastered',
     selectedChild: [] as number[],
     saveToCorePlan: true,
     frequencyCount: 1,
     frequencyDuration: 1,
     frequencyUnit: 'weekly' as 'daily' | 'weekly' | 'monthly' | 'yearly',
};

export const INITIAL_SMART_FIELDS: SmartFields = {
     specific: '',
     measurable: '',
     achievable: '',
     relevant: '',
};

export const INITIAL_REWARD: Reward = {
     name: '',
     notes: '',
};

export const useAddGoal = (initialGoal?: Goal | null) => {
     const { user } = useAuth();
     const { createGoal, loading, error } = useGoals();
     const { children, loading: profileLoading } = useProfileData();
     const { createNotification } = useCreateNotification()

     const [formState, setFormState] = useState(INITIAL_FORM_STATE);
     const [smart, setSmart] = useState<SmartFields>(INITIAL_SMART_FIELDS);
     const [reward, setReward] = useState<Reward>(INITIAL_REWARD);
     const [reminders, setReminders] = useState<any[]>([]);

     const updateFormState = useCallback((field: keyof typeof formState, value: any) => {
          setFormState(prev => ({ ...prev, [field]: value }));
     }, []);

     const updateSmartField = useCallback((field: keyof SmartFields, value: string) => {
          setSmart(prev => ({ ...prev, [field]: value }));
     }, []);

     const updateRewardField = useCallback((field: keyof Reward, value: string) => {
          setReward(prev => ({ ...prev, [field]: value }));
     }, []);

     const resetForm = useCallback(() => {
          setFormState(INITIAL_FORM_STATE);
          setSmart(INITIAL_SMART_FIELDS);
          setReward(INITIAL_REWARD);
          setReminders([]);
     }, []);

     const initializeWithGoal = useCallback((goal: Goal) => {
          setFormState(prev => ({
               ...prev,
               area: goal.area || '',
               goalText: goal.goal || '',
               status: goal.status === 'Mastered' ? 'Mastered' : 'Working on',
               selectedChild: goal.assigned_to ? [Number(goal.assigned_to)] : [],
          }));

          setSmart({
               specific: goal.specific || '',
               measurable: goal.measurable || '',
               achievable: goal.achievable || '',
               relevant: goal.relevant || '',
          });

          if (goal.reward_name) {
               setReward({
                    name: goal.reward_name,
                    notes: goal.reward_notes || '',
               });
          }
     }, []);

     const getChildName = useCallback((childId: number): string => {
          if (!children || children.length === 0) return 'Unknown';
          const child = children.find(c => c.id === childId);
          return child?.name || 'Unknown';
     }, [children]);

     const submitGoal = useCallback(
          async (categoryId: number) => {
               if (!formState.area || !formState.goalText) {
                    throw new Error('Please fill in the goal area and description')
               }

               const TIME_BOUND_API_MAP = {
                    daily: 'days',
                    weekly: 'weeks',
                    monthly: 'months',
                    yearly: 'years',
               } as const

               const goalPayload = {
                    category_id: Number(categoryId),
                    title: formState.area.trim(),
                    description: formState.goalText.trim(),

                    smart_specific: smart.specific?.trim() || null,
                    smart_measurable: smart.measurable?.trim() || null,
                    smart_achievable: smart.achievable?.trim() || null,
                    smart_relevant: smart.relevant?.trim() || null,

                    time_bound_count: formState.frequencyCount,
                    time_bound_value: formState.frequencyDuration,
                    time_bound_period: TIME_BOUND_API_MAP[formState.frequencyUnit],

                    child_ids: Array.isArray(formState.selectedChild)
                         ? formState.selectedChild.map(Number).filter(id => id > 0)
                         : [],

                    reward_name: reward.name?.trim() || null,
                    notes: reward.notes?.trim() || null,

                    reminder_time: reminders?.[0]?.time || '16:00',
                    reminder_repeat_type: reminders?.[0]?.repeat || 'weekdays',
               }

               const goalData = await createGoal(goalPayload as any)

               await notifyGoalCreated({
                    goalId: goalData.id,
                    categoryId: Number(categoryId),
                    goalText: formState.goalText,
                    childIds: formState.selectedChild.map(Number),
                    getChildName,
                    createNotification, actorName: 'You',
               })
               return goalData
          },
          [
               formState, smart, reward, reminders,
               createGoal, user, createNotification, getChildName
          ]
     )

     return {
          formState,
          smart,
          reward,
          loading: loading || profileLoading,
          children,
          childrenLoading: profileLoading,
          reminders,
          error,
          setReminders,
          updateFormState,
          updateSmartField,
          updateRewardField,
          resetForm,
          initializeWithGoal,
          submitGoal,
     };
};

export type UseAddGoalReturn = ReturnType<typeof useAddGoal>;