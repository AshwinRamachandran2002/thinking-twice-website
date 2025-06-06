import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase, sandboxSessionService, UserSandboxSession } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [sandboxSession, setSandboxSession] = useState<UserSandboxSession | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load user session and sandbox session
  useEffect(() => {
    let mounted = true;

    const loadSessions = async () => {
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

        // Try to load existing sandbox session
        try {
          const existingSandboxSession = await sandboxSessionService.getCurrentSession(session.user.id);
          
          if (existingSandboxSession && !sandboxSessionService.isSessionExpired(existingSandboxSession)) {
            setSandboxSession(existingSandboxSession);
            setTimeRemaining(sandboxSessionService.getRemainingTime(existingSandboxSession));
          } else {
            // No valid session exists, user will need to create one
            setSandboxSession(null);
            setTimeRemaining(0);
          }
        } catch (sandboxError) {
          console.error('Failed to load sandbox session:', sandboxError);
          setSandboxSession(null);
          setTimeRemaining(0);
        }
      } catch (err) {
        console.error('Session check failed:', err);
        navigate('/proxy');
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadSessions();

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
    if (!session || !sandboxSession || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setSessionExpired(true);
          // Mark session as expired and destroy server
          destroySandboxServer(sandboxSession.id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session, sandboxSession, timeRemaining]);

  // Function to destroy sandbox server
  const destroySandboxServer = async (sessionId: string) => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const response = await fetch(`${apiBaseUrl}/api/destroy-sandbox`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to destroy server');
      }

      console.log('Server destruction initiated');
    } catch (error) {
      console.error('Failed to destroy server:', error);
    }
  };

  // Format the remaining time
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Create new sandbox session
  const createNewSession = async () => {
    if (!session || isCreatingSession) return;

    setIsCreatingSession(true);
    try {
      // Generate random app name and password for each user
      const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      const appName = `contextfort-demo-${randomNumber}`;
      const password = `contextfort-demo-${randomNumber}`;

      // Call backend API to deploy server
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const response = await fetch(`${apiBaseUrl}/api/deploy-sandbox`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          appName,
          password
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to deploy sandbox');
      }

      const result = await response.json();
      
      // Poll for deployment status
      pollDeploymentStatus(result.sessionId);

      toast({
        title: "Sandbox deployment started",
        description: "Your sandbox server is being deployed. This may take a few minutes.",
      });
    } catch (error) {
      console.error('Failed to create sandbox session:', error);
      toast({
        title: "Failed to create session",
        description: "Unable to create a new sandbox session. Please try again.",
        variant: "destructive",
      });
      setIsCreatingSession(false);
    }
  };

  // Poll deployment status
  const pollDeploymentStatus = async (sessionId: string) => {
    const maxAttempts = 60; // 5 minutes with 5-second intervals
    let attempts = 0;

    const poll = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
        const response = await fetch(`${apiBaseUrl}/api/deployment-status/${sessionId}`);
        if (!response.ok) {
          throw new Error('Failed to get deployment status');
        }

        const status = await response.json();
        
        if (status.status === 'running') {
          // Deployment successful
          const updatedSession = await sandboxSessionService.getCurrentSession(session!.user.id);
          if (updatedSession) {
            setSandboxSession(updatedSession);
            setTimeRemaining(sandboxSessionService.getRemainingTime(updatedSession));
            setSessionExpired(false);
          }
          
          setIsCreatingSession(false);
          toast({
            title: "Sandbox ready!",
            description: "Your sandbox server is now running and ready to use.",
          });
          return;
        } else if (status.status === 'failed') {
          // Deployment failed
          setIsCreatingSession(false);
          toast({
            title: "Deployment failed",
            description: "Failed to deploy your sandbox server. Please try again.",
            variant: "destructive",
          });
          return;
        }

        // Continue polling if still deploying
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000); // Poll every 5 seconds
        } else {
          // Timeout
          setIsCreatingSession(false);
          toast({
            title: "Deployment timeout",
            description: "Sandbox deployment is taking longer than expected. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error polling deployment status:', error);
        setIsCreatingSession(false);
        toast({
          title: "Error checking deployment",
          description: "Unable to check deployment status. Please try again.",
          variant: "destructive",
        });
      }
    };

    poll();
  };

  // Handle session expiry
  useEffect(() => {
    if (sessionExpired) {
      toast({
        title: "Sandbox session expired",
        description: "Your sandbox session has expired. Create a new session to continue.",
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
            {!sandboxSession || sessionExpired ? (
              <div className="flex flex-col space-y-4">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">No Active Sandbox Session</h3>
                  <p className="text-sm text-muted-foreground">
                    Create a new sandbox session to access the ContextFort demo environment.
                  </p>
                </div>
                <Button 
                  onClick={createNewSession}
                  disabled={isCreatingSession}
                  className="w-full"
                >
                  {isCreatingSession ? "Deploying Server..." : "Create New Sandbox Session"}
                </Button>
                {isCreatingSession && (
                  <div className="text-center text-sm text-muted-foreground">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-teal-500 mx-auto mb-2"></div>
                    This may take a few minutes to deploy your personalized server...
                  </div>
                )}
              </div>
            ) : (
              <>
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
                        value={sandboxSession.sandbox_url}
                        readOnly
                        className="font-mono"
                      />
                      <Button 
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(sandboxSession.sandbox_url);
                          toast({ description: "URL copied to clipboard" });
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input 
                        value={sandboxSession.sandbox_password}
                        readOnly
                        type="text"
                        className="font-mono"
                      />
                      <Button 
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(sandboxSession.sandbox_password);
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
              </>
            )}

            <div className="space-y-2">
              <h3 className="font-semibold">Need Help?</h3>
              <p className="text-sm text-muted-foreground">
                If you encounter any issues with your sandbox session, try creating a new session or contact our support team.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}
