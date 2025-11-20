# Glossary: Monument Valley Demo

This glossary defines project-specific terminology, technical concepts, and acronyms used throughout the Monument Valley Demo codebase and documentation.

## Core Concepts

### Isometric Projection
A method of 3D visualization that preserves parallel lines and provides an axonometric view without perspective distortion. In Monument Valley, isometric projection creates the distinctive "tilted" visual perspective where objects maintain their relative proportions regardless of distance from the camera.

**Related**: Orthogonal projection, axonometric view
**Usage**: "The isometric projection is configured in the Camera component"

### Water Flow
The directional animation of water textures using texture offset calculations. Water flows along specified axes (typically along paths) with synchronized speed and visual effects.

**Related**: FlowDirection, animation speed
**Usage**: "The water flow should match between Beam-A and the waterfall"

### Building Block
A reusable 3D component representing a distinct element in the level (path, water block, waterfall, etc.). Building blocks are composed to construct the complete level.

**Related**: Component, Mesh, Geometry
**Usage**: "Add a new WaterBlock building block to the scene"

### Level
A complete, playable environment containing positioned 3D objects, interactive elements, and aesthetic details. Monument Valley Demo currently features LevelOne.

**Related**: Scene, Scene graph
**Usage**: "Implement the new puzzle in LevelOne"

### Material
In Three.js, a material defines how a surface should look (color, texture, reflectivity, etc.). Materials are combined with geometries to create visible meshes.

**Related**: Geometry, Mesh, Shader
**Usage**: "Apply a stone material to the wall blocks"

### Mesh
In Three.js, a combination of geometry and material that can be rendered. Meshes are the visible objects in a 3D scene.

**Related**: Geometry, Material
**Usage**: "Create a mesh from the box geometry"

### Scene Graph
The hierarchical tree structure of 3D objects in a Three.js scene. Objects can be nested within Groups, forming parent-child relationships.

**Related**: Group, Transform hierarchy
**Usage**: "Add the path to the level's scene graph"

## Technical Terms

### React Three Fiber (R3F)
A React renderer for Three.js that allows declarative 3D object creation using JSX. Provides hooks like `useFrame()` for animations and `useRef()` for object access.

**Acronym**: R3F
**Related**: Three.js, React
**Usage**: "Use the useFrame hook from React Three Fiber for animation"

### Canvas
In React Three Fiber, the `<Canvas>` component sets up the Three.js renderer, camera, and scene context. All 3D content lives within the Canvas.

**Related**: Renderer, WebGL context
**Usage**: "Wrap the Scene component in a Canvas"

### useFrame Hook
A React Three Fiber hook that runs a callback on every animation frame (synchronized with requestAnimationFrame). Receives state object with elapsed time.

**Related**: Animation loop, requestAnimationFrame
**Usage**: "Use useFrame to update the water texture offset every frame"

### Ref / useRef
A React hook that provides direct access to Three.js objects for imperative operations (not through React state/props). Used for performance-critical operations.

**Related**: Reference, Direct DOM access
**Usage**: "Store the mesh reference in a useRef to access it in useFrame"

### MovableWrapper
A custom component that wraps selectable 3D objects, providing selection highlighting, position management, and UI offset calculations.

**Related**: Selection system, Interactive object
**Usage**: "Wrap the Path component in a MovableWrapper with a unique ID"

### Path
A building block component representing a directional walkable path, optionally with water flow animation. Composed of individual blocks.

**Related**: WaterBlock, Building block
**Usage**: "Create a Path that flows from west to east"

### WaterBlock
A single cube-shaped building block with animated water texture, emissive material, and optional directional flow.

**Related**: Water flow, Building block
**Usage**: "Stack multiple WaterBlocks to create a water channel"

### WaterfallBlock
A building block representing vertical cascading water with animated texture scrolling and waterfall-specific visual properties.

**Related**: Water flow, Waterfall effect
**Usage**: "Position a WaterfallBlock below the water channel"

