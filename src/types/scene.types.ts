export interface SceneOptions {
  paused?: boolean;
  layers?: Record<string, SVGGElement>;
  layer?: SVGGElement | null;
  onDestroy?: (() => void) | null;
  init?: () => void;
  onUpdate?: (delta: number) => void;
}
