import React from 'react';
import { Palette } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeSwitch() {
  const { theme, themeId, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg transition-colors"
        style={{
          backgroundColor: theme.colors.surface,
          color: theme.colors.textPrimary,
          border: `1px solid ${theme.colors.border}`,
        }}
        title="Change theme"
      >
        <Palette size={20} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Theme Picker */}
          <div
            className="absolute top-full right-0 mt-2 p-2 rounded-lg shadow-lg z-40 min-w-[160px]"
            style={{
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            <div
              className="text-xs font-bold uppercase tracking-wider mb-2 pb-2"
              style={{
                color: theme.colors.textTertiary,
                borderBottom: `1px solid ${theme.colors.borderLight}`,
              }}
            >
              Select Theme
            </div>
            
            {availableThemes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded text-sm transition-colors"
                style={{
                  backgroundColor: themeId === t.id ? theme.colors.accent : 'transparent',
                  color: themeId === t.id ? '#ffffff' : theme.colors.textPrimary,
                }}
                onMouseEnter={(e) => {
                  if (themeId !== t.id) {
                    e.currentTarget.style.backgroundColor = theme.colors.surfaceSecondary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (themeId !== t.id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {t.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
