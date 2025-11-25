import React from 'react';
import { Category, TimeSlotData, Todo, Tool } from '../types';
import { TimeColumn } from './TimeColumn';

interface TimeGridProps {
  grid: TimeSlotData[];
  categories: Category[];
  todos: Todo[];
  tool: Tool;
  currentMinutes: number | null;
  onMouseDownSlot: (index: number) => void;
  onMouseEnterSlot: (index: number) => void;
  onTodoTagClick: (todoId: string) => void;
}

export function TimeGrid({
  grid,
  categories,
  todos,
  tool,
  currentMinutes,
  onMouseDownSlot,
  onMouseEnterSlot,
  onTodoTagClick,
}: TimeGridProps) {
  const amHours = Array.from({ length: 12 }, (_, i) => i);
  const pmHours = Array.from({ length: 12 }, (_, i) => i + 12);

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* AM Column */}
      <div className="flex-1 flex flex-col border-r-4 border-double border-stone-300/50">
        <TimeColumn
          hours={amHours}
          grid={grid}
          categories={categories}
          todos={todos}
          tool={tool}
          currentMinutes={currentMinutes}
          onMouseDownSlot={onMouseDownSlot}
          onMouseEnterSlot={onMouseEnterSlot}
          onTodoTagClick={onTodoTagClick}
        />
      </div>
      {/* PM Column */}
      <div className="flex-1 flex flex-col">
        <TimeColumn
          hours={pmHours}
          grid={grid}
          categories={categories}
          todos={todos}
          tool={tool}
          currentMinutes={currentMinutes}
          onMouseDownSlot={onMouseDownSlot}
          onMouseEnterSlot={onMouseEnterSlot}
          onTodoTagClick={onTodoTagClick}
        />
      </div>
    </div>
  );
}
