import React, { useEffect, useRef } from 'react';
import { SectionTag } from '../common/SectionTag';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const WhoWeAre: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const validWordElements = wordsRef.current.filter(Boolean);

      gsap.fromTo(
        validWordElements,
        { color: '#B3B3B3' },
        {
          color: '#0B0B0B',
          stagger: 0.08,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            end: 'bottom 50%',
            scrub: 0.5
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={containerRef}
      className="bg-white text-black pt-20 pb-8 md:pt-28 md:pb-12 px-6 sm:px-10 lg:px-14 w-full overflow-hidden scroll-mt-36 md:scroll-mt-44"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section Tag */}
        <SectionTag label="Who we are" theme="light" />

        {/* 12-Column Grid: Exact Baseline Alignment from Visual Reference */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          {/* Main Statement spanning exactly 3 lines on desktop */}
          <div className="lg:col-span-9 xl:col-span-9">
            <h2 className="font-sans font-medium text-3xl sm:text-5xl md:text-6xl lg:text-[58px] xl:text-[66px] tracking-[-0.04em] leading-[1.04] text-black select-none">
              <span className="block">
                {['We', 'build', 'search-first', 'digital'].map((w, i) => (
                  <span
                    key={i}
                    ref={(el) => { wordsRef.current[i] = el; }}
                    className="inline-block mr-[0.25em]"
                  >
                    {w}
                  </span>
                ))}
              </span>
              <span className="block">
                {['systems', 'to', 'help', 'category'].map((w, i) => (
                  <span
                    key={i + 4}
                    ref={(el) => { wordsRef.current[i + 4] = el; }}
                    className="inline-block mr-[0.25em]"
                  >
                    {w}
                  </span>
                ))}
                <span className="inline-block mr-[0.25em] text-[#9A9A9A]">
                  leaders
                </span>
              </span>
              <span className="block text-[#9A9A9A]">
                {['lead', 'their', 'industries.'].map((w, i) => (
                  <span key={i} className="inline-block mr-[0.25em]">
                    {w}
                  </span>
                ))}
              </span>
            </h2>
          </div>

          {/* Right Action: Aligned with the bottom baseline of line 3 */}
          <div className="lg:col-span-3 xl:col-span-3 flex lg:justify-end pb-2">
            <a
              href="#services"
              className="group inline-flex items-center gap-2 text-xs md:text-sm font-bold tracking-wider uppercase text-black hover:text-studio-red transition-colors pb-1 border-b-2 border-dotted border-studio-red whitespace-nowrap"
            >
              <span>→ ABOUT THE STUDIO</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
