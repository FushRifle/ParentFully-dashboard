import { api } from '@/lib/api'
import { AxiosResponse, AxiosError } from 'axios'
import {
     NotificationsResponse,
     RegisterDeviceTokenBody,
     UnregisterDeviceTokenBody,
     UnreadNotificationsResponse,
     NotificationQueryParams,
     NotificationResponse,
     MarkAllAsReadResponse,
     DeleteAllResponse,
     NotificationType
} from '@/types/notification'

interface ApiResponse<T = any> {
     success: boolean
     data: T
     message?: string
}

interface CreateNotificationBody {
     type: NotificationType
     user_id: number
     title: string
     message: string
     body?: string
     notifiable_type?: string
     notifiable_id?: number
     data?: Record<string, any>
}

const handleApiCall = async <T>(
     apiCall: Promise<AxiosResponse<ApiResponse<T>>>,
     operation: string
): Promise<T> => {
     try {
          const response = await apiCall
          return response.data.data
     } catch (error) {
          const axiosError = error as AxiosError<ApiResponse<T>>
          console.error(`API Call Failed: ${operation}`, {
               error: axiosError,
               errorMessage: axiosError.message,
               response: axiosError.response
                    ? {
                         status: axiosError.response.status,
                         data: axiosError.response.data
                    }
                    : 'No response'
          })
          throw error
     }
}

export const pushNotificationService = {
     registerDeviceToken: async (body: RegisterDeviceTokenBody) => {
          return handleApiCall(
               api.post<ApiResponse>('/v1/device-tokens', body),
               'POST /v1/device-tokens'
          )
     },

     unregisterDeviceToken: async (body: UnregisterDeviceTokenBody) => {
          return handleApiCall(
               api.post<ApiResponse>('/v1/device-tokens/deactivate', body),
               'POST /v1/device-tokens/deactivate'
          )
     },

     deactivateDeviceToken: async (body: UnregisterDeviceTokenBody) => {
          return handleApiCall(
               api.post<ApiResponse>('/v1/device-tokens/deactivate', body),
               'POST /v1/device-tokens/deactivate'
          )
     }
}

class NotificationService {
     async getNotifications(
          params?: NotificationQueryParams
     ): Promise<NotificationsResponse> {
          const response: AxiosResponse<NotificationsResponse> =
               await api.get('/v1/notifications', { params })
          return response.data
     }

     async getUnreadNotifications(): Promise<UnreadNotificationsResponse> {
          const response: AxiosResponse<UnreadNotificationsResponse> =
               await api.get('/v1/notifications/unread')
          return response.data
     }

     async getNotification(id: number): Promise<NotificationResponse> {
          const response: AxiosResponse<NotificationResponse> =
               await api.get(`/v1/notifications/${id}`)
          return response.data
     }

     async createNotification(
          body: CreateNotificationBody
     ): Promise<NotificationResponse | null> {
          try {
               const response: AxiosResponse<NotificationResponse> =
                    await api.post('/v1/notifications', body)

               return response.data
          } catch (error: any) {
               if (error?.response?.status !== 500) {
                    console.warn('Create notification failed:', error.message)
               }
               return null
          }
     }

     async markNotificationAsRead(id: number): Promise<NotificationResponse> {
          const response: AxiosResponse<NotificationResponse> =
               await api.post(`/v1/notifications/${id}/mark-as-read`)
          return response.data
     }

     async markAllAsRead(): Promise<MarkAllAsReadResponse> {
          const response: AxiosResponse<MarkAllAsReadResponse> =
               await api.post('/v1/notifications/mark-all-as-read')
          return response.data
     }

     async deleteNotification(id: number): Promise<{ success: boolean }> {
          const response = await api.delete<{ success: boolean }>(
               `/v1/notifications/${id}`
          )
          return response.data
     }

     async deleteAll(): Promise<DeleteAllResponse> {
          const response: AxiosResponse<DeleteAllResponse> =
               await api.delete('/v1/notifications')
          return response.data
     }
}

export const notificationService = new NotificationService()
export default NotificationService