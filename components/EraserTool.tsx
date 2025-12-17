import React from 'react';
import { Eraser } from 'lucide-react';

interface EraserToolProps {
  isActive: boolean;
  onSelect: () => void;
}

export function EraserTool({ isActive, onSelect }: EraserToolProps) {
  return (
    <div className="h-14 flex justify-center items-center relative perspective-500 shrink-0">
      <button
        onClick={onSelect}
        className="w-60 h-10 cursor-pointer transform transition-all flex
        bg-rose-400 
          focus:-translate-y-0.5 focus:rotate-1 focus:outline-2 focus:outline-offset-2 focus:outline-white"
      >
        <div className="w-1/6 relative h-full bg-white/50"></div>
        <div className="w-full h-full flex items-center justify-center text-white font-mono">
          <Eraser size={14} />eraser
        </div>
      </button>
    </div>
  );
}
