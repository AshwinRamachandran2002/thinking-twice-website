import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const siteUrl = import.meta.env.VITE_APP_URL || window.location.origin;

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email domain first
    if (!validateEmailDomain(email)) {
      toast({
        title: "Invalid Email Domain",
        description: "Please use your organization's email address. Personal email addresses are not allowed.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Attempting to send reset password email to:', email);
      
      // Use the complete URL path for password reset
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/auth/callback?type=recovery`,
      });
      
      if (error) throw error;
      
      setSuccess(true);
      toast({
        title: "Password Reset Email Sent",
        description: "Please check your email (including spam folder) for a link to reset your password.",
        variant: "default",
      });
    } catch (error: unknown) {
      console.error('Reset password error:', error);
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
    <div className="min-h-screen font-sans text-slate-700" style={{ fontFamily: "Gellix, Inter, sans-serif", backgroundColor: '#fef9f3', fontWeight: 'bold' }}>
      <header className="fixed top-0 left-0 right-0 z-50 flex w-full items-center justify-center p-4 backdrop-blur-md bg-white/70 shadow-sm transition-all duration-300">
        <div className="container max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl md:text-3xl font-extrabold text-black tracking-tight drop-shadow-sm cursor-pointer hover:opacity-90 transition-opacity duration-300">
            Context<span style={{ color: '#ffa62b' }}>Fort</span>
          </Link>
          <nav className="flex items-center gap-2 md:gap-4 text-sm font-medium">
            <Link to="/" className="group relative rounded-full px-4 py-2 font-bold text-black transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 rounded-full border-[3px] border-[#ffa62b] animate-border-draw"></div>
              </div>
              <span className="relative z-10">Home</span>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container max-w-xl mx-auto pt-32 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>Enter your email to receive a password reset link</CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="space-y-4">
                <div className="p-3 rounded-md bg-green-100 text-green-700 text-sm">
                  Password reset link has been sent to your email. Please check your inbox and spam folder.
                </div>
                <Button 
                  type="button" 
                  className="w-full bg-[#ffa62b] hover:bg-orange-600"
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
                  className="w-full bg-[#ffa62b] hover:bg-orange-600" 
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
                
                <div className="text-center mt-4">
                  <Link 
                    to="/proxy" 
                    className="text-sm text-[#ffa62b] hover:text-orange-600 transition-colors"
                  >
                    Back to Login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
