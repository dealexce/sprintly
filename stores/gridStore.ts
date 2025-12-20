import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

export const GRID_INFO = {
    START_HOUR: 0,
    END_HOUR: 23,
    SLOT_INTERVAL_MINUTES: 15
}

export interface TimeSlotData {
  markerId: string | null; // Painted category
  todoIds: string[];         // Assigned todos
}

export interface GridState {
    grid: TimeSlotData[][];
}

export interface GridActions {
    updateGridSlot: (hour: number, seg: number, data: Partial<TimeSlotData>) => void;
    resetGrid: () => void;
}

// Initialize grid with empty slots
const hours = GRID_INFO.END_HOUR - GRID_INFO.START_HOUR + 1;
const slotsPerHour = 60 / GRID_INFO.SLOT_INTERVAL_MINUTES;
const initialGrid: TimeSlotData[][] = Array.from({ length: hours }, (_, i) => (
    Array.from({ length: slotsPerHour }, (_, j) => ({
        markerId: null,
        todoIds: [],
    }))
));

export const useGridStore = create<GridState & GridActions>()(persist(
    immer((set) => ({
        grid: initialGrid,
        updateGridSlot: (hour, seg, data) => set((state) => {
            state.grid[hour][seg] = { ...state.grid[hour][seg], ...data };
        }),
        resetGrid: () => set(() => ({ grid: initialGrid })),
    })), {
        name: 'grid-storage'
    }
));