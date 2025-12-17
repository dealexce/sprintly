import React from 'react';
import { Category, TimeSlotData, Todo, Tool } from '../types';
import { formatHour12 } from '../constants';
import { GridSlot } from './GridSlot';
import { useTheme } from '../contexts/ThemeContext';

interface TimeColumnProps {
  hours: number[];
  grid: TimeSlotData[];
  categories: Category[];
  todos: Todo[];
  tool: Tool;
  currentMinutes: number | null;
  onMouseDownSlot: (index: number) => void;
  onMouseEnterSlot: (index: number) => void;
  onTodoTagClick: (todoId: string) => void;
  activeMarkerColor?: string;
}

export function TimeColumn({
  hours,
  grid,
  categories,
  todos,
  tool,
  currentMinutes,
  onMouseDownSlot,
  onMouseEnterSlot,
  onTodoTagClick,
  activeMarkerColor,
}: TimeColumnProps) {
  
  return (
    <div className="flex-1 flex flex-col relative text-neutral-400 text-[10px] font-mono">
      {/* Column Headers (Minutes) */}
      <div className="flex border-b bg-neutral-50">
        {/* Empty corner cell */}
        <div className="w-12 border-r"/>
        {/* Minute Labels */}
        {[0, 15, 30, 45].map((min) => (
          <div
            key={min}
            className="flex-1 text-center py-1 border-r"
          >
            :{min.toString().padStart(2, '0')}
          </div>
        ))}
      </div>

      {/* Rows */}
      {hours.map((hour) => {
        const isCurrentHour =
          currentMinutes !== null && Math.floor(currentMinutes / 60) === hour;

        return (
          <div
            key={hour}
            className="flex-1 flex min-h-2 border-b"
          >
            {/* Time Label */}
            <div className="w-12 flex items-center justify-center bg-neutral-50">
              {hour}
            </div>

            {/* Slot Container */}
            <div className="flex-1 flex relative">
              {/* 4 Quarter Slots */}
              {[0, 1, 2, 3].map((q) => {
                const index = hour * 4 + q;
                const slot = grid[index];
                const prevSlot = grid[index - 1];
                const nextSlot = grid[index + 1];

                const isCategoryStart =
                  slot.categoryId !== null &&
                  (index === 0 || prevSlot?.categoryId !== slot.categoryId);

                const hasPrevSame = prevSlot?.categoryId === slot.categoryId;
                const hasNextSame = nextSlot?.categoryId === slot.categoryId;

                return (
                  <GridSlot
                    key={index}
                    data={slot}
                    category={categories.find((c) => c.id === slot.categoryId)}
                    assignedTodos={todos.filter((t) =>
                      slot.todoIds.includes(t.id)
                    )}
                    prevTodoIds={prevSlot ? prevSlot.todoIds : []}
                    isCategoryStart={isCategoryStart}
                    onMouseDown={onMouseDownSlot}
                    onMouseEnter={onMouseEnterSlot}
                    onTodoClick={onTodoTagClick}
                    hasPrevSame={hasPrevSame}
                    hasNextSame={hasNextSame}
                    isEraserActive={tool.type === 'eraser'}
                    activeMarkerColor={activeMarkerColor}
                  />
                );
              })}

              {/* Vertical Time Cursor */}
              {isCurrentHour && currentMinutes !== null && (
                <div
                  className="absolute top-0 bottom-0 z-40 pointer-events-none"
                  style={{
                    left: `${((currentMinutes % 60) / 60) * 100}%`,
                  }}
                >
                  <div className="absolute inset-y-0 -left-px w-0.5 bg-red-500 shadow-[0_0_2px_rgba(239,68,68,0.5)]"></div>
                  <div className="absolute top-0 -left-[2.5px] w-1.5 h-1.5 bg-red-500 rounded-full -translate-y-1/2"></div>
                  <div className="absolute bottom-0 -left-[2.5px] w-1.5 h-1.5 bg-red-500 rounded-full translate-y-1/2"></div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
