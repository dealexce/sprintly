import React from 'react';
import { Eraser } from 'lucide-react';
import { clsx } from 'clsx';
import { Tool } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface EraserToolProps {
  isActive: boolean;
  onSelect: () => void;
}

export function EraserTool({ isActive, onSelect }: EraserToolProps) {
  const { theme } = useTheme();
  
  return (
    <div className="h-14 flex justify-center items-center relative perspective-500 shrink-0">
      <div
        onClick={onSelect}
        className={clsx(
          'relative w-full mx-4 h-10 cursor-pointer transform transition-all flex items-center justify-center group',
          isActive
            ? 'scale-105 -translate-y-1 rotate-1'
            : ''
        )}
        style={{
          backgroundColor: '#ec4899',
          border: `${theme.borders.width} solid ${isActive ? theme.colors.accent : '#be185d'}`,
          borderRadius: theme.borders.radius,
          boxShadow: isActive ? theme.shadows.elevation2 : theme.shadows.elevation1,
          transition: `all ${theme.animations.duration} ${theme.animations.easing}`,
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = theme.shadows.elevation2;
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.transform = '';
            e.currentTarget.style.boxShadow = theme.shadows.elevation1;
          }
        }}
      >
        <div className="absolute left-4 right-4 top-0 bottom-0 bg-white opacity-30 border-x border-white/50"></div>
        <span 
          className="relative font-bold text-xs tracking-widest uppercase flex items-center gap-2"
          style={{
            color: '#ffffff',
            fontFamily: theme.typography.bodyFont,
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
          }}
        >
          <Eraser size={14} /> ERASER
        </span>
      </div>
    </div>
  );
}
