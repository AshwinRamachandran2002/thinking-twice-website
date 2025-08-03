import Image from 'next/image';

const GtmIntelligenceSection = () => {
  return (
    <div className="flex flex-col">
      {/* Text content */}
      <div className="text-center mb-8">
        <h3 className="text-2xl lg:text-3xl font-semibold text-black leading-tight mb-4">
          Trade-Specific Change Analysis
        </h3>
        <p className="text-base text-gray-600 leading-relaxed">
          Know exactly what changed between two different versions instead of eyeballing it in Bluebeam. We analyze revisions and deliver trade-specific changes, highlighting modifications that impact electrical, plumbing, HVAC, and structural work.
        </p>
      </div>
      
      {/* Animated GIF content */}
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <Image
            src="/animated_screenshots.gif"
            alt="Trade-specific change analysis demo"
            width={400}
            height={250}
            className="w-full h-auto rounded-lg shadow-lg"
            unoptimized
          />
        </div>
      </div>
    </div>
  );
};

export default GtmIntelligenceSection;