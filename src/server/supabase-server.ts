import { createClient } from '@supabase/supabase-js';
import type { Database } from '../lib/supabase';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing Supabase URL environment variable');
}

// Client-side authentication should use the anon key
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey || supabaseServiceKey);

// Admin operations (like managing users) should use the service role key
// CAUTION: Only use this on the server side, never expose this client to the browser
export const supabaseAdmin = supabaseServiceKey 
  ? createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : supabase;

// Re-export the types and services from the original supabase file
export type { ApiKey, UserSandboxSession, Database } from '../lib/supabase';

// Sandbox session management functions (adapted for server use)
export const sandboxSessionService = {
  // Get current session for user
  async getCurrentSession(userId: string) {
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
  async createSession(userId: string, appName: string, sandboxUrl: string, sandboxPassword: string, durationMinutes: number = 30) {
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
        session_start_time: new Date().toISOString(),
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
  async expireSession(sessionId: string) {
    const { error } = await supabase
      .from('user_sandbox_sessions')
      .update({ session_expired: true, deployment_status: 'destroying' })
      .eq('id', sessionId);

    if (error) {
      throw error;
    }
  },

  // Update deployment status
  async updateDeploymentStatus(sessionId: string, status: 'pending' | 'deploying' | 'running' | 'failed' | 'destroying') {
    const { error } = await supabase
      .from('user_sandbox_sessions')
      .update({ deployment_status: status })
      .eq('id', sessionId);

    if (error) {
      throw error;
    }
  },

  // Get session by app name
  async getSessionByAppName(appName: string) {
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
  getRemainingTime(session: any): number {
    const startTime = new Date(session.session_start_time).getTime();
    const durationMs = session.session_duration_minutes * 60 * 1000;
    const currentTime = Date.now();
    const remainingMs = (startTime + durationMs) - currentTime;
    
    return Math.max(0, Math.floor(remainingMs / 1000));
  },

  // Check if session is expired
  isSessionExpired(session: any): boolean {
    return session.session_expired || this.getRemainingTime(session) <= 0;
  }
};