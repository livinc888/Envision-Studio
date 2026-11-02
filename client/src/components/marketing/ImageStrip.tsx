import React, { useRef, useState } from 'react';

interface VideoTechniquePlate {
  id: string;
  category: string;
  title: string;
  subhead: string;
  description: string;
  videoSrc: string;
  poster: string;
  statNum: string;
  statLabel: string;
  statSub: string;
  specs: Record<string, string>;
  tech: string[];
  accentColor: string;
  isTall: boolean;
}

export const ImageStrip: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const velocityRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  // 6 Motion Video Powered Project Architecture & Solving Techniques
  const techniques: VideoTechniquePlate[] = [
    {
      id: '01',
      category: 'E-COMMERCE & TOKEN ARCHITECTURE',
      title: 'Checkout Velocity',
      subhead: 'Sub-Second Token Architecture',
      description:
        'Eliminating purchase friction with unified React 18 concurrent token caching, PCI-DSS Level 1 compliance, and zero-jank checkout transitions.',
      videoSrc: '/videos/checkout-velocity.mp4',
      poster: '/images/plate-01-checkout.jpg',
      statNum: '1.4s',
      statLabel: 'MEDIAN CHECKOUT VELOCITY',
      statSub: '-34.8% CART ABANDONMENT',
      specs: {
        LATENCY: '140ms p95 Global Edge',
        SECURITY: 'PCI-DSS Level 1'
      },
      tech: ['React 18', 'Stripe Tokens', 'Edge Cache'],
      accentColor: '#E5322B', // Studio Red
      isTall: true
    },
    {
      id: '02',
      category: 'BIOMETRIC TELEMETRY & SENSORS',
      title: 'Telemetry Stream',
      subhead: 'Real-Time Sensor Pipeline',
      description:
        'Continuous low-power sensor telemetry streaming 142 BPM biometric signals with offline-first local cache synchronization and gesture arbitration.',
      videoSrc: '/videos/light-streaks.mp4',
      poster: '/images/plate-02-telemetry.jpg',
      statNum: '60 FPS',
      statLabel: 'ZERO-LAG GESTURE THREAD',
      statSub: '142 BPM LIVE SENSOR STREAM',
      specs: {
        FRAME: '< 16.6ms Render Frame',
        SYNC: 'Offline-First Local Cache'
      },
      tech: ['React Native', 'Swift Engine', 'Biometrics'],
      accentColor: '#10B981', // Mint Green
      isTall: false
    },
    {
      id: '03',
      category: 'SPATIAL GRID & DESIGN TOKENS',
      title: 'Spatial Grid',
      subhead: 'Fibonacci 8pt Token Matrix',
      description:
        'Architectural design system governed by golden ratio proportional rhythm. Fluid typography scales dynamically while preserving mathematical harmony.',
      videoSrc: '/videos/laptop-screen.mp4',
      poster: '/images/plate-03-spatial.jpg',
      statNum: '8 PT',
      statLabel: 'FLUID GEOMETRIC BASELINE',
      statSub: '1.618 GOLDEN SECTION',
      specs: {
        BASE: '8.000px Fluid Baseline',
        PARITY: '100% Cross-Platform'
      },
      tech: ['Design Tokens', 'Geist Grotesk', 'Figma API'],
      accentColor: '#F59E0B', // Amber
      isTall: true
    },
    {
      id: '04',
      category: 'FINTECH PROTOCOL & SETTLEMENT',
      title: 'Fintech Ledger',
      subhead: '256-Bit Settlement Engine',
      description:
        'High-throughput payment gateway settlement layer with end-to-end cryptographic audit trails. Processing automated webhooks with zero-drift balance sync.',
      videoSrc: '/videos/fintech-ledger.mp4',
      poster: '/images/plate-04-fintech.jpg',
      statNum: '28 ms',
      statLabel: 'GLOBAL SETTLEMENT VELOCITY',
      statSub: '99.999% WEBHOOK DELIVERY',
      specs: {
        CIPHER: 'AES-256-GCM Cryptographic',
        THROUGHPUT: '14.8k Tx / Sec Burst'
      },
      tech: ['Node.js', 'Express', 'AES-256', 'Webhooks'],
      accentColor: '#3B82F6', // Blue
      isTall: false
    },
    {
      id: '05',
      category: 'SPATIAL INTERFACES & DYNAMICS',
      title: 'Fluid Systems',
      subhead: 'Dynamic Interface Architecture',
      description:
        'Multi-layered spatial canvas architecture with GPU-accelerated motion vectors and responsive WebGL fluid dynamics for award-grade tactile responsiveness.',
      videoSrc: '/videos/interface-fluid.mp4',
      poster: '/images/plate-05-socket.jpg',
      statNum: '12 ms',
      statLabel: 'FRAME DISPATCH LATENCY',
      statSub: 'GPU FLUID VECTOR SHADER',
      specs: {
        PIPELINE: 'WebGL 2.0 Fragment Shader',
        FIDELITY: 'Native 120Hz ProMotion'
      },
      tech: ['Three.js', 'GLSL Shaders', 'WebGL 2.0'],
      accentColor: '#E5322B', // Studio Red
      isTall: true
    },
    {
      id: '06',
      category: 'CORE WEB VITALS & EDGE RUNTIME',
      title: 'Search Index',
      subhead: 'Sub-Second Edge Rendering',
      description:
        'Zero-overhead edge rendering generating pristine semantic HTML and structured JSON-LD schemas to dominate competitive category search intent.',
      videoSrc: '/videos/showreel.mp4',
      poster: '/images/plate-06-search.jpg',
      statNum: '100',
      statLabel: 'LIGHTHOUSE SPEED & SEO',
      statSub: '+218% ORGANIC INTENT CAPTURE',
      specs: {
        TTI: '0.42s Time-to-Interactive',
        SCHEMA: '100% Schema.org Validated'
      },
      tech: ['Semantic HTML', 'JSON-LD', 'Edge Cache'],
      accentColor: '#10B981', // Mint Green
      isTall: false
    }
  ];

  // Drag-to-scroll with momentum physics
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);

    lastXRef.current = e.pageX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();

    const currentX = e.pageX;
    const currentTime = performance.now();
    const dt = currentTime - lastTimeRef.current;

    if (dt > 0) {
      velocityRef.current = (currentX - lastXRef.current) / dt;
    }

    lastXRef.current = currentX;
    lastTimeRef.current = currentTime;

    const x = currentX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.35;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const endDrag = () => {
    if (!isDragging || !containerRef.current) return;
    setIsDragging(false);

    let currentVel = velocityRef.current * 16;
    const stepInertia = () => {
      if (Math.abs(currentVel) > 0.4 && containerRef.current) {
        containerRef.current.scrollLeft -= currentVel;
        currentVel *= 0.92;
        animFrameRef.current = requestAnimationFrame(stepInertia);
      }
    };
    animFrameRef.current = requestAnimationFrame(stepInertia);
  };

  // 3D perspective mouse tilt on hover
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-6px)`;
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)';
  };

  return (
    <section id="image-strip" className="bg-white pt-4 pb-14 md:pt-6 md:pb-20 overflow-hidden w-full select-none">
      {/* Draggable Viewport Bleeding Off Both Edges */}
      <div
        id="image-strip-track"
        data-cursor="drag"
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={endDrag}
        onMouseUp={endDrag}
        onMouseMove={handleMouseMove}
        className={`flex items-end gap-6 md:gap-7 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing px-6 sm:px-10 lg:px-14 transition-transform duration-200 ${
          isDragging ? 'scale-[0.99]' : 'scale-100'
        }`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {techniques.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-start gap-3 shrink-0 group"
          >
            {/* Bespoke Video + Telemetry Specimen Card */}
            <div
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              className={`relative shrink-0 w-[300px] sm:w-[340px] md:w-[370px] rounded-[26px] bg-[#0A0A0D] overflow-hidden border border-white/10 hover:border-white/25 shadow-[0_20px_50px_rgba(0,0,0,0.45)] transition-all duration-300 ease-out flex flex-col justify-between ${
                item.isTall ? 'h-[470px] sm:h-[510px] md:h-[530px]' : 'h-[415px] sm:h-[455px] md:h-[475px]'
              }`}
              style={{
                isolation: 'isolate',
                transform: 'translateZ(0)',
                WebkitBackfaceVisibility: 'hidden'
              }}
            >
              {/* Looping Motion Video Layer */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <video
                  src={item.videoSrc}
                  poster={item.poster}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover scale-[1.03] transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Multi-Stage Dark Scrim Gradient for Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0D] via-[#0A0A0D]/75 to-black/35 pointer-events-none" />
                <div className="absolute inset-0 bg-black/25 pointer-events-none" />
              </div>

              {/* Ambient Colored Radial Flare */}
              <div
                className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-30 z-10"
                style={{ backgroundColor: item.accentColor }}
              />

              {/* Card Top: Plate Tag & Live Telemetry Badge */}
              <div className="relative z-20 p-6 pb-0 space-y-2">
                <div className="flex items-center justify-between border-b border-white/15 pb-2.5 backdrop-blur-xs">
                  <span
                    className="font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                    style={{ color: item.accentColor }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: item.accentColor }} />
                    PLATE // {item.id}
                  </span>

                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 font-mono text-[9px] text-zinc-300 uppercase tracking-widest">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                    LIVE MOTION
                  </span>
                </div>

                <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-300 drop-shadow-sm font-medium">
                  {item.category}
                </div>
              </div>

              {/* Card Center: Typographic Headline & Architectural Statement */}
              <div className="relative z-20 px-6 my-auto py-2 space-y-2">
                <h3 className="font-sans font-medium text-2xl sm:text-[28px] text-white tracking-tight leading-tight group-hover:text-studio-red transition-colors drop-shadow-md">
                  {item.title}
                </h3>

                <div
                  className="font-mono text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: item.accentColor }}
                >
                  {item.subhead}
                </div>

                <p className="font-sans text-xs text-zinc-200 leading-relaxed line-clamp-3 drop-shadow-sm">
                  {item.description}
                </p>
              </div>

              {/* Card Bottom: Plain Text Metric Box & Spec Table */}
              <div className="relative z-20 p-6 pt-3 space-y-3 border-t border-white/15 bg-black/40 backdrop-blur-md">
                {/* Big Typographic Stat Block */}
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 space-y-1">
                  <div className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">
                    {item.statLabel}
                  </div>
                  <div
                    className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white flex items-baseline gap-2"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    <span>{item.statNum}</span>
                    <span
                      className="text-[10px] font-mono font-bold tracking-wider uppercase"
                      style={{ color: item.accentColor }}
                    >
                      {item.statSub}
                    </span>
                  </div>
                </div>

                {/* Technical Monospace Specs Grid */}
                <div className="space-y-1 font-mono text-[10px] text-zinc-300">
                  {Object.entries(item.specs).slice(0, 2).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-zinc-400 uppercase">[{key}]</span>
                      <span className="text-zinc-100 font-semibold">{val}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  {item.tech.map((t, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded-md bg-black/60 border border-white/10 font-mono text-[9px] text-zinc-300 font-semibold"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Mono Caption Under Card */}
            <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500 uppercase tracking-widest pl-1">
              <span className="font-bold text-black">{item.id}</span>
              <span>/</span>
              <span className="text-zinc-800 group-hover:text-studio-red transition-colors font-semibold">
                {item.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
