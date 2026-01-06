# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.0.0] - 2025-01-06

### Added
- TypeScript support with full type definitions
- Multiple build formats (UMD, ESM, CommonJS)
- Comprehensive test suite with Vitest (90%+ coverage)
- CI/CD pipeline with GitHub Actions
- Modern package.json with exports field
- Community files (LICENSE, CONTRIBUTING, CODE_OF_CONDUCT)
- Support for tree-shaking via sideEffects field
- Source maps for all build outputs

### Changed
- Migrated from vanilla JavaScript to TypeScript
- Renamed `ondestroy` to `onDestroy` for consistency
- Updated build system to use Rollup
- Moved demo to examples directory
- Improved API documentation in README

### Removed
- jQuery dependency (now uses native browser APIs)
- Legacy browser support (now requires ES2015+ and modern browsers)

## [2.0.0] - Previous Version
- (Previous version history)

[Unreleased]: https://github.com/jcarbaugh/dreamcast3/compare/v3.0.0...HEAD
[3.0.0]: https://github.com/jcarbaugh/dreamcast3/releases/tag/v3.0.0
