import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing Supabase URL environment variable');
}

// Client-side authentication should use the anon key
export const supabase = createClient(supabaseUrl, supabaseAnonKey || supabaseServiceKey);

// Admin operations (like managing users) should use the service role key
// CAUTION: Only use this on the server side, never expose this client to the browser
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : supabase;

export type ApiKey = {
  id: string;
  email: string;
  stripe_customer_id: string;
  api_key: string;
  revoked: boolean;
  created_at: string;
}

export type Database = {
  public: {
    Tables: {
      api_keys: {
        Row: ApiKey;
        Insert: Omit<ApiKey, 'id' | 'created_at'>;
        Update: Partial<Omit<ApiKey, 'id' | 'created_at'>>;
      };
    };
  };
};

export type SupabaseClient = ReturnType<typeof createClient<Database>>;
