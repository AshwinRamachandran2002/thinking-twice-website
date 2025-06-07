import { motion } from "framer-motion";
import "@fontsource/inter";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { lazy } from "react";
import { useScrollOptimization } from "../hooks/use-scroll-optimization";
import { ProblemSection } from "../components/ProblemSection";
import { SolutionsSection } from "../components/SolutionsSection";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

// Lazy load heavy components
const SecurityDiagram = lazy(() => import("../components/SecurityDiagram").then(module => ({
  default: module.SecurityDiagram
})));

const LandingPageHero = () => {
  const { scrollClass } = useScrollOptimization();

  return (
    <div className={`relative min-h-screen overflow-hidden font-sans text-slate-700 selection:bg-[#ffa62b]/30 selection:text-slate-900 ${scrollClass}`} style={{ fontFamily: "Gellix, Inter, sans-serif", backgroundColor: '#fef9f3', fontWeight: 'bold' }}>
      {/* Simplified background without complex gradients */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50" />
      <div className="absolute inset-0 -z-10 opacity-30"></div>

      <Navbar />

      <main className="relative z-20 flex min-h-screen flex-col items-center justify-center px-4 pt-32 md:pt-40">
        <motion.section 
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center space-y-5 text-center mb-14"
        >
          <motion.div variants={item} className="inline-flex items-center gap-2 rounded-full border border-[#ffa62b]/30 bg-[#ffa62b]/10 px-5 py-2 backdrop-blur-md" style={{ animationDelay: '0.1s' }}>
            <span className="text-sm font-bold">Backed by</span>
            <img decoding="async" src="https://framerusercontent.com/images/O703WMlgsx2KJikRoCbLUwT5hk.png" alt="" style={{display:'block',width:'110px',height:'23px',objectPosition:'center',objectFit:'fill'}} />
          </motion.div>
          <motion.h1 variants={item} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight drop-shadow-sm text-black mb-8">
            <span style={{ color: '#ffa62b' }}>Prompt Injection Protection</span><br />
            <span className="text-black">for AI Agents</span>
          </motion.h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
            <motion.div 
              variants={item} 
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-md border-2 border-[#ffa62b]/20 hover:border-[#ffa62b]/50 transition-all hover:shadow-lg"
              whileHover={{ y: -3 }}
            >
              <div className="bg-[#ffa62b]/10 p-2.5 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-[#ffa62b]">
                  <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#ffa62b' }}>For Security Teams</h3>
              <p className="text-base mb-4 text-slate-600 font-medium leading-relaxed">
                Is your enterprise concerned about developers using Model-Context-Protocol (MCP) tools?
              </p>
              <Link 
                to="/proxy" 
                className="group relative flex items-center gap-2 rounded-full px-5 py-2.5 text-base font-bold text-white shadow-md focus-visible:ring-2 focus-visible:ring-[#ffa62b] overflow-hidden no-underline w-fit hover:bg-orange-600 transition-all" 
                style={{ backgroundColor: '#ffa62b' }}
              >
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="absolute inset-0 rounded-full border-[3px] border-white"></div>
                </div>
                <span className="relative z-10 no-underline">Try our Proxy Live</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 relative z-10"><path d="M13.172 11l-4.95-4.95a1 1 0 011.414-1.414l6.364 6.364a 1 1 0 010 1.414l-6.364 6.364a1 1 0 01-1.414-1.414L13.172 13H4a1 1 0 110-2h9.172z" /></svg>
              </Link>
            </motion.div>
            
            <motion.div 
              variants={item} 
              className="bg-gradient-to-r from-[#ffa62b]/10 to-amber-50 p-6 rounded-2xl shadow-md border-2 border-[#ffa62b]/20 hover:border-[#ffa62b]/50 transition-all hover:shadow-lg"
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-white/70 p-2.5 rounded-full w-12 h-12 flex items-center justify-center mb-3 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-[#ffa62b]">
                  <path fillRule="evenodd" d="M14.447 3.027a.75.75 0 01.527.92l-4.5 16.5a.75.75 0 01-1.448-.394l4.5-16.5a.75.75 0 01.921-.526zM16.72 6.22a.75.75 0 011.06 0l5.25 5.25a.75.75 0 010 1.06l-5.25 5.25a.75.75 0 11-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 010-1.06zm-9.44 0a.75.75 0 010 1.06L2.56 12l4.72 4.72a.75.75 0 11-1.06 1.06L.97 12.53a.75.75 0 010-1.06l5.25-5.25a.75.75 0 011.06 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-center" style={{ color: '#ffa62b' }}>Need a Security Assessment?</h3>
              <p className="text-base mb-4 text-slate-600 font-medium text-center">
                Get a comprehensive vulnerability analysis of your AI agent's tool integrations.
              </p>
              <div className="flex justify-center">
                <Link 
                  to="/red-team" 
                  className="group relative inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-base font-bold text-white shadow-md focus-visible:ring-2 focus-visible:ring-[#ffa62b] overflow-hidden no-underline hover:bg-orange-600 transition-all" 
                  style={{ backgroundColor: '#ffa62b' }}
                >
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="absolute inset-0 rounded-full border-[3px] border-white"></div>
                  </div>
                  <span className="relative z-10 no-underline">Try Red Teaming</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 relative z-10"><path d="M13.172 11l-4.95-4.95a1 1 0 011.414-1.414l6.364 6.364a 1 1 0 010 1.414l-6.364 6.364a 1 1 0 01-1.414-1.414L13.172 13H4a1 1 0 110-2h9.172z" /></svg>
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              variants={item} 
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-md border-2 border-[#ffa62b]/20 hover:border-[#ffa62b]/50 transition-all hover:shadow-lg"
              whileHover={{ y: -3 }}
            >
              <div className="bg-[#ffa62b]/10 p-2.5 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-[#ffa62b]">
                  <path d="M21.721 12.752a9.711 9.711 0 00-.945-5.003 12.754 12.754 0 01-4.339 2.708 18.991 18.991 0 01-.214 4.772 17.165 17.165 0 005.498-2.477zM14.634 15.55a17.324 17.324 0 00.332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 00.332 4.647 17.385 17.385 0 005.268 0zM9.772 17.119a18.963 18.963 0 004.456 0A17.182 17.182 0 0112 21.724a17.18 17.18 0 01-2.228-4.605zM7.777 15.23a18.87 18.87 0 01-.214-4.774 12.753 12.753 0 01-4.34-2.708 9.711 9.711 0 00-.944 5.004 17.165 17.165 0 005.498 2.477zM21.356 14.752a9.765 9.765 0 01-7.478 6.817 18.64 18.64 0 001.988-4.718 18.627 18.627 0 005.49-2.098zM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 001.988 4.718 9.765 9.765 0 01-7.478-6.816zM13.878 2.43a9.755 9.755 0 016.116 3.986 11.267 11.267 0 01-3.746 2.504 18.63 18.63 0 00-2.37-6.49zM12 2.276a17.152 17.152 0 012.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0112 2.276zM10.122 2.43a18.629 18.629 0 00-2.37 6.49 11.266 11.266 0 01-3.746-2.504 9.754 9.754 0 016.116-3.985z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#ffa62b' }}>For AI Product Companies</h3>
              <p className="text-base mb-4 text-slate-600 font-medium leading-relaxed">
                Building tool-calling AI agents? Secure your product against data exfiltration vulnerabilities.
              </p>
              <Link 
                to="/api" 
                className="group relative flex items-center gap-2 rounded-full px-5 py-2.5 text-base font-bold text-white shadow-md focus-visible:ring-2 focus-visible:ring-[#ffa62b] overflow-hidden no-underline w-fit hover:bg-orange-600 transition-all" 
                style={{ backgroundColor: '#ffa62b' }}
              >
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="absolute inset-0 rounded-full border-[3px] border-white"></div>
                </div>
                <span className="relative z-10 no-underline">Try our API</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 relative z-10"><path d="M13.172 11l-4.95-4.95a1 1 0 011.414-1.414l6.364 6.364a 1 1 0 010 1.414l-6.364 6.364a1 1 0 01-1.414-1.414L13.172 13H4a1 1 0 110-2h9.172z" /></svg>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        <SecurityDiagram />

        {/* Problem Section – Agent Attack Flow */}
        <ProblemSection />

        {/* Solutions Section */}
        <SolutionsSection />

        {/* Blog Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="py-20 px-4"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Latest Insights</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Stay up-to-date with the latest security threats and protection strategies for AI tool-calling agents.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Link 
                to="/blog/jira-attack" 
                className="group bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-[#ffa62b]/10"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src="/gifs/jira-attack.gif" 
                    alt="Attack on Jira Atlassian MCP Server" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    decoding="async"
                    style={{ contentVisibility: 'auto' }}
                  />
                </div>
                <div className="p-6">
                  <div className="text-xs text-slate-500 mb-2">June 4, 2025</div>
                  <h3 className="text-xl font-bold mb-2 text-slate-900 group-hover:text-[#ffa62b] transition-colors">
                    Attack on Jira Atlassian MCP Server
                  </h3>
                  <p className="text-slate-600 mb-4">
                    How AI agents with tool-calling capabilities can be exploited to exfiltrate sensitive data from Jira through carefully crafted prompt injections.
                  </p>
                  <div className="flex items-center text-[#ffa62b] font-medium">
                    Read more
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-1">
                      <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </Link>
              
              <Link 
                to="/blog/zendesk-attack" 
                className="group bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-[#ffa62b]/10"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src="/gifs/zendesk-attack.gif" 
                    alt="Attack on Zendesk Support MCP Server" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    decoding="async"
                    style={{ contentVisibility: 'auto' }}
                  />
                </div>
                <div className="p-6">
                  <div className="text-xs text-slate-500 mb-2">June 4, 2025</div>
                  <h3 className="text-xl font-bold mb-2 text-slate-900 group-hover:text-[#ffa62b] transition-colors">
                    Attack on Zendesk Support MCP Server
                  </h3>
                  <p className="text-slate-600 mb-4">
                    How AI agents with tool-calling capabilities can be exploited to exfiltrate sensitive vulnerability information from Zendesk.
                  </p>
                  <div className="flex items-center text-[#ffa62b] font-medium">
                    Read more
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-1">
                      <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default LandingPageHero;
