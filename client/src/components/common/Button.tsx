import React, { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';

export type ButtonVariant = 'primary' | 'secondary' | 'dark' | 'ghost' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  withArrow?: boolean;
  magnetic?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  withArrow = false,
  magnetic = true,
  loading = false,
  children,
  className = '',
  disabled,
  onMouseMove,
  onMouseLeave,
  ...props
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);

  const baseClasses =
    'relative inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 select-none outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-studio-red focus-visible:ring-offset-studio-dark disabled:opacity-50 disabled:cursor-not-allowed group will-change-transform';

  const sizeClasses = {
    sm: 'px-4 py-1.5 text-xs tracking-tight',
    md: 'px-5 py-2.5 text-sm tracking-tight',
    lg: 'px-7 py-3.5 text-base tracking-tight'
  }[size];

  const variantClasses = {
    primary:
      'bg-studio-red text-white hover:bg-studio-redHover shadow-glow-red hover:shadow-lg active:scale-[0.98]',
    secondary:
      'bg-white text-studio-dark hover:bg-zinc-100 shadow-paper hover:shadow-md active:scale-[0.98]',
    dark:
      'bg-studio-cardDark border border-white/15 text-white hover:bg-white/10 active:scale-[0.98]',
    ghost:
      'bg-transparent text-white/80 hover:text-white hover:bg-white/5 active:scale-[0.98]',
    danger:
      'bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30 hover:border-red-500 active:scale-[0.98]'
  }[variant];

  // Magnetic Pull (max 8px displacement)
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onMouseMove) onMouseMove(e);
    if (!magnetic || !btnRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = Math.max(-8, Math.min(8, (e.clientX - centerX) * 0.28));
    const deltaY = Math.max(-8, Math.min(8, (e.clientY - centerY) * 0.28));

    gsap.to(btnRef.current, {
      x: deltaX,
      y: deltaY,
      duration: 0.25,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onMouseLeave) onMouseLeave(e);
    if (!magnetic || !btnRef.current) return;

    gsap.to(btnRef.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)',
      overwrite: 'auto'
    });
  };

  return (
    <button
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Loading...
        </span>
      ) : (
        <>
          <span>{children}</span>
          {withArrow && (
            <span className="relative w-3.5 h-3.5 ml-1.5 overflow-hidden inline-flex items-center justify-center">
              {/* Primary Arrow: slides out up-right */}
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 ease-out group-hover:translate-x-4 group-hover:-translate-y-4" />
              {/* Secondary Arrow: slides in from bottom-left */}
              <ArrowUpRight className="w-3.5 h-3.5 absolute inset-0 transition-transform duration-300 ease-out -translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0" />
            </span>
          )}
        </>
      )}
    </button>
  );
};
