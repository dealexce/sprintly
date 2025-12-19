import { useEffect, useState } from 'react';
import { Category, TimeSlotData, Todo } from '../types';

export function useNotifications(
  currentMinutes: number | null,
  grid: TimeSlotData[],
  categories: Category[],
  todos: Todo[]
) {
  const [previousSlotIndex, setPreviousSlotIndex] = useState<number | null>(null);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (currentMinutes === null) return;

    const currentSlotIndex = Math.floor(currentMinutes / 15);
    const currentSlot = grid[currentSlotIndex];

    if (previousSlotIndex !== null && previousSlotIndex !== currentSlotIndex) {
      const previousSlot = grid[previousSlotIndex];

      if (currentSlot.markerId && currentSlot.markerId !== previousSlot.markerId) {
        const category = categories.find((c) => c.id === currentSlot.markerId);
        const todosInSlot = todos.filter((t) => currentSlot.todoIds.includes(t.id));

        if (category && 'Notification' in window && Notification.permission === 'granted') {
          const body =
            todosInSlot.length > 0
              ? `Time for: ${category.name}\n${todosInSlot.map((t) => `• ${t.text}`).join('\n')}`
              : `Time for: ${category.name}`;

          new Notification('🕐 Action Period Started!', {
            body,
            icon: '/favicon.ico',
            tag: 'time-slot-notification',
            requireInteraction: false,
          });
        }
      }
    }

    setPreviousSlotIndex(currentSlotIndex);
  }, [currentMinutes, grid, categories, todos, previousSlotIndex]);
}
