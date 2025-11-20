# Common Tasks: Monument Valley Demo

This document provides step-by-step procedures for frequently performed development tasks.

## Setup and Environment

### Setting Up Development Environment

**Time**: 10 minutes
**Difficulty**: Beginner
**Prerequisites**: Node.js 14.18+, npm or yarn

**Steps**:

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd monument-valley-demo
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create `.env.local` file (if needed for Gemini API)
   ```bash
   echo "VITE_GEMINI_API_KEY=your_key_here" > .env.local
   ```

4. Start development server
   ```bash
   npm run dev
   ```

5. Open browser to `http://localhost:5173`

**Verification**: You should see the Monument Valley 3D scene load in your browser.

**Troubleshooting**:
- If port 5173 is in use, Vite will suggest an alternative port
- Clear `node_modules` and reinstall if you encounter missing dependencies
- Ensure Node.js version is 14.18 or higher: `node --version`

### Installing Dependencies

**Time**: 5 minutes

**Adding a New Package**:

```bash
# For production dependencies
npm install package-name

# For development dependencies
npm install --save-dev package-name

# For a specific version
npm install package-name@1.2.3
```

**After Installing**:
1. Verify it appears in `package.json`
2. Verify it appears in `package-lock.json`
3. Test that your code still works: `npm run dev`
4. Commit both files to git

**Common Packages to Add**:
- UI utility: `npm install clsx`
- Animation helper: `npm install gsap`
- Physics (if needed): `npm install cannon`

---

## Development Workflow

### Running the Development Server

**Time**: 1 minute
**Prerequisites**: Dependencies installed

```bash
npm run dev
```

**What Happens**:
- Vite starts a local development server
- Hot Module Replacement (HMR) enabled—changes auto-reload
- Source maps for debugging
- Open `http://localhost:5173` in your browser

**Stopping the Server**: Press `Ctrl+C` in the terminal

**Port Conflicts**: If port 5173 is in use:
```bash
# Use different port
npm run dev -- --port 3000
```

### Building for Production

**Time**: 30 seconds
**Prerequisites**: No running dev server

```bash
npm run build
```

**What Happens**:
1. TypeScript compilation: Checks for type errors
2. Code bundling: Combines modules into optimized bundles
3. Minification: Reduces file sizes
4. Asset optimization: Compresses images, fonts
5. Creates `/dist` directory with production files

**Checking Build Output**:
```bash
npm run build  # View size information during build
ls -lh dist/   # Check file sizes
```

**Troubleshooting Build Errors**:
1. Fix TypeScript errors shown in output
2. Check for circular imports
3. Ensure all imports use correct file extensions (`.ts`, `.tsx`)
4. Clear cache: `rm -rf dist && npm run build`

### Testing the Production Build Locally

**Time**: 1 minute

```bash
npm run build
npm run preview
```

**What Happens**:
- Builds production version
- Serves it locally at suggested URL
- Allows testing before deployment
- Shows actual performance (no dev optimizations)

**Verification**:
- Load in browser and test functionality
- Check console for errors
- Verify file sizes are reasonable

---

## Code Changes and Debugging

### Making a Code Change

**Workflow**:

1. **Identify what to change**: Which file? Which function?
2. **Make the change**: Edit the TypeScript/React code
3. **Save the file**: File auto-saves in most editors
4. **Watch for HMR**: Browser automatically refreshes (typically within 1-2 seconds)
5. **Verify change**: Check that the result matches your expectation
6. **Check console**: Look for TypeScript errors or warnings

**Common Changes**:

**Changing a color**:
```typescript
// In themeColors.ts, find and update:
palette: {
  brick: '#color-code',  // Change to new color
}
```

**Changing animation speed**:
```typescript
// In BuildingBlocks.tsx, find speed variable:
const speed = 1.5;  // Change to 1.8
```

**Adding a new object**:
```typescript
// In LevelOne.tsx, add to render:
<MovableWrapper id="new-object" initialPos={[x, y, z]} ...>
  <Path ... />
</MovableWrapper>
```

