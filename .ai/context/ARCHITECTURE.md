# Architecture: Monument Valley Demo

## System Overview

The Monument Valley Demo follows a layered architecture with clear separation between rendering, interaction, and UI concerns.

```
┌─────────────────────────────────────────────────────────┐
│                    React Application                    │
│                      (App.tsx)                          │
├──────────────────────┬──────────────────────────────────┤
│   UI Layer           │   Viewport/Rendering Layer       │
│ ┌────────────────┐   │  ┌──────────────────────────┐   │
│ │ SettingsPanel  │   │  │  Viewport.tsx            │   │
│ │ ObjectInfo     │   │  │ (Canvas & R3F Setup)     │   │
│ │ CameraControl  │   │  │  ┌────────────────────┐  │   │
│ └────────────────┘   │  │  │   Scene Component   │  │   │
│                      │  │  │ ┌────────────────┐  │  │   │
│   State Bridge       │  │  │ │  LevelOne.tsx  │  │  │   │
│   (Callbacks &       │  │  │ │ ┌────────────┐ │  │  │   │
│    Props)            │  │  │ │ │Building    │ │  │  │   │
│                      │  │  │ │ │Blocks      │ │  │  │   │
│                      │  │  │ │ └────────────┘ │  │  │   │
│                      │  │  │ │ Camera, Lights│  │  │   │
│                      │  │  │ └────────────────┘  │  │   │
│                      │  │  └────────────────────┘  │   │
│                      │  └──────────────────────────┘   │
├──────────────────────┴──────────────────────────────────┤
│          Utility & Support Layer                        │
│  ┌──────────────────┐   ┌──────────────────────────┐   │
│  │ Theme Colors     │   │ Geometry Helpers         │   │
│  │ (themeColors.ts) │   │ (geometryHelpers.ts)     │   │
│  └──────────────────┘   └──────────────────────────┘   │
├──────────────────────────────────────────────────────────┤
│          Three.js Rendering Engine                      │
│          React Three Fiber Integration                  │
└──────────────────────────────────────────────────────────┘
```

## Component Architecture

### App.tsx (Root Component)

**Responsibilities**:
- Manage application-level state (selected objects, settings)
- Coordinate communication between UI and viewport
- Handle global event management

**State Management**:
```typescript
// Main state tracked in App.tsx
const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
const [settings, setSettings] = useState<AppSettings>({...});
const [cameraPosition, setCameraPosition] = useState<[x, y, z]>([...]);
```

**Key Props**:
- Passes `selectedIds`, `handleSelect` to viewport
- Passes settings to UI components
- Provides update callbacks to child components

### Viewport.tsx (Rendering Container)

**Responsibilities**:
- Set up React Three Fiber canvas
- Initialize Three.js scene, camera, and renderer
- Manage rendering loop and performance
- Coordinate with Scene component

**Structure**:
```typescript
<Canvas>
  <Scene
    selectedIds={selectedIds}
    onSelect={handleSelect}
    settings={settings}
  />
  <Effects />  // Post-processing if needed
</Canvas>
```

**Key Features**:
- Configurable pixel ratio for performance
- Resize handling for responsive design
- Frame rate monitoring

### Scene Component (Main 3D Scene)

**Responsibilities**:
- Compose the complete 3D environment
- Manage lights and camera configuration
- Coordinate all 3D objects and animations

**Children**:
- `LevelOne.tsx` - Primary level with game objects
- `Light.tsx` - Lighting setup and configuration
- `Camera.tsx` - Isometric camera system

### LevelOne.tsx (Level Implementation)

**Responsibilities**:
- Define all 3D objects and their positions
- Create the game level structure
- Handle object selection and interaction
- Manage level-specific state and animations

**Key Components Used**:
- `MovableWrapper` - Wraps selectable 3D objects
- `Path` - Walkable paths with optional water
- `WaterBlock` - Single water-animated blocks
- `WaterfallBlock` - Vertical cascading water
- `Geometry` - Static geometry pieces

**Selection System**:
```typescript
const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

const handleSelect = (id: string, isMultiple: boolean = false) => {
  // Toggle selection or add to selection set
  const newSelection = new Set(selectedIds);
  newSelection.has(id) ? newSelection.delete(id) : newSelection.add(id);
  setSelectedIds(newSelection);
};
```

### BuildingBlocks.tsx (Reusable 3D Components)

**Core Components**:

#### Path Component
Represents a directional walkable path with optional water flow.

**Props**:
```typescript
interface PathProps {
  start: [x: number, y: number, z: number];
  length: number;
  axis: 'x' | 'y' | 'z' | 'negX' | 'negY' | 'negZ';
  color: string;
  type: 'stone' | 'water' | 'special';
  flowDirection?: [x: number, y: number];  // For water paths
  customBlocks?: Record<number, BlockConfig>;
}
```

**Animation**:
- Water texture animates based on `flowDirection` and `animationSpeed`
- Blocks can have custom wall configurations

#### WaterBlock Component
Single cube block with water animation.

**Features**:
- Animated water texture with directional flow
- Emissive material for glow effect
- Customizable speed and color

#### WaterfallBlock Component
Vertical cascading water effect.

**Features**:
- Vertical texture scrolling
- Synchronized with horizontal water flow
- Gradient emissive for waterfall effect

#### MovableWrapper Component
Container for selectable and transformable objects.

**Props**:
```typescript
interface MovableWrapperProps {
  id: string;
  initialPos: [x, y, z];
  isSelected: boolean;
  onSelect: (id: string) => void;
  uiOffsetIndex?: number;
  children: React.ReactNode;
}
```

