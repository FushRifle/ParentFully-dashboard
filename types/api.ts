
//-------Auth---------//
export interface AuthResponse {
     access_token: string;
     token_type: string;
     expires_in: number;
     user: User;
}

export interface ApiResponse<T> {
     success: boolean;
     data: T;
}

export interface AuthUser {
     id: number;
     name: string;
     email: string;
     phone_number: string;
     profile_image?: | {
          uri: string;
          type: string;
          fileName?: string | undefined;
     } | undefined;
     email_verified_at: string | null;
     referral_code: string;
     has_seen_intro: boolean;
     has_child: boolean;
     has_completed_onboarding: boolean;
     has_sent_invite: boolean;
     has_seen_success: boolean;
     created_at: string;
     updated_at: string;
     deleted_at: string | null;
}

export interface User {
     id: number;
     name: string;
     email: string;
     avatar?: string;
     profile_image?: | {
          uri: string;
          type: string;
          fileName?: string | undefined;
     } | undefined;
     role?: string;
     status?: string;
     phone?: string;
     createdAt?: string;
     updatedAt?: string;

     points?: number
     is_premium?: boolean

     has_child: boolean;
     has_completed_onboarding: boolean;

     rawData?: any;
}

export interface AuthContextType {
     user: User | null
     setUser: React.Dispatch<React.SetStateAction<User | null>>
     isLoading: boolean
     loginUser: (email: string, password: string, rememberMe?: boolean) => Promise<void>
     logoutUser: () => Promise<void>
     registerUser: (data: any) => Promise<void>
     refreshUser: () => Promise<void>
     updateUserFlags: (
          flags: Partial<
               Pick<AuthUser,
                    'has_completed_onboarding' | 'has_child' | 'has_sent_invite' | 'has_seen_success'>
          > & { children?: any[] }
     ) => Promise<void>
}

export interface OnboardingState {
     hasSeenIntro: boolean
     hasCompletedOnboarding: boolean
     hasChild: boolean
     hasSentInvite: boolean
     hasSeenSuccess: boolean
     isLoading: boolean
}

//----Child------//
export interface Child {
     id: number
     name: string
     dob: string
     gender: 'male' | 'female' | 'other'
     photo?: string
     child_interest?: string
     child_allergies?: string
     added_by: number
     created_at: string
     updated_at: string
}

export interface ChildData {
     id: number
     name: string;
     age?: string;
     dob?: string;
     birth_date: Date;
     gender: "male" | "female" | "other" | "";
     child_interest: string[];
     allergies: string[]
     photo?: {
          uri: string;
          type?: string;
          fileName?: string;
     } | string;
}

//---Contact---//
export interface Contact {
     user_id: number
     id: number
     category: 'co-parent' | 'third-party' | 'child'
     permissions: 'primary' | 'co-parent' | 'third-party' | 'viewer' | 'no-access'
     name: string
     phone: string
     email: string
     address?: string
     title?: string
     photo?: {
          uri: string;
          type?: string;
          fileName?: string;
     } | string;
     country_code: string
     notify_me: boolean
     notify_contact: boolean
     children?: ChildData[]
     registered_user_id: number;
}

export interface Referrals {
     email: string
     phone_number: string
}

//------Routine--------//
export interface Task {
     task_children: any;
     id: number;
     routine_id: number;
     title: string;
     icon?: string;
     time: string;
     duration?: number;
     is_completed: boolean;
     created_at: Date;
     updated_at: Date;
}

export interface Routine {
     order: number;
     id: number;
     child_id: number;
     title: string;
     description?: string;
     added_by: number;
     tasks?: Task[];
     created_at: string;
     updated_at: string;
     reminders: Reminder[];
     reminder_repeat_type?: string;
     reminder_time?: string;
     reminder_enabled?: boolean;
}

export interface Reminder {
     id: number | string;
     time: string;
     repeat: string;
     enabled: boolean;

     reminder_time: string;
     repeat_type: string;
}

export interface TaskCompletion {
     id: number
     task_id: number
     child_id: number
     completed: boolean
     completed_at?: string
     date: string
     note?: string
     created_at: string
     updated_at: string
}

export interface AssignTasksRequest {
     routine_id: number;
     child_ids: number[];
     task_ids?: number[];
}

export interface BulkAssignTasksRequest {
     routine_id: number;
     child_ids: number[];
     task_ids: number[];
}

export interface RoutineOrder {
     routines: Array<{
          id: number;
          order: number;
     }>;
}

export interface TaskOrder {
     tasks: { id: number; order: number }[];
};

