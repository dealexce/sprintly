import { useState, Dispatch, SetStateAction } from 'react';
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { TimeSlotData, Todo, TIME_SLOTS_COUNT } from '../types';

export function useDragAndDrop(
  grid: TimeSlotData[],
  setGrid: Dispatch<SetStateAction<TimeSlotData[]>>
) {
  const [activeDragTodo, setActiveDragTodo] = useState<Todo | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'todo') {
      setActiveDragTodo(event.active.data.current.todo as Todo);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragTodo(null);

    if (!over || !active) return;

    const overId = String(over.id);
    if (overId.startsWith('slot-')) {
      const slotIndex = parseInt(overId.replace('slot-', ''), 10);
      const targetSlot = grid[slotIndex];

      if (targetSlot.markerId) {
        const targetCatId = targetSlot.markerId;
        const todoId = active.id as string;

        // Flood fill contiguous block
        let start = slotIndex;
        while (start > 0 && grid[start - 1].markerId === targetCatId) {
          start--;
        }
        let end = slotIndex;
        while (end < TIME_SLOTS_COUNT - 1 && grid[end + 1].markerId === targetCatId) {
          end++;
        }

        setGrid((prev) => {
          const newGrid = [...prev];
          for (let i = start; i <= end; i++) {
            const currentIds = newGrid[i].todoIds;
            if (!currentIds.includes(todoId)) {
              newGrid[i] = { ...newGrid[i], todoIds: [...currentIds, todoId] };
            }
          }
          return newGrid;
        });
      }
    }
  };

  return { activeDragTodo, handleDragStart, handleDragEnd };
}
