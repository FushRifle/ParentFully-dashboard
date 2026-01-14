import { api } from '@/lib/api'
import { Expense, Payment } from '@/types/api'

export const getExpenses = async (): Promise<Expense[]> => {
     const res = await api.get<{ success: boolean; data: Expense[] }>('/expenses')
     return res.data.data
}

export const createExpense = async (formData: FormData): Promise<Expense> => {
     const res = await api.post<{ success: boolean; data: Expense }>('/expenses', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
     })
     return res.data.data
}

export const createPayment = async (formData: FormData): Promise<Payment> => {
     const res = await api.post<{ success: boolean; data: Payment }>('/payments', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
     })
     return res.data.data
}
