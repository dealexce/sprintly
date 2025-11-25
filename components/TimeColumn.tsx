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
}: TimeColumnProps) {
  const { theme } = useTheme();
  
  return (
    <div className="flex-1 flex flex-col relative last:border-r-0">
      {/* Column Headers (Minutes) */}
      <div 
        className="flex shrink-0 sticky top-0 z-20"
        style={{
          borderBottom: `1px solid ${theme.colors.gridBorder}`,
          backgroundColor: theme.colors.timeHeaderBg,
        }}
      >
        <div 
          className="w-12"
          style={{
            borderRight: `1px solid ${theme.colors.gridBorder}`,
            backgroundColor: theme.colors.timeLabelBg,
          }}
        ></div>
        {[0, 15, 30, 45].map((min) => (
          <div
            key={min}
            className="flex-1 text-center py-1 text-[10px] font-mono last:border-r-0"
            style={{
              color: theme.colors.timeLabelText,
              borderRight: `1px solid ${theme.colors.borderLight}`,
            }}
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
            className="flex-1 flex min-h-[2.5rem]"
            style={{
              borderBottom: `1px solid ${theme.colors.gridBorder}`,
            }}
          >
            {/* Time Label */}
            <div 
              className="w-12 flex items-center justify-center text-[10px] font-bold font-mono select-none shrink-0"
              style={{
                color: theme.colors.timeLabelText,
                borderRight: `1px solid ${theme.colors.gridBorder}`,
                backgroundColor: theme.colors.timeLabelBg,
              }}
            >
              {formatHour12(hour).split(' ')[0]}{' '}
              <span className="text-[8px] ml-0.5" style={{ color: theme.colors.textTertiary }}>
                {hour < 12 ? 'AM' : 'PM'}
              </span>
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
                  <div className="absolute top-1/2 left-0 w-8 border-t-[1.5px] border-dashed border-red-500/70"></div>
                  <div className="absolute top-1/2 left-8 -translate-y-1/2 bg-red-500 text-white text-[7px] font-bold px-1 py-px rounded-sm shadow-sm leading-tight">
                    NOW
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
