import React from 'react';
import { useInViewport } from '../hooks/use-in-viewport';
import { MiniAgentInflowDiagram } from './MiniAgentInflowDiagram';
import { MiniAgentHijackDiagram, MiniAgentOutflowDiagram } from './MiniAgentHijackDiagram';

export const ProblemSection = () => {
  const { elementRef, hasBeenInViewport } = useInViewport({
    threshold: 0.1,
    rootMargin: '100px',
  });

  return (
    <section 
      ref={elementRef}
      className="relative z-10 mt-20 w-full max-w-5xl rounded-3xl bg-white/95 shadow-lg border border-[#ffa62b]/20 px-4 py-12 flex flex-col items-center text-center mb-10"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-black mb-8 drop-shadow-sm" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>
        How Agents Get <span style={{ color: '#ffa62b' }}>Hijacked</span>
      </h2>
      
      {/* Only render animations when has been in viewport */}
      {hasBeenInViewport && (
        <>
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
          {/* <div className="flex flex-col items-center justify-center gap-12 w-full mt-12">
            <div className="flex flex-col items-center w-full max-w-2xl">
              <div className="w-full h-[30rem] bg-[#ffa62b]/10 rounded-2xl flex items-center justify-center border border-[#ffa62b]/20 mb-4 overflow-hidden shadow-md">
                <img 
                  src="/gifs/jira-attack.gif" 
                  alt="Jira Ticket Attack" 
                  className="w-full h-full object-contain" 
                  loading="lazy"
                  decoding="async"
                  style={{ contentVisibility: 'auto' }}
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <img src={devilImg} alt="devil" className="w-6 h-6" />
                <span className="font-bold text-base" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>Jira Ticket → Attacker Leaks Confidential Project Data & Access Keys</span>
              </div>
            </div>
<<<<<<< HEAD
            
            <div className="flex flex-col items-center w-full max-w-2xl">
              <div className="w-full h-[30rem] bg-[#ffa62b]/10 rounded-2xl flex items-center justify-center border border-[#ffa62b]/20 mb-4 overflow-hidden shadow-md">
                <span className="text-slate-500 text-base font-medium" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>[Hubspot Lead Attack GIF]</span>
=======

            {/* Zendesk Support Attack GIF */}
            <div className="flex flex-col items-center w-full max-w-2xl">
              <div className="w-full h-[30rem] bg-[#ffa62b]/10 rounded-2xl flex items-center justify-center border border-[#ffa62b]/20 mb-4 overflow-hidden shadow-md">
                <img src="/gifs/zendesk-attack.gif" alt="Zendesk Support Attack" className="w-full h-full object-contain" />
>>>>>>> 746f809b0301abb402ddcd9389fc7a9dbf8ba147
              </div>
              <div className="flex items-center gap-2 mt-2">
                <img src={devilImg} alt="devil" className="w-6 h-6" />
                <span className="font-bold text-base" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>Zendesk Support → Attacker Extracts Customer Vulnerability Reports & Critical Security Issues</span>
              </div>
            </div>
          </div> */}
        </>
      )}
    </section>
  );
};
