import Image from 'next/image';

const GtmIntelligenceSection = () => {
  return (
    <section className="bg-dark-background relative overflow-hidden">
      <div className="container py-24 sm:py-32 lg:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-20 items-center">
          
          {/* Text Content */}
          <div className="relative z-10 lg:order-1 order-2 text-center lg:text-left">
            <div className="inline-block mb-4">
              <p className="text-base text-light-gray tracking-[0.15em] uppercase">
                AI Insights
              </p>
            </div>
            <h2 className="text-[40px] sm:text-[48px] font-semibold text-black leading-[1.2] tracking-tight mb-6 max-w-md mx-auto lg:mx-0">
              Full visibility into every drawing and project
            </h2>
            <p className="text-lg text-light-gray max-w-[480px] mx-auto lg:mx-0">
              Instantly access all key details and conflicts within your architectural documents—no more missed issues or overlooked codes. Let AI keep you a step ahead during construction reviews.
            </p>
          </div>

          {/* Image */}
          <div className="relative flex justify-center lg:justify-end items-center lg:order-2 order-1">
            <Image
              src="/blueprint.jpg"
              alt="AI blueprint review for construction"
              width={1200}
              height={700}
              className="relative z-10 w-full max-w-[700px] rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default GtmIntelligenceSection;