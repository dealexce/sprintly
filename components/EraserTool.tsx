import React from 'react';
import { Eraser } from 'lucide-react';
import { clsx } from 'clsx';
import { Tool } from '../types';

interface EraserToolProps {
  isActive: boolean;
  onSelect: () => void;
}

export function EraserTool({ isActive, onSelect }: EraserToolProps) {
  return (
    <div className="h-14 flex justify-center items-center relative perspective-500 shrink-0">
      <div
        onClick={onSelect}
        className={clsx(
          'relative w-full mx-4 h-10 bg-pink-400 rounded-sm shadow-[2px_4px_6px_rgba(0,0,0,0.3)] cursor-pointer transform transition-all flex items-center justify-center group border-b-4 border-pink-600',
          isActive
            ? 'scale-105 -translate-y-1 rotate-1 shadow-[4px_8px_12px_rgba(0,0,0,0.3)] ring-2 ring-white'
            : 'hover:-translate-y-0.5 hover:shadow-[2px_5px_8px_rgba(0,0,0,0.3)]'
        )}
      >
        <div className="absolute left-4 right-4 top-0 bottom-0 bg-white opacity-30 border-x border-white/50"></div>
        <span className="relative font-bold text-white text-xs tracking-widest uppercase drop-shadow-md flex items-center gap-2">
          <Eraser size={14} /> Eraser
        </span>
      </div>
    </div>
  );
}
