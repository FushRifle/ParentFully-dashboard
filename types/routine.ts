export interface Task {
    id: number;
    routine_id: number;
    title: string;
    time: string | null;
    duration: number;
    is_completed: boolean;
    routine_title?: string;
    routine_description?: string;
    routine_reminder_time?: string;
    icon?: string;
    order?: number;
    added_by?: number;
}

export interface TaskChild {
    id: number;
    task_id: number;
    child_id: number;
    routine_id: number;
    is_completed: boolean;
    title: string;
    icon: string;
    time: string | null;
    duration: number;
    order: number;
    is_active: boolean;
    points_reward: number | null;
    notes: string | null;
    completion_count: number;
    last_completed_at: string | null;
    added_by: number;
    updated_by: number | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    task: {
        id: number;
        routine_id: number;
        title: string;
        time: string | null;
        duration: number;
        order: number;
        added_by: number;
        updated_by: number | null;
        created_at: string;
        updated_at: string;
        deleted_at: string | null;
        icon: string;
    };
    completions: any[];
}

export interface Routine {
    id: number;
    title: string;
    description: string;
    order: number;
    time?: string;
    duration?: string | number;
    added_by: number;
    updated_by: number | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    task_children: TaskChild[];
    reminders: Reminder[];
}

export interface Reminder {
    id: number | string;
    time: string;
    repeat: string;
    enabled: boolean;
    reminder_time: string;
    repeat_type: string;
    routine_id?: number;
}

export interface GroupedRoutine {
    id: number;
    title: string;
    description?: string;
    reminder_time?: string;
    routine: Routine;
    tasks: Task[];
}

// API Response Types
export interface ChildRoutinesResponse {
    success: boolean;
    data: {
        child: any;
        routines: Routine[];
    };
    message: string;
}