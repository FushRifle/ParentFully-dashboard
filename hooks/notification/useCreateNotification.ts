import { useState } from 'react';
import { notificationService } from '@/services/push-notifications/pushNotificationService';
import { NotificationType } from '@/types/notification';

export const useCreateNotification = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createNotification = async (payload: {
        type: NotificationType;
        user_id: number;
        title: string;
        message: string;
        body?: string;
        notifiable_type?: string;
        notifiable_id?: number;
        data?: Record<string, any>;
    }) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await notificationService.createNotification(payload);
            return result;
        } catch (err: any) {
            setError(err.message || 'Failed to create notification');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        createNotification,
        isLoading,
        error
    };
};