### Debugging Common Issues

#### 3D Object Doesn't Appear

**Checklist**:
- [ ] Object added to JSX render
- [ ] Position is within camera view
- [ ] Material color not pure black
- [ ] Geometry has non-zero dimensions
- [ ] Parent MovableWrapper not hidden
- [ ] No z-fighting (objects too close together)

**Solution Process**:
```typescript
// Add temporary debug visualization
useFrame(() => {
  console.log('Object position:', meshRef.current?.position);
});

// Or use Three.js helpers
import { Box3, CameraHelper } from 'three';
const box = new Box3().setFromObject(mesh);
const helper = new Box3Helper(box);
scene.add(helper);
```

#### Water Animation Not Working

**Checklist**:
- [ ] `flowDirection` prop set correctly
- [ ] `useFrame` hook is running (check console)
- [ ] Animation speed > 0
- [ ] Texture is loaded and visible
- [ ] Emissive color is visible

**Solution**:
```typescript
// In BuildingBlocks.tsx useFrame hook
useFrame((state, delta) => {
  console.log('Delta:', delta, 'Offset:', textureInstance.offset);
  // Verify these values are changing
});
```

#### Selection Not Working

**Checklist**:
- [ ] Object has unique ID
- [ ] `MovableWrapper` has `onSelect` callback
- [ ] `isSelected` prop passed correctly
- [ ] `handleSelect` function updates state
- [ ] Component re-renders after selection

**Solution**:
```typescript
// In LevelOne.tsx
const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

const handleSelect = (id: string) => {
  console.log('Selected:', id);  // Verify function called
  const newSelection = new Set(selectedIds);
  newSelection.has(id) ? newSelection.delete(id) : newSelection.add(id);
  setSelectedIds(newSelection);
};
```

### Using Browser DevTools

**Opening DevTools**: `F12` or `Cmd+Option+I` (Mac)

**Console Tab**:
- Check for JavaScript errors
- Use `console.log()` for debugging
- Evaluate expressions

**React DevTools Extension**:
- Inspect component hierarchy
- Check prop values
- Watch state changes

**Three.js Inspector Extension**:
- Visualize scene graph
- Inspect geometries and materials
- Preview textures

**Performance Tab**:
- Record rendering frames
- Identify bottlenecks
- Monitor FPS

---

## Testing

### Running Tests

**Run all tests**:
```bash
npm run test
```

**Run with UI dashboard**:
```bash
npm run test:ui
```

**Run in watch mode** (re-run on file changes):
```bash
npm run test:watch
```

**Run specific test file**:
```bash
npm run test -- utils/__tests__/geometry.test.ts
```

### Writing a New Test

**File Location**: `/tests/` directory
**File Naming**: `{module}.test.ts` or `{module}.test.tsx`

**Basic Test Template**:
```typescript
import { describe, it, expect } from 'vitest';
import { someFunction } from '../utils/someFile';

describe('someFunction', () => {
  it('should return correct result', () => {
    const result = someFunction(input);
    expect(result).toBe(expectedOutput);
  });

  it('should handle edge cases', () => {
    expect(() => someFunction(null)).toThrow();
  });
});
```

**Testing React Components**:
```typescript
import { render, screen } from '@testing-library/react';
import { MyComponent } from '../components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### Fixing Test Failures

**General Process**:

1. **Read the error message**: It usually tells you what failed
2. **Check the assertion**: Was your expectation wrong?
3. **Review the code**: Did your change break something?
4. **Use `console.log()`**: Debug what the actual value is
5. **Update the test**: If the new behavior is correct, update the test

**Common Failures**:

```typescript
// Type mismatch - ensure types match
expect(result).toBe(expected);     // Exact match
expect(result).toEqual(expected);  // Deep equality

// Async operations - use async/await
it('should load data', async () => {
  const data = await fetchData();
  expect(data).toBeDefined();
});

