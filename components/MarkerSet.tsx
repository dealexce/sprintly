import React from 'react';
import { Plus, X } from 'lucide-react';
import { clsx } from 'clsx';
import { Category, Tool } from '../types';
import { MARKER_COLORS } from '../constants';
import { useTheme } from '../contexts/ThemeContext';

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
  const { theme } = useTheme();
  
  return (
    <div 
      className="flex-1 rounded-xl p-1 border-t relative max-h-[40%] min-h-[200px]"
      style={{
        backgroundColor: theme.colors.markerPanelBg,
        boxShadow: theme.shadows.marker,
        borderColor: theme.colors.markerPanelBorder,
      }}
    >
      <div 
        className="h-full rounded-lg p-4 flex flex-col border-inner overflow-hidden"
        style={{
          backgroundColor: theme.colors.markerPanelBgInner,
          borderColor: 'rgba(0, 0, 0, 0.2)',
        }}
      >
        <div 
          className="flex justify-between items-center mb-4 pb-2 shrink-0"
          style={{ borderBottom: `1px solid rgba(255, 255, 255, 0.1)` }}
        >
          <h3 
            className="font-bold uppercase tracking-widest text-[10px]"
            style={{ color: theme.colors.markerPanelText }}
          >
            Marker Set
          </h3>
          <button
            onClick={onAddCategory}
            className="transition-colors p-1 rounded"
            style={{
              color: theme.colors.markerPanelText,
              backgroundColor: theme.colors.markerBodyBg,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.backgroundColor = theme.colors.markerBodyBgHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = theme.colors.markerPanelText;
              e.currentTarget.style.backgroundColor = theme.colors.markerBodyBg;
            }}
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
                        'flex-1 h-full flex items-center px-3 relative rounded-r-full border-t border-b border-r cursor-pointer'
                      )}
                      style={{
                        backgroundColor: theme.colors.markerBodyBg,
                        borderColor: theme.colors.markerPanelBorder,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme.colors.markerBodyBgHover;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = theme.colors.markerBodyBg;
                      }}
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
                          className="w-full text-white text-xs px-1 py-0.5 rounded outline-none"
                          style={{
                            backgroundColor: theme.colors.markerPanelBgInner,
                            border: `1px solid ${theme.colors.accent}`,
                          }}
                        />
                      ) : (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCategory(cat.id);
                            onStartEditName(cat.id, cat.name);
                          }}
                          className="font-bold text-xs truncate cursor-text hover:underline decoration-dotted underline-offset-4 transition-colors"
                          style={{ color: theme.colors.markerPanelText }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#ffffff';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = theme.colors.markerPanelText;
                          }}
                        >
                          {cat.name}
                        </span>
                      )}

                      {!isEditingName && categories.length > 1 && (
                        <button
                          onClick={(e) => onDeleteCategory(cat.id, e)}
                          className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-1"
                          style={{ color: theme.colors.markerPanelText }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#f87171';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = theme.colors.markerPanelText;
                          }}
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Color Picker Dropdown */}
                  {isEditingColor && (
                    <div 
                      className="absolute top-full left-0 mt-2 p-2 rounded-lg shadow-xl z-30 flex flex-wrap gap-1 w-48 animate-in fade-in zoom-in-95 duration-100"
                      style={{
                        backgroundColor: theme.colors.markerBodyBg,
                        border: `1px solid ${theme.colors.markerPanelBorder}`,
                      }}
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
      </div>
    </div>
  );
}
