import React from 'react';
import { Plus, X } from 'lucide-react';
import { clsx } from 'clsx';
import { Category, Tool } from '../types';
import { MARKER_COLORS } from '../constants';

interface MarkerSetProps {
  categories: Category[];
  tool: Tool;
  editingNameId: string | null;
  editingColorId: string | null;
  tempCatName: string;
  onAddCategory: () => void;
  onSelectCategory: (id: string) => void;
  onDeleteCategory: (id: string, e: React.MouseEvent) => void;
  onStartEditName: (id: string, name: string) => void;
  onSaveName: (id: string) => void;
  onCancelEditName: () => void;
  onNameChange: (name: string) => void;
  onToggleColorPicker: (id: string) => void;
  onSelectColor: (id: string, color: string) => void;
}

export function MarkerSet({
  categories,
  tool,
  editingNameId,
  editingColorId,
  tempCatName,
  onAddCategory,
  onSelectCategory,
  onDeleteCategory,
  onStartEditName,
  onSaveName,
  onCancelEditName,
  onNameChange,
  onToggleColorPicker,
  onSelectColor,
}: MarkerSetProps) {
  return (
    <div className="flex-1 bg-stone-800 rounded-xl p-1 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t border-stone-700 relative max-h-[40%] min-h-[200px]">
      <div className="h-full bg-stone-900/50 rounded-lg p-4 flex flex-col border-inner border-black/20 overflow-hidden">
        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2 shrink-0">
          <h3 className="text-stone-400 font-bold uppercase tracking-widest text-[10px]">
            Marker Set
          </h3>
          <button
            onClick={onAddCategory}
            className="text-stone-500 hover:text-white transition-colors bg-stone-800 p-1 rounded hover:bg-stone-700"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 paper-scroll">
          <div className="grid grid-cols-1 gap-3 pb-4">
            {categories.map((cat) => {
              const isSelected =
                tool.type === 'marker' && tool.categoryId === cat.id;
              const isEditingName = editingNameId === cat.id;
              const isEditingColor = editingColorId === cat.id;

              return (
                <div
                  key={cat.id}
                  className={clsx(
                    'rounded-r-full flex flex-col transition-all group relative select-none',
                    isSelected ? 'translate-x-2' : 'hover:translate-x-1',
                    isEditingColor ? 'mb-12 z-20' : ''
                  )}
                >
                  <div
                    className={clsx(
                      'flex items-center h-10 shadow-md rounded-r-full',
                      isSelected ? 'ring-2 ring-white/20' : ''
                    )}
                  >
                    {/* TIP */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCategory(cat.id);
                        onToggleColorPicker(cat.id);
                      }}
                      className={clsx(
                        'w-10 h-full relative cursor-pointer border-r border-black/20 shadow-inner hover:brightness-110',
                        `bg-${cat.color}`
                      )}
                    >
                      <div className="absolute inset-x-0 top-0 h-[2px] bg-white/30"></div>
                      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-black/10"></div>
                    </div>

                    {/* BODY */}
                    <div
                      onClick={() => {
                        onSelectCategory(cat.id);
                      }}
                      className={clsx(
                        'flex-1 h-full bg-stone-800 flex items-center px-3 relative rounded-r-full border-t border-b border-r border-stone-950 cursor-pointer hover:bg-stone-750'
                      )}
                    >
                      {isEditingName ? (
                        <input
                          value={tempCatName}
                          onChange={(e) => onNameChange(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') onSaveName(cat.id);
                            if (e.key === 'Escape') onCancelEditName();
                          }}
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                          onBlur={() => onSaveName(cat.id)}
                          className="w-full bg-stone-900 text-white text-xs px-1 py-0.5 rounded outline-none border border-blue-500"
                        />
                      ) : (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCategory(cat.id);
                            onStartEditName(cat.id, cat.name);
                          }}
                          className="font-bold text-stone-300 text-xs truncate cursor-text hover:text-white hover:underline decoration-dotted underline-offset-4 transition-colors"
                        >
                          {cat.name}
                        </span>
                      )}

                      {!isEditingName && categories.length > 1 && (
                        <button
                          onClick={(e) => onDeleteCategory(cat.id, e)}
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
                      {MARKER_COLORS.map((color) => (
                        <button
                          key={color}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectColor(cat.id, color);
                          }}
                          className={clsx(
                            'w-5 h-5 rounded-full border border-white/10 hover:scale-110 transition-transform',
                            `bg-${color}`,
                            cat.color === color && 'ring-2 ring-white'
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
  );
}
