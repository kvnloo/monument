# Water Flow Connection: Step-by-Step Implementation Guide

## Quick Start (Approach 1: 15 minutes)

### Step 1: Change Beam-A Flow Direction

**File**: `/home/kvn/workspace/monument/monument-valley-demo/components/Scene/LevelOne.tsx`

**Location**: Lines 319-340 (Beam-A MovableWrapper)

**Current Code**:
```typescript
{/* Beam A: The Long Diagonal (Neg Z) -> Flows to Positive Z (Away from waterfall?) */}
{/* Previous was [0, -1]. Reversed to [0, 1]. */}
<MovableWrapper
  id="Beam-A"
  initialPos={[2.40, 0.00, -1.00]}
  isSelected={selectedIds.has('Beam-A')}
  onSelect={handleSelect}
  uiOffsetIndex={getUiIndex('Beam-A')}
>
    <Path
      start={[0, 0, 0]}
      length={12}
      axis="negZ"
      color={theme.palette.brick}
      type="water"
      flowDirection={[0, 1]}  // <-- CHANGE THIS LINE
      customBlocks={{
        0: { endWalls: [false, false] },
        11: { walls: [false, true], endWalls: [true, false] }
      }}
    />
</MovableWrapper>
```

**Change To**:
```typescript
flowDirection={[0, -1]}  // Reverse the flow direction
```

**Why**: This makes the water texture animation appear to flow toward the waterfall instead of away from it. In the isometric view, this creates the visual impression that water is "rushing toward" the waterfall.

---

### Step 2: Synchronize Water Animation Speeds

**File**: `/home/kvn/workspace/monument/monument-valley-demo/components/Scene/BuildingBlocks.tsx`

#### Part A: WaterBlock Speed (For Beam-A)

**Location**: Lines 262-272 in `useFrame` hook

**Current Code**:
```typescript
useFrame((state, delta) => {
    if (waterRef.current) {
        waterRef.current.position.y = waterBaseHeight + Math.sin(state.clock.elapsedTime * 3 + position[0] * 0.5 + position[2] * 0.5) * 0.02;

        const speed = 1.5;  // <-- CHANGE THIS VALUE
        // Adjust offset based on flow direction
        // Texture mapping: U is typically X-aligned in box mapping for top face.
        textureInstance.offset.x += flowDirection[0] * speed * delta;
        textureInstance.offset.y -= flowDirection[1] * speed * delta;
    }
});
```

**Change To**:
```typescript
const speed = 1.8;  // Increased from 1.5 for faster, more dynamic flow
```

**Why**: Faster animation speed makes the water appear more "active" and energetic, reinforcing the impression of flow toward the waterfall.

---

#### Part B: WaterfallBlock Speed (For Waterfall)

**Location**: Lines 390-392 in `useFrame` hook

**Current Code**:
```typescript
useFrame((state, delta) => {
    textureInstance.offset.y += 1.5 * delta;  // <-- CHANGE THIS VALUE
});
```

**Change To**:
```typescript
useFrame((state, delta) => {
    textureInstance.offset.y += 1.8 * delta;  // Increased from 1.5 to match Beam-A
});
```

**Why**: Matching the speeds creates visual harmony—observers perceive the two water elements as part of the same system.

---

### Step 3: Synchronize Emissive Properties

**File**: `/home/kvn/workspace/monument/monument-valley-demo/components/Scene/BuildingBlocks.tsx`

**Location**: Lines 398-403 (WaterfallBlock material)

**Current Code**:
```typescript
<meshStandardMaterial
    color="white"
    emissive={finalColor}
    emissiveIntensity={0.2}  // <-- CHANGE THIS VALUE
    map={textureInstance}
/>
```

**Change To**:
```typescript
<meshStandardMaterial
    color="white"
    emissive={finalColor}
    emissiveIntensity={0.28}  // Increased from 0.2 to match Beam-A intensity
    map={textureInstance}
/>
```

**Why**: The emissive glow creates the visual impression of unified material properties. Matching intensities suggests these are the same "substance"—water from the same source.

---

### Verification Checklist for Approach 1

After making these three changes:

