import type { SVGWrapper } from '../types/game.types';

export const SVG_NS = 'http://www.w3.org/2000/svg';

export function createSVG(width: number, height: number): SVGWrapper {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('width', width.toString());
  svg.setAttribute('height', height.toString());
  svg.setAttribute('xmlns', SVG_NS);
  return createWrapper(svg);
}

export function createWrapper(svgElement: SVGSVGElement): SVGWrapper {
  const wrapper: SVGWrapper = {
    _root: svgElement,
    root: function() {
      return this._root;
    },
    suspendRedraw: function(ms: number): number {
      return 0; // No-op for modern browsers (they optimize automatically)
    },
    unsuspendRedraw: function(id: number): void {
      // No-op for modern browsers
    },
    group: function(parent: SVGElement | SVGWrapper, id?: string, attrs?: Record<string, any>): SVGGElement {
      return group(parent, id, attrs);
    },
    rect: function(parent: SVGElement | SVGWrapper, x: number, y: number, width: number, height: number, attrs?: Record<string, any>): SVGRectElement {
      return rect(parent, x, y, width, height, attrs);
    },
    image: function(parent: SVGElement | SVGWrapper, x: number, y: number, width: number, height: number, href: string, attrs?: Record<string, any>): SVGImageElement {
      return image(parent, x, y, width, height, href, attrs);
    },
    defs: function(parent: SVGElement | SVGWrapper): SVGDefsElement {
      return defs(parent);
    },
    _makeNode: function(parent: SVGElement | SVGWrapper, type: string, attrs?: Record<string, any>): SVGElement {
      return _makeNode(parent, type, attrs);
    }
  };
  return wrapper;
}

export function group(parent: SVGElement | SVGWrapper, id?: string, attrs?: Record<string, any>): SVGGElement {
  const g = document.createElementNS(SVG_NS, 'g');
  if (id) g.setAttribute('id', id);
  if (attrs) _setAttributes(g, attrs);
  const parentElement = (parent && (parent as SVGWrapper)._root) || (parent as SVGElement);
  if (parentElement) parentElement.appendChild(g);
  return g;
}

export function rect(parent: SVGElement | SVGWrapper, x: number, y: number, width: number, height: number, attrs?: Record<string, any>): SVGRectElement {
  const rectElement = document.createElementNS(SVG_NS, 'rect');
  rectElement.setAttribute('x', x.toString());
  rectElement.setAttribute('y', y.toString());
  rectElement.setAttribute('width', width.toString());
  rectElement.setAttribute('height', height.toString());
  if (attrs) _setAttributes(rectElement, attrs);
  const parentElement = (parent && (parent as SVGWrapper)._root) || (parent as SVGElement);
  if (parentElement) parentElement.appendChild(rectElement);
  return rectElement;
}

export function image(parent: SVGElement | SVGWrapper, x: number, y: number, width: number, height: number, href: string, attrs?: Record<string, any>): SVGImageElement {
  const img = document.createElementNS(SVG_NS, 'image');
  img.setAttribute('x', x.toString());
  img.setAttribute('y', y.toString());
  img.setAttribute('width', width.toString());
  img.setAttribute('height', height.toString());
  img.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', href);
  if (attrs) _setAttributes(img, attrs);
  const parentElement = (parent && (parent as SVGWrapper)._root) || (parent as SVGElement);
  if (parentElement) parentElement.appendChild(img);
  return img;
}

export function defs(parent: SVGElement | SVGWrapper): SVGDefsElement {
  const defsElement = document.createElementNS(SVG_NS, 'defs');
  const parentElement = (parent && (parent as SVGWrapper)._root) || (parent as SVGElement);
  if (parentElement) parentElement.appendChild(defsElement);
  return defsElement;
}

export function _makeNode(parent: SVGElement | SVGWrapper, type: string, attrs?: Record<string, any>): SVGElement {
  const node = document.createElementNS(SVG_NS, type);
  if (attrs) _setAttributes(node, attrs);
  const parentElement = (parent && (parent as SVGWrapper)._root) || (parent as SVGElement);
  if (parentElement) parentElement.appendChild(node);
  return node;
}

export function _setAttributes(element: SVGElement, attrs: Record<string, any>): void {
  for (const key in attrs) {
    if (attrs.hasOwnProperty(key)) {
      element.setAttribute(key, attrs[key]);
    }
  }
}
