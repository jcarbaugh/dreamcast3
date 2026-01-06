import { describe, it, expect, beforeEach } from 'vitest';
import { Game } from '../../src/core/Game';

describe('Game', () => {
  let container: HTMLElement;

  beforeEach(() => {
    // Create a container for each test
    container = document.createElement('div');
    container.id = 'game-container';
    document.body.appendChild(container);
  });

  afterEach(() => {
    // Clean up - stop any running game intervals
    if (container) {
      // Find all games and clear their intervals
      const games = (container as any).__games || [];
      games.forEach((game: any) => {
        if (game.interval) {
          clearInterval(game.interval);
        }
      });
    }
    document.body.removeChild(container);
  });

  describe('constructor', () => {
    it('should create a game with default options', () => {
      const game = new Game('#game-container', { runOnLoad: false }, () => {});

      expect(game.width).toBe(640);
      expect(game.height).toBe(480);
      expect(game.frameRate).toBe(30);
      expect(game.audioEnabled).toBe(true);
    });

    it('should create a game with custom options', () => {
      const game = new Game('#game-container', {
        width: 800,
        height: 600,
        frameRate: 60,
        audioEnabled: false
      }, () => {});

      expect(game.width).toBe(800);
      expect(game.height).toBe(600);
      expect(game.frameRate).toBe(60);
      expect(game.audioEnabled).toBe(false);
    });

    it('should create SVG element', () => {
      const game = new Game('#game-container', {}, () => {});
      const svg = container.querySelector('svg');

      expect(svg).toBeTruthy();
      expect(svg?.getAttribute('width')).toBe('640');
      expect(svg?.getAttribute('height')).toBe('480');
    });

    it('should execute callback', () => {
      let callbackExecuted = false;
      let callbackGame: Game | null = null;

      const game = new Game('#game-container', {}, (g) => {
        callbackExecuted = true;
        callbackGame = g;
      });

      expect(callbackExecuted).toBe(true);
      expect(callbackGame).toBe(game);
    });

    it('should accept HTMLElement directly', () => {
      const game = new Game(container, { runOnLoad: false }, () => {});
      expect(game.elem).toBe(container);
    });

    it('should set container dimensions', () => {
      const game = new Game(container, { width: 500, height: 400 }, () => {});

      expect(container.style.width).toBe('500px');
      expect(container.style.height).toBe('400px');
    });
  });

  describe('scene management', () => {
    it('should create a new scene', () => {
      const game = new Game(container, { runOnLoad: false }, () => {});
      const scene = game.newScene('test-scene');

      expect(scene).toBeTruthy();
      expect(scene.id).toBe('test-scene');
      expect(scene.game).toBe(game);
    });

    it('should push scene onto stack', () => {
      const game = new Game(container, { runOnLoad: false }, () => {});
      const scene = game.newScene('test-scene');

      game.pushScene(scene);

      expect(game.getCurrentScene()).toBe(scene);
      expect(game.scenes.length).toBe(1);
    });

    it('should get current scene', () => {
      const game = new Game(container, { runOnLoad: false }, () => {});
      const scene1 = game.newScene('scene1');
      const scene2 = game.newScene('scene2');

      game.pushScene(scene1);
      expect(game.getCurrentScene()).toBe(scene1);

      game.pushScene(scene2);
      expect(game.getCurrentScene()).toBe(scene2);
    });

    it('should pop scene from stack', () => {
      const game = new Game(container, { runOnLoad: false }, () => {});
      const scene1 = game.newScene('scene1');
      const scene2 = game.newScene('scene2');

      game.pushScene(scene1);
      game.pushScene(scene2);

      game.popScene();

      expect(game.getCurrentScene()).toBe(scene1);
      expect(game.scenes.length).toBe(1);
    });

    it('should return undefined when no scenes', () => {
      const game = new Game(container, { runOnLoad: false }, () => {});
      expect(game.getCurrentScene()).toBeUndefined();
    });

    it('should call scene init when pushed', () => {
      const game = new Game(container, { runOnLoad: false }, () => {});
      let initCalled = false;

      const scene = game.newScene('test', {
        init() {
          initCalled = true;
        }
      });

      game.pushScene(scene);
      expect(initCalled).toBe(true);
    });

    it('should pause previous scene when new scene pushed', () => {
      const game = new Game(container, { runOnLoad: false }, () => {});
      const scene1 = game.newScene('scene1');
      const scene2 = game.newScene('scene2');

      game.pushScene(scene1);
      expect(scene1.isPaused()).toBe(false);

      game.pushScene(scene2);
      expect(scene1.isPaused()).toBe(true);
      expect(scene2.isPaused()).toBe(false);
    });
  });

  describe('background', () => {
    it('should set background color', () => {
      const game = new Game(container, { runOnLoad: false }, () => {});
      game.setBackgroundColor('#ff0000');

      const bg = container.querySelector('#game-background');
      expect(bg).toBeTruthy();
    });

    it('should set background image', () => {
      const game = new Game(container, { runOnLoad: false }, () => {});
      game.setBackgroundImage(0, 0, 640, 480, 'bg.png');

      const bg = container.querySelector('#game-background');
      expect(bg).toBeTruthy();
    });
  });

  describe('mask management', () => {
    it('should create and cache masks', () => {
      const game = new Game(container, { runOnLoad: false }, () => {});

      const mask1 = game.getMask(32, 32);
      const mask2 = game.getMask(32, 32);

      expect(mask1).toBe(mask2); // Should return cached mask
      expect(mask1).toBe('32_32');
    });

    it('should create different masks for different sizes', () => {
      const game = new Game(container, { runOnLoad: false }, () => {});

      const mask1 = game.getMask(32, 32);
      const mask2 = game.getMask(64, 64);

      expect(mask1).not.toBe(mask2);
      expect(mask1).toBe('32_32');
      expect(mask2).toBe('64_64');
    });
  });

  describe('elapsed time', () => {
    it('should track elapsed time', () => {
      const game = new Game(container, { runOnLoad: false }, () => {});

      const initial = game.getElapsedTime();
      expect(initial).toBe(0);
    });
  });

  describe('UUID generation', () => {
    it('should generate incrementing UUIDs', () => {
      const game = new Game(container, { runOnLoad: false }, () => {});

      const uuid1 = game.getUUID();
      const uuid2 = game.getUUID();

      expect(uuid2).toBe(uuid1 + 1);
    });
  });

  describe('audio', () => {
    it('should preload sounds when enabled', () => {
      const game = new Game(container, { audioEnabled: true, runOnLoad: false }, () => {});

      game.preloadSounds({
        test: 'test-sound'
      });

      expect(game.audioCache['test']).toBeTruthy();
    });

    it('should return mock audio when disabled', () => {
      const game = new Game(container, { audioEnabled: false, runOnLoad: false }, () => {});

      const audio = game.playSound('test');

      expect(audio.ended).toBe(true);
      expect(typeof audio.pause).toBe('function');
    });
  });

  describe('interval rate calculation', () => {
    it('should calculate interval rate from frame rate', () => {
      const game = new Game(container, { frameRate: 30, runOnLoad: false }, () => {});
      expect(game.intervalRate).toBeCloseTo(1000 / 30);
    });

    it('should set interval rate to 0 for unlimited FPS', () => {
      const game = new Game(container, { frameRate: 0, runOnLoad: false }, () => {});
      expect(game.intervalRate).toBe(0);
    });
  });
});