**Features**:
- Visual highlight when selected
- Position management
- UI offset positioning for labels

## Data Flow

### Selection Flow

```
User clicks 3D object
    ↓
MovableWrapper detects click
    ↓
Calls onSelect() callback
    ↓
Propagates to LevelOne → App.tsx
    ↓
App.tsx updates selectedIds state
    ↓
Re-render with updated selectedIds
    ↓
Selected object highlights visually
    ↓
UI panels update to show object info
```

### Animation Flow

```
React Three Fiber useFrame() hook
    ↓
Each frame (60 FPS):
  - Calculate elapsed time
  - Update water texture offsets
  - Update emissive intensities
  - Update particle systems
    ↓
requestAnimationFrame callback
    ↓
WebGL context renders scene
```

### Settings Flow

```
User adjusts setting in SettingsPanel
    ↓
Callback passed to UI component
    ↓
App.tsx state updates (setSettings)
    ↓
Viewport re-renders with new settings
    ↓
3D objects apply new property values
```

## Rendering Pipeline

### Scene Setup Order

1. **Camera Initialization** (Camera.tsx)
   - Isometric projection setup
   - Position and target configuration
   - Aspect ratio and FOV calculation

2. **Lighting Setup** (Light.tsx)
   - Ambient light for base illumination
   - Directional light for shadows and depth
   - Area lights for emissive effects

3. **Level Construction** (LevelOne.tsx)
   - Load 3D models and geometry
   - Position all game objects
   - Set up materials and textures

4. **Interactive Elements** (MovableWrapper)
   - Enable selection logic
   - Set up highlight materials
   - Configure interaction handlers

### Material System

**Standard Material Types**:
- **Stone/Structure**: Non-metallic, matte finish
- **Water**: Animated texture, emissive glow
- **Special**: Custom materials with unique properties

**Material Properties**:
- Color from `themeColors.ts` palette
- Emissive color and intensity for glow
- Roughness and metalness for surface properties
- Texture maps for detail

## Performance Optimizations

### Rendering Optimization

**Level of Detail (LOD)**:
- Distant objects use simplified geometry
- Near objects show full detail
- Dynamically adjustable based on FPS

**Frustum Culling**:
- Only render objects within camera view
- Automatically handled by Three.js
- Reduces draw calls

**Instancing**:
- Repeated objects share geometry
- Reduce memory and draw calls
- Particularly useful for building blocks

### Animation Optimization

**Selective Animation**:
- Only animate visible/selected objects
- Skip animation updates for hidden elements
- Use delta time for frame-rate independence

**GPU-Based Calculations**:
- Shader-based animations where possible
- Offload calculations from CPU to GPU
- Reduce JavaScript execution time

## State Management Details

### Component-Level State
Used in individual components for local state:
```typescript
const [isHovered, setIsHovered] = useState(false);
const [animationTime, setAnimationTime] = useState(0);
```

### Application-Level State
In App.tsx for cross-component communication:
```typescript
const [selectedIds, setSelectedIds] = useState<Set<string>>();
const [cameraPosition, setCameraPosition] = useState<[x, y, z]>();
const [settings, setSettings] = useState<AppSettings>();
```

### Reference Management
Using refs for direct Three.js object access:
```typescript
const meshRef = useRef<THREE.Mesh>(null);
const groupRef = useRef<THREE.Group>(null);
useFrame(() => {
  if (meshRef.current) {
    meshRef.current.rotation.y += 0.01;
  }
});
```

## Key Architectural Decisions

### Why React Three Fiber?
- Declarative 3D rendering model matching React paradigm
- Seamless integration with React state and lifecycle
- Extensive ecosystem and community support
- Easy component composition for 3D objects

### Why Isometric Projection?
- Distinctive visual style matching Monument Valley
- Simplifies depth perception without perspective distortion
- Maintains architectural clarity and precision
- Easier character movement along discrete paths

### Why TypeScript?
- Strong type safety for complex 3D geometry operations
- Easier refactoring of large component trees
- Better IDE support and documentation
- Catches errors at compile-time

### Component Composition Pattern
Building blocks pattern allows:
- Reusable 3D components (Path, WaterBlock, etc.)
- Declarative level design (more readable)
- Easy modification and iteration
- Separation of concerns

## Extension Points

### Adding New Block Types
1. Create new component in `BuildingBlocks.tsx`
2. Define props interface
3. Implement geometry and materials
4. Export and use in `LevelOne.tsx`

### Adding New Features
1. **New Visual Effect**: Add shader or material in `BuildingBlocks.tsx`
2. **New Interaction**: Extend selection logic in `LevelOne.tsx`
3. **New Level**: Create new level component file
4. **New Setting**: Add to `AppSettings` interface and UI

### Integrating New Libraries
1. Check compatibility with React Three Fiber
2. Test with existing components
3. Document integration approach
4. Update Tech Stack documentation

## Related Documentation

- [Project Context](./PROJECT_CONTEXT.md) - Overview and file structure
- [Tech Stack](./TECH_STACK.md) - Dependencies and versions
- [Common Tasks](../patterns/COMMON_TASKS.md) - Implementation procedures
- [Code Patterns](../patterns/CODE_PATTERNS.md) - Reusable solutions

---

**Last Updated**: November 20, 2025
**Scope**: Technical architecture and system design
**Audience**: Developers implementing features or refactoring code

