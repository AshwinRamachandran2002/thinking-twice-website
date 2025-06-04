import { motion } from "framer-motion";
import ContactForm from '@/components/ContactForm';
import Navbar from '../components/Navbar';

const Contact = () => {
  return (
    <div className="relative min-h-screen overflow-hidden font-sans text-slate-700 selection:bg-[#ffa62b]/30 selection:text-slate-900" style={{ fontFamily: "Gellix, Inter, sans-serif", backgroundColor: '#fef9f3', fontWeight: 'bold' }}>

      <Navbar />

      <main className="relative z-20 flex min-h-screen flex-col items-center px-4 pt-32 md:pt-40">
        <motion.div 
          initial={{opacity:0, y:20}} 
          animate={{opacity:1, y:0}} 
          transition={{duration:0.7}} 
          className="text-center mb-14 max-w-3xl"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#ffa62b] mb-4 drop-shadow-sm">Contact & Demo</h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">We'd love to hear from you! Whether you want a personalized demo, early access, or have questions about agent security, fill out the form below and our team will get back to you promptly.</p>
        </motion.div>

        <div className="grid gap-10 w-full max-w-4xl mb-20">
          <motion.section 
            initial={{opacity:0, y:30}} 
            animate={{opacity:1, y:0}} 
            transition={{delay:0.1, duration:0.6}} 
            className="bg-white rounded-3xl shadow-lg border border-[#ffa62b]/20 px-8 py-10 mb-6"
          >
            <h2 className="text-3xl font-bold text-[#ffa62b] mb-4 drop-shadow-sm text-center">Get a Demo</h2>
            <p className="text-slate-600 mb-8 text-center">Request a live walkthrough of ContextFort's security and observability platform for tool-calling agents. We'll tailor the demo to your use case.</p>
            <ContactForm />
          </motion.section>
        </div>

        {/* Footer accent */}
        <div className="mb-20 flex justify-center">
          <div className="w-24 h-1 bg-[#ffa62b] rounded-full opacity-30"></div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
