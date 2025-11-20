# Component Dependency Diagram

Visual representations of component dependencies and data flow.

---

## 1. Component Hierarchy Tree

```
App (Root)
├── showIntro: boolean
├── isExiting: boolean
├── showLevelSelect: boolean
├── mode: 'research' | 'prototype'
├── currentTheme: string
│
├── ThemeProvider (Context)
│   ├── theme: LevelTheme
│   │   ├── palette
│   │   ├── lighting
│   │   ├── atmosphere
│   │   └── name
│   │
│   └── [App Content]
│       ├── IntroScreen (conditional)
│       │   └── Animation overlay
│       │
│       ├── LevelSelect (conditional)
│       │   └── Level picker modal
│       │
│       ├── EnginePreview
│       │   ├── state: isLocked (camera)
│       │   ├── Canvas
│       │   │   ├── IsoCameraRig (if isLocked)
│       │   │   ├── OrbitControls (if !isLocked)
│       │   │   ├── ThemedLighting
│       │   │   │   ├── AmbientLight
│       │   │   │   ├── DirectionalLight
│       │   │   │   └── RimLight (optional)
│       │   │   ├── ThemedFog
│       │   │   └── children: LevelOne
│       │   │       ├── state: selectedIds (Set<string>)
│       │   │       ├── state: objectPositions (Map<string, Vector3>)
│       │   │       │
│       │   │       ├── FloatingParticles
│       │   │       │   └── Particle group (useFrame)
│       │   │       │
│       │   │       ├── AlignmentVisualizer (dev only)
│       │   │       │   └── Debug UI overlay
│       │   │       │
│       │   │       └── MovableWrapper (×12)
│       │   │           ├── id: string
│       │   │           ├── initialPos: [x, y, z]
│       │   │           ├── isSelected: boolean
│       │   │           ├── TransformControls (if isSelected)
│       │   │           ├── Html overlay (position display)
│       │   │           └── children: Block geometry
│       │   │               ├── BaseBlock
│       │   │               ├── WalledBlock
│       │   │               ├── WaterBlock
│       │   │               ├── WaterfallBlock
│       │   │               ├── TowerBlock
│       │   │               ├── DomeCap
│       │   │               ├── ArchBlock
│       │   │               └── Character
│       │   │
│       │   └── UI Overlays
│       │       ├── Level name (theme.name)
│       │       ├── Camera control toggle
│       │       └── Status display
│       │
│       ├── Layout Div (research/prototype mode)
│       │   └── PlannerPanel (if mode === 'research')
│       │       ├── state: researchItems: ResearchItem[]
│       │       ├── state: query: string
│       │       ├── state: isLoading: boolean
│       │       │
│       │       ├── Header section
│       │       │   └── "Architecture & Strategy"
│       │       │
│       │       ├── Scrollable area
│       │       │   └── ResearchCard (×N)
│       │       │       ├── item.category (tab visual)
│       │       │       ├── item.title (heading)
│       │       │       ├── item.content (body)
│       │       │       └── item.codeSnippet (optional)
│       │       │
│       │       └── Fixed input area
│       │           └── Text input + send button
│       │               └── Calls generateResearch()
│       │
│       └── Overlay fog (research mode)
│
└── Header
    ├── Title (fades in/out with mode)
    ├── LEVELS button → setShowLevelSelect(true)
    └── Mode toggle
        ├── Research button
        └── Engine Preview button
```

---

## 2. Data Flow Diagram

### User Interaction Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     User Interactions                           │
└─────────────────────────────────────────────────────────────────┘

Header
  │
  ├─→ "LEVELS" button
  │     └─→ setShowLevelSelect(true)
  │           └─→ LevelSelect overlay appears
  │
  └─→ Mode toggle button
        ├─→ setMode('research')
        │     └─→ Shows: PlannerPanel + fog overlay
        │           └─→ Mode sensitive CSS classes
        │
        └─→ setMode('prototype')
              └─→ Shows: 3D scene with no UI fog
                    └─→ Full engine preview

