import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { TimeSlotData, Tool, TIME_SLOTS_COUNT } from './types';
import { INITIAL_CATEGORIES, formatTime } from './constants';

// Hooks
import { useLocalStorage, STORAGE_KEYS } from './hooks/useLocalStorage';
import { useCurrentTime } from './hooks/useCurrentTime';
import { useNotifications } from './hooks/useNotifications';
import { useDragAndDrop } from './hooks/useDragAndDrop';

// Utils
import { paintSlot, removeTodoFromAllSlots, clearCategoryFromGrid } from './utils/gridOperations';
import { createNewCategory, updateCategoryName, updateCategoryColor, deleteCategory as deleteCategoryUtil } from './utils/categoryOperations';
import { createNewTodo, updateTodoText, toggleTodoCompleted, deleteTodo as deleteTodoUtil } from './utils/todoOperations';
import { getCursorStyle } from './utils/cursorStyles';
import { getColorHex } from './constants';

// Components
import { HeaderSection } from './components/HeaderSection';
import { TimeGrid } from './components/TimeGrid';
import { TodoPanel } from './components/TodoPanel';
import { EraserTool } from './components/EraserTool';
import { MarkerSet } from './components/MarkerSet';

// Session Storage Keys


export default function App() {
  
  // --- State Management with Custom Hooks ---
  const [categories, setCategories] = useLocalStorage(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  
  const [grid, setGrid] = useLocalStorage(STORAGE_KEYS.GRID, 
    Array.from({ length: TIME_SLOTS_COUNT }).map((_, i) => ({
      index: i,
      timeLabel: formatTime(i),
      categoryId: null,
      todoIds: [],
    }))
  );

  const [newTodoText, setNewTodoText] = useState('');
  const [tool, setTool] = useState<Tool>({ type: 'marker', categoryId: INITIAL_CATEGORIES[0].id });
  const [isDrawing, setIsDrawing] = useState(false);

  // Category Editing State
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [editingColorId, setEditingColorId] = useState<string | null>(null);
  const [tempCatName, setTempCatName] = useState('');

  // Custom Hooks
  const currentMinutes = useCurrentTime();
  useNotifications(currentMinutes, grid, categories, []);
  const { activeDragTodo, handleDragStart, handleDragEnd } = useDragAndDrop(grid, setGrid);

  // --- Sensors ---
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  // --- Effects ---
  useEffect(() => {
    const handleMouseUp = () => setIsDrawing(false);
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  // --- Grid Painting Logic ---
  const handlePaintSlot = useCallback(
    (index: number) => {
      setGrid((prev) => paintSlot(prev, index, tool));
    },
    [tool, setGrid]
  );

  const handleTodoTagClick = (todoId: string) => {
    if (tool.type === 'eraser') {
      setGrid((prev) => removeTodoFromAllSlots(prev, todoId));
    }
  };

  const handleMouseDownSlot = (index: number) => {
    setIsDrawing(true);
    handlePaintSlot(index);
  };

  const handleMouseEnterSlot = (index: number) => {
    if (isDrawing) handlePaintSlot(index);
  };

  // --- Category Management ---
  const handleAddCategory = () => {
    const newCat = createNewCategory();
    setCategories((prev) => [...prev, newCat]);
    setTool({ type: 'marker', categoryId: newCat.id });
    setEditingNameId(newCat.id);
    setTempCatName(newCat.name);
  };

  const handleDeleteCategory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (categories.length <= 1) return;
    setCategories((prev) => deleteCategoryUtil(prev, id));
    setGrid((prev) => clearCategoryFromGrid(prev, id));
    if (tool.categoryId === id) {
      const newCatId =
        categories[0].id === id ? categories[1].id : categories[0].id;
      setTool({ type: 'marker', categoryId: newCatId });
    }
  };

  const handleSaveCategoryName = (id: string, value: string) => {
    setCategories((prev) => updateCategoryName(prev, id, value));
    setEditingNameId(null);
  };

  const handleUpdateCategoryColor = (id: string, color: string) => {
    setCategories((prev) => updateCategoryColor(prev, id, color));
    setEditingColorId(null);
  };

  const handleSelectCategory = (id: string) => {
    setTool({ type: 'marker', categoryId: id });
    setEditingColorId(null);
    setEditingNameId(null);
  };

  const handleToggleColorPicker = (id: string) => {
    setTool({ type: 'marker', categoryId: id });
    setEditingColorId(editingColorId === id ? null : id);
    setEditingNameId(null);
  };

  const handleStartEditName = (id: string, name: string) => {
    setTool({ type: 'marker', categoryId: id });
    setEditingNameId(id);
    setTempCatName(name);
    setEditingColorId(null);
  };

  const handleSelectEraser = () => {
    setTool({ type: 'eraser', categoryId: null });
    setEditingNameId(null);
    setEditingColorId(null);
  };

  // --- Dynamic Cursor ---
  const cursorStyle = useMemo(
    () => getCursorStyle(tool, categories),
    [tool, categories]
  );

  // --- Active Marker Color with Opacity ---
  const activeMarkerColor = useMemo(() => {
    if (tool.type === 'marker' && tool.categoryId) {
      const category = categories.find((c) => c.id === tool.categoryId);
      if (category) {
        const hex = getColorHex(category.color);
        // Convert hex to rgba with 20% opacity
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, 0.2)`;
      }
    }
    return undefined;
  }, [tool, categories]);

  // --- Date Formatting ---
  const currentDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div
        className="flex h-screen w-screen overflow-hidden 
        gap-8 p-4 items-center justify-center relative
        bg-gray-800"
        style={{ 
          cursor: cursorStyle,
        }}
      >
        {/* --- LEFT PANEL: DAILY PLANNER --- */}
        <div className="h-full paper-stack max-w-5xl flex-1 relative flex flex-col bg-white">
          <HeaderSection title="sprintly" date={currentDate} />
          {/* Grid Content Container */}
          <div className="h-full flex-1 flex">
              <TimeGrid
                grid={grid}
                categories={categories}
                todos={[]}
                tool={tool}
                currentMinutes={currentMinutes}
                onMouseDownSlot={handleMouseDownSlot}
                onMouseEnterSlot={handleMouseEnterSlot}
                onTodoTagClick={handleTodoTagClick}
                activeMarkerColor={activeMarkerColor}
              />
          </div>
        </div>

        {/* --- RIGHT PANEL: TOOLS --- */}
        <div className="h-full flex flex-col w-1/6 z-20 py-4 gap-4">
          <TodoPanel
          />

          <EraserTool
            isActive={tool.type === 'eraser'}
            onSelect={handleSelectEraser}
          />

          <MarkerSet
            categories={categories}
            tool={tool}
            editingNameId={editingNameId}
            editingColorId={editingColorId}
            tempCatName={tempCatName}
            onAddCategory={handleAddCategory}
            onSelectCategory={handleSelectCategory}
            onDeleteCategory={handleDeleteCategory}
            onStartEditName={handleStartEditName}
            onSaveName={handleSaveCategoryName}
            onNameChange={setTempCatName}
            onToggleColorPicker={handleToggleColorPicker}
            onSelectColor={handleUpdateCategoryColor}
          />
        </div>

        <DragOverlay>
          {activeDragTodo ? (
            <div 
              className="w-48 p-2 shadow-2xl opacity-90 cursor-grabbing font-hand text-sm
              bg-amber-100 border rotate-3"
            >
              {activeDragTodo.text}
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