```
Code Changes:
├─ [ ] Beam-A flowDirection: [0, 1] → [0, -1]
├─ [ ] WaterBlock speed: 1.5 → 1.8
├─ [ ] WaterfallBlock speed: 1.5 → 1.8
└─ [ ] WaterfallBlock emissiveIntensity: 0.2 → 0.28

Testing:
├─ [ ] Build compiles without errors
├─ [ ] App loads in browser
├─ [ ] Beam-A water texture visibly flows toward camera (or at diagonal)
├─ [ ] Waterfall water falls smoothly
├─ [ ] Both animations have same speed rhythm
├─ [ ] Material glow appears consistent
└─ [ ] Camera angle shows elements in visual alignment

Visual Test:
├─ [ ] Rotate camera—does connection still feel right?
├─ [ ] At default isometric angle—do elements feel "connected"?
├─ [ ] Can other people perceive the water "flow path"?
└─ [ ] Does the effect feel intentional (not accidental)?
```

---

## Intermediate Implementation (Approach 2: 4-6 hours)

### Prerequisites
- Complete Approach 1 first
- Understand Three.js particle systems
- Comfortable with vector math (lerp, sin/cos for arcs)

### Create New Component: WaterParticleBridge.tsx

**Location**: Create new file at `/home/kvn/workspace/monument/monument-valley-demo/components/Scene/WaterParticleBridge.tsx`

```typescript
import React, { useState, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { UNIT } from '../../constants';
import { useTheme } from '../../contexts';

interface Particle {
  id: number;
  spawnTime: number;
  lifetime: number;
}

interface WaterParticleBridgeProps {
  startPos: [number, number, number];  // End of Beam-A
  endPos: [number, number, number];    // Top of Waterfall
  particleCount: number;               // 30-50 recommended
  emissionRate: number;                // milliseconds between particles
  arcHeight: number;                   // max height above start/end
}

/**
 * Creates a visual "bridge" of water particles flowing from Beam-A to Waterfall.
 * Each particle follows a parabolic arc, creating the illusion of jumping water.
 */
export const WaterParticleBridge: React.FC<WaterParticleBridgeProps> = ({
  startPos,
  endPos,
  particleCount = 40,
  emissionRate = 100,  // milliseconds
  arcHeight = 3,
}) => {
  const { theme } = useTheme();
  const meshesRef = useRef<THREE.InstancedMesh>(null);
  const particlesRef = useRef<Particle[]>([]);
  const nextIdRef = useRef(0);
  const lastEmissionRef = useRef(Date.now());

  // Precompute start and end positions as vectors
  const start = useMemo(() => new THREE.Vector3(...startPos), [startPos]);
  const end = useMemo(() => new THREE.Vector3(...endPos), [endPos]);
  const distance = useMemo(() => start.distanceTo(end), [start, end]);

  // Initialize particle system
  const geometry = useMemo(() => new THREE.SphereGeometry(0.08, 8, 8), []);
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: '#D0F0F0',
      emissive: theme.palette.water,
      emissiveIntensity: 0.4,
      roughness: 0.4,
      metalness: 0.6,
      transparent: true,
      opacity: 0.8,
    }),
    [theme.palette.water]
  );

  // Update particles
  useFrame((state, delta) => {
    const now = Date.now();

    // Emit new particles
    if (now - lastEmissionRef.current > emissionRate) {
      if (particlesRef.current.length < particleCount) {
        particlesRef.current.push({
          id: nextIdRef.current++,
          spawnTime: state.clock.elapsedTime,
          lifetime: 2.5,  // seconds
        });
      }
      lastEmissionRef.current = now;
    }

    // Update particle positions
    particlesRef.current = particlesRef.current.filter((particle) => {
      const elapsed = state.clock.elapsedTime - particle.spawnTime;
      if (elapsed > particle.lifetime) {
        return false;  // Remove dead particles
      }

      const t = elapsed / particle.lifetime;  // 0 to 1 over lifetime

      // Linear interpolation along path
      const position = start.clone().lerp(end, t);

      // Add parabolic arc (sine wave for smooth up/down)
      const arcY = Math.sin(t * Math.PI) * arcHeight;
      position.y += arcY;

      // Fade out as particle falls
      const opacity = 0.8 * (1 - t);

      // Update mesh instance (if using instanced mesh)
      // For now, just update position for visual effect
      // Note: Full implementation would use InstancedMesh for performance

      return true;  // Keep particle
    });

    // For now, render individual meshes (not instanced)
    // This is simpler but less performant—upgrade to InstancedMesh if needed
  });

  return (
    <group>
      {particlesRef.current.map((particle) => {
        const elapsed = state.clock.getElapsedTime() - particle.spawnTime;
        const t = Math.max(0, Math.min(1, elapsed / particle.lifetime));

        const position = start.clone().lerp(end, t);
        const arcY = Math.sin(t * Math.PI) * arcHeight;
        position.y += arcY;

        const opacity = 0.8 * (1 - t);

        return (
          <mesh key={particle.id} position={[position.x, position.y, position.z]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial
              color="#D0F0F0"
              emissive={theme.palette.water}
              emissiveIntensity={0.4}
              roughness={0.4}
              metalness={0.6}
              transparent
              opacity={opacity}
            />
          </mesh>
        );
      })}
    </group>
  );
};
```

