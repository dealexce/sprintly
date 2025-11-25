import { TimeSlotData, Tool } from '../types';

export function paintSlot(
  grid: TimeSlotData[],
  index: number,
  tool: Tool
): TimeSlotData[] {
  const newGrid = [...grid];
  const slot = newGrid[index];

  if (tool.type === 'eraser') {
    if (slot.categoryId) {
      newGrid[index] = { ...slot, categoryId: null, todoIds: [] };
    }
  } else if (tool.type === 'marker' && tool.categoryId) {
    newGrid[index] = {
      ...slot,
      categoryId: tool.categoryId,
    };
  }

  return newGrid;
}

export function removeTodoFromAllSlots(
  grid: TimeSlotData[],
  todoId: string
): TimeSlotData[] {
  return grid.map((slot) => ({
    ...slot,
    todoIds: slot.todoIds.filter((id) => id !== todoId),
  }));
}

export function clearCategoryFromGrid(
  grid: TimeSlotData[],
  categoryId: string
): TimeSlotData[] {
  return grid.map((slot) =>
    slot.categoryId === categoryId
      ? { ...slot, categoryId: null, todoIds: [] }
      : slot
  );
}
