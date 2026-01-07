# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

dreamcast3 is a lightweight JavaScript game framework for building 2D games using native SVG rendering. The framework is written in TypeScript and compiled to multiple module formats (UMD, ES Modules, CommonJS) using Rollup. It has zero dependencies and uses native browser APIs exclusively.

## Core Architecture

The framework is organized around three main classes in `src/core/`:

### Game (src/core/Game.ts)
- Main game container that manages the SVG canvas, scene stack, and game loop
- Creates SVG element and wrapper with helper methods for drawing
- Runs tick loop using `setInterval` based on configured frameRate
- Manages scene stack with push/pop operations (only topmost scene ticks)
- Handles audio preloading and playback via HTML5 Audio API
- Background layer sits behind all scenes

### Scene (src/core/Scene.ts)
- Represents a game state/screen (menu, gameplay, pause, etc.)
- Contains actors (sprites) and custom layers
- Has lifecycle methods: `init()`, `onUpdate(delta)`, `pause()`, `resume()`, `destroy()`
- Supports scheduled tasks that run on intervals
- Only the current (topmost) scene in the stack updates and renders

### Sprite (src/core/Sprite.ts)
- Game objects with position, animation, and movement
- Uses SVG `<image>` elements with clip-path masks for frame animation
- Supports movement with easing functions via `moveToward()`
- Automatic rotation based on movement direction (configurable)
- Frame-based animation with configurable intervals
- Each sprite gets `scene` and `layer` properties when added to scene

## Key Utilities

### svg (src/utils/svg.ts)
- SVG element creation helpers (createSVG, group, rect, image, defs)
- All methods use native `document.createElementNS()` with SVG namespace
- Returns wrapper object with convenience methods

### easing (src/utils/easing.ts)
- Easing functions for smooth animations: linear, easeInQuad, easeOutQuad, easeInOutQuad, easeInCubic, easeOutCubic, easeInOutCubic
- Used by Sprite.moveToward() for movement interpolation

### util (src/utils/util.ts)
- `distance(pos1, pos2)`: Calculate distance between two points
- `pad(s, n, c)`: String padding utility
- `safe_remove(element)`: Safely remove DOM element

## Development Workflow

### Build System
The framework uses Rollup to compile TypeScript source into multiple module formats:
- **UMD** (`dist/dreamcast3.js`) - For browser `<script>` tags (backward compatible)
- **ESM** (`dist/dreamcast3.esm.js`) - For modern bundlers (tree-shakeable)
- **CJS** (`dist/dreamcast3.cjs.js`) - For Node.js compatibility
- **Types** (`dist/*.d.ts`) - TypeScript declaration files

### Commands
- `npm install` - Install dependencies
- `npm run build` - Build all output formats
- `npm run build:prod` - Production build with minification
- `npm run dev` - Watch mode for development
- `npm run typecheck` - Type check without emitting files
- `npm run clean` - Remove dist folder

### Running the Demo
1. Build the framework: `npm run build`
2. Open `examples/demo.html` in a web browser
3. The demo uses the UMD build from `dist/dreamcast3.js`

The demo showcases:
- Sprite creation and animation
- Keyboard input handling
- Click event handling on SVG elements
- Collision detection using distance utility
- Dynamic sprite spawning and removal

### Making Changes
1. Edit TypeScript files in `src/` directory
2. Run `npm run build` to compile
3. Refresh `examples/demo.html` in browser to see changes
4. Use browser console for debugging (`window.log()` helper available)

For faster development, use `npm run dev` to watch for changes and rebuild automatically.

### Project Structure
```
src/
├── index.ts           # Main entry point
├── core/              # Core classes (Game, Scene, Sprite)
├── utils/             # Utility modules (util, svg, easing)
├── types/             # TypeScript type definitions
└── globals.ts         # Global utilities (window.log, noclick)
```

### Code Style
- TypeScript with strict mode enabled
- ES2015 target for broad browser compatibility
- No external runtime dependencies
- SVG for all rendering (no Canvas, no Flash)
- Exports via ES modules, bundled to multiple formats

## Important Implementation Details

### Sprite Animation
- Sprites use horizontal sprite sheets (frames laid out left to right)
- Animation works by clipping visible area and shifting image `x` attribute
- Clip-path masks created via `game.getMask(width, height)` and cached
- Frame size must be consistent across all frames

### Scene Management
- Scene stack is LIFO - last pushed scene is active
- Previous scenes are hidden (display: none) when new scene pushed
- Popping a scene calls its `destroy()` method and removes its layer
- Previous scene's `init()` and `resume()` called when returning to it

### Movement System
- `moveToward(x, y, duration, callback, easing)` handles interpolated movement
- Movement automatically enables animation if `animateWhileMoving` is true
- Easing function determines interpolation curve
- Direction rotation calculated from movement vector (if `hasDirection` true)

### Audio
- HTML5 Audio API used (replaces old SoundManager2)
- Sounds preloaded into cache via `game.preloadSounds()`
- `game.playSound(name)` creates new Audio instance from cached src
- Can disable audio with `audioEnabled: false` in game options

### Element Removal
Always use `dreamcast3.util.safe_remove(element)` instead of direct `removeChild()` to avoid errors when element already removed or has no parent.
