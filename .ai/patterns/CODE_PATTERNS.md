# Code Patterns: Monument Valley Demo

This document provides reusable code patterns and solutions commonly used in the Monument Valley Demo project.

## React Patterns

### Component Structure

**Basic React Component**:
```typescript
import React, { useState, useRef } from 'react';
import * as THREE from 'three';

interface ComponentProps {
  position: [x: number, y: number, z: number];
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function MyComponent({ position, isSelected, onSelect }: ComponentProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      onClick={() => onSelect('my-component')}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={isSelected ? '#ffff00' : '#888888'}
        emissive={isHovered ? '#ff0000' : '#000000'}
      />
    </mesh>
  );
}
```

### State Management with Callbacks

**Pattern**: Parent component manages state, passes callbacks to children

```typescript
// In parent (App.tsx or LevelOne.tsx)
function ParentComponent() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSelect = (id: string, isMultiple: boolean = false) => {
    const newSelection = new Set(selectedIds);
    if (isMultiple) {
      // Add to selection
      newSelection.has(id) ? newSelection.delete(id) : newSelection.add(id);
    } else {
      // Single selection
      newSelection.clear();
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  };

  return (
    <Child
      selectedIds={selectedIds}
      onSelect={handleSelect}
    />
  );
}

// In child component
interface ChildProps {
  selectedIds: Set<string>;
  onSelect: (id: string, isMultiple: boolean) => void;
}

function Child({ selectedIds, onSelect }: ChildProps) {
  return (
    <div
      onClick={(e) => {
        const isMultiple = e.ctrlKey || e.metaKey;
        onSelect('my-id', isMultiple);
      }}
    >
      {selectedIds.has('my-id') && <span>Selected</span>}
    </div>
  );
}
```

### Using Context for Global State

**Pattern**: For data needed by many components (settings, theme)

```typescript
import { createContext, useContext, ReactNode } from 'react';

interface AppContextType {
  settings: AppSettings;
  updateSetting: (key: string, value: unknown) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  const updateSetting = (key: string, value: unknown) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <AppContext.Provider value={{ settings, updateSetting }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}

// Usage in component
function MyComponent() {
  const { settings, updateSetting } = useAppContext();
  return (
    <button onClick={() => updateSetting('quality', 'high')}>
      Quality: {settings.quality}
    </button>
  );
}
```

---

## Three.js Patterns

### Creating a Simple Mesh

**Pattern**: Geometry + Material + Mesh

```typescript
import * as THREE from 'three';

// In component
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: '#888888' })
);
scene.add(mesh);

// Or in React Three Fiber
function Box() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#888888" />
    </mesh>
  );
}
```

### Animated Material

**Pattern**: Update material properties in useFrame

```typescript
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

function AnimatedMesh() {
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      // Animate emissive intensity (glow)
      const intensity = 2 + Math.sin(clock.elapsedTime) * 1;
      materialRef.current.emissiveIntensity = intensity;

      // Animate texture offset (scrolling)
      if (materialRef.current.map) {
        materialRef.current.map.offset.x += 0.01;
      }
    }
  });

  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        ref={materialRef}
        color="#ff0000"
        emissive="#ff0000"
      />
    </mesh>
  );
}
```

### Texture Loading and Animation

**Pattern**: Load texture, animate offset for flow effect

```typescript
import { useTextureLoader } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

function WaterBlock() {
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const texture = useTextureLoader('/textures/water.png');

  useFrame((state, delta) => {
    if (materialRef.current?.map) {
      const speed = 1.5;
      const flowDir = [0, -1];  // Flow downward

      // Update texture offset based on flow direction and speed
      materialRef.current.map.offset.x += flowDir[0] * speed * delta;
      materialRef.current.map.offset.y += flowDir[1] * speed * delta;
    }
  });

  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        ref={materialRef}
        map={texture}
        color="#4a90e2"
        emissive="#6bb6ff"
        emissiveIntensity={2}
      />
    </mesh>
  );
}
```

### Geometry Batching with InstancedMesh

**Pattern**: Render many identical objects efficiently

```typescript
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

function InstancedBlocks() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 100;

  // Initialize instance positions
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;      // x
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;  // y
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;  // z
  }

  useFrame(() => {
    if (meshRef.current) {
      // Update instance transforms if needed
      for (let i = 0; i < count; i++) {
        const matrix = new THREE.Matrix4();
        matrix.setPosition(
          positions[i * 3],
          positions[i * 3 + 1],
          positions[i * 3 + 2]
        );
        meshRef.current.setMatrixAt(i, matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: '#888888' }),
      count
    ]} />
  );
}
```

