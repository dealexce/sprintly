
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { TimeSlotData, Category, Todo } from '../types';
import { clsx } from 'clsx';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  data: TimeSlotData;
  category?: Category;
  assignedTodos: Todo[];
  prevTodoIds: string[]; // To determine which todos start here
  isCategoryStart: boolean;
  onMouseDown: (index: number) => void;
  onMouseEnter: (index: number) => void;
  onTodoClick: (todoId: string) => void;
  hasPrevSame: boolean;
  hasNextSame: boolean;
  isEraserActive: boolean;
  activeMarkerColor?: string;
}

export const GridSlot: React.FC<Props> = ({ 
  data, 
  category, 
  assignedTodos,
  prevTodoIds,
  isCategoryStart,
  onMouseDown, 
  onMouseEnter,
  onTodoClick,
  hasPrevSame,
  hasNextSame,
  isEraserActive,
  activeMarkerColor
}) => {
  const { theme } = useTheme();
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${data.index}`,
    data: { index: data.index, categoryId: data.categoryId },
  });

  // Filter todos that start in this slot (i.e., weren't in the previous slot)
  const startingTodos = assignedTodos.filter(t => !prevTodoIds.includes(t.id));

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        "flex-1 relative group select-none",
        !hasNextSame && "last:border-r-0",
        (!category || isEraserActive) && "transition-colors"
      )}
      style={{
        borderRight: !hasNextSame ? `1px solid ${theme.colors.gridBorder}` : 'none',
      }}
      onMouseDown={(e) => { e.preventDefault(); onMouseDown(data.index); }}
      onMouseEnter={() => onMouseEnter(data.index)}
      onMouseOver={(e) => {
        if (!category || isEraserActive) {
          if (activeMarkerColor) {
            e.currentTarget.style.backgroundColor = activeMarkerColor;
          } else {
            e.currentTarget.style.backgroundColor = theme.colors.gridHover;
          }
        }
      }}
      onMouseOut={(e) => {
        if (!category || isEraserActive) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      {/* The Colored Ink Block */}
      {category && (
         <div className={clsx(
             "absolute inset-y-1 inset-x-0 shadow-sm pointer-events-none transition-all duration-200",
             `bg-${category.color}`,
             !hasPrevSame && "rounded-l-md left-0.5",
             !hasNextSame && "rounded-r-md right-0.5",
             isOver ? "brightness-125 scale-y-110 z-10" : ""
         )}
         style={{
           opacity: theme.id === 'retroPC' ? '0.6' : '0.9',
           mixBlendMode: theme.id === 'retroPC' ? 'normal' : 'multiply',
         }}>
             {/* Texture overlay for marker feel */}
             <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/rough-paper.png')]"></div>
         </div>
      )}

      {/* Action Label: Only shown at start of the block */}
      {isCategoryStart && category && (
        <span className="absolute top-1.5 left-2 text-[10px] font-extrabold text-white/90 leading-none pointer-events-none drop-shadow-sm tracking-wide uppercase truncate max-w-[90%] z-10">
          {category.name}
        </span>
      )}

      {/* Todo Tags: Stacked Stickers */}
      {startingTodos.map((todo, idx) => (
        <div 
          key={todo.id}
          className={clsx(
            "absolute left-0 z-20 w-full overflow-visible pl-1",
            isEraserActive ? "cursor-pointer" : "pointer-events-none"
          )}
          onMouseDown={(e) => {
            if (isEraserActive) {
              e.stopPropagation(); // Prevent slot painting
              onTodoClick(todo.id);
            }
          }}
          style={{ 
            // Push stickers down so they don't overlap the category name
            top: `${(isCategoryStart ? 22 : 4) + (idx * 18)}px`, 
            zIndex: 20 + idx 
          }}
        >
            <div 
              className={clsx(
                "inline-block shadow-sm text-[9px] px-1.5 py-0.5 rounded-sm font-hand transform origin-bottom-left max-w-[120px] truncate transition-transform",
                idx % 2 === 0 ? "-rotate-1" : "rotate-1"
              )}
              style={{
                backgroundColor: theme.colors.tagBg,
                border: `${theme.borders.width} ${theme.borders.style} ${theme.colors.tagBorder}`,
                color: theme.colors.tagText,
                fontFamily: theme.typography.handFont,
                fontSize: '0.5625rem',
                borderRadius: theme.borders.radius,
                transition: `transform ${theme.animations.duration} ${theme.animations.easing}, box-shadow ${theme.animations.duration}`,
              }}
              onMouseEnter={(e) => {
                if (isEraserActive) {
                  e.currentTarget.style.transform = `scale(0.95) ${idx % 2 === 0 ? 'rotate(-1deg)' : 'rotate(1deg)'}`;
                  e.currentTarget.style.boxShadow = `0 0 0 2px #f87171`;
                }
              }}
              onMouseLeave={(e) => {
                if (isEraserActive) {
                  e.currentTarget.style.transform = `scale(1) ${idx % 2 === 0 ? 'rotate(-1deg)' : 'rotate(1deg)'}`;
                  e.currentTarget.style.boxShadow = '';
                }
              }}
            >
              {todo.text}
            </div>
        </div>
      ))}
    </div>
  );
};
