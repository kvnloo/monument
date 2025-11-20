<div align="center">
<img width="1200" height="475" alt="Monument Valley Demo Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# Monument Valley Demo

An interactive 3D recreation of Monument Valley's impossible geometry and isometric puzzles, built with React 19, Three.js, and TypeScript.

[![Live Demo](https://img.shields.io/badge/Demo-Live-success?style=for-the-badge)](https://kvnloo.github.io/monument/)
[![Dev Preview](https://img.shields.io/badge/Dev-Preview-blue?style=for-the-badge)](https://kvnloo.github.io/monument/dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

[Live Demo](https://kvnloo.github.io/monument/) • [Dev Preview](https://kvnloo.github.io/monument/dev/) • [Report Bug](https://github.com/kvnloo/monument/issues) • [Request Feature](https://github.com/kvnloo/monument/issues)

</div>

## Overview

Monument Valley Demo is an experimental recreation of the award-winning mobile game's core mechanics, featuring:

- **Impossible Geometry**: Penrose triangles and M.C. Escher-inspired visual illusions
- **Isometric View**: Fixed orthographic camera creating the signature Monument Valley perspective
- **Interactive Puzzles**: Click-to-move navigation on impossible structures
- **Visual Polish**: Pastel color palettes and smooth animations
- **Water Mechanics**: Dynamic water effects with validated alignment algorithms

This project demonstrates advanced 3D rendering techniques, including isometric projection, raycasting with orthographic cameras, and perspective-based visual illusions.

## Features

- **Penrose Triangle Illusion**: Three separate L-shaped blocks positioned to appear connected from the camera view
- **Click-to-Move Navigation**: Raycasting-based interaction allowing character movement across surfaces
- **Isometric Projection**: Mathematically validated alignment algorithms for precise object placement
- **Theme System**: Multiple color palettes inspired by Monument Valley's aesthetic
- **Smooth Animations**: Natural movement with proper easing and transitions
- **Level System**: Modular level architecture for expanding gameplay
- **Comprehensive Testing**: 28 test cases validating alignment algorithms with 75% pass rate

## Demo Links

- **Production**: [https://kvnloo.github.io/monument/](https://kvnloo.github.io/monument/)
- **Development**: [https://kvnloo.github.io/monument/dev/](https://kvnloo.github.io/monument/dev/)

Both branches auto-deploy on push via GitHub Actions.

## Tech Stack

### Core Technologies
- **React 19** - Latest React with improved rendering performance
- **Three.js** - 3D graphics rendering engine
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server

### Three.js Ecosystem
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers and abstractions
- **@react-three/postprocessing** - Post-processing effects

### Development Tools
- **Vitest** - Unit testing framework
- **@vitest/ui** - Interactive test UI
- **GitHub Actions** - CI/CD pipeline for automated deployment

## Quick Start

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kvnloo/monument.git
   cd monument
   ```

2. Navigate to source directory:
   ```bash
   cd src
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view in your browser.

### Build

Create a production build:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

### Testing

Run tests once:
```bash
npm run test:run
```

Run tests in watch mode:
```bash
npm run test
```

Run tests with interactive UI:
```bash
npm run test:ui
```

Generate coverage report:
```bash
npm run test:coverage
```

## Project Structure

```
monument/
├── src/
│   ├── components/
│   │   ├── Scene/          # 3D scene components
│   │   │   ├── EnginePreview.tsx
│   │   │   ├── LevelOne.tsx
│   │   │   ├── BuildingBlocks.tsx
│   │   │   ├── MovableWrapper.tsx
│   │   │   └── FloatingParticles.tsx
│   │   ├── UI/             # User interface components
│   │   │   ├── Header.tsx
│   │   │   ├── IntroScreen.tsx
│   │   │   └── LevelSelect.tsx
│   │   └── Research/       # Research panel components
│   │       ├── PlannerPanel.tsx
│   │       └── ResearchCard.tsx
│   ├── utils/              # Utility functions
│   │   ├── isometricAlignment.ts
│   │   └── __tests__/      # Test suites
│   ├── contexts/           # React contexts
│   ├── themes/             # Color themes
│   ├── types/              # TypeScript definitions
│   ├── App.tsx             # Main application component
│   ├── constants.ts        # Configuration constants
│   └── vite.config.ts      # Build configuration
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Pages deployment
├── milestones.md           # Development roadmap
├── LICENSE                 # MIT License
└── README.md               # This file
```

## Key Concepts

### Isometric Projection

The project uses an orthographic camera positioned at specific coordinates to achieve the isometric view:

```typescript
// Orthographic camera setup
camera.position.set(8, 6, 8);
camera.lookAt(0, 0, 0);
```

This creates a 45-degree angle view characteristic of Monument Valley's visual style.

### Alignment Algorithms

The isometric alignment system uses iterative convergence to precisely position objects:

- **Binary search convergence** for Y-coordinate calculation
- **Screen-space projection** validation
- **Camera-specific calibration** for different view configurations
- **Comprehensive test coverage** with diagnostic tools

See `/src/utils/__tests__/isometricAlignment.test.ts` for validation details.

### Impossible Geometry

Penrose triangles are created by positioning three separate L-shaped blocks such that:
1. Each block is geometrically disconnected in 3D space
2. From the camera view, edges appear perfectly aligned
3. The illusion breaks when viewed from other angles

This demonstrates how perspective can create visual impossibilities.

## Documentation

- **[INDEX.md](src/INDEX.md)** - Test suite overview and navigation
- **[milestones.md](milestones.md)** - Development roadmap and milestone tracking
- **[CAMERA_INVESTIGATION.md](src/CAMERA_INVESTIGATION.md)** - Camera setup and screen-space analysis
- **[DEBUG_ALIGNMENT.md](src/DEBUG_ALIGNMENT.md)** - Alignment debugging guide

## Contributing

Contributions are welcome! This project is primarily educational and experimental.

### Development Guidelines
1. Follow the existing code style and structure
2. Add tests for new alignment algorithms or geometry calculations
3. Update documentation for significant changes
4. Test thoroughly in both development and production builds

### Reporting Issues
Please use the [GitHub Issues](https://github.com/kvnloo/monument/issues) page to report bugs or suggest features.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License - Copyright (c) 2024-2025 Monument Valley Demo Contributors
```

## Acknowledgments

- Inspired by [Monument Valley](https://www.monumentvalleygame.com/) by ustwo games
- Built with [Three.js](https://threejs.org/) and [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- Impossible geometry concepts from M.C. Escher and Roger Penrose

## Project Status

This is an active experimental project. Current status:

- ✅ Core isometric projection system
- ✅ Penrose triangle illusion
- ✅ Click-to-move navigation
- ✅ Theme system
- ✅ Alignment algorithm validation
- ✅ GitHub Pages deployment
- 🚧 Additional levels and puzzles (in progress)
- 🚧 Advanced impossible geometry structures (planned)

---

<div align="center">

**[View Live Demo](https://kvnloo.github.io/monument/)** | **[View Dev Preview](https://kvnloo.github.io/monument/dev/)**

Made with ❤️ using React, Three.js, and TypeScript

</div>
