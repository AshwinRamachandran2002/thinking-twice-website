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
        const hashFragment = window.location.hash.substring(1); // Remove the # character
        const params = new URLSearchParams(hashFragment);
        
        // Extract tokens and data
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const expiresIn = params.get('expires_in');
        const tokenType = params.get('token_type');
        
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
        
        setMessage('Authentication successful! Redirecting to dashboard...');
        
        toast({
          title: "Authentication Successful",
          description: "You have been logged in successfully. Redirecting to your dashboard...",
          variant: "default",
        });
        
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-md">
        <div className="w-16 h-16 border-4 border-t-teal-500 border-b-teal-700 border-l-teal-500 border-r-teal-700 rounded-full animate-spin mx-auto"></div>
        <h2 className="mt-6 text-xl font-semibold text-slate-800">Authentication in Progress</h2>
        <p className="mt-2 text-slate-600">{message}</p>
      </div>
    </div>
  );
}
