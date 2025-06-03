import { motion } from "framer-motion";
import ContactForm from '@/components/ContactForm';
import { Link } from "react-router-dom";

const Contact = () => {
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
            <Link to="/team" className="rounded-lg px-4 py-2 transition-colors hover:bg-teal-100/70 hover:text-teal-700 focus-visible:ring-2 focus-visible:ring-teal-500 font-semibold text-slate-700 border border-transparent hover:border-teal-200">Team</Link>
            <Link to="/contact" className="rounded-lg bg-gradient-to-r from-teal-500 to-slate-600 px-6 py-3 text-white font-semibold shadow-md hover:from-teal-600 hover:to-slate-700 focus-visible:ring-2 focus-visible:ring-teal-400 border border-teal-400/30 transform transition-all duration-300 hover:scale-105">Schedule Demo</Link>
          </nav>
        </div>
      </header>

      <main className="relative z-20 flex min-h-screen flex-col items-center px-4 pt-32 md:pt-40">
        <motion.div 
          initial={{opacity:0, y:20}} 
          animate={{opacity:1, y:0}} 
          transition={{duration:0.7}} 
          className="text-center mb-14 max-w-3xl"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-teal-500 via-slate-600 to-slate-700 bg-clip-text text-transparent mb-4 drop-shadow-sm">Contact & Demo</h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">We'd love to hear from you! Whether you want a personalized demo, early access, or have questions about agent security, fill out the form below and our team will get back to you promptly.</p>
        </motion.div>

        <div className="grid gap-10 w-full max-w-4xl mb-20">
          <motion.section 
            initial={{opacity:0, y:30}} 
            animate={{opacity:1, y:0}} 
            transition={{delay:0.1, duration:0.6}} 
            className="bg-white rounded-3xl shadow-lg border border-teal-200/30 px-8 py-10 mb-6"
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-500 via-slate-600 to-slate-700 bg-clip-text text-transparent mb-4 drop-shadow-sm text-center">Get a Demo</h2>
            <p className="text-slate-600 mb-8 text-center">Request a live walkthrough of ContextFort's security and observability platform for tool-calling agents. We'll tailor the demo to your use case.</p>
            <ContactForm />
          </motion.section>
        </div>

        {/* Footer accent */}
        <div className="mb-20 flex justify-center">
          <div className="w-24 h-1 bg-gradient-to-r from-slate-400 via-teal-400 to-slate-400 rounded-full opacity-30"></div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
