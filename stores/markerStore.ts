import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

export interface Category {
    name: string;
    color: string; // Tailwind class snippet e.g., 'red-500'
}

const INITIAL_CATEGORIES: Record<string, Category> = {
    [crypto.randomUUID()]: { name: 'Deep Work', color: 'blue-500' },
    [crypto.randomUUID()]: { name: 'Meeting', color: 'purple-500' },
    [crypto.randomUUID()]: { name: 'Break', color: 'green-400' },
    [crypto.randomUUID()]: { name: 'Meals', color: 'orange-400' },
    [crypto.randomUUID()]: { name: 'Exercise', color: 'red-400' },
};

interface MarkerStore {
    markers: Record<string, Category>;
    addCategory: (category: Category) => void;
    updateCategory: (id: string, name: string, color: string) => void;
    removeCategory: (id: string) => void;
}

export const useMarkerStore = create<MarkerStore>()(persist(
    immer((set) => ({
        markers: INITIAL_CATEGORIES,
        addCategory: (category) => set((state) => { state.markers[crypto.randomUUID()] = category }),
        updateCategory: (id, name, color) => set((state) => {
            state.markers[id].name = name;
            state.markers[id].color = color;
        }),
        removeCategory: (id) => set((state) => { delete state.markers[id] }),
    })), {
    name: 'marker-storage',
}));