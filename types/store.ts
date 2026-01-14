export interface User {
     contact_id: number;
     id: number;
     user: AuthUser;
     name: string;
     email: string;
     role?: string;
     has_seen_intro: boolean;
     has_child: boolean;
     has_completed_onboarding: boolean;
     has_sent_invite: boolean;
     has_seen_success: boolean;
     children: any[];
     profile_image?: {
          uri: string;
          type: string;
          fileName?: string | undefined;
     } | undefined;
}

export interface AuthUser {
     id: number;
     name: string;
     email: string;
     phone_number: string;
     profile_image?: {
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