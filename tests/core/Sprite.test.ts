import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Sprite } from '../../src/core/Sprite';
import { Game } from '../../src/core/Game';
import { Scene } from '../../src/core/Scene';

describe('Sprite', () => {
  let container: HTMLElement;
  let game: Game;
  let scene: Scene;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);
    game = new Game(container, { runOnLoad: false }, () => {});
    scene = game.newScene('test-scene');
    game.pushScene(scene);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('constructor', () => {
    it('should create a sprite with default values', () => {
      const sprite = new Sprite({});

      expect(sprite.enabled).toBe(true);
      expect(sprite.pos).toEqual({ x: 0, y: 0 });
      expect(sprite.hasDirection).toBe(true);
      expect(sprite.direction).toBe(90);
      expect(sprite.front).toBe(90);
      expect(sprite.frameSize).toEqual({ width: 32, height: 32 });
      expect(sprite.frameCount).toBe(1);
      expect(sprite.animating).toBe(false);
      expect(sprite.animateWhileMoving).toBe(true);
      expect(sprite.frame).toBe(0);
      expect(sprite.animInterval).toBe(100);
      expect(sprite.moving).toBe(false);
    });

    it('should create a sprite with custom options', () => {
      const sprite = new Sprite({
        pos: { x: 100, y: 200 },
        frameSize: { width: 64, height: 64 },
        frameCount: 4,
        image: 'sprite.png',
        animInterval: 200
      });

      expect(sprite.pos).toEqual({ x: 100, y: 200 });
      expect(sprite.frameSize).toEqual({ width: 64, height: 64 });
      expect(sprite.frameCount).toBe(4);
      expect(sprite.image).toBe('sprite.png');
      expect(sprite.animInterval).toBe(200);
    });

    it('should use default center if not explicitly provided', () => {
      const sprite = new Sprite({
        frameSize: { width: 64, height: 48 }
      });

      // Center defaults to { x: 0, y: 0 } and isn't recalculated unless explicitly set to null
      expect(sprite.center).toEqual({ x: 0, y: 0 });
    });

    it('should use provided center', () => {
      const sprite = new Sprite({
        frameSize: { width: 64, height: 64 },
        center: { x: 10, y: 20 }
      });

      expect(sprite.center).toEqual({ x: 10, y: 20 });
    });

    it('should calculate center automatically when set to null', () => {
      const sprite = new Sprite({
        frameSize: { width: 40, height: 40 },
        center: null as any
      });

      expect(sprite.center).toEqual({ x: 20, y: 20 });
    });

    it('should calculate center automatically when set to undefined', () => {
      const sprite = new Sprite({
        frameSize: { width: 64, height: 48 },
        center: undefined as any
      });

      expect(sprite.center).toEqual({ x: 32, y: 24 });
    });
  });

  describe('moveTo', () => {
    it('should update sprite position', () => {
      const sprite = scene.addActor(new Sprite({ image: 'test.png' }));

      sprite.moveTo(100, 150);

      expect(sprite.pos.x).toBe(100);
      expect(sprite.pos.y).toBe(150);
    });

    it('should update transform when element exists', () => {
      const sprite = scene.addActor(new Sprite({ image: 'test.png' }));
      sprite.update(0); // Create element

      sprite.moveTo(100, 150);

      const transform = sprite.element!.getAttribute('transform');
      expect(transform).toContain('translate');
    });
  });

  describe('moveToward', () => {
    it('should initiate movement', () => {
      const sprite = scene.addActor(new Sprite({ image: 'test.png', pos: { x: 0, y: 0 } }));

      sprite.moveToward(100, 100, 1000);

      expect(sprite.moving).toBe(true);
      expect(sprite.moveStartPos).toEqual({ x: 0, y: 0 });
      expect(sprite.moveDestPos).toEqual({ x: 100, y: 100 });
      expect(sprite.moveDuration).toBe(1000);
    });

    it('should start animating if animateWhileMoving is true', () => {
      const sprite = scene.addActor(new Sprite({
        image: 'test.png',
        animateWhileMoving: true
      }));

      sprite.moveToward(100, 100, 1000);

      expect(sprite.animating).toBe(true);
    });

    it('should not animate if animateWhileMoving is false', () => {
      const sprite = scene.addActor(new Sprite({
        image: 'test.png',
        animateWhileMoving: false
      }));

      sprite.moveToward(100, 100, 1000);

      expect(sprite.animating).toBe(false);
    });

    it('should use linear easing by default', () => {
      const sprite = scene.addActor(new Sprite({ image: 'test.png' }));

      sprite.moveToward(100, 100, 1000);

      expect(sprite.easing).toBeDefined();
    });

    it('should use specified easing function', () => {
      const sprite = scene.addActor(new Sprite({ image: 'test.png' }));

      sprite.moveToward(100, 100, 1000, undefined, 'easeInQuad');

      expect(sprite.easing).toBeDefined();
    });

    it('should call callback when provided', () => {
      const sprite = scene.addActor(new Sprite({ image: 'test.png', pos: { x: 0, y: 0 } }));
      sprite.update(0); // Create element
      const callback = vi.fn();

      sprite.moveToward(10, 10, 100, callback);
      sprite.moveTime = 150; // Simulate time past duration
      sprite.updatePosition();

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should calculate rotation for vertical movement down', () => {
      const sprite = scene.addActor(new Sprite({
        image: 'test.png',
        pos: { x: 50, y: 50 },
        hasDirection: true,
        front: 90
      }));

      sprite.moveToward(50, 150, 1000);

      expect(sprite.rotate).toBe(180);
    });

    it('should calculate rotation for vertical movement up', () => {
      const sprite = scene.addActor(new Sprite({
        image: 'test.png',
        pos: { x: 50, y: 150 },
        hasDirection: true,
        front: 90
      }));

      sprite.moveToward(50, 50, 1000);

      expect(sprite.rotate).toBe(0);
    });
  });

  describe('finishMoving', () => {
    it('should stop movement', () => {
      const sprite = scene.addActor(new Sprite({ image: 'test.png' }));
      sprite.update(0); // Create element
      sprite.moveToward(100, 100, 1000);

      sprite.finishMoving();

      expect(sprite.moving).toBe(false);
    });

    it('should move to destination position', () => {
      const sprite = scene.addActor(new Sprite({ image: 'test.png', pos: { x: 0, y: 0 } }));
      sprite.update(0); // Create element
      sprite.moveToward(100, 150, 1000);

      sprite.finishMoving();

      expect(sprite.pos).toEqual({ x: 100, y: 150 });
    });

    it('should reset animation if animateWhileMoving', () => {
      const sprite = scene.addActor(new Sprite({
        image: 'test.png',
        animateWhileMoving: true,
        frameCount: 4
      }));
      sprite.update(0); // Create element
      sprite.moveToward(100, 100, 1000);
      sprite.frame = 2;

      sprite.finishMoving();

      expect(sprite.frame).toBe(0);
      expect(sprite.animating).toBe(false);
    });
  });

  describe('advanceFrame', () => {
    it('should advance frame by 1 by default', () => {
      const sprite = new Sprite({ frameCount: 4 });
      sprite.scene = scene;
      sprite.update(0); // Create element

      sprite.advanceFrame();

      expect(sprite.frame).toBe(1);
    });

    it('should advance frame by specified amount', () => {
      const sprite = new Sprite({ frameCount: 4 });
      sprite.scene = scene;
      sprite.update(0); // Create element

      sprite.advanceFrame(2);

      expect(sprite.frame).toBe(2);
    });

    it('should wrap around at frameCount', () => {
      const sprite = new Sprite({ frameCount: 4, frame: 3 });
      sprite.scene = scene;
      sprite.update(0); // Create element

      sprite.advanceFrame();

      expect(sprite.frame).toBe(0);
    });

    it('should call animateCallback when wrapping around', () => {
      const callback = vi.fn();
      const sprite = new Sprite({
        frameCount: 4,
        frame: 3,
        animateCallback: callback
      });
      sprite.scene = scene;
      sprite.update(0); // Create element

      sprite.advanceFrame();

      expect(callback).toHaveBeenCalledTimes(1);
      expect(sprite.animating).toBe(false);
    });

    it('should not call callback if not wrapping around', () => {
      const callback = vi.fn();
      const sprite = new Sprite({
        frameCount: 4,
        frame: 1,
        animateCallback: callback
      });
      sprite.scene = scene;
      sprite.update(0); // Create element

      sprite.advanceFrame();

      expect(callback).not.toHaveBeenCalled();
    });

    it('should update image element x position', () => {
      const sprite = new Sprite({
        frameCount: 4,
        frameSize: { width: 32, height: 32 }
      });
      sprite.scene = scene;
      sprite.update(0); // Create element

      sprite.advanceFrame(2);

      const x = sprite.imageElement!.getAttribute('x');
      expect(x).toBe('-64'); // 2 frames * 32 width * -1
    });
  });

  describe('update', () => {
    it('should create element on first update', () => {
      const sprite = scene.addActor(new Sprite({ image: 'test.png' }));

      expect(sprite.element).toBeNull();

      sprite.update(0);

      expect(sprite.element).toBeTruthy();
      expect(sprite.element!.tagName).toBe('image');
    });

    it('should not create element if disabled', () => {
      const sprite = scene.addActor(new Sprite({
        image: 'test.png',
        enabled: false
      }));

      sprite.update(0);

      expect(sprite.element).toBeNull();
    });

    it('should add CSS class if provided', () => {
      const sprite = scene.addActor(new Sprite({
        image: 'test.png',
        className: 'my-sprite'
      }));

      sprite.update(0);

      expect(sprite.element!.classList.contains('my-sprite')).toBe(true);
    });

    it('should update position during movement', () => {
      const sprite = scene.addActor(new Sprite({
        image: 'test.png',
        pos: { x: 0, y: 0 }
      }));
      sprite.update(0); // Create element
      sprite.moveToward(100, 100, 1000);

      const initialX = sprite.pos.x;
      sprite.update(100);

      expect(sprite.pos.x).toBeGreaterThan(initialX);
    });

    it('should advance frame during animation', () => {
      const sprite = scene.addActor(new Sprite({
        image: 'test.png',
        frameCount: 4,
        animInterval: 100,
        animating: true
      }));
      sprite.update(0); // Create element

      expect(sprite.frame).toBe(0);

      // Need to pass > animInterval (not >=) to trigger frame advance
      sprite.update(101);

      expect(sprite.frame).toBe(1);
    });

    it('should handle multiple frames in single update', () => {
      const sprite = scene.addActor(new Sprite({
        image: 'test.png',
        frameCount: 4,
        animInterval: 100,
        animating: true
      }));
      sprite.update(0); // Create element

      sprite.update(250); // Should advance 2 frames

      expect(sprite.frame).toBe(2);
    });
  });

  describe('remove', () => {
    it('should disable the sprite', () => {
      const sprite = scene.addActor(new Sprite({ image: 'test.png' }));

      sprite.remove();

      expect(sprite.enabled).toBe(false);
    });

    it('should remove sprite from scene actors', () => {
      const sprite = scene.addActor(new Sprite({ image: 'test.png' }));

      expect(scene.actors).toContain(sprite);

      sprite.remove();

      expect(scene.actors).not.toContain(sprite);
    });

    it('should remove element from DOM', () => {
      const sprite = scene.addActor(new Sprite({ image: 'test.png' }));
      sprite.update(0); // Create element

      const svg = game.svg.root();
      expect(svg.contains(sprite.element!)).toBe(true);

      sprite.remove();

      expect(svg.contains(sprite.element!)).toBe(false);
    });

    it('should handle removal when element does not exist', () => {
      const sprite = scene.addActor(new Sprite({ image: 'test.png' }));

      expect(() => sprite.remove()).not.toThrow();
    });
  });

  describe('updateTransform', () => {
    it('should set transform attribute with position', () => {
      const sprite = scene.addActor(new Sprite({
        image: 'test.png',
        pos: { x: 100, y: 150 },
        frameSize: { width: 32, height: 32 }
        // center defaults to { x: 0, y: 0 }
      }));
      sprite.update(0); // Create element

      const transform = sprite.element!.getAttribute('transform');
      // With center at { x: 0, y: 0 }, transform is pos - center = 100-0, 150-0
      expect(transform).toContain('translate(100, 150)');
    });

    it('should include rotation if rotate is set', () => {
      const sprite = scene.addActor(new Sprite({
        image: 'test.png',
        pos: { x: 100, y: 150 },
        frameSize: { width: 32, height: 32 },
        rotate: 45
      }));
      sprite.update(0); // Create element

      const transform = sprite.element!.getAttribute('transform');
      expect(transform).toContain('rotate(45');
    });

    it('should not include rotation if rotate is undefined', () => {
      const sprite = scene.addActor(new Sprite({
        image: 'test.png',
        pos: { x: 100, y: 150 }
      }));
      sprite.update(0); // Create element

      const transform = sprite.element!.getAttribute('transform');
      expect(transform).not.toContain('rotate');
    });

    it('should not error if element does not exist', () => {
      const sprite = new Sprite({ image: 'test.png' });

      expect(() => sprite.updateTransform()).not.toThrow();
    });
  });

  describe('direction system', () => {
    it('should have direction lookup table', () => {
      const sprite = new Sprite({});

      expect(sprite.directions['true']['true']).toBe(0);
      expect(sprite.directions['true']['false']).toBe(360);
      expect(sprite.directions['false']['true']).toBe(180);
      expect(sprite.directions['false']['false']).toBe(180);
    });
  });

  describe('integration tests', () => {
    it('should complete full movement cycle', () => {
      const sprite = scene.addActor(new Sprite({
        image: 'test.png',
        pos: { x: 0, y: 0 }
      }));
      sprite.update(0); // Create element

      sprite.moveToward(100, 100, 100);

      // Simulate time passing
      sprite.update(50);
      expect(sprite.moving).toBe(true);

      sprite.update(60); // Total 110ms, past duration
      expect(sprite.moving).toBe(false);
      expect(sprite.pos).toEqual({ x: 100, y: 100 });
    });

    it('should animate while moving', () => {
      const sprite = scene.addActor(new Sprite({
        image: 'test.png',
        frameCount: 4,
        animInterval: 50,
        animateWhileMoving: true
      }));
      sprite.update(0); // Create element

      sprite.moveToward(100, 100, 200);

      // Need > animInterval to advance frame
      sprite.update(51);
      expect(sprite.frame).toBe(1);
      expect(sprite.moving).toBe(true);

      sprite.update(51);
      expect(sprite.frame).toBe(2);

      sprite.update(150); // Finish movement
      expect(sprite.moving).toBe(false);
      expect(sprite.frame).toBe(0); // Reset on finish
    });
  });
});
