import React from 'react';

export const LogoMarquee: React.FC = () => {
  const logos = [
    {
      name: 'Red Bull',
      svg: (
        <div className="flex items-center gap-1.5 font-bold font-sans tracking-tighter text-sm">
          <svg viewBox="0 0 32 20" fill="currentColor" className="h-4 w-auto">
            <path d="M4 14 C8 8, 14 6, 20 8 C16 12, 10 16, 4 14 Z" />
            <circle cx="24" cy="9" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
          <span className="uppercase tracking-widest text-[11px] font-extrabold">RED BULL</span>
        </div>
      )
    },
    {
      name: 'JD',
      svg: (
        <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-current font-black text-xs tracking-tighter">
          JD
        </div>
      )
    },
    {
      name: 'XBOX',
      svg: (
        <div className="flex items-center gap-1.5 font-bold text-xs">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
            <circle cx="12" cy="12" r="10" />
            <path d="M7 7 L17 17 M17 7 L7 17" />
          </svg>
          <span className="font-mono tracking-widest text-xs font-black">XBOX</span>
        </div>
      )
    },
    {
      name: 'HubSpot',
      svg: (
        <div className="flex items-center gap-1 font-bold text-xs tracking-tight">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <circle cx="12" cy="12" r="4" />
            <circle cx="19" cy="8" r="2.5" />
            <path d="M12 12 L19 8" stroke="currentColor" strokeWidth="2" />
          </svg>
          <span className="font-sans font-bold text-xs">HubSpot</span>
        </div>
      )
    },
    {
      name: 'AETHER',
      svg: (
        <div className="flex items-center gap-1.5 font-mono text-xs font-bold tracking-widest">
          <div className="w-2.5 h-2.5 bg-current rotate-45" />
          <span>AETHER</span>
        </div>
      )
    },
    {
      name: 'KRONOS',
      svg: (
        <div className="flex items-center gap-1.5 font-sans text-xs font-black tracking-widest">
          <span>// KRONOS</span>
        </div>
      )
    }
  ];

  return (
    <section className="bg-white text-black py-8 md:py-12 overflow-hidden w-full">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Headline with Geometric Asterisk Icon */}
        <div className="flex items-center gap-3.5 shrink-0 max-w-sm">
          <div className="w-6 h-6 shrink-0 text-black flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
              <line x1="12" y1="2" x2="12" y2="22" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              <line x1="4.93" y1="19.07" x2="19.07" y2="4.93" />
            </svg>
          </div>
          <p className="text-[11px] md:text-xs font-mono font-bold tracking-wider uppercase text-black leading-snug">
            WE&apos;VE DELIVERED 500+ PROJECTS FOR ENTERPRISE &amp; GROWTH BRANDS.
          </p>
        </div>

        {/* Marquee Container */}
        <div className="relative flex-1 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="flex items-center gap-12 sm:gap-16 animate-marquee whitespace-nowrap">
            {[...logos, ...logos, ...logos, ...logos].map((logo, index) => (
              <div
                key={index}
                className="text-zinc-800 hover:text-black transition-colors opacity-80 hover:opacity-100 flex items-center"
              >
                {logo.svg}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
