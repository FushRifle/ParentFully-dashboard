import { api } from '@/lib';
import type { AdminDashboardStats, AuthResponse, AuthUser, User } from '@/types/api';

type Admin = {
     id: number;
     name: string;
     email: string;
     created_at?: string;
     updated_at?: string;
     last_login_at?: string;
};

type AppUser = {
     id: number;
     name: string;
     email: string;
     phone_number?: string | null;
     country?: string | null;
     profile_image?: string | null;
     has_completed_onboarding?: boolean;
     status?: string;
     created_at?: string;
     updated_at?: string;
     active_subscription?: { plan_type: string; status: string } | null;
     family?: { id: number; name: string } | null;
     family_member?: { role?: string; status?: string } | null;
     subscriptions?: User['subscriptions'];
     email_verified_at?: string | null;
};

type PaginatedResponse<T> = {
     data: T[];
     meta: {
          current_page: number;
          per_page: number;
          total: number;
          last_page: number;
     };
};

const toDashboardUser = (source: AppUser | Admin, isAdmin = false): User => {
     const appUser = source as AppUser;
     const isPremium = appUser.active_subscription?.plan_type?.toLowerCase() === 'premium';
     const status = appUser.status || 'active';
     const profileImage = appUser.profile_image || undefined;

     const nestedUser = {
          id: source.id,
          name: source.name,
          email: source.email,
          phone_number: appUser.phone_number || '',
          country: appUser.country || undefined,
          profile_image: profileImage,
          email_verified_at: appUser.email_verified_at ?? null,
          referral_code: '',
          has_seen_intro: true,
          has_child: false,
          has_completed_onboarding: appUser.has_completed_onboarding ?? true,
          has_sent_invite: false,
          has_seen_success: true,
          created_at: source.created_at || '',
          updated_at: source.updated_at || '',
          deleted_at: null,
          is_premium: isPremium,
          role: isAdmin ? 'Admin' : 'Parent',
          status,
     } as AuthUser;

     return {
          contact_id: source.id,
          id: source.id,
          user: nestedUser,
          name: source.name,
          email: source.email,
          role: isAdmin ? 'Admin' : 'Parent',
          status,
          phone_number: appUser.phone_number || '',
          country: appUser.country || undefined,
          is_active: status === 'active',
          has_seen_intro: true,
          has_child: false,
          has_completed_onboarding: appUser.has_completed_onboarding ?? true,
          has_sent_invite: false,
          has_seen_success: true,
          children: [],
          profile_image: profileImage,
          created_at: source.created_at,
          updated_at: source.updated_at,
          is_premium: isPremium,
          active_subscription: appUser.active_subscription,
          family: appUser.family,
          family_member: appUser.family_member,
          subscriptions: appUser.subscriptions,
     };
};

export const loginAdmin = async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
     const response = await api.post<{ token: string; admin: Admin }>('/v1/admin/auth/login', credentials);

     return {
          access_token: response.data.token,
          token_type: 'Bearer',
          expires_in: 0,
          user: toDashboardUser(response.data.admin, true),
     };
};

export const logoutAdmin = () => api.post('/v1/admin/auth/logout');

export const getAdminProfile = async (): Promise<User> => {
     const response = await api.get<Admin>('/v1/admin/me');
     return toDashboardUser(response.data, true);
};

export const updateAdminProfile = async (data: Pick<User, 'name' | 'email'>): Promise<User> => {
     const response = await api.put<Admin>('/v1/admin/me', {
          name: data.name,
          email: data.email,
     });
     return toDashboardUser(response.data, true);
};

export const getDashboardStats = async (): Promise<AdminDashboardStats> => {
     const response = await api.get<AdminDashboardStats>('/v1/admin/dashboard');
     return response.data;
};

export const getAllAppUsers = async (): Promise<User[]> => {
     const perPage = 100;
     const first = await api.get<PaginatedResponse<AppUser>>('/v1/admin/app-users', {
          params: { page: 1, per_page: perPage },
     });
     const users = [...first.data.data];

     for (let page = 2; page <= first.data.meta.last_page; page += 1) {
          const response = await api.get<PaginatedResponse<AppUser>>('/v1/admin/app-users', {
               params: { page, per_page: perPage },
          });
          users.push(...response.data.data);
     }

     return users.map((user) => toDashboardUser(user));
};

export const getAppUser = async (id: number): Promise<User> => {
     const response = await api.get<AppUser>(`/v1/admin/app-users/${id}`);
     return toDashboardUser(response.data);
};

export const updateAppUserStatus = async (id: number, status: 'active' | 'suspended'): Promise<User> => {
     const response = await api.patch<AppUser>(`/v1/admin/app-users/${id}/status`, { status });
     return toDashboardUser(response.data);
};
