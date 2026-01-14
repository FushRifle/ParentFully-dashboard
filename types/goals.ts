export interface Goal {
    id: number; core_value_id: number | null; user_id?: number;
    child_id: number; reminder_id?: string | null;
    status: 'Working on' | 'Mastered' | 'Expired';
    priority?: 'low' | 'medium' | 'high';
    assigned_to?: string
    area: string; goal: string; measurable?: string; achievable?: string;
    relevant?: string; time_bound?: string; age_group?: string; created_at?: string;
    updated_at?: string; celebration?: string; progress?: number; notes?: string;
    timeframe?: string; target_date?: string; reward_name: string; reward_notes: string;

    is_default?: boolean; is_active?: boolean; is_edited?: boolean;
    is_selected?: boolean; reminders?: boolean;
}

export interface CoreValue {
    id: number
    title: string
    description: string
    icon: string
    iconComponent: React.ComponentType<any>
    color: string
    iconColor: string
}

export interface SelectedGoal {
    id: number; goal_id: number; user_id: number
    child_id: number
    area: string
    goal: string
    goal_plan: Goal
    created_at: string
    child_name?: string
    timeframe?: string
    target_date?: string
    status: 'Working on' | 'Mastered' | 'Expired'
    priority?: 'low' | 'medium' | 'high'
    reminders?: boolean
    notes?: string
    child?: ChildData
    points?: number
    progress?: number
}

export type ChildData = {
    id: number
    name: string
    photo: string | null
}

export type Reward = {
    name: string
    notes: string
}

export type SmartFields = {
    measurable: string
    achievable: string
    relevant: string
}

export interface Reminder {
    id?: number; goal_id?: number; user_id: number;
    title: string;
    message: string;
    date: string;
    time: string;
    repeat: "None" | "Once" | "Daily" | "Mon-Fri" | "Custom";
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
};