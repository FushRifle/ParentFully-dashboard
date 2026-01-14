import { api } from '@/lib/api'
import { AxiosRequestConfig } from 'axios';
import { Contact } from '@/types/api'


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

//Child
export const restoreChild = async (id: number): Promise<ChildData> => {
     const res = await api.put<{
          success: boolean;
          data: ChildData
     }>(`/v1/children/${id}/restore`)
     return res.data.data
}

//Contact
export const restoreContacts = async (): Promise<Contact[]> => {
     const res = await api.post<{ success: boolean; data: Contact[] }>('/v1/contacts?type=active&page=1&per_page=10')
     return res.data.data
}