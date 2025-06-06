import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';

const siteUrl = import.meta.env.VITE_APP_URL || window.location.origin;

export default function ApiAccess() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Function to validate email domain
  const validateEmailDomain = (email: string): boolean => {
    const domain = email.split('@')[1];
    if (!domain) return false;

    // Common personal email domains to block
    const personalDomains = [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com', 
      'aol.com', 'icloud.com', 'mail.com', 'protonmail.com', 'zoho.com',
      'yandex.com', 'tutanota.com', 'proton.me', 'inbox.com', 'gmx.com',
      'fastmail.com', 'me.com', 'mac.com'
    ];

    // If it's a personal email domain, reject it
    if (personalDomains.includes(domain.toLowerCase())) {
      return false;
    }

    // Allow .edu domains
    if (domain.toLowerCase().endsWith('.edu')) {
      return true;
    }

    // Check for common email providers' business domains
    const personalBusinessDomains = ['gmail.business', 'outlook.business'];
    if (personalBusinessDomains.some(d => domain.toLowerCase().includes(d))) {
      return false;
    }

    // If it's not a personal email and not .edu, assume it's a business domain
    return true;
  };

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      if (!mounted || initialCheckDone) return;
      
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('Session check error:', error);
          return;
        }

        if (data?.session) {
          toast({
            title: "Already logged in",
            description: "Redirecting to your dashboard...",
            variant: "default",
          });
          navigate('/dashboard', { state: { from: 'api' } });
        }
      } catch (err) {
        console.error('Session check failed:', err);
      } finally {
        if (mounted) {
          setInitialCheckDone(true);
        }
      }
    };
    
    checkSession();

    return () => {
      mounted = false;
    };
  }, [navigate, toast, initialCheckDone]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return;
    
    // Validate email domain first
    if (!validateEmailDomain(email)) {
      toast({
        title: "Invalid Email Domain",
        description: "Please use your organization's email address. Personal email addresses are not allowed.",
        variant: "destructive",
      });
      setMessage({ 
        type: "error", 
        text: "Please use your organization's email address. Personal email addresses are not allowed." 
      });
      return;
    }
    
    setLoading(true);
    setMessage(null);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Wait a moment for session to be established
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Session not established');
      }
      
      toast({
        title: "Login successful!",
        description: "Redirecting you to your dashboard...",
        variant: "default",
      });
      
      // Navigate after a short delay to allow toast to be seen
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during sign in';
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email domain first
    if (!validateEmailDomain(email)) {
      toast({
        title: "Invalid Email Domain",
        description: "Please use your organization's email address. Personal email addresses are not allowed.",
        variant: "destructive",
      });
      setMessage({ 
        type: "error", 
        text: "Please use your organization's email address. Personal email addresses are not allowed." 
      });
      return;
    }
    
    setLoading(true);
    setMessage(null);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback?type=signup`,
        },
      });
      
      if (error) throw error;
      
      toast({
        title: "Registration successful!",
        description: "Please check your email to confirm your account.",
        variant: "default",
      });
      
      setMessage({ 
        type: "success", 
        text: "Registration successful! Please check your email to confirm your account." 
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during registration';
      
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-700" style={{ fontFamily: "Gellix, Inter, sans-serif", backgroundColor: '#fef9f3', fontWeight: 'bold' }}>
      <Navbar />

      <main className="container max-w-7xl mx-auto pt-32 px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[calc(100vh-12rem)]">
          {/* Left Side - Company Information */}
          <div className="flex flex-col space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold tracking-tight text-[#ffa62b]">
                ContextFort API
              </h1>
              <p className="text-xl text-slate-600">
                Direct API integration for your agent security needs
              </p>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-lg">
                Integrate our powerful context-aware security directly into your applications with a simple REST API
              </p>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-[#ffa62b]/20 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#ffa62b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Simple Integration</h3>
                    <p className="text-slate-600">Easy-to-implement REST API with comprehensive documentation</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-[#ffa62b]/20 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#ffa62b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Advanced Security</h3>
                    <p className="text-slate-600">Context-aware filtering to prevent unintended data access</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-[#ffa62b]/20 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#ffa62b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Flexible Deployment</h3>
                    <p className="text-slate-600">Deploy in your own infrastructure or use our managed service</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-[#ffa62b]/20 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#ffa62b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="3" y1="9" x2="21" y2="9"></line>
                      <line x1="9" y1="21" x2="9" y2="9"></line>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Detailed Analytics</h3>
                    <p className="text-slate-600">Comprehensive logging and monitoring of all security events</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login/Signup Form */}
          <div className="w-full max-w-md mx-auto lg:ml-auto">
            <Card className="w-full shadow-lg border-[#ffa62b]/20">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Access ContextFort API</CardTitle>
                <CardDescription className="text-center">
                  Sign in with your organization email
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">Work Email</label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="you@company.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label htmlFor="password" className="text-sm font-medium">Password</label>
                          <Link to="/reset-password" className="text-xs text-[#ffa62b] hover:text-orange-600">
                            Forgot Password?
                          </Link>
                        </div>
                        <Input 
                          id="password" 
                          type="password" 
                          placeholder="••••••••" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      
                      {message && (
                        <div className={`p-3 rounded-md text-sm ${
                          message.type === "error" ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {message.text}
                        </div>
                      )}
                      
                      <Button type="submit" className="w-full bg-[#ffa62b] hover:bg-orange-600" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="register">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="register-email" className="text-sm font-medium">Work Email</label>
                        <Input 
                          id="register-email" 
                          type="email" 
                          placeholder="you@company.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="register-password" className="text-sm font-medium">Password</label>
                        <Input 
                          id="register-password" 
                          type="password" 
                          placeholder="••••••••" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      
                      {message && (
                        <div className={`p-3 rounded-md text-sm ${
                          message.type === "error" ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {message.text}
                        </div>
                      )}
                      
                      <Button type="submit" className="w-full bg-[#ffa62b] hover:bg-orange-600" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="text-center text-sm text-slate-600">
                  <p>Only organization email addresses are accepted.</p>
                  <p>Personal email providers (Gmail, Outlook, etc.) are not allowed.</p>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
