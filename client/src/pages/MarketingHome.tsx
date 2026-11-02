import React, { Suspense, lazy, useState } from 'react';
import { Navbar } from '../components/marketing/Navbar';
import { HeroSection } from '../components/marketing/HeroSection';
import { LogoMarquee } from '../components/marketing/LogoMarquee';
import { WhoWeAre } from '../components/marketing/WhoWeAre';
import { ImageStrip } from '../components/marketing/ImageStrip';
import { StatsCounter } from '../components/marketing/StatsCounter';
import { ServicesList } from '../components/marketing/ServicesList';
import { FeaturedWork } from '../components/marketing/FeaturedWork';
import { FooterCTA } from '../components/marketing/FooterCTA';
import { Preloader } from '../components/common/Preloader';

// Lazy-load Three.js Hero Shader for high performance
const HeroShaderCanvas = lazy(() =>
  import('../components/three/HeroShaderCanvas').then((mod) => ({
    default: mod.HeroShaderCanvas
  }))
);

export const MarketingHome: React.FC = () => {
  const [, setPreloaded] = useState(false);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const scrollTarget = params.get('scrollTo');
    if (scrollTarget) {
      const doScroll = () => {
        const lenis = (window as any).__lenis;
        if (lenis) {
          lenis.scrollTo(`#${scrollTarget}`, { immediate: true });
        } else {
          const el = document.getElementById(scrollTarget);
          if (el) {
            el.scrollIntoView({ behavior: 'instant', block: 'start' });
          }
        }
      };
      doScroll();
      setTimeout(doScroll, 80);
      setTimeout(doScroll, 250);
    }
  }, []);

  return (
    <>
      {/* 1.2s Preloader with Curtain Wipe */}
      <Preloader onComplete={() => setPreloaded(true)} />

      {/* Outer Backdrop: Deep Red-to-Black gradient frame with 16-24px gutter at 1280px and above */}
      <div className="min-h-screen w-full overflow-x-clip bg-[#0B0B0B] xl:bg-gradient-to-b xl:from-[#C1272D] xl:via-[#220708] xl:to-[#0A0A0A] xl:p-5 2xl:p-6 font-sans selection:bg-studio-red selection:text-white">
        {/* Rounded 28px Canvas on Desktop (1280px+), Edge-to-edge on Mobile/Tablet */}
        <div className="relative w-full max-w-[1520px] mx-auto bg-[#0B0B0B] xl:rounded-[28px] overflow-hidden xl:border xl:border-white/10 xl:shadow-2xl">
          {/* Floating Sticky Navbar */}
          <Navbar projectCount={10} />

          {/* Hero Section with Lazy Three.js WebGL Shader */}
          <HeroSection>
            <Suspense fallback={null}>
              <HeroShaderCanvas />
            </Suspense>
          </HeroSection>

          {/* Infinite Two-Row Logo Marquee */}
          <LogoMarquee />

          {/* Section Transition: Stacked Paper Sheet 1 (Light: Who We Are + Image Strip + Stats) */}
          <div className="relative z-10 rounded-t-[28px] -mt-6 sm:-mt-8 shadow-[0_-15px_30px_rgba(0,0,0,0.12)] bg-white overflow-hidden">
            {/* Who We Are */}
            <WhoWeAre />

            {/* Motion-Blur Portrait Image Strip */}
            <ImageStrip />

            {/* By The Numbers (Counter Animation with Tabular Figures) */}
            <StatsCounter />
          </div>

          {/* Section Transition: Stacked Paper Sheet 2 (Dark: Our Services) */}
          <div className="relative z-20 rounded-t-[28px] -mt-6 sm:-mt-8 shadow-[0_-15px_35px_rgba(0,0,0,0.4)] bg-[#0B0B0B] overflow-hidden">
            <ServicesList />
          </div>

          {/* Section Transition: Stacked Paper Sheet 3 (Light: Featured Work) */}
          <div className="relative z-30 rounded-t-[28px] -mt-6 sm:-mt-8 shadow-[0_-15px_30px_rgba(0,0,0,0.12)] bg-white overflow-hidden">
            <FeaturedWork />
          </div>

          {/* Section Transition: Stacked Paper Sheet 4 (Dark: Footer & Final CTA) */}
          <div className="relative z-40 rounded-t-[28px] -mt-6 sm:-mt-8 shadow-[0_-15px_40px_rgba(0,0,0,0.5)] bg-[#0B0B0B] overflow-hidden">
            <FooterCTA />
          </div>
        </div>
      </div>
    </>
  );
};
