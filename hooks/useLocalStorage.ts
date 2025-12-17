import { useState, useEffect } from 'react';

const DATA_VERSION = 1;

interface VersionedData<T> {
  version: number;
  data: T;
}

export const STORAGE_KEYS = {
  CATEGORIES: 'daySprintCategories',
  TODOS: 'daySprintTodos',
  GRID: 'daySprintGrid',
};

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return initialValue;
      
      const parsed: VersionedData<T> = JSON.parse(stored);
      
      // Version check - if version doesn't match or is missing, use initial value
      if (!parsed.version || parsed.version !== DATA_VERSION) {
        console.warn(`Data version mismatch for key "${key}". Using initial value.`);
        return initialValue;
      }
      
      return parsed.data;
    } catch (error) {
      console.warn(`Failed to parse localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Save to localStorage whenever value changes
  useEffect(() => {
    try {
      const versionedData: VersionedData<T> = {
        version: DATA_VERSION,
        data: value,
      };
      localStorage.setItem(key, JSON.stringify(versionedData));
    } catch (error) {
      console.warn(`Failed to save to localStorage key "${key}":`, error);
    }
  }, [key, value]);

  // Listen for changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          const parsed: VersionedData<T> = JSON.parse(e.newValue);
          
          if (parsed.version === DATA_VERSION) {
            setValue(parsed.data);
          }
        } catch (error) {
          console.warn(`Failed to sync localStorage key "${key}" from another tab:`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [value, setValue] as const;
}
