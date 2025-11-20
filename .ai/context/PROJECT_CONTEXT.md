# Project Context: Monument Valley Demo

## Project Overview

The Monument Valley Demo is an interactive 3D web application that recreates the visual style and mechanics of the famous Monument Valley game. It showcases isometric rendering, water flow animations, and interactive exploration mechanics using modern web technologies (React, Three.js, Vite).

**Live View**: [AI Studio App Link](https://ai.studio/apps/drive/1eXvcOBjdQdBaRFaF7ZI320-JaVgZQvHD)

### Project Goals

1. **Visual Fidelity**: Recreate the distinctive geometric, isometric aesthetic of Monument Valley
2. **Interactive Experience**: Implement character movement and environmental interaction
3. **Animation Excellence**: Develop smooth, meaningful animations (water flow, character movement)
4. **Performance**: Maintain 60 FPS on modern browsers with complex 3D scenes
5. **Maintainability**: Provide clean, well-documented code for future enhancements

## Key Features

### Core Mechanics
- **3D Isometric Rendering**: Custom isometric projection using Three.js
- **Interactive Level Design**: Multiple explorable levels with puzzles and pathways
- **Water System**: Animated water with directional flow and cascading mechanics
- **Character Movement**: Smooth character locomotion through levels
- **Visual Polish**: Emissive materials, strategic lighting, and atmospheric effects

### Current Implementation Status
- Level One (primary focus) - In development
- Water flow animations - Implemented with synchronization
- Character model and movement - Basic implementation
- UI overlays - Settings and interaction controls
- Responsive design - Works on desktop and mobile

## Project Structure

```
monument-valley-demo/
├── public/                      # Static assets
│   ├── models/                  # 3D models (GLTF/GLB)
│   └── ...
├── components/                  # React components
│   ├── Scene/                   # 3D scene setup
│   │   ├── LevelOne.tsx         # Main level implementation
│   │   ├── BuildingBlocks.tsx   # Reusable 3D building blocks
│   │   ├── Light.tsx            # Lighting setup
│   │   └── Camera.tsx           # Camera configuration
│   ├── UI/                      # User interface
│   │   ├── SettingsPanel.tsx    # Settings controls
│   │   ├── ObjectInfo.tsx       # Object information display
│   │   └── CameraControl.tsx    # Camera interaction
│   ├── Viewport.tsx             # Canvas and rendering container
│   └── App.tsx                  # Main app component
├── styles/                      # CSS styling
│   ├── main.css                 # Global styles
│   └── components.css           # Component-specific styles
├── utils/                       # Utility functions
│   ├── themeColors.ts           # Color palette and theming
│   ├── geometryHelpers.ts       # Geometry calculations
│   └── ...
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies and scripts
├── .env.local                   # API keys (local only)
└── README.md                    # Setup instructions
```

## Key Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| React | UI framework and state management | 18.x |
| Three.js | 3D graphics and rendering | r150+ |
| Vite | Build tool and dev server | 4.x+ |
| TypeScript | Type-safe JavaScript | 5.x |
| Tailwind CSS | Utility-first styling | 3.x |
| Vitest | Unit testing framework | 1.x |

## Important Files and Entry Points

### Main Application Files
- **`App.tsx`**: Root component, orchestrates scene and UI
- **`Viewport.tsx`**: Canvas container and rendering setup
- **`LevelOne.tsx`**: Primary level implementation with 3D objects
- **`BuildingBlocks.tsx`**: Reusable 3D components (Path, WaterBlock, WaterfallBlock, etc.)

### Configuration
- **`vite.config.ts`**: Build tool configuration
- **`tsconfig.json`**: TypeScript compilation settings
- **`package.json`**: Dependencies and build scripts
- **`.env.local`**: Environment variables (API keys - not committed)

### Styling and Theme
- **`themeColors.ts`**: Centralized color palette and theme configuration
- **`styles/main.css`**: Global CSS variables and base styles
- **`Tailwind Config`**: Embedded in `vite.config.ts`

### Utilities
- **`geometryHelpers.ts`**: Isometric projection and geometry calculations
- **Helper functions**: Throughout components for animations and state management

## Running the Application

### Development Setup
```bash
# Install dependencies
npm install

# Set API key (if needed)
echo "VITE_GEMINI_API_KEY=your_key_here" > .env.local

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Server
- Local URL: `http://localhost:5173`
- Hot module replacement enabled for fast development
- Source maps for debugging

## Color Palette

The project uses a curated set of colors defined in `themeColors.ts`:

- **Primary Colors**: Earth tones (brick, tan, sand)
- **Accent Colors**: Selective bright colors for water and special elements
- **Neutral Colors**: Grays and blacks for contrast and hierarchy
- **Special Colors**: Emissive materials for glowing effects (water, light sources)

## Critical Concepts

### Isometric Rendering
The application uses custom isometric projection rather than built-in Three.js cameras. This creates the distinctive visual style but requires careful coordinate system management.

**Key Points**:
- Z-axis typically represents "height" in isometric space
- X and Y axes represent horizontal plane
- Coordinate transformations are used for proper positioning

### Water Animation System
Water flows directionally with synchronized animation speeds. Components include:
- **FlowDirection**: Texture offset calculation based on direction vector `[x, y]`
- **Animation Speed**: Controls how fast texture scrolls (typically 1.5-1.8)
- **Emissive Properties**: Water glows with color and intensity

### Building Blocks Pattern
Reusable components for constructing the level:
- **Path**: Directional walkable path with optional water flow
- **WaterBlock**: Single water-animated cube block
- **WaterfallBlock**: Vertical cascading water
- **MovableWrapper**: Container allowing selection and transformation

## Common Development Tasks

### Adding a New Object to the Scene
1. Import necessary components (`Path`, `WaterBlock`, etc.)
2. Create a `MovableWrapper` with unique ID
3. Add the block component with desired properties
4. Register in selection/UI system if needed

### Modifying Water Flow
1. Adjust `flowDirection` prop (e.g., `[0, 1]` or `[0, -1]`)
2. Synchronize animation speeds across related elements
3. Update emissive colors for visual consistency

### Performance Optimization
1. Use `useFrame` wisely - only animate what's visible
2. Geometry instancing for repeated objects
3. LOD (Level of Detail) for distant objects
4. Defer non-critical updates

## State Management

The application uses React's built-in hooks for state:
- **`useState`**: Component-level state (selected objects, camera position)
- **`useRef`**: Direct Three.js object references
- **`useFrame`**: Animation loop from React Three Fiber
- **Context** (planned): For global state (settings, theme)

## Known Issues and Limitations

- **Water Physics**: Simplified animation, not true physics simulation
- **Character Animation**: Basic movement, could be enhanced with skeletal animation
- **Mobile Performance**: Some visual effects may need optimization for mobile
- **Level Count**: Currently one main level (LevelOne); more levels planned

## Testing

### Current Testing Setup
- Vitest for unit testing
- Testing directory: `/tests`
- Focus on utility functions and non-rendering logic

### How to Run Tests
```bash
npm run test          # Run all tests
npm run test:ui       # Run with UI dashboard
npm run test:watch    # Watch mode for development
```

## Building and Deployment

### Build Process
```bash
npm run build         # Creates optimized production build
```

Output: `/dist` directory with minified assets

### Deployment Considerations
- Static site hosting (GitHub Pages, Vercel, Netlify)
- Environment variables for API keys
- Asset optimization for web delivery
- Browser compatibility (modern browsers with WebGL support)

## Related Documentation

- [Architecture Guide](./ARCHITECTURE.md) - System design and component relationships
- [Tech Stack Details](./TECH_STACK.md) - Dependencies and versions
- [Terminology Glossary](./GLOSSARY.md) - Project-specific terms
- [Implementation Guide](../../IMPLEMENTATION_GUIDE.md) - Step-by-step task guides
- [Testing Documentation](../../TESTING_COMPLETE.txt) - Test coverage and results

## Quick Reference

**Starting Development**: `npm install && npm run dev`

**Project Goals**: Visual fidelity, performance, interactivity

**Primary Language**: TypeScript with React hooks

**3D Library**: Three.js with React Three Fiber integration

**Styling**: Tailwind CSS with custom theme colors

**Build Tool**: Vite (fast and modern)

---

**Last Updated**: November 20, 2025
**Relevant**: For all development tasks
**Maintain**: When project structure or goals change

