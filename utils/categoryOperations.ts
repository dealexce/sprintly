import { Category } from '../types';

export function createNewCategory(): Category {
  return {
    id: `cat-${Date.now()}`,
    name: 'New Task',
    color: 'gray-500',
  };
}

export function updateCategoryName(
  categories: Category[],
  id: string,
  name: string
): Category[] {
  return categories.map((c) => (c.id === id ? { ...c, name } : c));
}

export function updateCategoryColor(
  categories: Category[],
  id: string,
  color: string
): Category[] {
  return categories.map((c) => (c.id === id ? { ...c, color } : c));
}

export function deleteCategory(
  categories: Category[],
  id: string
): Category[] {
  return categories.filter((c) => c.id !== id);
}
