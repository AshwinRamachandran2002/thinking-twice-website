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

export default function RedTeam() {
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
          navigate('/dashboard', { state: { from: 'red-team' } });
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
        navigate('/dashboard', { state: { from: 'red-team' } });
      }, 1000);
    } catch (error: unknown) {
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-12rem)]">
          {/* Left Side - Company Information */}
          <div className="flex flex-col space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#ffa62b]/30 bg-[#ffa62b]/10 px-4 py-1.5 mb-3 w-fit">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#ffa62b]">
                  <path fillRule="evenodd" d="M14.447 3.027a.75.75 0 01.527.92l-4.5 16.5a.75.75 0 01-1.448-.394l4.5-16.5a.75.75 0 01.921-.526zM16.72 6.22a.75.75 0 011.06 0l5.25 5.25a.75.75 0 010 1.06l-5.25 5.25a.75.75 0 11-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 010-1.06zm-9.44 0a.75.75 0 010 1.06L2.56 12l4.72 4.72a.75.75 0 11-1.06 1.06L.97 12.53a.75.75 0 010-1.06l5.25-5.25a.75.75 0 011.06 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-bold text-[#ffa62b]">Security Assessment</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-[#ffa62b]">
                ContextFort Red Teaming
              </h1>
              <p className="text-xl text-slate-600">
                Continuous threat assessment for your AI agents and integrations
              </p>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-lg leading-relaxed">
                Our automated red teaming platform continuously tests your AI agents against the latest threat vectors, providing comprehensive security reports and remediation strategies to protect your organization.
              </p>
              
              <div className="mt-10 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#ffa62b]/20 p-3 rounded-full min-w-[3rem] h-12 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#ffa62b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-lg">Continuous Threat Assessment</h3>
                    <p className="text-slate-600">Automated testing against the latest attack vectors and techniques to stay ahead of evolving threats</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-[#ffa62b]/20 p-3 rounded-full min-w-[3rem] h-12 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#ffa62b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-lg">Comprehensive Reports</h3>
                    <p className="text-slate-600">Detailed security reports with actionable remediation strategies tailored to your AI infrastructure</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#ffa62b]/20 p-3 rounded-full min-w-[3rem] h-12 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#ffa62b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-lg">Integration Testing</h3>
                    <p className="text-slate-600">Identify vulnerabilities in your data integrations and tool-calling connections before attackers exploit them</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#ffa62b]/20 p-3 rounded-full min-w-[3rem] h-12 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#ffa62b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                      <path d="M9 14l2 2 4-4"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-lg">Compliance Readiness</h3>
                    <p className="text-slate-600">Documentation to help meet security compliance requirements for AI systems and data handling</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login/Signup Form */}
          <div className="w-full max-w-md mx-auto lg:ml-auto">
            <Card className="w-full shadow-lg border-2 border-[#ffa62b]/20 rounded-2xl overflow-hidden">
              <CardHeader className="space-y-2 bg-gradient-to-r from-[#ffa62b]/10 to-amber-50 border-b border-[#ffa62b]/20">
                <CardTitle className="text-2xl font-bold text-center">Access Red Teaming Platform</CardTitle>
                <CardDescription className="text-center text-base">
                  Sign in with your organization email to start securing your AI agents
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <form onSubmit={handleSignIn} className="space-y-5">
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">Work Email</label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="you@company.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="h-12 px-4"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label htmlFor="password" className="text-sm font-medium">Password</label>
                          <Link to="/reset-password" className="text-xs text-[#ffa62b] hover:text-orange-600 font-medium">
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
                          className="h-12 px-4"
                        />
                      </div>
                      
                      {message && (
                        <div className={`p-4 rounded-lg text-sm ${
                          message.type === "error" ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-700 border border-green-200'
                        }`}>
                          {message.text}
                        </div>
                      )}
                      
                      <Button type="submit" className="w-full bg-[#ffa62b] hover:bg-orange-600 h-12 text-base font-bold" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="register">
                    <form onSubmit={handleSignUp} className="space-y-5">
                      <div className="space-y-2">
                        <label htmlFor="register-email" className="text-sm font-medium">Work Email</label>
                        <Input 
                          id="register-email" 
                          type="email" 
                          placeholder="you@company.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="h-12 px-4"
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
                          className="h-12 px-4"
                        />
                      </div>
                      
                      {message && (
                        <div className={`p-4 rounded-lg text-sm ${
                          message.type === "error" ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-700 border border-green-200'
                        }`}>
                          {message.text}
                        </div>
                      )}
                      
                      <Button type="submit" className="w-full bg-[#ffa62b] hover:bg-orange-600 h-12 text-base font-bold" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 bg-slate-50 border-t border-slate-100">
                <div className="text-center text-sm text-slate-600">
                  <p className="font-medium">Enterprise Access Only</p>
                  <p>Only organization email addresses are accepted for security reasons.</p>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
