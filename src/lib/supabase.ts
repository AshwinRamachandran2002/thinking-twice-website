import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
