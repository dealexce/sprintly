export interface Theme {
  id: string;
  name: string;
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
  shadows: {
    paper: string;
    sticky: string;
    marker: string;
  };
  patterns: {
    grid: string;
  };
}

export const themes: Record<string, Theme> = {
  warm: {
    id: 'warm',
    name: 'Warm Paper',
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
    shadows: {
      paper: '1px 1px 0 #e5e5e5, 2px 2px 0 #e5e5e5, 3px 3px 0 #e5e5e5, 4px 4px 0 #e5e5e5, 5px 5px 0 #e5e5e5, 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
      sticky: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
      marker: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
    },
    patterns: {
      grid: 'linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)',
    },
  },
  
  dark: {
    id: 'dark',
    name: 'Dark Mode',
    colors: {
      background: '#0f172a',
      surface: '#1e293b',
      surfaceSecondary: '#334155',
      paperBg: '#1e293b',
      
      textPrimary: '#f1f5f9',
      textSecondary: '#cbd5e1',
      textTertiary: '#64748b',
      
      border: '#475569',
      borderLight: '#334155',
      borderDark: '#1e293b',
      
      gridBg: '#1e293b',
      gridBorder: '#334155',
      gridHover: 'rgba(255, 255, 255, 0.05)',
      headerBg: '#0f172a',
      
      accent: '#60a5fa',
      accentLight: '#93c5fd',
      
      stickyBg: '#fbbf24',
      stickyText: '#1e293b',
      stickyBorder: '#92400e',
      stickyTape: 'rgba(255, 255, 255, 0.2)',
      
      tagBg: '#fef3c7',
      tagText: '#1e293b',
      tagBorder: '#92400e',
      
      markerPanelBg: '#0f172a',
      markerPanelBgInner: 'rgba(0, 0, 0, 0.4)',
      markerPanelText: '#94a3b8',
      markerPanelBorder: '#1e293b',
      markerBodyBg: '#1e293b',
      markerBodyBgHover: '#334155',
      
      timeHeaderBg: 'rgba(30, 41, 59, 0.9)',
      timeLabelBg: 'rgba(51, 65, 85, 0.5)',
      timeLabelText: '#64748b',
    },
    shadows: {
      paper: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
      sticky: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
      marker: '0 4px 6px -1px rgba(0, 0, 0, 0.7)',
    },
    patterns: {
      grid: 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
    },
  },
  
  ocean: {
    id: 'ocean',
    name: 'Ocean Blue',
    colors: {
      background: '#1e3a5f',
      surface: '#dbeafe',
      surfaceSecondary: '#bfdbfe',
      paperBg: '#dbeafe',
      
      textPrimary: '#1e3a8a',
      textSecondary: '#1e40af',
      textTertiary: '#3b82f6',
      
      border: '#93c5fd',
      borderLight: '#bfdbfe',
      borderDark: '#60a5fa',
      
      gridBg: '#dbeafe',
      gridBorder: '#bfdbfe',
      gridHover: 'rgba(59, 130, 246, 0.05)',
      headerBg: '#eff6ff',
      
      accent: '#0ea5e9',
      accentLight: '#7dd3fc',
      
      stickyBg: '#fef3c7',
      stickyText: '#1e3a8a',
      stickyBorder: '#1e40af',
      stickyTape: 'rgba(255, 255, 255, 0.4)',
      
      tagBg: '#fef3c7',
      tagText: '#1e3a8a',
      tagBorder: '#1e40af',
      
      markerPanelBg: '#1e3a8a',
      markerPanelBgInner: 'rgba(30, 58, 138, 0.5)',
      markerPanelText: '#93c5fd',
      markerPanelBorder: '#1e40af',
      markerBodyBg: '#1e40af',
      markerBodyBgHover: '#2563eb',
      
      timeHeaderBg: 'rgba(239, 246, 255, 0.8)',
      timeLabelBg: 'rgba(219, 234, 254, 0.5)',
      timeLabelText: '#3b82f6',
    },
    shadows: {
      paper: '1px 1px 0 #bfdbfe, 2px 2px 0 #bfdbfe, 3px 3px 0 #bfdbfe, 4px 4px 0 #bfdbfe, 5px 5px 0 #bfdbfe, 0 20px 25px -5px rgba(30, 58, 143, 0.3), 0 10px 10px -5px rgba(30, 58, 143, 0.2)',
      sticky: 'inset 0 2px 4px rgba(30, 58, 143, 0.1)',
      marker: '0 4px 6px -1px rgba(30, 58, 143, 0.5)',
    },
    patterns: {
      grid: 'linear-gradient(to right, rgba(59, 130, 246, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.08) 1px, transparent 1px)',
    },
  },
  
  forest: {
    id: 'forest',
    name: 'Forest Green',
    colors: {
      background: '#1a2e1a',
      surface: '#dcfce7',
      surfaceSecondary: '#bbf7d0',
      paperBg: '#dcfce7',
      
      textPrimary: '#14532d',
      textSecondary: '#166534',
      textTertiary: '#15803d',
      
      border: '#86efac',
      borderLight: '#bbf7d0',
      borderDark: '#4ade80',
      
      gridBg: '#dcfce7',
      gridBorder: '#bbf7d0',
      gridHover: 'rgba(34, 197, 94, 0.05)',
      headerBg: '#f0fdf4',
      
      accent: '#10b981',
      accentLight: '#6ee7b7',
      
      stickyBg: '#fef3c7',
      stickyText: '#14532d',
      stickyBorder: '#166534',
      stickyTape: 'rgba(255, 255, 255, 0.4)',
      
      tagBg: '#fef3c7',
      tagText: '#14532d',
      tagBorder: '#166534',
      
      markerPanelBg: '#14532d',
      markerPanelBgInner: 'rgba(20, 83, 45, 0.5)',
      markerPanelText: '#86efac',
      markerPanelBorder: '#166534',
      markerBodyBg: '#166534',
      markerBodyBgHover: '#15803d',
      
      timeHeaderBg: 'rgba(240, 253, 244, 0.8)',
      timeLabelBg: 'rgba(220, 252, 231, 0.5)',
      timeLabelText: '#15803d',
    },
    shadows: {
      paper: '1px 1px 0 #bbf7d0, 2px 2px 0 #bbf7d0, 3px 3px 0 #bbf7d0, 4px 4px 0 #bbf7d0, 5px 5px 0 #bbf7d0, 0 20px 25px -5px rgba(20, 83, 45, 0.3), 0 10px 10px -5px rgba(20, 83, 45, 0.2)',
      sticky: 'inset 0 2px 4px rgba(20, 83, 45, 0.1)',
      marker: '0 4px 6px -1px rgba(20, 83, 45, 0.5)',
    },
    patterns: {
      grid: 'linear-gradient(to right, rgba(34, 197, 94, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(34, 197, 94, 0.08) 1px, transparent 1px)',
    },
  },
};

export const themeIds = Object.keys(themes);
export const defaultThemeId = 'warm';
