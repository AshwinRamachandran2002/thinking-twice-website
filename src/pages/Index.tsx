import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "@fontsource/inter";
import { FlowDiagram } from "../components/FlowDiagram";

/**************************************************************************
 *  LandingPageHero – unchanged except FlowDiagram now responsive
 **************************************************************************/
const LandingPageHero = () => {
  const navigate = useNavigate();
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
          {[
            { label: "Problem", href: "/" },
            { label: "Blog", href: "/" },
            { label: "Product", href: "/about" },
            { label: "Team", href: "/contact" },
          ].map((l) => (
            <button key={l.label} onClick={() => navigate(l.href)} className="rounded-lg px-4 py-2 transition-colors hover:bg-slate-700/40 focus-visible:ring-2 focus-visible:ring-cyan-400">{l.label}</button>
          ))}
          <button onClick={() => navigate("/schedule-demo")} className="rounded-lg bg-white px-6 py-3 text-cyan-600 font-semibold shadow-lg hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-cyan-400 border border-cyan-100">Schedule Demo</button>
        </nav>
      </header>

      <main className="relative z-20 flex min-h-screen flex-col items-center justify-center px-4 pt-32 md:pt-40">
        <motion.section variants={container} initial="hidden" animate="show" className="flex flex-col items-center space-y-8 text-center mb-14">
          <motion.div variants={item} className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/15 px-5 py-2 backdrop-blur-md">
            <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" className="text-orange-400"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="text-sm font-semibold text-orange-300">Backed by Y Combinator</span>
          </motion.div>
          <motion.h1 variants={item} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight drop-shadow-lg">
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">Security & Observability</span><br />
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">for Tool-Calling Agents</span>
          </motion.h1>
          <motion.p variants={item} className="max-w-xl text-lg md:text-xl leading-relaxed text-slate-200">
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent font-semibold">Monitor and secure</span>&nbsp;AI agents with confidence. <br/>Instantly gain&nbsp;
            <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-400 bg-clip-text text-transparent font-semibold">visibility and control</span>&nbsp;over every tool call.
          </motion.p>
          <motion.button variants={item} onClick={() => navigate("/get-started")} className="flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 text-lg font-semibold text-white shadow-lg hover:bg-cyan-600 focus-visible:ring-2 focus-visible:ring-cyan-400">Get Started
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M13.172 11l-4.95-4.95a1 1 0 011.414-1.414l6.364 6.364a 1 1 0 010 1.414l-6.364 6.364a1 1 0 01-1.414-1.414L13.172 13H4a1 1 0 110-2h9.172z" /></svg>
          </motion.button>
        </motion.section>

        <div className="w-full flex justify-center items-center px-0 sm:px-4 md:px-8" style={{maxWidth:'100vw'}}>
          <FlowDiagram />
        </div>

        {/* Product Section */}
        <section className="relative z-10 mt-20 w-full max-w-4xl rounded-3xl bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/60 shadow-2xl border border-cyan-900/30 px-8 py-12 flex flex-col items-center text-center backdrop-blur-xl">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4 drop-shadow-lg">Our Product</h2>
          <p className="text-lg md:text-xl text-slate-200 max-w-2xl mb-8">
            some randomdescription
          </p>
          <div className="flex flex-col md:flex-row gap-8 w-full justify-center">
            <div className="flex-1 bg-slate-800/70 rounded-2xl p-6 shadow-lg border border-cyan-800/20">
              <h3 className="text-xl font-semibold text-cyan-300 mb-2">Real-time Monitoring</h3>
              <p className="text-slate-300">Track every tool call and agent action as it happens, with instant alerts and deep analytics.</p>
            </div>
            <div className="flex-1 bg-slate-800/70 rounded-2xl p-6 shadow-lg border border-purple-800/20">
              <h3 className="text-xl font-semibold text-purple-300 mb-2">Security Controls</h3>
              <p className="text-slate-300">Enforce granular permissions, audit trails, and policy-based access for all your AI agents.</p>
            </div>
            <div className="flex-1 bg-slate-800/70 rounded-2xl p-6 shadow-lg border border-indigo-800/20">
              <h3 className="text-xl font-semibold text-indigo-300 mb-2">Seamless Integration</h3>
              <p className="text-slate-300">Plug ContextFort into your stack with minimal effort—SDKs, APIs, and no-code options available.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPageHero;
