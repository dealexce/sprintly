import React from 'react';
import { Todo } from '../types';
import { DraggableTodo } from './DraggableTodo';
import { useTheme } from '../contexts/ThemeContext';

interface TodoPanelProps {
  todos: Todo[];
  newTodoText: string;
  onNewTodoChange: (text: string) => void;
  onAddTodo: (e: React.FormEvent) => void;
  onDeleteTodo: (id: string) => void;
  onToggleTodo: (id: string) => void;
  onUpdateTodo: (id: string, text: string) => void;
}

export function TodoPanel({
  todos,
  newTodoText,
  onNewTodoChange,
  onAddTodo,
  onDeleteTodo,
  onToggleTodo,
  onUpdateTodo,
}: TodoPanelProps) {
  const { theme } = useTheme();
  
  return (
    <div className="flex-1 relative transform rotate-1 hover:rotate-0 transition-transform duration-300 origin-top-right min-h-0">
      <div className="absolute inset-0 bg-black/20 blur-md translate-y-2 translate-x-2 rounded-sm"></div>

      <div 
        className="absolute inset-0 p-4 flex flex-col clip-path-polygon rounded-sm"
        style={{
          backgroundColor: theme.colors.stickyBg,
          boxShadow: theme.shadows.sticky,
        }}
      >
        <div 
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 backdrop-blur-sm transform -rotate-1 shadow-sm z-20"
          style={{
            backgroundColor: theme.colors.stickyTape,
            border: `1px solid ${theme.colors.stickyTape}`,
          }}
        ></div>

        <h2 
          className="font-hand text-3xl font-bold mb-4 mt-2 flex items-center gap-2"
          style={{ color: theme.colors.stickyText }}
        >
          <span>To-Do</span>
          <div 
            className="h-px flex-1"
            style={{ backgroundColor: `${theme.colors.stickyText}1a` }}
          ></div>
        </h2>

        <form onSubmit={onAddTodo} className="mb-4 shrink-0">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => onNewTodoChange(e.target.value)}
            placeholder="Add task..."
            className="w-full bg-transparent border-b-2 px-1 py-1 font-hand text-xl focus:outline-none"
            style={{
              borderColor: `${theme.colors.stickyBorder}4d`,
              color: theme.colors.stickyText,
            }}
            onFocus={(e) => e.target.style.borderColor = theme.colors.stickyBorder}
            onBlur={(e) => e.target.style.borderColor = `${theme.colors.stickyBorder}4d`}
          />
        </form>

        <div className="flex-1 overflow-y-auto pr-1 paper-scroll">
          {todos.length === 0 && (
            <div 
              className="text-center mt-10 opacity-40 font-hand text-xl -rotate-6"
              style={{ color: theme.colors.stickyText }}
            >
              Nothing to do yet!
            </div>
          )}
          {todos.map((todo) => (
            <DraggableTodo
              key={todo.id}
              todo={todo}
              onDelete={onDeleteTodo}
              onToggle={onToggleTodo}
              onUpdate={onUpdateTodo}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
