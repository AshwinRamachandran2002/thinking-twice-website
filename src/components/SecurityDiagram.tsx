import React, { useRef, useEffect, useState, useCallback } from "react";
import { useInViewport } from "../hooks/use-in-viewport";
import { useScrollOptimization } from "../hooks/use-scroll-optimization";

interface SecuritySource {
  name: string;
  description: string;
}

interface SecuritySourceProps {
  source: SecuritySource;
  index: number;
}

interface CardProps {
  children: React.ReactNode;
  isContextFort?: boolean;
  className?: string;
}

const externalTools: SecuritySource[] = [
  { name: 'Slack', description: 'Private Communication' },
  { name: 'Drive', description: 'Document Storage' },
  { name: 'Sheets', description: 'Data Management' },
];

const SecuritySource = React.memo(({ source, index }: SecuritySourceProps) => {
  return (
    <div 
      className="flex items-center space-x-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all duration-300"
      style={{ 
        animationDelay: `${index * 150}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards'
      }}
    >
      <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
        {source.name.charAt(0)}
      </div>
      <div>
        <div 
          className="text-sm font-bold text-black" 
          style={{ fontFamily: "Gellix, Inter, sans-serif" }}
        >
          {source.name}
        </div>
        <div 
          className="text-xs text-gray-600" 
          style={{ fontFamily: "Gellix, Inter, sans-serif" }}
        >
          {source.description}
        </div>
      </div>
    </div>
  );
});

// Memoized card for better performance
const Card = React.memo(({ children, isContextFort = false, className = "" }: CardProps) => {
  return (
    <div className="group">
      <div 
        className={`relative h-[30rem] rounded-3xl p-6 backdrop-blur-xl ${isContextFort ? 'border-[3px] border-[#ffa62b]' : 'border border-white/20'} shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 hover:rotate-1 ${className}`}
        style={{
          background: isContextFort 
            ? 'linear-gradient(135deg, rgba(255, 166, 43, 0.2) 0%, rgba(255, 166, 43, 0.1) 100%)'
            : 'linear-gradient(135deg, rgba(156, 163, 175, 0.15) 0%, rgba(156, 163, 175, 0.08) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          ...(isContextFort ? {
            boxShadow: '0 0 30px rgba(255, 166, 43, 0.3), 0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          } : {})
        }}
      >
        {children}
      </div>
    </div>
  );
});

export const SecurityDiagram = () => {
  const externalInfoSources = [
    { name: 'GitHub', icon: githubLogo, description: 'Code & Issues' },
    { name: 'Calendar', icon: calendarLogo, description: 'Meetings & Events' },
    { name: 'HubSpot', icon: hubspotLogo, description: 'CRM Data' },
  ];

  const externalTools = [
    { name: 'Slack', icon: slackLogo, description: 'Private Communication' },
    { name: 'Google Drive', icon: driveLogo, description: 'File Storage' },
    { name: 'Sheets', icon: sheetsLogo, description: 'Analytical Data' },
  ];

  return (
    <div className="w-full py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold text-black mb-6" 
            style={{ fontFamily: "Gellix, Inter, sans-serif" }}
          >
            How <span style={{ color: '#ffa62b' }}>ContextFort</span> Protects Your AI Agents
          </h2>
        </div>

        {/* Main Diagram */}
        <div className="relative">
          {/* Background gradient mesh */}
          <div className="absolute inset-0 -m-8">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#ffa62b]/20 to-purple-500/20 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-blue-500/20 to-[#ffa62b]/20 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-emerald-500/20 to-[#ffa62b]/20 rounded-full blur-3xl opacity-25"></div>
          </div>



          {/* Animated Thick Mango Line */}
          <div className="absolute inset-0 pointer-events-none hidden lg:block z-10">
            <div 
              className="absolute h-1.5 bg-[#ffa62b] animate-line-grow"
              style={{ 
                top: '50%', 
                left: '0',
                transform: 'translateY(-50%)',
                width: '0%'
              }}
            />
          </div>

          {/* Cards Container */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 z-20">
            
            {/* External Information Sources Card */}
            <div className="group">
              <div 
                className="relative h-[30rem] rounded-3xl p-6 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 hover:rotate-1"
                style={{
                  background: 'linear-gradient(135deg, rgba(156, 163, 175, 0.15) 0%, rgba(156, 163, 175, 0.08) 100%)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              >
                {/* Card Header */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-300/30 to-gray-300/20 backdrop-blur-sm flex items-center justify-center border border-gray-300/30">
                    <span className="text-2xl">🗄️</span>
                  </div>
                  <h3 
                    className="text-xl font-bold text-black mb-2" 
                    style={{ fontFamily: "Gellix, Inter, sans-serif" }}
                  >
                    External Information
                  </h3>
                  <p 
                    className="text-sm text-gray-600 font-medium" 
                    style={{ fontFamily: "Gellix, Inter, sans-serif" }}
                  >
                    Data Sources
                  </p>
                </div>

              {/* Service Icons - Using memoized components */}
              <div className="space-y-4">
                {externalTools.map((source, index) => (
                  <SecuritySource key={source.name} source={source} index={index} />
                ))}
              </div>

                {/* Floating particles */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-gray-400/40 rounded-full animate-pulse"></div>
                <div className="absolute bottom-8 left-4 w-1 h-1 bg-gray-300/40 rounded-full animate-bounce"></div>
              </div>
            </div>

            {/* AI Agent Card */}
            <div className="group">
              <div 
                className="relative h-[30rem] rounded-3xl p-6 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 hover:-rotate-1"
                style={{
                  background: 'linear-gradient(135deg, rgba(156, 163, 175, 0.15) 0%, rgba(156, 163, 175, 0.08) 100%)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              >
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-400/20 via-transparent to-gray-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                {/* Card Header */}
                <div className="relative text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-300/30 to-gray-300/20 backdrop-blur-sm flex items-center justify-center border border-gray-300/30 shadow-lg">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <h3 
                    className="text-xl font-bold text-black mb-2" 
                    style={{ fontFamily: "Gellix, Inter, sans-serif" }}
                  >
                    AI Agent
                  </h3>
                  <p 
                    className="text-sm text-gray-600 font-medium" 
                    style={{ fontFamily: "Gellix, Inter, sans-serif" }}
                  >
                    Processing Hub
                  </p>
                </div>

                {/* Agent Features */}
                <div className="relative space-y-4">
                  <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm border border-white/20">
                    <div 
                      className="text-sm font-bold text-black mb-1" 
                      style={{ fontFamily: "Gellix, Inter, sans-serif" }}
                    >
                      Tool Calling
                    </div>
                    <div 
                      className="text-xs text-gray-600" 
                      style={{ fontFamily: "Gellix, Inter, sans-serif" }}
                    >
                      Executes actions across platforms
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm border border-white/20">
                    <div 
                      className="text-sm font-bold text-black mb-1" 
                      style={{ fontFamily: "Gellix, Inter, sans-serif" }}
                    >
                      Context Retrieval
                    </div>
                    <div 
                      className="text-xs text-gray-600" 
                      style={{ fontFamily: "Gellix, Inter, sans-serif" }}
                    >
                      Gathers relevant information
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm border border-white/20">
                    <div 
                      className="text-sm font-bold text-black mb-1" 
                      style={{ fontFamily: "Gellix, Inter, sans-serif" }}
                    >
                      Response Generation
                    </div>
                    <div 
                      className="text-xs text-gray-600" 
                      style={{ fontFamily: "Gellix, Inter, sans-serif" }}
                    >
                      Creates intelligent outputs
                    </div>
                  </div>
                </div>

                {/* Pulsing center */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gray-300/10 rounded-full animate-ping opacity-20"></div>
              </div>
            </div>

            {/* ContextFort Card */}
            <Card isContextFort={true}>
              {/* Removed security glow animation */}
              
              {/* Card Header */}
              <div className="relative text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#ffa62b]/40 to-[#ffa62b]/30 backdrop-blur-sm flex items-center justify-center border border-[#ffa62b]/40 shadow-lg">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h3 
                  className="text-xl font-bold text-black mb-2" 
                  style={{ fontFamily: "Gellix, Inter, sans-serif" }}
                >
                  ContextFort
                </h3>
                <p 
                  className="text-sm font-medium" 
                  style={{ color: '#ffa62b', fontFamily: "Gellix, Inter, sans-serif" }}
                >
                  Security Gateway
                </p>
              </div>

              {/* Security Features */}
              <div className="relative space-y-4">
                <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 hover:bg-[#ffa62b]/10 transition-colors duration-300">
                  <div 
                    className="text-sm font-bold text-black mb-1" 
                    style={{ fontFamily: "Gellix, Inter, sans-serif" }}
                  >
                    Contextual Security
                  </div>
                  <div 
                    className="text-xs text-gray-600" 
                    style={{ fontFamily: "Gellix, Inter, sans-serif" }}
                  >
                    Understands user intent and allows only required tool calls with constrained arguments
                  </div>
                </div>
                
                <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 hover:bg-[#ffa62b]/10 transition-colors duration-300">
                  <div 
                    className="text-sm font-bold text-black mb-1" 
                    style={{ fontFamily: "Gellix, Inter, sans-serif" }}
                  >
                    Content Scanning
                  </div>
                  <h3 
                    className="text-xl font-bold text-black mb-2" 
                    style={{ fontFamily: "Gellix, Inter, sans-serif" }}
                  >
                    Scans inputs and outputs for potential prompt injections and suspicious patterns
                  </div>
                </div>
              </div>
            </div>

            {/* External Tools Card */}
            <div className="group">
              <div 
                className="relative h-[30rem] rounded-3xl p-6 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 hover:-rotate-1"
                style={{
                  background: 'linear-gradient(135deg, rgba(156, 163, 175, 0.15) 0%, rgba(156, 163, 175, 0.08) 100%)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              >
                {/* Card Header */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-300/30 to-gray-300/20 backdrop-blur-sm flex items-center justify-center border border-gray-300/30 shadow-lg">
                    <span className="text-2xl">🔧</span>
                  </div>
                  <h3 
                    className="text-xl font-bold text-black mb-2" 
                    style={{ fontFamily: "Gellix, Inter, sans-serif" }}
                  >
                    External Tools
                  </h3>
                  <p 
                    className="text-sm text-gray-600 font-medium" 
                    style={{ fontFamily: "Gellix, Inter, sans-serif" }}
                  >
                    Action Endpoints
                  </p>
                </div>

              {/* Tool Icons - Using memoized components */}
              <div className="space-y-4">
                {externalTools.map((tool, index) => (
                  <SecuritySource key={tool.name} source={tool} index={index} />
                ))}
              </div>

                {/* Floating particles */}
                <div className="absolute bottom-4 right-4 w-2 h-2 bg-gray-400/40 rounded-full animate-pulse"></div>
                <div className="absolute top-8 left-4 w-1 h-1 bg-gray-300/40 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes line-grow {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
        
        .animate-line-grow {
          animation: line-grow 3s ease-out 1s forwards;
        }
        
      `}</style>
    </div>
  );
};