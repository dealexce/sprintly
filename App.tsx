
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  useSensor, 
  useSensors, 
  PointerSensor, 
  DragEndEvent,
  DragStartEvent
} from '@dnd-kit/core';
import { Plus, Eraser, X } from 'lucide-react';
import { clsx } from 'clsx';
import { Category, TimeSlotData, Todo, Tool, TIME_SLOTS_COUNT } from './types';
import { INITIAL_CATEGORIES, formatTime, formatHour12, MARKER_COLORS, getColorHex } from './constants';
import { DraggableTodo } from './components/DraggableTodo';
import { GridSlot } from './components/GridSlot';

// Session Storage Keys
const STORAGE_KEYS = {
  CATEGORIES: 'daySprintCategories',
  TODOS: 'daySprintTodos',
  GRID: 'daySprintGrid',
};

export default function App() {
  // --- State ---
  const [categories, setCategories] = useState<Category[]>(() => {
    const stored = sessionStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return stored ? JSON.parse(stored) : INITIAL_CATEGORIES;
  });
  const [todos, setTodos] = useState<Todo[]>(() => {
    const stored = sessionStorage.getItem(STORAGE_KEYS.TODOS);
    return stored ? JSON.parse(stored) : [];
  });
  const [newTodoText, setNewTodoText] = useState('');
  
  // Initialize grid: 24 hours * 4 slots
  const [grid, setGrid] = useState<TimeSlotData[]>(() => {
    const stored = sessionStorage.getItem(STORAGE_KEYS.GRID);
    if (stored) {
      return JSON.parse(stored);
    }
    return Array.from({ length: TIME_SLOTS_COUNT }).map((_, i) => ({
      index: i,
      timeLabel: formatTime(i),
      categoryId: null,
      todoIds: [],
    }));
  });

  const [tool, setTool] = useState<Tool>({ type: 'marker', categoryId: INITIAL_CATEGORIES[0].id });
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeDragTodo, setActiveDragTodo] = useState<Todo | null>(null);

  // Current Time Tracking
  // We track minutes from start of day to calculate position in AM or PM column
  const [currentMinutes, setCurrentMinutes] = useState<number | null>(null);
  const [previousSlotIndex, setPreviousSlotIndex] = useState<number | null>(null);

  // Category Editing
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [editingColorId, setEditingColorId] = useState<string | null>(null);
  const [tempCatName, setTempCatName] = useState('');

  // --- Sensors ---
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  // --- Effects ---
  // Save to session storage
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.GRID, JSON.stringify(grid));
  }, [grid]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const mins = now.getHours() * 60 + now.getMinutes();
      setCurrentMinutes(mins);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Notify on time slot category changes
  useEffect(() => {
    if (currentMinutes === null) return;

    const currentSlotIndex = Math.floor(currentMinutes / 15);
    const currentSlot = grid[currentSlotIndex];

    // Check if we've transitioned to a new slot with a different category
    if (previousSlotIndex !== null && previousSlotIndex !== currentSlotIndex) {
      const previousSlot = grid[previousSlotIndex];
      
      // Notify if the new slot has a category and it's different from the previous
      if (currentSlot.categoryId && currentSlot.categoryId !== previousSlot.categoryId) {
        const category = categories.find(c => c.id === currentSlot.categoryId);
        const todosInSlot = todos.filter(t => currentSlot.todoIds.includes(t.id));
        
        if (category && 'Notification' in window && Notification.permission === 'granted') {
          const body = todosInSlot.length > 0
            ? `Time for: ${category.name}\n${todosInSlot.map(t => `• ${t.text}`).join('\n')}`
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

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  // --- Logic: Time Grid Painting ---
  const paintSlot = useCallback((index: number) => {
    setGrid(prev => {
      const newGrid = [...prev];
      const slot = newGrid[index];
      
      if (tool.type === 'eraser') {
        if (slot.categoryId) {
             newGrid[index] = { ...slot, categoryId: null, todoIds: [] };
        }
      } else if (tool.type === 'marker' && tool.categoryId) {
        newGrid[index] = { 
          ...slot, 
          categoryId: tool.categoryId
        };
      }
      return newGrid;
    });
  }, [tool]);

  const handleTodoTagClick = (todoId: string) => {
    if (tool.type === 'eraser') {
      setGrid(prev => prev.map(slot => ({
        ...slot,
        todoIds: slot.todoIds.filter(id => id !== todoId)
      })));
    }
  };

  const handleMouseDownSlot = (index: number) => {
    setIsDrawing(true);
    paintSlot(index);
  };

  const handleMouseEnterSlot = (index: number) => {
    if (isDrawing) paintSlot(index);
  };

  const handleMouseUp = () => setIsDrawing(false);

  // --- Logic: Drag and Drop Todos ---
  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'todo') {
      setActiveDragTodo(event.active.data.current.todo as Todo);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragTodo(null);

    if (!over || !active) return;

    const overId = String(over.id);
    if (overId.startsWith('slot-')) {
      const slotIndex = parseInt(overId.replace('slot-', ''), 10);
      const targetSlot = grid[slotIndex];

      if (targetSlot.categoryId) {
        const targetCatId = targetSlot.categoryId;
        const todoId = active.id as string;

        // Flood fill contiguous block
        let start = slotIndex;
        while (start > 0 && grid[start - 1].categoryId === targetCatId) {
          start--;
        }
        let end = slotIndex;
        while (end < TIME_SLOTS_COUNT - 1 && grid[end + 1].categoryId === targetCatId) {
          end++;
        }

        setGrid(prev => {
          const newGrid = [...prev];
          for (let i = start; i <= end; i++) {
            const currentIds = newGrid[i].todoIds;
            if (!currentIds.includes(todoId)) {
              newGrid[i] = { ...newGrid[i], todoIds: [...currentIds, todoId] };
            }
          }
          return newGrid;
        });
      }
    }
  };

  // --- Logic: CRUD ---
  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    setTodos(prev => [...prev, { id: `todo-${Date.now()}`, text: newTodoText, completed: false }]);
    setNewTodoText('');
  };

  const updateTodo = (id: string, text: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, text } : t));
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
    setGrid(prev => prev.map(s => ({
      ...s,
      todoIds: s.todoIds.filter(tid => tid !== id)
    })));
  };

  const addCategory = () => {
    const newCat: Category = { id: `cat-${Date.now()}`, name: 'New Task', color: 'gray-500' };
    setCategories([...categories, newCat]);
    setTool({ type: 'marker', categoryId: newCat.id });
    setEditingNameId(newCat.id);
    setTempCatName(newCat.name);
  };

  const deleteCategory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (categories.length <= 1) return; 
    setCategories(prev => prev.filter(c => c.id !== id));
    setGrid(prev => prev.map(s => s.categoryId === id ? { ...s, categoryId: null, todoIds: [] } : s));
    if (tool.categoryId === id) setTool({ type: 'marker', categoryId: categories[0].id === id ? categories[1].id : categories[0].id });
  };

  const saveCategoryName = (id: string) => {
     setCategories(prev => prev.map(c => c.id === id ? { ...c, name: tempCatName } : c));
     setEditingNameId(null);
  };

  const updateCategoryColor = (id: string, color: string) => {
      setCategories(prev => prev.map(c => c.id === id ? { ...c, color } : c));
      setEditingColorId(null);
  };

  // --- Dynamic Cursor ---
  const cursorStyle = useMemo(() => {
    if (tool.type === 'eraser') {
      const svg = `
        <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ec4899' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>
          <path d='m2.9 20.4 2-12.8c.2-1.1.7-2 1.5-2.8 1.4-1.3 3.5-1.3 4.9 0l3.4 3c1.4 1.3 1.4 3.5 0 4.9l-10 10.4c-1 .9-2.5.6-3.1-.3l-1.9-1.9c-.3-.4-.5-.9-.4-1.5'/>
          <path d='m12.3 8.8 2.6 2.5'/>
          <path d='M7.7 13.6 5.1 11'/>
        </svg>`;
      return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 0 24, auto`;
    } else if (tool.type === 'marker' && tool.categoryId) {
      const category = categories.find(c => c.id === tool.categoryId);
      if (category) {
        const hex = getColorHex(category.color);
        const svg = `
          <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'>
            <circle cx='10' cy='10' r='8' fill='${encodeURIComponent(hex)}' stroke='white' stroke-width='2'/>
          </svg>`;
        return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 10 10, auto`;
      }
    }
    return 'auto';
  }, [tool, categories]);

  // --- AM/PM Logic ---
  const amHours = Array.from({ length: 12 }, (_, i) => i);
  const pmHours = Array.from({ length: 12 }, (_, i) => i + 12);

  // Render a column of hours (12 hours)
  const renderColumn = (hours: number[]) => {
    return (
      <div className="flex-1 flex flex-col relative border-stone-200 last:border-r-0">
        
        {/* Column Headers (Minutes) - repeated per column */}
        <div className="flex border-b border-stone-300 bg-stone-50/80 shrink-0 sticky top-0 z-20">
            <div className="w-12 border-r border-stone-300 bg-stone-100/50"></div>
            {[0, 15, 30, 45].map(min => (
                <div key={min} className="flex-1 text-center py-1 text-[10px] font-mono text-stone-400 border-r border-stone-200 last:border-r-0">
                    :{min.toString().padStart(2, '0')}
                </div>
            ))}
        </div>

        {/* Rows */}
        {hours.map((hour) => {
            // Check if this row is the current hour
            const isCurrentHour = currentMinutes !== null && Math.floor(currentMinutes / 60) === hour;

            return (
            <div key={hour} className="flex-1 flex border-b border-stone-300 min-h-[2.5rem]">
                {/* Time Label (12H) - Compact */}
                <div className="w-12 flex items-center justify-center text-[10px] text-stone-500 font-bold font-mono border-r border-stone-300 bg-stone-100/50 select-none shrink-0">
                    {formatHour12(hour).split(' ')[0]} <span className="text-[8px] ml-0.5 text-stone-400">{hour < 12 ? 'AM' : 'PM'}</span>
                </div>
                
                {/* Slot Container with Relative Positioning for Cursor */}
                <div className="flex-1 flex relative">
                    {/* 4 Quarter Slots */}
                    {[0, 1, 2, 3].map((q) => {
                        const index = hour * 4 + q;
                        const slot = grid[index];
                        const prevSlot = grid[index - 1];
                        const nextSlot = grid[index + 1];
                        
                        const isCategoryStart = slot.categoryId !== null && 
                            (index === 0 || prevSlot?.categoryId !== slot.categoryId);
                        
                        const hasPrevSame = prevSlot?.categoryId === slot.categoryId;
                        const hasNextSame = nextSlot?.categoryId === slot.categoryId;

                        return (
                            <GridSlot 
                                key={index}
                                data={slot}
                                category={categories.find(c => c.id === slot.categoryId)}
                                assignedTodos={todos.filter(t => slot.todoIds.includes(t.id))}
                                prevTodoIds={prevSlot ? prevSlot.todoIds : []}
                                isCategoryStart={isCategoryStart}
                                onMouseDown={handleMouseDownSlot}
                                onMouseEnter={handleMouseEnterSlot}
                                onTodoClick={handleTodoTagClick}
                                hasPrevSame={hasPrevSame}
                                hasNextSame={hasNextSame}
                                isEraserActive={tool.type === 'eraser'}
                            />
                        );
                    })}

                    {/* Vertical Time Cursor - Only rendered in the current hour row */}
                    {isCurrentHour && currentMinutes !== null && (
                        <div 
                            className="absolute top-0 bottom-0 z-40 pointer-events-none"
                            style={{ left: `${((currentMinutes % 60) / 60) * 100}%` }}
                        >
                             {/* Vertical Line */}
                             <div className="absolute inset-y-0 -left-px w-0.5 bg-red-500 shadow-[0_0_2px_rgba(239,68,68,0.5)]"></div>
                             
                             {/* Anchors */}
                             <div className="absolute top-0 -left-[2.5px] w-1.5 h-1.5 bg-red-500 rounded-full -translate-y-1/2"></div>
                             <div className="absolute bottom-0 -left-[2.5px] w-1.5 h-1.5 bg-red-500 rounded-full translate-y-1/2"></div>
                             
                             {/* Dashed Tail -> */}
                             <div className="absolute top-1/2 left-0 w-8 border-t-[1.5px] border-dashed border-red-500/70"></div>
                             
                             {/* Label */}
                             <div className="absolute top-1/2 left-8 -translate-y-1/2 bg-red-500 text-white text-[7px] font-bold px-1 py-px rounded-sm shadow-sm leading-tight">
                                NOW
                             </div>
                        </div>
                    )}
                </div>
            </div>
        )})}
      </div>
    );
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div 
        className="flex h-screen w-screen overflow-hidden p-4 md:p-8 gap-8 items-center justify-center relative transition-colors"
        style={{ cursor: cursorStyle }}
      >
        
        {/* --- LEFT PANEL: DAILY PLANNER (Flat Paper) --- */}
        <div className="h-full flex-1 max-w-5xl relative z-10 flex flex-col">
           <div className="h-full bg-[#fdfbf7] rounded-sm paper-stack flex flex-col overflow-hidden border border-stone-200/60 relative">
             {/* Header */}
             <div className="h-16 border-b-2 border-stone-200 flex items-center justify-between px-6 bg-white shrink-0">
                <div>
                  <h1 className="font-mono text-3xl text-stone-800">day sprint</h1>
                  <p className="text-xs text-stone-400 font-mono tracking-widest uppercase">
                    {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full border-4 border-stone-200 bg-stone-100 flex items-center justify-center opacity-50">
                    <div className="w-6 h-6 rounded-full bg-stone-300"></div>
                </div>
             </div>
             
             {/* Grid Content Container */}
             <div className="flex-1 overflow-hidden flex flex-col bg-[#fdfbf7] relative">
                <div className="absolute inset-0 pattern-grid opacity-30 pointer-events-none mix-blend-multiply"></div>
                
                {/* The Two-Column Grid */}
                <div className="flex-1 flex overflow-hidden">
                    {/* AM Column */}
                    <div className="flex-1 flex flex-col border-r-4 border-double border-stone-300/50">
                        {renderColumn(amHours)}
                    </div>
                    {/* PM Column */}
                    <div className="flex-1 flex flex-col">
                        {renderColumn(pmHours)}
                    </div>
                </div>
             </div>
           </div>
        </div>

        {/* --- RIGHT PANEL: TOOLS --- */}
        <div className="flex flex-col w-80 h-full gap-4 z-20 py-4">
            
            {/* 1. Sticky Note (Todos) */}
            <div className="flex-1 relative transform rotate-1 hover:rotate-0 transition-transform duration-300 origin-top-right min-h-0">
                <div className="absolute inset-0 bg-black/20 blur-md translate-y-2 translate-x-2 rounded-sm"></div>
                
                <div className="absolute inset-0 bg-yellow-200 shadow-inner p-4 flex flex-col clip-path-polygon rounded-sm">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/30 backdrop-blur-sm transform -rotate-1 shadow-sm border border-white/40 z-20"></div>

                    <h2 className="font-hand text-3xl font-bold text-stone-800 mb-4 mt-2 flex items-center gap-2">
                        <span>To-Do</span>
                        <div className="h-px flex-1 bg-stone-800/10"></div>
                    </h2>

                    <form onSubmit={addTodo} className="mb-4 shrink-0">
                        <input 
                            type="text" 
                            value={newTodoText}
                            onChange={(e) => setNewTodoText(e.target.value)}
                            placeholder="Add task..."
                            className="w-full bg-transparent border-b-2 border-stone-400/30 px-1 py-1 font-hand text-xl focus:outline-none focus:border-stone-600 text-stone-800 placeholder-stone-500/30"
                        />
                    </form>

                    <div className="flex-1 overflow-y-auto pr-1 paper-scroll">
                        {todos.length === 0 && (
                             <div className="text-center mt-10 opacity-40 font-hand text-xl -rotate-6">
                                Nothing to do yet!
                             </div>
                        )}
                        {todos.map(todo => (
                            <DraggableTodo 
                                key={todo.id} 
                                todo={todo} 
                                onDelete={deleteTodo}
                                onToggle={toggleTodo}
                                onUpdate={updateTodo}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* 2. Middle Section: Eraser Object */}
            <div className="h-14 flex justify-center items-center relative perspective-500 shrink-0">
                 <div 
                    onClick={() => {
                        setTool({ type: 'eraser', categoryId: null });
                        setEditingNameId(null);
                        setEditingColorId(null);
                    }}
                    className={clsx(
                        "relative w-full mx-4 h-10 bg-pink-400 rounded-sm shadow-[2px_4px_6px_rgba(0,0,0,0.3)] cursor-pointer transform transition-all flex items-center justify-center group border-b-4 border-pink-600",
                        tool.type === 'eraser' 
                            ? "scale-105 -translate-y-1 rotate-1 shadow-[4px_8px_12px_rgba(0,0,0,0.3)] ring-2 ring-white" 
                            : "hover:-translate-y-0.5 hover:shadow-[2px_5px_8px_rgba(0,0,0,0.3)]"
                    )}
                 >
                     <div className="absolute left-4 right-4 top-0 bottom-0 bg-white opacity-30 border-x border-white/50"></div>
                     <span className="relative font-bold text-white text-xs tracking-widest uppercase drop-shadow-md flex items-center gap-2">
                        <Eraser size={14} /> Eraser
                     </span>
                 </div>
            </div>

            {/* 3. Planning Kit (Markers) */}
            <div className="flex-1 bg-stone-800 rounded-xl p-1 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t border-stone-700 relative max-h-[40%] min-h-[200px]">
                <div className="h-full bg-stone-900/50 rounded-lg p-4 flex flex-col border-inner border-black/20 overflow-hidden">
                    <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2 shrink-0">
                        <h3 className="text-stone-400 font-bold uppercase tracking-widest text-[10px]">Marker Set</h3>
                        <button onClick={addCategory} className="text-stone-500 hover:text-white transition-colors bg-stone-800 p-1 rounded hover:bg-stone-700">
                            <Plus size={16} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 paper-scroll">
                        <div className="grid grid-cols-1 gap-3 pb-4">
                            {categories.map(cat => {
                                const isSelected = tool.type === 'marker' && tool.categoryId === cat.id;
                                const isEditingName = editingNameId === cat.id;
                                const isEditingColor = editingColorId === cat.id;

                                return (
                                    <div 
                                        key={cat.id}
                                        className={clsx(
                                            "rounded-r-full flex flex-col transition-all group relative select-none",
                                            isSelected ? "translate-x-2" : "hover:translate-x-1",
                                            isEditingColor ? "mb-12 z-20" : ""
                                        )}
                                    >
                                        <div className={clsx(
                                            "flex items-center h-10 shadow-md rounded-r-full",
                                            isSelected ? "ring-2 ring-white/20" : ""
                                        )}>
                                            
                                            {/* TIP - Solid block style */}
                                            <div 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setTool({ type: 'marker', categoryId: cat.id });
                                                    setEditingColorId(isEditingColor ? null : cat.id);
                                                    setEditingNameId(null);
                                                }}
                                                className={clsx(
                                                    "w-10 h-full relative cursor-pointer border-r border-black/20 shadow-inner hover:brightness-110",
                                                    `bg-${cat.color}`
                                                )}
                                            >
                                                {/* Simple bevel effect */}
                                                <div className="absolute inset-x-0 top-0 h-[2px] bg-white/30"></div>
                                                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-black/10"></div>
                                            </div>

                                            {/* BODY */}
                                            <div 
                                                onClick={() => {
                                                    setTool({ type: 'marker', categoryId: cat.id });
                                                    setEditingColorId(null);
                                                    setEditingNameId(null); 
                                                }}
                                                className={clsx(
                                                    "flex-1 h-full bg-stone-800 flex items-center px-3 relative rounded-r-full border-t border-b border-r border-stone-950 cursor-pointer hover:bg-stone-750"
                                                )}
                                            >
                                                {isEditingName ? (
                                                    <input 
                                                        value={tempCatName}
                                                        onChange={e => setTempCatName(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') saveCategoryName(cat.id);
                                                            if (e.key === 'Escape') setEditingNameId(null);
                                                        }}
                                                        autoFocus
                                                        onClick={(e) => e.stopPropagation()}
                                                        onBlur={() => saveCategoryName(cat.id)}
                                                        className="w-full bg-stone-900 text-white text-xs px-1 py-0.5 rounded outline-none border border-blue-500"
                                                    />
                                                ) : (
                                                    <span 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setTool({ type: 'marker', categoryId: cat.id });
                                                            setEditingNameId(cat.id);
                                                            setTempCatName(cat.name);
                                                            setEditingColorId(null);
                                                        }}
                                                        className="font-bold text-stone-300 text-xs truncate cursor-text hover:text-white hover:underline decoration-dotted underline-offset-4 transition-colors"
                                                    >
                                                        {cat.name}
                                                    </span>
                                                )}

                                                {!isEditingName && categories.length > 1 && (
                                                    <button 
                                                        onClick={(e) => deleteCategory(cat.id, e)}
                                                        className="ml-auto text-stone-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Color Picker Dropdown */}
                                        {isEditingColor && (
                                            <div className="absolute top-full left-0 mt-2 p-2 bg-stone-800 rounded-lg border border-stone-600 shadow-xl z-30 flex flex-wrap gap-1 w-48 animate-in fade-in zoom-in-95 duration-100">
                                                {MARKER_COLORS.map(color => (
                                                    <button 
                                                        key={color}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            updateCategoryColor(cat.id, color);
                                                        }}
                                                        className={clsx(
                                                            "w-5 h-5 rounded-full border border-white/10 hover:scale-110 transition-transform",
                                                            `bg-${color}`,
                                                            cat.color === color && "ring-2 ring-white"
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <DragOverlay>
          {activeDragTodo ? (
            <div className="w-48 bg-yellow-100 p-2 border border-stone-300 shadow-2xl rotate-3 opacity-90 cursor-grabbing font-hand text-sm rounded-sm">
               {activeDragTodo.text}
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
