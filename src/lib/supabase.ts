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
  user_id: string;
  api_key: string;
  revoked: boolean;
  created_at: string;
  payment_status: 'pending' | 'paid' | 'free_tier';
  tokens_processed: number;
}

export type UserSandboxSession = {
  id: string;
  user_id: string;
  app_name: string;
  sandbox_url: string;
  sandbox_password: string;
  session_start_time: string;
  session_duration_minutes: number;
  session_expired: boolean;
  deployment_status: 'pending' | 'deploying' | 'running' | 'failed' | 'destroying';
  created_at: string;
  updated_at: string;
}

export type Database = {
  public: {
    Tables: {
      api_keys: {
        Row: ApiKey;
        Insert: Omit<ApiKey, 'id' | 'created_at'>;
        Update: Partial<Omit<ApiKey, 'id' | 'created_at'>>;
      };
      user_sandbox_sessions: {
        Row: UserSandboxSession;
        Insert: Omit<UserSandboxSession, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserSandboxSession, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
};

export type SupabaseClient = ReturnType<typeof createClient<Database>>;

// Sandbox session management functions
export const sandboxSessionService = {
  // Get current session for user
  async getCurrentSession(userId: string): Promise<UserSandboxSession | null> {
    const { data, error } = await supabase
      .from('user_sandbox_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('session_expired', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data;
  },

  // Create new session for user
  async createSession(userId: string, appName: string, sandboxUrl: string, sandboxPassword: string, durationMinutes: number = 30): Promise<UserSandboxSession> {
    // First, expire any existing sessions
    await supabase
      .from('user_sandbox_sessions')
      .update({ session_expired: true, deployment_status: 'destroying' })
      .eq('user_id', userId)
      .eq('session_expired', false);

    const { data, error } = await supabase
      .from('user_sandbox_sessions')
      .insert({
        user_id: userId,
        app_name: appName,
        sandbox_url: sandboxUrl,
        sandbox_password: sandboxPassword,
        session_duration_minutes: durationMinutes,
        session_expired: false,
        deployment_status: 'pending'
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  // Update session (mark as expired)
  async expireSession(sessionId: string): Promise<void> {
    const { error } = await supabase
      .from('user_sandbox_sessions')
      .update({ session_expired: true, deployment_status: 'destroying' })
      .eq('id', sessionId);

    if (error) {
      throw error;
    }
  },

  // Update deployment status
  async updateDeploymentStatus(sessionId: string, status: UserSandboxSession['deployment_status']): Promise<void> {
    const { error } = await supabase
      .from('user_sandbox_sessions')
      .update({ deployment_status: status })
      .eq('id', sessionId);

    if (error) {
      throw error;
    }
  },

  // Get session by app name
  async getSessionByAppName(appName: string): Promise<UserSandboxSession | null> {
    const { data, error } = await supabase
      .from('user_sandbox_sessions')
      .select('*')
      .eq('app_name', appName)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data;
  },

  // Calculate remaining time for session
  getRemainingTime(session: UserSandboxSession): number {
    const startTime = new Date(session.session_start_time).getTime();
    const durationMs = session.session_duration_minutes * 60 * 1000;
    const currentTime = Date.now();
    const remainingMs = (startTime + durationMs) - currentTime;
    
    return Math.max(0, Math.floor(remainingMs / 1000));
  },

  // Check if session is expired
  isSessionExpired(session: UserSandboxSession): boolean {
    return session.session_expired || this.getRemainingTime(session) <= 0;
  }
};

// API key management functions
export const apiKeyService = {
  // Create new API key for user
  async createApiKey(userId: string, paymentStatus: ApiKey['payment_status'] = 'free_tier'): Promise<ApiKey> {
    // Generate a new API key
    const apiKey = 'cf_' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        user_id: userId,
        api_key: apiKey,
        revoked: false,
        payment_status: paymentStatus,
        tokens_processed: 0
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },



  // Get API key for user
  async getUserApiKey(userId: string): Promise<ApiKey | null> {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', userId)
      .eq('revoked', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data;
  },

  // Revoke API key
  async revokeApiKey(keyId: string): Promise<void> {
    // Using a direct ID-based update to avoid CORS issues
    const { error } = await supabase
      .from('api_keys')
      .update({ revoked: true })
      .eq('id', keyId);

    if (error) {
      throw error;
    }
  },

  // Update payment status
  async updatePaymentStatus(userId: string, status: ApiKey['payment_status']): Promise<void> {
    // First, get the API key ID to use a more specific update
    const { data: keyData, error: fetchError } = await supabase
      .from('api_keys')
      .select('id')
      .eq('user_id', userId)
      .eq('revoked', false)
      .single();
    
    if (fetchError) {
      throw fetchError;
    }
    
    if (!keyData) {
      throw new Error('No active API key found for this user');
    }
    
    // Update using the specific key ID (avoids CORS issues with multiple filters)
    const { error } = await supabase
      .from('api_keys')
      .update({ payment_status: status })
      .eq('id', keyData.id);

    if (error) {
      throw error;
    }
  },

  // Get token usage
  async getTokenUsage(userId: string): Promise<number> {
    const { data, error } = await supabase
      .from('api_keys')
      .select('tokens_processed')
      .eq('user_id', userId)
      .eq('revoked', false)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data?.tokens_processed || 0;
  },

  // Check if user has paid
  async hasUserPaid(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('api_keys')
      .select('payment_status')
      .eq('user_id', userId)
      .eq('revoked', false)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data?.payment_status === 'paid';
  }
};
