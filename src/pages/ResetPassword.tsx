import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      });
      
      if (error) throw error;
      
      setSuccess(true);
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for a link to reset your password.",
        variant: "default",
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during password reset';
      
      toast({
        title: "Password Reset Failed",
        description: errorMessage,
        variant: "destructive",
      });
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
            <Link to="/proxy" className="rounded-lg bg-gradient-to-r from-teal-500 to-slate-600 px-6 py-3 text-white font-semibold shadow-md hover:from-teal-600 hover:to-slate-700 focus-visible:ring-2 focus-visible:ring-teal-400 border border-teal-400/30 transform transition-all duration-300 hover:scale-105">Back to Login</Link>
          </nav>
        </div>
      </header>

      <main className="container max-w-md mx-auto pt-32 px-4 sm:px-6 md:px-8 min-h-screen flex flex-col justify-center">
        <Card className="w-full shadow-lg border-teal-100">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center space-y-4">
                <div className="bg-teal-50 p-4 rounded-md text-teal-700 border border-teal-200">
                  <h3 className="font-semibold">Password Reset Email Sent</h3>
                  <p className="text-sm mt-1">Please check your email for a link to reset your password.</p>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-teal-500 to-slate-600 hover:from-teal-600 hover:to-slate-700"
                  onClick={() => navigate('/proxy')}
                >
                  Back to Login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
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
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-teal-500 to-slate-600 hover:from-teal-600 hover:to-slate-700" 
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
                
                <div className="text-center mt-4">
                  <Link to="/proxy" className="text-sm text-teal-600 hover:text-teal-800">
                    Return to login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
