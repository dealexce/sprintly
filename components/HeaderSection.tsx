import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderSectionProps {
  title: string;
  date: string;
}

export function HeaderSection({ title, date }: HeaderSectionProps) {
  const { theme } = useTheme();
  
  return (
    <div 
      className="h-16 flex items-center justify-between px-6 shrink-0"
      style={{
        borderBottom: `2px solid ${theme.colors.border}`,
        backgroundColor: theme.colors.headerBg,
      }}
    >
      <div>
        <h1 
          className="font-mono text-3xl"
          style={{ color: theme.colors.textPrimary }}
        >{title}</h1>
        <p 
          className="text-xs font-mono tracking-widest uppercase"
          style={{ color: theme.colors.textTertiary }}
        >
          {date}
        </p>
      </div>
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center opacity-50"
        style={{
          border: `4px solid ${theme.colors.border}`,
          backgroundColor: theme.colors.surfaceSecondary,
        }}
      >
        <div 
          className="w-6 h-6 rounded-full"
          style={{ backgroundColor: theme.colors.borderDark }}
        ></div>
      </div>
    </div>
  );
}
