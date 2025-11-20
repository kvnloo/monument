# Development Tools

This directory contains development-only tools for the Monument Valley demo.

## AlignmentVisualizer

A visual debugging tool for analyzing screen-space alignment between objects in the 3D scene.

### Features

- Only renders in development mode (`import.meta.env.DEV`)
- Shows alignment data when exactly 2 objects are selected
- Displays geometric (3D) vs visual (2D screen-space) midpoints
- Calculates screen-space distance between objects
- Shows offset between 3D and 2D midpoints

### Usage

The component is automatically integrated into `LevelOne.tsx`. To use:

1. Select exactly 2 objects using Shift+Click
2. Click the "Alignment: OFF" button to enable visualization
3. The overlay will show:
   - Screen-space coordinates for both objects
   - 3D midpoint (red) - geometric center in 3D space projected to screen
   - 2D midpoint (green) - visual center calculated in screen space
   - 2D distance in pixels
   - Offset between the two midpoints

### Visual Guide

- **Cyan circles**: Selected object positions in screen space
- **Red circle + label**: 3D geometric midpoint projected to screen
- **Green circle + label**: 2D visual midpoint (screen-space average)
- **Yellow line**: Offset between 3D and 2D midpoints (if > 1px)
- **White dashed line**: Connection between objects in screen space

### Implementation Details

The component uses:
- `useThree()` hook to access camera and viewport size
- `Vector3.project()` for 3D to 2D screen-space projection
- React state management via parent component (`LevelOne`)
- SVG overlay for visual debugging markers
- Tailwind CSS for UI styling

### Position Data Flow

```
MovableWrapper (each object)
  ↓ onPositionChange callback
LevelOne (state: objectPositions Map)
  ↓ props
AlignmentVisualizer (visualization)
```

### Why This Tool?

Monument Valley's core mechanic relies on "optical illusion as physics" - objects that appear aligned in 2D screen space can be traversed even if they're distant in 3D. This tool helps visualize and debug that alignment by showing:

1. Where objects actually are in 3D (geometric midpoint)
2. Where they appear to be in 2D (visual midpoint)
3. The difference between these two (the "illusion offset")

For isometric/orthographic projections, these values should be very close. Large offsets indicate potential alignment issues.
