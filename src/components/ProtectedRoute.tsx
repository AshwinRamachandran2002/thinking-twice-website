import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface ProtectedRouteProps {
  redirectPath?: string;
}

export default function ProtectedRoute({ redirectPath = '/proxy' }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session check error:', error);
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(!!data.session);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Check for active session
    checkAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', { event, hasSession: !!session });
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setIsAuthenticated(true);
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
      } else {
        // For all other events, set auth state based on session presence
        setIsAuthenticated(!!session);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-teal-500 border-b-teal-700 border-l-teal-500 border-r-teal-700 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If we're loading or on the auth callback page, don't redirect
  const isAuthCallback = window.location.pathname === '/auth/callback';
  if (isAuthCallback) {
    return <Outlet />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to={redirectPath} replace />;
}