IntroScreen (on load)
  │
  └─→ "START" button
        └─→ handleStart()
              ├─→ setIsExiting(true)
              │     └─→ Fade out animation
              └─→ setTimeout → setShowIntro(false)
                    └─→ Remove overlay

LevelOne (3D Scene)
  │
  ├─→ Click on block
  │     └─→ handleSelect(id, shiftKey)
  │           ├─→ Single click: Select only this
  │           ├─→ Shift+click: Toggle in multi-select
  │           └─→ Updates: selectedIds state
  │                 └─→ Shows: TransformControls + overlay
  │
  ├─→ Drag selected block
  │     └─→ TransformControls (onObjectChange)
  │           ├─→ Updates: objectPositions map
  │           └─→ Updates: displayPos (for UI overlay)
  │
  └─→ Click empty space
        └─→ setSelectedIds(new Set())
              └─→ Deselect all

AlignmentVisualizer (dev mode)
  │
  └─→ Select exactly 2 blocks
        ├─→ Toggle: setEnabled(true)
        │     └─→ Shows alignment visualization
        │
        └─→ Reads: objectPositions from parent
              └─→ Calculates visual alignment

PlannerPanel
  │
  └─→ Type in input field
        └─→ Press Enter or click send
              ├─→ setIsLoading(true)
              ├─→ Calls: generateResearch(prompt)
              │     └─→ Queries: Gemini API
              ├─→ Creates: new ResearchItem
              ├─→ Prepends: to researchItems array
              └─→ setIsLoading(false)
```

### Theme Data Flow

```
┌─ App.tsx (currentTheme state)
│    │
│    └─→ <ThemeProvider themeId={currentTheme}>
│          │
│          ├─→ const theme = getTheme(currentTheme)
│          │     └─→ themes/levelThemes.ts
│          │           └─→ LEVEL_THEMES[themeId]
│          │
│          └─→ <ThemeContext.Provider value={{ theme }}>
│                │
│                ├─→ Any child component: useTheme()
│                │     ├─→ BuildingBlocks
│                │     │     └─→ theme.palette.brick
│                │     ├─→ EnginePreview
│                │     │     ├─→ theme.lighting.ambient
│                │     │     ├─→ theme.lighting.directional
│                │     │     ├─→ theme.atmosphere.backgroundGradient
│                │     │     └─→ theme.name
│                │     ├─→ LevelOne
│                │     │     └─→ theme.palette.*
│                │     └─→ WaterBlock
│                │           └─→ theme.palette.water
│                │
│                └─→ Header (no theme usage - could add)
│
└─ Future: Add theme selector
     └─→ setCurrentTheme(themeId)
           └─→ Entire app re-renders with new theme
```

---

## 3. Dependency Map by Concern

### 3.1 Scene Components Dependencies

```
EnginePreview (Canvas setup)
├── Depends on:
│   ├── @react-three/fiber (Canvas, useThree)
│   ├── @react-three/drei (OrthographicCamera, OrbitControls)
│   ├── Three.js (THREE namespace)
│   └── ThemeContext (useTheme hook)
│
├── Used by: App
└── Props: showOverlay, children (LevelOne)


BuildingBlocks (Geometry)
├── Depends on:
│   ├── @react-three/fiber (useFrame for WaterBlock)
│   ├── Three.js (BoxGeometry, etc.)
│   ├── React (useMemo, useRef, useLayoutEffect)
│   ├── constants.ts (UNIT)
│   └── ThemeContext (useTheme hook)
│
├── Exported: BaseBlock, WalledBlock, WaterBlock, WaterfallBlock,
│             TowerBlock, DomeCap, ArchBlock, Character
│
└── Used by: LevelOne (via MovableWrapper children)


LevelOne (Level composition)
├── Depends on:
│   ├── React (useState, useRef, useLayoutEffect)
│   ├── @react-three/drei (TransformControls, Html)
│   ├── Three.js (THREE.Vector3, THREE.Group)
│   ├── BuildingBlocks (geometry components)
│   ├── FloatingParticles
│   ├── AlignmentVisualizer (dev only)
│   ├── ThemeContext (useTheme hook)
│   └── MovableWrapper (internal HOC)
│
├── State:
│   ├── selectedIds: Set<string>
│   └── objectPositions: Map<string, Vector3>
│
└── Used by: EnginePreview (as children)


