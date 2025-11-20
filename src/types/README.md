# Types Directory Guide

## Overview
This directory contains all TypeScript type definitions for the Monument Valley project, organized by domain.

## Directory Structure

```
types/
├── index.ts           Central re-export point (use this for imports)
├── research.ts        Research and planning related types
├── theme.ts           Theme, palette, and lighting types
└── components.ts      Component prop and view mode types
```

## How to Import Types

### Recommended Pattern
Import from the central index file:
```typescript
import { ViewMode, ResearchItem, LevelTheme } from '@/types';
```

### Alternative Pattern (with relative paths)
```typescript
import { ViewMode } from '../types';
import { ResearchItem } from '../../types';
```

## Type Definitions by Category

### Research Types (`research.ts`)
- `ResearchCategory` (enum): Categorization for research items
  - MECHANICS
  - ARCHITECTURE
  - ART_DIRECTION
  - NEXT_STEPS
- `ResearchItem` (interface): Individual research entry

### Theme Types (`theme.ts`)
- `LevelTheme`: Complete theme definition for a level
- `ColorPalette`: Colors used throughout the level
- `LightingConfig`: Lighting setup (ambient, directional, rim lights)
- `AtmosphereConfig`: Atmosphere settings (gradient, fog, particles)

### Component Types (`components.ts`)
- `ViewMode`: Application view mode (research | prototype)

## Adding New Types

1. **If adding to an existing domain**: Add the type to the appropriate file (research.ts, theme.ts, or components.ts)

2. **If creating a new domain**:
   - Create a new file: `src/types/[domain].ts`
   - Add your types to the new file
   - Export them from `index.ts`:
     ```typescript
     export type { MyType } from './[domain]';
     export { MyEnum } from './[domain]';
     ```

3. **Update this README** with the new type category

## Best Practices

- **Keep types organized**: Related types belong in the same file
- **Use descriptive names**: Type names should clearly indicate their purpose
- **Document complex types**: Add JSDoc comments for complex interfaces
- **Export from index.ts**: Always re-export from the central index
- **Use type imports**: Prefer `import type { Type }` for types to improve tree-shaking

Example:
```typescript
/**
 * Defines the configuration for a game level
 */
export interface LevelConfig {
  id: string;
  name: string;
  // ... properties
}
```

## Migration Notes

Previously, types were scattered across the codebase:
- `/src/types.ts` (root types)
- `/src/themes/types.ts` (theme types)

All types have been consolidated into this directory for better organization and maintainability.
