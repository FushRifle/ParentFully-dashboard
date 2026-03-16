import { api } from '@/lib/api'
import { AxiosError, AxiosResponse } from 'axios'
import { Goal, ApiResponse } from '@/types/api'

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

export const getChildGoals = async (childId: number): Promise<Goal[]> => {
     try {
          const response = await handleApiCall<Goal[]>(
               api.get<ApiResponse<Goal[]>>(`/v1/children/${childId}/goals`),
               `GET /v1/children/${childId}/goals`
          )

          if (Array.isArray(response)) {
               return response
          }

          console.error('Unexpected getChildGoals response:', response)
          return []
     } catch (error) {
          console.error('Failed to fetch child goals:', error)
          return []
     }
}

