import { api } from '@/lib/api';
import { SubscriptionPlan, UserSubscription, CreateSubscriptionPayload } from "@/types/subscription";

export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
     const res = await api.get<{ data: SubscriptionPlan[] }>("/v1/subscription/plans");
     return res.data.data;
};

export const getAllUserPlans = async (): Promise<UserSubscription[]> => {
     const res = await api.get<{ data: UserSubscription[] }>("/v1/subscriptions");
     return res.data.data;
};

export const getActiveSubscription = async (): Promise<UserSubscription | null> => {
     try {
          const res = await api.get<{ data: UserSubscription | null }>("/v1/subscription/active");
          return res.data.data;
     } catch (err: any) {
          if (err.response?.status === 404) {
               console.warn("No active subscription found");
               return null;
          }
          throw err;
     }
};

export const checkSubscriptionStatus = async (): Promise<{ active: boolean; expiry_date?: string }> => {
     const res = await api.get<{ data: { active: boolean; expiry_date?: string } }>("/v1/subscription/status");
     console.log(JSON.stringify(res.data));
     return res.data.data;
};

export const createSubscription = async (payload: CreateSubscriptionPayload): Promise<UserSubscription> => {
     const res = await api.post<{ data: UserSubscription }>("/v1/subscriptions", payload);
     console.log(JSON.stringify(res.data));
     return res.data.data;
};

export const cancelSubscription = async (id: number): Promise<UserSubscription> => {
     const res = await api.post<{ data: UserSubscription }>(`/v1/subscription/${id}/cancel`);
     console.log(JSON.stringify(res.data));
     return res.data.data;
};

export const reactivateSubscription = async (id: number): Promise<UserSubscription> => {
     const res = await api.post<{ data: UserSubscription }>(`/v1/subscription/${id}/reactivate`);
     console.log(JSON.stringify(res.data));
     return res.data.data;
};
