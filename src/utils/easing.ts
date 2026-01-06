import type { EasingFunction } from '../types/sprite.types';

// Linear easing - no acceleration
// Signature: easing(x, t, b, c, d)
// x = normalized time (0-1), t = current time, b = beginning value, c = change, d = duration

export const linear: EasingFunction = function(x, t, b, c, d) {
  return c * (t / d) + b;
};

// Quadratic ease-in
export const easeInQuad: EasingFunction = function(x, t, b, c, d) {
  return c * (t /= d) * t + b;
};

// Quadratic ease-out
export const easeOutQuad: EasingFunction = function(x, t, b, c, d) {
  return -c * (t /= d) * (t - 2) + b;
};

// Quadratic ease-in-out
export const easeInOutQuad: EasingFunction = function(x, t, b, c, d) {
  if ((t /= d / 2) < 1) return c / 2 * t * t + b;
  return -c / 2 * ((--t) * (t - 2) - 1) + b;
};

// Cubic ease-in
export const easeInCubic: EasingFunction = function(x, t, b, c, d) {
  return c * (t /= d) * t * t + b;
};

// Cubic ease-out
export const easeOutCubic: EasingFunction = function(x, t, b, c, d) {
  return c * ((t = t / d - 1) * t * t + 1) + b;
};

// Cubic ease-in-out
export const easeInOutCubic: EasingFunction = function(x, t, b, c, d) {
  if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
  return c / 2 * ((t -= 2) * t * t + 2) + b;
};
