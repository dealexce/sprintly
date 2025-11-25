
export type Color = string;

export interface Category {
  id: string;
  name: string;
  color: Color; // Tailwind class snippet e.g., 'red-500'
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export interface TimeSlotData {
  index: number;
  timeLabel: string;
  categoryId: string | null; // Painted category
  todoIds: string[];         // Assigned todos
}

export type ToolType = 'marker' | 'eraser';

export interface Tool {
  type: ToolType;
  categoryId: string | null; // null if eraser
}

export const TIME_SLOTS_COUNT = 96; // 24 * 4
