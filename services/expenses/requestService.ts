import { api } from '@/lib/api'
import { AxiosResponse } from 'axios';
import {
     PaymentRequestsResponse,
     PaymentRequestResponse,
     CreatePaymentRequestData,
     UpdatePaymentRequestData,
     PaymentRequestQueryParams,
} from '@/types/expense';

class RequestService {

     async getPaymentRequests(params?: PaymentRequestQueryParams): Promise<PaymentRequestsResponse> {
          const response: AxiosResponse<PaymentRequestsResponse> =
               await api.get('/v1/payment-requests', { params });
          return response.data;
     }

     async getPaymentRequest(id: number): Promise<PaymentRequestResponse> {
          const response: AxiosResponse<PaymentRequestResponse> =
               await api.get(`/v1/payment-requests/${id}`);
          return response.data;
     }

     async createPaymentRequest(data: CreatePaymentRequestData): Promise<PaymentRequestResponse> {
          const formData = new FormData();

          formData.append('payer_id', data.payer_id.toString());
          formData.append('description', data.description);
          formData.append('amount', data.amount.toString());

          if (data.purpose) formData.append('purpose', data.purpose);
          if (data.due_date) formData.append('due_date', data.due_date);
          if (data.receipt) formData.append('receipt', data.receipt);
          if (data.status) formData.append('status', data.status);

          const response: AxiosResponse<PaymentRequestResponse> =
               await api.post('/v1/payment-requests', formData, {
                    headers: {
                         'Content-Type': 'multipart/form-data',
                    },
               });
          return response.data;
     }

     async updatePaymentRequest(id: number, data: UpdatePaymentRequestData): Promise<PaymentRequestResponse> {
          if (data.receipt) {
               const formData = new FormData();
               Object.entries(data).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                         if (value instanceof File) {
                              formData.append(key, value);
                         } else {
                              formData.append(key, value.toString());
                         }
                    }
               });

               const response: AxiosResponse<PaymentRequestResponse> =
                    await api.post(`/v1/payment-requests/${id}`, formData, {
                         headers: {
                              'Content-Type': 'multipart/form-data',
                         },
                    });
               return response.data;
          } else {
               const response: AxiosResponse<PaymentRequestResponse> =
                    await api.put(`/v1/payment-requests/${id}`, data);
               return response.data;
          }
     }

     async approvePaymentRequest(id: number): Promise<PaymentRequestResponse> {
          const response: AxiosResponse<PaymentRequestResponse> =
               await api.post(`/v1/payment-requests/${id}/approve`);
          return response.data;
     }

     async rejectPaymentRequest(id: number): Promise<PaymentRequestResponse> {
          const response: AxiosResponse<PaymentRequestResponse> =
               await api.post(`/v1/payment-requests/${id}/reject`);
          return response.data;
     }

     async markPaymentRequestAsPaid(id: number): Promise<PaymentRequestResponse> {
          const response: AxiosResponse<PaymentRequestResponse> =
               await api.post(`/v1/payment-requests/${id}/mark-as-paid`);
          return response.data;
     }

     async deletePaymentRequest(id: number): Promise<{ success: boolean; message: string }> {
          const response: AxiosResponse<{ success: boolean; message: string }> =
               await api.delete(`/v1/payment-requests/${id}`);
          return response.data;
     }

     async restorePaymentRequest(id: number): Promise<{ success: boolean; message: string }> {
          const response: AxiosResponse<{ success: boolean; message: string }> =
               await api.post(`/v1/payment-requests/${id}/restore`);
          return response.data;
     }
}

export const requestService = new RequestService();

export default RequestService;