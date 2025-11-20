# Contributing to Monument

Thank you for your interest in contributing to Monument! This guide will help you get started with contributing to this Monument Valley-inspired isometric puzzle game built with React, Three.js, and TypeScript.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [Architecture Guidelines](#architecture-guidelines)
- [Documentation Standards](#documentation-standards)
- [Commit Message Conventions](#commit-message-conventions)

## Code of Conduct

This project welcomes contributors of all skill levels. We ask that you:

- Be respectful and constructive in discussions
- Help others learn and grow
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- A **Gemini API key** for AI features (optional for basic development)
- Basic familiarity with React, TypeScript, and Three.js

### Initial Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/monument.git
   cd monument/src
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.local.example` to `.env.local` (if it exists)
   - Add your Gemini API key:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

5. **Verify your setup**
   ```bash
   npm test
   ```

### Project Structure

```
monument/
├── src/
│   ├── components/          # React components
│   │   ├── Scene/          # 3D scene components
│   │   │   ├── blocks/     # Building block primitives
│   │   │   └── LevelOne.tsx
│   │   ├── UI/             # User interface components
│   │   ├── Dev/            # Development tools
│   │   └── Research/       # AI research features
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   ├── themes/             # Visual themes
│   ├── contexts/           # React contexts
│   ├── services/           # External service integrations
│   └── constants.ts        # Game constants
├── docs/                   # Documentation
├── tests/                  # Integration tests
└── research/               # Research notes
```

## Development Workflow

### Branch Strategy

We use a feature-branch workflow:

1. **Main Branches**
   - `main` - Production-ready code, deployed to GitHub Pages
   - `dev` - Development branch for integrating features

2. **Feature Branches**
   - Create from `dev`: `git checkout -b feature/your-feature-name dev`
   - Use descriptive names: `feature/water-physics`, `fix/camera-alignment`, `docs/api-reference`

3. **Branch Naming Conventions**
   - `feature/` - New features
   - `fix/` - Bug fixes
   - `refactor/` - Code refactoring
   - `docs/` - Documentation updates
   - `test/` - Test additions or improvements
   - `perf/` - Performance improvements

### Development Process

1. **Create a feature branch**
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write code following our style guidelines
   - Add or update tests
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm test              # Run all tests
   npm run test:ui       # Visual test interface
   npm run test:coverage # Check coverage
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add water bridge animation"
   ```

5. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

## Code Style Guidelines

### TypeScript Standards

**General Principles**
- Use TypeScript strictly - avoid `any` types unless absolutely necessary
- Prefer interfaces for object shapes, types for unions and intersections
- Use explicit return types for functions
- Leverage type inference where it improves readability

**Example:**
```typescript
// ✅ Good
interface BlockProps {
  position: [number, number, number];
  color: string;
  onInteract?: () => void;
}

function createBlock(props: BlockProps): JSX.Element {
  const { position, color, onInteract } = props;
  // ...
}

// ❌ Avoid
function createBlock(props: any) {
  // ...
}
```

### React Component Standards

**Functional Components with Hooks**
```typescript
// ✅ Preferred pattern
import { useRef, useState } from 'react';
import type { FC } from 'react';

interface ComponentProps {
  title: string;
  isActive?: boolean;
}

export const Component: FC<ComponentProps> = ({ title, isActive = false }) => {
  const [state, setState] = useState<number>(0);

  return (
    <div className={isActive ? 'active' : ''}>
      {title}
    </div>
  );
};
```

**Prop Destructuring**
- Destructure props in function parameters
- Provide default values where appropriate
- Use optional chaining for nested properties

### Three.js and React Three Fiber Conventions

**Component Naming**
- Scene components: PascalCase ending in descriptive name (`WaterBlock`, `TowerBlock`)
- Custom hooks: camelCase with `use` prefix (`useIsometricAlignment`)

**Three.js Best Practices**
```typescript
// ✅ Good - Use refs for Three.js objects
const meshRef = useRef<THREE.Mesh>(null);

useFrame((state, delta) => {
  if (meshRef.current) {
    meshRef.current.rotation.y += delta;
  }
});

// ✅ Good - Clean up resources
useEffect(() => {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial();

  return () => {
    geometry.dispose();
    material.dispose();
  };
}, []);
```

**Isometric Coordinate System**
- Use the project's `isometricAlignment.ts` utilities for positioning
- Document world vs. screen space conversions
- Keep isometric angle consistent (typically 35.264° for Y-axis rotation)

### File Organization

**Import Order**
1. External libraries (React, Three.js, etc.)
2. Internal utilities and types
3. Components
4. Styles

```typescript
// ✅ Good
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { calculateIsometricPosition } from '@/utils/isometricAlignment';
import type { BlockProps } from '@/types';

import { BaseBlock } from './BaseBlock';
```

**File Naming**
- Components: PascalCase (`WaterBlock.tsx`)
- Utilities: camelCase (`isometricAlignment.ts`)
- Types: PascalCase (`GameTypes.ts`)
- Constants: UPPER_SNAKE_CASE files or exports

### Code Formatting

We use consistent formatting throughout the codebase:

- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Use semicolons
- **Line Length**: 100 characters (soft limit)
- **Trailing Commas**: Use in multiline objects/arrays

## Testing Requirements

### Writing Tests

All utility functions should have corresponding tests. Use Vitest for testing.

**Test File Location**
- Place tests in `__tests__` directories next to the code
- Name test files: `functionName.test.ts`

**Example Test**
```typescript
// utils/__tests__/isometricAlignment.test.ts
import { describe, it, expect } from 'vitest';
import { calculateIsometricPosition } from '../isometricAlignment';

describe('calculateIsometricPosition', () => {
  it('should convert grid coordinates to isometric world position', () => {
    const result = calculateIsometricPosition(1, 0, 0);
    expect(result).toEqual([1.224, 0, -0.707]);
  });

  it('should handle negative coordinates', () => {
    const result = calculateIsometricPosition(-1, 0, 0);
    expect(result[0]).toBeLessThan(0);
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Coverage Expectations

- **Utility Functions**: 80%+ coverage required
- **Components**: Visual verification acceptable for 3D components
- **Critical Logic**: 100% coverage (collision detection, path validation, etc.)

### What to Test

**Required Testing**
- Utility functions (coordinate conversions, calculations)
- Game logic (movement validation, puzzle state)
- Data transformations
- Edge cases and error conditions

**Optional Testing**
- Visual components (can rely on manual QA)
- Animation timing (difficult to test reliably)
- Three.js rendering (tested by the library)

## Pull Request Process

### Before Submitting

1. **Self-review your code**
   - Read through all changes
   - Remove console.logs and debug code
   - Check for commented-out code

2. **Run the full test suite**
   ```bash
   npm test
   npm run build  # Ensure it builds
   ```

3. **Update documentation**
   - Add JSDoc comments for new functions
   - Update relevant markdown docs
   - Add examples if introducing new patterns

4. **Test manually**
   - Run the app locally
   - Test your changes in different scenarios
   - Check for visual regressions

### PR Template

When creating a PR, include:

**Title Format**: `type: brief description`
- Examples: `feat: add water bridge animation`, `fix: camera alignment bug`

**Description Should Include**:
```markdown
## Changes
Brief description of what changed and why

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to change)
- [ ] Documentation update

## Testing
- [ ] Tests added/updated
- [ ] Manual testing completed
- [ ] No console errors

## Screenshots/Videos
(If applicable - especially for visual changes)

## Related Issues
Fixes #123
```

### Review Process

1. **Automated Checks**
   - All tests must pass
   - Build must succeed
   - No TypeScript errors

2. **Code Review**
   - At least one maintainer approval required
   - Address all review comments
   - Update PR based on feedback

3. **Merge Requirements**
   - All checks passing
   - Conflicts resolved
   - Up to date with base branch

## Architecture Guidelines

### Adding New Components

#### Building Blocks (Scene/blocks/)

Create new block types in `src/components/Scene/blocks/`:

```typescript
// src/components/Scene/blocks/YourBlock.tsx
import type { FC } from 'react';
import type { BlockProps } from '@/types';

interface YourBlockProps extends BlockProps {
  customProp?: number;
}

export const YourBlock: FC<YourBlockProps> = ({
  position,
  rotation = [0, 0, 0],
  customProp = 1
}) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Your 3D geometry */}
    </group>
  );
};
```

**Guidelines for Block Components**
- Extend `BlockProps` interface
- Use consistent prop naming
- Handle default rotations
- Optimize geometry (reuse materials)
- Dispose of resources in cleanup

#### Levels (Scene/)

Create new levels in `src/components/Scene/`:

```typescript
// src/components/Scene/LevelTwo.tsx
import type { FC } from 'react';
import { WaterBlock, TowerBlock } from './blocks';

