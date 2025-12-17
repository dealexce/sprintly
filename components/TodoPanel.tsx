import React from 'react';
import { Todo } from '../types';
import { useLocalStorage, STORAGE_KEYS } from '@/hooks/useLocalStorage';
import { clsx } from 'clsx';
import { CheckSquare, Square, X } from 'lucide-react';
import SpanInput from './common/SpanInput';



export function TodoPanel() {
  const [todos, setTodos] = useLocalStorage<Todo[]>(STORAGE_KEYS.TODOS, []);

  function Add(name: string) {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: name,
      completed: false,
    };
    setTodos([...todos, newTodo]);
  }

  function Delete(id: string) {
    setTodos(todos.filter(todo => todo.id !== id));
  }

  function Toggle(id: string) {
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    }));
  }

  function Update(id: string, text: string) {
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, text };
      }
      return todo;
    }));
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
          {todos.length === 0 && (
            <div
              className="text-center mt-10 opacity-40 -rotate-6"
            >
              Nothing to do yet!
            </div>
          )}
          {todos.map((todo) => (
            <TodoItem todo={todo} onDelete={Delete} onToggle={Toggle} onUpdate={Update} />
          ))}
        </div>
      </div>
    </div>
  );
}

type TodoItemProps = {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
}

function TodoItem({ todo, onDelete, onToggle, onUpdate }: TodoItemProps) {
  return (<div
    className={clsx(
      `group flex items-start gap-2 p-2 mb-2 border-b border-dotted
      hover:bg-black/5 transition-colors`
    )}
  >
    <button
      className="cursor-pointer"
      onClick={() => onToggle(todo.id)}
    >
      {todo.completed ? <CheckSquare size={18} /> : <Square size={18} />}
    </button>
    <div className="w-full">
      <SpanInput id={todo.id} defaultValue={todo.text} onSave={(text) => onUpdate(todo.id, text)}
        className="text-secondary
        hover:bg-black/10 transition-colors " />
    </div>

    <button
      className="mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={() => onDelete(todo.id)}
    >
      <X size={14} className="hover:text-red-600" />
    </button>
  </div>);
}