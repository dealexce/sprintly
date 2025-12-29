import React from 'react';
import { clsx } from 'clsx';

import { useDroppable } from '@dnd-kit/react';
import { useTodoStore } from '@/stores/todoStore';
import { useToolStore } from '@/stores/toolStore';
import { useMarkerStore } from '@/stores/markerStore';
import { useGridStore } from '@/stores/gridStore';
import { getOffset } from '@/utils/gridOperations';
import { useShallow } from 'zustand/shallow';

export function GridSlot({ hour, seg }: { hour: number, seg: number }) {
  // State Stores
  const activeTool = useToolStore((state) => state.activeTool);
  const isEraserActive = activeTool === 'eraser';
  const activeMarkerId = useToolStore((state) => state.activeMarkerId);
  const activeMarker = useMarkerStore(useShallow((state) => activeMarkerId ? state.markers[activeMarkerId] : null));
  const slot = useGridStore(useShallow((state) => state.grid[hour][seg]));
  const marker = useMarkerStore(useShallow((state) => slot.markerId ? state.markers[slot.markerId] : null));
  const todos = useTodoStore((state) => state.todos);
  const isStart = useGridStore(useShallow((state) => slot.markerId !== null &&
    getOffset(state.grid, hour, seg, -1)?.markerId !== slot.markerId));
  const isEnd = useGridStore(useShallow((state) => slot.markerId !== null &&
    getOffset(state.grid, hour, seg, 1)?.markerId !== slot.markerId));
  const updateGridSlot = useGridStore((state) => state.updateGridSlot);
  const removeTodoFromSlot = useGridStore((state) => state.removeTodoFromSlot);

  // DnD
  const { isDropTarget, ref } = useDroppable({
    id: `grid-slot-${hour}-${seg}`,
    type: 'slot',
    data: { hour, seg }
  });

  function PaintGrid() {
    if (isEraserActive || !activeMarkerId) return;
    updateGridSlot(hour, seg, activeTool, activeMarkerId);
  }

  function EraseGrid() {
    if (!isEraserActive) return;
    updateGridSlot(hour, seg, activeTool, null);
  }

  return (
    <div
      className={clsx(
        "flex flex-wrap flex-1 relative select-none p-1",
        !marker && activeMarkerId && `hover:bg-${activeMarker?.color} hover:bg-opacity-30 transition-colors`,
        isDropTarget && "ring-4 ring-green-400",
      )}
      ref={ref}
      onMouseDown={() => {
        PaintGrid();
      }}
      onMouseOver={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        // Only paint if mouse is down
        if (e.buttons !== 1) return;
        PaintGrid();
      }}
    >
      {marker && isStart && (
        <span className="m-1 text-xs font-mono text-white/80 uppercase truncate max-w-[90%] z-10">
          {marker.name}
        </span>
      )}
      {slot.todoIds.map((todoId, index) => {
        const todo = todos[todoId];
        if (!todo) return null;
        return (
          <div
            key={index}
            className={clsx(
              "size-fit m-1 px-1 rounded-sm bg-sticker bg-opacity-70 z-20",
              isEraserActive && "hover:ring-4 hover:ring-red-400",
              todo?.completed && "line-through text-neutral-400")}
            onClick={(e) => {
              e.stopPropagation();
              removeTodoFromSlot(hour, seg, todoId);
            }
            }
          >
            {todo?.text}
          </div>
        )
      })}
      {/* The Colored Ink Block */}
      {marker && (
        <div
          className={clsx(
            "absolute inset-x-0 inset-y-1 transition-all duration-200 z-0",
            `bg-${marker.color}`,
            isStart && "rounded-l-md left-0.5",
            isEnd && "rounded-r-md right-0.5",
            isEraserActive && "hover:opacity-50"
          )}
          onMouseDown={() => {
            EraseGrid();
          }}
          onMouseOver={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            // Only paint if mouse is down
            if (e.buttons !== 1) return;
            EraseGrid();
          }}
        >
        </div>
      )}

    </div>
  );
};
