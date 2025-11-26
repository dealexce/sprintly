export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    // Background & Surface
    background: string;
    surface: string;
    surfaceSecondary: string;
    paperBg: string;
    
    // Text
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    
    // Borders
    border: string;
    borderLight: string;
    borderDark: string;
    
    // UI Elements
    gridBg: string;
    gridBorder: string;
    gridHover: string;
    headerBg: string;
    
    // Accent
    accent: string;
    accentLight: string;
    
    // Sticky Note (Todo Panel)
    stickyBg: string;
    stickyText: string;
    stickyBorder: string;
    stickyTape: string;
    
    // Tag/Todo Tags
    tagBg: string;
    tagText: string;
    tagBorder: string;
    
    // Marker Set Panel
    markerPanelBg: string;
    markerPanelBgInner: string;
    markerPanelText: string;
    markerPanelBorder: string;
    markerBodyBg: string;
    markerBodyBgHover: string;
    
    // Time Column
    timeHeaderBg: string;
    timeLabelBg: string;
    timeLabelText: string;
  };
  typography: {
    headerFont: string;
    bodyFont: string;
    monoFont: string;
    handFont: string;
    headerSize: string;
    bodySize: string;
    letterSpacing: string;
    lineHeight: string;
    fontWeight: string;
  };
  effects: {
    blur: string;
    brightness: string;
    contrast: string;
    saturate: string;
    glassBlur: string;
    glassOpacity: string;
  };
  borders: {
    radius: string;
    width: string;
    style: string;
  };
  shadows: {
    paper: string;
    sticky: string;
    marker: string;
    elevation1: string;
    elevation2: string;
    elevation3: string;
  };
  patterns: {
    grid: string;
    texture?: string;
  };
  animations: {
    duration: string;
    easing: string;
  };
  spacing: {
    compact: boolean;
    gridGap: string;
    padding: string;
  };
  special?: {
    cssClass?: string;
    customStyles?: Record<string, string>;
  };
}

