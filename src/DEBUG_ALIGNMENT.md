# AlignmentVisualizer Debug Guide

## Enabling in Production/Non-Dev Builds

The AlignmentVisualizer is a development-only tool that shows geometric vs visual midpoints for alignment verification.

### Method 1: Browser Console
Open DevTools (F12) and run:
```javascript
localStorage.setItem('alignmentVisDebug', 'true');
location.reload();
```

### Method 2: Direct localStorage
```javascript
// In browser console:
localStorage.setItem('alignmentVisDebug', 'true');
// Then refresh the page
```

### Method 3: Check Current Status
```javascript
console.log(localStorage.getItem('alignmentVisDebug'));
```

### To Disable
```javascript
localStorage.removeItem('alignmentVisDebug');
location.reload();
```

## How to Use the Visualizer

1. **Enable the visualizer** using one of the methods above
2. **Select exactly 2 objects** from the 3D scene by clicking them (Shift+click for multi-select)
3. **Click "Alignment: OFF"** button to turn on the visualization
4. **View the panel** showing:
   - **SCREEN SPACE**: Where each object appears on screen (pixels)
   - **MIDPOINTS**:
     - 3D Mid: Geometric midpoint of two objects projected to screen
     - 2D Mid: Visual midpoint on screen (average of screen positions)
   - **Distances**:
     - 2D Distance: Pixel distance between objects on screen
     - Mid Offset: Pixel difference between geometric and visual midpoints

5. **On-screen visualization**:
   - **Cyan circles**: Object positions on screen
   - **Red circle**: 3D geometric midpoint (red = from 3D space)
   - **Green circle**: 2D visual midpoint (green = from 2D averaging)
   - **Yellow line**: Offset between the two midpoints (when > 1px)
   - **White dashed line**: Connection between the two objects

## What It Shows

The visualization helps identify **perspective distortion** in Monument Valley's isometric-style renders:

- When **red and green circles align**: Objects are visually centered
- When **they diverge**: Perspective causes visual offset from geometric center
- The **midpoint offset** quantifies how much the perspective affects alignment

## Debug Console Output

Check the browser console for detailed calculation logs:
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

## Technical Details

### Screen Space Projection
- Uses THREE.js camera projection
- Converts 3D world coordinates to 2D screen coordinates
- Handles perspective correctly

### Geometric vs Visual Midpoints
- **Geometric**: (pos1 + pos2) / 2, then project to screen
- **Visual**: (screen1 + screen2) / 2
- Different due to perspective camera projection

### When Offset Is Significant
- Large offsets (> 5px) indicate strong perspective effect
- Useful for finding "visual alignment" vs "geometric alignment"
