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
        borderBottom: `${theme.borders.width} ${theme.borders.style} ${theme.colors.border}`,
        backgroundColor: theme.colors.headerBg,
      }}
    >
      <div className="flex items-center gap-3">
        <img 
          src="/assets/logo-dark.svg" 
          alt="Logo" 
          className="h-10 w-8" 
          style={theme.logo}
        />
        <div>
          <h1 
            className="font-mono text-xl"
            style={{ 
              color: theme.colors.textPrimary,
              fontFamily: theme.typography.headerFont,
              fontWeight: theme.typography.fontWeight,
              letterSpacing: theme.typography.letterSpacing,
            }}
          >{title}</h1>
          <p 
            className="text-xs font-mono tracking-widest uppercase"
            style={{ 
              color: theme.colors.textTertiary,
              fontFamily: theme.typography.headerFont,
            }}
          >
            {date}
          </p>
        </div>
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
