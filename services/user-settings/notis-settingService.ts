import { api } from '@/lib/api';

export interface NotificationSettings {
     scheduleUpdates: boolean;
     activityReminders: boolean;
     milestoneAchievements: boolean;
     messages: boolean;
     expenseRequests: boolean;
     paymentReminders: boolean;
     appUpdates: boolean;
     securityAlerts: boolean;
}

/**
 * GET /v1/notification-settings
 */
export const getNotificationSettings = async (): Promise<NotificationSettings> => {
     console.log('[notis] fetching notification settings');

     const res = await api.get<{ data: NotificationSettings }>(
          '/v1/notification-settings'
     );

     console.log('[notis] fetched', res.data.data);

     return res.data.data;
};

/**
 * UPDATE /v1/notification-settings
 * Accepts partial updates
 */
export const updateNotificationSettings = async (
     updates: Partial<NotificationSettings>
): Promise<NotificationSettings> => {
     console.log('[notis] updating', updates);

     const res = await api.put<{ data: NotificationSettings }>(
          '/v1/notification-settings',
          updates
     );

     console.log('[notis] updated', res.data.data);

     return res.data.data;
};

/**
 * RESET /v1/notification-settings/reset
 */
export const resetNotificationSettings = async (): Promise<NotificationSettings> => {
     console.log('[notis] resetting to defaults');

     const res = await api.post<{ data: NotificationSettings }>(
          '/v1/notification-settings/reset'
     );

     console.log('[notis] reset complete', res.data.data);

     return res.data.data;
};
