import React from 'react';
import Image from 'next/image';

const AiAgentsFeature = () => {
  return (
    <div className="flex flex-col">
      {/* Text content */}
      <div className="text-center mb-8">
        <h3 className="text-2xl lg:text-3xl font-semibold text-black leading-tight mb-4">
          Find Missing Dimensions & Overlay Conflicts
        </h3>
        <p className="text-base text-gray-600 leading-relaxed">
          Upload your drawing sets and automatically discover missing dimensions and overlay mismatches between architectural and structural drawings. Our AI instantly identifies discrepancies that could cause costly construction delays.
        </p>
      </div>
      
      {/* Video content */}
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <iframe
            width="100%"
            height="250"
            src="https://www.youtube.com/embed/2C4Gfe4UoJA"
            title="ContextFort Demo"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg shadow-lg"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default AiAgentsFeature;