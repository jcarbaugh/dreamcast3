import { describe, it, expect } from 'vitest';
import {
  SVG_NS,
  createSVG,
  createWrapper,
  group,
  rect,
  image,
  defs,
  _makeNode,
  _setAttributes
} from '../../src/utils/svg';

describe('svg', () => {
  describe('SVG_NS', () => {
    it('should be the correct SVG namespace', () => {
      expect(SVG_NS).toBe('http://www.w3.org/2000/svg');
    });
  });

  describe('createSVG', () => {
    it('should create an SVG element with specified dimensions', () => {
      const svg = createSVG(800, 600);
      const root = svg.root();

      expect(root.tagName).toBe('svg');
      expect(root.getAttribute('width')).toBe('800');
      expect(root.getAttribute('height')).toBe('600');
      expect(root.getAttribute('xmlns')).toBe(SVG_NS);
    });

    it('should return a wrapper with helper methods', () => {
      const svg = createSVG(100, 100);

      expect(svg).toHaveProperty('root');
      expect(svg).toHaveProperty('group');
      expect(svg).toHaveProperty('rect');
      expect(svg).toHaveProperty('image');
      expect(svg).toHaveProperty('defs');
      expect(typeof svg.root).toBe('function');
      expect(typeof svg.group).toBe('function');
    });
  });

  describe('createWrapper', () => {
    it('should wrap an existing SVG element', () => {
      const svgElement = document.createElementNS(SVG_NS, 'svg');
      const wrapper = createWrapper(svgElement);

      expect(wrapper.root()).toBe(svgElement);
    });

    it('should provide no-op suspendRedraw/unsuspendRedraw', () => {
      const svgElement = document.createElementNS(SVG_NS, 'svg');
      const wrapper = createWrapper(svgElement);

      expect(wrapper.suspendRedraw(5000)).toBe(0);
      expect(() => wrapper.unsuspendRedraw(0)).not.toThrow();
    });
  });

  describe('group', () => {
    it('should create a group element', () => {
      const svg = document.createElementNS(SVG_NS, 'svg');
      const g = group(svg, 'test-group');

      expect(g.tagName).toBe('g');
      expect(g.getAttribute('id')).toBe('test-group');
      expect(svg.contains(g)).toBe(true);
    });

    it('should create group without id', () => {
      const svg = document.createElementNS(SVG_NS, 'svg');
      const g = group(svg);

      expect(g.tagName).toBe('g');
      expect(g.getAttribute('id')).toBeNull();
    });

    it('should apply attributes', () => {
      const svg = document.createElementNS(SVG_NS, 'svg');
      const g = group(svg, 'my-group', { class: 'test-class', transform: 'translate(10, 20)' });

      expect(g.getAttribute('class')).toBe('test-class');
      expect(g.getAttribute('transform')).toBe('translate(10, 20)');
    });
  });

  describe('rect', () => {
    it('should create a rect element with correct attributes', () => {
      const svg = document.createElementNS(SVG_NS, 'svg');
      const rectangle = rect(svg, 10, 20, 100, 50);

      expect(rectangle.tagName).toBe('rect');
      expect(rectangle.getAttribute('x')).toBe('10');
      expect(rectangle.getAttribute('y')).toBe('20');
      expect(rectangle.getAttribute('width')).toBe('100');
      expect(rectangle.getAttribute('height')).toBe('50');
    });

    it('should apply additional attributes', () => {
      const svg = document.createElementNS(SVG_NS, 'svg');
      const rectangle = rect(svg, 0, 0, 50, 50, { fill: '#ff0000', stroke: '#000000' });

      expect(rectangle.getAttribute('fill')).toBe('#ff0000');
      expect(rectangle.getAttribute('stroke')).toBe('#000000');
    });
  });

  describe('image', () => {
    it('should create an image element', () => {
      const svg = document.createElementNS(SVG_NS, 'svg');
      const img = image(svg, 10, 20, 100, 100, 'test.png');

      expect(img.tagName).toBe('image');
      expect(img.getAttribute('x')).toBe('10');
      expect(img.getAttribute('y')).toBe('20');
      expect(img.getAttribute('width')).toBe('100');
      expect(img.getAttribute('height')).toBe('100');
    });

    it('should set xlink:href attribute', () => {
      const svg = document.createElementNS(SVG_NS, 'svg');
      const img = image(svg, 0, 0, 50, 50, 'sprite.png');

      const href = img.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
      expect(href).toBe('sprite.png');
    });
  });

  describe('defs', () => {
    it('should create a defs element', () => {
      const svg = document.createElementNS(SVG_NS, 'svg');
      const defsElement = defs(svg);

      expect(defsElement.tagName).toBe('defs');
      expect(svg.contains(defsElement)).toBe(true);
    });
  });

  describe('_makeNode', () => {
    it('should create any SVG element type', () => {
      const svg = document.createElementNS(SVG_NS, 'svg');
      const circle = _makeNode(svg, 'circle', { cx: '50', cy: '50', r: '25' });

      expect(circle.tagName).toBe('circle');
      expect(circle.getAttribute('cx')).toBe('50');
      expect(circle.getAttribute('cy')).toBe('50');
      expect(circle.getAttribute('r')).toBe('25');
    });

    it('should append to parent', () => {
      const svg = document.createElementNS(SVG_NS, 'svg');
      const node = _makeNode(svg, 'path');

      expect(svg.contains(node)).toBe(true);
    });
  });

  describe('_setAttributes', () => {
    it('should set multiple attributes on an element', () => {
      const element = document.createElementNS(SVG_NS, 'rect');
      _setAttributes(element, {
        x: '10',
        y: '20',
        width: '100',
        height: '50',
        fill: '#ff0000'
      });

      expect(element.getAttribute('x')).toBe('10');
      expect(element.getAttribute('y')).toBe('20');
      expect(element.getAttribute('width')).toBe('100');
      expect(element.getAttribute('height')).toBe('50');
      expect(element.getAttribute('fill')).toBe('#ff0000');
    });

    it('should handle empty attributes object', () => {
      const element = document.createElementNS(SVG_NS, 'rect');
      expect(() => _setAttributes(element, {})).not.toThrow();
    });
  });

  describe('wrapper methods', () => {
    it('should allow chaining via wrapper', () => {
      const svg = createSVG(500, 500);
      const g = svg.group(svg, 'container');
      const r = svg.rect(g, 10, 10, 50, 50, { fill: 'blue' });

      expect(svg.root().contains(g)).toBe(true);
      expect(g.contains(r)).toBe(true);
      expect(r.getAttribute('fill')).toBe('blue');
    });
  });
});
