# Monument Valley Demo - AI Assistant Context

A Three.js/React isometric experience inspired by Monument Valley, featuring impossible geometry, water flow mechanics, and an interactive research system.

---

## Project Overview

**What Is It?**
Monument Valley Demo is an interactive 3D web experience that recreates the aesthetic and mechanics of the Monument Valley mobile game. Players explore hand-crafted isometric environments with impossible architecture, manipulate objects, and discover the relationship between geometric alignment and visual perception.

**Tech Stack:**
- **Frontend**: React 19 + TypeScript
- **3D Rendering**: Three.js via React Three Fiber
- **Tooling**: Vite (build), Vitest (testing)
- **AI Integration**: Google Gemini API (research suggestions)
- **Styling**: CSS-in-JS with theme system

**Target Users:**
- Game design enthusiasts
- 3D web developers
- Players who loved Monument Valley
- Researchers studying impossible geometry

---

## Architecture Summary

### High-Level Structure

The codebase follows a **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────┐
│      React UI Layer                 │
│  (Header, LevelSelect, Research)    │
├─────────────────────────────────────┤
│   Three.js / R3F Scene Layer        │
│  (EnginePreview, LevelOne, Blocks)  │
├─────────────────────────────────────┤
│    Logic & Configuration            │
│  (Utilities, Constants, Themes)     │
└─────────────────────────────────────┘
```

### Directory Structure

```
monument-valley-demo/
├── components/
│   ├── Scene/              # 3D rendering (EnginePreview, LevelOne, BuildingBlocks)
│   ├── UI/                 # React UI (Header, IntroScreen, LevelSelect)
│   ├── Research/           # Content panels (PlannerPanel, ResearchCard)
│   └── Dev/                # Dev tools (AlignmentVisualizer, Debug)
├── contexts/               # React Context (ThemeContext)
├── themes/                 # Theme definitions & color palettes
├── utils/                  # Math & utilities (isometricAlignment, geminiService)
├── constants.ts            # Configuration constants
├── types.ts                # Global TypeScript types
└── App.tsx                 # Root component & state orchestration
```

### Key Components by Responsibility

**3D Scene (components/Scene/)**
- `EnginePreview.tsx` - Canvas setup, camera, lighting, fog
- `LevelOne.tsx` - Level layout, object management (450+ lines)
- `BuildingBlocks.tsx` - Block primitives & animated water
- `FloatingParticles.tsx` - Atmospheric particle effects

**UI Layer (components/UI/)**
- `Header.tsx` - Navigation, mode switching
- `IntroScreen.tsx` - Splash screen
- `LevelSelect.tsx` - Level selection modal

**Content (components/Research/)**
- `PlannerPanel.tsx` - Research sidebar
- `ResearchCard.tsx` - Individual research item display

**State (contexts/)**
- `ThemeContext.tsx` - Global theme provider

---

## Isometric Rendering & Impossible Geometry

### Core Concept

The project uses **isometric projection** (45° rotation, 30° pitch) to create the appearance of impossible architecture. Objects are positioned in 3D world space but appear aligned in screen space in ways that violate euclidean geometry.

### Isometric Camera Setup

Located in `EnginePreview.tsx`:
```typescript
// 45° horizontal rotation
const cameraDistance = 80;
const angle = Math.PI / 4; // 45°
camera.position.set(
  cameraDistance * Math.cos(angle),
  30,  // Height
  cameraDistance * Math.sin(angle)
);
camera.lookAt(new THREE.Vector3(10, 0, 10));
```

### Alignment Calculations

`utils/isometricAlignment.ts` provides the math for translating between:
- **World space**: 3D XYZ coordinates used internally
- **Screen space**: 2D projected position visible to player

Key functions:
- `worldToScreen()` - Convert 3D coords to 2D screen projection
- `getIsometricDistance()` - Measure perceived distance
- `calculateAlignment()` - Determine if objects align visually

### Important: Not True Isometric

The camera uses **perspective projection** (not orthographic), creating slight visual distortion that enhances the "impossible" feel. Objects farther from camera appear smaller, adding depth.

---

## Water Mechanics & Flow System

### Water Block Types

**WaterBlock** (`BuildingBlocks.tsx`)
- Animated surface with flowing water texture
- Configurable flow direction: `flowDirection: [x, y]`
- Connected to water level and wave animations
- Emissive glow for visual consistency

**WaterfallBlock**
- Vertical water element
- Animated texture with gravity-like downward flow
- Customizable height and appearance

### Water Flow Direction

Flow direction is a 2D vector `[u, v]` that controls texture animation:
- `[0, 1]` - Flow along +V direction
- `[0, -1]` - Flow along -V direction
- `[1, 0]` - Flow along +U direction

Affects texture offset animation in the `useFrame` hook.

### Recent Implementation: Water Connection System

Three progressive approaches to connect Beam-A (horizontal water) to Waterfall (vertical water):

1. **Approach 1 (Quick, 15 min)**: Sync animation speeds + flow direction
2. **Approach 2 (Medium, 4-6 hrs)**: Add particle bridge system
3. **Approach 3 (Complete, 8-12 hrs)**: Full architectural connection with aqueducts

See `IMPLEMENTATION_GUIDE.md` for detailed step-by-step instructions.

---

## Key Patterns & Conventions

### Component Structure

Components follow **atomic design** principles:

**Atoms** (Primitives)
- `BaseBlock` - Simple cube
- `WaterBlock`, `WaterfallBlock` - Animated elements
- `TowerBlock`, `DomeCap`, `ArchBlock` - Structural pieces

**Molecules** (Composite)
- `MovableWrapper` - Selectable + draggable wrapper for objects
- `Path` - Helper component for block sequences

**Organisms** (Full Features)
- `LevelOne` - Complete level layout
- `PlannerPanel` - Research system

### MovableWrapper Pattern

Most 3D objects in the scene are wrapped in `MovableWrapper`, which provides:
- Selection handling (`onSelect` callback)
- Transform controls for manipulation
- Position tracking & display overlay
- Copy-to-clipboard position functionality

```typescript
<MovableWrapper
  id="Beam-A"
  initialPos={[2.40, 0.00, -1.00]}
  isSelected={selectedIds.has('Beam-A')}
  onSelect={handleSelect}
  uiOffsetIndex={getUiIndex('Beam-A')}
