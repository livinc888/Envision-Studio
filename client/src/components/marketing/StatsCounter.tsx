import React, { useEffect, useState, useRef } from 'react';
import { SectionTag } from '../common/SectionTag';

interface StatItem {
  id: number;
  target: number;
  suffix: string;
  label: string;
  description: string;
}

export const StatsCounter: React.FC = () => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const stats: StatItem[] = [
    {
      id: 1,
      target: 1,
      suffix: '%',
      label: 'Expert-Vetted',
      description: 'Recognized in the top 1% of creative partners for consistent quality, trust, and expertise.'
    },
    {
      id: 2,
      target: 30,
      suffix: '+',
      label: 'Clients served',
      description: 'From high-growth startups to enterprise giants — each treated like our sole priority.'
    },
    {
      id: 3,
      target: 100,
      suffix: '%',
      label: 'Success Score',
      description: 'All 5-star reviews. Relentless design fidelity with zero compromises on performance.'
    },
    {
      id: 4,
      target: 8,
      suffix: '+',
      label: 'Years of expertise',
      description: 'Deep mastery in design systems, product strategy, and scalable full-stack engineering.'
    }
  ];

  // Initialize with target values so they are never blank
  const [counts, setCounts] = useState<number[]>(stats.map((s) => s.target));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    const duration = 1400; // ms
    const startTime = performance.now();

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - (1 - progress) * (1 - progress);

      setCounts(stats.map((s) => Math.round(s.target * ease)));

      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    };

    requestAnimationFrame(frame);
  }, [hasAnimated]);

  return (
    <section
      id="numbers"
      ref={sectionRef}
      className="bg-white text-black py-12 md:py-20 px-6 md:px-12 w-full"
    >
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Tag */}
        <SectionTag label="By the numbers" theme="light" />

        {/* 4 Stats Grid with Dotted Dividers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, i) => (
            <div key={stat.id} className="relative flex flex-col justify-between">
              <div>
                {/* Huge Stat Numeral */}
                <div className="text-5xl sm:text-6xl md:text-7xl font-bold font-sans tracking-tight text-black">
                  {counts[i]}
                  <span className="text-studio-red font-light">{stat.suffix}</span>
                </div>

                {/* 1px Dotted Divider underneath */}
                <div className="w-full my-4 border-b border-dotted border-studio-red/50" />

                {/* Stat Label */}
                <h3 className="text-base font-semibold text-black tracking-tight">
                  {stat.label}
                </h3>
              </div>

              {/* Description */}
              <p className="mt-2 text-xs text-zinc-600 leading-relaxed">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