FloatingParticles
├── Depends on:
│   ├── @react-three/fiber (useFrame)
│   └── React (memo)
│
├── Props: count, spread, opacity, speed
└── Used by: LevelOne


AlignmentVisualizer (Dev tool)
├── Depends on:
│   ├── React (useState, useEffect, useRef)
│   ├── @react-three/fiber (useThree hook)
│   ├── @react-three/drei (Html)
│   ├── Three.js (Vector3, Camera, etc.)
│   └── import.meta.env.DEV
│
├── Props: selectedIds, objectPositions
├── Dev guard: Returns null if !isDevMode
└── Used by: LevelOne
```

### 3.2 UI Components Dependencies

```
Header
├── Depends on:
│   ├── React
│   └── types.ts (ViewMode type)
│
├── Props: activeMode, setMode, onOpenLevels
└── Used by: App


PlannerPanel
├── Depends on:
│   ├── React (useState)
│   ├── types.ts (ResearchItem, ResearchCategory)
│   ├── ResearchCard (child component)
│   ├── geminiService.ts (generateResearch)
│   └── constants.ts (INITIAL_RESEARCH)
│
├── State:
│   ├── researchItems: ResearchItem[]
│   ├── query: string
│   └── isLoading: boolean
│
├── Exports: ResearchCard children
└── Used by: App (conditional)


ResearchCard
├── Depends on:
│   ├── React
│   └── types.ts (ResearchItem)
│
├── Props: item (ResearchItem)
└── Used by: PlannerPanel


IntroScreen
├── Depends on:
│   ├── React
│   └── CSS animations
│
├── Props: onStart, isExiting
└── Used by: App (conditional)


LevelSelect
├── Depends on:
│   ├── React
│   └── Tailwind CSS
│
├── Props: isOpen, onClose
└── Used by: App (conditional)
```

### 3.3 Context & Provider Dependencies

```
ThemeContext
├── Depends on:
│   ├── React (createContext, useContext)
│   ├── themes/types.ts (LevelTheme)
│   └── themes/levelThemes.ts (getTheme)
│
├── Exports: ThemeProvider, useTheme hook
└── Used by: App (wraps entire tree)
            All scene components (useTheme)


Theme System
├── types.ts (LevelTheme interface)
│   ├── palette: { [key: string]: string }
│   ├── lighting: { ambient, directional, rim? }
│   └── atmosphere: { backgroundGradient, particles, fog? }
│
├── levelThemes.ts (LEVEL_THEMES, getTheme)
│   ├── Depends on: types.ts
│   └── Defines: theGarden, desertTemple, etc.
│
└── ThemeContext.tsx
    ├── Depends on: types.ts, levelThemes.ts
    └── Provides: useTheme hook
```

### 3.4 Utility & Service Dependencies

```
isometricAlignment.ts (Math utilities)
├── Depends on:
│   └── Three.js (Vector3, Camera)
│
├── Exports:
│   ├── projectToScreen()
│   ├── getScreenSpaceDistance()
│   ├── checkVisualAlignment()
│   ├── calculateVisualMidpoint() [core algorithm]
│   ├── ndcToPixels()
│   └── analyzeAlignmentError()
│
└── Used by: AlignmentVisualizer (indirectly)
            Could be used for level design tools


geminiService.ts
├── Depends on:
│   ├── Google Gemini API
│   └── constants.ts (GEMINI_SYSTEM_INSTRUCTION)
│
├── Exports: generateResearch(prompt)
└── Used by: PlannerPanel


constants.ts
├── Exports:
│   ├── INITIAL_RESEARCH: ResearchItem[]
│   ├── GEMINI_SYSTEM_INSTRUCTION: string
│   └── UNIT: number
│
└── Used by: PlannerPanel, geminiService, BuildingBlocks


