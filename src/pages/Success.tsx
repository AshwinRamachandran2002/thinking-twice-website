import React from 'react';
import { Link } from 'react-router-dom';

const Success = () => {
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

      <main className="relative z-20 flex min-h-screen flex-col items-center justify-center px-4 py-16 pt-32">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg border border-teal-100 p-8 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-teal-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>

            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-500 via-slate-600 to-slate-700 bg-clip-text text-transparent mb-4">Thank You!</h1>
            <p className="text-xl text-slate-600 mb-8">
              Your submission has been received. We'll get back to you shortly to discuss your agent security needs.
            </p>

            <div className="space-y-6">
              <div className="bg-teal-50 p-6 rounded-lg border border-teal-100">
                <h2 className="font-semibold text-lg text-teal-800 mb-3">What happens next?</h2>
                <ul className="text-slate-700 space-y-2">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                    Our team will analyze your security needs
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                    We'll schedule a personalized demo
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                    You'll receive a detailed security assessment
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-slate-100">
                <h2 className="font-semibold text-lg text-slate-800 mb-3">Meanwhile, explore our research</h2>
                <div className="space-y-3">
                  <a
                    href="https://arxiv.org/abs/2312.02119"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-teal-600 hover:text-teal-700 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    Read our TAP Algorithm Paper
                  </a>
                  <a
                    href="https://storage.googleapis.com/deepmind-media/Security%20and%20Privacy/Gemini_Security_Paper.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-teal-600 hover:text-teal-700 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    Learn about agent security best practices
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link
                to="/"
                className="inline-block px-6 py-3 bg-gradient-to-r from-teal-500 to-slate-600 hover:from-teal-600 hover:to-slate-700 text-white rounded-lg shadow-md font-semibold transform transition-all duration-300 hover:scale-105"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Success;
