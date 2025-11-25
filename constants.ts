
import { Category } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Deep Work', color: 'blue-500' },
  { id: 'cat-2', name: 'Meeting', color: 'purple-500' },
  { id: 'cat-3', name: 'Break', color: 'green-400' },
  { id: 'cat-4', name: 'Meals', color: 'orange-400' },
  { id: 'cat-5', name: 'Exercise', color: 'red-400' },
];

export const MARKER_COLORS = [
  'slate-600',
  'red-500', 
  'orange-500', 
  'amber-400', 
  'yellow-400',
  'lime-500',
  'green-500', 
  'emerald-600',
  'teal-500', 
  'cyan-500',
  'sky-500',
  'blue-500', 
  'indigo-500', 
  'violet-500', 
  'purple-500', 
  'fuchsia-500', 
  'pink-500', 
  'rose-500'
];

export const formatTime = (index: number): string => {
  const totalMinutes = index * 15;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export const formatHour12 = (hourIndex: number): string => {
  const h = hourIndex;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12} ${ampm}`;
};

export const getTailwindColorValue = (colorName: string) => {
    return `var(--color-${colorName})`;
};

// Map standard Tailwind colors to Hex for dynamic SVG cursors
export const TAILWIND_HEX_MAP: Record<string, string> = {
  'slate-600': '#475569',
  'gray-500': '#6b7280',
  'red-500': '#ef4444',
  'red-400': '#f87171',
  'orange-500': '#f97316',
  'orange-400': '#fb923c',
  'amber-400': '#fbbf24',
  'yellow-400': '#facc15',
  'lime-500': '#84cc16',
  'green-500': '#22c55e',
  'green-400': '#4ade80',
  'emerald-600': '#059669',
  'teal-500': '#14b8a6',
  'cyan-500': '#06b6d4',
  'sky-500': '#0ea5e9',
  'blue-500': '#3b82f6',
  'indigo-500': '#6366f1',
  'violet-500': '#8b5cf6',
  'purple-500': '#a855f7',
  'fuchsia-500': '#d946ef',
  'pink-500': '#ec4899',
  'rose-500': '#f43f5e'
};

export const getColorHex = (tailwindClass: string): string => {
  return TAILWIND_HEX_MAP[tailwindClass] || '#000000';
};
