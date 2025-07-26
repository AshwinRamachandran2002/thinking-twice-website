import React from 'react';
import Image from 'next/image';

const AiAgentsFeature = () => {
  return (
    <section 
      className="relative" 
      style={{
        backgroundColor: 'white',
        backgroundImage: undefined,
        backgroundPosition: undefined,
        backgroundSize: undefined,
        backgroundRepeat: undefined,
      }}
    >
      <div className="container mx-auto px-4 py-24 lg:py-32">
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-12 items-center">
          <div className="flex justify-center md:justify-end">
            <Image
              src="/building.png"
              alt="High-rise building architectural drawing sample"
              width={600}
              height={600}
              className="w-full h-auto max-w-sm sm:max-w-md lg:max-w-lg rounded-lg shadow-xl"
            />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-4xl lg:text-[44px] font-semibold text-black leading-tight mb-5">
              Transform how you review architectural drawings
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed max-w-lg mx-auto md:mx-0">
              Upload plans and let our AI agent instantly analyze, detect issues, and flag drawing conflicts. Save weeks of time, increase build accuracy, and focus on efficient construction instead of tedious document review.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiAgentsFeature;