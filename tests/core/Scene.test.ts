import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Scene } from '../../src/core/Scene';
import { Game } from '../../src/core/Game';

describe('Scene', () => {
  let container: HTMLElement;
  let game: Game;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);
    game = new Game(container, { runOnLoad: false }, () => {});
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('constructor', () => {
    it('should create a scene with default values', () => {
      const scene = new Scene('test-scene');

      expect(scene.id).toBe('test-scene');
      expect(scene.paused).toBe(false);
      expect(scene.layers).toEqual({});
      expect(scene.layer).toBeNull();
      expect(scene.onDestroy).toBeNull();
      expect(scene.elapsed).toBe(0);
      expect(scene.actors).toEqual([]);
      expect(scene.scheduledTasks).toEqual([]);
    });

    it('should create a scene with custom options', () => {
      const initFn = vi.fn();
      const updateFn = vi.fn();
      const destroyFn = vi.fn();

      const scene = new Scene('test-scene', {
        init: initFn,
        onUpdate: updateFn,
        onDestroy: destroyFn
      });

      expect(scene.id).toBe('test-scene');
      expect(scene.init).toBe(initFn);
      expect(scene.onUpdate).toBe(updateFn);
      expect(scene.onDestroy).toBe(destroyFn);
    });

    it('should allow setting paused state in options', () => {
      const scene = new Scene('test-scene', { paused: true });
      expect(scene.paused).toBe(true);
    });
  });

  describe('pause and resume', () => {
    it('should pause the scene', () => {
      const scene = new Scene('test-scene');
      expect(scene.isPaused()).toBe(false);

      scene.pause();
      expect(scene.isPaused()).toBe(true);
      expect(scene.paused).toBe(true);
    });

    it('should resume the scene', () => {
      const scene = new Scene('test-scene', { paused: true });
      expect(scene.isPaused()).toBe(true);

      scene.resume();
      expect(scene.isPaused()).toBe(false);
      expect(scene.paused).toBe(false);
    });

    it('should toggle between paused and resumed states', () => {
      const scene = new Scene('test-scene');

      scene.pause();
      expect(scene.isPaused()).toBe(true);

      scene.resume();
      expect(scene.isPaused()).toBe(false);

      scene.pause();
      expect(scene.isPaused()).toBe(true);
    });
  });

  describe('tick', () => {
    it('should increment elapsed time', () => {
      const scene = new Scene('test-scene');
      expect(scene.elapsed).toBe(0);

      scene.tick(16);
      expect(scene.elapsed).toBe(16);

      scene.tick(16);
      expect(scene.elapsed).toBe(32);
    });

    it('should call update function if provided', () => {
      const updateFn = vi.fn();
      const scene = new Scene('test-scene', { onUpdate: updateFn });

      scene.tick(16);
      expect(updateFn).toHaveBeenCalledTimes(1);
      expect(updateFn).toHaveBeenCalledWith(16);

      scene.tick(20);
      expect(updateFn).toHaveBeenCalledTimes(2);
      expect(updateFn).toHaveBeenCalledWith(20);
    });

    it('should update all actors', () => {
      const scene = new Scene('test-scene');
      scene.game = game;

      const actor1 = { update: vi.fn(), scene, layer: game.svg.root() };
      const actor2 = { update: vi.fn(), scene, layer: game.svg.root() };

      scene.actors.push(actor1 as any);
      scene.actors.push(actor2 as any);

      scene.tick(16);

      expect(actor1.update).toHaveBeenCalledTimes(1);
      expect(actor1.update).toHaveBeenCalledWith(16);
      expect(actor2.update).toHaveBeenCalledTimes(1);
      expect(actor2.update).toHaveBeenCalledWith(16);
    });

    it('should call both actor updates and scene update', () => {
      const sceneUpdate = vi.fn();
      const scene = new Scene('test-scene', { onUpdate: sceneUpdate });
      scene.game = game;

      const actor = { update: vi.fn(), scene, layer: game.svg.root() };
      scene.actors.push(actor as any);

      scene.tick(16);

      expect(actor.update).toHaveBeenCalledWith(16);
      expect(sceneUpdate).toHaveBeenCalledWith(16);
    });
  });

  describe('addActor', () => {
    it('should add actor to actors array', () => {
      const scene = game.newScene('test-scene');
      const actor = { scene: null, layer: null } as any;

      scene.addActor(actor);

      expect(scene.actors).toContain(actor);
      expect(scene.actors.length).toBe(1);
    });

    it('should set actor scene reference', () => {
      const scene = game.newScene('test-scene');
      const actor = { scene: null, layer: null } as any;

      scene.addActor(actor);

      expect(actor.scene).toBe(scene);
    });

    it('should set actor layer to root SVG if no layer specified', () => {
      const scene = game.newScene('test-scene');
      const actor = { scene: null, layer: null } as any;

      scene.addActor(actor);

      expect(actor.layer).toBe(game.svg.root());
    });

    it('should set actor layer to specified layer if it exists', () => {
      const scene = game.newScene('test-scene');
      const layerGroup = scene.addLayer('background');
      const actor = { scene: null, layer: null } as any;

      scene.addActor(actor, 'background');

      expect(actor.layer).toBe(layerGroup);
    });

    it('should use root SVG if specified layer does not exist', () => {
      const scene = game.newScene('test-scene');
      const actor = { scene: null, layer: null } as any;

      scene.addActor(actor, 'nonexistent');

      expect(actor.layer).toBe(game.svg.root());
    });

    it('should return the actor', () => {
      const scene = game.newScene('test-scene');
      const actor = { scene: null, layer: null } as any;

      const result = scene.addActor(actor);

      expect(result).toBe(actor);
    });

    it('should handle null actor gracefully', () => {
      const scene = game.newScene('test-scene');
      const result = scene.addActor(null as any);
      expect(result).toBeNull();
    });
  });

  describe('addLayer', () => {
    it('should create a new layer', () => {
      const scene = game.newScene('test-scene');
      const layer = scene.addLayer('background');

      expect(layer).toBeTruthy();
      expect(layer.tagName).toBe('g');
    });

    it('should store layer in layers object', () => {
      const scene = game.newScene('test-scene');
      const layer = scene.addLayer('background');

      expect(scene.layers['background']).toBe(layer);
    });

    it('should create layer with correct id', () => {
      const scene = game.newScene('test-scene');
      const layer = scene.addLayer('background');

      expect(layer.getAttribute('id')).toBe('scene-test-scene-background');
    });

    it('should create multiple layers', () => {
      const scene = game.newScene('test-scene');
      const bg = scene.addLayer('background');
      const fg = scene.addLayer('foreground');

      expect(scene.layers['background']).toBe(bg);
      expect(scene.layers['foreground']).toBe(fg);
      expect(bg).not.toBe(fg);
    });

    it('should return the created layer element', () => {
      const scene = game.newScene('test-scene');
      const layer = scene.addLayer('test-layer');

      expect(layer).toBe(scene.layers['test-layer']);
    });
  });

  describe('addScheduledTask', () => {
    it('should execute scheduled task at intervals', () => {
      vi.useFakeTimers();
      const scene = new Scene('test-scene');
      const taskFn = vi.fn();

      scene.addScheduledTask(taskFn, 100);

      expect(taskFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(taskFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      expect(taskFn).toHaveBeenCalledTimes(2);

      vi.useRealTimers();
    });

    it('should not execute task when scene is paused', () => {
      vi.useFakeTimers();
      const scene = new Scene('test-scene');
      const taskFn = vi.fn();

      scene.addScheduledTask(taskFn, 100);
      scene.pause();

      vi.advanceTimersByTime(300);
      expect(taskFn).not.toHaveBeenCalled();

      vi.useRealTimers();
    });

    it('should resume executing task when scene is resumed', () => {
      vi.useFakeTimers();
      const scene = new Scene('test-scene');
      const taskFn = vi.fn();

      scene.addScheduledTask(taskFn, 100);

      vi.advanceTimersByTime(100);
      expect(taskFn).toHaveBeenCalledTimes(1);

      scene.pause();
      vi.advanceTimersByTime(200);
      expect(taskFn).toHaveBeenCalledTimes(1);

      scene.resume();
      vi.advanceTimersByTime(100);
      expect(taskFn).toHaveBeenCalledTimes(2);

      vi.useRealTimers();
    });

    it('should track scheduled tasks', () => {
      const scene = new Scene('test-scene');

      expect(scene.scheduledTasks.length).toBe(0);

      scene.addScheduledTask(() => {}, 100);
      expect(scene.scheduledTasks.length).toBe(1);

      scene.addScheduledTask(() => {}, 200);
      expect(scene.scheduledTasks.length).toBe(2);
    });
  });

  describe('destroy', () => {
    it('should clear all scheduled tasks', () => {
      vi.useFakeTimers();
      const scene = new Scene('test-scene');
      const taskFn = vi.fn();

      scene.addScheduledTask(taskFn, 100);
      scene.destroy();

      vi.advanceTimersByTime(300);
      expect(taskFn).not.toHaveBeenCalled();

      vi.useRealTimers();
    });

    it('should call onDestroy callback if provided', () => {
      const destroyFn = vi.fn();
      const scene = new Scene('test-scene', { onDestroy: destroyFn });

      scene.destroy();

      expect(destroyFn).toHaveBeenCalledTimes(1);
    });

    it('should not error if onDestroy is not provided', () => {
      const scene = new Scene('test-scene');

      expect(() => scene.destroy()).not.toThrow();
    });

    it('should clear multiple scheduled tasks', () => {
      vi.useFakeTimers();
      const scene = new Scene('test-scene');
      const task1 = vi.fn();
      const task2 = vi.fn();

      scene.addScheduledTask(task1, 100);
      scene.addScheduledTask(task2, 150);

      scene.destroy();

      vi.advanceTimersByTime(500);
      expect(task1).not.toHaveBeenCalled();
      expect(task2).not.toHaveBeenCalled();

      vi.useRealTimers();
    });
  });

  describe('integration with Game', () => {
    it('should work with Game scene management', () => {
      const scene = game.newScene('test-scene');

      expect(scene.game).toBe(game);
      expect(scene.id).toBe('test-scene');
    });

    it('should allow adding layers when attached to game', () => {
      const scene = game.newScene('test-scene');
      const layer = scene.addLayer('test-layer');

      expect(layer.tagName).toBe('g');
      expect(scene.layers['test-layer']).toBe(layer);
    });
  });
});
