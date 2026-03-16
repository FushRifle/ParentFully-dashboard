import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
     throw new Error('Supabase URL and anon key must be provided in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);