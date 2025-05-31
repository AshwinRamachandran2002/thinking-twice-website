import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '@fontsource/inter';
import FlowDiagram from './FlowDiagram';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

/**
 * Landing page hero for ContextFort (YC S25)
 * — Responsive, accessible, and animated using Tailwind + Framer‑Motion
 * — No extra dependencies besides the ones already in use
 * — All copy preserved exactly as provided by the user
 */
const Index = () => {
  const navigate = useNavigate();

  /* Framer‑motion variants */
  const container = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.12,
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  // Global variables for motion sections
  const HERO_SECTION = {
    x: -150, // Center X offset (px)
    y: -50, // Center Y offset (px)
    width: '600px', // Width (can be px, %, etc.)
    height: 'auto', // Height (can be px, %, etc.)
  };
  const ILLUSTRATION_SECTION = {
    x: -120, // Center X offset (px)
    y: -30, // Center Y offset (px)
    width: '1140px', // Width (can be px, %, etc.)
    height: '400px', // Height (can be px, %, etc.)
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden font-sans text-slate-100 selection:bg-cyan-500/30 selection:text-white"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* Base gradient backdrop */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800" />

      {/* Animated accent gradient */}
      <motion.div
        initial={{ opacity: 0.4, scale: 1 }}
        animate={{ opacity: 0.75, scale: 1.15 }}
        transition={{
          repeat: Infinity,
          repeatType: 'mirror',
          duration: 12,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 -z-10 bg-gradient-to-tr from-indigo-700 via-purple-700 to-cyan-700 mix-blend-screen filter blur-3xl"
      />

      {/* Subtle texture overlay */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[url('/noise.svg')] opacity-[0.07]" />

      {/* Navigation + Brand */}
      <header className="absolute top-0 left-0 z-30 flex w-full items-center justify-between p-6">
        {/* Brand/Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent tracking-tight drop-shadow-lg select-none">
            ContextFort
          </span>
        </div>
        {/* Navigation */}
        <nav className="flex items-center gap-2 md:gap-4 text-sm font-medium">
          <button className="rounded-lg px-4 py-2 transition-colors hover:bg-slate-700/40 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
            Problem
          </button>
          <button className="rounded-lg px-4 py-2 transition-colors hover:bg-slate-700/40 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
            Blog
          </button>
          <button
            onClick={() => navigate('/about')}
            className="rounded-lg px-4 py-2 transition-colors hover:bg-slate-700/40 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            Product
          </button>
          <button
            onClick={() => navigate('/contact')}
            className="rounded-lg px-4 py-2 transition-colors hover:bg-slate-700/40 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            Team
          </button>
          <button
              onClick={() => navigate('/schedule-demo')}
              className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-cyan-600 shadow-lg transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 text-lg border border-cyan-100"
            >
              Schedule Demo
            </button>
        </nav>
      </header>

      {/* Main hero */}
      <main className="relative z-20 mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center justify-center px-4 pt-32 md:flex-row md:justify-between md:gap-12 lg:pt-40">
        {/* Copy block */}
        <motion.section
          variants={container}
          initial="hidden"
          animate="show"
          className="flex w-full max-w-3xl flex-col items-center space-y-8 text-center md:items-start md:text-left"
          style={{
            left: HERO_SECTION.x,
            top: HERO_SECTION.y,
            width: HERO_SECTION.width,
            height: HERO_SECTION.height,
            position: 'relative',
          }}
        >
          {/* YC badge */}
          <motion.div
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-orange-500/20 px-5 py-2 backdrop-blur-md"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="shrink-0 text-orange-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-semibold text-orange-300">
              Backed by Y Combinator
            </span>
          </motion.div>

          {/* New Main Title */}
          <motion.h1
            variants={item}
            className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400 bg-clip-text text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-transparent drop-shadow-lg"
          >
            Security & Observability for
            <br />
            <span className="whitespace-nowrap">Tool-Calling Agents</span>
          </motion.h1>

          {/* Subtitle/Description */}
          <motion.p
            variants={item}
            className="max-w-xl text-lg leading-relaxed text-slate-400 md:text-xl"
          >
            ContextFort helps you monitor and secure AI agents with confidence. Instantly gain visibility and control over every tool call.
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-4"
          >
            <button
              onClick={() => navigate('/get-started')}
              className="flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-cyan-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 text-lg"
            >
              Get Started
              <ArrowRightIcon className="h-5 w-5" />
            </button>

          </motion.div>
        </motion.section>

        {/* Illustration */}
        <motion.section
          variants={container}
          initial="hidden"
          animate="show"
          className="relative hidden md:flex h-full min-h-[400px] flex-shrink-0 min-w-[1040px] overflow-visible"
          style={{
            left: ILLUSTRATION_SECTION.x,
            top: ILLUSTRATION_SECTION.y,
            width: ILLUSTRATION_SECTION.width,
            height: ILLUSTRATION_SECTION.height,
            position: 'relative',
          }}
        >
          <motion.div
            variants={item}
            className="pointer-events-none absolute inset-0 rounded-[40%] bg-gradient-to-tr from-indigo-500/20 via-cyan-400/20 to-purple-500/20 blur-3xl"
          />
          <motion.div
            variants={item}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <FlowDiagram className="w-full h-full" />
          </motion.div>
        </motion.section>
      </main>
    </div>
  );
};

export default Index;
