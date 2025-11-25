import { Category, Tool } from '../types';
import { getColorHex } from '../constants';

export function getCursorStyle(tool: Tool, categories: Category[]): string {
  if (tool.type === 'eraser') {
    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ec4899' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>
        <path d='m2.9 20.4 2-12.8c.2-1.1.7-2 1.5-2.8 1.4-1.3 3.5-1.3 4.9 0l3.4 3c1.4 1.3 1.4 3.5 0 4.9l-10 10.4c-1 .9-2.5.6-3.1-.3l-1.9-1.9c-.3-.4-.5-.9-.4-1.5'/>
        <path d='m12.3 8.8 2.6 2.5'/>
        <path d='M7.7 13.6 5.1 11'/>
      </svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 0 24, auto`;
  } else if (tool.type === 'marker' && tool.categoryId) {
    const category = categories.find((c) => c.id === tool.categoryId);
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
}
