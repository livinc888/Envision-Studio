import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasMovedRef = useRef(false);

  const [cursorState, setCursorState] = useState<'default' | 'pointer' | 'drag' | 'view'>('default');

  useEffect(() => {
    // Disable on touch devices or reduced motion
    if (window.matchMedia('(hover: none) or (pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const container = containerRef.current;
    if (!dot || !ring || !container) return;

    // Center both elements with translate(-50%, -50%)
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

    // Instant zero-latency tracking for central dot
    const dotSetterX = gsap.quickSetter(dot, 'x', 'px');
    const dotSetterY = gsap.quickSetter(dot, 'y', 'px');

    // Snappy, silky smooth tracking for the outer ring (0.1s duration, ultra responsive)
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.1, ease: 'power2.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.1, ease: 'power2.out' });

    const onPointerMove = (e: PointerEvent) => {
      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.15 });
      }

      // Fast synchronous positioning
      dotSetterX(e.clientX);
      dotSetterY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);

      // Detect hover target
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.closest('[data-cursor="drag"]') || target.closest('#image-strip-track')) {
        setCursorState('drag');
      } else if (target.closest('[data-cursor="view"]') || target.closest('.project-row-interactive')) {
        setCursorState('view');
      } else if (
        target.closest('button') ||
        target.closest('a') ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.getAttribute('role') === 'button' ||
        target.classList.contains('cursor-pointer')
      ) {
        setCursorState('pointer');
      } else {
        setCursorState('default');
      }
    };

    const onMouseLeave = () => {
      gsap.to([dot, ring], { opacity: 0, duration: 0.15 });
    };

    const onMouseEnter = () => {
      gsap.to([dot, ring], { opacity: 1, duration: 0.15 });
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Central Red Dot - Instantaneous Response */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 w-2 h-2 rounded-full bg-studio-red pointer-events-none transition-transform duration-75 will-change-transform ${
          cursorState === 'drag' || cursorState === 'view' ? 'scale-0' : 'scale-100'
        }`}
      />

      {/* Outer Smooth Trailing Ring - Snappy & Responsive */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full pointer-events-none flex items-center justify-center transition-[width,height,background-color,border-color,transform] duration-150 will-change-transform ${
          cursorState === 'drag'
            ? 'w-16 h-16 bg-[#E5322B] text-white shadow-glow-red font-mono text-[11px] font-bold tracking-wider uppercase'
            : cursorState === 'view'
            ? 'w-16 h-16 bg-white text-black shadow-paper font-mono text-[11px] font-bold tracking-wider uppercase'
            : cursorState === 'pointer'
            ? 'w-11 h-11 border border-studio-red bg-studio-red/10 scale-105'
            : 'w-7 h-7 border border-white/35 bg-transparent'
        }`}
      >
        {cursorState === 'drag' && <span>Drag</span>}
        {cursorState === 'view' && <span>View</span>}
      </div>
    </div>
  );
};
