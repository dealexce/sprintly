import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { clsx } from 'clsx';
import { Category, Tool } from '../types';
import { MARKER_COLORS } from '../constants';
import { useTheme } from '../contexts/ThemeContext';
import SpanInput from './common/SpanInput';

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
  onSaveName: (id: string, value: string) => void;
  onNameChange: (name: string) => void;
  onToggleColorPicker: (id: string) => void;
  onSelectColor: (id: string, color: string) => void;
}

export function MarkerSet({
  categories,
  tool,
  editingNameId,
  editingColorId,
  onAddCategory,
  onSelectCategory,
  onDeleteCategory,
  onStartEditName,
  onSaveName,
  onNameChange,
  onToggleColorPicker,
  onSelectColor,
}: MarkerSetProps) {

  return (
    <div
      className="flex flex-col flex-1 rounded-xl p-6 border-t relative bg-secondary max-h-1/2"
    >
      <div
        className="flex justify-between items-center mb-4 pb-2 shrink-0 border-b border-white/10 "
      >
        <h3
          className="font-bold uppercase tracking-widest text-[10px] text-primary"
        >
          Marker Set
        </h3>
        <Plus size={20}
          onClick={onAddCategory}
          className="transition p-1 rounded cursor-pointer   text-neutral-200 bg-neutral-800 
            hover:text-white hover:bg-neutral-700 "
        >
        </Plus>
      </div>

      <div className="flex flex-col p-4 gap-3 overflow-x-visible overflow-y-auto  ">
        {categories.map((cat) => {
          const isSelected =
            tool.type === 'marker' && tool.categoryId === cat.id;
          const isEditingName = editingNameId === cat.id;
          const isEditingColor = editingColorId === cat.id;

          return (
            <div
              key={cat.id}
              className={clsx(
                'rounded-l-full transition-all select-none',
                isSelected ? '-translate-x-2 border-white border-2' : 'hover:-translate-x-1',
                isEditingColor ? 'mb-12 z-20' : ''
              )}
            >
              <div
                className={clsx(
                  'flex items-center h-10 shadow-md rounded-r-full'
                )}
              >
                {/* TIP */}
                <div
                  className={clsx(
                    'w-10 h-full flex-none rounded-l-full relative cursor-pointer inset-shadow hover:brightness-110',
                    `bg-${cat.color}`
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCategory(cat.id);
                    onToggleColorPicker(cat.id);
                  }}

                >
                </div>

                {/* BODY */}
                <div
                  onClick={() => {
                    onSelectCategory(cat.id);
                  }}
                  className="group flex-1 h-full flex items-center px-3 relative rounded-r-md cursor-pointer 
                      bg-zinc-800 hover:bg-zinc-700
                      transition"
                >
                  <SpanInput id={cat.id} defaultValue={cat.name} onSave={(newName) => onSaveName(cat.id, newName)}
                   className="text-zinc-500 text-sm p-1
                   hover:bg-zinc-800 
                   focus:bg-zinc-900
                   transition-colors" />
                  <div
                    className="ml-auto p-1 rounded flex items-center gap-1 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    onClick={(e) => onDeleteCategory(cat.id, e)}
                  >
                    <X size={12} className="text-zinc-300 hover:text-red-600" />
                  </div>
                </div>
              </div>

              {/* Color Picker Dropdown */}
              {isEditingColor && (
                <div
                  className="absolute top-full left-0 mt-2 p-2 rounded-lg shadow-xl z-30 flex flex-wrap gap-1 w-48 animate-in fade-in zoom-in-95 duration-100
                  bg-secondary border border-white/10"
                >
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
  );
}