export const themes: Record<string, Theme> = {
  warm: {
    id: 'warm',
    name: 'Warm Paper',
    description: 'Classic warm paper aesthetic with handwritten charm',
    colors: {
      background: '#2a2a2a',
      surface: '#fdfbf7',
      surfaceSecondary: '#f8f6f2',
      paperBg: '#fdfbf7',
      
      textPrimary: '#292524',
      textSecondary: '#57534e',
      textTertiary: '#a8a29e',
      
      border: '#d6d3d1',
      borderLight: '#e7e5e4',
      borderDark: '#a8a29e',
      
      gridBg: '#fdfbf7',
      gridBorder: '#e7e5e4',
      gridHover: 'rgba(0, 0, 0, 0.02)',
      headerBg: '#ffffff',
      
      accent: '#3b82f6',
      accentLight: '#93c5fd',
      
      stickyBg: '#fef3c7',
      stickyText: '#292524',
      stickyBorder: '#78716c',
      stickyTape: 'rgba(255, 255, 255, 0.3)',
      
      tagBg: '#fffae5',
      tagText: '#292524',
      tagBorder: '#78716c',
      
      markerPanelBg: '#292524',
      markerPanelBgInner: 'rgba(0, 0, 0, 0.5)',
      markerPanelText: '#a8a29e',
      markerPanelBorder: '#57534e',
      markerBodyBg: '#292524',
      markerBodyBgHover: '#3f3d3a',
      
      timeHeaderBg: 'rgba(250, 250, 249, 0.8)',
      timeLabelBg: 'rgba(245, 245, 244, 0.5)',
      timeLabelText: '#a8a29e',
    },
    typography: {
      headerFont: "'Inter', sans-serif",
      bodyFont: "'Inter', sans-serif",
      monoFont: "'SF Mono', monospace",
      handFont: "'Kalam', cursive",
      headerSize: '1.875rem',
      bodySize: '1rem',
      letterSpacing: 'normal',
      lineHeight: '1.5',
      fontWeight: 'normal',
    },
    effects: {
      blur: 'none',
      brightness: '100%',
      contrast: '100%',
      saturate: '100%',
      glassBlur: '0px',
      glassOpacity: '1',
    },
    borders: {
      radius: '0.125rem',
      width: '1px',
      style: 'solid',
    },
    shadows: {
      paper: '1px 1px 0 #e5e5e5, 2px 2px 0 #e5e5e5, 3px 3px 0 #e5e5e5, 4px 4px 0 #e5e5e5, 5px 5px 0 #e5e5e5, 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
      sticky: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
      marker: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
      elevation1: '0 1px 3px rgba(0, 0, 0, 0.12)',
      elevation2: '0 4px 6px rgba(0, 0, 0, 0.16)',
      elevation3: '0 10px 20px rgba(0, 0, 0, 0.19)',
    },
    patterns: {
      grid: 'linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)',
    },
    animations: {
      duration: '200ms',
      easing: 'ease-out',
    },
    spacing: {
      compact: false,
      gridGap: '0',
      padding: '1rem',
    },
  },
  
  retroPC: {
    id: 'retroPC',
    name: 'Retro PC',
    description: 'Classic DOS/CRT terminal vibes with scanlines',
    colors: {
      background: '#000000',
      surface: '#0a0a0a',
      surfaceSecondary: '#1a1a1a',
      paperBg: '#0a0a0a',
      
      textPrimary: '#00ff00',
      textSecondary: '#00cc00',
      textTertiary: '#008800',
      
      border: '#00ff00',
      borderLight: '#00cc00',
      borderDark: '#008800',
      
      gridBg: '#0a0a0a',
      gridBorder: '#003300',
      gridHover: 'rgba(0, 255, 0, 0.1)',
      headerBg: '#000000',
      
      accent: '#00ffff',
      accentLight: '#00cccc',
      
      stickyBg: '#1a1a00',
      stickyText: '#ffff00',
      stickyBorder: '#ffff00',
      stickyTape: 'rgba(255, 255, 0, 0.2)',
      
      tagBg: '#1a1a00',
      tagText: '#ffff00',
      tagBorder: '#ffff00',
      
      markerPanelBg: '#000000',
      markerPanelBgInner: 'rgba(0, 0, 0, 0.8)',
      markerPanelText: '#00ff00',
      markerPanelBorder: '#00ff00',
      markerBodyBg: '#001100',
      markerBodyBgHover: '#002200',
      
      timeHeaderBg: 'rgba(0, 0, 0, 0.95)',
      timeLabelBg: 'rgba(0, 17, 0, 0.8)',
      timeLabelText: '#00ff00',
    },
    typography: {
      headerFont: "'Courier New', monospace",
      bodyFont: "'Courier New', monospace",
      monoFont: "'Courier New', monospace",
      handFont: "'Courier New', monospace",
      headerSize: '1.5rem',
      bodySize: '0.875rem',
      letterSpacing: '0.05em',
      lineHeight: '1.2',
      fontWeight: 'bold',
    },
    effects: {
      blur: 'none',
      brightness: '110%',
      contrast: '120%',
      saturate: '150%',
      glassBlur: '0px',
      glassOpacity: '1',
    },
    borders: {
      radius: '0',
      width: '2px',
      style: 'solid',
    },
    shadows: {
      paper: '0 0 20px rgba(0, 255, 0, 0.3), inset 0 0 60px rgba(0, 255, 0, 0.05)',
      sticky: 'inset 0 0 20px rgba(255, 255, 0, 0.2)',
      marker: '0 0 10px rgba(0, 255, 0, 0.5)',
      elevation1: '0 0 5px rgba(0, 255, 0, 0.3)',
      elevation2: '0 0 10px rgba(0, 255, 0, 0.4)',
      elevation3: '0 0 20px rgba(0, 255, 0, 0.5)',
    },
    patterns: {
      grid: 'linear-gradient(to right, rgba(0,255,0,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,255,0,0.1) 1px, transparent 1px)',
      texture: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.03) 2px, rgba(0, 255, 0, 0.03) 4px)',
    },
    animations: {
      duration: '0ms',
      easing: 'linear',
    },
    spacing: {
      compact: true,
      gridGap: '1px',
      padding: '0.5rem',
    },
    special: {
      cssClass: 'theme-retro-pc',
      customStyles: {
        textShadow: '0 0 5px currentColor',
        fontSmoothing: 'none',
      },
    },
  }
};

export const MARKER_COLORS = [
  'slate-600',
  'red-500', 
  'orange-500', 
  'amber-400', 
  'yellow-400',
  'lime-500',
  'green-500', 
  'emerald-600',
  'teal-500', 
  'cyan-500',
  'sky-500',
  'blue-500', 
  'indigo-500', 
  'violet-500', 
  'purple-500', 
  'fuchsia-500', 
  'pink-500', 
  'rose-500'
];

export const formatTime = (index: number): string => {
  const totalMinutes = index * 15;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export const formatHour12 = (hourIndex: number): string => {
  const h = hourIndex;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12} ${ampm}`;
};

export const getTailwindColorValue = (colorName: string) => {
    return `var(--color-${colorName})`;
};

// Map standard Tailwind colors to Hex for dynamic SVG cursors
export const TAILWIND_HEX_MAP: Record<string, string> = {
  'slate-600': '#475569',
  'gray-500': '#6b7280',
  'red-500': '#ef4444',
  'red-400': '#f87171',
  'orange-500': '#f97316',
  'orange-400': '#fb923c',
  'amber-400': '#fbbf24',
  'yellow-400': '#facc15',
  'lime-500': '#84cc16',
  'green-500': '#22c55e',
  'green-400': '#4ade80',
  'emerald-600': '#059669',
  'teal-500': '#14b8a6',
  'cyan-500': '#06b6d4',
  'sky-500': '#0ea5e9',
  'blue-500': '#3b82f6',
  'indigo-500': '#6366f1',
  'violet-500': '#8b5cf6',
  'purple-500': '#a855f7',
  'fuchsia-500': '#d946ef',
  'pink-500': '#ec4899',
  'rose-500': '#f43f5e'
};

export const getColorHex = (tailwindClass: string): string => {
  return TAILWIND_HEX_MAP[tailwindClass] || '#000000';
};

export const themeIds = Object.keys(themes);
export const defaultThemeId = 'warm';
