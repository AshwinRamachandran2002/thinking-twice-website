import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

const Navigation = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/10 bg-white/5">
      <div className="container mx-auto flex h-[80px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-x-4">
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
        
        <div className="flex items-center gap-x-3">
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
            className="inline-flex items-center justify-center gap-x-2 px-6 py-2 text-sm font-medium bg-blue-600 text-white rounded-full shadow-md transition-all duration-200 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
          >
            Try our product
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navigation;