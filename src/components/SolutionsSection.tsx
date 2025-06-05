import React from 'react';
import { useInViewport } from '../hooks/use-in-viewport';
import { MiniContextFortSolutionDiagram } from './MiniContextFortSolutionDiagram';

export const SolutionsSection = () => {
  const { elementRef, isInViewport } = useInViewport({
    threshold: 0.1,
    rootMargin: '100px',
  });

  return (
    <section 
      ref={elementRef}
      id="solutions" 
      className="relative z-10 w-full max-w-4xl rounded-3xl bg-white shadow-lg border border-[#ffa62b]/20 px-8 py-12 flex flex-col items-center text-center backdrop-blur-xl mb-10"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 drop-shadow-sm" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>Our <span style={{ color: '#ffa62b' }}>Solutions</span></h2>
      <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-8 font-medium" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>
        ContextFort delivers <span className="font-bold" style={{ color: '#ffa62b' }}>real-time monitoring</span>, <span className="font-bold text-black">security controls</span>, and <span className="font-bold text-black">seamless integration</span> for agentic applications. Gain visibility, enforce policies, and protect your AI workflows from day one.
      </p>
      
      {/* Only render diagram when in viewport */}
      {isInViewport && (
        <div className="flex justify-center mb-10">
          <MiniContextFortSolutionDiagram />
        </div>
      )}
      
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <li className="bg-[#ffa62b]/10 rounded-2xl p-6 shadow-md border border-[#ffa62b]/20">
          <span className="text-2xl font-bold" style={{ color: '#ffa62b', fontFamily: "Gellix, Inter, sans-serif" }}>01</span>
          <div className="font-bold text-black mt-2 mb-1" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>Agent Observability</div>
          <div className="text-slate-600 text-sm font-medium" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>Track every tool call, prompt, and response. Instantly detect anomalies and threats.</div>
        </li>
        <li className="bg-[#ffa62b]/10 rounded-2xl p-6 shadow-md border border-[#ffa62b]/20">
          <span className="text-2xl font-bold text-black" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>02</span>
          <div className="font-bold text-black mt-2 mb-1" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>Security Enforcement</div>
          <div className="text-slate-600 text-sm font-medium" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>Apply granular permissions, audit trails, and automated policy checks for every agent action.</div>
        </li>
        <li className="bg-[#ffa62b]/10 rounded-2xl p-6 shadow-md border border-[#ffa62b]/20">
          <span className="text-2xl font-bold" style={{ color: '#ffa62b', fontFamily: "Gellix, Inter, sans-serif" }}>03</span>
          <div className="font-bold text-black mt-2 mb-1" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>Easy Integration</div>
          <div className="text-slate-600 text-sm font-medium" style={{ fontFamily: "Gellix, Inter, sans-serif" }}>Plug ContextFort into your stack with SDKs, APIs, and no-code options—no friction, just results.</div>
        </li>
      </ul>
    </section>
  );
};
