import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface UsageData {
  date: string;
  requests: number;
  blocked: number;
}

interface ActivityData {
  id: string;
  event: string;
  type: string;
  timestamp: string;
  status: string;
}

export default function Dashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<Session | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [usage, setUsage] = useState<UsageData[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUserData(session.user.id);
      }
      setLoading(false);
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserData(session.user.id);
      } else {
        // If logged out, redirect to login page
        navigate('/proxy');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchUserData = async (userId: string) => {
    try {
      // Example: fetch user-specific data like API keys
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      setUserData(data);
      setApiKey(data?.api_key || null);

      // Example: fetch usage stats
      const mockUsageData = [
        { date: '2025-05-29', requests: 1243, blocked: 17 },
        { date: '2025-05-30', requests: 1876, blocked: 23 },
        { date: '2025-05-31', requests: 2032, blocked: 31 },
        { date: '2025-06-01', requests: 1567, blocked: 19 },
        { date: '2025-06-02', requests: 1932, blocked: 28 },
      ];
      setUsage(mockUsageData);
      
      // Example: fetch recent activity
      const mockActivityData = [
        { id: '1', event: 'Data Exfiltration Attempt', type: 'security', timestamp: '2025-06-03 09:24:15', status: 'blocked' },
        { id: '2', event: 'API Key Generated', type: 'account', timestamp: '2025-06-02 15:32:47', status: 'success' },
        { id: '3', event: 'Agent Config Updated', type: 'config', timestamp: '2025-06-02 14:19:20', status: 'success' },
        { id: '4', event: 'Prompt Injection Attempt', type: 'security', timestamp: '2025-06-01 11:05:33', status: 'blocked' },
        { id: '5', event: 'New Integration Added', type: 'config', timestamp: '2025-05-31 16:42:08', status: 'success' },
      ];
      setRecentActivity(mockActivityData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
    navigate('/');
  };

  const generateNewApiKey = async () => {
    try {
      const newApiKey = 'ck_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      setApiKey(newApiKey);
      // In a real app, you would save this to your database
      alert('New API key generated! In a production app, this would be saved to the database.');
    } catch (error) {
      console.error('Error generating new API key:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-teal-500 border-b-teal-700 border-l-teal-500 border-r-teal-700 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/proxy" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-50 to-slate-100">
      <header className="fixed top-0 left-0 right-0 z-50 flex w-full items-center justify-center p-4 backdrop-blur-md bg-white/70 shadow-sm transition-all duration-300">
        <div className="container max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-teal-500 via-slate-600 to-slate-700 bg-clip-text text-transparent tracking-tight drop-shadow-sm select-none">
            ContextFort
          </Link>
          <nav className="flex items-center gap-2 md:gap-4 text-sm font-medium">
            <Link to="/" className="rounded-lg px-3 py-2 transition-colors hover:bg-teal-100/70 hover:text-teal-700 focus-visible:ring-2 focus-visible:ring-teal-500 font-semibold text-slate-700 border border-transparent hover:border-teal-200">
              Home
            </Link>
            <Link to="/team" className="rounded-lg px-3 py-2 transition-colors hover:bg-teal-100/70 hover:text-teal-700 focus-visible:ring-2 focus-visible:ring-teal-500 font-semibold text-slate-700 border border-transparent hover:border-teal-200">
              Team
            </Link>
            <Button variant="ghost" onClick={handleSignOut} className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">
              Sign Out
            </Button>
          </nav>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto pt-32 px-4 sm:px-6 md:px-8 pb-16">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Welcome to ContextFort Proxy</h1>
              <p className="text-slate-600 mt-2">Manage your API keys and monitor your agent security</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="font-semibold text-slate-700">{session?.user?.email}</span>
                <span className="text-xs text-slate-500">Free Plan</span>
              </div>
              <div className="bg-teal-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold">
                {session?.user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          </div>

          {/* API Key Section */}
          <Card className="w-full shadow-md border-teal-100">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Your API Key</CardTitle>
                <CardDescription>Use this key to authenticate your requests to the ContextFort Proxy</CardDescription>
              </div>
              <Button className="bg-gradient-to-r from-teal-500 to-slate-600 hover:from-teal-600 hover:to-slate-700">
                Upgrade to Pro
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1 bg-slate-50 p-4 rounded-md font-mono text-sm overflow-x-auto border border-slate-200">
                  {apiKey || 'No API key available. Generate one to get started.'}
                </div>
                <Button onClick={generateNewApiKey} className="whitespace-nowrap bg-slate-700 hover:bg-slate-800">
                  {apiKey ? 'Regenerate Key' : 'Generate Key'}
                </Button>
              </div>
              
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-md p-4 text-sm text-amber-800">
                <strong>Security Note:</strong> Keep your API key secure. Never share it publicly or commit it to version control.
              </div>
            </CardContent>
          </Card>

          {/* Usage Stats */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Agent Usage Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-md border-teal-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-800">
                    {usage.reduce((sum, day) => sum + day.requests, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">Last 7 days</div>
                  <div className="h-1 w-full bg-slate-100 rounded-full mt-3">
                    <div className="h-1 bg-teal-500 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">75% of free tier limit</div>
                </CardContent>
              </Card>
              
              <Card className="shadow-md border-teal-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Blocked Attempts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-rose-600">
                    {usage.reduce((sum, day) => sum + day.blocked, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">Last 7 days</div>
                  <div className="mt-2 text-xs inline-flex items-center font-medium rounded-full px-2.5 py-0.5 bg-rose-100 text-rose-800">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                    </svg>
                    +12% from last week
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-md border-teal-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Protection Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-teal-600">
                    {Math.round((usage.reduce((sum, day) => sum + day.blocked, 0) / 
                    usage.reduce((sum, day) => sum + day.requests, 0)) * 100)}%
                  </div>
                  <div className="text-sm text-slate-500 mt-1">Threats detected & blocked</div>
                  <div className="mt-2 text-xs inline-flex items-center font-medium rounded-full px-2.5 py-0.5 bg-teal-100 text-teal-800">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    Excellent
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Integration Guide */}
          <Card className="w-full shadow-md border-teal-100 mt-4">
            <CardHeader>
              <CardTitle>Quick Start Guide</CardTitle>
              <CardDescription>Follow these steps to integrate ContextFort Proxy with your agent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-teal-100 text-teal-800 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 font-bold">1</div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Install our SDK</h3>
                    <div className="mt-2 bg-slate-800 text-slate-200 p-3 rounded-md font-mono text-sm">
                      npm install @contextfort/proxy-sdk
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-teal-100 text-teal-800 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 font-bold">2</div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Initialize the client</h3>
                    <div className="mt-2 bg-slate-800 text-slate-200 p-3 rounded-md font-mono text-sm">
                      import &#123; ContextFort &#125; from '@contextfort/proxy-sdk';<br/>
                      <br/>
                      const client = new ContextFort(&#123;<br/>
                      &nbsp;&nbsp;apiKey: 'your-api-key',<br/>
                      &nbsp;&nbsp;endpoint: 'https://api.contextfort.com/v1'<br/>
                      &#125;);
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-teal-100 text-teal-800 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 font-bold">3</div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Wrap your LLM provider</h3>
                    <div className="mt-2 bg-slate-800 text-slate-200 p-3 rounded-md font-mono text-sm">
                      const secureClient = client.wrap(openai);<br/>
                      <br/>
                      // Use secureClient just like your normal OpenAI client<br/>
                      const response = await secureClient.chat.completions.create(&#123;<br/>
                      &nbsp;&nbsp;model: "gpt-4",<br/>
                      &nbsp;&nbsp;messages: [&#123; role: "user", content: "Hello world" &#125;]<br/>
                      &#125;);
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" className="border-teal-500 text-teal-600 hover:bg-teal-50">
                View Full Documentation
              </Button>
            </CardFooter>
          </Card>
          
          {/* Recent Activity */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Recent Activity</h2>
            <Card className="w-full shadow-md border-teal-100">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="px-6 py-3 text-left font-medium text-gray-500">Event</th>
                        <th className="px-6 py-3 text-left font-medium text-gray-500">Type</th>
                        <th className="px-6 py-3 text-left font-medium text-gray-500">Time</th>
                        <th className="px-6 py-3 text-left font-medium text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivity.map((activity) => (
                        <tr key={activity.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-800">{activity.event}</td>
                          <td className="px-6 py-4">
                            {activity.type === 'security' && (
                              <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                                Security
                              </span>
                            )}
                            {activity.type === 'account' && (
                              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                Account
                              </span>
                            )}
                            {activity.type === 'config' && (
                              <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                                Config
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-gray-500">{activity.timestamp}</td>
                          <td className="px-6 py-4">
                            {activity.status === 'blocked' && (
                              <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                                Blocked
                              </span>
                            )}
                            {activity.status === 'success' && (
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                Success
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center border-t border-gray-200 px-6 py-4">
                <div className="text-sm text-gray-500">Showing the last 5 activities</div>
                <Button variant="outline" size="sm" className="border-teal-500 text-teal-600 hover:bg-teal-50">
                  View All Activity
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
