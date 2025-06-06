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
        // Get the hash fragment from the URL
        const hashFragment = window.location.hash.substring(1);
        const params = new URLSearchParams(hashFragment);
        
        // Get the callback type from URL
        const searchParams = new URLSearchParams(window.location.search);
        const callbackType = searchParams.get('type');
        
        // Extract tokens and data
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const type = callbackType || 'signup'; // default to signup if not specified
        
        if (!accessToken) {
          throw new Error('No access token found in the callback URL');
        }

        // Set the session in Supabase
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });

        if (error) {
          throw error;
        }

        // Clear the URL fragment for security
        window.history.replaceState(null, '', window.location.pathname);
        
        // Handle different callback types
        if (type === 'recovery') {
          setMessage('Password reset successful! Redirecting to dashboard...');
          toast({
            title: "Password Reset Successful",
            description: "Your password has been reset successfully. You are now logged in.",
            variant: "default",
          });
        } else {
          setMessage('Authentication successful! Redirecting to dashboard...');
          toast({
            title: "Authentication Successful",
            description: "You have been logged in successfully. Redirecting to your dashboard...",
            variant: "default",
          });
        }
        
        setTimeout(() => navigate('/dashboard'), 1500);
      } catch (error: unknown) {
        console.error('Error processing authentication:', error);
        setMessage(`Authentication error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        
        toast({
          title: "Authentication Error",
          description: error instanceof Error ? error.message : 'Unknown authentication error occurred',
          variant: "destructive",
        });
        
        // Clear the URL fragment even on error
        window.history.replaceState(null, '', window.location.pathname);
        setTimeout(() => navigate('/proxy'), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fef9f3' }}>
      <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-md">
        <div className="w-16 h-16 border-4 border-t-[#ffa62b] border-b-orange-600 border-l-[#ffa62b] border-r-orange-600 rounded-full animate-spin mx-auto"></div>
        <h2 className="mt-6 text-xl font-semibold text-slate-800">Authentication in Progress</h2>
        <p className="mt-2 text-slate-600">{message}</p>
      </div>
    </div>
  );
}
