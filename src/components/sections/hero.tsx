import React from 'react';
import Image from 'next/image';

const YCombinatorBadge = () => (
    <div className="inline-flex items-center justify-center gap-x-2.5 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm text-black backdrop-blur-sm transition-colors hover:border-white/50">
        <span 
            className="flex h-4 w-4 items-center justify-center rounded-sm" 
            style={{ backgroundColor: '#FF6B35', padding: '1.5px', color: '#FFFFFF' }}
        >
            <span className="text-xs font-bold" style={{ color: '#FFFFFF' }}>Y</span>
        </span>
        Backed by Y Combinator
    </div>
);

export default function HeroSection() {
    return (
        <section className="relative w-full overflow-hidden bg-dark-background">
            <div className="absolute inset-0 z-0">
                <Image
                    src="/drawing.png"
                    alt="Architectural drawing background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-dark-background/60" />
            </div>

            <div className="relative z-10 container mx-auto px-4">
                <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center pt-24 pb-24 text-center">
                    <div className="flex-grow" />
                    <YCombinatorBadge />

                    <h1 className="mt-6 text-4xl font-bold tracking-tight text-black sm:text-5xl lg:text-6xl max-w-4xl leading-tight">
                        AI-powered architectural drawing review for <span className="italic text-blue-600">construction teams</span>, 10x faster
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-black">
                        Instantly detect conflicts, errors, and code issues in architectural drawings. Empower your construction team to eliminate manual reviews, reduce risk, and accelerate project delivery with AI agents built for the field.
                    </p>

                    <div className="mt-10">
                        <a
                            href=""
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full bg-blue-600 text-white px-8 py-3.5 text-base font-semibold shadow-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                            Book a demo
                        </a>
                    </div>
                    
                    <div className="flex-grow" />
                </div>
            </div>
        </section>
    );
}