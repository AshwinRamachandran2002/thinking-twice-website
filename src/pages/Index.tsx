import React from 'react';
import { useNavigate } from 'react-router-dom';
import FlowDiagram from './FlowDiagram';


const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
        }} />
      </div>

      {/* Navigation Bar */}
      <nav className="relative z-10 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end items-center h-16 space-x-4">
            <button
              onClick={() => navigate('/about')}
              className="text-slate-300 hover:text-white px-4 py-2 text-sm font-medium transition-colors"
            >
              About
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="text-slate-300 hover:text-white px-4 py-2 text-sm font-medium transition-colors"
            >
              Contact
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[calc(100vh-4rem)] items-center">
            {/* Left Column - Text Content */}
            <div className="relative space-y-8 text-left">
              {/* Glowing effect behind the title */}
              <div className="absolute -inset-x-4 -inset-y-4 z-0">
                <div className="w-full h-full bg-indigo-500/20 rounded-full blur-3xl" />
              </div>
              
              {/* Company Name */}
              <div className="relative z-10">
                <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-200/90 to-slate-200/60 block">
                    Context
                  </span>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-400 block">
                    Fort
                  </span>
                </h1>
                
                {/* Tagline */}
                <p className="text-xl md:text-2xl text-slate-300/90 max-w-xl mt-6">
                  Security & Observability for Tool-Calling Agents
                </p>
                
                {/* YC Badge */}
                <div className="inline-flex items-center mt-8 px-4 py-2 space-x-2 bg-gradient-to-r from-orange-500/10 to-orange-500/20 rounded-full backdrop-blur-sm border border-orange-500/20">
                  <p className="text-orange-400 font-medium">
                    Backed by Y Combinator
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Graphics */}
            <div className="relative hidden md:block">
              {/* Add your graphics here */}
              <div className="aspect-square rounded-full bg-gradient-to-tr from-indigo-500/20 via-cyan-400/20 to-purple-500/20 blur-2xl absolute inset-0" />
              <div className="relative z-10">
                {/* You can add your actual graphics/illustration here */}
                {/* <div className="w-full aspect-square rounded-3xl bg-gradient-to-tr from-indigo-500/10 via-cyan-400/10 to-purple-500/10 border border-slate-700/50 backdrop-blur-sm" /> */}
                <div className="relative z-10">
                <FlowDiagram />
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;