### Camera and Projection

**Pattern**: Custom isometric projection

```typescript
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';

function IsometricCamera() {
  const { camera } = useThree();

  useEffect(() => {
    // Configure orthographic camera for isometric view
    const scale = 10;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspect = width / height;

    camera.left = -scale * aspect;
    camera.right = scale * aspect;
    camera.top = scale;
    camera.bottom = -scale;
    camera.near = 0.1;
    camera.far = 1000;

    // Position camera for isometric angle
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);

    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
}
```

---

## Data Transformation Patterns

### Coordinate System Conversion

**Pattern**: Convert between different coordinate systems

```typescript
// World coordinates to isometric screen coordinates
function worldToIsometric(x: number, y: number, z: number): [number, number] {
  const isoX = x - z;
  const isoY = (x + z) * 0.5 - y;
  return [isoX, isoY];
}

// Isometric screen coordinates back to world
function isometricToWorld(isoX: number, isoY: number, y: number): [number, number, number] {
  const x = (isoX + 2 * isoY) / 3;
  const z = (2 * isoY - isoX) / 3;
  return [x, y, z];
}

// Usage
const [screenX, screenY] = worldToIsometric(5, 10, 3);
const [worldX, worldY, worldZ] = isometricToWorld(screenX, screenY, 10);
```

### Color Palette Management

**Pattern**: Centralized theme colors

```typescript
// In themeColors.ts
export const theme = {
  palette: {
    brick: '#c85a54',
    sand: '#e8d4a4',
    tan: '#d4a574',
    darkGray: '#3a3a3a',
    lightGray: '#888888',
    waterColor: '#4a90e2',
    waterEmissive: '#6bb6ff',
    waterEmissiveIntensity: 2,
  },
  typography: {
    fontSize: 14,
    fontFamily: 'Arial, sans-serif',
  },
};

// Usage in components
function MyComponent() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={theme.palette.brick}
        emissive={theme.palette.darkGray}
      />
    </mesh>
  );
}
```

### Configuration Objects

**Pattern**: Centralize component configuration

```typescript
interface BlockConfig {
  walls: [top: boolean, bottom: boolean];
  endWalls: [start: boolean, end: boolean];
  customColor?: string;
  hasWater?: boolean;
}

const defaultBlockConfig: BlockConfig = {
  walls: [true, true],
  endWalls: [true, true],
};

// Usage
<Path
  customBlocks={{
    0: { endWalls: [false, false] },      // No walls at start
    11: { walls: [false, true] },          // Custom wall config
    5: { customColor: theme.palette.sand } // Custom color
  }}
/>
```

---

## Performance Patterns

### Lazy Component Loading

**Pattern**: Load components only when needed

```typescript
import { lazy, Suspense } from 'react';

const HeavyLevel = lazy(() => import('./HeavyLevel'));
const DetailsPanel = lazy(() => import('./DetailsPanel'));

function App() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <HeavyLevel />
      </Suspense>

      {showDetails && (
        <Suspense fallback={<div>Loading details...</div>}>
          <DetailsPanel />
        </Suspense>
      )}
    </>
  );
}
```

### Memoization for Expensive Components

**Pattern**: Prevent unnecessary re-renders

```typescript
import { memo, useMemo } from 'react';

// Memoize component to prevent re-renders
const MemoizedBlock = memo(function Block({ position, color }: BlockProps) {
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
});

// Memoize computed values
function ParentComponent() {
  const complexValue = useMemo(() => {
    // Expensive calculation
    return calculateComplexValue();
  }, [dependency1, dependency2]); // Only recalculate when dependencies change

  return <MemoizedBlock value={complexValue} />;
}
```

### Selective Animation Updates

**Pattern**: Only animate what's visible or necessary

```typescript
function OptimizedAnimation() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isVisible, setIsVisible] = useState(true);

  useFrame(({ clock }, delta) => {
    // Skip animation if not visible
    if (!isVisible || !meshRef.current) return;

    // Only update position (cheaper than other operations)
    meshRef.current.position.y = Math.sin(clock.elapsedTime) * 0.5;
  });

  return (
    <group onVisibilityChange={(visible) => setIsVisible(visible)}>
      <mesh ref={meshRef}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial />
      </mesh>
    </group>
  );
}
```

