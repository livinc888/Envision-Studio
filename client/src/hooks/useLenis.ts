import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useLenis(): void {
  const location = useLocation();

  useEffect(() => {
    // Only enable Lenis on marketing routes, NOT on /app/* dashboard routes
    if (location.pathname.startsWith('/app')) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let lenis: Lenis | null = null;

    try {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.92,
        touchMultiplier: 1.6
      });

      (window as any).__lenis = lenis;

      // Synchronize Lenis smooth scroll updates with GSAP ScrollTrigger
      lenis.on('scroll', ScrollTrigger.update);

      const tickerCallback = (time: number) => {
        lenis?.raf(time * 1000);
      };

      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);

      return () => {
        gsap.ticker.remove(tickerCallback);
        lenis?.destroy();
      };
    } catch {
      // Graceful fallback to native browser smooth scroll
    }
  }, [location.pathname]);
}
