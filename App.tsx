import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { TimeSlotData, Tool, TIME_SLOTS_COUNT } from './types';
import { INITIAL_CATEGORIES, formatTime } from './constants';

// Hooks
import { useLocalStorage } from './hooks/useLocalStorage';
import { useCurrentTime } from './hooks/useCurrentTime';
import { useNotifications } from './hooks/useNotifications';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { useTheme } from './contexts/ThemeContext';

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
import { ThemeSwitch } from './components/ThemeSwitch';

// Session Storage Keys
const STORAGE_KEYS = {
  CATEGORIES: 'daySprintCategories',
  TODOS: 'daySprintTodos',
  GRID: 'daySprintGrid',
};

export default function App() {
  const { theme } = useTheme();
  
  // --- State Management with Custom Hooks ---
  const [categories, setCategories] = useLocalStorage(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  const [todos, setTodos] = useLocalStorage(STORAGE_KEYS.TODOS, []);
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
  useNotifications(currentMinutes, grid, categories, todos);
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

  // --- Todo Management ---
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    setTodos((prev) => [...prev, createNewTodo(newTodoText)]);
    setNewTodoText('');
  };

  const handleUpdateTodo = (id: string, text: string) => {
    setTodos((prev) => updateTodoText(prev, id, text));
  };

  const handleToggleTodo = (id: string) => {
    setTodos((prev) => toggleTodoCompleted(prev, id));
  };

  const handleDeleteTodo = (id: string) => {
    setTodos((prev) => deleteTodoUtil(prev, id));
    setGrid((prev) => removeTodoFromAllSlots(prev, id));
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

  const handleSaveCategoryName = (id: string) => {
    setCategories((prev) => updateCategoryName(prev, id, tempCatName));
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
        className="flex h-screen w-screen overflow-hidden gap-8 items-center justify-center relative"
        style={{ 
          cursor: cursorStyle,
          padding: theme.spacing.padding,
          fontFamily: theme.typography.bodyFont,
          fontSize: theme.typography.bodySize,
          transition: `all ${theme.animations.duration} ${theme.animations.easing}`,
          backgroundColor: theme.colors.background,
        }}
      >
        {/* Theme Switcher - Floating in top right */}
        <div className="absolute top-4 right-4 z-50">
          <ThemeSwitch />
        </div>

        {/* --- LEFT PANEL: DAILY PLANNER --- */}
        <div className="h-full flex-1 max-w-5xl relative z-10 flex flex-col">
          <div 
            className="h-full paper-stack flex flex-col overflow-hidden relative"
            style={{ 
              backgroundColor: theme.colors.paperBg,
              border: `${theme.borders.width} ${theme.borders.style} ${theme.colors.border}`,
              borderRadius: theme.borders.radius,
              filter: `brightness(${theme.effects.brightness}) contrast(${theme.effects.contrast}) saturate(${theme.effects.saturate})`,
            }}
          >
            <HeaderSection title="day sprint" date={currentDate} />

            {/* Grid Content Container */}
            <div 
              className="flex-1 overflow-hidden flex flex-col relative"
              style={{ 
                backgroundColor: theme.colors.gridBg,
              }}
            >
              <div className="absolute inset-0 pattern-grid opacity-30 pointer-events-none mix-blend-multiply"></div>
              {theme.patterns.texture && (
                <div 
                  className="absolute inset-0 pointer-events-none" 
                  style={{ 
                    backgroundImage: theme.patterns.texture,
                    opacity: 0.5,
                  }}
                ></div>
              )}

              <TimeGrid
                grid={grid}
                categories={categories}
                todos={todos}
                tool={tool}
                currentMinutes={currentMinutes}
                onMouseDownSlot={handleMouseDownSlot}
                onMouseEnterSlot={handleMouseEnterSlot}
                onTodoTagClick={handleTodoTagClick}
                activeMarkerColor={activeMarkerColor}
              />
            </div>
          </div>
        </div>

        {/* --- RIGHT PANEL: TOOLS --- */}
        <div 
          className="flex flex-col w-80 h-full z-20 py-4"
          style={{ gap: theme.spacing.gridGap || '1rem' }}
        >
          <TodoPanel
            todos={todos}
            newTodoText={newTodoText}
            onNewTodoChange={setNewTodoText}
            onAddTodo={handleAddTodo}
            onDeleteTodo={handleDeleteTodo}
            onToggleTodo={handleToggleTodo}
            onUpdateTodo={handleUpdateTodo}
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
            onCancelEditName={() => setEditingNameId(null)}
            onNameChange={setTempCatName}
            onToggleColorPicker={handleToggleColorPicker}
            onSelectColor={handleUpdateCategoryColor}
          />
        </div>

        <DragOverlay>
          {activeDragTodo ? (
            <div 
              className="w-48 p-2 shadow-2xl opacity-90 cursor-grabbing font-hand text-sm"
              style={{
                backgroundColor: theme.colors.tagBg,
                border: `${theme.borders.width} ${theme.borders.style} ${theme.colors.tagBorder}`,
                color: theme.colors.tagText,
                borderRadius: theme.borders.radius,
                transform: 'rotate(3deg)',
                fontFamily: theme.typography.handFont,
              }}
            >
              {activeDragTodo.text}
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
