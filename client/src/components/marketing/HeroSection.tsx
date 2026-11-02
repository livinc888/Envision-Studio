import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { SectionTag } from '../common/SectionTag';
import { Button } from '../common/Button';
import { Play, Pause, Volume2, VolumeX, Maximize2, X, Sparkles } from 'lucide-react';
import gsap from 'gsap';

interface HeroSectionProps {
  children?: React.ReactNode;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ children }) => {
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isReelOpen, setIsReelOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Check URL query param for direct showreel opening
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('openReel') === 'true') {
      setIsReelOpen(true);
    }
  }, []);

  // Close on Escape & Lock body scroll
  useEffect(() => {
    if (!isReelOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsReelOpen(false);
      } else if (e.code === 'Space' && videoRef.current) {
        e.preventDefault();
        if (videoRef.current.paused) {
          videoRef.current.play();
          setIsPlaying(true);
        } else {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isReelOpen]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const seekTime = Number(e.target.value);
    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${String(mins).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
  };

  useEffect(() => {
    // Masked line-by-line reveal animation
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      gsap.fromTo(
        [line1Ref.current, line2Ref.current],
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.15,
          ease: 'power3.out',
          delay: 0.2
        }
      );

      gsap.fromTo(
        bottomBarRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.6, ease: 'power2.out' }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section id="hero" className="relative pt-20 pb-6 md:pt-24 md:pb-8 px-3 sm:px-6 lg:px-8 max-w-[1440px] mx-auto w-full">
        {/* Large Rounded Hero Card */}
        <div className="relative min-h-[580px] md:min-h-[660px] rounded-3xl md:rounded-[28px] overflow-hidden bg-[#0A0A0C] border border-white/10 shadow-2xl flex flex-col justify-between p-6 sm:p-10 md:p-14 group">
          {/* Real Reference Motion-Blurred Figure + Three.js WebGL Layer */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <img
              src="/images/hero-bg.jpg"
              alt="Studio Motion Hero"
              className="w-full h-full object-cover object-center opacity-30 filter blur-[1px] scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/50 to-transparent" />
            {children}
          </div>

          {/* Top Section Tag & Telemetry Bar */}
          <div className="relative z-10 pt-4 md:pt-6 flex items-center justify-between">
            <SectionTag label="Next-Gen Digital Studio" />

            <div className="flex items-center gap-3">
              {/* Watch Reel Trigger Pill */}
              <button
                onClick={() => setIsReelOpen(true)}
                className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-studio-red/20 border border-white/10 hover:border-studio-red/40 text-[11px] font-mono text-zinc-300 hover:text-white transition-all shadow-sm"
              >
                <span className="w-4 h-4 rounded-full bg-studio-red flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                  <Play className="w-2 h-2 fill-current translate-x-0.2" />
                </span>
                <span className="font-semibold uppercase tracking-wider">Play Reel [01:24]</span>
                {/* Live soundwave equalizer bars */}
                <span className="flex items-end gap-0.5 h-2.5 px-0.5">
                  <span className="w-0.5 h-full bg-studio-red rounded-full animate-[pulse_0.8s_ease-in-out_infinite]" />
                  <span className="w-0.5 h-2/3 bg-studio-red rounded-full animate-[pulse_1.1s_ease-in-out_infinite]" />
                  <span className="w-0.5 h-4/5 bg-studio-red rounded-full animate-[pulse_0.6s_ease-in-out_infinite]" />
                </span>
              </button>

              {/* Availability Indicator */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Q3 / Q4 Select Partners</span>
              </div>
            </div>
          </div>

          {/* Massive H1 Headline with Line-by-Line Masked Spans */}
          <div className="relative z-10 my-auto py-6 md:py-10 max-w-4xl">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[84px] font-medium text-white tracking-[-0.04em] leading-[0.98] select-none">
              <span className="block overflow-hidden pb-1">
                <span ref={line1Ref} className="block will-change-transform">
                  Next-Gen Design &amp;
                </span>
              </span>
              <span className="block overflow-hidden pb-1">
                <span ref={line2Ref} className="block will-change-transform">
                  Development for Brands.
                </span>
              </span>
            </h1>
          </div>

          {/* Bottom Bar: Asymmetric 2-Column Split */}
          <div
            ref={bottomBarRef}
            className="relative z-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6"
          >
            {/* Bottom Left Triad */}
            <div className="flex items-center gap-6 text-xs font-mono text-zinc-400 tracking-wider">
              <span className="hover:text-white transition-colors cursor-default">+ Define</span>
              <span className="hover:text-white transition-colors cursor-default">+ Design</span>
              <span className="hover:text-white transition-colors cursor-default">+ Develop</span>
            </div>

            {/* Bottom Right Copy & Actions + Rotating Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 md:max-w-xl">
              <p className="text-xs text-zinc-300 leading-relaxed font-sans max-w-xs">
                Branding / Mobile &amp; Web App Design / for Category Pioneers and Startups.
              </p>

              <div className="flex items-center gap-3 shrink-0">
                <a href="#work">
                  <Button size="sm" variant="primary" withArrow>
                    View Projects
                  </Button>
                </a>

                <Link to="/app">
                  <Button size="sm" variant="secondary" withArrow>
                    Dashboard
                  </Button>
                </Link>

                {/* Rotating Circular Badge */}
                <div
                  ref={badgeRef}
                  className="hidden lg:flex relative w-16 h-16 rounded-full items-center justify-center shrink-0"
                  title="Status: Available for projects 2026"
                >
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full animate-[spin_12s_linear_infinite]"
                  >
                    <defs>
                      <path
                        id="badgeCircle"
                        d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                      />
                    </defs>
                    <text className="text-[10px] uppercase font-mono font-bold tracking-[2.8px] fill-zinc-400">
                      <textPath href="#badgeCircle">
                        AVAILABLE FOR PROJECTS • 2026 •
                      </textPath>
                    </text>
                  </svg>
                  <span className="absolute w-2 h-2 rounded-full bg-studio-red shadow-glow-red animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Studio Reel Video Showcase Modal */}
      {isReelOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/90 backdrop-blur-2xl animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsReelOpen(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-label="EnvisionStudio Brand Showreel"
        >
          <div className="relative w-full max-w-5xl rounded-2xl md:rounded-[28px] bg-[#0E0E11] border border-white/15 shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-studio-red animate-pulse" />
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">ENVISION STUDIO // 2026 BRAND SHOWREEL</h3>
                  <p className="text-[11px] font-mono text-zinc-400">Direction: Spatial Interfaces &amp; Dynamic Systems</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white transition-colors"
                  title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-studio-red" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsReelOpen(false)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white transition-colors"
                  title="Close Reel (ESC)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Showcase Player */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden group">
              <video
                ref={videoRef}
                src="/videos/showreel.mp4"
                poster="/images/showreel-poster.jpg"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onClick={togglePlay}
                className="w-full h-full object-cover cursor-pointer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E11]/90 via-transparent to-black/40 pointer-events-none" />

              {/* Overlay HUD Telemetry */}
              <div className="absolute top-4 left-4 sm:left-6 flex items-center gap-2 sm:gap-4 text-[10px] font-mono text-white/80 pointer-events-none">
                <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10">1080P 60FPS</span>
                <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10 hidden sm:inline">SPATIAL MOTION</span>
                <span className="px-2 py-0.5 rounded bg-studio-red/80 font-bold text-white">REEL V2.4</span>
              </div>

              {/* Center Big Play Button (when paused) */}
              {!isPlaying && (
                <button
                  onClick={togglePlay}
                  className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-studio-red/90 text-white flex items-center justify-center shadow-[0_0_40px_rgba(229,50,43,0.6)] hover:scale-110 transition-transform z-30"
                >
                  <Play className="w-8 h-8 fill-current translate-x-0.5" />
                </button>
              )}

              {/* Interactive Video Control Bar (Bottom) */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col gap-3 z-20">
                {/* Scrub Progress Bar */}
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 bg-white/20 hover:bg-white/30 rounded-lg appearance-none cursor-pointer accent-studio-red transition-all"
                  />
                </div>
                               
                <div className="flex items-center justify-between text-xs font-mono text-zinc-300">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlay}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>

                    <button
                      onClick={toggleMute}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-studio-red" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    <span className="text-[11px] text-zinc-400">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 text-zinc-400 text-[11px]">
                      <Sparkles className="w-3.5 h-3.5 text-studio-red" />
                      <span>Interface Motion Specimen</span>
                    </div>

                    <button
                      onClick={toggleFullscreen}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                      title="Fullscreen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
