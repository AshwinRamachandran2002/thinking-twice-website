import React, { useRef } from 'react';
import { useInViewport } from '../hooks/use-in-viewport';
import { MiniContextFortSolutionDiagram } from './MiniContextFortSolutionDiagram';
import { Link } from 'react-router-dom';

export const SolutionsSection = () => {
<<<<<<< HEAD
  const { elementRef, hasBeenInViewport } = useInViewport({
    threshold: 0.1,
    rootMargin: '100px',
=======
  const containerRef = useRef(null);
  const { elementRef, isInViewport } = useInViewport({
    threshold: 0.3,
>>>>>>> 746f809b0301abb402ddcd9389fc7a9dbf8ba147
  });

  return (
    <section 
      ref={containerRef}
      id="solutions" 
<<<<<<< HEAD
      className="relative z-10 w-full max-w-4xl rounded-3xl bg-white/95 shadow-lg border border-[#ffa62b]/20 px-8 py-12 flex flex-col items-center text-center mb-10"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 drop-shadow-sm" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>Our <span style={{ color: '#ffa62b' }}>Solutions</span></h2>
      <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-8 font-medium" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>
        ContextFort delivers <span className="font-bold" style={{ color: '#ffa62b' }}>real-time monitoring</span>, <span className="font-bold text-black">security controls</span>, and <span className="font-bold text-black">seamless integration</span> for agentic applications. Gain visibility, enforce policies, and protect your AI workflows from day one.
      </p>
      
      {/* Only render diagram when has been in viewport */}
      {hasBeenInViewport && (
        <div className="flex justify-center mb-10">
          <MiniContextFortSolutionDiagram />
=======
      className="relative z-10 w-full max-w-4xl rounded-3xl bg-white shadow-lg border border-[#ffa62b]/20 px-8 py-12 backdrop-blur-xl mb-10"
    >
      <div 
        ref={elementRef}
        className="grid grid-cols-1 gap-8 auto-rows-min"
      >
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 drop-shadow-sm" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>
            Our <span style={{ color: '#ffa62b' }}>Security Proxy</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>
            A lightweight proxy that stands between your AI agents and external tools, providing real-time monitoring and security controls.
          </p>
>>>>>>> 746f809b0301abb402ddcd9389fc7a9dbf8ba147
        </div>

        <div 
          className="relative h-[340px] flex items-center justify-center"
          aria-hidden="true"
        >
          <div 
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ease-in-out"
            style={{ opacity: isInViewport ? 1 : 0 }}
          >
            <MiniContextFortSolutionDiagram />
          </div>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <li className="bg-[#ffa62b]/10 rounded-2xl p-6 shadow-md border border-[#ffa62b]/20">
            <span className="text-2xl font-bold" style={{ color: '#ffa62b', fontFamily: "Gellix, Inter, sans-serif" }}>01</span>
            <div className="font-bold text-black mt-2 mb-1" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>Instant Setup</div>
            <div className="text-slate-600 text-sm font-medium" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>Drop-in proxy that works with any AI agent. No code changes required.</div>
          </li>
          <li className="bg-[#ffa62b]/10 rounded-2xl p-6 shadow-md border border-[#ffa62b]/20">
            <span className="text-2xl font-bold text-black" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>02</span>
            <div className="font-bold text-black mt-2 mb-1" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>Real-time Protection</div>
            <div className="text-slate-600 text-sm font-medium" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>Block unauthorized access and data exfiltration attempts in real-time.</div>
          </li>
          <li className="bg-[#ffa62b]/10 rounded-2xl p-6 shadow-md border border-[#ffa62b]/20">
            <span className="text-2xl font-bold" style={{ color: '#ffa62b', fontFamily: "Gellix, Inter, sans-serif" }}>03</span>
            <div className="font-bold text-black mt-2 mb-1" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>Deep Visibility</div>
            <div className="text-slate-600 text-sm font-medium" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>Monitor every tool call and detect potential security threats.</div>
          </li>
        </ul>

        {/* Pricing Section */}
        <div className="mt-12 pt-8 border-t border-[#ffa62b]/20">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-black mb-4 drop-shadow-sm" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>
              Enterprise <span style={{ color: '#ffa62b' }}>Pricing</span>
            </h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>
              Secure and scalable pricing for enterprises of all sizes
            </p>
          </div>

          <div className="max-w-lg mx-auto bg-[#ffa62b]/10 rounded-2xl p-8 shadow-md border border-[#ffa62b]/20">
            <div className="text-center">
              <div className="font-bold text-4xl text-black mb-2" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>
                $20
                <span className="text-lg text-slate-600 font-medium">/million tokens</span>
              </div>
              <p className="text-slate-600 mb-6">Pay only for what you use</p>
              
              <ul className="text-left mb-8 space-y-4">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#ffa62b] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-slate-700">Real-time threat monitoring</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#ffa62b] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-slate-700">Advanced security controls</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#ffa62b] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-slate-700">24/7 enterprise support</span>
                </li>
              </ul>

              <Link 
                to="/contact" 
                className="inline-flex items-center justify-center w-full gap-2 rounded-full px-6 py-3 text-lg font-bold text-white shadow-md hover:shadow-lg transition-shadow" 
                style={{ backgroundColor: '#ffa62b' }}
              >
                Contact Sales
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
