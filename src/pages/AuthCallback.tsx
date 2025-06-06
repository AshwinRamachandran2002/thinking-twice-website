import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Processing authentication...');
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Starting auth callback handling...');
        console.log('Full URL:', window.location.href);
        
        // Get both URL parameters and hash fragments
        const searchParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        // Log all parameters for debugging
        console.log('Search params:', Object.fromEntries(searchParams.entries()));
        console.log('Hash params:', Object.fromEntries(hashParams.entries()));
        
        // Get the callback type from either source
        const callbackType = searchParams.get('type');
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const error = hashParams.get('error') || searchParams.get('error');
        const errorDescription = hashParams.get('error_description') || searchParams.get('error_description');

        console.log('Parsed auth data:', {
          callbackType,
          hasAccessToken: !!accessToken,
          error,
          errorDescription
        });

        // Handle error cases first
        if (error || errorDescription) {
          console.error('Auth error from URL:', { error, errorDescription });
          throw new Error(errorDescription || error || 'An error occurred during authentication');
        }

        // Check if we're handling email verification
        if (callbackType === 'signup') {
          console.log('Handling signup verification...');
          // For email verification, get the current session
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          console.log('Current session:', { 
            hasSession: !!session, 
            error: sessionError 
          });
          
          if (sessionError) {
            console.error('Session error:', sessionError);
            throw sessionError;
          }

          if (!session) {
            console.log('No session found, attempting to refresh...');
            const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
            
            console.log('Session refresh result:', {
              hasSession: !!refreshedSession,
              error: refreshError
            });

            if (refreshError) throw refreshError;
            if (!refreshedSession) throw new Error('Could not establish session');
          }

        } else if (accessToken) {
          // For other auth flows with tokens
          console.log('Setting session with tokens...');
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (sessionError) {
            console.error('Error setting session:', sessionError);
            throw sessionError;
          }
        } else {
          console.error('No tokens found and not a signup verification');
          throw new Error('Invalid authentication state');
        }

        // Verify final session state
        const { data: { session: finalSession }, error: finalSessionError } = await supabase.auth.getSession();
        console.log('Final session state:', {
          hasSession: !!finalSession,
          error: finalSessionError
        });

        if (finalSessionError) throw finalSessionError;
        if (!finalSession) throw new Error('No session established after authentication');

        // Clear sensitive data from URL
        window.history.replaceState(null, '', window.location.pathname);
        
        // Successful auth, redirect to dashboard
        console.log('Authentication successful, redirecting to dashboard...');
        setMessage('Authentication successful, redirecting...');
        navigate('/dashboard', { replace: true });

      } catch (error) {
        console.error('Auth callback error:', error);
        setMessage('Authentication failed. Please try again.');
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: error instanceof Error ? error.message : 'An error occurred during authentication'
        });
        // On error, redirect to login page
        navigate('/proxy', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-t-teal-500 border-b-teal-700 border-l-teal-500 border-r-teal-700 rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-slate-600">{message}</p>
      </div>
    </div>
  );
}
