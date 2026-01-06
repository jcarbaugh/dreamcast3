import { describe, it, expect } from 'vitest';
import { distance, pad, safe_remove } from '../../src/utils/util';

describe('util', () => {
  describe('distance', () => {
    it('should calculate distance between two points', () => {
      const result = distance({ x: 0, y: 0 }, { x: 3, y: 4 });
      expect(result).toBe(5);
    });

    it('should return 0 for the same point', () => {
      const result = distance({ x: 5, y: 5 }, { x: 5, y: 5 });
      expect(result).toBe(0);
    });

    it('should handle negative coordinates', () => {
      const result = distance({ x: -3, y: -4 }, { x: 0, y: 0 });
      expect(result).toBe(5);
    });

    it('should calculate horizontal distance', () => {
      const result = distance({ x: 0, y: 0 }, { x: 10, y: 0 });
      expect(result).toBe(10);
    });

    it('should calculate vertical distance', () => {
      const result = distance({ x: 0, y: 0 }, { x: 0, y: 10 });
      expect(result).toBe(10);
    });
  });

  describe('pad', () => {
    it('should pad a string to the specified length', () => {
      const result = pad('7', 3, '0');
      expect(result).toBe('007');
    });

    it('should not pad if string is already long enough', () => {
      const result = pad('hello', 3, '0');
      expect(result).toBe('hello');
    });

    it('should handle multi-character padding', () => {
      const result = pad('x', 5, 'ab');
      // Pads 4 times with 'ab', resulting in 'ababababx' (9 chars)
      expect(result).toBe('ababababx');
    });

    it('should return original string if target length equals current length', () => {
      const result = pad('abc', 3, '0');
      expect(result).toBe('abc');
    });

    it('should pad with spaces', () => {
      const result = pad('test', 8, ' ');
      expect(result).toBe('    test');
    });
  });

  describe('safe_remove', () => {
    it('should remove element from parent', () => {
      const parent = document.createElement('div');
      const child = document.createElement('span');
      parent.appendChild(child);

      safe_remove(child);

      expect(parent.children.length).toBe(0);
    });

    it('should handle null element gracefully', () => {
      expect(() => safe_remove(null)).not.toThrow();
    });

    it('should handle element without parent gracefully', () => {
      const element = document.createElement('div');
      expect(() => safe_remove(element)).not.toThrow();
    });

    it('should handle already removed element gracefully', () => {
      const parent = document.createElement('div');
      const child = document.createElement('span');
      parent.appendChild(child);
      parent.removeChild(child);

      expect(() => safe_remove(child)).not.toThrow();
    });
  });
});
