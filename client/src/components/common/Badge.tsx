import React from 'react';

export type StatusType = 'Active' | 'Completed' | 'On Hold' | 'In Progress' | 'Pending';

interface BadgeProps {
  status: StatusType | string;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, size = 'sm', className = '' }) => {
  let styleClasses = 'bg-white/10 text-white/80 border-white/10';
  let dotColor = 'bg-white/60';

  switch (status) {
    case 'Active':
      // Mint green as specified
      styleClasses = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25';
      dotColor = 'bg-emerald-400';
      break;
    case 'Completed':
      // Blue as specified
      styleClasses = 'bg-blue-500/15 text-blue-400 border-blue-500/25';
      dotColor = 'bg-blue-400';
      break;
    case 'On Hold':
      // Amber as specified
      styleClasses = 'bg-amber-500/15 text-amber-400 border-amber-500/25';
      dotColor = 'bg-amber-400';
      break;
    case 'In Progress':
      styleClasses = 'bg-indigo-500/15 text-indigo-400 border-indigo-500/25';
      dotColor = 'bg-indigo-400';
      break;
    case 'Pending':
      styleClasses = 'bg-zinc-500/15 text-zinc-400 border-zinc-500/25';
      dotColor = 'bg-zinc-400';
      break;
  }

  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border tracking-wide uppercase font-mono ${sizeClasses} ${styleClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse`} />
      {status}
    </span>
  );
};

