import { api } from "../../lib";

export interface NotificationPreferences {
     scheduleUpdates: boolean;
     activityReminders: boolean;
     milestoneAchievements: boolean;
     messages: boolean;
     expenseRequests: boolean;
     paymentReminders: boolean;
     appUpdates: boolean;
     securityAlerts: boolean;
}

export const getPreferences = async (): Promise<NotificationPreferences> => {
     const res = await api.get<{ data: NotificationPreferences }>("/v1/preferences");
     return res.data.data;
};

export const updatePreferences = async (
     updates: Partial<NotificationPreferences>
): Promise<NotificationPreferences> => {
     const res = await api.put<{ data: NotificationPreferences }>("/v1/preferences", updates);
     return res.data.data;
};