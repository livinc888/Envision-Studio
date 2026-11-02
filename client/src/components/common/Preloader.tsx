import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [shouldRender, setShouldRender] = useState(() => {
    if (typeof window === 'undefined') return true;
    if (sessionStorage.getItem('envision_preloaded')) return false;
    if (
      window.location.search.includes('skipPreloader=true') ||
      window.location.search.includes('snapshot=true')
    ) {
      return false;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return true;
  });

  useEffect(() => {
    if (!shouldRender) {
      onComplete();
      return;
    }

    const counterObj = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem('envision_preloaded', 'true');
        setShouldRender(false);
        onComplete();
      }
    });

    // Count up 000 -> 100 in ~1.0s
    tl.to(counterObj, {
      value: 100,
      duration: 1.0,
      ease: 'power2.inOut',
      onUpdate: () => {
        setCount(Math.round(counterObj.value));
      }
    });

    // Curtain wipe up
    tl.to(containerRef.current, {
      yPercent: -100,
      duration: 0.65,
      ease: 'power4.inOut'
    }, '+=0.1');

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (!shouldRender) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100000] bg-[#0A0A0C] flex flex-col justify-between p-8 md:p-14 select-none"
    >
      {/* Top branding */}
      <div className="flex items-center gap-3">
        <span className="w-2.5 h-2.5 rounded-[2px] bg-studio-red" />
        <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest font-semibold">
          EnvisionStudio® / Next-Gen Digital
        </span>
      </div>

      {/* Center Giant Count */}
      <div className="my-auto">
        <div className="font-mono font-bold text-7xl sm:text-9xl md:text-[140px] tracking-tight text-white flex items-baseline gap-2">
          <span>{String(count).padStart(3, '0')}</span>
          <span className="text-studio-red text-3xl sm:text-5xl md:text-6xl font-light">%</span>
        </div>
        <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mt-2">
          Initializing design systems &amp; orbital runtime
        </p>
      </div>

      {/* Bottom Progress Bar */}
      <div className="w-full">
        <div className="w-full h-[2px] bg-white/10 overflow-hidden">
          <div
            className="h-full bg-studio-red transition-all duration-75"
            style={{ width: `${count}%` }}
          />
        </div>
      </div>
    </div>
  );
};

