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
    user?: { id: number; name: string; email: string };
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
}): Promise<{ data: UserSession[]; meta: any }> => {
    const res = await api.get('/v1/admin/sessions', { params });
    return { data: res.data.data, meta: res.data.meta };
};
