import React, { useState, useRef, useEffect } from 'react';
import { SectionTag } from '../common/SectionTag';
import { ArrowUpRight } from 'lucide-react';

interface ServiceItem {
  number: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  previewImage: string;
  isVideo?: boolean;
  videoSrc?: string;
  previewGradient: string;
  accentColor: string;
}

export const ServicesList: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0); // Row 01 open by default
  const previewRef = useRef<HTMLDivElement>(null);

  // Mouse lerp tracking for floating thumbnail using fixed viewport coordinates
  const mousePos = useRef({ x: -500, y: -500 });
  const targetPos = useRef({ x: -500, y: -500 });
  const animFrame = useRef<number | null>(null);

  const services: ServiceItem[] = [
    {
      number: '01',
      title: 'Branding & Systems',
      category: 'Visual Identity / Design Tokens / Brand Voice',
      description: 'Authoritative visual identities, systematic design tokens, and scalable brand architecture engineered for venture-scale category leaders.',
      tags: ['Identity Systems', 'Design Tokens', 'Typography Spec', 'Motion Language'],
      previewImage: '/images/showreel-poster.jpg',
      isVideo: true,
      videoSrc: '/videos/showreel.mp4',
      previewGradient: 'from-[#E5322B] via-[#991B1B] to-[#18181B]',
      accentColor: '#E5322B'
    },
    {
      number: '02',
      title: 'UI/UX Design',
      category: 'Design Systems / High-Fidelity Prototypes / Usability',
      description: 'High-conversion product flows, interactive clickable prototypes, and intuitive multi-platform digital interfaces rigorously tested with users.',
      tags: ['Figma Prototyping', 'Design Sprints', 'User Research', 'Micro-interactions'],
      previewImage: '/images/project-2.jpg',
      previewGradient: 'from-blue-600 via-indigo-900 to-black',
      accentColor: '#3B82F6'
    },
    {
      number: '03',
      title: 'Web Development',
      category: 'React / Next.js / Interactive WebGL / Headless CMS',
      description: 'Ultra-fast, search-indexed web platforms with WebGL visual fidelity, zero-jank frame rates, and resilient headless API integrations.',
      tags: ['React & Next.js', 'Interactive WebGL', 'Headless CMS', 'Lighthouse 100'],
      previewImage: '/images/project-1.jpg',
      previewGradient: 'from-emerald-600 via-teal-900 to-black',
      accentColor: '#10B981'
    },
    {
      number: '04',
      title: 'Mobile Applications',
      category: 'iOS & Android / React Native / Gestural Flow',
      description: 'Fluid cross-platform iOS & Android mobile applications engineered with native speed, offline cache resilience, and biometric security.',
      tags: ['React Native', 'Swift & Kotlin', 'Offline Sync', 'App Store Prep'],
      previewImage: '/images/project-4.jpg',
      previewGradient: 'from-purple-600 via-pink-900 to-black',
      accentColor: '#A855F7'
    },
    {
      number: '05',
      title: 'Growth & Search Experience',
      category: 'Technical SEO / Conversion Optimization / Analytics',
      description: 'Deep technical SEO indexation, semantic structured data schemas, and rigorous conversion rate engineering to dominate organic search.',
      tags: ['Core Web Vitals', 'Structured Data', 'CRO Experimentation', 'Analytics Engine'],
      previewImage: '/images/project-3.jpg',
      previewGradient: 'from-amber-600 via-orange-900 to-black',
      accentColor: '#F59E0B'
    }
  ];

  // Track global pointer coordinates so targetPos is always accurate
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      if (mousePos.current.x === -500) {
        mousePos.current = { x: e.clientX, y: e.clientY };
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  // Smooth fluid lerp loop with viewport collision detection
  useEffect(() => {
    const loop = () => {
      mousePos.current.x += (targetPos.current.x - mousePos.current.x) * 0.18;
      mousePos.current.y += (targetPos.current.y - mousePos.current.y) * 0.18;

      if (previewRef.current) {
        const cardWidth = 280;
        const cardHeight = 176;
        let posX = mousePos.current.x + 24;
        let posY = mousePos.current.y - 88;

        // Flip to left if near right window edge
        if (posX + cardWidth > window.innerWidth - 24) {
          posX = mousePos.current.x - cardWidth - 24;
        }

        // Clamp vertically within screen
        if (posY < 16) posY = 16;
        else if (posY + cardHeight > window.innerHeight - 16) {
          posY = window.innerHeight - cardHeight - 16;
        }

        previewRef.current.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
      }

      animFrame.current = requestAnimationFrame(loop);
    };

    animFrame.current = requestAnimationFrame(loop);
    return () => {
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, []);

  const handleRowClick = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section
      id="services"
      className="relative bg-[#0B0B0B] text-white py-16 md:py-32 px-4 sm:px-6 md:px-12 overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header Tag and Asymmetric Intro */}
        <div className="space-y-6">
          <SectionTag label="Services" />

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            {/* Title with Inline Rounded Image Pill */}
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-white flex items-center flex-wrap gap-3">
              <span>Our</span>
              {/* Inline Pill */}
              <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-gradient-to-r from-studio-red to-orange-500 text-xs font-mono font-bold tracking-widest uppercase shadow-glow-red align-middle text-white">
                Digital
              </span>
              <span>Services</span>
            </h2>

            {/* Strategic Summary on Right */}
            <p className="text-xs md:text-sm text-zinc-400 max-w-md leading-relaxed">
              We craft high-impact digital experiences through strategic design, seamless coding, and creative engineering.
            </p>
          </div>
        </div>

        {/* Numbered Services Rows with Dotted Lines */}
        <div className="relative divide-y divide-dotted divide-white/20 border-y border-dotted border-white/20">
          {services.map((item, index) => {
            const isHovered = hoveredIndex === index;
            const isExpanded = expandedIndex === index;

            return (
              <div
                key={item.number}
                onClick={() => handleRowClick(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`py-7 md:py-9 px-3 group cursor-pointer transition-all duration-300 ${
                  isHovered || isExpanded ? 'bg-white/[0.03]' : 'hover:bg-white/[0.015]'
                }`}
              >
                {/* Main Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-6 md:gap-10">
                    {/* JetBrains Mono Number [01] */}
                    <span
                      className={`text-xs md:text-sm font-mono transition-colors font-bold ${
                        isHovered || isExpanded ? 'text-studio-red' : 'text-zinc-500 group-hover:text-studio-red'
                      }`}
                    >
                      [{item.number}]
                    </span>

                    {/* Service Title */}
                    <h3
                      className={`text-xl sm:text-2xl md:text-4xl font-medium tracking-tight transition-all duration-200 ${
                        isHovered || isExpanded
                          ? 'text-studio-red translate-x-1.5'
                          : 'text-white group-hover:text-studio-red group-hover:translate-x-1'
                      }`}
                    >
                      {item.title}
                    </h3>
                  </div>

                  {/* Sub-label & Rotating Arrow */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 text-xs text-zinc-400 font-mono">
                    <span className="group-hover:text-zinc-200 transition-colors hidden md:block">
                      {item.category}
                    </span>
                    <span
                      className={`p-2.5 rounded-full border transition-all duration-300 ${
                        isHovered || isExpanded
                          ? 'border-studio-red bg-studio-red text-white'
                          : 'border-white/10 group-hover:border-studio-red group-hover:bg-studio-red group-hover:text-white'
                      }`}
                    >
                      <ArrowUpRight
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isHovered || isExpanded ? 'rotate-90' : 'group-hover:rotate-45'
                        }`}
                      />
                    </span>
                  </div>
                </div>

                {/* Expanded Drawer Content: Description & Pill Tag List */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-out pl-12 md:pl-16 ${
                    isExpanded || isHovered ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
                  }`}
                >
                  <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed mb-3">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    {item.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-zinc-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Viewport-Anchored Artwork & Video Preview Card */}
      <div
        ref={previewRef}
        className={`pointer-events-none fixed top-0 left-0 hidden md:block w-72 h-44 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.85)] z-50 border border-white/20 transition-opacity duration-200 will-change-transform ${
          hoveredIndex !== null ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        style={{ willChange: 'transform, opacity' }}
      >
        {hoveredIndex !== null && (
          <div className="relative w-full h-full bg-[#0E0E12] overflow-hidden">
            {/* Visual Media: Loop Video for Branding & Systems, High-Res Project Visual for Others */}
            {services[hoveredIndex].isVideo && services[hoveredIndex].videoSrc ? (
              <video
                src={services[hoveredIndex].videoSrc}
                poster={services[hoveredIndex].previewImage}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={services[hoveredIndex].previewImage}
                alt={services[hoveredIndex].title}
                className="w-full h-full object-cover"
              />
            )}

            {/* Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/40 pointer-events-none" />

            {/* Top Telemetry Header */}
            <div className="absolute top-2.5 inset-x-3 flex items-center justify-between text-[10px] font-mono pointer-events-none">
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white">
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: services[hoveredIndex].accentColor }}
                />
                <span className="font-bold tracking-wider">{services[hoveredIndex].number} / STUDIO</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-zinc-300 font-mono">
                {services[hoveredIndex].isVideo ? 'SHOWREEL' : 'SPECIMEN'}
              </span>
            </div>

            {/* Bottom Title & Category */}
            <div className="absolute bottom-2.5 inset-x-3 pointer-events-none">
              <div className="text-white font-bold text-xs tracking-tight drop-shadow-md">
                {services[hoveredIndex].title}
              </div>
              <div className="text-[10px] text-zinc-400 font-mono truncate mt-0.5">
                {services[hoveredIndex].category}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
