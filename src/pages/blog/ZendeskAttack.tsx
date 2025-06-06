import { motion } from "framer-motion";
import Navbar from '../../components/Navbar';
import { Link } from "react-router-dom";

const ZendeskAttack = () => {
  return (
    <div className="relative min-h-screen overflow-hidden font-sans text-slate-700 selection:bg-[#ffa62b]/30 selection:text-slate-900" style={{ fontFamily: "Gellix, Inter, sans-serif", backgroundColor: '#fef9f3', fontWeight: 'bold' }}>
      {/* Muted mango background with subtle gradient */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_60%_20%,rgba(255,166,43,0.12),transparent_60%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_80%,rgba(255,166,43,0.08),transparent_50%)]" />
      
      <Navbar />
      
      <div className="py-20 px-4 mt-16">
        <div className="max-w-4xl mx-auto">
          <Link to="/blog" className="inline-flex items-center text-[#ffa62b] hover:text-[#e08c1a] mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Blog
          </Link>

          <motion.article 
            initial={{opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.7}}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-[#ffa62b]/20 overflow-hidden p-8 md:p-12"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900 leading-tight">Attack on Zendesk Support MCP Server</h1>
            <div className="text-sm text-slate-500 mb-8 border-b border-slate-200 pb-4">June 4, 2025 • ContextFort Security Team</div>
            
            <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700">
              <p className="lead text-xl font-medium mb-8 text-slate-800 leading-relaxed">
                Using a Zendesk Support Model Context Protocol (MCP) server, we demonstrate how AI agents with tool-calling capabilities can be exploited to exfiltrate sensitive vulnerability information through carefully crafted prompt injections.
              </p>

              <h2 className="text-2xl font-bold mt-12 mb-4">The Attack Scenario</h2>
              <p className="mb-6 text-slate-700 leading-relaxed">
                In this security demonstration, we showcase a sophisticated attack that leverages prompt injection to manipulate an AI assistant into accessing and leaking sensitive vulnerability information from a critical support ticket.
              </p>

              <div className="my-8 space-y-12">
                <div className="mb-2 text-sm text-slate-500">
                  The following sequence of images demonstrates how the attack unfolds:
                </div>
                
                <div className="rounded-xl overflow-hidden border border-slate-200 shadow-md">
                  <img src="/images/zendesk-attack/1.png" alt="User has received a CRITICAL ticket from a customer" className="w-full" />
                  <div className="p-4 bg-slate-50">
                    <p className="text-sm text-slate-700 font-medium">
                      1. A user has received a CRITICAL priority ticket from a customer
                    </p>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-slate-200 shadow-md">
                  <img src="/images/zendesk-attack/2.png" alt="The ticket contains vulnerability details" className="w-full" />
                  <div className="p-4 bg-slate-50">
                    <p className="text-sm text-slate-700 font-medium">
                      2. The ticket contains details about a VULNERABILITY the customer requested a fix for
                    </p>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-slate-200 shadow-md">
                  <img src="/images/zendesk-attack/3.png" alt="Attacker sends email with prompt injection" className="w-full" />
                  <div className="p-4 bg-slate-50">
                    <p className="text-sm text-slate-700 font-medium">
                      3. Attacker sends an email to Zendesk with a PROMPT INJECTION
                    </p>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-slate-200 shadow-md">
                  <img src="/images/zendesk-attack/4.png" alt="User prompts Copilot to obtain ticket details" className="w-full" />
                  <div className="p-4 bg-slate-50">
                    <p className="text-sm text-slate-700 font-medium">
                      4. User prompts Copilot with Claude Sonnet 3.7 to 'Obtain Details about Latest Ticket'
                    </p>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-slate-200 shadow-md">
                  <img src="/images/zendesk-attack/5.png" alt="Claude fetches ticket details and sends to attacker" className="w-full" />
                  <div className="p-4 bg-slate-50">
                    <p className="text-sm text-slate-700 font-medium">
                      5. Claude first fetches details of the latest ticket then proceeds to send information from the HIGH priority ticket to attacker
                    </p>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-slate-200 shadow-md">
                  <img src="/images/zendesk-attack/6.png" alt="Vulnerability information sent to attacker" className="w-full" />
                  <div className="p-4 bg-slate-50">
                    <p className="text-sm text-slate-700 font-medium">
                      6. Information about the VULNERABILITY is sent via email to Attacker
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold mt-12 mb-4">Why This Attack Is Concerning</h2>
              <p className="mb-4 text-slate-700 leading-relaxed">
                This attack demonstrates several critical vulnerabilities in AI agent tool-calling systems:
              </p>
              <ul className="list-disc pl-6 mb-8 space-y-2 text-slate-700">
                <li className="leading-relaxed"><span className="font-bold text-slate-900">Privilege Escalation:</span> The attacker was able to access sensitive vulnerability information they shouldn't have permission to view.</li>
                <li className="leading-relaxed"><span className="font-bold text-slate-900">Indirect Prompt Injection:</span> The malicious prompt was delivered through a legitimate communication channel (Zendesk tickets).</li>
                <li className="leading-relaxed"><span className="font-bold text-slate-900">Trust Exploitation:</span> The AI agent trusted content from an apparently legitimate source without verifying permissions.</li>
                <li className="leading-relaxed"><span className="font-bold text-slate-900">Data Exfiltration:</span> Sensitive vulnerability information was leaked to an unauthorized user through a legitimate communication channel.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-4">How This Attack Works in the Real World</h2>
              <p className="mb-4 text-slate-700 leading-relaxed">
                While this demonstration was performed in a controlled environment, similar attacks can happen in real-world organizations that integrate AI assistants with their support tools. Let's explore how this might play out:
              </p>
              
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-bold mb-3">Real-World Attack Scenario</h3>
                <ol className="list-decimal pl-6 space-y-3 text-slate-700">
                  <li className="leading-relaxed">
                    <span className="font-semibold">Initial Access:</span> An attacker creates a support ticket with seemingly benign content.
                  </li>
                  <li className="leading-relaxed">
                    <span className="font-semibold">Reconnaissance:</span> The attacker identifies that the organization uses AI assistants integrated with their support system.
                  </li>
                  <li className="leading-relaxed">
                    <span className="font-semibold">Payload Delivery:</span> The attacker plants malicious prompts in support ticket comments or updates.
                  </li>
                  <li className="leading-relaxed">
                    <span className="font-semibold">Exploitation:</span> When a support agent asks the AI assistant for help with tickets, the assistant processes the malicious prompts.
                  </li>
                  <li className="leading-relaxed">
                    <span className="font-semibold">Data Exfiltration:</span> The AI is manipulated to access sensitive vulnerability information and share it back in a location accessible to the attacker.
                  </li>
                </ol>
              </div>
              
              <p className="mb-8 text-slate-700 leading-relaxed">
                What makes this attack particularly dangerous is that it exploits legitimate access patterns and trusted tools. The AI assistant has the necessary permissions to access sensitive information because it's operating on behalf of a user with those permissions. The attack bypasses traditional security controls by manipulating the AI's behavior rather than trying to break through access controls directly.
              </p>

              <h2 className="text-2xl font-bold mt-12 mb-4">How ContextFort Prevents This Attack</h2>
              <p className="mb-4 text-slate-700 leading-relaxed">
                At ContextFort, we've built a comprehensive security layer specifically designed to prevent these types of attacks:
              </p>
              <ul className="list-disc pl-6 mb-8 space-y-2 text-slate-700">
                <li className="leading-relaxed"><span className="font-bold text-slate-900">Permission Verification:</span> Our security proxy validates every tool call against user permissions, preventing privilege escalation.</li>
                <li className="leading-relaxed"><span className="font-bold text-slate-900">Content Scanning:</span> We scan all inputs and outputs for potential prompt injections and suspicious patterns.</li>
                <li className="leading-relaxed"><span className="font-bold text-slate-900">Tool Call Monitoring:</span> Every API call made by AI agents is logged, monitored, and can be audited in real-time.</li>
                <li className="leading-relaxed"><span className="font-bold text-slate-900">Data Flow Analysis:</span> We track where information comes from and where it goes, preventing unauthorized data exfiltration.</li>
                <li className="leading-relaxed"><span className="font-bold text-slate-900">Contextual Security:</span> Our system understands the context of each request and enforces appropriate security measures.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-4">Conclusion</h2>
              <p className="mb-4 text-slate-700 leading-relaxed">
                As AI agents become more powerful and gain access to sensitive support systems and customer data, securing these systems becomes critically important. The attack demonstrated here shows how traditional security boundaries can be bypassed through social engineering of AI systems.
              </p>
              <p className="mb-8 text-slate-700 leading-relaxed">
                ContextFort provides the security and observability layer you need to safely deploy AI agents with tool-calling capabilities in your organization. Our solution gives you visibility and control over every tool call, preventing data exfiltration attacks and ensuring that your AI systems operate securely and within their intended boundaries.
              </p>

              <div className="mt-12 p-6 bg-[#ffa62b]/10 rounded-xl border border-[#ffa62b]/30">
                <h3 className="text-xl font-bold mb-4">Ready to secure your AI agents?</h3>
                <p className="mb-4 leading-relaxed">Get a demo of our security proxy for tool-calling agents and see how we can help protect your organization from these types of attacks.</p>
                <Link 
                  to="/contact" 
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-lg font-bold text-white shadow-md focus-visible:ring-2 focus-visible:ring-[#ffa62b] overflow-hidden no-underline" 
                  style={{ backgroundColor: '#ffa62b' }}
                >
                  <span className="relative z-10 no-underline">Request a Demo</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 relative z-10"><path d="M13.172 11l-4.95-4.95a1 1 0 011.414-1.414l6.364 6.364a1 1 0 010 1.414l-6.364 6.364a1 1 0 01-1.414-1.414L13.172 13H4a1 1 0 110-2h9.172z" /></svg>
                </Link>
              </div>
              
              <div className="mt-12 p-6 bg-slate-100 rounded-xl border border-slate-200">
                <h3 className="text-xl font-bold mb-4">Key Takeaways</h3>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li className="leading-relaxed">AI agents with tool-calling capabilities can be vulnerable to sophisticated prompt injection attacks</li>
                  <li className="leading-relaxed">Attackers can use legitimate communication channels to deliver malicious prompts</li>
                  <li className="leading-relaxed">Without proper security, AI agents may leak sensitive vulnerability information to unauthorized parties</li>
                  <li className="leading-relaxed">ContextFort provides a comprehensive security layer to prevent these types of attacks</li>
                  <li className="leading-relaxed">Security and observability are crucial for safely deploying AI agents in your organization</li>
                </ul>
              </div>
              
              <div className="mt-12 pt-6 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row items-center justify-between">
                  <div className="text-slate-700 font-medium mb-4 sm:mb-0">Share this article:</div>
                  <div className="flex space-x-4">
                    <a href="#" className="rounded-full bg-slate-200 p-2 text-slate-700 hover:bg-[#ffa62b] hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </a>
                    <a href="#" className="rounded-full bg-slate-200 p-2 text-slate-700 hover:bg-[#ffa62b] hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                    </a>
                    <a href="#" className="rounded-full bg-slate-200 p-2 text-slate-700 hover:bg-[#ffa62b] hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    </a>
                    <a href="#" className="rounded-full bg-slate-200 p-2 text-slate-700 hover:bg-[#ffa62b] hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="mt-16">
                <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <Link to="/blog/jira-attack" className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-slate-200">
                    <div className="h-40 overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80" 
                        alt="Attack on Jira Atlassian MCP Server" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 flex-grow">
                      <div className="text-xs text-slate-500 mb-1">June 4, 2025</div>
                      <h4 className="text-lg font-bold mb-2 group-hover:text-[#ffa62b] transition-colors">Attack on Jira Atlassian MCP Server</h4>
                      <p className="text-sm text-slate-600 line-clamp-2">How AI agents with tool-calling capabilities can be exploited to exfiltrate sensitive data from Jira.</p>
                    </div>
                  </Link>
                  
                  <Link to="/blog/tool-calling-security" className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-slate-200">
                    <div className="h-40 overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80" 
                        alt="How Tool-Calling Agents Are Changing Security" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 flex-grow">
                      <div className="text-xs text-slate-500 mb-1">May 20, 2025</div>
                      <h4 className="text-lg font-bold mb-2 group-hover:text-[#ffa62b] transition-colors">How Tool-Calling Agents Are Changing Security</h4>
                      <p className="text-sm text-slate-600 line-clamp-2">Explore the new security challenges and opportunities as AI agents gain tool-calling capabilities.</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </div>
  );
};

export default ZendeskAttack;
