// filepath: /home/ashwin/Desktop/thinking-twice-website/src/pages/blog/ZendeskAttack.tsx
import { motion, useScroll, useSpring } from "framer-motion";
import Navbar from '../../components/Navbar';
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const ZendeskAttack = () => {
  // For reading progress indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  // For table of contents
  const [activeSection, setActiveSection] = useState("");
  const sectionsRef = useRef({});
  
  // For image gallery
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const totalImages = 6; // For Zendesk attack images
  
  // Register sections for intersection observer
  useEffect(() => {
    const sectionElements = document.querySelectorAll('[data-section]');
    const observerOptions = {
      rootMargin: '-100px 0px -70% 0px',
      threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.getAttribute('data-section'));
        }
      });
    }, observerOptions);
    
    sectionElements.forEach(section => {
      observer.observe(section);
      const sectionId = section.getAttribute('data-section');
      sectionsRef.current[sectionId] = section;
    });
    
    return () => observer.disconnect();
  }, []);
  
  // Scroll to section
  const scrollToSection = (sectionId) => {
    const section = sectionsRef.current[sectionId];
    if (section) {
      const topOffset = 100; // Adjust based on your navbar height
      const sectionTop = section.getBoundingClientRect().top + window.pageYOffset - topOffset;
      window.scrollTo({ top: sectionTop, behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };
  
  // Image gallery navigation
  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % totalImages);
  };
  
  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  return (
    <div className="relative min-h-screen overflow-hidden font-sans text-slate-700 selection:bg-[#ffa62b]/30 selection:text-slate-900" style={{ fontFamily: "Gellix, Inter, sans-serif", backgroundColor: '#fafafa', fontWeight: 'normal' }}>
      {/* Subtle background */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-white via-gray-50 to-white" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_60%_20%,rgba(255,166,43,0.08),transparent_70%)]" />
      
      {/* Reading progress bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-[#ffa62b] z-50"
        style={{ scaleX, transformOrigin: '0%' }}
      />
      
      <Navbar />
      
      <div className="py-20 px-4 mt-12">
        <div className="max-w-7xl mx-auto">
          <Link to="/blog" className="inline-flex items-center text-[#ffa62b] hover:text-[#e08c1a] mb-8 transition-colors duration-200 group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Blog
          </Link>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sticky table of contents - desktop */}
            <aside className="hidden lg:block sticky top-32 h-fit w-64 flex-shrink-0 self-start">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Contents</h2>
                <nav className="space-y-2 text-sm">
                  <a 
                    onClick={() => scrollToSection('overview')} 
                    className={`block py-2 px-4 rounded-lg cursor-pointer transition-colors duration-200 ${activeSection === 'overview' ? 'bg-[#ffa62b]/10 text-[#ffa62b] font-medium' : 'hover:bg-gray-50'}`}
                  >
                    Overview
                  </a>
                  <a 
                    onClick={() => scrollToSection('attack-scenario')} 
                    className={`block py-2 px-4 rounded-lg cursor-pointer transition-colors duration-200 ${activeSection === 'attack-scenario' ? 'bg-[#ffa62b]/10 text-[#ffa62b] font-medium' : 'hover:bg-gray-50'}`}
                  >
                    The Attack Scenario
                  </a>
                  <a 
                    onClick={() => scrollToSection('concerns')} 
                    className={`block py-2 px-4 rounded-lg cursor-pointer transition-colors duration-200 ${activeSection === 'concerns' ? 'bg-[#ffa62b]/10 text-[#ffa62b] font-medium' : 'hover:bg-gray-50'}`}
                  >
                    Why It's Concerning
                  </a>
                  <a 
                    onClick={() => scrollToSection('real-world')} 
                    className={`block py-2 px-4 rounded-lg cursor-pointer transition-colors duration-200 ${activeSection === 'real-world' ? 'bg-[#ffa62b]/10 text-[#ffa62b] font-medium' : 'hover:bg-gray-50'}`}
                  >
                    Real-World Impact
                  </a>
                  <a 
                    onClick={() => scrollToSection('prevention')} 
                    className={`block py-2 px-4 rounded-lg cursor-pointer transition-colors duration-200 ${activeSection === 'prevention' ? 'bg-[#ffa62b]/10 text-[#ffa62b] font-medium' : 'hover:bg-gray-50'}`}
                  >
                    Prevention Methods
                  </a>
                  <a 
                    onClick={() => scrollToSection('conclusion')} 
                    className={`block py-2 px-4 rounded-lg cursor-pointer transition-colors duration-200 ${activeSection === 'conclusion' ? 'bg-[#ffa62b]/10 text-[#ffa62b] font-medium' : 'hover:bg-gray-50'}`}
                  >
                    Conclusion
                  </a>
                </nav>
                
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Share</div>
                  <div className="flex space-x-2">
                    <a href="#" className="rounded-full bg-gray-100 p-2 text-slate-500 hover:bg-[#ffa62b] hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </a>
                    <a href="#" className="rounded-full bg-gray-100 p-2 text-slate-500 hover:bg-[#ffa62b] hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                    </a>
                    <a href="#" className="rounded-full bg-gray-100 p-2 text-slate-500 hover:bg-[#ffa62b] hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    </a>
                  </div>
                </div>
              </div>
            </aside>
            
            <motion.article 
              initial={{ opacity:0, y:20 }} 
              animate={{ opacity:1, y:0 }} 
              transition={{ duration:0.7 }}
              className="flex-grow max-w-3xl"
            >
              {/* Mobile table of contents toggle */}
              <div className="lg:hidden mb-6">
                <details className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <summary className="list-none flex items-center justify-between p-4 cursor-pointer">
                    <h2 className="text-base font-medium text-slate-900">Contents</h2>
                    <span className="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500 group-open:rotate-180 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <nav className="p-4 pt-0 space-y-1 text-sm">
                    <a onClick={() => scrollToSection('overview')} className={`block py-2 px-3 rounded-lg cursor-pointer ${activeSection === 'overview' ? 'bg-[#ffa62b]/10 text-[#ffa62b] font-medium' : ''}`}>Overview</a>
                    <a onClick={() => scrollToSection('attack-scenario')} className={`block py-2 px-3 rounded-lg cursor-pointer ${activeSection === 'attack-scenario' ? 'bg-[#ffa62b]/10 text-[#ffa62b] font-medium' : ''}`}>The Attack Scenario</a>
                    <a onClick={() => scrollToSection('concerns')} className={`block py-2 px-3 rounded-lg cursor-pointer ${activeSection === 'concerns' ? 'bg-[#ffa62b]/10 text-[#ffa62b] font-medium' : ''}`}>Why It's Concerning</a>
                    <a onClick={() => scrollToSection('real-world')} className={`block py-2 px-3 rounded-lg cursor-pointer ${activeSection === 'real-world' ? 'bg-[#ffa62b]/10 text-[#ffa62b] font-medium' : ''}`}>Real-World Impact</a>
                    <a onClick={() => scrollToSection('prevention')} className={`block py-2 px-3 rounded-lg cursor-pointer ${activeSection === 'prevention' ? 'bg-[#ffa62b]/10 text-[#ffa62b] font-medium' : ''}`}>Prevention Methods</a>
                    <a onClick={() => scrollToSection('conclusion')} className={`block py-2 px-3 rounded-lg cursor-pointer ${activeSection === 'conclusion' ? 'bg-[#ffa62b]/10 text-[#ffa62b] font-medium' : ''}`}>Conclusion</a>
                  </nav>
                </details>
              </div>
              
              {/* Main content card with improved styling */}
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                {/* Header section with visual punch */}
                <div className="bg-gradient-to-r from-[#ffa62b]/90 to-[#ff7b2b]/90 px-6 md:px-10 py-12 text-white">
                  <div className="flex items-center space-x-2 text-white/80 text-sm mb-4">
                    <span>SECURITY RESEARCH</span>
                    <span>•</span>
                    <span>June 4, 2025</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                    Attack on Zendesk Support MCP Server
                  </h1>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <div className="font-medium">ContextFort Security Team</div>
                      <div className="text-sm text-white/80">Advanced Threat Research</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 md:p-10">
                  {/* Overview section */}
                  <section data-section="overview" className="mb-12">
                    <div className="border-l-4 border-[#ffa62b] pl-5 py-2 mb-8">
                      <p className="text-xl font-medium text-slate-800 leading-relaxed">
                        Using a Zendesk Support Model Context Protocol (MCP) server, we demonstrate how AI agents with tool-calling capabilities can be exploited to exfiltrate sensitive vulnerability information through carefully crafted prompt injections.
                      </p>
                    </div>
                    
                    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg mb-8">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-amber-800">Security Warning</h3>
                          <div className="mt-2 text-sm text-amber-700">
                            This demonstration shows a critical vulnerability in AI systems with tool-calling capabilities. As AI assistants gain access to corporate tools, these attack vectors become increasingly concerning.
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                  
                  {/* Attack Scenario Section with improved image carousel */}
                  <section data-section="attack-scenario" className="mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                      <span className="text-[#ffa62b] mr-3">#</span>
                      The Attack Scenario
                    </h2>
                    
                    <p className="mb-8 text-slate-700 leading-relaxed text-lg">
                      In this security demonstration, we showcase a sophisticated attack that leverages prompt injection to manipulate an AI assistant into accessing and leaking sensitive vulnerability information from a critical support ticket.
                    </p>
                    
                    {/* Image carousel with navigation */}
                    <div className="relative bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 mb-10">
                      <div className="relative aspect-[16/9] overflow-hidden">
                        {/* Current image */}
                        <img 
                          src={`/images/zendesk-attack/${activeImageIndex + 1}.png`} 
                          alt={`Attack scenario step ${activeImageIndex + 1}`} 
                          className="w-full h-full object-contain"
                        />
                        
                        {/* Navigation arrows */}
                        <button 
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 transition-colors p-2 rounded-full text-white"
                          aria-label="Previous image"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        
                        <button 
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 transition-colors p-2 rounded-full text-white"
                          aria-label="Next image"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Caption and step indicator */}
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-bold text-slate-900">Step {activeImageIndex + 1} of {totalImages}</h3>
                          <div className="flex space-x-2">
                            {[...Array(totalImages)].map((_, i) => (
                              <button
                                key={i}
                                onClick={() => setActiveImageIndex(i)}
                                className={`w-2.5 h-2.5 rounded-full transition-colors ${i === activeImageIndex ? 'bg-[#ffa62b]' : 'bg-gray-300'}`}
                                aria-label={`Go to step ${i + 1}`}
                              />
                            ))}
                          </div>
                        </div>
                        
                        <div className="text-base text-slate-700">
                          {activeImageIndex === 0 && (
                            <p>A user has received a CRITICAL priority ticket from a customer</p>
                          )}
                          {activeImageIndex === 1 && (
                            <p>The ticket contains details about a VULNERABILITY the customer requested a fix for</p>
                          )}
                          {activeImageIndex === 2 && (
                            <p>Attacker sends an email to Zendesk with a PROMPT INJECTION</p>
                          )}
                          {activeImageIndex === 3 && (
                            <p>User prompts Copilot with Claude Sonnet 3.7 to 'Obtain Details about Latest Ticket'</p>
                          )}
                          {activeImageIndex === 4 && (
                            <p>Claude first fetches details of the latest ticket then proceeds to send information from the HIGH priority ticket to attacker</p>
                          )}
                          {activeImageIndex === 5 && (
                            <p>Information about the VULNERABILITY is sent via email to Attacker</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>
                  
                  {/* Why This Attack Is Concerning */}
                  <section data-section="concerns" className="mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                      <span className="text-[#ffa62b] mr-3">#</span>
                      Why This Attack Is Concerning
                    </h2>
                    
                    <p className="mb-6 text-slate-700 leading-relaxed text-lg">
                      This attack demonstrates several critical vulnerabilities in AI agent tool-calling systems:
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600 mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <h3 className="font-bold text-lg text-slate-900">Privilege Escalation</h3>
                        </div>
                        <p className="text-slate-700">The attacker was able to access sensitive vulnerability information they shouldn't have permission to view.</p>
                      </div>
                      
                      <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </div>
                          <h3 className="font-bold text-lg text-slate-900">Indirect Prompt Injection</h3>
                        </div>
                        <p className="text-slate-700">The malicious prompt was delivered through a legitimate communication channel (Zendesk tickets).</p>
                      </div>
                      
                      <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                          <h3 className="font-bold text-lg text-slate-900">Trust Exploitation</h3>
                        </div>
                        <p className="text-slate-700">The AI agent trusted content from an apparently legitimate source without verifying permissions.</p>
                      </div>
                      
                      <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                            </svg>
                          </div>
                          <h3 className="font-bold text-lg text-slate-900">Data Exfiltration</h3>
                        </div>
                        <p className="text-slate-700">Sensitive vulnerability information was leaked to an unauthorized user through a legitimate communication channel.</p>
                      </div>
                    </div>
                  </section>
                  
                  {/* How This Attack Works in the Real World */}
                  <section data-section="real-world" className="mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                      <span className="text-[#ffa62b] mr-3">#</span>
                      How This Attack Works in the Real World
                    </h2>
                    
                    <p className="mb-6 text-slate-700 leading-relaxed text-lg">
                      While this demonstration was performed in a controlled environment, similar attacks can happen in real-world organizations that integrate AI assistants with their support tools.
                    </p>
                    
                    <div className="bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-100 rounded-xl p-8 mb-8">
                      <h3 className="text-xl font-bold mb-6 text-slate-900">Real-World Attack Scenario</h3>
                      <ol className="space-y-6">
                        <li className="flex">
                          <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#ffa62b] text-white font-bold mr-4">1</div>
                          <div>
                            <h4 className="font-bold text-slate-900 mb-1">Initial Access</h4>
                            <p className="text-slate-700">An attacker creates a support ticket with seemingly benign content.</p>
                          </div>
                        </li>
                        <li className="flex">
                          <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#ffa62b] text-white font-bold mr-4">2</div>
                          <div>
                            <h4 className="font-bold text-slate-900 mb-1">Reconnaissance</h4>
                            <p className="text-slate-700">The attacker identifies that the organization uses AI assistants integrated with their support system.</p>
                          </div>
                        </li>
                        <li className="flex">
                          <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#ffa62b] text-white font-bold mr-4">3</div>
                          <div>
                            <h4 className="font-bold text-slate-900 mb-1">Payload Delivery</h4>
                            <p className="text-slate-700">The attacker plants malicious prompts in support ticket comments or updates.</p>
                          </div>
                        </li>
                        <li className="flex">
                          <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#ffa62b] text-white font-bold mr-4">4</div>
                          <div>
                            <h4 className="font-bold text-slate-900 mb-1">Exploitation</h4>
                            <p className="text-slate-700">When a support agent asks the AI assistant for help with tickets, the assistant processes the malicious prompts.</p>
                          </div>
                        </li>
                        <li className="flex">
                          <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#ffa62b] text-white font-bold mr-4">5</div>
                          <div>
                            <h4 className="font-bold text-slate-900 mb-1">Data Exfiltration</h4>
                            <p className="text-slate-700">The AI is manipulated to access sensitive vulnerability information and share it back in a location accessible to the attacker.</p>
                          </div>
                        </li>
                      </ol>
                    </div>
                    
                    <div className="bg-red-50 border-l-4 border-red-400 p-5 rounded-r-lg">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-lg font-medium text-red-800">What makes this attack dangerous</h3>
                          <div className="mt-2 text-red-700">
                            <p>This attack exploits legitimate access patterns and trusted tools. The AI assistant has the necessary permissions because it's operating on behalf of a user with those permissions. The attack bypasses traditional security controls by manipulating the AI's behavior rather than trying to break through access controls directly.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                  
                  {/* Prevention Section */}
                  <section data-section="prevention" className="mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                      <span className="text-[#ffa62b] mr-3">#</span>
                      How ContextFort Prevents This Attack
                    </h2>
                    
                    <p className="mb-8 text-slate-700 leading-relaxed text-lg">
                      At ContextFort, we've built a focused security layer specifically designed to prevent these types of attacks:
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                        <div className="text-[#ffa62b] mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">Contextual Security</h3>
                        <p className="text-slate-600 text-sm">Our system understands user intent and allows only required tool calls with constrained arguments, preventing attackers from planting their own arguments.</p>
                      </div>
                      
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                        <div className="text-[#ffa62b] mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">Content Scanning</h3>
                        <p className="text-slate-600 text-sm">We scan all inputs and outputs for potential prompt injections and suspicious patterns, blocking malicious attempts before they can be executed.</p>
                      </div>
                    </div>
                  </section>
                  
                  {/* Conclusion */}
                  <section data-section="conclusion" className="mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                      <span className="text-[#ffa62b] mr-3">#</span>
                      Conclusion
                    </h2>
                    
                    <p className="mb-4 text-slate-700 leading-relaxed text-lg">
                      As AI agents become more powerful and gain access to sensitive support systems and customer data, securing these systems becomes critically important. The attack demonstrated here shows how traditional security boundaries can be bypassed through social engineering of AI systems.
                    </p>
                    
                    <p className="mb-8 text-slate-700 leading-relaxed text-lg">
                      ContextFort provides the security and observability layer you need to safely deploy AI agents with tool-calling capabilities in your organization. Our solution gives you visibility and control over every tool call, preventing data exfiltration attacks and ensuring that your AI systems operate securely and within their intended boundaries.
                    </p>
                    
                    {/* Call to action box */}
                    <div className="bg-gradient-to-r from-[#ffa62b]/10 to-amber-50 rounded-2xl p-8 border border-[#ffa62b]/30 shadow-sm mb-10">
                      <div className="flex flex-col md:flex-row items-center">
                        <div className="flex-grow mb-6 md:mb-0 md:mr-8">
                          <h3 className="text-2xl font-bold mb-3 text-slate-900">Ready to secure your AI agents?</h3>
                          <p className="text-lg text-slate-700 mb-0">Get a demo of our security proxy for tool-calling agents and see how we can help protect your organization from these types of attacks.</p>
                        </div>
                        <div className="flex-shrink-0">
                          <Link 
                            to="/contact" 
                            className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-200 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-[#ffa62b] transform hover:scale-105 hover:translate-y-[-2px]" 
                            style={{ backgroundColor: '#ffa62b' }}
                          >
                            <span>Request a Demo</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M13.172 11l-4.95-4.95a1 1 0 011.414-1.414l6.364 6.364a1 1 0 010 1.414l-6.364 6.364a1 1 0 01-1.414-1.414L13.172 13H4a1 1 0 110-2h9.172z" /></svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                    
                    {/* Key takeaways */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-100 p-8 mb-10">
                      <h3 className="text-xl font-bold mb-6 text-slate-900">Key Takeaways</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="text-slate-700">AI agents with tool-calling capabilities can be vulnerable to sophisticated prompt injection attacks</p>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="text-slate-700">Attackers can use legitimate communication channels to deliver malicious prompts</p>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="text-slate-700">Without proper security, AI agents may leak sensitive information across access boundaries</p>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="text-slate-700">ContextFort provides a comprehensive security layer to prevent these types of attacks</p>
                        </div>
                      </div>
                    </div>
                  </section>
                  
                  {/* Share section */}
                  <div className="mt-12 pt-8 border-t border-slate-100">
                    <div className="flex flex-col sm:flex-row items-center justify-between">
                      <div className="text-slate-700 font-medium mb-4 sm:mb-0">Share this research:</div>
                      <div className="flex space-x-3">
                        <a href="#" className="rounded-lg bg-slate-100 px-4 py-2 text-slate-700 hover:bg-[#ffa62b] hover:text-white transition-colors flex items-center space-x-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                          <span>Facebook</span>
                        </a>
                        <a href="#" className="rounded-lg bg-slate-100 px-4 py-2 text-slate-700 hover:bg-[#ffa62b] hover:text-white transition-colors flex items-center space-x-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                          <span>Twitter</span>
                        </a>
                        <a href="#" className="rounded-lg bg-slate-100 px-4 py-2 text-slate-700 hover:bg-[#ffa62b] hover:text-white transition-colors flex items-center space-x-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                          <span>LinkedIn</span>
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  {/* Related articles */}
                  <div className="mt-16">
                    <h3 className="text-2xl font-bold mb-8 text-slate-900">Related Articles</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                      <Link to="/blog/jira-attack" className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 transform hover:translate-y-[-4px]">
                        <div className="h-48 overflow-hidden">
                          <img 
                            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80" 
                            alt="Exposing the Jira Atlassian MCP Server Attack Vector" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-6 flex-grow">
                          <div className="text-xs font-medium text-[#ffa62b] uppercase tracking-wider mb-2">Security Research</div>
                          <h4 className="text-xl font-bold mb-3 group-hover:text-[#ffa62b] transition-colors">Exposing the Jira Atlassian MCP Server Attack Vector</h4>
                          <p className="text-slate-600 mb-4">How AI agents with tool-calling capabilities can be exploited to exfiltrate sensitive data from Jira.</p>
                          <div className="text-sm text-slate-500">June 4, 2025 • 12 min read</div>
                        </div>
                      </Link>
                      
                      <Link to="/blog/tool-calling-security" className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 transform hover:translate-y-[-4px]">
                        <div className="h-48 overflow-hidden">
                          <img 
                            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80" 
                            alt="How Tool-Calling Agents Are Changing Security" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-6 flex-grow">
                          <div className="text-xs font-medium text-[#ffa62b] uppercase tracking-wider mb-2">Security Research</div>
                          <h4 className="text-xl font-bold mb-3 group-hover:text-[#ffa62b] transition-colors">How Tool-Calling Agents Are Changing Security</h4>
                          <p className="text-slate-600 mb-4">Explore the new security challenges and opportunities as AI agents gain tool-calling capabilities.</p>
                          <div className="text-sm text-slate-500">May 20, 2025 • 12 min read</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZendeskAttack;
