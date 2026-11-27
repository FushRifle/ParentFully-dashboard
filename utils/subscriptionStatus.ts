type SubscriptionPlan = {
   status?: string | null;
   plan_code?: string | null;
   plan_type?: string | null;
};

const normalize = (value?: string | null) => value?.trim().toLowerCase().replace(/[\s-]+/g, '_');

export function formatSubscriptionStatus(status: string | null | undefined, plan: SubscriptionPlan): string {
   const normalizedStatus = normalize(status);
   if (normalizedStatus !== 'expired') {
      return normalizedStatus?.replace(/_/g, ' ') || 'Not provided';
   }

   const planCode = normalize(plan.plan_code);
   const planType = normalize(plan.plan_type);
   const isTrial = normalize(plan.status) === 'trial' ||
      [planCode, planType].some(value => value === 'premium_trial' || value === 'free_trial' || value === 'trial');
   if (isTrial) return 'Free Trial Expired';
   if ([planCode, planType].some(value => value === 'free' || value === 'free_plan')) {
      return 'Free Plan Expired';
   }
   return 'Subscription Expired';
}
