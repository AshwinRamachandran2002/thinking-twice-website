"use client";
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

const Navigation = () => {
  const scrollToProduct = () => {
    const productSection = document.querySelector('[data-section="product"]');
    if (productSection) {
      productSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const contactSection = document.querySelector('[data-section="contact"]');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/10 bg-white/5">
      <div className="w-full flex h-[80px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo - Extreme Left */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-x-3 text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-md p-2 hover:bg-white/10 transition-colors">
            <div className="relative">
              <Image
                src="/contextfort-logo.png"
                alt="ContextFort Logo"
                width={48}
                height={48}
                className="rounded-lg shadow-sm"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight">ContextFort</span>
            </div>
          </Link>
        </div>
        
        {/* Navigation Links and Buttons - Extreme Right */}
        <div className="flex items-center gap-x-4">
          <button
            onClick={scrollToProduct}
            className="inline-flex items-center justify-center gap-x-2 px-4 py-2 text-sm font-medium text-black hover:text-blue-600 transition-colors duration-200"
          >
            Product
          </button>
          <button
            onClick={scrollToContact}
            className="inline-flex items-center justify-center gap-x-2 px-4 py-2 text-sm font-medium text-black hover:text-blue-600 transition-colors duration-200"
          >
            Contact
          </button>
          <a 
            href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2-LisBxMgnCRJ-LKKb-R3pFbF841mGLD05pQdMbsBW-4MJvb0Jy2ksFKVYziMHfKcECrF9yIHt" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hidden sm:inline-flex items-center justify-center gap-x-2 px-6 py-2 text-sm font-medium bg-blue-600 text-white rounded-full shadow-md transition-all duration-200 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
          >
            Book a demo
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center gap-x-2 px-6 py-2 text-sm font-medium border-2 border-blue-600 text-blue-600 bg-transparent rounded-full shadow-md transition-all duration-200 ease-in-out hover:bg-blue-600 hover:text-white hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
          >
            Try our product
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navigation;