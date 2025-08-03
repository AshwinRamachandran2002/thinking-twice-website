import { Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="relative z-50 bg-[#2563eb]">
      <div className="container mx-auto flex h-[88px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <p className="font-inter text-sm font-normal" style={{ color: '#FFFFFF' }}>
          © 2025 Context Fort, Inc. All rights reserved.
        </p>
        <div className="flex items-center space-x-6">
          <Link href="https://x.com/contextfort" target="_blank" rel="noopener noreferrer" aria-label="Visit our Twitter page">
            <Twitter className="h-5 w-5" style={{ color: '#FFFFFF' }} fill="#FFFFFF" />
          </Link>
          <Link href="https://www.linkedin.com/company/108576884/" target="_blank" rel="noopener noreferrer" aria-label="Visit our LinkedIn page">
            <Linkedin className="h-5 w-5" style={{ color: '#FFFFFF' }} fill="#FFFFFF" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;