### Add WaterParticleBridge to LevelOne.tsx

**Location**: Add after the Waterfall MovableWrapper (around line 350)

```typescript
<MovableWrapper
  id="Water-Bridge"
  initialPos={[0, 0, 0]}  // Bridge doesn't move as single unit
  isSelected={false}      // Not directly selectable
  onSelect={() => {}}     // No selection
>
  <WaterParticleBridge
    startPos={[14.4, 0, -13]}        // End of Beam-A
    endPos={[20.64, 17.88, 5.44]}    // Top of Waterfall
    particleCount={40}
    emissionRate={100}
    arcHeight={3}
  />
</MovableWrapper>
```

### Performance Optimization (InstancedMesh Version)

For better performance with many particles, upgrade to InstancedMesh:

```typescript
// Replace the rendering section with:
const meshRef = useRef<THREE.InstancedMesh>(null);

useFrame((state, delta) => {
  // Particle logic same as above...

  if (meshRef.current && particlesRef.current.length > 0) {
    // Update instanced mesh positions
    const dummy = new THREE.Object3D();
    particlesRef.current.forEach((particle, index) => {
      const elapsed = state.clock.elapsedTime - particle.spawnTime;
      const t = elapsed / particle.lifetime;

      const position = start.clone().lerp(end, t);
      const arcY = Math.sin(t * Math.PI) * arcHeight;
      position.y += arcY;

      dummy.position.copy(position);
      dummy.scale.setScalar(1 - (t * 0.3));  // Slight scale fade
      dummy.updateMatrix();

      meshRef.current!.setMatrixAt(index, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }
});

return (
  <instancedMesh
    ref={meshRef}
    args={[geometry, material, particleCount]}
    position={[0, 0, 0]}
  />
);
```

---

## Advanced Implementation (Approach 3: 8-12 hours)

### Create Intermediate Platform Components

#### Component 1: WaterAqueduct.tsx

```typescript
import React from 'react';
import { WaterBlock } from './BuildingBlocks';

interface WaterAqueductProps {
  position: [number, number, number];
  length: number;
  axis: 'x' | 'z';
  flowDirection: [number, number];
  wallConfig?: {
    startWall: [boolean, boolean];
    endWall: [boolean, boolean];
  };
}

export const WaterAqueduct: React.FC<WaterAqueductProps> = ({
  position,
  length,
  axis,
  flowDirection,
  wallConfig = {
    startWall: [true, true],
    endWall: [true, true],
  },
}) => {
  const blocks = [];

  for (let i = 0; i < length; i++) {
    const pos: [number, number, number] = [...position];
    if (axis === 'x') pos[0] += i;
    if (axis === 'z') pos[2] += i;

    const walls = i === 0 ? wallConfig.startWall :
                  i === length - 1 ? wallConfig.endWall :
                  [true, true];

    const endWalls = [i === 0, i === length - 1];

    blocks.push(
      <WaterBlock
        key={`aqueduct-${i}`}
        position={pos}
        axis={axis}
        walls={walls}
        endWalls={endWalls}
        flowDirection={flowDirection}
      />
    );
  }

  return <group>{blocks}</group>;
};
```

#### Add to LevelOne.tsx (Between Beam-A and Waterfall)