### Theme Colors
The centralized color palette defined in `themeColors.ts`, providing consistent colors across the application (stone, water, accents, emissive colors).

**Related**: Color palette, Design system
**Usage**: "Use theme.palette.brick for the building material color"

### Emissive
In Three.js materials, the emissive property makes an object glow without affecting surrounding objects. Common for water, light sources, and special elements.

**Related**: Self-illumination, Glow
**Usage**: "Set an emissive color on the water material for the glow effect"

### Geometry
In Three.js, the mathematical definition of a 3D shape (vertices, faces, normals). Geometries are combined with materials to create visible meshes.

**Related**: Mesh, Material
**Usage**: "Create a BoxGeometry for the building block"

### Texture
An image applied to a 3D surface to add detail and visual interest. Textures can be animated by adjusting offset and rotation.

**Related**: Material, UV mapping
**Usage**: "Apply the water texture and animate its offset for flow"

## State and Interaction

### Selection System
The mechanism for tracking which objects are currently selected (storing IDs in a Set). Selected objects highlight and display information in the UI.

**Related**: InteractivObject, Highlighted state
**Usage**: "Add the object ID to the selectedIds set"

### selectedIds
A Set of string IDs representing currently selected 3D objects. Passed from App.tsx through component tree to highlight selected objects.

**Related**: Selection state, Highlight
**Usage**: "Check if object ID is in selectedIds to apply highlight"

### onSelect Callback
A function passed from parent to child components that updates the selectedIds state when an object is clicked/selected.

**Related**: Event handler, State update
**Usage**: "Call onSelect with the object ID when clicked"

### UI Offset
The screen-space offset applied to UI labels and information panels for selected objects, ensuring they don't overlap with the 3D objects they describe.

**Related**: ScreenSpace, Label positioning
**Usage**: "Calculate the UI offset based on object position"

## Animation and Effects

### Flow Direction
A vector [x, y] defining the direction of water texture animation. [0, 1] flows upward, [0, -1] flows downward, etc.

**Related**: Water flow, Animation direction
**Usage**: "Set flowDirection to [0, -1] to flow toward the waterfall"

### Animation Speed
A numerical value controlling how fast a texture animates or property updates. Higher values = faster animation.

**Related**: Delta time, Frame synchronization
**Usage**: "Increase animation speed from 1.5 to 1.8 for more dynamic flow"

### Delta Time (Δt)
The elapsed time since the last frame (typically 0.016 seconds at 60 FPS). Provided by `useFrame` for frame-rate-independent animations.

**Related**: Frame time, Time step
**Usage**: "Multiply speed by delta to ensure frame-rate independence"

### Texture Offset
A Two-dimensional offset [u, v] applied to texture coordinates, effectively panning the texture. Used for water flow animation.

**Related**: UV mapping, Texture animation
**Usage**: "Update textureInstance.offset.y to animate the water downward"

### Emissive Intensity
A numerical multiplier on the emissive color controlling how brightly an object glows. Synchronized across related elements for visual harmony.

**Related**: Emissive color, Glow intensity
**Usage**: "Synchronize emissive intensity between water blocks"

## Performance and Optimization

### LOD (Level of Detail)
A technique where distant objects use simplified geometry, reducing rendering load. Not currently used but relevant for future optimization.

**Related**: Frustum culling, Performance optimization
**Usage**: "Implement LOD for distant building blocks"

### Frustum Culling
Automatic Three.js optimization that skips rendering objects outside the camera's viewing frustum. Reduces draw calls and improves performance.

**Related**: Visibility, Rendering optimization
**Usage**: "Three.js handles frustum culling automatically"

### Draw Call
A single render call from CPU to GPU. Minimizing draw calls improves performance. Related to batching and instancing.

**Related**: GPU rendering, Performance
**Usage**: "Use geometry instancing to reduce draw calls"

