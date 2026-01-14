import { api } from '@/lib/api'
import axios, { AxiosRequestConfig } from 'axios';
import { Contact } from '@/types/api'

export const getContacts = async (): Promise<Contact[]> => {
     const res = await api.get<{ success: boolean; data: Contact[] }>('/v1/contacts');
     return res.data.data;
};

export const getAllContacts = async (): Promise<Contact[]> => {
     const res = await api.get<{ success: boolean; data: Contact[] }>(
          "/v1/contacts?type=active&page=1&per_page=10"
     );
     return res.data.data;
};

export const getSingleContact = async (id: number): Promise<Contact> => {
     const res = await api.get<{ success: boolean; data: Contact }>(`/v1/contacts/${id}`)
     return res.data.data
}

export const createContact = async (formData: FormData): Promise<Contact> => {
     const res = await api.post<{ success: boolean; data: Contact }>('/v1/contacts', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
     })
     return res.data.data
}

export const updateContact = async (
     id: number,
     data: Partial<Contact> | FormData
): Promise<Contact | null> => {
     const isFormData = data instanceof FormData;

     const config: AxiosRequestConfig = isFormData
          ? { headers: { 'Content-Type': 'multipart/form-data' } }
          : {};

     const res = await api.put<{
          success: boolean;
          data: Contact;
     }>(`/v1/contacts/${id}`, data, config);

     return res.data?.data ?? null;
};

export const deleteContact = async (id: number): Promise<Contact> => {
     const res = await api.delete<{ success: boolean; data: Contact }>(`/v1/contacts/${id}`)
     return res.data.data
}

export const restoreContacts = async (): Promise<Contact[]> => {
     const res = await api.post<{ success: boolean; data: Contact[] }>('/v1/contacts?type=active&page=1&per_page=10')
     return res.data.data
}

export const assignContactToChild = async (data: { child_id: number; contact_id: number }) =>
     api.post(`/v1/contacts/${data.contact_id}/assign-children`, {
          child_ids: [data.child_id]
     })

export const assignContactToChildren = async (data: { contact_id: number; child_ids: number[] }) =>
     api.post(`/v1/contacts/${data.contact_id}/assign-children`, {
          child_ids: data.child_ids
     })

//-------------------- Referrals------------//
export const getContactInviteCode = async (data: { contact_id: number }): Promise<{ code: string }> => {
     const res = await api.get<{
          success: boolean;
          data: {
               contact: any;
               referral_code: string;
               share_url: string;
          };
          message: string;
     }>(`/v1/contacts/${data.contact_id}/invitation-code`)
     console.log('getContactInviteCode response:', res.data);
     return { code: res.data.data.referral_code };
}

export const getNewInviteCode = async (data: { contact_id: number }): Promise<{ code: string }> => {
     const res = await api.post<{
          success: boolean;
          data: {
               contact: any;
               referral_code: string;
               share_url: string;
          };
          message: string;
     }>(`/v1/contacts/${data.contact_id}/generate-code`)
     return { code: res.data.data.referral_code };
}