```typescript
// After Beam-A:
<MovableWrapper
  id="Aqueduct-1"
  initialPos={[14.4, 4, -5]}
  isSelected={selectedIds.has('Aqueduct-1')}
  onSelect={handleSelect}
  uiOffsetIndex={getUiIndex('Aqueduct-1')}
>
  <WaterAqueduct
    position={[0, 0, 0]}
    length={8}
    axis="z"
    flowDirection={[0, 1]}
  />
</MovableWrapper>

<MovableWrapper
  id="Aqueduct-2"
  initialPos={[17.5, 10, 0]}
  isSelected={selectedIds.has('Aqueduct-2')}
  onSelect={handleSelect}
  uiOffsetIndex={getUiIndex('Aqueduct-2')}
>
  <WaterAqueduct
    position={[0, 0, 0]}
    length={4}
    axis="x"
    flowDirection={[1, 0]}
  />
</MovableWrapper>

<MovableWrapper
  id="Aqueduct-3"
  initialPos={[20.64, 14, 5]}
  isSelected={selectedIds.has('Aqueduct-3')}
  onSelect={handleSelect}
  uiOffsetIndex={getUiIndex('Aqueduct-3')}
>
  <WaterAqueduct
    position={[0, 0, 0]}
    length={2}
    axis="z"
    flowDirection={[0, 1]}
  />
</MovableWrapper>
```

---

## Testing & Debugging

### Test Approach 1 (Sync Animation)

```bash
# Build and run
npm run dev

# In browser console, verify:
# 1. Open DevTools → Camera view
# 2. Rotate to isometric angle (45°, 30°)
# 3. Observe Beam-A—water should flow toward waterfall
# 4. Observe animation speeds match
# 5. Check emissive glow consistency
```

### Test Approach 2 (Particle Bridge)

```javascript
// In browser console:
// Get frame rate to ensure particles don't cause drops
let fps = 0;
let lastTime = performance.now();
function measureFPS() {
  const now = performance.now();
  fps = 1000 / (now - lastTime);
  lastTime = now;
  if (fps < 30) console.warn('FPS too low:', fps);
  requestAnimationFrame(measureFPS);
}
measureFPS();

// Visual checks:
// - Particles spawn at Beam-A end
// - Arc path is smooth
// - Particles reach waterfall within 2.5 seconds
// - No memory leaks (FPS stable over time)
```

### Test Approach 3 (Bridge Chain)

```javascript
// Verify each aqueduct section:
// 1. Water flows through each section
// 2. No spillage over edges
// 3. Smooth transition between sections
// 4. All textures animate in sync
// 5. Architecture looks intentional
```

---

## Troubleshooting

### Problem: Water flows away instead of toward
**Solution**: Check flowDirection values. Beam-A should be [0, -1], not [0, 1]

### Problem: Animations don't look synchronized
**Solution**: Ensure both speed values are exactly 1.8, and check delta time isn't being modified elsewhere

### Problem: Emissive doesn't look right
**Solution**: Verify theme.palette.water and theme.palette.waterfall are defined. Increase intensity if effect too subtle.

### Problem: Particles don't spawn
**Solution**: Check startPos is set to Beam-A end position [14.4, 0, -13], and emissionRate isn't 0

### Problem: Frame rate drops
**Solution**: Reduce particleCount from 40 to 20-30, or implement InstancedMesh optimization

---

## Complete Implementation Checklist