### Instancing
A technique where multiple copies of the same geometry/material are rendered in a single draw call. Significantly improves performance for repeated objects.

**Related**: Batching, GPU efficiency
**Usage**: "Use InstancedMesh to render many identical blocks"

### Viewport
The rectangular area of the canvas displaying the 3D scene. Viewport size affects aspect ratio and rendering resolution.

**Related**: Canvas, Resolution
**Usage**: "Update viewport when window resizes"

## File and Project Organization

### Component
A React functional component—a JavaScript function returning JSX. Monument Valley uses component-based architecture throughout.

**Related**: Function, React.FC
**Usage**: "Create a new component for the puzzle mechanic"

### Hook
A React function providing state and lifecycle features to functional components. Common hooks: useState, useRef, useFrame.

**Related**: State management, Lifecycle
**Usage**: "Use the useState hook to manage selected objects"

### Props
Short for "properties"—data passed from parent to child React components. Typically immutable from the child's perspective.

**Related**: Properties, Parameters
**Usage**: "Pass the selected state as a prop to the object"

### State
Data that React components manage and can change over time. State updates trigger re-renders. Managed via useState hook.

**Related**: Mutable data, Re-render trigger
**Usage**: "Store the camera position in state"

### Render
The process of converting React components to DOM elements (or in R3F, to Three.js objects). Components "render" based on state and props.

**Related**: React execution, Display update
**Usage**: "The component re-renders when selectedIds changes"

### Re-render
When React re-executes a component function due to state/props changes. Necessary for UI updates but can impact performance if excessive.

**Related**: Component update, Efficiency
**Usage**: "Memoize to prevent unnecessary re-renders"

### TypeScript / TS
A superset of JavaScript adding static type definitions. All Monument Valley code uses TypeScript for type safety.

**Related**: Type system, Type checking
**Usage**: "Define the component props type as `interface ComponentProps`"

### TSX
TypeScript + JSX combined—TypeScript files containing React components with JSX syntax.

**Related**: .tsx file extension, React component
**Usage**: "Create a new .tsx file for the component"

## Acronyms and Abbreviations

| Acronym | Full Name | Context |
|---------|-----------|---------|
| R3F | React Three Fiber | 3D rendering library |
| WebGL | Web Graphics Library | GPU rendering API |
| GPU | Graphics Processing Unit | Hardware for rendering |
| CPU | Central Processing Unit | Main processor |
| FPS | Frames Per Second | Rendering performance |
| HMR | Hot Module Replacement | Development feature (Vite) |
| LOD | Level of Detail | Performance optimization |
| JSX | JavaScript XML | React syntax |
| TS/TSX | TypeScript / TypeScript JSX | Language and file types |
| UI | User Interface | Visual controls |
| UX | User Experience | Overall experience |
| API | Application Programming Interface | External service |
| ENV | Environment | Configuration context |
| RGBA | Red Green Blue Alpha | Color format |
| UV | Texture coordinates | 2D texture space |
| LUT | Look-Up Table | Performance data structure |
| GLTF/GLB | GL Transmission Format | 3D model format |

## Related Documentation

- [Project Context](./PROJECT_CONTEXT.md) - Project overview
- [Architecture](./ARCHITECTURE.md) - System design
- [Tech Stack](./TECH_STACK.md) - Technologies used
- [Code Patterns](../patterns/CODE_PATTERNS.md) - Reusable patterns
- [Common Tasks](../patterns/COMMON_TASKS.md) - Implementation procedures

## Maintaining the Glossary

When adding new terminology:

1. **Define clearly**: Explain what the term means in project context
2. **Provide usage**: Show how the term is used in code/documentation
3. **Link related**: Connect to similar terms
4. **Keep alphabetical**: Maintain organization for easy lookup
5. **Update index**: Add to related sections if applicable

---

**Last Updated**: November 20, 2025
**Scope**: Project-specific terminology and technical concepts
**Audience**: All team members and AI assistants working on the project

