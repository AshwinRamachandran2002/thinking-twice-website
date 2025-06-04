import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
  const [sessionExpired, setSessionExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const SANDBOX_URL = "https://contextfort-demo.fly.dev";
  const SANDBOX_PASSWORD = "contextfort-demo-2025";
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Single session check effect
  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('Session check error:', error);
          navigate('/proxy');
          return;
        }

        if (!session) {
          navigate('/proxy');
          return;
        }

        setSession(session);
      } catch (err) {
        console.error('Session check failed:', err);
        navigate('/proxy');
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setSession(session);
      if (!session) {
        navigate('/proxy');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Countdown timer effect
  useEffect(() => {
    if (!session) return; // Only start timer when authenticated

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setSessionExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session]);

  // Format the remaining time
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle session expiry
  useEffect(() => {
    if (sessionExpired) {
      toast({
        title: "Sandbox session expired",
        description: "Your 30-minute sandbox session has expired. Please refresh to start a new session.",
        variant: "destructive",
      });
    }
  }, [sessionExpired, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/proxy" replace />;
  }

  return (
    <div className="min-h-screen font-sans text-white" style={{ fontFamily: "Gellix, Inter, sans-serif", backgroundColor: '#ffa62b', fontWeight: 'bold' }}>
      <Navbar />
      <div className="container mx-auto py-8 px-4 mt-20">
      <div className="grid gap-4 md:gap-8 max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>ContextFort Sandbox Demo</CardTitle>
            <CardDescription>Experience ContextFort's protection in action with our secure code-server sandbox powered by Fly.io</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex flex-col space-y-2">
              <h3 className="text-lg font-semibold">Time Remaining: {formatTime(timeRemaining)}</h3>
              <p className="text-sm text-muted-foreground">Your sandbox session will expire in {formatTime(timeRemaining)}</p>
            </div>
            
            <div className="grid gap-4">
              <div className="flex flex-col space-y-2">
                <h3 className="font-semibold">Sandbox Access</h3>
                <p className="text-sm text-muted-foreground">
                  Access your code-server environment using these credentials:
                </p>
                <div className="flex items-center gap-2">
                  <Input 
                    value={SANDBOX_URL}
                    readOnly
                    className="font-mono"
                  />
                  <Button 
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(SANDBOX_URL);
                      toast({ description: "URL copied to clipboard" });
                    }}
                  >
                    Copy
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Input 
                    value={SANDBOX_PASSWORD}
                    readOnly
                    type="text"
                    className="font-mono"
                  />
                  <Button 
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(SANDBOX_PASSWORD);
                      toast({ description: "Password copied to clipboard" });
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Getting Started</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Visit the sandbox URL in your browser</li>
                  <li>Enter the provided password when prompted</li>
                  <li>You'll be connected to a secure code-server environment</li>
                  <li>Try the example prompt injection attacks below</li>
                </ol>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Example Prompt Injections</h3>
                <div className="text-sm space-y-2">
                  <p>Test these prompts in the sandbox environment to see how ContextFort protects against them:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>System role override attempts</li>
                    <li>Temperature and sampling manipulations</li>
                    <li>Data exfiltration attempts</li>
                    <li>Jailbreak patterns</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}