```
APPROACH 1 - Sync Animation:
├─ Step 1: Change Beam-A flowDirection
│  ├─ [ ] File: LevelOne.tsx, Line 334
│  ├─ [ ] Change [0, 1] to [0, -1]
│  └─ [ ] Verify change saves
├─ Step 2: Update WaterBlock speed
│  ├─ [ ] File: BuildingBlocks.tsx, Line 266
│  ├─ [ ] Change 1.5 to 1.8
│  └─ [ ] Verify change saves
├─ Step 3: Update WaterfallBlock speed
│  ├─ [ ] File: BuildingBlocks.tsx, Line 391
│  ├─ [ ] Change 1.5 to 1.8
│  └─ [ ] Verify change saves
├─ Step 4: Sync emissive intensity
│  ├─ [ ] File: BuildingBlocks.tsx, Line 401
│  ├─ [ ] Change 0.2 to 0.28
│  └─ [ ] Verify change saves
├─ Step 5: Build and test
│  ├─ [ ] npm run dev
│  ├─ [ ] Open browser to localhost
│  ├─ [ ] Verify no build errors
│  └─ [ ] Visual test: Water flows toward waterfall
└─ Status: Complete!

APPROACH 2 - Particle Bridge:
├─ All Approach 1 steps first
├─ Step 1: Create WaterParticleBridge.tsx
│  ├─ [ ] Create new file in components/Scene/
│  ├─ [ ] Copy particle system code
│  └─ [ ] Verify syntax
├─ Step 2: Add to LevelOne.tsx
│  ├─ [ ] Import component
│  ├─ [ ] Add MovableWrapper with bridge
│  └─ [ ] Set correct positions
├─ Step 3: Test
│  ├─ [ ] npm run dev
│  ├─ [ ] Particles spawn and flow
│  ├─ [ ] No FPS drop
│  └─ [ ] Reaches waterfall destination
└─ Status: Complete!

APPROACH 3 - Bridge Chain:
├─ All Approach 1 & 2 steps first
├─ Step 1: Create WaterAqueduct.tsx
│  ├─ [ ] Create new file
│  ├─ [ ] Copy aqueduct component code
│  └─ [ ] Verify imports
├─ Step 2: Add intermediate platforms
│  ├─ [ ] Add Aqueduct-1 to LevelOne
│  ├─ [ ] Add Aqueduct-2 to LevelOne
│  ├─ [ ] Add Aqueduct-3 to LevelOne
│  └─ [ ] Verify positions
├─ Step 3: Synchronize all flows
│  ├─ [ ] All use same speed (1.8)
│  ├─ [ ] All use matching emissive
│  ├─ [ ] All flow directions create narrative
│  └─ [ ] Verify animations sync
├─ Step 4: Add supporting architecture
│  ├─ [ ] Add pillars between platforms
│  ├─ [ ] Add arch elements (if desired)
│  └─ [ ] Ensure structural appearance
├─ Step 5: Test
│  ├─ [ ] npm run dev
│  ├─ [ ] Water flows through all sections
│  ├─ [ ] No visual gaps
│  ├─ [ ] Architecture feels intentional
│  └─ [ ] FPS stable
└─ Status: Complete!
```

---

## File Summary

### Files to Modify (Approach 1)
- `/home/kvn/workspace/monument/monument-valley-demo/components/Scene/LevelOne.tsx` (1 line)
- `/home/kvn/workspace/monument/monument-valley-demo/components/Scene/BuildingBlocks.tsx` (2 lines)

### Files to Create (Approach 2)
- `/home/kvn/workspace/monument/monument-valley-demo/components/Scene/WaterParticleBridge.tsx` (new)

### Files to Create (Approach 3)
- `/home/kvn/workspace/monument/monument-valley-demo/components/Scene/WaterAqueduct.tsx` (new)
- Optional: `/home/kvn/workspace/monument/monument-valley-demo/components/Scene/SupportingArchitecture.tsx` (new)

---

## Quick Reference: Position Values

```
BEAM-A:
├─ World position: [2.40, 0.00, -1.00]
├─ End position (approx): [14.4, 0.00, -13.00]
└─ Water characteristics: Horizontal, flows toward viewer

WATERFALL:
├─ World position: [20.64, 17.88, 5.44]
├─ Top position (for particles): [20.64, 24.88, 5.44]
└─ Water characteristics: Vertical, falls downward

INTERMEDIATE PLATFORMS (Approach 3):
├─ Platform 1: [14.4, 4, -5]
├─ Platform 2: [17.5, 10, 0]
└─ Platform 3: [20.64, 14, 5]

PARTICLE BRIDGE (Approach 2):
├─ Start: [14.4, 0, -13]
└─ End: [20.64, 24.88, 5.44]
```

---

## Expected Outcomes

### After Approach 1
- Water animations synchronized
- Visual suggestion of connection
- Low implementation effort
- Foundation for enhancements

### After Approach 2
- Clear visual path from Beam-A to Waterfall
- Particle effects demonstrate flow
- Impressive visual moment
- Monument Valley aesthetic

### After Approach 3
- Complete architectural narrative
- Water's full journey visible
- Most authentic to game style
- Fully justified system design
