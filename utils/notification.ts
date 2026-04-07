import { NotificationType } from '@/types/notification';

export interface NotifyGoalCreatedParams {
    createNotification: (payload: {
        type: NotificationType;
        user_id: number;
        title: string;
        message: string;
        body?: string;
        notifiable_type?: string;
        notifiable_id?: number;
        data?: Record<string, any>;
    }) => Promise<any>;
    actorName: string;
    childName: string;
    goalTitle: string;
    userId: number;
    goalId: number;
    childId: number;
}

export const notifyGoalCreated = async ({
    createNotification,
    actorName,
    childName,
    goalTitle,
    userId,
    goalId,
    childId
}: NotifyGoalCreatedParams) => {
    try {
        await createNotification({
            type: 'goal_created',
            user_id: userId,
            title: 'New Goal Created',
            message: `${actorName} created a new goal "${goalTitle}" for ${childName}`,
            body: `${actorName} created a new goal "${goalTitle}" for ${childName}`,
            notifiable_type: 'Goal',
            notifiable_id: goalId,
            data: {
                goal_id: goalId,
                child_id: childId
            }
        });
    } catch (error) {
        console.warn('Failed to send goal creation notification:', error);
    }
};
