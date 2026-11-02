import React from 'react';

interface SectionTagProps {
  label: string;
  theme?: 'dark' | 'light';
  className?: string;
}

export const SectionTag: React.FC<SectionTagProps> = ({ label, theme = 'dark', className = '' }) => {
  const textColor = theme === 'light' ? 'text-zinc-600' : 'text-zinc-400';

  return (
    <div className={`inline-flex items-center gap-2 tracking-[0.14em] uppercase text-[11px] font-bold ${textColor} ${className}`}>
      <span className="w-2.5 h-2.5 rounded-[2px] bg-studio-red shrink-0" />
      <span>{label}</span>
    </div>
  );
};

