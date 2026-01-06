# Contributing to dreamcast3

Thank you for considering contributing to dreamcast3! This document outlines the process for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/dreamcast3.git`
3. Install dependencies: `npm install`
4. Build the project: `npm run build`

## Development Workflow

### Making Changes

1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Make your changes in the `src/` directory
3. Write tests for your changes in the `tests/` directory
4. Ensure tests pass: `npm test`
5. Ensure type checking passes: `npm run typecheck`
6. Build the project: `npm run build`

### Project Structure

```
src/
├── core/       # Core classes (Game, Scene, Sprite)
├── utils/      # Utility functions (util, svg, easing)
├── types/      # TypeScript type definitions
└── index.ts    # Main entry point

tests/
├── core/       # Tests for core classes
└── utils/      # Tests for utilities
```

### Code Style

- TypeScript with strict mode enabled
- Follow existing code patterns
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions focused and single-purpose

### Testing

All new features and bug fixes must include tests:

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run dev
```

Aim for:
- 80%+ code coverage
- Test happy paths and edge cases
- Test error conditions

### Commit Messages

Write clear, descriptive commit messages:

```
feat: add sprite rotation support
fix: resolve collision detection bug
docs: update README with new examples
test: add tests for easing functions
```

## Submitting Changes

1. Push your changes to your fork
2. Open a Pull Request against the `main` branch
3. Describe your changes in the PR description
4. Link any related issues
5. Wait for CI to pass and for review

## Code Review Process

- Maintainers will review your PR
- Address any feedback or requested changes
- Once approved, your PR will be merged

## Reporting Bugs

Use the [GitHub issue tracker](https://github.com/jcarbaugh/dreamcast3/issues) to report bugs:

1. Check if the issue already exists
2. Provide a clear description
3. Include steps to reproduce
4. Include code examples if applicable
5. Specify your environment (browser, Node version, etc.)

## Feature Requests

Feature requests are welcome! Open an issue with:

1. Clear description of the feature
2. Use cases and examples
3. Why it would be valuable
4. Willingness to implement it yourself (optional)

## Questions?

Feel free to open an issue for questions or reach out to the maintainers.

Thank you for contributing! 🎮
