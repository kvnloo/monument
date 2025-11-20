# Testing Patterns: Monument Valley Demo

This document provides testing strategies, patterns, and best practices for the Monument Valley Demo project using Vitest.

## Testing Overview

### Test Organization

**Directory Structure**:
```
monument-valley-demo/
├── src/
│   ├── utils/
│   │   ├── geometry.ts
│   │   └── themeColors.ts
│   └── components/
│       ├── Scene/
│       └── ...
└── tests/
    ├── utils/
    │   ├── geometry.test.ts
    │   └── themeColors.test.ts
    └── components/
        └── ...test.tsx
```

**File Naming**: `{module}.test.ts` or `{module}.test.tsx`

### Running Tests

**Available Commands**:
```bash
npm run test           # Run all tests once
npm run test:ui        # Run with interactive dashboard
npm run test:watch     # Run in watch mode (re-run on changes)
npm run test -- pattern  # Run tests matching pattern
```

**Example Runs**:
```bash
npm run test                          # All tests
npm run test -- geometry              # Tests in geometry
npm run test:watch                    # Watch mode
npm run test -- --reporter=verbose    # Detailed output
```

---

## Unit Testing Patterns

### Basic Test Structure

**Template**:
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { functionToTest } from '../utils/myModule';

describe('functionToTest', () => {
  // Setup before each test
  beforeEach(() => {
    // Initialize test data
  });

  // Cleanup after each test
  afterEach(() => {
    // Clean up resources
  });

  // Test case
  it('should do something expected', () => {
    // Arrange - set up test data
    const input = { /* test data */ };

    // Act - call the function
    const result = functionToTest(input);

    // Assert - verify the result
    expect(result).toBe(expectedValue);
  });

  it('should handle edge cases', () => {
    expect(() => functionToTest(null)).toThrow();
  });
});
```

### Testing Utility Functions

**Example: Geometry Calculations**

```typescript
import { describe, it, expect } from 'vitest';
import {
  worldToIsometric,
  isometricToWorld,
  calculateDistance
} from '../utils/geometry';

describe('Geometry Utils', () => {
  describe('worldToIsometric', () => {
    it('should convert world coordinates to isometric', () => {
      const result = worldToIsometric(5, 0, 3);
      expect(result).toEqual([2, 4]);
    });

    it('should handle negative coordinates', () => {
      const result = worldToIsometric(-5, 0, -3);
      expect(result).toEqual([-2, -4]);
    });

    it('should handle zero coordinates', () => {
      const result = worldToIsometric(0, 0, 0);
      expect(result).toEqual([0, 0]);
    });

    it('should handle y-axis offset', () => {
      const result = worldToIsometric(4, 2, 4);
      expect(result[1]).toBe(2); // y affects vertical position
    });
  });

  describe('isometricToWorld', () => {
    it('should convert isometric back to world coordinates', () => {
      const worldPos = [5, 0, 3];
      const isoPos = worldToIsometric(...worldPos);
      const reconstructed = isometricToWorld(isoPos[0], isoPos[1], 0);

      expect(reconstructed[0]).toBeCloseTo(worldPos[0]);
      expect(reconstructed[2]).toBeCloseTo(worldPos[2]);
    });
  });

  describe('calculateDistance', () => {
    it('should calculate distance between two points', () => {
      const distance = calculateDistance([0, 0, 0], [3, 4, 0]);
      expect(distance).toBe(5); // 3-4-5 triangle
    });

    it('should return 0 for same point', () => {
      const distance = calculateDistance([5, 5, 5], [5, 5, 5]);
      expect(distance).toBe(0);
    });
  });
});
```

### Testing Configuration/Theme

**Example: Theme Colors**

```typescript
import { describe, it, expect } from 'vitest';
import { theme } from '../utils/themeColors';