types.ts
├── Exports:
│   ├── ResearchCategory enum
│   ├── ResearchItem interface
│   ├── GameConfig interface
│   └── ViewMode type
│
└── Used by: Multiple components (research, header, etc.)
```

---

## 4. State Management Architecture

### 4.1 App-Level State

```
App.tsx
│
└─→ State (5 separate useState calls)
    │
    ├─→ showIntro (boolean)
    │   Lifecycle: true → isExiting=true → false
    │   Controls: IntroScreen visibility
    │
    ├─→ isExiting (boolean)
    │   Lifecycle: false → true → back to false
    │   Controls: Fade-out animation
    │
    ├─→ showLevelSelect (boolean)
    │   Trigger: Header "LEVELS" button
    │   Controls: LevelSelect modal visibility
    │
    ├─→ mode: 'research' | 'prototype'
    │   Trigger: Header mode toggle buttons
    │   Effects:
    │   ├─→ Shows/hides: PlannerPanel
    │   ├─→ Shows/hides: Fog overlay
    │   └─→ Triggers: Header title fade
    │
    └─→ currentTheme (string)
        Default: 'theGarden'
        Effects:
        ├─→ ThemeProvider themeId prop
        ├─→ All child components get new theme via useTheme()
        └─→ Full app re-theme
```

**Improvement Opportunity:**
```typescript
// Current:
const [showIntro, setShowIntro] = useState(true);
const [isExiting, setIsExiting] = useState(false);
const [showLevelSelect, setShowLevelSelect] = useState(false);
const [mode, setMode] = useState('research');
const [currentTheme, setCurrentTheme] = useState('theGarden');

// Proposed:
interface AppState {
  ui: {
    showIntro: boolean;
    isExiting: boolean;
    showLevelSelect: boolean;
  };
  viewport: {
    mode: 'research' | 'prototype';
  };
  theme: {
    currentTheme: string;
  };
}

const [appState, setAppState] = useState<AppState>({...});
const updateUI = (updates) => setAppState(s => ({ ...s, ui: {...s.ui, ...updates} }));
```

### 4.2 Component-Level State

```
LevelOne
├─→ selectedIds: Set<string>
│   Trigger: Click on blocks
│   Effects:
│   ├─→ Shows TransformControls
│   ├─→ Shows position overlay
│   └─→ Triggers: AlignmentVisualizer
│
└─→ objectPositions: Map<string, Vector3>
    Updated: Every drag/transform
    Used by: Position UI, Alignment calculations
    Accessible to: AlignmentVisualizer


EnginePreview
└─→ isLocked: boolean
    Trigger: Camera lock toggle button
    Effects:
    ├─→ Switches: IsoCameraRig ↔ OrbitControls
    └─→ Updates: Status display


PlannerPanel
├─→ researchItems: ResearchItem[]
│   Initial: INITIAL_RESEARCH from constants
│   Updated: Prepend new items from AI
│
├─→ query: string
│   Updated: onChange handler
│   Cleared: After submit
│
└─→ isLoading: boolean
    Trigger: generateResearch call
    Used: Disable button, show spinner


AlignmentVisualizer
└─→ enabled: boolean
    Trigger: Toggle button
    Effects:
    └─→ Shows/hides visualization overlay


Header
└─→ No state (stateless presentational)
```

---

## 5. Import Dependency Matrix

### Most Central Files (High Reuse)

```
types.ts
├── Used by: 8+ files
└── Exports: Core type definitions


constants.ts
├── Used by: PlannerPanel, geminiService, BuildingBlocks
└── Exports: Research data, AI instruction, UNIT


ThemeContext.tsx
├── Used by: 6+ scene components
└── Exports: useTheme hook


themes/levelThemes.ts
├── Used by: ThemeContext
└── Exports: LEVEL_THEMES, getTheme()


Three.js (external)
├── Used by: All scene components
└── Reason: Core 3D library
```

### Mid-Tier Files (Moderate Reuse)

```
EnginePreview.tsx
├── Used by: App
└── Exports: Canvas wrapper

