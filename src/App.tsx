import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import { isMobileDevice, runWhenIdle, isLowPowerMode } from "./lib/optimization";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Success from "./pages/Success";
import Blog from "./pages/Blog";
import Team from "./pages/Team";
import ProxyAccess from "./pages/ProxyAccess";
import ApiAccess from "./pages/ApiAccess";
import Dashboard from "./pages/Dashboard";
import AuthCallback from "./pages/AuthCallback";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";

// Import blog posts
import JiraAttack from "./pages/blog/JiraAttack";
import ZendeskAttack from "./pages/blog/ZendeskAttack";

// Configure QueryClient with performance optimizations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false, // Don't refetch on window focus for better performance
      retry: 1, // Limit retries
    },
  },
});

// Get the base URL from the environment or use the repository name for GitHub Pages
const basename = import.meta.env.BASE_URL;

// PerformanceOptimizer component to apply global optimizations
interface PerformanceOptimizerProps {
  children: React.ReactNode;
}

const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({ children }) => {
  const [lowPowerMode, setLowPowerMode] = useState(false);
  
  useEffect(() => {
    // Check for low power mode
    runWhenIdle(async () => {
      const lowPower = await isLowPowerMode();
      setLowPowerMode(lowPower);
      
      // Apply specific optimizations for low power mode
      if (lowPower) {
        document.body.classList.add('low-power-mode');
      }
    });
    
    // Apply mobile-specific optimizations
    if (isMobileDevice()) {
      document.body.classList.add('mobile-device');
    }
    
    // Detect slow devices by measuring how long it takes to do a simple computation
    const startTime = performance.now();
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.sqrt(i);
    }
    const endTime = performance.now();
    
    // If it takes more than 50ms, consider it a slow device
    if (endTime - startTime > 50) {
      document.body.classList.add('slow-device');
    }
    
    // Clean up function
    return () => {
      document.body.classList.remove('low-power-mode', 'mobile-device', 'slow-device');
    };
  }, []);
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PerformanceOptimizer>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={basename}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/success" element={<Success />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/jira-attack" element={<JiraAttack />} />
            <Route path="/blog/zendesk-attack" element={<ZendeskAttack />} />
            <Route path="/team" element={<Team />} />
            <Route path="/proxy" element={<ProxyAccess />} />
            <Route path="/api" element={<ApiAccess />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PerformanceOptimizer>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