describe('Theme Colors', () => {
  it('should have required color properties', () => {
    expect(theme.palette.brick).toBeDefined();
    expect(theme.palette.waterColor).toBeDefined();
    expect(theme.palette.waterEmissive).toBeDefined();
  });

  it('should use valid hex color format', () => {
    const hexRegex = /^#[0-9A-F]{6}$/i;
    Object.values(theme.palette).forEach(color => {
      if (typeof color === 'string' && color.startsWith('#')) {
        expect(color).toMatch(hexRegex);
      }
    });
  });

  it('should have consistent color intensity values', () => {
    expect(theme.palette.waterEmissiveIntensity).toBeGreaterThanOrEqual(0);
    expect(theme.palette.waterEmissiveIntensity).toBeLessThanOrEqual(10);
  });
});
```

---

## Integration Testing Patterns

### Testing React Components with Three.js

**Example: Testing Selectable Block**

```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import { SelectableBlock } from '../components/SelectableBlock';

describe('SelectableBlock', () => {
  it('should render without errors', () => {
    const { container } = render(
      <Canvas>
        <SelectableBlock
          id="test-block"
          position={[0, 0, 0]}
          isSelected={false}
          onSelect={vi.fn()}
        />
      </Canvas>
    );
    expect(container.firstChild).toBeDefined();
  });

  it('should call onSelect when clicked', async () => {
    const onSelect = vi.fn();

    const { container } = render(
      <Canvas>
        <SelectableBlock
          id="test-block"
          position={[0, 0, 0]}
          isSelected={false}
          onSelect={onSelect}
        />
      </Canvas>
    );

    // Note: Direct click testing in Three.js requires special setup
    // This is a simplified example
  });

  it('should apply selected styling when isSelected is true', () => {
    const { rerender } = render(
      <Canvas>
        <SelectableBlock
          id="test-block"
          position={[0, 0, 0]}
          isSelected={false}
          onSelect={vi.fn()}
        />
      </Canvas>
    );

    rerender(
      <Canvas>
        <SelectableBlock
          id="test-block"
          position={[0, 0, 0]}
          isSelected={true}
          onSelect={vi.fn()}
        />
      </Canvas>
    );

    // Verify selected state (material properties, etc.)
  });
});
```

### Testing Component State Management

**Example: Testing Selection System**

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import { SelectionManager } from '../components/SelectionManager';

describe('SelectionManager', () => {
  let onSelectionChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onSelectionChange = vi.fn();
  });

  it('should maintain selection state', () => {
    const { getByTestId } = render(
      <Canvas>
        <SelectionManager onSelectionChange={onSelectionChange} />
      </Canvas>
    );

    // Click first object
    fireEvent.click(getByTestId('block-1'));
    expect(onSelectionChange).toHaveBeenCalledWith(new Set(['block-1']));

    // Click second object (replace selection)
    fireEvent.click(getByTestId('block-2'));
    expect(onSelectionChange).toHaveBeenCalledWith(new Set(['block-2']));
  });

  it('should support multi-select with modifier key', () => {
    const { getByTestId } = render(
      <Canvas>
        <SelectionManager onSelectionChange={onSelectionChange} />
      </Canvas>
    );

    // Click first object
    fireEvent.click(getByTestId('block-1'));

    // Ctrl+click second object
    fireEvent.click(getByTestId('block-2'), { ctrlKey: true });

    expect(onSelectionChange).toHaveBeenLastCalledWith(
      new Set(['block-1', 'block-2'])
    );
  });

  it('should deselect when clicking selected object', () => {
    const { getByTestId } = render(
      <Canvas>
        <SelectionManager onSelectionChange={onSelectionChange} />
      </Canvas>
    );

    // Click to select
    fireEvent.click(getByTestId('block-1'));
    // Ctrl+click same object to deselect
    fireEvent.click(getByTestId('block-1'), { ctrlKey: true });

    expect(onSelectionChange).toHaveBeenLastCalledWith(new Set());
  });
});
```

---

## Async Testing Patterns

### Testing Async Operations

**Example: Testing Data Loading**

