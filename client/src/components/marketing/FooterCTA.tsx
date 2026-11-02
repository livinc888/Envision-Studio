import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';

export const FooterCTA: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <footer id="contact" className="bg-[#0B0B0B] text-white pt-16 md:pt-24 pb-12 px-4 sm:px-6 md:px-12 border-t border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Large Call To Action */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div className="space-y-4 max-w-2xl">
            <span className="text-xs font-mono uppercase text-studio-red font-bold tracking-widest">
              Initiate Collaboration
            </span>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[0.98]">
              Let&apos;s build what&apos;s next.
            </h2>
            <p className="text-xs md:text-sm text-zinc-400 max-w-lg leading-relaxed pt-2">
              Have an ambitious vision for your brand or product? We partner with founders, design leads, and engineering heads worldwide.
            </p>
          </div>

          {/* Interactive Email Pill Form */}
          <div className="w-full lg:max-w-md">
            {submitted ? (
              <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Thank you. Our creative director will reach out within 24 hours.
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="relative flex items-center p-1.5 rounded-full bg-white/5 border border-white/15 focus-within:border-studio-red transition-all"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email..."
                  required
                  className="w-full bg-transparent px-5 py-2 text-xs md:text-sm text-white placeholder-zinc-500 focus:outline-none"
                />
                <Button type="submit" size="sm" variant="primary" withArrow className="shrink-0 text-xs">
                  Inquire
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* 1px Dotted Divider */}
        <div className="w-full border-b border-dotted border-white/20" />

        {/* Links & Brand Footer */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 text-xs text-zinc-400 font-mono">
          {/* Logo & Legal */}
          <div className="flex items-center gap-4">
            <div className="grid grid-cols-3 gap-0.5 w-4 h-4">
              {[...Array(9)].map((_, i) => (
                <div key={i} className={`rounded-[1px] ${i === 4 ? 'bg-studio-red' : 'bg-white/60'}`} />
              ))}
            </div>
            <span>© 2026 EnvisionStudio Design &amp; Technology Inc.</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6 flex-wrap">
            <a href="#hero" className="hover:text-white transition-colors">
              Home
            </a>
            <a href="#about" className="hover:text-white transition-colors">
              Studio
            </a>
            <a href="#work" className="hover:text-white transition-colors">
              Work
            </a>
            <a href="#services" className="hover:text-white transition-colors">
              Services
            </a>
            <Link to="/app" className="hover:text-white transition-colors text-studio-red font-bold">
              Open Dashboard
            </Link>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] text-zinc-500">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
