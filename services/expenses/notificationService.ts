
import { api } from '@/lib/api'
import { AxiosResponse } from 'axios';
import {
     NotificationsResponse,
     NotificationResponse,
     UnreadNotificationsResponse,
     MarkAllAsReadResponse,
     DeleteAllResponse,
     NotificationQueryParams
} from '@/types/expense';

class NotificationService {

     async getNotifications(params?: NotificationQueryParams): Promise<NotificationsResponse> {
          const response: AxiosResponse<NotificationsResponse> =
               await api.get('/v1/notifications', { params });

          console.log("Notifications Response:", JSON.stringify(response.data, null, 2));

          return response.data;
     }

     async getUnreadNotifications(): Promise<UnreadNotificationsResponse> {
          const response: AxiosResponse<UnreadNotificationsResponse> =
               await api.get('/v1/notifications/unread');

          console.log("Unread Notifications Response:", JSON.stringify(response.data, null, 2));

          return response.data;
     }

     async getNotification(id: number): Promise<NotificationResponse> {
          const response: AxiosResponse<NotificationResponse> =
               await api.get(`/v1/notifications/${id}`);

          console.log(`Notification ${id} Response:`, JSON.stringify(response.data, null, 2));

          return response.data;
     }


     async markNotificationAsRead(id: number): Promise<NotificationResponse> {
          const response: AxiosResponse<NotificationResponse> =
               await api.post(`/v1/notifications/${id}/mark-as-read`);
          return response.data;
     }

     async markAllNotificationsAsRead(): Promise<MarkAllAsReadResponse> {
          const response: AxiosResponse<MarkAllAsReadResponse> =
               await api.post('/v1/notifications/mark-all-as-read');
          return response.data;
     }

     async deleteNotification(id: number): Promise<{ success: boolean; message: string }> {
          const response: AxiosResponse<{ success: boolean; message: string }> =
               await api.delete(`/v1/notifications/${id}`);
          return response.data;
     }

     async deleteAllNotifications(): Promise<DeleteAllResponse> {
          const response: AxiosResponse<DeleteAllResponse> =
               await api.delete('/v1/notifications');
          return response.data;
     }
}

export const notificationService = new NotificationService();

export default NotificationService;