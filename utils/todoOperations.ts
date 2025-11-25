import { Todo } from '../types';

export function createNewTodo(text: string): Todo {
  return {
    id: `todo-${Date.now()}`,
    text,
    completed: false,
  };
}

export function updateTodoText(todos: Todo[], id: string, text: string): Todo[] {
  return todos.map((t) => (t.id === id ? { ...t, text } : t));
}

export function toggleTodoCompleted(todos: Todo[], id: string): Todo[] {
  return todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
}

export function deleteTodo(todos: Todo[], id: string): Todo[] {
  return todos.filter((t) => t.id !== id);
}
