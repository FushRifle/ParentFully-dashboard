import { api } from '@/lib/api'
import { AxiosRequestConfig } from 'axios';

export interface ChildData {
     id: number;
     name: string;
     age?: string;
     dob?: string;
     gender: "male" | "female" | "other" | "";
     child_interest: string[];
     allergies: string[];
     photo?: {
          uri: string;
          type?: string;
          fileName?: string;
     } | string;
}

export const getChildren = async (): Promise<ChildData[]> => {
     try {
          const res = await api.get<{
               success: boolean;
               data: ChildData[];
          }>('/v1/children');
          return res.data.data;
     } catch (error) {
          console.error('Error fetching children:', error);
          throw error;
     }
};

export const getSingleChild = async (id: number): Promise<ChildData> => {
     try {
          const res = await api.get<{ success: boolean; data: ChildData }>(`/v1/children/${id}`);
          return res.data.data;
     } catch (error) {
          console.error('Error fetching single child:', error);
          throw error;
     }
}

export const createChild = async (formData: FormData): Promise<ChildData> => {
     try {
          const res = await api.post<{ success: boolean; data: ChildData }>(
               '/v1/children',
               formData,
               {
                    headers: {
                         'Content-Type': 'multipart/form-data',
                    }
               }
          );
          return res.data.data;

     } catch (error: any) {
          console.error('[createChild] API call failed:');
          console.error('   Error message:', error.message);
          console.error('   Request payload details:');
          if (formData) {
               for (const pair of (formData as any).entries()) {
                    const [key, value] = pair;
                    console.error(`     ${key}:`, value);
               }
          }

          throw error;
     }
}

export const updateChild = async (childId: number, data: Partial<ChildData> | FormData): Promise<any> => {
     const isFormData = data instanceof FormData;

     const config: AxiosRequestConfig = isFormData
          ? {
               headers: {
                    'Content-Type': 'multipart/form-data',
               },
          }
          : {};

     const response = await api.put(`/v1/children/${childId}`, data, config);
     return response.data;
};

export const restoreChild = async (id: number): Promise<ChildData> => {
     const res = await api.put<{
          success: boolean;
          data: ChildData
     }>(`/v1/children/${id}/restore`)
     return res.data.data
}

export const deleteChild = async (id: number): Promise<void> => {
     await api.delete(`/v1/children/${id}`)
}
