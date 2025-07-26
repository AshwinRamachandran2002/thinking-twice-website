import Image from 'next/image';

const logos = [
  {
    src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/42fb16c2-4ff2-4f82-a987-5a423f080c26-orangeslice-ai/assets/images/mortgage-2.svg?',
    alt: 'USA Mortgage Partners',
    width: 204,
    height: 40,
    className: 'h-9 w-auto', // 36px
  },
  {
    src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/42fb16c2-4ff2-4f82-a987-5a423f080c26-orangeslice-ai/assets/images/pirros-3.svg?',
    alt: 'Pirros',
    width: 115,
    height: 31,
    className: 'h-7 w-auto', // 28px
  },
  {
    src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/42fb16c2-4ff2-4f82-a987-5a423f080c26-orangeslice-ai/assets/images/tour-4.svg?',
    alt: 'Tour',
    width: 105,
    height: 34,
    className: 'h-8 w-auto', // 32px
  },
  {
    src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/42fb16c2-4ff2-4f82-a987-5a423f080c26-orangeslice-ai/assets/images/full-novoflow-white-5.png?',
    alt: 'Novoflow',
    width: 1373,
    height: 281,
    className: 'h-7 w-auto', // 28px
  },
];

const CustomerLogos = () => {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 pt-8 pb-16 sm:pb-24">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-8 sm:gap-x-16">
          {logos.map((logo) => (
            <Image
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              className={`${logo.className} object-contain opacity-80 transition-opacity duration-300 hover:opacity-100`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerLogos;
