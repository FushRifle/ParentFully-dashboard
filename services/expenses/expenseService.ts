
import { api } from '@/lib/api'
import NetInfo from '@react-native-community/netinfo';
import { AxiosResponse } from 'axios';
import {
     // Budget Overview
     BudgetOverviewResponse,
     PeriodFilter,
     ExportQueryParams,

     // Expenses
     ExpensesResponse,
     ExpenseResponse,
     CreateExpenseData,
     UpdateExpenseData,
     AssignChildrenData,
     AssignCostSharesData,
     MarkAsReimbursedData,
     ExpenseQueryParams,

     // Payments
     PaymentsResponse,
     PaymentResponse,
     CreatePaymentData,
     UpdatePaymentData,
     PaymentQueryParams,

     // Payment Requests
     PaymentRequestsResponse,
     PaymentRequestResponse,
     CreatePaymentRequestData,
     UpdatePaymentRequestData,
     PaymentRequestQueryParams,

     // Notifications
     NotificationsResponse,
     NotificationResponse,
     UnreadNotificationsResponse,
     MarkAllAsReadResponse,
     DeleteAllResponse,
     NotificationQueryParams
} from '@/types/expense';

class BudgetService {

     //------------- Budget Overview -------------//
     async getBudgetOverview(params?: PeriodFilter): Promise<BudgetOverviewResponse> {
          const response: AxiosResponse<BudgetOverviewResponse> =
               await api.get('/v1/budget/overview', { params });
          return response.data;
     }

     async exportBudget(params: ExportQueryParams): Promise<Blob> {
          const response: AxiosResponse<Blob> = await api.get('/v1/budget/export', {
               params,
               responseType: 'blob'
          });
          return response.data;
     }

     //------------- Expense Management -------------//
     async getExpenses(params?: ExpenseQueryParams): Promise<ExpensesResponse> {
          const response: AxiosResponse<ExpensesResponse> = await api.get('/v1/expenses', { params });
          return response.data;
     }

     async getExpense(id: number): Promise<ExpenseResponse> {
          const response: AxiosResponse<ExpenseResponse> = await api.get(`/v1/expenses/${id}`);
          return response.data;
     }