```typescript
import { describe, it, expect, vi } from 'vitest';

describe('Async Operations', () => {
  it('should load data asynchronously', async () => {
    const data = await fetchLevelData();
    expect(data).toBeDefined();
    expect(data.objects).toBeInstanceOf(Array);
  });

  it('should handle loading errors', async () => {
    vi.mock('../api/loadLevel', () => ({
      loadLevel: vi.fn().mockRejectedValue(new Error('Network error'))
    }));

    await expect(loadLevel()).rejects.toThrow('Network error');
  });

  it('should timeout on slow responses', async () => {
    vi.useFakeTimers();

    const promise = slowAsyncOperation();
    vi.advanceTimersByTime(5000);

    await expect(promise).rejects.toThrow('Timeout');

    vi.useRealTimers();
  });
});
```

---

## Mocking Patterns

### Mocking Functions

**Example: Mocking API Calls**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getUserData } from '../utils/api';

vi.mock('../utils/api');

describe('User Data', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle successful data fetch', async () => {
    const mockData = { id: 1, name: 'Test User' };
    vi.mocked(getUserData).mockResolvedValue(mockData);

    const result = await getUserData('123');
    expect(result).toEqual(mockData);
  });

  it('should handle fetch errors', async () => {
    vi.mocked(getUserData).mockRejectedValue(new Error('API Error'));

    await expect(getUserData('123')).rejects.toThrow('API Error');
  });

  it('should call API with correct parameters', async () => {
    vi.mocked(getUserData).mockResolvedValue({});

    await getUserData('test-id');

    expect(getUserData).toHaveBeenCalledWith('test-id');
    expect(getUserData).toHaveBeenCalledTimes(1);
  });
});
```

### Mocking Three.js Objects

**Example: Mocking Meshes**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as THREE from 'three';

describe('Three.js Mocking', () => {
  let mockMesh: THREE.Mesh;

  beforeEach(() => {
    mockMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: '#888888' })
    );
  });

  it('should update mesh properties', () => {
    mockMesh.position.set(5, 10, 3);
    expect(mockMesh.position.x).toBe(5);
    expect(mockMesh.position.y).toBe(10);
    expect(mockMesh.position.z).toBe(3);
  });

  it('should rotate mesh', () => {
    mockMesh.rotation.y = Math.PI / 4;
    expect(mockMesh.rotation.y).toBeCloseTo(Math.PI / 4);
  });

  it('should update material properties', () => {
    const material = mockMesh.material as THREE.MeshStandardMaterial;
    material.color.setHex(0xff0000);
    expect(material.color.getHexString()).toBe('ff0000');
  });
});
```

---

## Snapshot Testing Patterns

### Using Snapshots for Component Structure

**Example: Snapshot Test**

```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import { LevelOne } from '../components/Scene/LevelOne';

describe('LevelOne Snapshot', () => {
  it('should match snapshot', () => {
    const { container } = render(
      <Canvas>
        <LevelOne
          selectedIds={new Set()}
          onSelect={() => {}}
        />
      </Canvas>
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
```

**Updating Snapshots**:
```bash
npm run test -- -u  # Update all snapshots
npm run test -- geometry -u  # Update specific file snapshots
```

---

## Performance Testing Patterns

### Testing Animation Performance

**Example: Animation Performance**

```typescript
import { describe, it, expect, vi } from 'vitest';

describe('Animation Performance', () => {
  it('should animate without excessive re-renders', () => {
    let renderCount = 0;
    const mockUseFrame = vi.fn(cb => {
      for (let i = 0; i < 100; i++) {
        renderCount++;
        cb({ clock: { elapsedTime: i * 0.016 }, delta: 0.016 }, 0.016);
      }
    });

    // Component using animation
    // Should complete 100 frames efficiently

    expect(renderCount).toBe(100);
  });

  it('should calculate delta time correctly', () => {
    const deltas: number[] = [];
    const expectedDelta = 1 / 60; // 60 FPS

    for (let i = 0; i < 60; i++) {
      deltas.push(expectedDelta);
    }

    const avgDelta = deltas.reduce((a, b) => a + b) / deltas.length;
    expect(avgDelta).toBeCloseTo(expectedDelta);
  });
});
```

