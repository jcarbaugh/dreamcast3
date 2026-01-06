// Initialize global utilities
import { initializeGlobals } from './globals';
initializeGlobals();

// Export core classes
export { Game } from './core/Game';
export { Scene } from './core/Scene';
export { Sprite } from './core/Sprite';

// Export utilities
export * as util from './utils/util';
export * as svg from './utils/svg';
export * as easing from './utils/easing';

// Export types
export type {
  Position,
  Size,
  GameOptions,
  AudioCache,
  SVGWrapper
} from './types/game.types';

export type {
  SceneOptions
} from './types/scene.types';

export type {
  SpriteOptions,
  EasingFunction
} from './types/sprite.types';