export const LevelTwo: FC = () => {
  return (
    <group>
      {/* Level geometry */}
      <TowerBlock position={[0, 0, 0]} />
      {/* Add more blocks */}
    </group>
  );
};
```

**Level Design Principles**
- Use isometric grid coordinates
- Keep level complexity manageable
- Document puzzle solution paths
- Consider camera angles
- Test character movement paths

#### UI Components (UI/)

Add interface elements in `src/components/UI/`:

```typescript
// src/components/UI/YourComponent.tsx
import type { FC } from 'react';
import './YourComponent.css';

interface YourComponentProps {
  onAction: () => void;
}

export const YourComponent: FC<YourComponentProps> = ({ onAction }) => {
  return (
    <div className="your-component">
      <button onClick={onAction}>Action</button>
    </div>
  );
};
```

### Adding Utilities

Place reusable functions in `src/utils/`:

```typescript
// src/utils/yourUtility.ts

/**
 * Brief description of what this does
 * @param input - Description of parameter
 * @returns Description of return value
 */
export function yourUtility(input: number): number {
  return input * 2;
}
```

**Always include**:
- JSDoc comments
- Type annotations
- Unit tests in `__tests__/` subdirectory
- Error handling for edge cases

### Adding Types

Define shared types in `src/types/`:

```typescript
// src/types/YourTypes.ts
export interface YourType {
  id: string;
  name: string;
  position: [number, number, number];
}

