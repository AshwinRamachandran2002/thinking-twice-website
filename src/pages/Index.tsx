import { motion } from "framer-motion";
import "@fontsource/inter";
import { FlowDiagram } from "../components/FlowDiagram";
import { Link } from "react-router-dom";

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
    <div className="relative min-h-screen overflow-hidden font-sans text-slate-100 selection:bg-cyan-500/30 selection:text-white" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800" />
      <motion.div
        initial={{ opacity: 0.4, scale: 1 }}
        animate={{ opacity: 0.75, scale: 1.15 }}
        transition={{ repeat: Infinity, repeatType: "mirror", duration: 12 }}
        className="absolute inset-0 -z-10 bg-gradient-to-tr from-indigo-700 via-purple-700 to-cyan-700 mix-blend-screen blur-3xl" />

      <header className="absolute top-0 left-0 z-30 flex w-full items-center justify-between p-6">
        <span className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent tracking-tight drop-shadow-lg select-none">ContextFort</span>
        <nav className="flex items-center gap-2 md:gap-4 text-sm font-medium">
          <Link to="/" className="rounded-lg px-4 py-2 transition-colors hover:bg-slate-700/40 focus-visible:ring-2 focus-visible:ring-cyan-400">Problem</Link>
          {/* <Link to="/blog" className="rounded-lg px-4 py-2 transition-colors hover:bg-slate-700/40 focus-visible:ring-2 focus-visible:ring-cyan-400">Blog</Link> */}
          <Link to="/team" className="rounded-lg px-4 py-2 transition-colors hover:bg-slate-700/40 focus-visible:ring-2 focus-visible:ring-cyan-400">Team</Link>
          <Link to="/contact" className="rounded-lg bg-white px-6 py-3 text-cyan-600 font-semibold shadow-lg hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-cyan-400 border border-cyan-100">Schedule Demo</Link>
        </nav>
      </header>

      <main className="relative z-20 flex min-h-screen flex-col items-center justify-center px-4 pt-32 md:pt-40">
        <motion.section variants={container} initial="hidden" animate="show" className="flex flex-col items-center space-y-5 text-center mb-14">
          <motion.div variants={item} className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/15 px-5 py-2 backdrop-blur-md">
            <span className="text-sm font-semibold text-orange-300">Backed by</span>
            <img decoding="async" src="https://framerusercontent.com/images/O703WMlgsx2KJikRoCbLUwT5hk.png" alt="" style={{display:'block',width:'110px',height:'23px',borderRadius:'inherit',objectPosition:'center',objectFit:'fill'}} />
          </motion.div>
          <motion.h1 variants={item} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight drop-shadow-lg">
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">Security & Observability</span><br />
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">for Tool-Calling Agents</span>
          </motion.h1>
          <motion.p variants={item} className="max-w-xl text-lg md:text-xl leading-relaxed text-slate-200">
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent font-semibold">Secure</span>&nbsp;AI agents against Data Exfiltration Attacks. <br/>Instantly gain&nbsp;
            <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-400 bg-clip-text text-transparent font-semibold">visibility and control</span>&nbsp;over every tool call.
          </motion.p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <Link to="/contact" className="flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 text-lg font-semibold text-white shadow-lg hover:bg-cyan-600 focus-visible:ring-2 focus-visible:ring-cyan-400">
              Get a Demo
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M13.172 11l-4.95-4.95a1 1 0 011.414-1.414l6.364 6.364a 1 1 0 010 1.414l-6.364 6.364a1 1 0 01-1.414-1.414L13.172 13H4a1 1 0 110-2h9.172z" /></svg>
            </Link>
            <a href="#solutions" className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-lg font-semibold text-cyan-600 shadow-lg hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-cyan-400 border border-cyan-100 sm:ml-4 sm:self-auto">
              Explore Product
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M13.172 11l-4.95-4.95a1 1 0 011.414-1.414l6.364 6.364a 1 1 0 010 1.414l-6.364 6.364a1 1 0 01-1.414-1.414L13.172 13H4a1 1 0 110-2h9.172z" /></svg>
            </a>
          </div>
        </motion.section>

        <div className="w-full flex justify-center items-center px-0 sm:px-4 md:px-8" style={{maxWidth:'100vw'}}>
          <FlowDiagram />
        </div>

        {/* Problem Section */}
        <section className="relative z-10 mt-20 w-full max-w-4xl rounded-3xl bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/60 shadow-2xl border border-orange-900/30 px-8 py-12 flex flex-col items-center text-center backdrop-blur-xl mb-10">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-400 via-yellow-400 to-red-400 bg-clip-text text-transparent mb-4 drop-shadow-lg">The Problem</h2>
          <p className="text-lg md:text-xl text-slate-200 max-w-2xl mb-8">
            Tool-calling agents are powerful—but they introduce new risks. <span className="font-semibold text-orange-300">Indirect prompt injection</span>, <span className="font-semibold text-orange-300">tool abuse</span>, and <span className="font-semibold text-orange-300">lack of visibility</span> can lead to data leaks, unauthorized actions, and security incidents. Most teams lack the tools to monitor, audit, and secure these agentic workflows.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <li className="bg-slate-800/70 rounded-2xl p-6 shadow-lg border border-orange-800/20">
              <span className="text-2xl font-bold text-orange-300">01</span>
              <div className="font-semibold text-slate-100 mt-2 mb-1">Prompt Injection</div>
              <div className="text-slate-300 text-sm">Attackers manipulate agent prompts to trigger unintended tool calls or data exfiltration.</div>
            </li>
            <li className="bg-slate-800/70 rounded-2xl p-6 shadow-lg border border-orange-800/20">
              <span className="text-2xl font-bold text-orange-300">02</span>
              <div className="font-semibold text-slate-100 mt-2 mb-1">Tool Abuse</div>
              <div className="text-slate-300 text-sm">Agents may invoke tools in unsafe ways, risking sensitive operations or compliance violations.</div>
            </li>
            <li className="bg-slate-800/70 rounded-2xl p-6 shadow-lg border border-orange-800/20">
              <span className="text-2xl font-bold text-orange-300">03</span>
              <div className="font-semibold text-slate-100 mt-2 mb-1">No Observability</div>
              <div className="text-slate-300 text-sm">Teams lack real-time insight into agent actions, making it hard to detect or respond to threats.</div>
            </li>
          </ul>
        </section>

        {/* Solutions Section */}
        <section id="solutions" className="relative z-10 w-full max-w-4xl rounded-3xl bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/60 shadow-2xl border border-cyan-900/30 px-8 py-12 flex flex-col items-center text-center backdrop-blur-xl mb-10">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4 drop-shadow-lg">Our Solutions</h2>
          <p className="text-lg md:text-xl text-slate-200 max-w-2xl mb-8">
            ContextFort delivers <span className="font-semibold text-cyan-300">real-time monitoring</span>, <span className="font-semibold text-cyan-300">security controls</span>, and <span className="font-semibold text-cyan-300">seamless integration</span> for agentic applications. Gain visibility, enforce policies, and protect your AI workflows from day one.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <li className="bg-slate-800/70 rounded-2xl p-6 shadow-lg border border-cyan-800/20">
              <span className="text-2xl font-bold text-cyan-300">01</span>
              <div className="font-semibold text-slate-100 mt-2 mb-1">Agent Observability</div>
              <div className="text-slate-300 text-sm">Track every tool call, prompt, and response. Instantly detect anomalies and threats.</div>
            </li>
            <li className="bg-slate-800/70 rounded-2xl p-6 shadow-lg border border-cyan-800/20">
              <span className="text-2xl font-bold text-cyan-300">02</span>
              <div className="font-semibold text-slate-100 mt-2 mb-1">Security Enforcement</div>
              <div className="text-slate-300 text-sm">Apply granular permissions, audit trails, and automated policy checks for every agent action.</div>
            </li>
            <li className="bg-slate-800/70 rounded-2xl p-6 shadow-lg border border-cyan-800/20">
              <span className="text-2xl font-bold text-cyan-300">03</span>
              <div className="font-semibold text-slate-100 mt-2 mb-1">Easy Integration</div>
              <div className="text-slate-300 text-sm">Plug ContextFort into your stack with SDKs, APIs, and no-code options—no friction, just results.</div>
            </li>
          </ul>
        </section>

      </main>
    </div>
  );
};

export default LandingPageHero;