     async createExpense(data: CreateExpenseData): Promise<ExpenseResponse> {
          try {
               const net = await NetInfo.fetch();
               if (!net.isConnected || net.isInternetReachable === false) {
                    throw new Error('No internet connection');
               }

               const formData = new FormData();

               const payload: Record<string, any> = {
                    child_id: data.child_id,
                    description: data.description,
                    amount: data.amount,
                    date: data.date,
                    status: data.status,
                    cat_icon: data.cat_icon,
                    cat_name: data.cat_name,
                    percentage: data.percentage,
                    reimburser: data.reimburser,
                    reimbursement:
                         data.reimbursement !== undefined
                              ? data.reimbursement ? '1' : '0'
                              : undefined
               };

               Object.entries(payload).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                         formData.append(key, String(value));
                    }
               });

               if (data.receipt) {
                    const uri = data.receipt.uri.startsWith('file://')
                         ? data.receipt.uri
                         : `file://${data.receipt.uri}`;

                    const receiptFile = {
                         uri,
                         name: data.receipt.name || `receipt_${Date.now()}.jpg`,
                         type: data.receipt.type || data.receipt.mimeType || 'image/jpeg',
                    };

                    formData.append('receipt', receiptFile as any);
               }

               if (__DEV__) {
                    console.log('CreateExpense payload');
                    Object.entries(payload).forEach(([k, v]) => {
                         if (v !== undefined) console.log(k, v);
                    });
                    if (data.receipt) console.log('receipt attached:', data.receipt.name);
               }

               const response = await api.post('/v1/expenses', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
               });

               if (!response?.data) {
                    throw new Error('Invalid server response');
               }

               return response.data;

          } catch (error: any) {

               if (error.response) {
                    const message =
                         error.response?.data?.message ||
                         error.response?.data?.error ||
                         'Failed to create expense';

                    console.error('CreateExpense API error', {
                         status: error.response.status,
                         message
                    });

                    throw new Error(message);
               }

               if (error.name === 'NetworkError') {
                    throw new Error('Network connection lost. Please try again.');
               }

               console.error('CreateExpense unexpected error', error);
               throw error;
          }
     }

     async updateExpense(id: number, data: UpdateExpenseData): Promise<ExpenseResponse> {
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

               const response: AxiosResponse<ExpenseResponse> =
                    await api.post(`/v1/expenses/${id}`, formData, {
                         headers: {
                              'Content-Type': 'multipart/form-data',
                         },
                    });
               return response.data;
          } else {
               const response: AxiosResponse<ExpenseResponse> = await api.put(`/v1/expenses/${id}`, data);
               return response.data;
          }
     }

     async approveExpense(id: number): Promise<ExpenseResponse> {
          const response: AxiosResponse<ExpenseResponse> = await api.post(`/v1/expenses/${id}/approve`);
          return response.data;
     }

     async rejectExpense(id: number): Promise<ExpenseResponse> {
          const response: AxiosResponse<ExpenseResponse> = await api.post(`/v1/expenses/${id}/reject`);
          return response.data;
     }

     async markExpenseAsReimbursed(id: number, data?: MarkAsReimbursedData): Promise<ExpenseResponse> {
          const response: AxiosResponse<ExpenseResponse> =
               await api.post(`/v1/expenses/${id}/mark-as-reimbursed`, data);
          return response.data;
     }

     async assignChildrenToExpense(id: number, data: AssignChildrenData): Promise<ExpenseResponse> {
          const response: AxiosResponse<ExpenseResponse> =
               await api.post(`/v1/expenses/${id}/assign-children`, data);
          return response.data;
     }

     async assignCostSharesToExpense(id: number, data: AssignCostSharesData): Promise<ExpenseResponse> {
          const response: AxiosResponse<ExpenseResponse> =
               await api.post(`/v1/expenses/${id}/assign-cost-shares`, data);
          return response.data;
     }

     async deleteExpense(id: number): Promise<{ success: boolean; message: string }> {
          const response: AxiosResponse<{ success: boolean; message: string }> =
               await api.delete(`/v1/expenses/${id}`);
          return response.data;
     }

     async restoreExpense(id: number): Promise<{ success: boolean; message: string }> {
          const response: AxiosResponse<{ success: boolean; message: string }> =
               await api.post(`/v1/expenses/${id}/restore`);
          return response.data;
     }

     //--------------------Payment Management---------------------\\
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

     //----------- Payment Request Management----------\\
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

     async createPaymentRequest(data: CreatePaymentRequestData | FormData): Promise<PaymentRequestResponse> {
          try {
               let formData: FormData;

               if (data instanceof FormData) {
                    formData = data;
               } else {
                    formData = new FormData();

                    if (data.payer_id !== undefined && data.payer_id !== null) {
                         formData.append("payer_id", String(data.payer_id));
                         formData.append("requester_id", String(data.payer_id));
                    }

                    if (data.added_by !== undefined && data.added_by !== null) {
                         formData.append("added_by", String(data.added_by));
                    }

                    if (data.description) {
                         formData.append("description", data.description);
                    }

                    if (data.amount !== undefined && data.amount !== null) {
                         formData.append("amount", String(data.amount));
                    }

                    if (data.currency) {
                         formData.append("currency", data.currency);
                    }

                    const optionalFields: Record<string, any> = {
                         purpose: data.purpose,
                         due_date: data.due_date,
                         receipt: data.receipt,
                         status: data.status,
                    };

                    Object.entries(optionalFields).forEach(([key, value]) => {
                         if (value !== undefined && value !== null) {
                              if (key === 'receipt' && typeof value === 'object' && value.uri) {
                                   const fileObj = value as any;
                                   formData.append(key, {
                                        uri: fileObj.uri,
                                        type: fileObj.mimeType || fileObj.type || 'image/jpeg',
                                        name: fileObj.name || 'receipt.jpg'
                                   } as any);
                              } else {
                                   formData.append(key, String(value));
                              }
                         }
                    });
               }

               const response: AxiosResponse<PaymentRequestResponse> = await api.post(
                    "/v1/payment-requests",
                    formData,
                    {
                         headers: {
                              "Content-Type": "multipart/form-data",
                              "Accept": "application/json"
                         }
                    }
               );

               return response.data;

          } catch (error: any) {
               throw error;
          }
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



     // Notification Management
     async getNotifications(params?: NotificationQueryParams): Promise<NotificationsResponse> {
          const response: AxiosResponse<NotificationsResponse> =
               await api.get('/v1/notifications', { params });
          return response.data;
     }

     async getUnreadNotifications(): Promise<UnreadNotificationsResponse> {
          const response: AxiosResponse<UnreadNotificationsResponse> =
               await api.get('/v1/notifications/unread');
          return response.data;
     }

     async getNotification(id: number): Promise<NotificationResponse> {
          const response: AxiosResponse<NotificationResponse> =
               await api.get(`/v1/notifications/${id}`);
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

export const budgetService = new BudgetService();

export default BudgetService;