// Snapshot failures - review changes then update
// Run: npm run test -- -u
```

---

## Building New Features

### Adding a New Component to LevelOne

**Time**: 20-30 minutes

**Steps**:

1. **Plan the component**:
   - What type? (Path, WaterBlock, WaterfallBlock, custom Geometry?)
   - Where in the level? (Position: x, y, z)
   - Visual properties? (Color, size, special effects?)

2. **Add to LevelOne.tsx** (inside `<Scene>` children):
   ```typescript
   <MovableWrapper
     id="my-new-object"
     initialPos={[2.0, 0.0, -3.0]}
     isSelected={selectedIds.has('my-new-object')}
     onSelect={handleSelect}
   >
     <Path
       start={[0, 0, 0]}
       length={5}
       axis="x"
       color={theme.palette.brick}
       type="stone"
     />
   </MovableWrapper>
   ```

3. **Test in browser**:
   - Should appear in scene
   - Should highlight when clicked
   - No errors in console

4. **Adjust position** if needed:
   - Modify `initialPos` coordinates
   - Test until positioned correctly

5. **Add to theme** if using new colors:
   - Edit `themeColors.ts`
   - Use consistent palette colors

### Adding Animation to an Object

**Time**: 15-20 minutes

**Steps**:

1. **Add useRef** to store reference:
   ```typescript
   const meshRef = useRef<THREE.Mesh>(null);
   <mesh ref={meshRef}>...</mesh>
   ```

2. **Add useFrame** animation hook:
   ```typescript
   useFrame(({ clock }, delta) => {
     if (meshRef.current) {
       // Rotate: Continuous spinning
       meshRef.current.rotation.y += 0.01;

       // Float: Up and down movement
       meshRef.current.position.y = baseY + Math.sin(clock.elapsedTime) * 0.5;

       // Scale pulse: Breathing effect
       const scale = 1 + Math.sin(clock.elapsedTime * 2) * 0.1;
       meshRef.current.scale.set(scale, scale, scale);
     }
   });
   ```

3. **Test animation**:
   - Check that object animates smoothly
   - Verify it doesn't interfere with selection
   - Check performance (FPS should remain 60)

4. **Synchronize if needed**:
   - If multiple objects should animate together
   - Use same `clock.elapsedTime` base
   - Offset phases with position: `clock.elapsedTime + position[0]`

### Modifying Water Flow

**Common Task**: Change water direction, speed, color
**Time**: 10 minutes

**Steps**:

1. **Find the water component** in `LevelOne.tsx`

2. **Change flow direction**:
   ```typescript
   // Original
   <Path flowDirection={[0, 1]} ... />

   // Change to (four main directions):
   <Path flowDirection={[0, -1]} ... />  // Downward
   <Path flowDirection={[1, 0]} ... />   // Right
   <Path flowDirection={[-1, 0]} ... />  // Left
   ```

3. **Synchronize speeds** in `BuildingBlocks.tsx`:
   ```typescript
   // Find speed variables
   const speed = 1.5;  // Increase to 1.8 for faster flow
   ```

4. **Change water color** in `themeColors.ts`:
   ```typescript
   waterColor: '#color-code',
   waterEmissive: '#color-code',
   waterEmissiveIntensity: 2,
   ```

5. **Test in browser**:
   - Water should flow in new direction
   - Speed should be consistent
   - Color should match other water elements

---

## Performance Optimization

### Identifying Performance Issues

**Tools**:
- **Chrome DevTools Performance tab**: Record and analyze
- **FPS counter**: Monitor frame rate (target: 60 FPS)
- **Vite build analyzer**: Check bundle size

**Recording Performance**:
```bash
# In Chrome DevTools
1. Performance tab
2. Click Record
3. Interact with scene for 5-10 seconds
4. Click Stop
5. Analyze the timeline
```

**Checking Bundle Size**:
```bash
npm run build
# Look for size report in terminal output
```

### Optimization Techniques

**1. Reduce Geometry Complexity**:
```typescript
// Instead of detailed geometry
const geometry = new THREE.BoxGeometry(1, 1, 1, 32, 32, 32);

