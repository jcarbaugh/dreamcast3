import { describe, it, expect } from 'vitest';
import {
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic
} from '../../src/utils/easing';

describe('easing', () => {
  const duration = 1000;
  const begin = 0;
  const change = 100;

  describe('linear', () => {
    it('should return begin value at start', () => {
      const result = linear(0, 0, begin, change, duration);
      expect(result).toBe(begin);
    });

    it('should return end value at end', () => {
      const result = linear(1, duration, begin, change, duration);
      expect(result).toBe(begin + change);
    });

    it('should be halfway at 50%', () => {
      const result = linear(0.5, duration / 2, begin, change, duration);
      expect(result).toBe(begin + change / 2);
    });
  });

  describe('easeInQuad', () => {
    it('should return begin value at start', () => {
      const result = easeInQuad(0, 0, begin, change, duration);
      expect(result).toBe(begin);
    });

    it('should return end value at end', () => {
      const result = easeInQuad(1, duration, begin, change, duration);
      expect(result).toBe(begin + change);
    });

    it('should accelerate (slow start)', () => {
      const quarter = easeInQuad(0.25, duration * 0.25, begin, change, duration);
      const half = easeInQuad(0.5, duration * 0.5, begin, change, duration);

      // Should be less than linear at quarter point
      expect(quarter).toBeLessThan(begin + change * 0.25);
      // But should reach halfway before time halfway
      expect(half).toBeGreaterThan(begin);
    });
  });

  describe('easeOutQuad', () => {
    it('should return begin value at start', () => {
      const result = easeOutQuad(0, 0, begin, change, duration);
      expect(result).toBe(begin);
    });

    it('should return end value at end', () => {
      const result = easeOutQuad(1, duration, begin, change, duration);
      expect(result).toBe(begin + change);
    });

    it('should decelerate (fast start)', () => {
      const quarter = easeOutQuad(0.25, duration * 0.25, begin, change, duration);

      // Should be more than linear at quarter point (fast start)
      expect(quarter).toBeGreaterThan(begin + change * 0.25);
    });
  });

  describe('easeInOutQuad', () => {
    it('should return begin value at start', () => {
      const result = easeInOutQuad(0, 0, begin, change, duration);
      expect(result).toBe(begin);
    });

    it('should return end value at end', () => {
      const result = easeInOutQuad(1, duration, begin, change, duration);
      expect(result).toBe(begin + change);
    });

    it('should be symmetric around midpoint', () => {
      const quarter = easeInOutQuad(0.25, duration * 0.25, begin, change, duration);
      const threeQuarters = easeInOutQuad(0.75, duration * 0.75, begin, change, duration);

      const midpoint = begin + change / 2;
      const distanceFromMid1 = Math.abs(quarter - midpoint);
      const distanceFromMid2 = Math.abs(threeQuarters - midpoint);

      expect(distanceFromMid1).toBeCloseTo(distanceFromMid2, 1);
    });
  });

  describe('easeInCubic', () => {
    it('should return begin value at start', () => {
      const result = easeInCubic(0, 0, begin, change, duration);
      expect(result).toBe(begin);
    });

    it('should return end value at end', () => {
      const result = easeInCubic(1, duration, begin, change, duration);
      expect(result).toBe(begin + change);
    });

    it('should accelerate more than quad', () => {
      const time = duration * 0.5;
      const cubic = easeInCubic(0.5, time, begin, change, duration);
      const quad = easeInQuad(0.5, time, begin, change, duration);

      // Cubic should accelerate slower than quad at midpoint
      expect(cubic).toBeLessThan(quad);
    });
  });

  describe('easeOutCubic', () => {
    it('should return begin value at start', () => {
      const result = easeOutCubic(0, 0, begin, change, duration);
      expect(result).toBe(begin);
    });

    it('should return end value at end', () => {
      const result = easeOutCubic(1, duration, begin, change, duration);
      expect(result).toBe(begin + change);
    });

    it('should decelerate', () => {
      const quarter = easeOutCubic(0.25, duration * 0.25, begin, change, duration);

      // Should be ahead of linear (fast start)
      expect(quarter).toBeGreaterThan(begin + change * 0.25);
    });
  });

  describe('easeInOutCubic', () => {
    it('should return begin value at start', () => {
      const result = easeInOutCubic(0, 0, begin, change, duration);
      expect(result).toBe(begin);
    });

    it('should return end value at end', () => {
      const result = easeInOutCubic(1, duration, begin, change, duration);
      expect(result).toBe(begin + change);
    });

    it('should pass through midpoint at half time', () => {
      const result = easeInOutCubic(0.5, duration / 2, begin, change, duration);
      expect(result).toBeCloseTo(begin + change / 2, 1);
    });
  });

  // Test that all easing functions respect the same signature
  describe('easing function signature', () => {
    const easingFunctions = [
      { name: 'linear', fn: linear },
      { name: 'easeInQuad', fn: easeInQuad },
      { name: 'easeOutQuad', fn: easeOutQuad },
      { name: 'easeInOutQuad', fn: easeInOutQuad },
      { name: 'easeInCubic', fn: easeInCubic },
      { name: 'easeOutCubic', fn: easeOutCubic },
      { name: 'easeInOutCubic', fn: easeInOutCubic }
    ];

    easingFunctions.forEach(({ name, fn }) => {
      it(`${name} should start at begin value`, () => {
        const result = fn(0, 0, begin, change, duration);
        expect(result).toBe(begin);
      });

      it(`${name} should end at begin + change value`, () => {
        const result = fn(1, duration, begin, change, duration);
        expect(result).toBe(begin + change);
      });

      it(`${name} should be monotonically increasing`, () => {
        const values = [];
        for (let t = 0; t <= duration; t += duration / 10) {
          values.push(fn(t / duration, t, begin, change, duration));
        }

        for (let i = 1; i < values.length; i++) {
          expect(values[i]).toBeGreaterThanOrEqual(values[i - 1]);
        }
      });
    });
  });
});
