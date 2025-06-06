import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const Navbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex w-full items-center justify-center p-4 backdrop-blur-md bg-white/70 shadow-sm transition-all duration-300">
        <div className="container max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="no-underline">
            <span className="text-2xl md:text-3xl font-extrabold text-black tracking-tight drop-shadow-sm cursor-pointer hover:opacity-90 transition-opacity duration-300">
              Context<span style={{ color: '#ffa62b' }}>Fort</span>
            </span>
          </Link>
          <nav className="flex items-center gap-2 md:gap-4 text-sm font-bold">
            {window.location.pathname === '/proxy' || window.location.pathname === '/dashboard' ? (
              <button 
                onClick={async () => {
                  try {
                    await supabase.auth.signOut();
                    toast({
                      title: "Logged out successfully",
                      variant: "default",
                    });
                    navigate('/proxy');
                  } catch (error) {
                    toast({
                      title: "Error logging out",
                      description: "Please try again",
                      variant: "destructive",
                    });
                  }
                }}
                className="group relative rounded-full px-4 py-2 font-bold text-black transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 rounded-full border-[3px] border-red-500 animate-border-draw"></div>
                </div>
                <span className="relative z-10">Logout</span>
              </button>
            ) : (
              <Link 
                to="/blog" 
                className="group relative rounded-full px-4 py-2 font-bold text-black transition-all duration-300 overflow-hidden no-underline"
              >
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 rounded-full border-[3px] border-[#ffa62b] animate-border-draw"></div>
                </div>
                <span className="relative z-10 no-underline">Blog</span>
              </Link>
            )}
            <Link 
              to="/team" 
              className="group relative rounded-full px-4 py-2 font-bold text-black transition-all duration-300 overflow-hidden no-underline"
            >
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 rounded-full border-[3px] border-[#ffa62b] animate-border-draw"></div>
              </div>
              <span className="relative z-10 no-underline">Team</span>
            </Link>
            <Link 
              to="/contact" 
              className="group relative rounded-full px-6 py-3 text-white font-bold shadow-md focus-visible:ring-2 focus-visible:ring-[#ffa62b] transition-all duration-300 overflow-hidden no-underline" 
              style={{ backgroundColor: '#ffa62b' }}
            >
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 rounded-full border-[3px] border-white animate-border-glow"></div>
              </div>
              <span className="relative z-10 no-underline">Schedule Demo</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Custom CSS for border animations */}
      <style>{`
        @keyframes border-draw {
          0% {
            border-color: transparent;
            transform: scale(0.95);
          }
          50% {
            border-color: #ffa62b;
            transform: scale(1.02);
          }
          100% {
            border-color: #ffa62b;
            transform: scale(1);
          }
        }

        .animate-border-draw {
          animation: border-draw 0.4s ease-out forwards;
        }

        @keyframes border-flow {
          0% {
            background-position: -100% 0;
          }
          100% {
            background-position: 100% 0;
          }
        }

        .animate-border-flow {
          background-size: 200% 100%;
          animation: border-flow 1.5s linear infinite;
        }

        @keyframes border-glow {
          0%, 100% {
            border-color: rgba(255, 255, 255, 0.6);
            box-shadow: 0 0 0 rgba(255, 255, 255, 0);
            transform: scale(1);
          }
          50% {
            border-color: rgba(255, 255, 255, 1);
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
            transform: scale(1.02);
          }
        }

        .animate-border-glow {
          animation: border-glow 2s ease-in-out infinite;
        }

        /* Remove text decoration */
        .no-underline {
          text-decoration: none !important;
        }
        .no-underline:hover {
          text-decoration: none !important;
        }
      `}</style>
    </>
  );
};

export default Navbar;