// Use simpler version
const geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
```

**2. Use Instancing for Repeated Objects**:
```typescript
// Instead of multiple meshes
<group>
  <Mesh position={[0, 0, 0]} />
  <Mesh position={[1, 0, 0]} />
  <Mesh position={[2, 0, 0]} />
</group>

// Use InstancedMesh
<instancedMesh args={[geometry, material, 100]} />
```

**3. Optimize Animation**:
```typescript
// Instead of updating in useFrame
useFrame(() => {
  object.position.x += 0.01;  // Every frame
});

// Use shader-based animation (GPU-accelerated)
// Or animate less frequently
```

**4. Lazy Load Components**:
```typescript
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

export function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

**5. Memoize Expensive Components**:
```typescript
import { memo } from 'react';

const ExpensiveComponent = memo(function ExpensiveComponent(props) {
  return <component {...props} />;
});
```

---

## Git Workflow

### Creating a Feature Branch

**Time**: 2 minutes

```bash
# Create new branch
git checkout -b feature/description-of-change

# Or create from main
git checkout main
git pull
git checkout -b feature/description-of-change
```

**Branch Naming Convention**:
- `feature/add-water-animation`
- `fix/selection-not-working`
- `docs/update-readme`
- `refactor/component-cleanup`

### Committing Changes

**Time**: 5 minutes

```bash
# Check status
git status

# Stage files
git add .

# Or stage specific files
git add src/components/MyComponent.tsx

# Commit with message
git commit -m "Add water animation to Path component"

# View commits
git log --oneline -5
```

**Commit Message Guidelines**:
- Start with verb: Add, Fix, Update, Refactor, Docs
- Be specific about what changed
- Reference issue numbers if applicable: `Fix #123`

### Pushing Changes

```bash
# Push to remote
git push origin feature/description

# First time pushing new branch
git push -u origin feature/description
```

---

## Documentation Updates

### Adding Comments to Code

**Good Comments**: Explain *why*, not what

```typescript
// GOOD - Explains the reasoning
// Using Set for O(1) lookup performance on selection
const selectedIds = new Set<string>();

// BAD - Obvious from code
// Create a new Set
const selectedIds = new Set<string>();
```

**JSDoc for Functions**:
```typescript
/**
 * Calculate isometric position from world coordinates
 * @param worldPos - Position in world space [x, y, z]
 * @returns Isometric screen position [x, y]
 */
function getIsometricPos(worldPos: [number, number, number]): [number, number] {
  // Implementation
}
```

### Updating Documentation Files

**When to Update**:
- Feature added or changed
- Architecture modified
- New pattern discovered
- Bug fix that affects understanding

**How to Update**:
1. Edit relevant `.md` file in `.ai/context/` or `.ai/patterns/`
2. Update "Last Updated" timestamp
3. Add section describing changes
4. Commit with message: `docs: update [filename] with [description]`

---

## Troubleshooting Guide

### "Cannot find module" Error

**Cause**: Incorrect import path
**Solution**:
```typescript
// Check file extension
import Component from './Component';  // ❌ Missing .tsx
import Component from './Component.tsx';  // ✅ Correct

// Check path
import { func } from '@/utils/helpers';  // Check tsconfig paths
```

### "Type error: Property X does not exist"

**Cause**: Missing or incorrect type definition
**Solution**:
```typescript
// Ensure type is imported
import type { MyType } from './types';

// Or use Three.js types
import * as THREE from 'three';
const mesh: THREE.Mesh = new THREE.Mesh();
```

### "Build fails with circular dependency"

**Cause**: Files import each other
**Solution**:
```bash
# Check for circular imports
npm ls  # Look for warnings

# Restructure:
# - Move shared code to utils
# - Use separate files for types
# - Import types with 'type' keyword
```

### Hot reload not working

**Cause**: Module boundary issue
**Solution**:
1. Restart dev server: `Ctrl+C` then `npm run dev`
2. Hard refresh browser: `Ctrl+Shift+R`
3. Clear cache: `rm -rf node_modules/.vite`

---

**Last Updated**: November 20, 2025
**Scope**: Procedural guides for common development tasks
**Audience**: Developers performing regular development work

