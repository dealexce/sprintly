import React from 'react';
import { clsx } from 'clsx';
import { useToolStore } from '@/stores/toolStore';
import { useMarkerStore } from '@/stores/markerStore';
import { useGridStore } from '@/stores/gridStore';
import { getOffset } from '@/utils/gridOperations';

export const GridSlot = ({hour, seg}: {hour: number, seg: number}) => {
  const slotRef = React.useRef<HTMLDivElement>(null);

  const activeTool = useToolStore((state) => state.activeTool);
  const activeMarkerId = useToolStore((state) => state.activeMarkerId);
  const markers = useMarkerStore((state) => state.markers);
  const grid = useGridStore((state) => state.grid);
  const updateGridSlot = useGridStore((state) => state.updateGridSlot);

  const slot = grid[hour][seg];
  const isEraserActive = activeTool === 'eraser';
  const activeMarker = activeMarkerId ? markers[activeMarkerId] : null;
  const category = slot.markerId ? markers[slot.markerId] : null;

  const isStart = slot.markerId !== null &&
    getOffset(grid, hour, seg, -1)?.markerId !== slot.markerId;
  const isEnd = slot.markerId !== null &&
    getOffset(grid, hour, seg, 1)?.markerId !== slot.markerId;
  
  function paintSlot() {
    if (isEraserActive)
      updateGridSlot(hour, seg, { markerId: null });
    else if (activeMarkerId)
      updateGridSlot(hour, seg, { markerId: activeMarkerId });
  }

  return (
    <div
      ref={slotRef}
      className={clsx(
        "flex-1 relative group select-none",
        !category && activeMarkerId && `hover:bg-${activeMarker?.color} hover:bg-opacity-30 transition-colors`
      )}
      onMouseDown={() => { paintSlot(); }}
      onMouseOver={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        // Only paint if mouse is down
        if (e.buttons !== 1) return;
        paintSlot();
      }}
    >
      {/* The Colored Ink Block */}
      {category && (
         <div className={clsx(
             "absolute inset-y-1 inset-x-0 shadow-sm pointer-events-none transition-all duration-200",
             `bg-${category.color}`,
             isStart && "rounded-l-md left-0.5",
             isEnd && "rounded-r-md right-0.5",
         )}
         >
         </div>
      )}

      {/* Action Label: Only shown at start of the block */}
      {isStart && category && (
        <span className="absolute top-1.5 left-2 text-[10px] font-extrabold text-white/90 leading-none pointer-events-none drop-shadow-sm tracking-wide uppercase truncate max-w-[90%] z-10">
          {category.name}
        </span>
      )}
    </div>
  );
};
