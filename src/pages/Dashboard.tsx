import { useEffect, useState, useRef } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { supabase, sandboxSessionService, apiKeyService, UserSandboxSession, ApiKey } from '@/lib/supabase';
import { createCheckoutSession, handleCheckoutSuccess } from '@/lib/stripe';
import { Session } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Navbar from '../components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ContactForm from '@/components/ContactForm';
import { 
  RefreshCw, Copy, CheckCircle, ChevronRight, Terminal, AlertCircle, CreditCard, 
  Zap, BarChart, Activity, ArrowRight, ExternalLink, Github, Database, ShieldAlert,
  Info, FileText, Link, Lock, Play, Shield
} from 'lucide-react';

export default function Dashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [sandboxSession, setSandboxSession] = useState<UserSandboxSession | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('proxy');
  const [apiKey, setApiKey] = useState<ApiKey | null>(null);
  const [isLoadingApiKey, setIsLoadingApiKey] = useState(false);
  const [isCreatingApiKey, setIsCreatingApiKey] = useState(false);
  const [tokenCount, setTokenCount] = useState<number>(0);
  const [isRefreshingTokens, setIsRefreshingTokens] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('python');
  const [redTeamFormSubmitted, setRedTeamFormSubmitted] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Load user session and sandbox session
  useEffect(() => {
    let mounted = true;

    // Set active tab based on the path that got us here
    if (location.pathname === '/api' || location.state?.from === 'api') {
      setActiveTab('api');
    } else if (location.pathname === '/redteam' || location.state?.from === 'redteam') {
      setActiveTab('redteam');
    } else {
      setActiveTab('proxy');
    }

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

        // Load API key information
        try {
          setIsLoadingApiKey(true);
          const existingApiKey = await apiKeyService.getUserApiKey(session.user.id);
          if (existingApiKey) {
            setApiKey(existingApiKey);
            setTokenCount(existingApiKey.tokens_processed);
          }
          else {
            try {
              const newApiKey = await apiKeyService.createApiKey(session.user.id, 'free_tier');
              setApiKey(newApiKey);
              setTokenCount(0);
              toast({
                title: "API Key Created",
                description: "Your free API key has been automatically generated.",
              });
            } catch (createError) {
              console.error('Failed to create API key:', createError);
              toast({
                title: "API Key Error",
                description: "Could not create or retrieve your API key. Please try again.",
                variant: "destructive",
              });
            }
          }
        } catch (apiKeyError) {
          console.error('Failed to load API key:', apiKeyError);
          setApiKey(null);
          setTokenCount(0);
          toast({
            title: "API Key Error",
            description: "Unable to load your API key. Please try again later.",
            variant: "destructive",
          });
        } finally {
          setIsLoadingApiKey(false);
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
  }, [navigate, location.pathname, location.state?.from, toast]);

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

  // API key functions
  const createNewApiKey = async () => {
    if (!session || isCreatingApiKey) return;

    setIsCreatingApiKey(true);
    try {
      const newApiKey = await apiKeyService.createApiKey(session.user.id, 'free_tier');
      setApiKey(newApiKey);
      setTokenCount(0);
      
      toast({
        title: "API Key Created",
        description: "Your API key has been generated successfully.",
      });
    } catch (error) {
      console.error('Failed to create API key:', error);
      toast({
        title: "Failed to create API key",
        description: "Unable to create a new API key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingApiKey(false);
    }
  };

  const refreshTokenCount = async () => {
    if (!session || !apiKey || isRefreshingTokens) return;
    
    setIsRefreshingTokens(true);
    try {
      const count = await apiKeyService.getTokenUsage(session.user.id);
      setTokenCount(count);
      
      toast({
        title: "Usage Updated",
        description: "Your token usage information has been refreshed.",
      });
    } catch (error) {
      console.error('Failed to refresh token count:', error);
      toast({
        title: "Failed to refresh usage",
        description: "Unable to update token usage. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshingTokens(false);
    }
  };

  const copyApiKey = () => {
    if (!apiKey) return;
    
    navigator.clipboard.writeText(apiKey.api_key);
    setCopySuccess(true);
    
    setTimeout(() => {
      setCopySuccess(false);
    }, 2000);
    
    toast({
      title: "API Key Copied",
      description: "Your API key has been copied to clipboard.",
    });
  };

  const handleCheckout = async () => {
    if (!session || isCheckingOut) return;
    
    setIsCheckingOut(true);
    try {
      await createCheckoutSession(session.user.id, session.user.email || '');
      // Redirect will happen in the createCheckoutSession function
    } catch (error) {
      console.error('Failed to initiate checkout:', error);
      toast({
        title: "Checkout Failed",
        description: "Unable to start the checkout process. Please try again.",
        variant: "destructive",
      });
      setIsCheckingOut(false);
    }
  };

  const copyCodeExample = () => {
    if (!codeRef.current) return;
    
    const code = codeRef.current.textContent;
    if (!code) return;
    
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    
    setTimeout(() => {
      setCodeCopied(false);
    }, 2000);
    
    toast({
      title: "Code Copied",
      description: `The ${selectedLanguage} example has been copied to clipboard.`,
    });
  };
  
  // Handle Red Team form submission
  const handleRedTeamFormSubmit = () => {
    setRedTeamFormSubmitted(true);
    toast({
      title: "Request Submitted",
      description: "Thank you for your interest in our Automated Red Teaming services. Our team will contact you shortly.",
    });
  };

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

  // Check for Stripe checkout success
  useEffect(() => {
    if (!session) return;
    
    const searchParams = new URLSearchParams(location.search);
    const sessionId = searchParams.get('session_id');
    const success = searchParams.get('success');
    
    if (sessionId && success === 'true' && !isCheckingOut) {
      const processPayment = async () => {
        try {
          setIsCheckingOut(true);
          
          toast({
            title: "Processing payment",
            description: "Please wait while we verify your payment...",
          });
          
          await handleCheckoutSuccess(sessionId, session.user.id);
          
          // Refresh API key data after successful payment
          const updatedApiKey = await apiKeyService.getUserApiKey(session.user.id);
          if (updatedApiKey) {
            setApiKey(updatedApiKey);
          }
          
          toast({
            title: "Payment successful!",
            description: "Your account has been upgraded to Pro!",
          });
          
          // Clear URL params
          navigate('/dashboard', { replace: true });
        } catch (error) {
          console.error('Error processing payment:', error);
          toast({
            title: "Payment verification failed",
            description: "We could not verify your payment. Please contact support.",
            variant: "destructive",
          });
        } finally {
          setIsCheckingOut(false);
        }
      };
      
      processPayment();
    }
  }, [session, location.search, navigate, toast, isCheckingOut]);

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
          <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value)}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="proxy">Proxy</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
              <TabsTrigger value="redteam">Automated Red Teaming</TabsTrigger>
            </TabsList>
            
            <TabsContent value="proxy">
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

                  {/* Attack Demo Section */}
                  <div className="mt-8 pt-6 border-t border-slate-200">
                    <h2 className="text-xl font-bold mb-4">Attack Demonstration: GitHub Issue &amp; Airtable Data Leakage</h2>
                    <div className="bg-orange-50 border border-orange-200 rounded-md p-4 mb-6">
                      <h3 className="text-lg font-semibold text-orange-800 flex items-center gap-2 mb-2">
                        <ShieldAlert className="h-5 w-5" />
                        Attack Scenario: Private Airtable Data Leak
                      </h3>
                      <p className="text-sm text-orange-700 mb-4">
                        This demo shows how an attacker could attempt to leak sensitive Airtable data through a GitHub issue prompt injection attack,
                        and how ContextFort prevents this attack vector.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-md shadow-sm border border-slate-200">
                          <h4 className="font-medium flex items-center gap-2 mb-2">
                            <Database className="h-4 w-4 text-blue-500" /> 
                            1. Private Airtable Data
                          </h4>
                          <p className="text-xs text-slate-600 mb-3">
                            Sensitive company data stored in a private Airtable database that should remain confidential.
                          </p>
                          <div className="mt-4">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="w-full text-xs"
                              onClick={() => window.open("https://airtable.com/invite/l?inviteId=invMHlNERdRcTBnYd&inviteToken=4263087b3938b04347a4591dfa46fc6e7f2bb1a2b54f4d9123e69191a82b64c5&utm_medium=email&utm_source=product_team&utm_content=transactional-alerts", "_blank")}
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View Airtable Database
                            </Button>
                          </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-md shadow-sm border border-slate-200">
                          <h4 className="font-medium flex items-center gap-2 mb-2">
                            <Github className="h-4 w-4 text-slate-800" /> 
                            2. GitHub Issue with Prompt Injection
                          </h4>
                          <p className="text-xs text-slate-600 mb-3">
                            An attacker creates a GitHub issue with embedded prompt injection commands to extract and leak Airtable data.
                          </p>
                          <div className="mt-4">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="w-full text-xs"
                              onClick={() => window.open("https://github.com/johnriley9123/sample/issues/1", "_blank")}
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View GitHub Issue #1
                            </Button>
                          </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-md shadow-sm border border-slate-200">
                          <h4 className="font-medium flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4 text-red-500" /> 
                            3. Data Leaked to New Issue
                          </h4>
                          <p className="text-xs text-slate-600 mb-3">
                            Without protection, an AI assistant would process the prompt injection and leak sensitive Airtable data to Issue #2.
                          </p>
                          <div className="mt-4">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="w-full text-xs"
                              onClick={() => window.open("https://github.com/johnriley9123/sample/issues/2", "_blank")}
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View GitHub Issue #2
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Attack Flow Visualization</h3>
                        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                          <div className="flex flex-col space-y-5">
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Database className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="flex-grow">
                                <h4 className="font-medium text-sm">Private Airtable Database</h4>
                                <p className="text-xs text-slate-500">Contains sensitive company information</p>
                              </div>
                            </div>
                            
                            <div className="ml-5 border-l-2 border-slate-300 pl-8 pb-2">
                              <ArrowRight className="h-5 w-5 text-slate-400 -ml-[38px] -mt-1 bg-white p-1" />
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                <Github className="h-5 w-5 text-slate-800" />
                              </div>
                              <div className="flex-grow">
                                <h4 className="font-medium text-sm">GitHub Issue #1 Created</h4>
                                <p className="text-xs text-slate-500">Contains prompt injection payload</p>
                              </div>
                            </div>
                            
                            <div className="ml-5 border-l-2 border-slate-300 pl-8 pb-2">
                              <ArrowRight className="h-5 w-5 text-slate-400 -ml-[38px] -mt-1 bg-white p-1" />
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                <Play className="h-5 w-5 text-amber-600" />
                              </div>
                              <div className="flex-grow">
                                <h4 className="font-medium text-sm">User Requests Summary</h4>
                                <p className="text-xs text-slate-500">Asks AI to summarize the GitHub issue</p>
                              </div>
                            </div>
                            
                            <div className="ml-5 border-l-2 border-red-300 pl-8 pb-2">
                              <ArrowRight className="h-5 w-5 text-red-400 -ml-[38px] -mt-1 bg-white p-1" />
                              <div className="bg-red-50 border border-red-200 rounded-md p-2 mt-1">
                                <p className="text-xs text-red-700">Without protection, injected commands execute</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <FileText className="h-5 w-5 text-red-600" />
                              </div>
                              <div className="flex-grow">
                                <h4 className="font-medium text-sm">GitHub Issue #2 Created</h4>
                                <p className="text-xs text-red-500">Sensitive Airtable data leaked</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-3">ContextFort's Tool Call Protection</h3>
                        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-5 rounded-lg border border-emerald-200 shadow-sm">
                          <div className="flex flex-col space-y-5">
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                                <ShieldAlert className="h-5 w-5 text-teal-600" />
                              </div>
                              <div className="flex-grow">
                                <h4 className="font-medium text-sm">ContextFort Deployment</h4>
                                <p className="text-xs text-slate-500">AI protection layer activated</p>
                              </div>
                            </div>
                            
                            <div className="ml-5 border-l-2 border-emerald-300 pl-8 pb-2">
                              <ArrowRight className="h-5 w-5 text-emerald-500 -ml-[38px] -mt-1 bg-white p-1" />
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                <Github className="h-5 w-5 text-slate-800" />
                              </div>
                              <div className="flex-grow">
                                <h4 className="font-medium text-sm">Injection Analyzed</h4>
                                <p className="text-xs text-slate-500">Detected attempt to call external Airtable API</p>
                              </div>
                            </div>
                            
                            <div className="ml-5 border-l-2 border-emerald-300 pl-8 pb-2">
                              <ArrowRight className="h-5 w-5 text-emerald-500 -ml-[38px] -mt-1 bg-white p-1" />
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                <Lock className="h-5 w-5 text-amber-600" />
                              </div>
                              <div className="flex-grow">
                                <h4 className="font-medium text-sm">Tool Call Intercepted</h4>
                                <p className="text-xs text-slate-500">Unauthorized Airtable API call blocked</p>
                              </div>
                            </div>
                            
                            <div className="ml-5 border-l-2 border-emerald-300 pl-8 pb-2">
                              <ArrowRight className="h-5 w-5 text-emerald-500 -ml-[38px] -mt-1 bg-white p-1" />
                              <div className="bg-emerald-50 border border-emerald-200 rounded-md p-2 mt-1">
                                <p className="text-xs text-emerald-700">AI responds safely: "I've detected a potentially malicious tool call and blocked it for your security."</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                <Shield className="h-5 w-5 text-emerald-600" />
                              </div>
                              <div className="flex-grow">
                                <h4 className="font-medium text-sm">Malicious Tool Call Blocked</h4>
                                <p className="text-xs text-emerald-600">Prevented unauthorized API access attempt</p>
                              </div>
                            </div>
                            
                            <div className="mt-4 bg-white rounded-md p-3 border border-emerald-200">
                              <h4 className="text-sm font-medium text-emerald-700 mb-2">Protection Activated:</h4>
                              <div className="text-xs text-slate-600 mb-3">
                                ContextFort specializes in blocking malicious tool calls, preventing AI systems from executing dangerous actions requested through prompt injections.
                              </div>
                              <div className="flex items-start gap-2 mb-2">
                                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <div>
                                  <span className="font-medium">Malicious Tool Call Blocking</span>
                                  <p className="text-xs text-slate-500 mt-0.5">Detected and blocked unauthorized attempt to access external API (Airtable)</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-4">Try It Yourself</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                          <h4 className="font-medium mb-3 text-slate-800">Demo the Attack</h4>
                          <p className="text-sm text-slate-600 mb-4">
                            Follow these steps to see how the attack would work without protection:
                          </p>
                          <ol className="text-xs text-slate-600 space-y-3 list-decimal list-inside">
                            <li>Visit GitHub Issue #1 containing the prompt injection</li>
                            <li>Observe how the issue has hidden commands to access Airtable</li>
                            <li>See how in Issue #2, sensitive data has been exposed</li>
                            <li>This demonstrates the risk of unprotected AI systems</li>
                          </ol>
                          <div className="mt-4">
                            <Button 
                              onClick={() => window.open("https://github.com/johnriley9123/sample/issues/1", "_blank")}
                              className="w-full bg-slate-800 hover:bg-slate-700"
                            >
                              View Attack Demo
                            </Button>
                          </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg border border-teal-200 shadow-sm">
                          <h4 className="font-medium mb-3 text-teal-800">Experience ContextFort Protection</h4>
                          <p className="text-sm text-slate-600 mb-4">
                            See how ContextFort prevents malicious tool calls in our sandbox:
                          </p>
                          <ol className="text-xs text-slate-600 space-y-3 list-decimal list-inside">
                            <li>Create a sandbox session (if you haven't already)</li>
                            <li>In the sandbox, try asking the AI about GitHub Issue #1</li>
                            <li>Watch how ContextFort identifies and blocks the malicious API call</li>
                            <li>The AI will alert you that it detected an unauthorized tool call</li>
                          </ol>
                          <div className="mt-4">
                            {!sandboxSession || sessionExpired ? (
                              <Button 
                                onClick={createNewSession}
                                disabled={isCreatingSession}
                                className="w-full bg-teal-600 hover:bg-teal-700"
                              >
                                {isCreatingSession ? "Deploying Server..." : "Create Sandbox Session"}
                              </Button>
                            ) : (
                              <Button 
                                onClick={() => window.open(sandboxSession.sandbox_url, "_blank")}
                                className="w-full bg-teal-600 hover:bg-teal-700"
                              >
                                Open Sandbox
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="redteam">
              <Card>
                <CardHeader>
                  <CardTitle>Automated Red Teaming</CardTitle>
                  <CardDescription>Submit your URL for a comprehensive AI security assessment using our advanced attack simulation sandbox</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">What is Automated Red Teaming?</h3>
                      <p className="text-sm mb-4">
                        Our automated red teaming service provides a dedicated sandbox environment where we run comprehensive attack simulations against your AI systems. We analyze your tool integrations and data connections to identify vulnerabilities that could be exploited through prompt injection, data exfiltration, and other AI-specific attacks.
                      </p>
                      
                      <div className="bg-orange-50 border border-orange-200 rounded-md p-4 mb-6">
                        <h4 className="text-md font-semibold text-orange-800 flex items-center gap-2 mb-2">
                          <ShieldAlert className="h-5 w-5" />
                          Benefits of Red Team Testing
                        </h4>
                        <ul className="text-sm text-orange-700 space-y-2">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 mt-1 text-orange-600" />
                            <span>Identify vulnerabilities in your tool integrations and data connections</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 mt-1 text-orange-600" />
                            <span>Discover weaknesses in your prompt security and control mechanisms</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 mt-1 text-orange-600" />
                            <span>Get detailed reports on potential attack vectors specific to your system</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 mt-1 text-orange-600" />
                            <span>Receive actionable remediation recommendations with ContextFort integration</span>
                          </li>
                        </ul>
                      </div>
                      
                      <h3 className="text-lg font-semibold mb-3">Our Red Teaming Approach</h3>
                      <div className="space-y-4 mb-6">
                        <div className="bg-white p-3 rounded-md border border-slate-200 shadow-sm">
                          <h4 className="font-medium text-slate-800 mb-2">1. URL Analysis</h4>
                          <p className="text-sm text-slate-600">
                            Submit your application URL and we analyze the tool integrations and API connections to identify potential attack surfaces.
                          </p>
                        </div>
                        
                        <div className="bg-white p-3 rounded-md border border-slate-200 shadow-sm">
                          <h4 className="font-medium text-slate-800 mb-2">2. Sandbox Deployment</h4>
                          <p className="text-sm text-slate-600">
                            We deploy a secure sandbox environment configured to specifically target vulnerabilities in your system's architecture.
                          </p>
                        </div>
                        
                        <div className="bg-white p-3 rounded-md border border-slate-200 shadow-sm">
                          <h4 className="font-medium text-slate-800 mb-2">3. Attack Simulation</h4>
                          <p className="text-sm text-slate-600">
                            Our system runs thousands of attack patterns based on the latest research to test your specific implementation.
                          </p>
                        </div>
                        
                        <div className="bg-white p-3 rounded-md border border-slate-200 shadow-sm">
                          <h4 className="font-medium text-slate-800 mb-2">4. Vulnerability Report</h4>
                          <p className="text-sm text-slate-600">
                            Receive a comprehensive report of all identified vulnerabilities with detailed remediation steps and ContextFort integration options.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Schedule a Red Team Assessment</h3>
                      <p className="text-sm mb-6">
                        Fill out the form below to request a demonstration of our automated red teaming capabilities. Our team will contact you to discuss how we can analyze your AI systems for security vulnerabilities.
                      </p>
                      
                      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                        <ContactForm />
                      </div>
                      
                      <div className="mt-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <h4 className="font-medium text-slate-800 mb-3">Research-Backed Methodology</h4>
                        <p className="text-sm text-slate-600 mb-3">
                          Our attack simulations are based on cutting-edge research in AI security:
                        </p>
                        <ul className="text-sm text-slate-600 space-y-3">
                          <li className="flex items-start gap-2">
                            <ExternalLink className="h-4 w-4 mt-1 text-blue-600" />
                            <a href="https://arxiv.org/abs/2312.02119" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              DeepMind: "Gemini: A Family of Highly Capable Multimodal Models"
                            </a>
                          </li>
                          <li className="flex items-start gap-2">
                            <ExternalLink className="h-4 w-4 mt-1 text-blue-600" />
                            <a href="https://storage.googleapis.com/deepmind-media/Security%20and%20Privacy/Gemini_Security_Paper.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              Google: "Gemini Security and Privacy Paper"
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column - API key and usage */}
                <div className="lg:col-span-1 space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Terminal className="h-5 w-5" />
                        API Key
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isLoadingApiKey ? (
                        <div className="flex justify-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                        </div>
                      ) : apiKey ? (
                        <div className="space-y-4">
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center justify-between">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                apiKey.payment_status === 'paid' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {apiKey.payment_status === 'paid' ? 'PRO' : 'FREE TIER'}
                              </span>
                              <span className="text-xs text-slate-400">Created: {new Date(apiKey.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Input 
                                value={apiKey.api_key}
                                readOnly
                                type="text"
                                className="font-mono bg-slate-900 text-slate-50 text-sm"
                              />
                              <Button 
                                variant="outline"
                                onClick={copyApiKey}
                                className="flex items-center gap-1"
                                size="sm"
                              >
                                {copySuccess ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-4 pt-4 border-t border-slate-200">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium flex items-center gap-1.5">
                                <Activity className="h-4 w-4" />
                                API Usage
                              </h4>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={refreshTokenCount}
                                disabled={isRefreshingTokens}
                                className="h-8 px-2"
                              >
                                <RefreshCw className={`h-3.5 w-3.5 ${isRefreshingTokens ? 'animate-spin' : ''}`} />
                              </Button>
                            </div>
                            
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Tokens Processed</span>
                                  <span className="font-semibold">{tokenCount.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2.5">
                                  <div 
                                    className={`h-2.5 rounded-full ${
                                      tokenCount > (apiKey.payment_status === 'paid' ? 800000 : 8000) 
                                      ? 'bg-amber-500' 
                                      : 'bg-emerald-500'
                                    }`}
                                    style={{ 
                                      width: `${Math.min(100, (tokenCount / (apiKey.payment_status === 'paid' ? 1000000 : 10000)) * 100)}%` 
                                    }}
                                  ></div>
                                </div>
                                <div className="flex justify-between mt-1">
                                  <p className="text-xs text-slate-500">
                                    {apiKey.payment_status === 'paid' 
                                      ? `${Math.floor((tokenCount / 1000000) * 100)}% of monthly allocation` 
                                      : `${Math.floor((tokenCount / 10000) * 100)}% of free tier limit`}
                                  </p>
                                  <p className="text-xs font-medium">
                                    {apiKey.payment_status === 'paid' 
                                      ? `${tokenCount.toLocaleString()} / 1,000,000` 
                                      : `${tokenCount.toLocaleString()} / 10,000`}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Daily Usage</span>
                                  <span className="font-semibold">{Math.floor(tokenCount * 0.15).toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-500 h-2 rounded-full" 
                                    style={{ 
                                      width: `${Math.min(100, Math.floor(tokenCount * 0.15) / (apiKey.payment_status === 'paid' ? 50000 : 1000) * 100)}%` 
                                    }}
                                  ></div>
                                </div>
                              </div>
{/*                               
                              {apiKey.payment_status !== 'paid' && (
                                <Button 
                                  onClick={handleCheckout}
                                  disabled={isCheckingOut}
                                  className="w-full bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2 mt-2"
                                  size="sm"
                                >
                                  <CreditCard className="h-4 w-4" />
                                  {isCheckingOut ? "Processing..." : "Upgrade to Pro - $10/month"}
                                </Button>
                              )} */}

                              {apiKey.payment_status === 'paid' && (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-md p-2 text-xs text-emerald-700 mt-2">
                                  <p className="font-medium">Pro Plan Active</p>
                                  <p>Your subscription renews on {new Date(new Date(apiKey.created_at).setMonth(new Date(apiKey.created_at).getMonth() + 1)).toLocaleDateString()}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-4 py-6">
                          <AlertCircle className="h-10 w-10 text-amber-500" />
                          <div className="text-center space-y-2">
                            <p className="font-medium">No API Key Found</p>
                            <p className="text-sm text-slate-500">
                              Create a new API key to get started with the ContextFort API
                            </p>
                          </div>
                          <Button 
                            onClick={createNewApiKey}
                            disabled={isCreatingApiKey}
                            className="bg-white text-[#ffa62b] hover:bg-slate-100"
                          >
                            {isCreatingApiKey ? "Creating API Key..." : "Get Free API Key"}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
{/* 
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <BarChart className="h-5 w-5" />
                        Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Average Latency</span>
                            <span className="text-sm font-medium">52ms</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full w-[20%]"></div>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">Faster than 92% of users</p>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Success Rate</span>
                            <span className="text-sm font-medium">99.8%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div className="bg-emerald-500 h-2 rounded-full w-[99.8%]"></div>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">Last error: 3 days ago</p>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Blocked Attacks</span>
                            <span className="text-sm font-medium">{Math.floor(tokenCount * 0.05)}</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div className="bg-rose-500 h-2 rounded-full w-[5%]"></div>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">~5% of requests identified as potential attacks</p>
                        </div>
                        
                        <div className="mt-6 pt-3 border-t border-slate-200">
                          <h4 className="text-sm font-medium mb-2">Monthly Usage Trends</h4>
                          <div className="flex items-end gap-1 h-24">
                            {Array.from({ length: 14 }, (_, i) => {
                              const height = Math.floor(20 + Math.random() * 80);
                              return (
                                <div key={i} className="flex-1 bg-slate-200 rounded-sm" style={{ height: `${height}%` }}>
                                  <div 
                                    className="w-full bg-blue-400 rounded-sm"
                                    style={{ height: `${Math.min(100, height * 0.7)}%` }}
                                  ></div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-slate-500">14 days ago</span>
                            <span className="text-xs text-slate-500">Today</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card> */}
                </div>

                {/* Right column - Code example and docs */}
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl flex items-center gap-2">
                          <Zap className="h-5 w-5" />
                          Quick Start
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Select
                            value={selectedLanguage}
                            onValueChange={setSelectedLanguage}
                          >
                            <SelectTrigger className="w-[130px] h-8 text-xs">
                              <SelectValue placeholder="Language" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="python">Python</SelectItem>
                              {/* <SelectItem value="javascript">JavaScript</SelectItem>
                              <SelectItem value="typescript">TypeScript</SelectItem>
                              <SelectItem value="java">Java</SelectItem>
                              <SelectItem value="go">Go</SelectItem> */}
                            </SelectContent>
                          </Select>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={copyCodeExample}
                            className="h-8 px-2 flex items-center gap-1.5"
                          >
                            {codeCopied ? (
                              <>
                                <CheckCircle className="h-3.5 w-3.5" />
                                <span className="text-xs">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                <span className="text-xs">Copy Code</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                      <CardDescription>
                        Integrate our API in just a few lines of code
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-slate-900 text-slate-50 p-4 rounded-md overflow-auto">
                        <pre className="text-sm" ref={codeRef}>
{selectedLanguage === 'python' ? 
`import requests

# ContextFort API endpoint
url = "https://api.contextfort.com/v1/secure"

# Your API key
api_key = "${apiKey?.api_key || 'your_api_key_here'}"

# Example: Secure a tool call
payload = {
  "messages": []
}

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

response = requests.post(url, json=payload, headers=headers)`
: "// Select a language from the dropdown"
}</pre>
                      </div>
                    </CardContent>
                    {/* <CardFooter className="border-t pt-4 flex flex-col space-y-2">
                      <div className="w-full flex justify-between items-center">
                        <span className="text-sm font-medium">Need help?</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => window.open('/api-docs', '_blank')}
                        >
                          <span>Documentation</span>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Our API supports multiple languages including Python, JavaScript, Java, and more.
                      </p>
                    </CardFooter> */}
                  </Card>
{/* 
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">Additional Resources</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button variant="outline" className="justify-start h-auto py-3" onClick={() => window.open('/api-docs/examples', '_blank')}>
                          <div className="flex flex-col items-start text-left">
                            <span className="font-medium">Code Examples</span>
                            <span className="text-xs text-muted-foreground">Sample implementations in various languages</span>
                          </div>
                        </Button>
                        
                        <Button variant="outline" className="justify-start h-auto py-3" onClick={() => window.open('/api-docs/webhooks', '_blank')}>
                          <div className="flex flex-col items-start text-left">
                            <span className="font-medium">Webhook Integration</span>
                            <span className="text-xs text-muted-foreground">Set up real-time alerts for security events</span>
                          </div>
                        </Button>
                        
                        <Button variant="outline" className="justify-start h-auto py-3" onClick={() => window.open('/api-docs/policies', '_blank')}>
                          <div className="flex flex-col items-start text-left">
                            <span className="font-medium">Security Policies</span>
                            <span className="text-xs text-muted-foreground">Configure custom security rules and filters</span>
                          </div>
                        </Button>
                        
                        <Button variant="outline" className="justify-start h-auto py-3" onClick={() => window.open('/support', '_blank')}>
                          <div className="flex flex-col items-start text-left">
                            <span className="font-medium">Support</span>
                            <span className="text-xs text-muted-foreground">Contact our team for implementation help</span>
                          </div>
                        </Button>
                      </div>
                    </CardContent>
                  </Card> */}
{/* 
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">API Key Security</CardTitle>
                      <CardDescription>
                        Best practices for securing your API key
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-amber-100 text-amber-800 p-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold">Store Securely</h3>
                            <p className="text-xs text-slate-600">Never hardcode API keys in client-side code. Use environment variables or a secure vault.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="bg-amber-100 text-amber-800 p-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold">Backend Proxying</h3>
                            <p className="text-xs text-slate-600">Proxy API requests through your backend to prevent exposing the key to users.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="bg-amber-100 text-amber-800 p-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                              <circle cx="12" cy="8" r="1"></circle>
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold">Regular Rotation</h3>
                            <p className="text-xs text-slate-600">Rotate your API keys periodically to limit the impact of potential leaks.</p>
                          </div>
                        </div>

                        <div className="mt-2">
                          <Button 
                            variant="link" 
                            className="p-0 h-auto text-sm text-[#ffa62b]"
                            onClick={() => window.open('/api-docs/security', '_blank')}
                          >
                            View security documentation →
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card> */}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="demo">
              <Card>
                <CardHeader>
                  <CardTitle>Attack Demo: GitHub Issue &amp; Airtable Data Leakage</CardTitle>
                  <CardDescription>
                    This interactive demo showcases how ContextFort prevents prompt injection attacks that attempt to leak sensitive information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
                    <h3 className="text-lg font-semibold text-orange-800 flex items-center gap-2 mb-2">
                      <ShieldAlert className="h-5 w-5" />
                      Attack Scenario: Private Airtable Data Leak
                    </h3>
                    <p className="text-sm text-orange-700 mb-4">
                      This demo shows how an attacker could attempt to leak sensitive Airtable data through a GitHub issue prompt injection attack,
                      and how ContextFort prevents this attack vector.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-md shadow-sm border border-slate-200">
                        <h4 className="font-medium flex items-center gap-2 mb-2">
                          <Database className="h-4 w-4 text-blue-500" /> 
                          1. Private Airtable Data
                        </h4>
                        <p className="text-xs text-slate-600 mb-3">
                          Sensitive company data stored in a private Airtable database that should remain confidential.
                        </p>
                        <div className="mt-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => window.open("https://airtable.com/invite/l?inviteId=invMHlNERdRcTBnYd&inviteToken=4263087b3938b04347a4591dfa46fc6e7f2bb1a2b54f4d9123e69191a82b64c5&utm_medium=email&utm_source=product_team&utm_content=transactional-alerts", "_blank")}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View Airtable Database
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-md shadow-sm border border-slate-200">
                        <h4 className="font-medium flex items-center gap-2 mb-2">
                          <Github className="h-4 w-4 text-slate-800" /> 
                          2. GitHub Issue with Prompt Injection
                        </h4>
                        <p className="text-xs text-slate-600 mb-3">
                          An attacker creates a GitHub issue with embedded prompt injection commands to extract and leak Airtable data.
                        </p>
                        <div className="mt-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => window.open("https://github.com/johnriley9123/sample/issues/1", "_blank")}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View GitHub Issue #1
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-md shadow-sm border border-slate-200">
                        <h4 className="font-medium flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4 text-red-500" /> 
                          3. Data Leaked to New Issue
                        </h4>
                        <p className="text-xs text-slate-600 mb-3">
                          Without protection, an AI assistant would process the prompt injection and leak sensitive Airtable data to Issue #2.
                        </p>
                        <div className="mt-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => window.open("https://github.com/johnriley9123/sample/issues/2", "_blank")}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View GitHub Issue #2
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Attack Flow Visualization</h3>
                      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                        <div className="flex flex-col space-y-5">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Database className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-grow">
                              <h4 className="font-medium text-sm">Private Airtable Database</h4>
                              <p className="text-xs text-slate-500">Contains sensitive company information</p>
                            </div>
                          </div>
                          
                          <div className="ml-5 border-l-2 border-slate-300 pl-8 pb-2">
                            <ArrowRight className="h-5 w-5 text-slate-400 -ml-[38px] -mt-1 bg-white p-1" />
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                              <Github className="h-5 w-5 text-slate-800" />
                            </div>
                            <div className="flex-grow">
                              <h4 className="font-medium text-sm">GitHub Issue #1 Created</h4>
                              <p className="text-xs text-slate-500">Contains prompt injection payload</p>
                            </div>
                          </div>
                          
                          <div className="ml-5 border-l-2 border-slate-300 pl-8 pb-2">
                            <ArrowRight className="h-5 w-5 text-slate-400 -ml-[38px] -mt-1 bg-white p-1" />
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                              <Play className="h-5 w-5 text-amber-600" />
                            </div>
                            <div className="flex-grow">
                              <h4 className="font-medium text-sm">User Requests Summary</h4>
                              <p className="text-xs text-slate-500">Asks AI to summarize the GitHub issue</p>
                            </div>
                          </div>
                          
                          <div className="ml-5 border-l-2 border-red-300 pl-8 pb-2">
                            <ArrowRight className="h-5 w-5 text-red-400 -ml-[38px] -mt-1 bg-white p-1" />
                            <div className="bg-red-50 border border-red-200 rounded-md p-2 mt-1">
                              <p className="text-xs text-red-700">Without protection, injected commands execute</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                              <FileText className="h-5 w-5 text-red-600" />
                            </div>
                            <div className="flex-grow">
                              <h4 className="font-medium text-sm">GitHub Issue #2 Created</h4>
                              <p className="text-xs text-red-500">Sensitive Airtable data leaked</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">ContextFort's Protection</h3>
                      <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-5 rounded-lg border border-emerald-200 shadow-sm">
                        <div className="flex flex-col space-y-5">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                              <ShieldAlert className="h-5 w-5 text-teal-600" />
                            </div>
                            <div className="flex-grow">
                              <h4 className="font-medium text-sm">ContextFort Deployment</h4>
                              <p className="text-xs text-slate-500">AI protection layer activated</p>
                            </div>
                          </div>
                          
                          <div className="ml-5 border-l-2 border-emerald-300 pl-8 pb-2">
                            <ArrowRight className="h-5 w-5 text-emerald-500 -ml-[38px] -mt-1 bg-white p-1" />
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                              <Github className="h-5 w-5 text-slate-800" />
                            </div>
                            <div className="flex-grow">
                              <h4 className="font-medium text-sm">GitHub Issue #1 Analyzed</h4>
                              <p className="text-xs text-slate-500">Prompt injection detected</p>
                            </div>
                          </div>
                          
                          <div className="ml-5 border-l-2 border-emerald-300 pl-8 pb-2">
                            <ArrowRight className="h-5 w-5 text-emerald-500 -ml-[38px] -mt-1 bg-white p-1" />
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                              <Lock className="h-5 w-5 text-amber-600" />
                            </div>
                            <div className="flex-grow">
                              <h4 className="font-medium text-sm">Attack Neutralized</h4>
                              <p className="text-xs text-slate-500">Malicious commands blocked</p>
                            </div>
                          </div>
                          
                          <div className="ml-5 border-l-2 border-emerald-300 pl-8 pb-2">
                            <ArrowRight className="h-5 w-5 text-emerald-500 -ml-[38px] -mt-1 bg-white p-1" />
                            <div className="bg-emerald-50 border border-emerald-200 rounded-md p-2 mt-1">
                              <p className="text-xs text-emerald-700">AI responds safely with legitimate summary</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                              <Shield className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div className="flex-grow">
                              <h4 className="font-medium text-sm">Data Remains Protected</h4>
                              <p className="text-xs text-emerald-600">No sensitive information leaked</p>
                            </div>
                          </div>
                          
                          <div className="mt-4 bg-white rounded-md p-3 border border-emerald-200">
                            <h4 className="text-sm font-medium text-emerald-700 mb-2">Key Protections Activated:</h4>
                            <ul className="text-xs space-y-1 text-slate-600">
                              <li className="flex items-start gap-2">
                                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span>Prompt injection detection</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span>External resource access prevention</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span>System role jailbreak protection</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span>Data exfiltration blocking</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-slate-200 pt-5 mt-6">
                    <h3 className="text-lg font-semibold mb-4">Try It Yourself</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                        <h4 className="font-medium mb-3 text-slate-800">Demo the Attack</h4>
                        <p className="text-sm text-slate-600 mb-4">
                          Follow these steps to see how the attack would work without protection:
                        </p>
                        <ol className="text-xs text-slate-600 space-y-3 list-decimal list-inside">
                          <li>Visit GitHub Issue #1 containing the prompt injection</li>
                          <li>Observe how the issue has hidden commands to access Airtable</li>
                          <li>See how in Issue #2, sensitive data has been exposed</li>
                          <li>This demonstrates the risk of unprotected AI systems</li>
                        </ol>
                        <div className="mt-4">
                          <Button 
                            onClick={() => window.open("https://github.com/johnriley9123/sample/issues/1", "_blank")}
                            className="w-full bg-slate-800 hover:bg-slate-700"
                          >
                            View Attack Demo
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg border border-teal-200 shadow-sm">
                        <h4 className="font-medium mb-3 text-teal-800">Experience ContextFort Protection</h4>
                        <p className="text-sm text-slate-600 mb-4">
                          See how ContextFort prevents this attack in our sandbox:
                        </p>
                        <ol className="text-xs text-slate-600 space-y-3 list-decimal list-inside">
                          <li>Create a sandbox session from the "Proxy" tab</li>
                          <li>In the sandbox, try asking the AI about GitHub Issue #1</li>
                          <li>Watch how ContextFort blocks the prompt injection</li>
                          <li>Your sensitive data remains protected from exfiltration</li>
                        </ol>
                        <div className="mt-4">
                          <Button 
                            onClick={() => setActiveTab('proxy')}
                            className="w-full bg-teal-600 hover:bg-teal-700"
                          >
                            Go to Sandbox Demo
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
