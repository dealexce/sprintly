import React from 'react';
import { Eraser } from 'lucide-react';
import { useToolStore } from '@/stores/toolStore';
import { clsx } from 'clsx';

export function EraserTool() {
  const activeTool = useToolStore((state) => state.activeTool);
  const setTool = useToolStore((state) => state.setTool);
  return (
    <div className="h-14 flex justify-center items-center relative perspective-500 shrink-0">
      <button
        onClick={() => activeTool === 'eraser' ? setTool(null, null) : setTool('eraser', null)}
        className={clsx(`w-60 h-10 cursor-pointer transform transition-all flex
        bg-rose-400`,
        activeTool === 'eraser' ? 
        "-translate-y-0.5 rotate-1 outline-2 outline-offset-2 outline-white" : "")}
      >
        <div className="w-1/6 relative h-full bg-white/50"></div>
        <div className="w-full h-full flex items-center justify-center text-white font-mono">
          <Eraser size={14} />eraser
        </div>
      </button>
    </div>
  );
}
