# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

#### Project Organization & Architecture
- **File Structure Reorganization**: Restructured project layout into logical component and context directories for improved maintainability and scalability
- **New Documentation Structure**: Organized documentation files into `.ai/context/` directory following semantic clustering pattern
- **Constants Configuration System**: Consolidated configuration values into centralized `constants.ts` for easier environment management and theme switching

#### Isometric Alignment Algorithm
- **Alignment Calculation System**: Implemented comprehensive algorithm for calculating object alignment in isometric 3D view coordinates
- **AlignmentVisualizer Dev Tool**: Created interactive development tool for debugging and validating isometric alignment calculations with real-time visual feedback
- **Surface-Based Movement**: Algorithm supporting character movement aligned to arbitrary 3D surfaces in isometric perspective

#### Water Flow & Animation System
- **Water Animation System**: Implemented dynamic water flow animations with directional control
  - Beam B water flow direction: Configurable directional control
  - Waterfall animations with flip direction support
  - Smooth flow transitions and timing controls
- **Water Physics Foundation**: Base system for water movement mechanics and visual effects

#### Theme System
- **Theme Context Provider**: Implemented React context-based theme management system
- **Dynamic Theme Switching**: Support for runtime theme switching without page reload
- **Theme Configuration**: Centralized theme variables and styling system

#### Development Tools & Infrastructure
- **Intro Screen Animation**: Improved intro screen exit animations with refined easing and transitions
- **GitHub Pages Deployment**: Automated deployment pipeline supporting both main and dev branches
  - Dual-branch GitHub Pages hosting
  - Vite base path configuration for correct asset routing
  - Automated build and deployment workflow via GitHub Actions
- **Build System Improvements**: Fixed npm cache handling in CI/CD pipeline

### Fixed

- **GitHub Actions Build Issues**: Resolved npm cache path configuration problems
- **Package Management**: Updated package name and configuration for consistency
- **GitHub Pages Asset Loading**: Fixed base path configuration in Vite for correct static asset routing across different branch deployments
- **Build Artifacts**: Resolved issues with workflow artifact handling and package-lock.json synchronization

### Changed

- **Animation Behavior**: Enhanced intro screen animations for smoother user experience
- **Water Flow Direction**: Flipped water flow direction in Beam B and Waterfall components for improved visual consistency

### Technical Details

#### Components Affected
- `src/components/` - Core Three.js scene and model components
- `src/contexts/` - React context providers for state management
- `src/constants.ts` - Configuration and theme variables
- `src/App.tsx` - Main application component

#### Key Files
- `.ai/context/` - Semantic documentation and research materials
- `docs/` - User-facing documentation
- `.github/workflows/` - CI/CD pipeline configuration

## Development Milestones

### Current Focus
- Isometric 3D visualization with interactive elements
- Water animation and physics systems
- Theme customization and accessibility
- Performance optimization for WebGL rendering

### Known Limitations
- Water physics system is animation-based rather than physics-simulated
- Theme system currently supports predefined themes
- Isometric alignment requires calibration for different camera angles

---

## Version History Reference

This unreleased version (0.1.0) represents the consolidation of features from the current development branch that includes significant architectural improvements and feature additions from earlier work on character movement systems, basic water animations, and deployment infrastructure.

For information about implementing these features, see [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md).

For quick reference on the systems, see [QUICK_REFERENCE.md](./QUICK_REFERENCE.md).
