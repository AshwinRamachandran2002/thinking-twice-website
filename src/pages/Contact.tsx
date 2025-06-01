import { motion } from "framer-motion";
import ContactForm from '@/components/ContactForm';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 py-20 px-4 font-sans text-slate-100">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.7}} className="text-center mb-14">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg mb-4">Contact & Demo</h1>
          <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto">We'd love to hear from you! Whether you want a personalized demo, early access, or have questions about agent security, fill out the form below and our team will get back to you promptly.</p>
        </motion.div>
        <div className="grid gap-10">
          <motion.section initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{delay:0.1, duration:0.6}} className="bg-slate-900/80 rounded-3xl shadow-2xl border border-cyan-900/30 px-8 py-10 mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-2 drop-shadow-lg text-center">Get a Demo</h2>
            <p className="text-slate-300 mb-6 text-center">Request a live walkthrough of ContextFort's security and observability platform for tool-calling agents. We'll tailor the demo to your use case.</p>
            <ContactForm />
          </motion.section>
          <motion.section initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{delay:0.2, duration:0.6}} className="bg-slate-900/80 rounded-3xl shadow-2xl border border-purple-900/30 px-8 py-10 mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent mb-2 drop-shadow-lg text-center">Schedule Demo</h2>
            <p className="text-slate-300 mb-6 text-center">Pick a time that works for you and our team will reach out to confirm your slot. Experience ContextFort in action.</p>
            <ContactForm />
          </motion.section>
          <motion.section initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{delay:0.3, duration:0.6}} className="bg-slate-900/80 rounded-3xl shadow-2xl border border-indigo-900/30 px-8 py-10">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2 drop-shadow-lg text-center">Contact Us</h2>
            <p className="text-slate-300 mb-6 text-center">Have a question, partnership inquiry, or want to discuss agent security? Reach out and we'll respond quickly.</p>
            <ContactForm />
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default Contact;
