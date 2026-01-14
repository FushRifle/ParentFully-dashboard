import { api } from '@/lib/api'

export interface InvitationPayload {
     email: string;
     message?: string;
     phone_number?: number;
}

export interface ReferralCode {
     code: string;
     expires_at?: string;
}

export interface ReferralLog {
     id: string;
     user: string;
     email: string;
     created_at: string;
     status: string;
}

export interface ReferralStatistic {
     totalInvites: number;
     totalAccepted: number;
     activeReferrals: number;
}

const referralService = {
     sendInvitation: async (payload: InvitationPayload): Promise<void> => {
          await api.post('/v1/referrals/invite', payload);
     },

     getReferralCode: async (): Promise<ReferralCode> => {
          const res = await api.get<{ data: ReferralCode }>('/v1/referrals/my-code');
          console.log('getReferralCode:', JSON.stringify(res.data.data, null, 2));
          return res.data.data;
     },

     getAll: async (): Promise<ReferralLog[]> => {
          const res = await api.get<{ data: ReferralLog[] }>('/v1/referrals/invitations');
          return res.data.data;
     },

     getLogs: async (): Promise<ReferralLog[]> => {
          const res = await api.get<{ data: ReferralLog[] }>('/v1/referrals/logs');
          return res.data.data;
     },

     getStatistics: async (): Promise<ReferralStatistic> => {
          const res = await api.get<{ data: ReferralStatistic }>('/v1/referrals/statistics');
          return res.data.data;
     },
};

export default referralService;
