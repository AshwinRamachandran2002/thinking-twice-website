"use client";
import React, { useState } from 'react';
import Image from 'next/image';

const YCombinatorBadge = () => (
    <div className="inline-flex items-center justify-center gap-x-3 rounded-full border border-white/30 bg-white/10 px-6 py-2.5 text-base text-black backdrop-blur-sm transition-colors hover:border-white/50">
        <span className="font-medium">Backed by</span>
        <span 
            className="flex h-6 w-6 items-center justify-center rounded-sm" 
            style={{ backgroundColor: '#FF6B35', padding: '2px', color: '#FFFFFF' }}
        >
            <span className="text-sm font-bold" style={{ color: '#FFFFFF' }}>Y</span>
        </span>
        <span className="font-medium">Combinator</span>
    </div>
);

export default function HeroSection() {
    const [modalImage, setModalImage] = useState<{ src: string; alt: string } | null>(null);

    const openModal = (src: string, alt: string) => {
        console.log('Opening modal with:', src, alt);
        setModalImage({ src, alt });
    };

    const closeModal = () => {
        console.log('Closing modal');
        setModalImage(null);
    };

    return (
        <section className="relative w-full min-h-screen overflow-hidden bg-dark-background">
            <div className="fixed inset-0 z-0">
                <Image
                    src="/drawing.png"
                    alt="Architectural drawing background"
                    fill
                    className="object-cover opacity-20 rotate-12"
                    priority
                />
                <div className="absolute inset-0 bg-dark-background/30" />
            </div>

            <div className="relative z-10 px-8 sm:px-12 lg:px-16 min-h-screen flex flex-col">
                {/* Hero Content */}
                <div className="pt-28 pb-16">
                    <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center w-full">
                        {/* Left side - Title and Buttons */}
                        <div className="text-center lg:text-left">
                            <YCombinatorBadge />

                            <h1 className="mt-6 text-3xl font-bold tracking-tight text-black sm:text-4xl lg:text-5xl xl:text-6xl leading-tight">
                                Automated drawing review for <span className="italic text-blue-600">construction contractors</span>
                            </h1>

                            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                                <a
                                    href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2-LisBxMgnCRJ-LKKb-R3pFbF841mGLD05pQdMbsBW-4MJvb0Jy2ksFKVYziMHfKcECrF9yIHt"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-full bg-blue-600 text-white px-8 py-3.5 text-base font-semibold shadow-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                >
                                    Book a demo
                                </a>
                                <a
                                    href="#"
                                    className="rounded-full bg-transparent border-2 border-blue-600 text-blue-600 px-8 py-3.5 text-base font-semibold shadow-lg transition-all duration-200 hover:bg-blue-600 hover:text-white hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                >
                                    Try our product
                                </a>
                            </div>
                        </div>
                        
                        {/* Right side - Video */}
                        <div className="flex justify-center lg:justify-end">
                            <div className="w-full max-w-2xl">
                                <iframe
                                    width="100%"
                                    height="400"
                                    src="https://www.youtube.com/embed/2C4Gfe4UoJA?autoplay=1&mute=1&modestbranding=1&rel=0"
                                    title="ContextFort Demo"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="rounded-lg shadow-xl"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Steps Section */}
                <div className="py-16" data-section="product">
                    <div className="w-full space-y-20">
                        
                        {/* Top Row - RFI Generation and Version Difference (Main Features) */}
                        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                            {/* RFI Generation */}
                            <div className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl">
                                <div className="text-center mb-6">
                                    <div className="flex items-center justify-center gap-4 mb-4">
                                        <h3 className="text-3xl lg:text-4xl font-bold text-black tracking-tight">Automated RFI Generation</h3>
                                    </div>
                                    <div className="text-gray-700 text-lg lg:text-xl mb-4 font-medium">
                                        <p className="mb-2">Automatically identify issues</p>
                                        <p className="text-blue-600">And generate RFIs respecting the spec sheet</p>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="grid gap-6">
                                        <div className="relative backdrop-blur-lg bg-gradient-to-br from-blue-50/80 to-blue-100/80 border border-blue-200/30 rounded-2xl p-4 shadow-xl">
                                            <h4 className="text-xl lg:text-2xl font-bold text-blue-700 mb-3 text-center">Missing Dimensions</h4>
                                            <div className="relative group mb-3">
                                                <Image
                                                    src="/step-7.png"
                                                    alt="Generate RFIs for missing dimensions"
                                                    width={500}
                                                    height={300}
                                                    className="rounded-xl shadow-lg w-full border-2 border-blue-200/50 transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        openModal("/step-7.png", "Generate RFIs for missing dimensions");
                                                    }}
                                                />
                                                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                            </div>
                                            <p className="text-sm lg:text-base text-blue-600 font-medium text-center">Catch missing and inconsistent measurements across architectural and structural drawings</p>
                                        </div>
                                        <div className="relative backdrop-blur-lg bg-gradient-to-br from-blue-50/80 to-blue-100/80 border border-blue-200/30 rounded-2xl p-4 shadow-xl">
                                            <h4 className="text-xl lg:text-2xl font-bold text-blue-700 mb-3 text-center">Overlay Mismatches</h4>
                                            <div className="relative group mb-3">
                                                <Image
                                                    src="/step-8.png"
                                                    alt="Generate RFIs for overlay mismatches"
                                                    width={500}
                                                    height={300}
                                                    className="rounded-xl shadow-lg w-full border-2 border-blue-200/50 transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        openModal("/step-8.png", "Generate RFIs for overlay mismatches");
                                                    }}
                                                />
                                                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                            </div>
                                            <div className="text-sm lg:text-base text-blue-600 font-medium text-center">
                                                <p className="mb-3 font-semibold">Detect conflicts between:</p>
                                                <div className="text-left space-y-2 max-w-md mx-auto">
                                                    <div className="flex items-start gap-2">
                                                        <span className="text-blue-700 font-bold">•</span>
                                                        <span><strong>Layout conflicts:</strong> Different architectural drawings on same layout</span>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <span className="text-blue-700 font-bold">•</span>
                                                        <span><strong>Detail mismatches:</strong> Blow-up details vs main drawings</span>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <span className="text-blue-700 font-bold">•</span>
                                                        <span><strong>Discipline conflicts:</strong> Architectural vs structural plans</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>                            {/* Version Difference */}
                            <div className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl">
                                <div className="text-center mb-6">
                                    <div className="flex items-center justify-center gap-4 mb-4">
                                        <h3 className="text-3xl lg:text-4xl font-bold text-black tracking-tight">Version Control</h3>
                                    </div>
                                    <p className="text-gray-700 text-lg lg:text-xl mb-4 font-medium">Track changes across drawing revisions with precision</p>
                                    <p className="text-blue-600 text-lg lg:text-xl mb-4 font-medium">Eliminate manual Bluebeam eyeballing and ensure zero missed changes</p>
                                </div>
                                <div className="text-center">
                                    <div className="relative backdrop-blur-lg bg-gradient-to-br from-blue-50/80 to-blue-100/80 border border-blue-200/30 rounded-2xl p-6 mb-6 shadow-xl">
                                        <h4 className="text-xl lg:text-2xl font-bold text-blue-700 mb-3">Trade-Specific Changes</h4>
                                        <p className="text-sm lg:text-base text-blue-600 font-medium mb-6">See exactly what changed between versions for your specific trade</p>
                                        <div className="flex flex-wrap justify-center gap-3">
                                            <span className="px-4 py-2 bg-blue-100/80 text-blue-700 rounded-full text-sm lg:text-base font-semibold backdrop-blur-sm border border-blue-200/50 shadow-md">Concrete</span>
                                            <span className="px-4 py-2 bg-blue-100/80 text-blue-700 rounded-full text-sm lg:text-base font-semibold backdrop-blur-sm border border-blue-200/50 shadow-md">Drywall</span>
                                            <span className="px-4 py-2 bg-blue-100/80 text-blue-700 rounded-full text-sm lg:text-base font-semibold backdrop-blur-sm border border-blue-200/50 shadow-md">Metal Framing</span>
                                            <span className="px-4 py-2 bg-blue-100/80 text-blue-700 rounded-full text-sm lg:text-base font-semibold backdrop-blur-sm border border-blue-200/50 shadow-md">Carpentry</span>
                                            <span className="px-4 py-2 bg-blue-100/80 text-blue-700 rounded-full text-sm lg:text-base font-semibold backdrop-blur-sm border border-blue-200/50 shadow-md">Flooring</span>
                                            <span className="px-4 py-2 bg-blue-100/80 text-blue-700 rounded-full text-sm lg:text-base font-semibold backdrop-blur-sm border border-blue-200/50 shadow-md">Electrical</span>
                                            <span className="px-4 py-2 bg-blue-100/80 text-blue-700 rounded-full text-sm lg:text-base font-semibold backdrop-blur-sm border border-blue-200/50 shadow-md">Plumbing</span>
                                            <span className="px-4 py-2 bg-blue-100/80 text-blue-700 rounded-full text-sm lg:text-base font-semibold backdrop-blur-sm border border-blue-200/50 shadow-md">HVAC</span>
                                            <span className="px-4 py-2 bg-blue-100/80 text-blue-700 rounded-full text-sm lg:text-base font-semibold backdrop-blur-sm border border-blue-200/50 shadow-md">Structural</span>
                                        </div>
                                    </div>
                                    <div className="relative group">
                                        <Image
                                            src="/step-9.png"
                                            alt="Version comparison showing trade-specific changes"
                                            width={600}
                                            height={400}
                                            className="rounded-2xl shadow-2xl mx-auto border-4 border-blue-200/50 transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                openModal("/step-9.png", "Version comparison showing trade-specific changes");
                                            }}
                                        />
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Text Section */}
                        <div className="text-center py-8">
                            <div className="max-w-3xl mx-auto">
                                <h2 className="text-3xl lg:text-4xl font-bold text-black mb-4">
                                    Get started in just two simple steps
                                </h2>
                                <p className="text-xl text-gray-600">Upload your drawings and select your trade - we handle the rest</p>
                            </div>
                        </div>

                        {/* Bottom Row - Setup Steps (Smaller) */}
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                            {/* Upload Documents */}
                            <div className="text-center bg-gray-50/80 rounded-xl p-6 shadow-lg">
                                <div className="flex items-center justify-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-gray-700 text-white rounded-full flex items-center justify-center text-lg font-semibold">1</div>
                                    <h3 className="text-2xl font-bold text-black">Upload PDF Drawing Set & Spec Sheet</h3>
                                </div>
                                <p className="text-gray-600 mb-4">Drag and drop your complete architectural and structural drawings and spec sheets</p>
                                <div className="flex justify-center">
                                    <Image
                                        src="/step-3.png"
                                        alt="Upload PDF drawing set"
                                        width={400}
                                        height={280}
                                        className="rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-shadow duration-300"
                                        onClick={() => openModal("/step-3.png", "Upload PDF drawing set")}
                                    />
                                </div>
                            </div>

                            {/* Choose Scope */}
                            <div className="text-center bg-gray-50/80 rounded-xl p-6 shadow-lg">
                                <div className="flex items-center justify-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-gray-700 text-white rounded-full flex items-center justify-center text-lg font-semibold">2</div>
                                    <h3 className="text-2xl font-bold text-black">Select Your Trade</h3>
                                </div>
                                <div className="flex flex-wrap justify-center gap-2 mb-4">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Concrete</span>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Drywall</span>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Metal Framing</span>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Carpentry</span>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Flooring</span>
                                </div>
                                <div className="flex justify-center">
                                    <Image
                                        src="/step-4.png"
                                        alt="Choose scope of work"
                                        width={400}
                                        height={280}
                                        className="rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-shadow duration-300"
                                        onClick={() => openModal("/step-4.png", "Choose scope of work")}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Image Modal */}
            {modalImage && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    onClick={closeModal}
                >
                    <div className="relative max-w-[90vw] max-h-[90vh] p-4">
                        <button
                            onClick={closeModal}
                            className="absolute -top-2 -right-2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                            aria-label="Close modal"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <Image
                            src={modalImage.src}
                            alt={modalImage.alt}
                            width={1200}
                            height={800}
                            className="rounded-xl shadow-2xl max-w-full max-h-full object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </section>
    );
}