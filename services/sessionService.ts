import { api } from '@/lib';

export interface UserSession {
    id: number;
    user_id: number;
    session_id: string;
    platform: 'ios' | 'android' | null;
    device_model: string | null;
    app_version: string | null;
    os_version: string | null;
    ip_address: string | null;
    opened_at: string;
    last_active_at: string | null;
    closed_at: string | null;
    last_screen: string | null;
    screens_visited: number;
    duration_seconds: number | null;
    user?: { id: number; name: string; email: string; profile_image?: string | null };
}

export interface SessionStats {
    total_sessions: number;
    unique_users: number;
    avg_duration_secs: number;
    platform_breakdown: Record<string, number>;
    daily_opens: { date: string; count: number }[];
    top_screens: { last_screen: string; count: number }[];
    recent_sessions: UserSession[];
}

export const getSessionStats = async (params?: {
    date_from?: string;
    date_to?: string;
    platform?: string;
}): Promise<SessionStats> => {
    const res = await api.get('/v1/admin/sessions/stats', { params });
    return res.data.data;
};

export const getSessions = async (params?: {
    user_id?: number;
    platform?: string;
    date_from?: string;
    date_to?: string;
    page?: number;
    per_page?: number;
}, signal?: AbortSignal): Promise<{ data: UserSession[]; meta: any }> => {
    const res = await api.get('/v1/admin/analytics/sessions', { params, signal });
    const payload = res.data.data;
    const data = Array.isArray(payload) ? payload : payload?.data;
    if (!Array.isArray(data)) throw new Error('The sessions API returned an unexpected response.');
    return { data: data.map((session: any) => ({
        ...session,
        user_id: session.user_id ?? session.user?.id,
        user: session.user ?? {
            id: session.user_id,
            name: session.user_name,
            email: session.user_email,
            profile_image: session.user_profile_image ?? session.profile_image,
        },
    })), meta: res.data.meta ?? { current_page: payload?.current_page, last_page: payload?.last_page, total: payload?.total } };
};
