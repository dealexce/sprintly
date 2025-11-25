import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme, themes, defaultThemeId } from '../themes';

interface ThemeContextType {
  theme: Theme;
  themeId: string;
  setTheme: (themeId: string) => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'daySprintTheme';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeId, setThemeId] = useState<string>(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored && themes[stored] ? stored : defaultThemeId;
  });

  const theme = themes[themeId];

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, themeId);
    
    const root = document.documentElement;
    const body = document.body;
    
    // Apply theme colors as CSS custom properties
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value as string);
    });
    
    // Apply shadows
    Object.entries(theme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value as string);
    });
    
    // Apply patterns
    Object.entries(theme.patterns).forEach(([key, value]) => {
      if (value) root.style.setProperty(`--pattern-${key}`, value as string);
    });
    
    // Apply typography
    Object.entries(theme.typography).forEach(([key, value]) => {
      root.style.setProperty(`--typography-${key}`, value as string);
    });
    
    // Apply effects
    Object.entries(theme.effects).forEach(([key, value]) => {
      root.style.setProperty(`--effect-${key}`, value as string);
    });
    
    // Apply borders
    Object.entries(theme.borders).forEach(([key, value]) => {
      root.style.setProperty(`--border-${key}`, value as string);
    });
    
    // Apply animations
    Object.entries(theme.animations).forEach(([key, value]) => {
      root.style.setProperty(`--animation-${key}`, value as string);
    });
    
    // Apply spacing
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, String(value));
    });
    
    // Apply background (support gradients)
    if (theme.colors.background.includes('gradient')) {
      body.style.background = theme.colors.background;
      body.style.backgroundColor = '';
    } else {
      body.style.backgroundColor = theme.colors.background;
      body.style.background = '';
    }
    
    // Apply special theme class
    body.className = 'text-slate-800 select-none';
    if (theme.special?.cssClass) {
      body.classList.add(theme.special.cssClass);
    }
    
    // Apply custom styles
    if (theme.special?.customStyles) {
      Object.entries(theme.special.customStyles).forEach(([property, value]) => {
        root.style.setProperty(`--custom-${property}`, value as string);
      });
    }
  }, [theme, themeId]);

  const setTheme = (newThemeId: string) => {
    if (themes[newThemeId]) {
      setThemeId(newThemeId);
    }
  };

  const availableThemes = Object.values(themes);

  // Listen for theme changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY && e.newValue) {
        if (themes[e.newValue]) {
          setThemeId(e.newValue);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, themeId, setTheme, availableThemes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
