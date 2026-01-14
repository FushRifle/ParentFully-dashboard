export type PlanType = "monthly" | "yearly";

export interface SubscriptionPlan {
     id: number;
     name: string;
     type: PlanType;
     price: number;
     features: string[];
     plan_type: PlanType;
     billing_cycle?: string;
     description?: string;
}

export interface UserSubscription {
     id: number;
     plan_id: number;
     plan_type: PlanType;

     name?: string;
     billing_cycle?: string;
     price?: number;

     amount: number;
     payment_method: string;
     transaction_id: number;
     auto_renewal: boolean;
     features: string[];
     status: "active" | "cancelled" | "expired";
     start_date: string;
     end_date: string;
}

export interface CreateSubscriptionPayload {
     plan_type: PlanType;
     plan_id: number;
     amount: number;
     payment_method: string;
     transaction_id: number;
     auto_renewal: boolean;
     features: string[];
}
