import React from "react";
import { CheckSquare, Square, X } from "lucide-react";
import SpanInput from "./common/SpanInput";
import { Todo, useTodoStore } from "@/stores/todoStore";
import { clsx } from "clsx";
import { useShallow } from "zustand/shallow";
import { useDraggable } from "@dnd-kit/react";

export function TodoPanel() {
  const todoIds = useTodoStore(useShallow((state) => Object.keys(state.todos)));
  const addTodo = useTodoStore((state) => state.addTodo);

  function Add(name: string) {
    const newTodo: Todo = {
      text: name,
      completed: false,
    };
    addTodo(newTodo);
  }

  return (
    <div className="flex-1 relative origin-top-left min-h-0 font-hand">
      <div className="absolute inset-0 p-4 flex flex-col clip-path-polygon bg-sticker rounded-md">
        <div className="text-xl">todos</div>
        <input
          placeholder="Add new todo..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
              Add(e.currentTarget.value.trim());
              e.currentTarget.value = "";
            }
          }}
          className="w-full border-b outline-none mb-4 bg-transparent transition-colors text-sm
          focus:bg-amber-50"
        ></input>
        <div className="flex-1 overflow-y-auto pr-1 mt-1">
          {todoIds.length === 0 && (
            <div className="text-center mt-10 opacity-40 -rotate-6">
              Nothing to do yet!
            </div>
          )}
          {todoIds.map((id) => (
            <TodoItem id={id} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TodoItem({ id }) {
  const todo = useTodoStore(useShallow((state) => state.todos[id]));
  const updateTodoText = useTodoStore((state) => state.updateTodoText);
  const updateTodoCompleted = useTodoStore(
    (state) => state.updateTodoCompleted
  );
  const removeTodo = useTodoStore((state) => state.removeTodo);
  // DnD
  const { ref } = useDraggable({
    id: id,
    type: "todo",
    data: { id },
  });

  return (
    <div
      key={id}
      ref={ref}
      className={`group flex items-start gap-2 p-2 mb-2 border-b border-dotted bg-sticker
                hover:bg-black/5 transition-colors`}
    >
      <button
        className="cursor-pointer"
        onClick={() => updateTodoCompleted(id, !todo.completed)}
      >
        {todo.completed ? <CheckSquare size={18} /> : <Square size={18} />}
      </button>
      <div className="w-full">
        <SpanInput
          id={id}
          defaultValue={todo.text}
          onSave={(text) => updateTodoText(id, text)}
          className={clsx(
            `text-secondary
                  hover:bg-amber-50 
                  focus:bg-amber-50
                  transition-colors`,
            todo.completed && "line-through text-neutral-400"
          )}
        />
      </div>

      <button
        className="mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => removeTodo(id)}
      >
        <X size={14} className="hover:text-red-600" />
      </button>
    </div>
  );
}
