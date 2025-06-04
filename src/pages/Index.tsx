import { motion } from "framer-motion";
import "@fontsource/inter";
import { SecurityDiagram } from "../components/SecurityDiagram";
import { Link } from "react-router-dom";
import { MiniAgentInflowDiagram } from "../components/MiniAgentInflowDiagram";
import { MiniAgentHijackDiagram, MiniAgentOutflowDiagram } from "../components/MiniAgentHijackDiagram";
import { MiniContextFortSolutionDiagram } from "../components/MiniContextFortSolutionDiagram";
import Navbar from "../components/Navbar";
import devilImg from "../assets/devil.svg";

/**************************************************************************
 *  LandingPageHero – unchanged except FlowDiagram now responsive
 **************************************************************************/
const LandingPageHero = () => {
  const container = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.12, duration: 0.8, ease: "easeOut" },
    },
  };
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="relative min-h-screen overflow-hidden font-sans text-slate-700 selection:bg-[#ffa62b]/30 selection:text-slate-900" style={{ fontFamily: "Gellix, Inter, sans-serif", backgroundColor: '#fef9f3', fontWeight: 'bold' }}>
      {/* Muted mango background with subtle gradient */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_60%_20%,rgba(255,166,43,0.12),transparent_60%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_80%,rgba(255,166,43,0.08),transparent_50%)]" />

      <Navbar />

      <main className="relative z-20 flex min-h-screen flex-col items-center justify-center px-4 pt-32 md:pt-40">
        <motion.section variants={container} initial="hidden" animate="show" className="flex flex-col items-center space-y-5 text-center mb-14">
          <motion.div variants={item} className="inline-flex items-center gap-2 rounded-full border border-[#ffa62b]/30 bg-[#ffa62b]/10 px-5 py-2 backdrop-blur-md">
            <span className="text-sm font-bold">Backed by</span>
            <img decoding="async" src="https://framerusercontent.com/images/O703WMlgsx2KJikRoCbLUwT5hk.png" alt="" style={{display:'block',width:'110px',height:'23px',objectPosition:'center',objectFit:'fill'}} />
          </motion.div>
          <motion.h1 variants={item} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight drop-shadow-sm text-black">
            <span style={{ color: '#ffa62b' }}>Security & Observability</span><br />
            <span className="text-black">for Tool-Calling Agents</span>
          </motion.h1>
          <motion.p variants={item} className="max-w-xl text-lg md:text-xl leading-relaxed text-slate-600 font-medium">
            <span className="font-bold" style={{ color: '#ffa62b' }}>Secure</span>&nbsp;AI agents against Data Exfiltration Attacks. <br/>Instantly gain&nbsp;
            <span className="font-bold" style={{ color: '#ffa62b' }}>visibility and control</span>&nbsp;over every tool call.
          </motion.p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <Link 
              to="/proxy" 
              className="group relative flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm px-6 py-3 text-lg font-bold text-black shadow-md focus-visible:ring-2 focus-visible:ring-[#ffa62b] transition-all duration-300 overflow-hidden no-underline"
            >
              {/* Animated border */}
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 rounded-full border-[3px] border-[#ffa62b] animate-border-draw"></div>
              </div>
              <span className="relative z-10 no-underline">Try our Product</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 relative z-10"><path d="M13.172 11l-4.95-4.95a1 1 0 011.414-1.414l6.364 6.364a 1 1 0 010 1.414l-6.364 6.364a1 1 0 01-1.414-1.414L13.172 13H4a1 1 0 110-2h9.172z" /></svg>
            </Link>
          <Link 
            to="/contact" 
            className="group relative flex items-center gap-2 rounded-full px-6 py-3 text-lg font-bold text-white shadow-md focus-visible:ring-2 focus-visible:ring-[#ffa62b] transition-all duration-300 overflow-hidden no-underline" 
            style={{ backgroundColor: '#ffa62b' }}
          >
            {/* Animated border for solid button */}
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 rounded-full border-[3px] border-white animate-border-glow"></div>
            </div>
            <span className="relative z-10 no-underline">Get a Demo</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 relative z-10"><path d="M13.172 11l-4.95-4.95a1 1 0 011.414-1.414l6.364 6.364a 1 1 0 010 1.414l-6.364 6.364a1 1 0 01-1.414-1.414L13.172 13H4a1 1 0 110-2h9.172z" /></svg>
          </Link>
        </div>
        </motion.section>

        <SecurityDiagram />


        {/* Problem Section – Agent Attack Flow */}
        <section className="relative z-10 mt-20 w-full max-w-5xl rounded-3xl bg-white shadow-lg border border-[#ffa62b]/20 px-4 py-12 flex flex-col items-center text-center backdrop-blur-xl mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-8 drop-shadow-sm" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>How Agents Get <span style={{ color: '#ffa62b' }}>Hijacked</span></h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full">
            {/* Step 1: Malicious Context In */}
            <div className="flex flex-col items-center w-full md:w-1/3">
              <MiniAgentInflowDiagram />
              <div className="mt-4 font-bold" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>1. Malicious context enters via integrations</div>
            </div>
            {/* Step 2: Agent Hijacked */}
            <div className="flex flex-col items-center w-full md:w-1/3">
              <MiniAgentHijackDiagram />
              <div className="mt-4 font-bold" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>2. Agent logic is hijacked</div>
            </div>
            {/* Step 3: Malicious Actions Out */}
            <div className="flex flex-col items-center w-full md:w-1/3">
              <MiniAgentOutflowDiagram />
              <div className="mt-4 font-bold" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>3. Malicious actions sent to integrations</div>
            </div>
          </div>
          {/* Example Attack GIFs */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full mt-8">
            {/* Hubspot Lead Attack GIF */}
            <div className="flex flex-col items-center w-full md:w-1/2">
              <div className="w-44 h-44 bg-[#ffa62b]/10 rounded-2xl flex items-center justify-center border border-[#ffa62b]/20 mb-2 overflow-hidden shadow-md">
                {/* TODO: Insert Hubspot GIF here */}
                <span className="text-slate-500 text-sm font-medium" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>[Hubspot Lead Attack GIF]</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <img src={devilImg} alt="devil" className="w-5 h-5" />
                <span className="font-bold text-sm" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>Hubspot Lead → Leak Other Leads (Hubspot)</span>
              </div>
            </div>
            {/* Jira Ticket Attack GIF */}
            <div className="flex flex-col items-center w-full md:w-1/2">
              <div className="w-44 h-44 bg-[#ffa62b]/10 rounded-2xl flex items-center justify-center border border-[#ffa62b]/20 mb-2 overflow-hidden shadow-md">
                {/* TODO: Insert Jira GIF here */}
                <span className="text-slate-500 text-sm font-medium" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>[Jira Ticket Attack GIF]</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <img src={devilImg} alt="devil" className="w-5 h-5" />
                <span className="font-bold text-sm" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>Jira Ticket → Leak Workday Information</span>
              </div>
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section id="solutions" className="relative z-10 w-full max-w-4xl rounded-3xl bg-white shadow-lg border border-[#ffa62b]/20 px-8 py-12 flex flex-col items-center text-center backdrop-blur-xl mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 drop-shadow-sm" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>Our <span style={{ color: '#ffa62b' }}>Solutions</span></h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-8 font-medium" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>
            ContextFort delivers <span className="font-bold" style={{ color: '#ffa62b' }}>real-time monitoring</span>, <span className="font-bold text-black">security controls</span>, and <span className="font-bold text-black">seamless integration</span> for agentic applications. Gain visibility, enforce policies, and protect your AI workflows from day one.
          </p>
          <div className="flex justify-center mb-10">
            <MiniContextFortSolutionDiagram />
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <li className="bg-[#ffa62b]/10 rounded-2xl p-6 shadow-md border border-[#ffa62b]/20 hover:border-[#ffa62b]/40 hover:bg-[#ffa62b]/20 transition-all duration-300">
              <span className="text-2xl font-bold" style={{ color: '#ffa62b', fontFamily: "Gellix, Inter, sans-serif" }}>01</span>
              <div className="font-bold text-black mt-2 mb-1" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>Agent Observability</div>
              <div className="text-slate-600 text-sm font-medium" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>Track every tool call, prompt, and response. Instantly detect anomalies and threats.</div>
            </li>
            <li className="bg-[#ffa62b]/10 rounded-2xl p-6 shadow-md border border-[#ffa62b]/20 hover:border-[#ffa62b]/40 hover:bg-[#ffa62b]/20 transition-all duration-300">
              <span className="text-2xl font-bold text-black" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>02</span>
              <div className="font-bold text-black mt-2 mb-1" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>Security Enforcement</div>
              <div className="text-slate-600 text-sm font-medium" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>Apply granular permissions, audit trails, and automated policy checks for every agent action.</div>
            </li>
            <li className="bg-[#ffa62b]/10 rounded-2xl p-6 shadow-md border border-[#ffa62b]/20 hover:border-[#ffa62b]/40 hover:bg-[#ffa62b]/20 transition-all duration-300">
              <span className="text-2xl font-bold" style={{ color: '#ffa62b', fontFamily: "Gellix, Inter, sans-serif" }}>03</span>
              <div className="font-bold text-black mt-2 mb-1" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>Easy Integration</div>
              <div className="text-slate-600 text-sm font-medium" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>Plug ContextFort into your stack with SDKs, APIs, and no-code options—no friction, just results.</div>
            </li>
          </ul>
        </section>

      </main>
      
    </div>
  );
};

export default LandingPageHero;
