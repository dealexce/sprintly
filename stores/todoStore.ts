import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

export interface Todo {
  text: string;
  completed: boolean;
}

export interface TodoState {
  todos: Record<string, Todo>;
}

export interface TodoActions {
  addTodo: (todo: Todo) => void;
  updateTodoText: (id: string, text: string) => void;
  updateTodoCompleted: (id: string, completed: boolean) => void;
  removeTodo: (id: string) => void;
}

export const useTodoStore = create<TodoState & TodoActions>()(
  persist(
    immer((set) => ({
      todos: {},
      addTodo: (todo) =>
        set((state) => {
          state.todos[crypto.randomUUID()] = todo;
        }),
      updateTodoText: (id, text) =>
        set((state) => {
          state.todos[id].text = text;
        }),
      updateTodoCompleted: (id, completed) =>
        set((state) => {
          state.todos[id].completed = completed;
        }),
      removeTodo: (id) =>
        set((state) => {
          delete state.todos[id];
        }),
    })),
    {
      name: "todo-storage",
    }
  )
);
