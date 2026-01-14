import { api } from "../../lib";

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
     const res = await api.get<{ data: NotificationSettings }>("/v1/notification-settings");
     return res.data.data;
};

/**
 * UPDATE /v1/notification-settings
 * Accepts partial updates
 */
export const updateNotificationSettings = async (
     updates: Partial<NotificationSettings>
): Promise<NotificationSettings> => {
     const res = await api.put<{ data: NotificationSettings }>("/v1/notification-settings", updates);
     return res.data.data;
};

/**
 * RESET /v1/notification-settings/reset
 */
export const resetNotificationSettings = async (): Promise<NotificationSettings> => {
     const res = await api.post<{ data: NotificationSettings }>("/v1/notification-settings/reset");
     return res.data.data;
};
