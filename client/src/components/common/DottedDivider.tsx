import React from 'react';

interface DottedDividerProps {
  color?: 'red' | 'dark' | 'subtle';
  className?: string;
}

export const DottedDivider: React.FC<DottedDividerProps> = ({ color = 'subtle', className = '' }) => {
  const dividerClass = {
    red: 'dotted-divider-light',
    dark: 'dotted-divider-dark',
    subtle: 'dotted-divider-subtle'
  }[color];

  return <div className={`w-full ${dividerClass} my-4 ${className}`} />;
};

