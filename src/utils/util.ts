import type { Position } from '../types/game.types';

export function distance(pos1: Position, pos2: Position): number {
  return Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2));
}

export function pad(s: string, n: number, c: string): string {
  const padLen = n - s.length;
  if (padLen > 0) {
    for (let i = 0; i < padLen; i++) {
      s = c + s;
    }
  }
  return s;
}

export function safe_remove(element: Element | null): void {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
}
