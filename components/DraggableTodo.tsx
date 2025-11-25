
import React, { useState, useRef, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Todo } from '../types';
import { Trash2, Square, CheckSquare } from 'lucide-react';
import { clsx } from 'clsx';

interface Props {
  todo: Todo;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
}

export const DraggableTodo: React.FC<Props> = ({ todo, onDelete, onToggle, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: todo.id,
    data: { type: 'todo', todo },
    disabled: isEditing, // Disable drag when editing text
  });

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(todo.id, editText);
    } else {
      setEditText(todo.text); // Revert if empty
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 999,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        "group flex items-start gap-2 p-2 mb-2 font-hand text-lg transition-all duration-200 border-b border-dotted border-stone-400/30",
        isDragging 
          ? "rotate-2 shadow-xl scale-105 bg-yellow-100/90 cursor-grabbing z-50 rounded" 
          : "hover:bg-yellow-50/50",
        !isEditing && "cursor-grab touch-none"
      )}
      {...attributes}
      {...listeners}
    >
      {/* Checkbox */}
      <button 
        className="mt-1.5 text-stone-500 hover:text-stone-800 transition-colors flex-shrink-0 relative z-10 cursor-pointer"
        onPointerDown={(e) => e.stopPropagation()} 
        onClick={(e) => {
          e.stopPropagation();
          onToggle(todo.id);
        }}
      >
        {todo.completed ? <CheckSquare size={18} /> : <Square size={18} />}
      </button>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            ref={inputRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-full bg-white/50 border-b border-stone-400 outline-none text-stone-900 px-1"
          />
        ) : (
          <p 
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className={clsx(
              "break-words leading-tight select-none text-stone-800 hover:bg-black/5 rounded px-1 cursor-text relative z-10",
              todo.completed && "line-through text-stone-400"
          )}>
              {todo.text}
          </p>
        )}
      </div>

      <button 
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
            e.stopPropagation();
            onDelete(todo.id);
        }}
        className="mt-1.5 opacity-0 group-hover:opacity-100 text-stone-400 hover:text-red-500 transition-opacity flex-shrink-0 relative z-10 cursor-pointer"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};