---

## Event Handling Patterns

### Click and Selection

**Pattern**: Handle 3D object selection

```typescript
import { useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

function SelectableObject({ id, onSelect }: { id: string; onSelect: (id: string) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (event: THREE.Event) => {
    // Prevent bubbling to parent objects
    event.stopPropagation();
    onSelect(id);
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    document.body.style.cursor = 'default';
  };

  return (
    <mesh
      ref={meshRef}
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={isHovered ? '#ffff00' : '#888888'}
        emissive={isHovered ? '#ff0000' : '#000000'}
      />
    </mesh>
  );
}
```

### Keyboard Input

**Pattern**: Handle keyboard events for camera or actions

```typescript
import { useEffect } from 'react';

function KeyboardControls() {
  const keysPressed = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keysPressed.current[event.key.toLowerCase()] = true;
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysPressed.current[event.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keysPressed.current;
}

// Usage
function CameraController() {
  const keys = useKeyboardControls();

  useFrame(() => {
    if (keys['arrowup']) camera.position.z += 0.1;
    if (keys['arrowdown']) camera.position.z -= 0.1;
  });

  return null;
}
```

---

## Utility Patterns

### Type-Safe Props Definition

**Pattern**: Use TypeScript interfaces for component props

```typescript
interface PathProps {
  start: [x: number, y: number, z: number];
  length: number;
  axis: 'x' | 'y' | 'z' | 'negX' | 'negY' | 'negZ';
  color: string;
  type: 'stone' | 'water' | 'special';
  flowDirection?: [x: number, y: number];
  customBlocks?: Record<number, BlockConfig>;
}

export function Path({
  start,
  length,
  axis,
  color,
  type,
  flowDirection,
  customBlocks
}: PathProps) {
  // Implementation with full type safety
}
```

### Discriminated Union Types

**Pattern**: Type-safe handling of different element types

```typescript
type BlockElement =
  | { type: 'stone'; color: string }
  | { type: 'water'; flowDirection: [number, number]; speed: number }
  | { type: 'special'; customMaterial: THREE.Material };

function renderBlock(block: BlockElement) {
  switch (block.type) {
    case 'stone':
      return <StoneBlock color={block.color} />;
    case 'water':
      return <WaterBlock flowDirection={block.flowDirection} speed={block.speed} />;
    case 'special':
      return <SpecialBlock material={block.customMaterial} />;
  }
}
```

### Custom Hooks

**Pattern**: Extract reusable logic into hooks

```typescript
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

// Reusable hook for animation tracking
function useAnimationTracker(ref: React.RefObject<THREE.Object3D>) {
  const frameCountRef = useRef(0);

  useFrame(() => {
    if (ref.current) {
      frameCountRef.current++;
      // Track animation progress
    }
  });

  return frameCountRef.current;
}

// Usage
function MyComponent() {
  const meshRef = useRef<THREE.Mesh>(null);
  const frameCount = useAnimationTracker(meshRef);

  return <mesh ref={meshRef} />;
}
```

---

## Testing Patterns

### Testing Component Rendering

**Pattern**: Test Three.js component rendering

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should render without errors', () => {
    render(
      <Canvas>
        <MyComponent position={[0, 0, 0]} color="#888888" />
      </Canvas>
    );
    // Component renders successfully if no errors
  });
});
```

### Testing Utility Functions

**Pattern**: Test pure functions (geometry, colors, etc.)

```typescript
import { describe, it, expect } from 'vitest';
import { worldToIsometric } from './geometry';

describe('worldToIsometric', () => {
  it('should convert world coordinates correctly', () => {
    const result = worldToIsometric(5, 10, 3);
    expect(result).toEqual([2, 9.5]);
  });

  it('should handle negative coordinates', () => {
    const result = worldToIsometric(-5, 0, -3);
    expect(result).toEqual([-2, -4]);
  });
});
```

---

## Related Documentation

- [Project Context](../context/PROJECT_CONTEXT.md) - Project overview
- [Architecture](../context/ARCHITECTURE.md) - System design
- [Common Tasks](./COMMON_TASKS.md) - Implementation procedures
- [Testing Patterns](./TESTING_PATTERNS.md) - Testing strategies

---

**Last Updated**: November 20, 2025
**Scope**: Reusable code patterns and solutions
**Audience**: Developers writing new code or refactoring existing code

