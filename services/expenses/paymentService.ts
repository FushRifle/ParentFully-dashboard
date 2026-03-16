import { api } from '@/lib/api'
import { AxiosResponse } from 'axios';
import {
     PaymentsResponse,
     PaymentResponse,
     CreatePaymentData,
     UpdatePaymentData,
     PaymentQueryParams,
} from '@/types/expense';

class PaymentService {
     async getPayments(params?: PaymentQueryParams): Promise<PaymentsResponse> {
          const response: AxiosResponse<PaymentsResponse> =
               await api.get('/v1/payments', { params });
          return response.data;
     }

     async getPayment(id: number): Promise<PaymentResponse> {
          const response: AxiosResponse<PaymentResponse> =
               await api.get(`/v1/payments/${id}`);
          return response.data;
     }

     async createPayment(data: CreatePaymentData): Promise<PaymentResponse> {
          const formData = new FormData();

          formData.append('parent_id', data.parent_id.toString());
          formData.append('description', data.description);
          formData.append('amount', data.amount.toString());
          formData.append('date', data.date);
          formData.append('status', data.status);

          if (data.receipt) formData.append('receipt', data.receipt);

          const response: AxiosResponse<PaymentResponse> =
               await api.post('/v1/payments', formData, {
                    headers: {
                         'Content-Type': 'multipart/form-data',
                    },
               });
          return response.data;
     }

     async updatePayment(id: number, data: UpdatePaymentData): Promise<PaymentResponse> {
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

               const response: AxiosResponse<PaymentResponse> =
                    await api.post(`/v1/payments/${id}`, formData, {
                         headers: {
                              'Content-Type': 'multipart/form-data',
                         },
                    });
               return response.data;
          } else {
               const response: AxiosResponse<PaymentResponse> =
                    await api.put(`/v1/payments/${id}`, data);
               return response.data;
          }
     }

     async confirmPaymentReceipt(id: number): Promise<PaymentResponse> {
          const response: AxiosResponse<PaymentResponse> =
               await api.post(`/v1/payments/${id}/confirm-receipt`);
          return response.data;
     }

     async rejectPaymentReceipt(id: number): Promise<PaymentResponse> {
          const response: AxiosResponse<PaymentResponse> =
               await api.post(`/v1/payments/${id}/reject-receipt`);
          return response.data;
     }

     async deletePayment(id: number): Promise<{ success: boolean; message: string }> {
          const response: AxiosResponse<{ success: boolean; message: string }> =
               await api.delete(`/v1/payments/${id}`);
          return response.data;
     }

     async restorePayment(id: number): Promise<{ success: boolean; message: string }> {
          const response: AxiosResponse<{ success: boolean; message: string }> =
               await api.post(`/v1/payments/${id}/restore`);
          return response.data;
     }
}

export const paymentService = new PaymentService();

export default PaymentService;