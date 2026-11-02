import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';

interface NavbarProps {
  projectCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ projectCount = 10 }) => {
  const navRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const isHiddenRef = useRef(false);
  const [activeSection, setActiveSection] = useState('hero');
  const location = useLocation();

  useEffect(() => {
    // Hide on scroll down, reveal ONLY on scroll up (GSAP)
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (!navRef.current) return;

      const delta = currentScrollY - lastScrollY.current;

      // Always visible near top of page
      if (currentScrollY < 60) {
        if (isHiddenRef.current) {
          gsap.to(navRef.current, { y: 0, duration: 0.35, ease: 'power2.out' });
          isHiddenRef.current = false;
        }
      } else if (delta > 8 && currentScrollY > 100) {
        // Scrolling down -> hide navbar
        if (!isHiddenRef.current) {
          gsap.to(navRef.current, { y: -120, duration: 0.35, ease: 'power2.out' });
          isHiddenRef.current = true;
        }
      } else if (delta < -12) {
        // Scrolling up meaningfully -> reveal navbar
        if (isHiddenRef.current) {
          gsap.to(navRef.current, { y: 0, duration: 0.3, ease: 'power2.out' });
          isHiddenRef.current = false;
        }
      }
      // When scrolling stops (delta between -12 and 8), DO NOT change state!

      lastScrollY.current = currentScrollY;

      // Active section spy
      const sections = ['hero', 'about', 'work', 'services', 'contact'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const pillClass =
    'bg-[#0B0B0B]/85 backdrop-blur-[16px] backdrop-saturate-[1.4] border border-white/[0.08] text-zinc-300 shadow-2xl';

  return (
    <header
      ref={navRef}
      className="fixed top-6 left-0 right-0 z-[100] px-4 md:px-8 max-w-7xl mx-auto flex items-center justify-between pointer-events-none transition-transform"
    >
      {/* Brand Logo Pill */}
      <Link
        to="/"
        className={`pointer-events-auto flex items-center gap-2.5 px-4 py-2 rounded-full ${pillClass} hover:border-white/20 transition-all group`}
      >
        <div className="grid grid-cols-3 gap-0.5 w-4 h-4">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`rounded-[1px] transition-colors ${
                i === 4 || i === 0 || i === 8 ? 'bg-studio-red' : 'bg-white/80 group-hover:bg-white'
              }`}
            />
          ))}
        </div>
        <span className="font-sans font-medium text-sm tracking-tight text-white flex items-center gap-0.5">
          EnvisionStudio<span className="text-[10px] text-zinc-400 font-normal">®</span>
        </span>
      </Link>

      {/* Floating Center Links Pill */}
      <nav
        className={`pointer-events-auto hidden md:flex items-center gap-6 px-6 py-2.5 rounded-full ${pillClass} text-xs font-medium tracking-tight`}
      >
        <a
          href="#hero"
          className={`transition-colors relative py-1 ${
            activeSection === 'hero' ? 'text-white font-semibold' : 'hover:text-white text-zinc-400'
          }`}
        >
          Home
          {activeSection === 'hero' && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-studio-red" />
          )}
        </a>

        <a
          href="#about"
          className={`transition-colors relative py-1 ${
            activeSection === 'about' ? 'text-white font-semibold' : 'hover:text-white text-zinc-400'
          }`}
        >
          Studio
          {activeSection === 'about' && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-studio-red" />
          )}
        </a>

        <a
          href="#work"
          className={`transition-colors flex items-center gap-1.5 relative py-1 ${
            activeSection === 'work' ? 'text-white font-semibold' : 'hover:text-white text-zinc-400'
          }`}
        >
          <span>Work</span>
          <span className="px-1.5 py-0.2 rounded-full bg-studio-red text-white text-[10px] font-mono font-bold leading-none">
            {projectCount}
          </span>
          {activeSection === 'work' && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-studio-red" />
          )}
        </a>

        <a
          href="#services"
          className={`transition-colors relative py-1 ${
            activeSection === 'services' ? 'text-white font-semibold' : 'hover:text-white text-zinc-400'
          }`}
        >
          Services
          {activeSection === 'services' && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-studio-red" />
          )}
        </a>

        <Link
          to="/app"
          className={`transition-colors flex items-center gap-1.5 relative py-1 ${
            location.pathname.startsWith('/app') ? 'text-white font-semibold' : 'hover:text-white text-zinc-400'
          }`}
        >
          <span>Dashboard</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </Link>

        <a
          href="#contact"
          className={`transition-colors relative py-1 ${
            activeSection === 'contact' ? 'text-white font-semibold' : 'hover:text-white text-zinc-400'
          }`}
        >
          Contact
          {activeSection === 'contact' && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-studio-red" />
          )}
        </a>
      </nav>

      {/* Right Action Pill: Book A Intro */}
      <div className="pointer-events-auto flex items-center gap-2">
        <Link
          to="/app"
          className="inline-flex items-center gap-2.5 pl-2 pr-4 py-1.5 rounded-full bg-white hover:bg-zinc-50 text-studio-dark text-xs font-semibold tracking-tight shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-black/10 transition-all active:scale-95 group"
        >
          {/* Real Avatar Image from reference */}
          <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-black/10 bg-zinc-200">
            <img
              src="/images/avatar.jpg"
              alt="Intro Lead"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <span className="font-sans text-studio-dark">Book A Intro</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-studio-dark group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </header>
  );
};
