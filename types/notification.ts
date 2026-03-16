/**
 * All notification types emitted by the backend
 */
export type NotificationType =
    // Expenses
    | 'expense_created'
    | 'expense_updated'
    | 'expense_deleted'
    | 'expense_approved'
    | 'expense_rejected'
    | 'payment_received'

    // Chat
    | 'co_parent_message'

    // Routines
    | 'routine_update'

    // Tasks / Discipline
    | 'activity_reminder'

    // Goals
    | 'goal_created'
    | 'goal_achieved'

/**
 * Notification payload
 */
export interface Notification {
    id: number
    user_id: number
    notifiable_id?: number
    notifiable_type: string,
    type: NotificationType

    title: string
    body: string
    message?: string
    is_read: boolean

    /** Extra payload for deep linking */
    data?: {
        expense_id?: number
        amount?: number
        category?: string

        goal_id?: number
        child_id?: number
        routine_id?: number
        task_id?: number
        message_id?: number
        chat_id?: number
    }

    /** ISO timestamp */
    created_at: string
}

export interface RegisterDeviceTokenBody {
    token: string
    platform: 'android' | 'ios'
    device_id?: string
}

export interface UnregisterDeviceTokenBody {
    token: string
}

interface ApiResponse<T = any> {
    success: boolean
    data: T
    message?: string
}

/**
 * GET /v1/notifications
 */
export interface NotificationsResponse {
    data: Notification[]
    meta?: {
        total: number
        unread: number
        page?: number
        per_page?: number
    }
}

/**
 * Query params for listing notifications
 */
export interface NotificationQueryParams {
    page?: number
    per_page?: number
}

/**
 * GET /v1/notifications/{id}
 */
export interface NotificationResponse {
    data: Notification
}

/**
 * GET /v1/notifications/unread
 */
export interface UnreadNotificationsResponse {
    unread_count: number
    data: Notification[]
}

/**
 * POST /v1/notifications/mark-all-as-read
 */
export interface MarkAllAsReadResponse {
    success: boolean
    unread_count: number
}

/**
 * DELETE /v1/notifications
 */
export interface DeleteAllResponse {
    success: boolean
}