//---DIscipline ---//
export interface DisciplinePlan {
     [x: string]: any;
     id: number
     name: string
     description?: string
     notes?: string
     type: 'preset' | 'custom'
     child_id?: number;
     isTemplate?: boolean
     rules: Rule;
}

export interface AssignedChildPlansResponse {
     child: any;
     plans: DisciplinePlan[];
}

export interface Rule {
     id: number
     plan_id: number
     name: string
     consiquences?: string
     consequences?: string
     notes?: string
     length: number;
}

export interface PlansOrder {
     plans: { id: number; order: number }[];
};

// Expense / Payment
export interface Expense {
     id: number
     child_id: number
     description: string
     amount: string
     date: string
     receipt?: string
     status: 'pending' | 'approved' | 'rejected'
     added_by: number
}

export interface Payment {
     id: number
     parent_id: number
     description: string
     amount: string
     date: string
     receipt?: string
     status: 'pending' | 'approved' | 'rejected'
}


// Messages (chat)
export type Chat = {
     id: number;
     user_id: number;
     contact_id: number;
     name: string;
     avatar?: string;
     isGroup: boolean;
     type: 'direct' | 'group';
     updatedAt: string;
     lastMessage: string;
     unreadCount: number;
}

export interface Message {
     id: number;
     message?: string;
     content?: string;
     sender_id: number;
     sender_name?: string;
     reply_to?: number | null;
     replied_message?: Message | null;
     receiver_id?: number;
     conversation_id: number;
     created_at: string;
     updated_at: string;
     read?: boolean;
     attachments?: Attachment[];
}

export interface Attachment {
     id: number;
     uri?: string;
     path?: string;
     name: string;
     type: string;
     size: number;
     uploaded: boolean;
     progress?: number;
}

export interface Contact {
     registered_user_id: number;
     user_id: number;
     id: number;
     name: string;
     photo?: {
          uri: string;
          type?: string;
          fileName?: string;
     } | string;
}

export interface SelectedFile {
     uri: string;
     name: string;
     path?: string;
     type: string;
     size: number;
     isVoice?: boolean;
}

export interface SharedDocument {
     id: number;
     uri: string;
     name: string;
     type: string;
     size: number;
     uploaded: boolean;
     progress?: number;
}

export interface VoiceRecording {
     uri: string;
     name: string;
     duration: number;
     url: string;
}

export interface Picture {
     uri: string;
     name: string;
}

export interface Group {
     id: number;
     name: string;
     photo?: string;
}

export type TimeBoundPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly'

//----- Goals
export interface Goal {
     [x: string]: any;
     id: number;
     core_value_id: number;
     category_id?: number;
     user_id?: number;
     child_id: number;
     goal: string;
     name?: string;
     title?: string;
     reminder_id?: string;
     assigned_to?: string;
     description: string;
     status: 'Working on' | 'Mastered' | 'Expired';
     priority?: 'low' | 'medium' | 'high';
     area: string;
     smart_specific?: string;
     measurable?: string;
     achievable?: string;
     relevant?: string;
     time_bound?: string;
     age_group?: string;
     created_at?: string;
     updated_at?: string;
     celebration?: string;
     progress?: number;
     notes?: string;
     timeframe?: string;
     target_date?: string;
     reward_name: string;
     reward_notes: string;
     is_default?: boolean;
     is_active?: boolean;
     is_edited?: boolean;
     is_selected?: boolean;
     reminders?: boolean;
}

export interface GoalPayload {
     user_id: number;
     category_id: number;
     title: string;
     description: string;

     // SMART fields
     smart_specific: string;
     smart_measurable: string;
     smart_achievable: string;
     smart_relevant: string;

     // Time Bound
     time_bound_count: number;
     time_bound_value: number;
     time_bound_period: TimeBoundPeriod;

     // Assignments
     child_ids: number[];

     // Reward system
     reward_name?: string;
     notes?: string;

     // Reminder info
     start_date?: string;
     target_date?: string;

     reminder_type?: string;
     reminder_frequency?: number;
     reminder_interval?: number;
     reminder_time?: string;
     reminder_repeat_type?: string;
     status?: 'Working on' | 'Mastered' | 'Expired'

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

export interface CoreValue {
     id: number
     title: string
     name: string
     description: string
     icon: string
     age_range: string
     iconType?: 'material' | 'material-community' | 'ionicon' | 'font-awesome';
     color: string
     iconColor: string
     iconBg?: string;
}

export interface SelectedGoal {
     id: number
     goal_id: number
     user_id: number
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

export interface Reward {
     name: string
     notes: string
}

export interface SmartFields {
     specific: string
     measurable: string
     achievable: string
     relevant: string
}
