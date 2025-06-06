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