---

## Fixture Patterns

### Creating Test Fixtures

**Example: Common Test Data**

```typescript
// tests/fixtures/geometryFixtures.ts
import * as THREE from 'three';

export const mockPositions = {
  origin: [0, 0, 0] as [number, number, number],
  rightForward: [5, 0, 3] as [number, number, number],
  elevated: [2, 5, 2] as [number, number, number],
};

export const mockGeometries = {
  box: () => new THREE.BoxGeometry(1, 1, 1),
  sphere: () => new THREE.SphereGeometry(1, 32, 32),
  plane: () => new THREE.PlaneGeometry(1, 1),
};

export const mockMaterials = {
  standard: () => new THREE.MeshStandardMaterial({ color: '#888888' }),
  basic: () => new THREE.MeshBasicMaterial({ color: '#ffffff' }),
};

// Usage in tests
import { mockPositions, mockGeometries } from '../fixtures/geometryFixtures';

it('should position object correctly', () => {
  const [x, y, z] = mockPositions.rightForward;
  expect(x).toBe(5);
});
```

---

## Best Practices

### Writing Good Tests

**DO**:
- Test one thing per test
- Use descriptive test names
- Follow Arrange-Act-Assert pattern
- Test both happy path and error cases
- Keep tests independent (no interdependencies)
- Clean up after tests (beforeEach/afterEach)

**DON'T**:
- Test implementation details (test behavior)
- Write overly complex tests (keep them simple)
- Share state between tests
- Use hardcoded values (use fixtures)
- Skip tests (mark as pending instead: `it.skip(...)`)

### Test Coverage

**Target Coverage**:
- Utility functions: 95%+
- React components: 80%+
- Three.js integrations: 60%+

**Measuring Coverage**:
```bash
npm run test -- --coverage
```

**Coverage Report Locations**:
- Terminal output: Immediate summary
- HTML report: `coverage/index.html` (if configured)

### Running Specific Tests

```bash
# All geometry tests
npm run test -- geometry

# All tests in utils folder
npm run test -- utils

# Test matching a pattern
npm run test -- --grep "should handle"

# Single test file
npm run test -- tests/utils/geometry.test.ts

# Watch specific tests
npm run test:watch -- geometry
```

---

## Debugging Tests

### Using Debug Mode

```bash
# Run tests with debugging output
npm run test -- --reporter=verbose

# Watch mode with debugging
npm run test:watch -- --reporter=verbose
```

### Console Output in Tests

```typescript
it('should debug information', () => {
  const data = processData();
  console.log('Processed data:', data);  // Visible with --reporter=verbose
  expect(data).toBeDefined();
});
```

### Inspecting Test State

```typescript
it('should inspect state', () => {
  const state = createState();

  // Use console output for inspection
  console.log('State:', JSON.stringify(state, null, 2));

  // Or use debugging assertions
  expect(state).toBeDefined();
  expect(state.values).toBeInstanceOf(Array);
});
```

---

## Continuous Integration Patterns

### Pre-commit Testing

**Setup git hook** to run tests before commit:
```bash
# .husky/pre-commit
npm run test
```

### Build Pipeline

**Recommended CI steps**:
1. Run TypeScript check: `tsc --noEmit`
2. Run tests: `npm run test`
3. Build project: `npm run build`
4. Deploy if successful

---

## Related Documentation

- [Common Tasks](./COMMON_TASKS.md) - General development tasks
- [Code Patterns](./CODE_PATTERNS.md) - Reusable code patterns
- [Tech Stack](../context/TECH_STACK.md) - Testing frameworks and tools
- [Architecture](../context/ARCHITECTURE.md) - System design for testing

---

**Last Updated**: November 20, 2025
**Scope**: Testing strategies and patterns using Vitest
**Audience**: Developers writing and maintaining test suites