export type YourUnion = 'option1' | 'option2' | 'option3';
```

### Theming System

Themes are defined in `src/themes/`. To add a new theme:

```typescript
// src/themes/yourTheme.ts
import type { Theme } from '@/types';

export const yourTheme: Theme = {
  name: 'Your Theme',
  colors: {
    primary: '#hexcode',
    secondary: '#hexcode',
    // ...
  },
  // Additional theme properties
};
```

Register in `src/contexts/ThemeContext.tsx`.

## Documentation Standards

### When to Update Documentation

Update documentation when you:

- Add new features or components
- Change existing APIs or interfaces
- Fix bugs that affect documented behavior
- Add new utilities or helpers
- Change architectural patterns

### Documentation Locations

- **API Documentation**: `docs/api/`
- **Architecture Guides**: `docs/architecture/`
- **Feature Guides**: `docs/features/`
- **User Guides**: `docs/guides/`

### Documentation Format

Use clear, concise Markdown with:

**Code Examples**
```typescript
// Always include working examples
import { YourComponent } from '@/components/YourComponent';

<YourComponent prop="value" />
```

**Diagrams** (when helpful)
```
ASCII diagrams for spatial relationships:

┌─────────┐
│  Block  │ → Visual representation
└─────────┘
```

**Type Definitions**
```typescript
// Document complex types
interface ComplexType {
  /** Description of property */
  property: string;
}
```

### JSDoc Comments

Add JSDoc comments for all exported functions:

```typescript
/**
 * Converts grid coordinates to isometric world position
 *
 * @param x - Grid X coordinate
 * @param y - Grid Y coordinate (height)
 * @param z - Grid Z coordinate
 * @returns Three.js Vector3 position [x, y, z]
 *
 * @example
 * ```ts
 * const pos = calculateIsometricPosition(1, 0, 1);
 * // Returns: [1.931, 0, 0]
 * ```
 */
export function calculateIsometricPosition(
  x: number,
  y: number,
  z: number
): [number, number, number] {
  // Implementation
}
```

## Commit Message Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
type(scope): subject

body (optional)

footer (optional)
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

### Examples

```bash
# Simple feature
git commit -m "feat: add water bridge animation"

# Bug fix with scope
git commit -m "fix(camera): correct isometric alignment calculation"

# Breaking change
git commit -m "feat!: redesign level system

BREAKING CHANGE: Level components now require 'id' prop"

# Documentation
git commit -m "docs: update contributing guidelines"

# Multiple files
git commit -m "refactor(blocks): extract common block logic

- Create BaseBlock component
- Update all block components to extend BaseBlock
- Add prop validation"
```

### Commit Best Practices

- Keep commits atomic (one logical change per commit)
- Write descriptive messages (not "fix stuff" or "updates")
- Reference issues when applicable: `fixes #123`
- Use present tense: "add feature" not "added feature"

## Getting Help

- **Questions**: Open a [Discussion](https://github.com/kvnloo/monument/discussions)
- **Bugs**: Open an [Issue](https://github.com/kvnloo/monument/issues)
- **Ideas**: Open a Feature Request issue

## Recognition

Contributors will be recognized in:
- GitHub contributors page
- Release notes for significant contributions
- Project README (for major features)

## Additional Resources

- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber/)
- [Three.js Documentation](https://threejs.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Vitest Documentation](https://vitest.dev/)

---

Thank you for contributing to Monument! Your efforts help create an amazing experience for players exploring impossible geometry.
