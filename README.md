# dreamcast3

> A lightweight, zero-dependency JavaScript game framework for building 2D games using native SVG rendering

[![CI](https://github.com/jcarbaugh/dreamcast3/workflows/CI/badge.svg)](https://github.com/jcarbaugh/dreamcast3/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![npm version](https://img.shields.io/npm/v/dreamcast3.svg)](https://www.npmjs.com/package/dreamcast3)

dreamcast3 is a modern, TypeScript-based game framework that leverages the power of SVG for 2D game development. With zero runtime dependencies and native browser APIs, it provides a simple yet powerful foundation for creating interactive games directly in the browser.

## ✨ Features

- 🎮 **Scene Management** - Stack-based scene system for menus, gameplay, and transitions
- 🎨 **SVG Rendering** - Hardware-accelerated graphics using native SVG
- 🏃 **Sprite Animation** - Frame-based animation with clip-path masking
- 📐 **Movement System** - Smooth interpolated movement with 7 easing functions
- 🎵 **HTML5 Audio** - Built-in audio preloading and playback
- 📦 **Zero Dependencies** - No external runtime dependencies
- 🔧 **TypeScript** - Full type safety and IDE autocomplete
- 🌲 **Tree-Shakeable** - ES modules support for optimal bundle sizes
- 🎯 **Multiple Formats** - UMD, ESM, and CommonJS builds included

## 📦 Installation

### NPM

```bash
npm install dreamcast3
```

### Browser (UMD)

```html
<script src="https://unpkg.com/dreamcast3/dist/dreamcast3.js"></script>
```

### CDN

```html
<!-- Latest version -->
<script src="https://cdn.jsdelivr.net/npm/dreamcast3/dist/dreamcast3.js"></script>

<!-- Specific version -->
<script src="https://cdn.jsdelivr.net/npm/dreamcast3@3.0.0/dist/dreamcast3.js"></script>
```

## 🚀 Quick Start

### Browser (Global)

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Game</title>
</head>
<body>
  <div id="game"></div>

  <script src="https://unpkg.com/dreamcast3/dist/dreamcast3.js"></script>
  <script>
    // Create a new game
    const game = new dreamcast3.Game('#game', {
      width: 800,
      height: 600,
      frameRate: 60
    }, (g) => {

      // Create a scene
      const mainScene = g.newScene('main', {
        init() {
          console.log('Scene initialized!');
        },
        update(delta) {
          // Game logic here
        }
      });

      // Create a sprite
      const player = new dreamcast3.Sprite({
        pos: { x: 400, y: 300 },
        frameSize: { width: 32, height: 32 },
        image: 'player.png'
      });

      mainScene.addActor(player);
      g.pushScene(mainScene);
    });
  </script>
</body>
</html>
```

### ES Modules (Modern)

```typescript
import { Game, Scene, Sprite } from 'dreamcast3';
import type { GameOptions } from 'dreamcast3';

const options: GameOptions = {
  width: 800,
  height: 600,
  frameRate: 60
};

const game = new Game('#game', options, (g) => {
  const mainScene = g.newScene('main', {
    update(delta) {
      // Your game loop
    }
  });

  const player = new Sprite({
    pos: { x: 100, y: 100 },
    frameSize: { width: 32, height: 32 },
    image: 'player.png',
    frameCount: 4,
    animInterval: 100
  });

  mainScene.addActor(player);
  g.pushScene(mainScene);
});
```

### Node.js (CommonJS)

```javascript
const { Game, Sprite, util } = require('dreamcast3');

const distance = util.distance({ x: 0, y: 0 }, { x: 3, y: 4 });
console.log(distance); // 5
```

## 📖 Core Concepts

### Game

The main game container that manages the SVG canvas, scene stack, and game loop.

```javascript
const game = new Game('#game', {
  width: 640,           // Canvas width
  height: 480,          // Canvas height
  frameRate: 30,        // Target FPS (0 = unlimited)
  audioEnabled: true,   // Enable audio system
  runOnLoad: true       // Auto-start game loop
}, (g) => {
  // Initialization callback
});
```

### Scene

Represents a game state (menu, gameplay, pause screen, etc.) with lifecycle methods.

```javascript
const scene = game.newScene('gameplay', {
  init() {
    // Called when scene becomes active
  },
  update(delta) {
    // Called every frame with delta time
  },
  onDestroy() {
    // Called when scene is popped
  }
});

// Scene management
game.pushScene(scene);  // Make scene active
game.popScene();        // Return to previous scene
```

### Sprite

Animated game objects with position, movement, and frame-based animation.

```javascript
const sprite = new Sprite({
  pos: { x: 100, y: 100 },
  frameSize: { width: 32, height: 32 },
  image: 'spritesheet.png',
  frameCount: 8,          // Number of animation frames
  animInterval: 100,      // Milliseconds per frame
  animating: true,
  hasDirection: true      // Auto-rotate based on movement
});

// Add to scene
scene.addActor(sprite);

// Movement with easing
sprite.moveToward(200, 200, 1000, () => {
  console.log('Arrived!');
}, 'easeInOutQuad');
```

## 🎨 Utilities

### Easing Functions

Built-in easing functions for smooth animations:

```javascript
import { easing } from 'dreamcast3';

// Available easing functions:
easing.linear
easing.easeInQuad
easing.easeOutQuad
easing.easeInOutQuad
easing.easeInCubic
easing.easeOutCubic
easing.easeInOutCubic
```

### SVG Helpers

Create SVG elements programmatically:

```javascript
import { svg } from 'dreamcast3';

const wrapper = svg.createSVG(800, 600);
const group = svg.group(wrapper, 'my-group');
const rect = svg.rect(group, 0, 0, 100, 100, { fill: '#ff0000' });
```

### Utilities

```javascript
import { util } from 'dreamcast3';

// Calculate distance between two points
const dist = util.distance({ x: 0, y: 0 }, { x: 3, y: 4 }); // 5

// String padding
const padded = util.pad('7', 3, '0'); // '007'

// Safe DOM removal
util.safe_remove(element);
```

## 🎮 Examples

Check out the [Star Collector demo](examples/demo.html) for a complete working example featuring:

- Player movement with keyboard controls
- Falling objects with collision detection
- Click event handling
- Score tracking
- Sprite animation

To run the demo:

```bash
npm install
npm run build
open examples/demo.html
```

## 🛠️ Development

### Prerequisites

- Node.js 14+ and npm

### Setup

```bash
# Clone the repository
git clone https://github.com/jcarbaugh/dreamcast3.git
cd dreamcast3

# Install dependencies
npm install

# Build the project
npm run build
```

### Available Scripts

```bash
npm run build          # Build all output formats
npm run build:prod     # Production build with minification
npm run dev            # Watch mode for development
npm run typecheck      # Type check without building
npm run clean          # Remove dist folder
```

### Project Structure

```
dreamcast3/
├── src/
│   ├── core/          # Game, Scene, Sprite classes
│   ├── utils/         # Utility modules (util, svg, easing)
│   ├── types/         # TypeScript type definitions
│   └── index.ts       # Main entry point
├── dist/              # Build output (generated)
├── examples/          # Example games and demos
└── rollup.config.js   # Build configuration
```

## 📚 API Reference

### Game Class

#### Constructor

```typescript
new Game(selector: string | HTMLElement, options?: GameOptions, callback?: (game: Game) => void)
```

#### Methods

- `run()` - Start the game loop
- `getCurrentScene()` - Get the active scene
- `newScene(id, options)` - Create a new scene
- `pushScene(scene)` - Make scene active
- `popScene()` - Return to previous scene
- `setBackgroundColor(color)` - Set background color
- `setBackgroundImage(x, y, width, height, path)` - Set background image
- `preloadSounds(sounds)` - Preload audio files
- `playSound(name)` - Play a sound
- `getElapsedTime()` - Get total elapsed time in ms

### Scene Class

#### Constructor

```typescript
new Scene(id: string, options?: SceneOptions)
```

#### Methods

- `addActor(actor, layer?)` - Add sprite to scene
- `addLayer(name)` - Create a named layer
- `addScheduledTask(fn, delay)` - Schedule a recurring task
- `pause()` - Pause the scene
- `resume()` - Resume the scene
- `isPaused()` - Check if paused

### Sprite Class

#### Constructor

```typescript
new Sprite(options: SpriteOptions)
```

#### Methods

- `moveTo(x, y)` - Teleport to position
- `moveToward(x, y, duration, callback?, easing?)` - Animated movement
- `advanceFrame(numFrames?)` - Advance animation frame
- `remove()` - Remove from scene

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT © [Jeremy Carbaugh](https://github.com/jcarbaugh)

## 🙏 Acknowledgments

- Inspired by classic 2D game frameworks
- Built with modern web standards and TypeScript
- Designed for simplicity and developer experience

## 📞 Support

- 📖 [Documentation](https://github.com/jcarbaugh/dreamcast3)
- 🐛 [Issue Tracker](https://github.com/jcarbaugh/dreamcast3/issues)
- 💬 [Discussions](https://github.com/jcarbaugh/dreamcast3/discussions)

---

Made with ❤️ for game developers who love the web platform
