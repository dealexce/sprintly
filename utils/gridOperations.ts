function positiveMod(n: number, mod: number): number {
    return ((n % mod) + mod) % mod;
}

export function getOffset<T>(grid: T[][], x0: number, x1: number, offset: number): T | null {
    const d0 = grid.length;
    const d1 = grid[0]?.length || 0;
    if (d0 === 0 || d1 === 0) return null;
    const newX1 = positiveMod(x1 + offset, d1);
    const carry = Math.floor((x1 + offset) / d1);
    const newX0 = x0 + carry;
    if (newX0 < 0 || newX1 < 0 || newX0 >= d0 || newX1 >= d1) return null;
    return grid[newX0][newX1];
} 
