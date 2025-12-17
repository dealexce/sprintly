import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderSectionProps {
  title: string;
  date: string;
}

export function HeaderSection({ title, date }: HeaderSectionProps) {
  const { theme } = useTheme();
  
  return (
    <div className="h-16 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        <img 
          src="/logo-dark.svg"
          className="h-10 w-8" 
          style={theme.logo}
        />
        <div>
          <h1 className="font-mono text-xl">
            {title}
          </h1>

          <p className="text-xs font-mono tracking-widest uppercase text-neutral-400">
            {date}
          </p>
        </div>
      </div>
    </div>
  );
}
