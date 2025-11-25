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
          'relative w-full mx-4 h-10 bg-pink-400 rounded-sm cursor-pointer transform transition-all flex items-center justify-center group border-b-4 border-pink-600',
          isActive
            ? 'scale-105 -translate-y-1 rotate-1 ring-2 ring-white'
            : ''
        )}
        style={{
          boxShadow: isActive ? '4px 8px 12px rgba(0, 0, 0, 0.3)' : '2px 4px 6px rgba(0, 0, 0, 0.3)',
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '2px 5px 8px rgba(0, 0, 0, 0.3)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.transform = '';
            e.currentTarget.style.boxShadow = '2px 4px 6px rgba(0, 0, 0, 0.3)';
          }
        }}
      >
        <div className="absolute left-4 right-4 top-0 bottom-0 bg-white opacity-30 border-x border-white/50"></div>
        <span className="relative font-bold text-white text-xs tracking-widest uppercase drop-shadow-md flex items-center gap-2">
          <Eraser size={14} /> Eraser
        </span>
      </div>
    </div>
  );
}
