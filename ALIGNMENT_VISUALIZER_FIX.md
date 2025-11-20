# AlignmentVisualizer Debug Fix Report

## Problem Statement
The AlignmentVisualizer component was not showing:
- Screen-space coordinates in the UI panel
- Geometric midpoint calculations
- Visual midpoint calculations
- Red/green markers on screen

The UI panel showed "Beam-A + Beam-B" but displayed no actual calculation data.

## Root Causes Identified

### 1. Development Mode Gate (PRIMARY BUG)
**Location**: `/monument-valley-demo/components/Dev/AlignmentVisualizer.tsx:23`

**Issue**:
```typescript
if (!import.meta.env.DEV) {
  return null;
}
```

The component had a hard check that completely blocked rendering when `import.meta.env.DEV` is false. Since the app is built as a production site (vite build), this environment variable is false, preventing the entire component from rendering even when selected.

**Impact**: The component never rendered in production builds or when testing production builds locally.

### 2. SVG Viewport Positioning (SECONDARY BUG)
**Location**: `/monument-valley-demo/components/Dev/AlignmentVisualizer.tsx:212-220`

**Issue**:
```typescript
<svg
  style={{
    position: 'absolute',  // ❌ Should be 'fixed'
    top: 0,
    left: 0,
    width: '100%',         // ❌ Should be '100vw'
    height: '100%',        // ❌ Should be '100vh'
    pointerEvents: 'none',
  }}
>
```

The SVG used `position: absolute` which is relative to the nearest positioned parent (the Html component), not the viewport. This caused the visualization markers to render outside the visible area.

**Impact**: Even when enabled, the visual markers (red/green circles, lines) wouldn't appear in the correct screen positions.

## Fixes Applied

### Fix 1: Add Dev Mode Override with localStorage
**File**: `/monument-valley-demo/components/Dev/AlignmentVisualizer.tsx:22-28`

**Before**:
```typescript
if (!import.meta.env.DEV) {
  return null;
}
```

**After**:
```typescript
const forceDevMode = typeof window !== 'undefined' && localStorage.getItem('alignmentVisDebug') === 'true';
const isDevMode = import.meta.env.DEV || forceDevMode;

if (!isDevMode) {
  return null;
}
```

**Benefits**:
- Still respects `import.meta.env.DEV` in true dev builds
- Allows production builds to activate dev tools via localStorage
- Safe check for window object (SSR compatibility)

### Fix 2: Fix SVG Positioning and Viewport Sizing
**File**: `/monument-valley-demo/components/Dev/AlignmentVisualizer.tsx:230-242`

**Before**:
```typescript
<svg
  style={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  }}
>
```

**After**:
```typescript
<svg
  style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none',
    zIndex: 999,
  }}
  width={size.width}
  height={size.height}
>
```

**Benefits**:
- `position: fixed` places SVG relative to viewport, not parent
- `100vw/100vh` covers full viewport
- `zIndex: 999` ensures visualization stays on top
- `width={size.width}` and `height={size.height}` set actual SVG canvas dimensions for proper coordinate mapping

### Fix 3: Add Debug Logging
**File**: `/monument-valley-demo/components/Dev/AlignmentVisualizer.tsx:143-156`

**Added**:
```typescript
useEffect(() => {
  console.log('[AlignmentVisualizer] Rendering with:', {
    id1, id2,
    pos1: pos1 ? { x: fmt(pos1.x), y: fmt(pos1.y), z: fmt(pos1.z) } : null,
    pos2: pos2 ? { x: fmt(pos2.x), y: fmt(pos2.y), z: fmt(pos2.z) } : null,
    screen1: { x: fmt(screen1.x), y: fmt(screen1.y) },
    screen2: { x: fmt(screen2.x), y: fmt(screen2.y) },
    screenGeometric: { x: fmt(screenGeometric.x), y: fmt(screenGeometric.y) },
    visualMidpoint: { x: fmt(visualMidpoint.x), y: fmt(visualMidpoint.y) },
    midpointOffset: fmt(midpointOffset),
  });
}, [id1, id2, pos1, pos2]);
```

**Benefits**:
- Logs all calculations to browser console for debugging
- Helps verify coordinates are being calculated correctly
- Useful for troubleshooting alignment issues

## Testing the Fix

### Enable in Production Build
```javascript
// In browser DevTools console:
localStorage.setItem('alignmentVisDebug', 'true');
location.reload();
```

### Verify Functionality
1. Open the app
2. Enable alignment visualizer via console
3. Select 2 objects (e.g., "Beam-A" and "Beam-B") by clicking them
4. Click "Alignment: OFF" button to enable visualization
5. Observe:
   - ✓ Control panel shows calculations
   - ✓ Red marker (3D geometric midpoint) appears on screen
   - ✓ Green marker (2D visual midpoint) appears on screen
   - ✓ Cyan circles mark object positions
   - ✓ Console shows detailed calculation logs

### Expected Console Output
```
[AlignmentVisualizer] Rendering with: {
  id1: "Beam-A",
  id2: "Beam-B",
  pos1: { x: "2.40", y: "0.00", z: "-1.00" },
  pos2: { x: "7.90", y: "5.50", z: "5.44" },
  screen1: { x: "634.21", y: "345.67" },
  screen2: { x: "789.45", y: "456.89" },
  screenGeometric: { x: "712.33", y: "401.28" },
  visualMidpoint: { x: "711.83", y: "401.28" },
  midpointOffset: "0.50"
}
```

## Files Modified

1. **`/monument-valley-demo/components/Dev/AlignmentVisualizer.tsx`**
   - Added localStorage dev mode override
   - Fixed SVG positioning to use fixed positioning
   - Added debug console logging
   - Added useRef to imports (for future enhancements)

2. **Created `/monument-valley-demo/DEBUG_ALIGNMENT.md`**
   - User guide for enabling and using the visualizer
   - Technical details about perspective calculations
   - Debug instructions

3. **Created `/ALIGNMENT_VISUALIZER_FIX.md`**
   - This comprehensive fix report

## Technical Details

### Why the Fixes Work

**Dev Mode Override**:
- Vite's `import.meta.env.DEV` is a compile-time constant
- In production builds, it's optimized to `false` and tree-shaken away
- localStorage check happens at runtime, allowing override

**SVG Viewport Fix**:
- Html component uses relative positioning
- SVG needs `position: fixed` to map to screen coordinates
- Actual SVG canvas dimensions must match size.width/size.height for proper coordinate mapping
- z-index ensures visualization layers on top

**Calculations Flow**:
1. Objects have 3D world positions (x, y, z)
2. Camera projects these to clip space (-1 to 1)
3. Converted to screen space (0 to width, 0 to height)
4. Geometric midpoint: average 3D positions, then project
5. Visual midpoint: average screen positions
6. Offset: distance between the two midpoints on screen

### When Geometric ≠ Visual Midpoints

Due to perspective projection:
- **Geometric midpoint**: True mathematical center in 3D space
- **Visual midpoint**: What looks centered on screen
- These can differ significantly with non-orthographic cameras
- The offset quantifies perspective distortion at that location

## Build Status

✓ TypeScript compilation: Success
✓ Vite build: Success
✓ No new dependencies added
✓ Backward compatible with true dev builds

## Deployment Notes

The fixes are fully backward compatible:
- Dev builds (vite dev) work as before
- Production builds (vite build) can optionally enable debugging via localStorage
- No environment variables or build configuration changes needed
- The component is still dev-only (just now optionally accessible in production builds for debugging)
