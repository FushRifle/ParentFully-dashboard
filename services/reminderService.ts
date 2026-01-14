import { api } from '@/lib/api'

export interface UpdateReminderData {
     reminder_time: string;
     repeat_type: string;
     reminder_enabled: boolean;
}

export const updateRoutineReminder = async (
     routineId: number,
     data: UpdateReminderData
): Promise<void> => {
     try {
          const res = await api.put(`/v1/routines/${routineId}/reminder`, data);
     } catch (error: any) {
          throw error;
     }
};

export const updateGoalsReminder = async (
     goalId: number,
     data: UpdateReminderData
): Promise<void> => {
     try {
          const res = await api.put(`/v1/routines/${goalId}/reminder`, data)

          console.log('Goal reminder updated:', {
               status: res.status,
               data: res.data
          })
     } catch (error) {
          console.error('Failed to update goal reminder:', error)
          throw error
     }
}
