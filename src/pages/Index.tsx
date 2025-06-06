import { motion } from "framer-motion";
import "@fontsource/inter";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { lazy, Suspense } from "react";
import { useScrollOptimization } from "../hooks/use-scroll-optimization";
import { ProblemSection } from "../components/ProblemSection";
import { SolutionsSection } from "../components/SolutionsSection";

// Lazy load heavy components
const SecurityDiagram = lazy(() => import("../components/SecurityDiagram").then(module => ({
  default: module.SecurityDiagram
})));

const LandingPageHero = () => {
  const { scrollClass } = useScrollOptimization();
  
  const container = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.08, duration: 0.5, ease: "easeOut" },
    },
  };
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <div className={`relative min-h-screen overflow-hidden font-sans text-slate-700 selection:bg-[#ffa62b]/30 selection:text-slate-900 ${scrollClass}`} style={{ fontFamily: "Gellix, Inter, sans-serif", backgroundColor: '#fef9f3', fontWeight: 'bold' }}>
      {/* Simplified background without complex gradients */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50" />
      <div className="absolute inset-0 -z-10 opacity-30"></div>

      <Navbar />

      <main className="relative z-20 flex min-h-screen flex-col items-center justify-center px-4 pt-32 md:pt-40">
        <motion.section variants={container} initial="hidden" animate="show" className="flex flex-col items-center space-y-5 text-center mb-14">
          <motion.div variants={item} className="inline-flex items-center gap-2 rounded-full border border-[#ffa62b]/30 bg-[#ffa62b]/10 px-5 py-2 backdrop-blur-md">
            <span className="text-sm font-bold">Backed by</span>
            <img decoding="async" src="https://framerusercontent.com/images/O703WMlgsx2KJikRoCbLUwT5hk.png" alt="" style={{display:'block',width:'110px',height:'23px',objectPosition:'center',objectFit:'fill'}} />
          </motion.div>
          <motion.h1 variants={item} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight drop-shadow-sm text-black">
            <span style={{ color: '#ffa62b' }}>Prompt Injection Protection</span><br />
            <span className="text-black">for AI Agents</span>
          </motion.h1>
          <motion.p variants={item} className="max-w-xl text-lg md:text-xl leading-relaxed text-slate-600 font-medium">
            <span className="font-bold" style={{ color: '#ffa62b' }}>Secure</span>&nbsp;AI agents against Data Exfiltration Attacks. <br/>Instantly gain&nbsp;
            <span className="font-bold" style={{ color: '#ffa62b' }}>visibility and control</span>&nbsp;over every tool call.
          </motion.p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <Link 
              to="/proxy" 
              className="group relative flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm px-6 py-3 text-lg font-bold text-black shadow-md focus-visible:ring-2 focus-visible:ring-[#ffa62b] overflow-hidden no-underline"
            >
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="absolute inset-0 rounded-full border-[3px] border-[#ffa62b]"></div>
              </div>
              <span className="relative z-10 no-underline">See our proxy live</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 relative z-10"><path d="M13.172 11l-4.95-4.95a1 1 0 011.414-1.414l6.364 6.364a1 1 0 010 1.414l-6.364 6.364a1 1 0 01-1.414-1.414L13.172 13H4a1 1 0 110-2h9.172z" /></svg>
            </Link>
            <Link 
              to="/docs" 
              className="group relative flex items-center gap-2 rounded-full px-6 py-3 text-lg font-bold text-white shadow-md focus-visible:ring-2 focus-visible:ring-[#ffa62b] overflow-hidden no-underline" 
              style={{ backgroundColor: '#ffa62b' }}
            >
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="absolute inset-0 rounded-full border-[3px] border-white"></div>
              </div>
              <span className="relative z-10 no-underline">Try our API</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 relative z-10"><path d="M13.172 11l-4.95-4.95a1 1 0 011.414-1.414l6.364 6.364a 1 1 0 010 1.414l-6.364 6.364a1 1 0 01-1.414-1.414L13.172 13H4a1 1 0 110-2h9.172z" /></svg>
            </Link>
          </div>
        </motion.section>

        <Suspense fallback={<div className="w-full h-32 flex items-center justify-center">
          <div className="text-slate-500">Loading diagram...</div>
        </div>}>
          <SecurityDiagram />
        </Suspense>

        {/* Problem Section – Agent Attack Flow */}
        <ProblemSection />

        {/* Solutions Section */}
        <SolutionsSection />

        {/* Blog Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
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
