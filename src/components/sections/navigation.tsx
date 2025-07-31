import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import React from 'react';

const Navigation = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto flex h-[72px] items-center justify-between px-2 sm:px-3 lg:px-4">
        <div className="flex items-center gap-x-6">
          <Link href="/" className="flex items-center gap-x-3 text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-md">
            <span className="text-xl font-bold">CONTEXT FORT</span>
          </Link>
        </div>
        <a 
          href="" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="group inline-flex items-center justify-center gap-x-2 px-0 py-0 text-sm font-semibold text-black transition-transform duration-200 ease-in-out hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white/50 focus-visible:ring-[#60a5fa] bg-transparent border-none shadow-none rounded-none"
        >
          Book a demo
          <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-in-out group-hover:translate-x-1" />
        </a>
      </div>
    </header>
  );
};

export default Navigation;