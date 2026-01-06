import type { SpriteOptions, EasingFunction } from '../types/sprite.types';
import type { Position, Size } from '../types/game.types';
import type { Scene } from './Scene';
import * as easing from '../utils/easing';
import { noclick } from '../globals';

export class Sprite {
  className: string | null;
  enabled: boolean;
  pos: Position;
  hasDirection: boolean;
  direction: number;
  front: number;
  frameSize: Size;
  center: Position;
  background: string;
  frameCount: number;
  animating: boolean;
  animateWhileMoving: boolean;
  animateCallback: (() => void) | false;
  frame: number;
  image: string;
  animInterval: number;
  onclick: (ev: Event) => void;
  rotate?: number;

  element: SVGImageElement | null;
  imageElement?: SVGImageElement;
  moving: boolean;
  moveTime: number;
  animateTime: number;
  scene?: Scene;
  layer?: SVGElement;

  moveStartPos?: Position;
  moveDestPos?: Position;
  moveDuration?: number;
  moveCallback?: () => void;
  easing?: EasingFunction;

  directions: Record<string, Record<string, number>>;

  constructor(options: SpriteOptions) {
    this.className = null;
    this.enabled = true;
    this.pos = { x: 0, y: 0 };
    this.hasDirection = true;
    this.direction = 90;
    this.front = 90;
    this.frameSize = { width: 32, height: 32 };
    this.center = { x: 0, y: 0 };
    this.background = '';
    this.frameCount = 1;
    this.animating = false;
    this.animateWhileMoving = true;
    this.animateCallback = false;
    this.frame = 0;
    this.image = '';
    this.animInterval = 100;
    this.onclick = noclick;

    Object.assign(this, options);

    if (!this.center || (typeof this.center !== 'object')) {
      this.center = {
        x: Math.round(this.frameSize.width / 2),
        y: Math.round(this.frameSize.height / 2)
      };
    }

    this.element = null;
    this.moving = false;
    this.moveTime = 0;
    this.animateTime = 0;

    // Direction lookup table
    this.directions = {};
    this.directions['true'] = {};
    this.directions['true']['true'] = 0;
    this.directions['true']['false'] = 360;
    this.directions['false'] = {};
    this.directions['false']['true'] = 180;
    this.directions['false']['false'] = 180;
  }

  update(elapsed: number): void {
    if (this.enabled) {
      if (!this.element && this.scene) {
        const game = this.scene.game!;
        // Create sprite using native SVG with clip-path for animation frames
        this.element = game.svg.image(this.layer!, 0, 0, this.frameSize.width * this.frameCount, this.frameSize.height, this.image, {
          'clip-path': 'url(#' + game.getMask(this.frameSize.width, this.frameSize.height) + ')'
        });
        this.imageElement = this.element;
        // Add CSS class and event listener using native APIs
        if (this.className) {
          this.element.classList.add(this.className);
        }
        if (this.onclick) {
          this.element.addEventListener('click', this.onclick);
        }
        this.updateTransform();
      }
      if (this.moving) {
        this.moveTime += elapsed;
        this.updatePosition();
      }
      if (this.animating) {
        this.animateTime += elapsed;
        if (this.animateTime > this.animInterval) {
          const numFrames = Math.floor(this.animateTime / this.animInterval);
          this.advanceFrame(numFrames);
          this.animateTime = this.animateTime % this.animInterval;
        }
      }
    }
  }

  advanceFrame(numFrames?: number): void {
    if (!numFrames) numFrames = 1;
    const oldFrame = this.frame;
    this.frame = (this.frame + numFrames) % this.frameCount;
    if (this.animateCallback && this.frame < oldFrame) {
      this.animateCallback();
      this.animating = false;
    } else {
      const offset = this.frame * this.frameSize.width * -1;
      this.imageElement!.setAttribute('x', offset.toString());
    }
  }

  moveTo(x: number, y: number): void {
    this.pos.x = x;
    this.pos.y = y;
    this.updateTransform();
  }

  updateTransform(): void {
    if (!this.element) return;
    let transform = 'translate(' + (this.pos.x - this.center.x) + ', ' + (this.pos.y - this.center.y) + ')';
    if (this.rotate !== undefined) {
      transform = transform + ' rotate(' + this.rotate + ',' + this.center.x + ',' + this.center.y + ')';
    }
    this.element.setAttribute('transform', transform);
  }

  moveToward(x: number, y: number, duration: number, callback?: () => void, easingName?: string): void {
    this.moving = true;
    this.moveStartPos = {
      x: this.pos.x,
      y: this.pos.y
    };
    this.moveTime = 0;
    this.moveDestPos = { x, y };
    this.moveDuration = duration;
    this.moveCallback = callback;

    if (this.animateWhileMoving) this.animating = true;

    // Use native easing functions
    if (easingName) {
      this.easing = (easing as any)[easingName];
    } else {
      this.easing = easing.linear;
    }

    if (this.hasDirection) {
      const xdiff = this.moveDestPos.x - this.pos.x;
      const ydiff = this.moveDestPos.y - this.pos.y;
      if (xdiff == 0) {
        if (ydiff > 0) {
          this.rotate = (this.front + 90) % 360;
        } else if (ydiff < 0) {
          this.rotate = (this.front + 270) % 360;
        }
      } else {
        let theta = Math.atan(ydiff / xdiff) * (180 / Math.PI);
        theta += this.directions[String(xdiff >= 0)][String(ydiff >= 0)];
        theta += this.front;
        this.rotate = theta % 360;
      }
    }
  }

  updatePosition(): void {
    if (this.moveTime > this.moveDuration!) {
      this.finishMoving();
      if (this.moveCallback) this.moveCallback();
    } else {
      const newX = this.easing!(this.moveTime / this.moveDuration!, this.moveTime, this.moveStartPos!.x, this.moveDestPos!.x - this.moveStartPos!.x, this.moveDuration!);
      const newY = this.easing!(this.moveTime / this.moveDuration!, this.moveTime, this.moveStartPos!.y, this.moveDestPos!.y - this.moveStartPos!.y, this.moveDuration!);
      this.moveTo(newX, newY);
    }
  }

  finishMoving(): void {
    this.moveTo(this.moveDestPos!.x, this.moveDestPos!.y);
    this.moving = false;

    if (this.animateWhileMoving) {
      this.frame = 0;
      this.element!.setAttribute('x', '0');
      this.animating = false;
    }
  }

  remove(): void {
    this.enabled = false;
    const arrayPos = this.scene!.actors.indexOf(this);
    if (arrayPos != -1) {
      this.scene!.actors.splice(arrayPos, 1);
    }
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
