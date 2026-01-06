export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface GameOptions {
  runOnLoad?: boolean;
  width?: number;
  height?: number;
  frameRate?: number;
  uuid?: number;
  masks?: Record<string, SVGClipPathElement>;
  preload?: string[] | null;
  audioEnabled?: boolean;
}

export interface AudioCache {
  [key: string]: string;
}

export interface SVGWrapper {
  _root: SVGSVGElement;
  root(): SVGSVGElement;
  suspendRedraw(ms: number): number;
  unsuspendRedraw(id: number): void;
  group(parent: SVGElement | SVGWrapper, id?: string, attrs?: Record<string, any>): SVGGElement;
  rect(parent: SVGElement | SVGWrapper, x: number, y: number, width: number, height: number, attrs?: Record<string, any>): SVGRectElement;
  image(parent: SVGElement | SVGWrapper, x: number, y: number, width: number, height: number, href: string, attrs?: Record<string, any>): SVGImageElement;
  defs(parent: SVGElement | SVGWrapper): SVGDefsElement;
  _makeNode(parent: SVGElement | SVGWrapper, type: string, attrs?: Record<string, any>): SVGElement;
}
