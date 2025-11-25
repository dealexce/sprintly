
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { TimeSlotData, Category, Todo } from '../types';
import { clsx } from 'clsx';

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
  isEraserActive
}) => {
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
        // Default grid border
        !hasNextSame ? "border-r border-stone-200" : "", 
        "last:border-r-0",
        // Hover effect only if empty or using eraser
        (!category || isEraserActive) && "hover:bg-stone-100/50 transition-colors"
      )}
      onMouseDown={(e) => { e.preventDefault(); onMouseDown(data.index); }}
      onMouseEnter={() => onMouseEnter(data.index)}
    >
      {/* The Colored Ink Block */}
      {category && (
         <div className={clsx(
             "absolute inset-y-1 inset-x-0 mix-blend-multiply bg-opacity-90 shadow-sm pointer-events-none transition-all duration-200",
             `bg-${category.color}`,
             !hasPrevSame && "rounded-l-md left-0.5",
             !hasNextSame && "rounded-r-md right-0.5",
             isOver ? "brightness-125 scale-y-110 z-10" : ""
         )}>
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
            isEraserActive ? "cursor-pointer hover:brightness-90" : "pointer-events-none"
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
            <div className={clsx(
              "inline-block bg-[#fffae5] border border-stone-300 shadow-sm text-stone-800 text-[9px] px-1.5 py-0.5 rounded-sm font-hand transform origin-bottom-left max-w-[120px] truncate transition-transform",
              // Random rotation for natural look
              idx % 2 === 0 ? "-rotate-1" : "rotate-1",
              isEraserActive && "group-hover:scale-95 group-hover:ring-2 group-hover:ring-red-400"
            )}>
              {todo.text}
            </div>
        </div>
      ))}
    </div>
  );
};
