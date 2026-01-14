export type GoalCategory = {
     id: number
     name: string
     description: string | null
     icon: string | null
     color: string | null
     age_group: string | null
     order: number
     is_active: boolean
     added_by: number | null
     updated_by: number | null
     created_at: string
     updated_at: string
     deleted_at: string | null
}

export type ChildGoal = {
     id: number
     goal_id: number

     title: string
     description: string | null
     smart_specific: string | null
     smart_measurable: string | null
     smart_achievable: string | null
     smart_relevant: string | null
     time_bound_count: number
     time_bound_period: string
     time_bound_value: number
     total_target: number
     target_count: number
     target_period: string
     reward_name: string | null
     notes: string | null

     user_id: number
     child_id: number
     child_name: string
     current_progress: number
     start_date: string
     target_end_date: string
     actual_end_date: string | null
     status: string
     days_remaining: number
     certificate_generated: boolean
     certificate_url: string | null
     assigned_by: number
     updated_by: number | null
     created_at: string
     updated_at: string
     deleted_at: string | null
     goal: GoalDetails
     progress_logs: ProgressLog[]
     reminders: Reminder[]
     count?: number
     length?: number
     certificate: any | null
}

export type GoalDetails = {
     id: number
     goal_template_id: number | null
     goal_category_id: number
     user_id: number
     child_id: number
     child_name: string | null
     title: string
     description: string | null
     is_custom: boolean
     smart_specific: string | null
     smart_measurable: string | null
     smart_achievable: string | null
     smart_relevant: string | null

     time_bound_count: number
     time_bound_period: string
     time_bound_value: number
     total_target: number
     target_count: number
     target_period: string
     core_value_id: number | null
     reward_name: string | null
     notes: string | null

     start_date?: string;
     target_date?: string;

     reminder_type?: string;
     reminder_frequency?: number;
     reminder_interval?: number;
     reminder_time?: string;
     reminder_repeat_type?: string;

     save_to_coreplan: boolean
     status: 'Working on' | 'Mastered' | 'Expired';
     added_by: number | null
     updated_by: number | null
     created_at: string
     updated_at: string
     deleted_at: string | null
     category: GoalCategory
     template: any | null
}

export type ProgressLog = {
     id: number
     goal_child_id: number
     progress: number
     created_at: string
     updated_at: string
}

export type Reminder = {
     id: number
     goal_child_id: number
     reminder_time: string
     repeat_type: string
     custom_days: string | null
     is_active: boolean
     next_reminder_at: string | null
     added_by: number
     updated_by: number | null
     created_at: string
     updated_at: string
     deleted_at: string | null
}

export type ChildGoalsResponse = {
     goals: ChildGoal[]
     grouped?: Record<string, ChildGoal[]>
}

export interface GoalUpdatePayload {
     title?: string;
     description?: string;
     smart_specific?: string;
     smart_measurable?: string;
     smart_achievable?: string;
     smart_relevant?: string;
     time_bound_count?: number;
     time_bound_value?: number;
     time_bound_period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
     reward_name?: string;
     notes?: string;
     status?: 'active' | 'completed' | 'archived';
}