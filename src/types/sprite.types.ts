import type { Position, Size } from './game.types';

export type EasingFunction = (x: number, t: number, b: number, c: number, d: number) => number;

export interface SpriteOptions {
  className?: string | null;
  enabled?: boolean;
  pos?: Position;
  hasDirection?: boolean;
  direction?: number;
  front?: number;
  frameSize?: Size;
  center?: Position | false;
  background?: string;
  frameCount?: number;
  animating?: boolean;
  animateWhileMoving?: boolean;
  animateCallback?: (() => void) | false;
  frame?: number;
  image?: string;
  animInterval?: number;
  onclick?: (ev: Event) => void;
  rotate?: number;
}
