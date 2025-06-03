import { motion } from "framer-motion";
import "@fontsource/inter";
import { FlowDiagram } from "../components/FlowDiagram";
import { Link } from "react-router-dom";
import { MiniAgentInflowDiagram } from "../components/MiniAgentInflowDiagram";
import { MiniAgentHijackDiagram, MiniAgentOutflowDiagram } from "../components/MiniAgentHijackDiagram";
import { MiniContextFortSolutionDiagram } from "../components/MiniContextFortSolutionDiagram";
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
    <div className="relative min-h-screen overflow-hidden font-sans text-slate-700 selection:bg-teal-500/30 selection:text-slate-900" style={{ fontFamily: "Inter, sans-serif", backgroundColor: '#f7f9fa' }}>
      {/* Light, sophisticated background with subtle gradient */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-gray-100 via-gray-50 to-slate-100" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_60%_20%,rgba(45,212,191,0.08),transparent_60%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_80%,rgba(94,234,212,0.06),transparent_50%)]" />

      <header className="fixed top-0 left-0 right-0 z-50 flex w-full items-center justify-center p-4 backdrop-blur-md bg-white/70 shadow-sm transition-all duration-300">
        <div className="container max-w-6xl mx-auto flex justify-between items-center">
          <span className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-teal-500 via-slate-600 to-slate-700 bg-clip-text text-transparent tracking-tight drop-shadow-sm select-none">ContextFort</span>
          <nav className="flex items-center gap-2 md:gap-4 text-sm font-medium">
            <Link to="/" className="rounded-lg px-4 py-2 transition-colors hover:bg-teal-100/70 hover:text-teal-700 focus-visible:ring-2 focus-visible:ring-teal-500 font-semibold text-slate-700 border border-transparent hover:border-teal-200">Problem</Link>
            {/* <Link to="/blog" className="rounded-lg px-4 py-2 transition-colors hover:bg-teal-100/70 hover:text-teal-700 focus-visible:ring-2 focus-visible:ring-teal-500">Blog</Link> */}
            <Link to="/team" className="rounded-lg px-4 py-2 transition-colors hover:bg-teal-100/70 hover:text-teal-700 focus-visible:ring-2 focus-visible:ring-teal-500 font-semibold text-slate-700 border border-transparent hover:border-teal-200">Team</Link>
            <Link to="/contact" className="rounded-lg bg-gradient-to-r from-teal-500 to-slate-600 px-6 py-3 text-white font-semibold shadow-md hover:from-teal-600 hover:to-slate-700 focus-visible:ring-2 focus-visible:ring-teal-400 border border-teal-400/30 transform transition-all duration-300 hover:scale-105">Schedule Demo</Link>
          </nav>
        </div>
      </header>

      <main className="relative z-20 flex min-h-screen flex-col items-center justify-center px-4 pt-32 md:pt-40">
        <motion.section variants={container} initial="hidden" animate="show" className="flex flex-col items-center space-y-5 text-center mb-14">
          <motion.div variants={item} className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-50 px-5 py-2 backdrop-blur-md">
            <span className="text-sm font-semibold text-teal-600">Backed by</span>
            <img decoding="async" src="https://framerusercontent.com/images/O703WMlgsx2KJikRoCbLUwT5hk.png" alt="" style={{display:'block',width:'110px',height:'23px',borderRadius:'inherit',objectPosition:'center',objectFit:'fill'}} />
          </motion.div>
          <motion.h1 variants={item} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight drop-shadow-sm">
            <span className="bg-gradient-to-r from-teal-500 via-slate-600 to-slate-700 bg-clip-text text-transparent">Security & Observability</span><br />
            <span className="bg-gradient-to-r from-slate-600 via-teal-500 to-slate-700 bg-clip-text text-transparent">for Tool-Calling Agents</span>
          </motion.h1>
          <motion.p variants={item} className="max-w-xl text-lg md:text-xl leading-relaxed text-slate-600">
            <span className="bg-gradient-to-r from-teal-500 via-slate-600 to-slate-700 bg-clip-text text-transparent font-semibold">Secure</span>&nbsp;AI agents against Data Exfiltration Attacks. <br/>Instantly gain&nbsp;
            <span className="bg-gradient-to-r from-slate-600 via-teal-500 to-slate-700 bg-clip-text text-transparent font-semibold">visibility and control</span>&nbsp;over every tool call.
          </motion.p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <Link to="/contact" className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-500 to-slate-600 px-6 py-3 text-lg font-semibold text-white shadow-md hover:from-teal-600 hover:to-slate-700 focus-visible:ring-2 focus-visible:ring-teal-400 transform transition-all duration-300 hover:scale-105">
              Get a Demo
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M13.172 11l-4.95-4.95a1 1 0 011.414-1.414l6.364 6.364a 1 1 0 010 1.414l-6.364 6.364a1 1 0 01-1.414-1.414L13.172 13H4a1 1 0 110-2h9.172z" /></svg>
            </Link>
            <a href="#solutions" className="flex items-center gap-2 rounded-lg bg-white/80 backdrop-blur-sm border border-teal-200 px-6 py-3 text-lg font-semibold text-slate-600 shadow-md hover:bg-teal-50 focus-visible:ring-2 focus-visible:ring-teal-400 sm:ml-4 sm:self-auto transform transition-all duration-300 hover:scale-105">
              Explore Product
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M13.172 11l-4.95-4.95a1 1 0 011.414-1.414l6.364 6.364a 1 1 0 010 1.414l-6.364 6.364a1 1 0 01-1.414-1.414L13.172 13H4a1 1 0 110-2h9.172z" /></svg>
            </a>
          </div>
        </motion.section>

        <div className="w-full flex justify-center items-center px-0 sm:px-4 md:px-8" style={{maxWidth:'100vw'}}>
          <FlowDiagram />
        </div>

        {/* Problem Section – Agent Attack Flow */}
        <section className="relative z-10 mt-20 w-full max-w-5xl rounded-3xl bg-white shadow-lg border border-gray-200 px-4 py-12 flex flex-col items-center text-center backdrop-blur-xl mb-10">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent mb-8 drop-shadow-sm">How Agents Get Hijacked</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full">
            {/* Step 1: Malicious Context In */}
            <div className="flex flex-col items-center w-full md:w-1/3">
              <MiniAgentInflowDiagram />
              <div className="mt-4 text-amber-600 font-semibold">1. Malicious context enters via integrations</div>
            </div>
            {/* Step 2: Agent Hijacked */}
            <div className="flex flex-col items-center w-full md:w-1/3">
              <MiniAgentHijackDiagram />
              <div className="mt-4 text-orange-600 font-semibold">2. Agent logic is hijacked</div>
            </div>
            {/* Step 3: Malicious Actions Out */}
            <div className="flex flex-col items-center w-full md:w-1/3">
              <MiniAgentOutflowDiagram />
              <div className="mt-4 text-amber-600 font-semibold">3. Malicious actions sent to integrations</div>
            </div>
          </div>
          {/* Example Attack GIFs */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full mt-8">
            {/* Hubspot Lead Attack GIF */}
            <div className="flex flex-col items-center w-full md:w-1/2">
              <div className="w-44 h-44 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-200 mb-2 overflow-hidden shadow-md">
                {/* TODO: Insert Hubspot GIF here */}
                <span className="text-slate-500 text-sm">[Hubspot Lead Attack GIF]</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <img src={devilImg} alt="devil" className="w-5 h-5" />
                <span className="text-amber-600 font-semibold text-sm">Hubspot Lead → Leak Other Leads (Hubspot)</span>
              </div>
            </div>
            {/* Jira Ticket Attack GIF */}
            <div className="flex flex-col items-center w-full md:w-1/2">
              <div className="w-44 h-44 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-200 mb-2 overflow-hidden shadow-md">
                {/* TODO: Insert Jira GIF here */}
                <span className="text-slate-500 text-sm">[Jira Ticket Attack GIF]</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <img src={devilImg} alt="devil" className="w-5 h-5" />
                <span className="text-amber-600 font-semibold text-sm">Jira Ticket → Leak Workday Information</span>
              </div>
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section id="solutions" className="relative z-10 w-full max-w-4xl rounded-3xl bg-white shadow-lg border border-gray-200 px-8 py-12 flex flex-col items-center text-center backdrop-blur-xl mb-10">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-500 via-slate-600 to-slate-700 bg-clip-text text-transparent mb-4 drop-shadow-sm">Our Solutions</h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-8">
            ContextFort delivers <span className="font-semibold text-teal-600">real-time monitoring</span>, <span className="font-semibold text-slate-700">security controls</span>, and <span className="font-semibold text-slate-600">seamless integration</span> for agentic applications. Gain visibility, enforce policies, and protect your AI workflows from day one.
          </p>
          <div className="flex justify-center mb-10">
            <MiniContextFortSolutionDiagram />
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <li className="bg-gray-50 rounded-2xl p-6 shadow-md border border-teal-100 hover:border-teal-300 hover:bg-teal-50 transition-all duration-300">
              <span className="text-2xl font-bold text-teal-500">01</span>
              <div className="font-semibold text-slate-700 mt-2 mb-1">Agent Observability</div>
              <div className="text-slate-600 text-sm">Track every tool call, prompt, and response. Instantly detect anomalies and threats.</div>
            </li>
            <li className="bg-gray-50 rounded-2xl p-6 shadow-md border border-teal-100 hover:border-teal-300 hover:bg-teal-50 transition-all duration-300">
              <span className="text-2xl font-bold text-slate-600">02</span>
              <div className="font-semibold text-slate-700 mt-2 mb-1">Security Enforcement</div>
              <div className="text-slate-600 text-sm">Apply granular permissions, audit trails, and automated policy checks for every agent action.</div>
            </li>
            <li className="bg-gray-50 rounded-2xl p-6 shadow-md border border-teal-100 hover:border-teal-300 hover:bg-teal-50 transition-all duration-300">
              <span className="text-2xl font-bold text-teal-500">03</span>
              <div className="font-semibold text-slate-700 mt-2 mb-1">Easy Integration</div>
              <div className="text-slate-600 text-sm">Plug ContextFort into your stack with SDKs, APIs, and no-code options—no friction, just results.</div>
            </li>
          </ul>
        </section>

      </main>
    </div>
  );
};

export default LandingPageHero;
