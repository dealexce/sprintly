import { create } from 'zustand';

export type ToolType = 'marker' | 'eraser' | null;

export interface Tool {
  type: ToolType;
  markerId: string | null; // null if eraser
}

export interface ToolState {
    activeTool: ToolType;
    activeMarkerId: string | null; // null if eraser
}

export interface ToolActions {
    setTool: (tool: ToolType, categoryId?: string | null) => void;
}

export const useToolStore = create<ToolState & ToolActions>((set) => ({
    activeTool: null,
    activeMarkerId: null,
    setTool: (tool, categoryId = null) => set(() => ({ activeTool: tool, activeMarkerId: categoryId })),
}));
