import type { SceneOptions } from '../types/scene.types';
import type { Game } from './Game';
import type { Sprite } from './Sprite';

export class Scene {
  id: string;
  paused: boolean;
  layers: Record<string, SVGGElement>;
  layer: SVGGElement | null;
  onDestroy: (() => void) | null;
  elapsed: number;
  actors: Sprite[];
  scheduledTasks: ReturnType<typeof setInterval>[];
  game?: Game;

  init?: () => void;
  update?: (delta: number) => void;

  constructor(id: string, options?: SceneOptions) {
    this.id = id;
    this.paused = false;
    this.layers = {};
    this.layer = null;
    this.onDestroy = null;
    this.elapsed = 0;
    this.actors = [];
    this.scheduledTasks = [];

    if (options) {
      Object.assign(this, options);
    }
  }

  tick(delta: number): void {
    this.elapsed += delta;
    for (let i = 0; i < this.actors.length; i++) {
      this.actors[i].update(delta);
    }
    if (this.update) {
      this.update(delta);
    }
  }

  pause(): void {
    this.paused = true;
  }

  resume(): void {
    this.paused = false;
  }

  isPaused(): boolean {
    return this.paused;
  }

  addActor(actor: Sprite, layer?: string): Sprite {
    if (!actor) return actor;
    actor.scene = this;
    actor.layer = layer && this.layers[layer] ? this.layers[layer] : this.game!.svg.root();
    this.actors.push(actor);
    return actor;
  }

  addLayer(layer: string): SVGGElement {
    const layerId = "scene-" + this.id + "-" + layer;
    this.layers[layer] = this.game!.svg.group(
      this.layer || this.game!.svg,
      layerId
    );
    return this.layers[layer];
  }

  addScheduledTask(fn: () => void, delay: number): void {
    const self = this;
    const task = setInterval(function() {
      if (!self.paused) fn();
    }, delay);
    this.scheduledTasks.push(task);
  }

  destroy(): void {
    for (let i = 0; i < this.scheduledTasks.length; i++) {
      clearInterval(this.scheduledTasks[i]);
    }
    if (this.onDestroy) {
      this.onDestroy();
    }
  }
}