>
  {/* Child components: blocks, paths, water elements */}
</MovableWrapper>
```

### Theme System

Themes are applied globally via React Context:

```typescript
const { theme } = useTheme();
// theme.palette.brick, theme.palette.water, etc.
// theme.lighting, theme.fog settings
```

Theme definitions in `themes/levelThemes.ts` - easy to add new color schemes.

### State Management

**Global (App.tsx)**
- `showIntro`, `isExiting`, `showLevelSelect` - UI visibility
- `mode` - 'research' | 'prototype'
- `currentTheme` - Active theme ID

**Context (ThemeContext)**
- `theme` - Current theme object

**Component-Level (useState)**
- `LevelOne`: `selectedIds`, `objectPositions`
- `PlannerPanel`: `researchItems`, `query`, `isLoading`
- `AlignmentVisualizer`: `enabled`

---

## Development Conventions

### TypeScript & Type Safety

- Full TypeScript coverage, no `any` types
- Interfaces for all component props
- Type definitions colocated near usage
- Global types in `types.ts` for reuse

### File Naming

- Components: PascalCase (e.g., `LevelOne.tsx`)
- Utilities: camelCase (e.g., `isometricAlignment.ts`)
- Contexts: PascalCase with "Context" suffix (e.g., `ThemeContext.tsx`)

### Code Style

- React hooks for state (useState, useRef, useFrame)
- Custom hooks pattern (useTheme)
- Memoization for expensive geometries
- Comment documentation on complex algorithms

### Testing

- Framework: Vitest (alongside Jest-compatible API)
- Location: `utils/__tests__/` for unit tests
- Run: `npm run test` or `npm run test:ui`

---

## Common Development Tasks

### Adding a New Block Type

1. **Create block component in `BuildingBlocks.tsx`**:
```typescript
export const NewBlock: React.FC<BlockProps> = ({ position, ...props }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={theme.palette.custom} />
    </mesh>
  );
};
```

2. **Add to `LevelOne.tsx`** inside a `MovableWrapper`
3. **Update `types.ts`** if new props needed

### Adjusting Object Position

Objects use world space coordinates `[x, y, z]`. To reposition:

1. Open browser DevTools (F12)
2. Click object in viewport to select it
3. Use transform controls (arrows/rotate/scale)
4. Click "COPY POS" button in overlay
5. Paste position into `initialPos` prop

Position reference points:
- `[0, 0, 0]` - Bottom-left corner of base
- `[10, 0, 10]` - Approximate world center
- Y-axis = vertical height
- X-axis = left-right (from camera view)
- Z-axis = forward-backward (from camera view)

### Creating a New Level

1. Create new component `components/Scene/LevelTwo.tsx`
2. Follow `LevelOne.tsx` pattern with MovableWrapper + blocks
3. Add to `App.tsx` as conditional render
4. Create theme in `themes/levelThemes.ts`

### Modifying Water Flow

In `BuildingBlocks.tsx`:
- `WaterBlock`: Adjust `speed` in `useFrame` hook (line ~266)
- Change `flowDirection` prop to `[0, -1]` to reverse flow
- Adjust `emissiveIntensity` for glow brightness

---

## Key Files Reference

### Essential Files

| File | Purpose |
|------|---------|
| `components/Scene/EnginePreview.tsx` | Canvas setup, camera, lights |
| `components/Scene/LevelOne.tsx` | Level layout & object management |
| `components/Scene/BuildingBlocks.tsx` | Block geometry primitives |
| `contexts/ThemeContext.tsx` | Global theme state |
| `themes/levelThemes.ts` | Theme color definitions |
| `utils/isometricAlignment.ts` | Camera math & alignment |
| `constants.ts` | Configuration values |
| `types.ts` | Global TypeScript definitions |

### Documentation Files

| File | Content |
|------|---------|
| `IMPLEMENTATION_GUIDE.md` | Water connection system details |
| `QUICK_REFERENCE.md` | Quick lookup for solutions |
| `docs/architecture/ARCHITECTURE_SUMMARY.md` | Component architecture review |
| `docs/architecture/analysis_component_architecture.md` | Detailed architectural analysis |
| `WATER_BRIDGE_DESIGN.md` | Water bridge implementation reference |

### Development Tools

| File | Purpose |
|------|---------|
| `components/Dev/AlignmentVisualizer.tsx` | Debug positioning (dev mode) |
| `package.json` | Dependencies & scripts |
| `tsconfig.json` | TypeScript configuration |
| `vite.config.ts` | Build configuration |

---

## Running the Project

### Setup
```bash
cd monument-valley-demo
npm install
```

### Development
```bash
npm run dev
# Opens at http://localhost:5173
```

### Testing
```bash
npm run test        # Watch mode
npm run test:run    # Single run
npm run test:ui     # UI dashboard
npm run test:coverage  # Coverage report
```

### Building
```bash
npm run build       # Production build
npm run preview     # Local preview of build
```

### Environment
Create `.env.local` with:
```
VITE_GEMINI_API_KEY=your_api_key_here
```

---

## Architecture Highlights

### Strengths (8.5/10)

✅ **Excellent separation of concerns** - 3D scene isolated from UI
✅ **Clean component hierarchy** - Atoms → molecules → organisms
✅ **Type safety throughout** - Full TypeScript, no `any` types
✅ **Smart performance** - GPU detection, memoization, frame optimization
✅ **Professional documentation** - Code comments, research data, clear naming
✅ **Good DX** - Dev tools gated properly, alignment visualizer, position overlays
✅ **No circular dependencies** - Clean acyclic dependency graph

### Identified Improvements

⚠️ **LevelOne.tsx is large** (450+ lines) - Could extract MovableWrapper and PathBuilder
⚠️ **Wall calculations duplicated** - Could centralize in utility function
⚠️ **App state fragmented** - 5 separate useState could be consolidated
⚠️ **PlannerPanel lacks error handling** - Should handle API failures gracefully

All issues are refinement-level. No blocking technical debt.

---

## When to Use AI Tools

**Use `.ai/` directory** for:
- Research notes on Monument Valley design
- Technical investigation results
- Architecture analysis documents
- Implementation planning documents

**Keep in `docs/`** for:
- Architecture summaries (general audience)
- Component analysis (for team reference)
- API documentation
- User guides

**Keep in project root** for:
- CLAUDE.md (this file - overall context)
- Implementation guides (IMPLEMENTATION_GUIDE.md)
- Quick references (QUICK_REFERENCE.md)
- Water mechanics documentation

---

## Links to Detailed Docs

### Architecture & Design
- **Component Architecture**: `/docs/architecture/ARCHITECTURE_SUMMARY.md`
- **Detailed Analysis**: `/docs/architecture/analysis_component_architecture.md`
- **Dependency Diagram**: `/docs/architecture/component_dependency_diagram.md`

### Implementation Guides
- **Water Connection System**: `/IMPLEMENTATION_GUIDE.md` (3 progressive approaches)
- **Quick Reference**: `/QUICK_REFERENCE.md` (fast lookup)
- **Water Bridge Details**: `/WATER_BRIDGE_DESIGN.md`

### Research & Investigation
- **Isometric Alignment Research**: `/claudedocs/isometric_alignment_research.md`
- **3D Web Standards**: `/claudedocs/research_3d_web_standards.md`
- **Alignment Visualization**: `/ALIGNMENT_VISUALIZER_FIX.md`

### Testing & Validation
- **Test Summary**: `/TESTING_COMPLETE.txt`
- **Validation Report**: `/monument-valley-demo/VALIDATION_REPORT.md`

---

## Quick Troubleshooting

**"Build fails with missing dependencies"**
Run `npm install` in `monument-valley-demo/` directory

**"Objects appear in wrong position"**
Check isometric camera in EnginePreview.tsx - verify angle is `Math.PI / 4`

**"Water doesn't animate"**
Ensure `flowDirection` prop is set and speed value in useFrame > 0

**"Theme not applying"**
Verify ThemeContext provider wraps app in `App.tsx`

**"Performance drops"**
Check FloatingParticles count, reduce object count, or enable GPU detection in EnginePreview

---

## Project Status

**Current Version**: 0.0.0 (Prototype/Demo)

**Latest Work**:
- Water connection system (3 implementation approaches)
- Water flow direction & speed synchronization
- Particle bridge foundation
- Alignment visualizer for positioning

**Maintained**: Active development, regularly updated with new features

**Architecture Maturity**: Production-ready with optimization opportunities

---

## Next Steps for Development

### Immediate (1-2 sprints)
1. Extract `MovableWrapper` to own component (reduce LevelOne size)
2. Implement error handling in PlannerPanel
3. Create custom hooks for selection state
4. Add E2E tests for user workflows

### Short Term (Next sprint)
5. Complete water connection system (Approach 2-3)
6. Extract PathBuilder component
7. Consolidate App state management
8. Improve AlignmentVisualizer with actual visual aids

### Medium Term
9. Add additional levels with different themes
10. Performance monitoring dashboard
11. Component library / Storybook setup
12. Expand research system with more AI features

---

## Getting Help

**For Architecture Questions**: See `/docs/architecture/` directory
**For Implementation Details**: Check `/IMPLEMENTATION_GUIDE.md`
**For Isometric Math**: Review `utils/isometricAlignment.ts`
**For Water System**: Read `/WATER_BRIDGE_DESIGN.md`
**For Component Patterns**: Study `LevelOne.tsx` and `BuildingBlocks.tsx`

---

**Last Updated**: 2025-11-20
**Scope**: Monument Valley Demo - Complete project context for AI assistants
**Audience**: Developers, AI assistants, team members
**Maintenance**: Update when architecture changes or new major features added
