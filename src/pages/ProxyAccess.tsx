import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function ProxyAccess() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        toast({
          title: "Already logged in",
          description: "Redirecting to your dashboard...",
          variant: "default",
        });
        navigate('/dashboard');
      }
    };
    
    checkSession();
  }, [navigate, toast]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Login successful!",
        description: "Redirecting you to your dashboard...",
        variant: "default",
      });
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during sign in';
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
      
      toast({
        title: "Registration successful!",
        description: "Please check your email to confirm your account.",
        variant: "default",
      });
      
      setMessage({ 
        type: 'success', 
        text: 'Registration successful! Please check your email to confirm your account.' 
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during registration';
      
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-50 to-slate-100">
      <header className="fixed top-0 left-0 right-0 z-50 flex w-full items-center justify-center p-4 backdrop-blur-md bg-white/70 shadow-sm transition-all duration-300">
        <div className="container max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-teal-500 via-slate-600 to-slate-700 bg-clip-text text-transparent tracking-tight drop-shadow-sm select-none">
            ContextFort
          </Link>
          <nav className="flex items-center gap-2 md:gap-4 text-sm font-medium">
            <Link to="/" className="rounded-lg px-4 py-2 transition-colors hover:bg-teal-100/70 hover:text-teal-700 focus-visible:ring-2 focus-visible:ring-teal-500 font-semibold text-slate-700 border border-transparent hover:border-teal-200">Home</Link>
            <Link to="/team" className="rounded-lg px-4 py-2 transition-colors hover:bg-teal-100/70 hover:text-teal-700 focus-visible:ring-2 focus-visible:ring-teal-500 font-semibold text-slate-700 border border-transparent hover:border-teal-200">Team</Link>
            <Link to="/contact" className="rounded-lg bg-gradient-to-r from-teal-500 to-slate-600 px-6 py-3 text-white font-semibold shadow-md hover:from-teal-600 hover:to-slate-700 focus-visible:ring-2 focus-visible:ring-teal-400 border border-teal-400/30 transform transition-all duration-300 hover:scale-105">Schedule Demo</Link>
          </nav>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto pt-32 px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[calc(100vh-12rem)]">
          {/* Left Side - Company Information */}
          <div className="flex flex-col space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-teal-500 via-slate-600 to-slate-700 bg-clip-text text-transparent">
                ContextFort Proxy
              </h1>
              <p className="text-xl text-slate-600">
                Real-time context-aware security for your tool-calling agent
              </p>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-lg">
                Unlike static filters or prompt sanitizers, we protect against data exfiltration by intercepting tool calls after LLM output but before execution
              </p>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-teal-100 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Real-time Protection</h3>
                    <p className="text-slate-600">Block unintended tool calls in real-time using context-aware policies</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-teal-100 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Policy Enforcement</h3>
                    <p className="text-slate-600">Define and enforce granular security policies for all agent actions</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-teal-100 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Zero-Change Integration</h3>
                    <p className="text-slate-600">Drop-in proxy requires no changes to your existing models or agent code</p>
                  </div>
                </div>


                <div className="flex items-start gap-3">
                  <div className="bg-teal-100 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="3" y1="9" x2="21" y2="9"></line>
                      <line x1="9" y1="21" x2="9" y2="9"></line>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Enterprise Monitoring</h3>
                    <p className="text-slate-600">Log all blocked and passed tool calls directly to Datadog/Splunk</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login/Signup Form */}
          <div className="w-full max-w-md mx-auto lg:ml-auto">
            <Card className="w-full shadow-lg border-teal-100">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Access ContextFort Proxy</CardTitle>
                <CardDescription className="text-center">
                  Sign in to your account or create a new one
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
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="your@email.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                      <div className="flex items-center justify-between">
                          <label htmlFor="password" className="text-sm font-medium">Password</label>
                          <Link to="/reset-password" className="text-xs text-teal-600 hover:text-teal-800">
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
                          message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {message.text}
                        </div>
                      )}
                      
                      <Button type="submit" className="w-full bg-gradient-to-r from-teal-500 to-slate-600 hover:from-teal-600 hover:to-slate-700" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="register">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="register-email" className="text-sm font-medium">Email</label>
                        <Input 
                          id="register-email" 
                          type="email" 
                          placeholder="your@email.com" 
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
                          message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {message.text}
                        </div>
                      )}
                      
                      <Button type="submit" className="w-full bg-gradient-to-r from-teal-500 to-slate-600 hover:from-teal-600 hover:to-slate-700" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 w-full">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setLoading(true);
                      supabase.auth.signInWithOAuth({
                        provider: 'google',
                        options: {
                          redirectTo: `${window.location.origin}/auth/callback`
                        }
                      }).then(({ error }) => {
                        if (error) {
                          toast({
                            title: "Authentication failed",
                            description: error.message,
                            variant: "destructive",
                          });
                          setMessage({ type: 'error', text: error.message });
                          setLoading(false);
                        }
                      });
                    }}
                    disabled={loading}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setLoading(true);
                      supabase.auth.signInWithOAuth({
                        provider: 'github',
                        options: {
                          redirectTo: `${window.location.origin}/auth/callback`
                        }
                      }).then(({ error }) => {
                        if (error) {
                          toast({
                            title: "Authentication failed",
                            description: error.message,
                            variant: "destructive",
                          });
                          setMessage({ type: 'error', text: error.message });
                          setLoading(false);
                        }
                      });
                    }}
                    disabled={loading}
                  >
                    <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 1c-3.3 0-6 1.1-8 3.4C2.7 6.3 2 8.7 2 11.7v.6c0 3 .7 5.4 2 7.2 2 2.3 4.7 3.4 8 3.4 3.3 0 6-1.1 8-3.4 1.3-1.8 2-4.2 2-7.2v-.6c0-3-.7-5.4-2-7.2C18 2.1 15.3 1 12 1zm4.3 14.5a4.88 4.88 0 0 1-1.9 2.3 5.34 5.34 0 0 1-5.1.2 4.91 4.91 0 0 1-1.6-1.1A4.9 4.9 0 0 1 6.6 15a5.4 5.4 0 0 1-.5-2.3 5.4 5.4 0 0 1 .5-2.3 4.94 4.94 0 0 1 1.1-1.9 5.33 5.33 0 0 1 8.1.8c.5.6.9 1.2 1.1 1.9.2.7.4 1.5.4 2.3a5.6 5.6 0 0 1-.5 2.3c-.3.7-.6 1.3-1 1.9z" />
                    </svg>
                    GitHub
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
