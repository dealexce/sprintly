
import React, { useState, useRef, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Todo } from '../types';
import { Trash2, Square, CheckSquare } from 'lucide-react';
import { clsx } from 'clsx';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  todo: Todo;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
}

export const DraggableTodo: React.FC<Props> = ({ todo, onDelete, onToggle, onUpdate }) => {
  const { theme } = useTheme();
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
      style={{
        ...style,
        fontFamily: theme.typography.handFont,
        fontSize: theme.typography.bodySize,
        borderBottomWidth: theme.borders.width,
        transition: `all ${theme.animations.duration} ${theme.animations.easing}`,
      }}
      className={clsx(
        "group flex items-start gap-2 p-2 mb-2 font-hand border-b border-dotted",
        isDragging 
          ? "rotate-2 shadow-xl scale-105 cursor-grabbing z-50 rounded" 
          : "",
        !isEditing && "cursor-grab touch-none"
      )}
      {...attributes}
      {...listeners}
      onMouseEnter={(e) => {
        if (!isDragging) {
          e.currentTarget.style.backgroundColor = `${theme.colors.stickyText}08`;
        }
      }}
      onMouseLeave={(e) => {
        if (!isDragging) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      {/* Checkbox */}
      <button 
        className="mt-1.5 transition-colors flex-shrink-0 relative z-10 cursor-pointer"
        style={{ 
          color: theme.colors.textSecondary,
          transition: `color ${theme.animations.duration}`,
        }}
        onPointerDown={(e) => e.stopPropagation()} 
        onClick={(e) => {
          e.stopPropagation();
          onToggle(todo.id);
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = theme.colors.textPrimary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = theme.colors.textSecondary;
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
            className="w-full outline-none px-1"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              borderBottom: `${theme.borders.width} ${theme.borders.style} ${theme.colors.stickyBorder}`,
              color: theme.colors.stickyText,
              fontFamily: theme.typography.handFont,
              fontSize: theme.typography.bodySize,
              borderRadius: theme.borders.radius,
            }}
          />
        ) : (
          <p 
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className={clsx(
              "break-words leading-tight select-none hover:bg-black/5 rounded px-1 cursor-text relative z-10",
              todo.completed && "line-through"
          )}
          style={{
            color: todo.completed ? theme.colors.textTertiary : theme.colors.stickyText,
            fontFamily: theme.typography.handFont,
          }}
          >
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
        className="mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 relative z-10 cursor-pointer"
        style={{ color: theme.colors.textTertiary }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#f87171';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = theme.colors.textTertiary;
        }}
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};
