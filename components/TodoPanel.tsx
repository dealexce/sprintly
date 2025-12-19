import React from 'react';
import { CheckSquare, Square, X } from 'lucide-react';
import SpanInput from './common/SpanInput';
import { Todo, useTodoStore } from '@/stores/todoStore';
import { clsx } from 'clsx';

export function TodoPanel() {
  const todos = useTodoStore((state) => state.todos);
  const addTodo = useTodoStore((state) => state.addTodo);
  const updateTodoText = useTodoStore((state) => state.updateTodoText);
  const updateTodoCompleted = useTodoStore((state) => state.updateTodoCompleted);
  const removeTodo = useTodoStore((state) => state.removeTodo);

  function Add(name: string) {
    const newTodo: Todo = {
      text: name,
      completed: false,
    };
    addTodo(newTodo);
  }

  return (
    <div
      className="flex-1 relative origin-top-left min-h-0 font-hand"
    >
      <div
        className="absolute inset-0 p-4 flex flex-col clip-path-polygon bg-amber-100 rounded-md"
      >
        <div className="text-xl">todos</div>
        <input placeholder="Add new todo..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.currentTarget.value.trim() !== '') {
              Add(e.currentTarget.value.trim());
              e.currentTarget.value = '';
            }
          }}
          className="w-full border-b outline-none mb-4 bg-transparent transition-colors text-sm
          focus:bg-amber-50"
        ></input>
        <div className="flex-1 overflow-y-auto pr-1 mt-1">
          {Object.keys(todos).length === 0 && (
            <div
              className="text-center mt-10 opacity-40 -rotate-6"
            >
              Nothing to do yet!
            </div>
          )}
          {Object.entries(todos).map(([id, todo]) => (
            <div
              key={id}
              className={`group flex items-start gap-2 p-2 mb-2 border-b border-dotted
                hover:bg-black/5 transition-colors`
              }
            >
              <button
                className="cursor-pointer"
                onClick={() => updateTodoCompleted(id, !todo.completed)}
              >
                {todo.completed ? <CheckSquare size={18} /> : <Square size={18} />}
              </button>
              <div className="w-full">
                <SpanInput id={id} defaultValue={todo.text} onSave={(text) => updateTodoText(id, text)}
                  className={clsx(`text-secondary
                  hover:bg-amber-50 
                  focus:bg-amber-50
                  transition-colors`,
                  todo.completed && "line-through text-neutral-400")} />
              </div>

              <button
                className="mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeTodo(id)}
              >
                <X size={14} className="hover:text-red-600" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
