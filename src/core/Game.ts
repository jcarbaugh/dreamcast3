import type { GameOptions, AudioCache, SVGWrapper } from '../types/game.types';
import type { SceneOptions } from '../types/scene.types';
import { Scene } from './Scene';
import * as svg from '../utils/svg';
import * as util from '../utils/util';

export class Game {
  runOnLoad: boolean;
  width: number;
  height: number;
  frameRate: number;
  intervalRate: number;
  uuid: number;
  masks: Record<string, SVGClipPathElement>;
  preload: string[] | null;
  audioEnabled: boolean;
  elem: HTMLElement;
  svg: SVGWrapper;
  defs: SVGDefsElement;
  background: SVGGElement;
  scenes: Scene[];
  elapsed: number;
  audioCache: AudioCache;
  interval?: ReturnType<typeof setInterval>;

  constructor(sel: string | HTMLElement, options?: GameOptions, callback?: (game: Game) => void) {
    // Set defaults
    this.runOnLoad = true;
    this.width = 640;
    this.height = 480;
    this.frameRate = 30;
    this.uuid = (new Date()).getTime();
    this.masks = {};
    this.preload = null;
    this.audioEnabled = true;

    // Apply options
    if (options) {
      Object.assign(this, options);
    }

    this.intervalRate = this.frameRate ? 1000 / this.frameRate : 0;
    this.scenes = [];
    this.elapsed = 0;
    this.audioCache = {};

    // Get element using native DOM API
    this.elem = typeof sel === 'string' ? document.querySelector(sel)! : sel;

    // Set element dimensions using native style API
    this.elem.style.width = this.width + 'px';
    this.elem.style.height = this.height + 'px';

    // Create SVG using native methods
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElement.setAttribute('width', this.width.toString());
    svgElement.setAttribute('height', this.height.toString());
    svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    this.elem.appendChild(svgElement);

    // Create wrapper with helper methods
    this.svg = svg.createWrapper(svgElement);

    // Create defs for masks and other definitions
    this.defs = this.svg.defs(this.svg);

    // Create background layer
    this.background = this.svg.group(this.svg, 'game-background');
    this.svg.rect(this.background, 0, 0, this.width, this.height, {
      fill: '#000000'
    });

    // Preload images if specified
    if (this.preload) {
      const images = this.preload as string[];
      for (let i = 0; i < images.length; i++) {
        const img = new Image();
        img.src = images[i];
      }
    }

    // Auto-run if enabled
    if (this.runOnLoad) {
      this.run();
    }

    // Execute callback
    if (callback) {
      callback(this);
    }
  }

  run(): void {
    let then = new Date().getTime();
    const game = this;
    const tick = function() {
      const suspendID = game.svg.suspendRedraw(5000);

      const now = new Date().getTime();
      const delta = now - then;
      game.elapsed += delta;
      then = now;

      const scene = game.getCurrentScene();
      if (scene && !scene.isPaused()) {
        scene.tick(delta);
      }

      game.svg.unsuspendRedraw(suspendID);
    };
    this.interval = setInterval(tick, this.intervalRate);
  }

  getCurrentScene(): Scene | undefined {
    if (this.scenes.length > 0) {
      return this.scenes[this.scenes.length - 1];
    }
    return undefined;
  }

  newScene(id: string, options?: SceneOptions): Scene {
    const scene = new Scene(id, options);
    scene.game = this;
    scene.layer = this.svg.group(this.svg, 'scene-' + id);
    return scene;
  }

  popScene(): void {
    const scene = this.scenes.pop();
    if (scene) {
      scene.destroy();
      if (scene.layer) {
        util.safe_remove(scene.layer);
      }
    }
    const previousScene = this.getCurrentScene();
    if (previousScene) {
      if (previousScene.layer) {
        if (previousScene.layer.hasAttribute('display')) {
          previousScene.layer.removeAttribute('display');
        }
      }
      if (previousScene.init) {
        previousScene.init();
      }
      previousScene.resume();
    }
  }

  pushScene(scene: Scene): void {
    scene.game = this;
    const previousScene = this.getCurrentScene();
    if (previousScene) {
      previousScene.pause();
      if (previousScene.layer) {
        previousScene.layer.setAttribute('display', 'none');
      }
    }
    if (scene.init) {
      scene.init();
    }
    this.scenes.push(scene);
  }

  setBackgroundImage(x: number, y: number, width: number, height: number, path: string): void {
    this.svg.image(this.background, x, y, width, height, path);
    util.safe_remove(this.background.firstElementChild as Element);
  }

  setBackgroundColor(color: string): void {
    this.svg.rect(this.background, 0, 0, this.width, this.height, {
      fill: color
    });
    util.safe_remove(this.background.firstElementChild as Element);
  }

  getElapsedTime(): number {
    return this.elapsed;
  }

  getUUID(): number {
    return this.uuid++;
  }

  getMask(width: number, height: number): string {
    const id = width + '_' + height;
    if (!this.masks[id]) {
      this.masks[id] = this.svg._makeNode(this.defs, 'clipPath', {
        id: id,
        x: 0,
        y: 0,
        width: width,
        height: height
      }) as SVGClipPathElement;
      this.svg.rect(this.masks[id], 0, 0, width, height);
    }
    return id;
  }

  // Native HTML5 Audio API - preload sounds into cache
  preloadSounds(sounds: Record<string, string>): void {
    const game = this;
    Object.keys(sounds).forEach(function(name) {
      const file = sounds[name];
      const audio = new Audio(file + '.wav');
      audio.preload = 'auto';
      game.audioCache[name] = audio.src;
    });
  }

  // Native HTML5 Audio API - play sound from cache
  private _html5PlaySound(sound: string): HTMLAudioElement {
    const src = this.audioCache[sound];
    const audio = new Audio(src);
    audio.play();
    return audio;
  }

  // No-op audio when audio is disabled
  private _noopPlaySound(sound: string): { ended: boolean; pause: () => void } {
    return {
      ended: true,
      pause: function() {}
    };
  }

  playSound(sound: string): HTMLAudioElement | { ended: boolean; pause: () => void } {
    return this.audioEnabled ? this._html5PlaySound(sound) : this._noopPlaySound(sound);
  }
}