BuildingBlocks.tsx
├── Used by: LevelOne
└── Exports: 8 block types

LevelOne.tsx
├── Used by: EnginePreview
└── Exports: Level composition
```

### Leaf Files (Low Reuse)

```
Header.tsx → Used only by App
IntroScreen.tsx → Used only by App
LevelSelect.tsx → Used only by App
PlannerPanel.tsx → Used only by App
ResearchCard.tsx → Used only by PlannerPanel
FloatingParticles.tsx → Used only by LevelOne
AlignmentVisualizer.tsx → Used only by LevelOne
```

---

## 6. Circular Dependency Check

✅ **No circular dependencies detected**

Path structure is acyclic:
- Leaves import from Core files
- Core files don't import Leaves
- Context used via hooks (proper dependency injection)

```
Direction of dependencies:
App
├→ Leaves (Header, IntroScreen, etc.)
├→ Mid-tier (EnginePreview, LevelOne)
├→ Core (ThemeContext, ThemeProvider)
│   └→ themes/ (ThemeTypes, levelThemes)
│       └→ Three.js (external)
└→ Root level (types.ts, constants.ts)
    └→ Three.js (external)
```

All dependencies flow **downward** (no upward references).

---

## 7. Component Coupling Score

### Loose Coupling (0-2 dependencies on internal modules)

- Header (1: types)
- IntroScreen (0)
- LevelSelect (0)
- FloatingParticles (0)
- ResearchCard (1: types)
- ThemedFog (1: useThree, useTheme)
- ThemedLighting (1: useTheme)
- IsoCameraRig (1: useThree)

### Moderate Coupling (3-5 dependencies)

- EnginePreview (4: canvas, drei, Three.js, useTheme)
- BuildingBlocks (5: react-three/fiber, Three.js, useMemo, constants, theme)
- PlannerPanel (5: React, types, ResearchCard, geminiService, constants)

### Higher Coupling (6+ dependencies)

- LevelOne (8+: BuildingBlocks, MovableWrapper, FloatingParticles, Alignment, theme, etc.)
  - *Acceptable*: Level composition inherently complex
  - *Refactor opportunity*: Extract MovableWrapper

- App (6+: all components, types, ThemeProvider, etc.)
  - *Acceptable*: Root orchestrator
  - *Could improve*: Group state into single object

---

## 8. Recommendations Map

```
Components to Extract:
┌─────────────────────────────────────────────┐
│ Current LevelOne.tsx (450+ lines)           │
├─────────────────────────────────────────────┤
│ Extract To:                                 │
├─────────────────────────────────────────────┤
│ 1. MovableWrapper.tsx (~150 lines)          │
│    └─ Reusable for other movable objects    │
│                                             │
│ 2. PathBuilder.tsx (~100 lines)             │
│    └─ Reusable for generating block paths   │
│                                             │
│ 3. LevelOne.tsx reduced (~200 lines)        │
│    └─ Just composition and state            │
└─────────────────────────────────────────────┘

Utilities to Extract:
┌─────────────────────────────────────────────┐
│ BuildingBlocks.tsx wall calculations        │
├─────────────────────────────────────────────┤
│ New: utils/wallGeometry.ts                  │
├─────────────────────────────────────────────┤
│ Extracted Functions:                        │
│ ├─ calculateEndWallMetrics()                │
│ ├─ calculateWallOffset()                    │
│ └─ getWallThickness()                       │
└─────────────────────────────────────────────┘

Hooks to Create:
┌─────────────────────────────────────────────┐
│ Custom React Hooks for patterns             │
├─────────────────────────────────────────────┤
│ hooks/useSelection.ts                       │
│ └─ Manages: Set<string> selection logic     │
│                                             │
│ hooks/usePositionTracking.ts                │
│ └─ Manages: Map<string, Vector3> positions  │
│                                             │
│ hooks/useLevelState.ts                      │
│ └─ Combines selection + positions           │
└─────────────────────────────────────────────┘
```

