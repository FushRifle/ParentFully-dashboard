export type TimeBoundPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly'
export type TimeBoundPeriods = 'days' | 'weeks' | 'months' | 'years'


export interface UpdateGoalPayload {
     title: string;
     description: string;
     smart_specific: string;
     smart_measurable: string;
     smart_achievable: string;
     smart_relevant: string;

     total_target?: number;
     days_remaining?: number;

     target_end_date?: string;
     time_bound_count: number;
     time_bound_value: number;
     time_bound_period: TimeBoundPeriod;

     reward_name: string;
     notes: string;
     status: string;

     category_id: number;
     reminder_time: string | null;
     reminder_repeat_type: string | null;
}

export interface GoalPayload {
     title: string;
     description: string;
     smart_specific: string;
     smart_measurable: string;
     smart_achievable: string;
     smart_relevant: string;
     time_bound_count: number;
     time_bound_value: number;
     time_bound_period: TimeBoundPeriods;
     reward_name: string;
     notes: string;
     status: string;
     category_id: number;
     reminder_time: string | null;
     reminder_repeat_type: string | null;
}