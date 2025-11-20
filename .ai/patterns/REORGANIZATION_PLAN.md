# Monument Repository: Master Reorganization Plan

**Date**: 2025-11-20
**Status**: READY FOR IMPLEMENTATION
**Estimated Total Effort**: 10-15 hours
**Risk Level**: MEDIUM (manageable with phased approach)

---

## Executive Summary

This plan consolidates findings from four comprehensive analyses to reorganize the Monument Valley demo into a scalable, LLM-friendly, open-source standard structure. The reorganization addresses critical documentation chaos, architectural disorganization, and positions the project for efficient AI-assisted development.

**Core Objectives:**
1. Eliminate documentation chaos (28 scattered files → organized structure)
2. Establish LLM-friendly development environment
3. Align with Three.js/React Three Fiber ecosystem standards
4. Separate human-readable docs from AI context
5. Maintain build integrity throughout migration

**Key Findings from Analysis:**
- **Current Structure**: Critical disorganization with 16+ root-level docs
- **Best Practices**: pmndrs/Three.js standards provide clear patterns
- **Documentation**: 28 files, ~245KB, high redundancy
- **Code Quality**: Strong (8.5/10) with clear improvement paths

---

## Table of Contents

1. [Before/After Structure Comparison](#1-beforeafter-structure-comparison)
2. [Migration Strategy Overview](#2-migration-strategy-overview)
3. [Phase 1: Documentation Consolidation](#3-phase-1-documentation-consolidation)
4. [Phase 2: Code Architecture Refinement](#4-phase-2-code-architecture-refinement)
5. [Phase 3: LLM Context Organization](#5-phase-3-llm-context-organization)
6. [Phase 4: Open Source Standards](#6-phase-4-open-source-standards)
7. [Testing & Validation Plan](#7-testing--validation-plan)
8. [Risk Assessment & Mitigation](#8-risk-assessment--mitigation)
9. [Rollback Procedures](#9-rollback-procedures)
10. [Implementation Checklist](#10-implementation-checklist)

---

## 1. Before/After Structure Comparison

### Current Structure (Problems Highlighted)

```
monument/
├── .git/
├── .github/workflows/
├── claudedocs/                          # ⚠️ Underutilized (1 file)
├── research/                            # ⚠️ Isolated from implementation
├── tests/                               # ⚠️ Separate from application tests
├── monument-valley-demo/               # ⚠️ Unclear naming (is this the app?)
│   ├── components/
│   │   ├── Scene/
│   │   │   └── BuildingBlocks.tsx      # ⚠️ 531 LOC monolith
│   │   ├── UI/
│   │   ├── Research/
│   │   └── Dev/
│   ├── contexts/
│   ├── services/
│   ├── themes/
│   ├── utils/
│   ├── data/                           # ❌ EMPTY DIRECTORY
│   ├── [7 SCATTERED DOC FILES]         # ⚠️ Should be in /docs
│   └── [config files]
├── README.md                            # ⚠️ MINIMAL (553 bytes)
├── milestones.md
├── [16 SCATTERED DOC FILES]            # ❌ CRITICAL PROBLEM
│   ├── WATER_BRIDGE_*.md (8 files)     # ⚠️ Massive duplication
│   ├── IMPLEMENTATION_GUIDE.md
│   ├── QUICK_REFERENCE.md
│   ├── VISUAL_COMPARISON.md
│   └── [more scattered docs...]
└── [no LICENSE, CONTRIBUTING, etc.]    # ❌ Missing OSS files
```

**Critical Issues:**
- 28 documentation files scattered across 4 locations
- 8+ water feature docs with significant duplication
- No clear "official docs" vs "AI context" separation
- Empty directories (data/)
- Missing standard open source files
- Monolithic components (BuildingBlocks.tsx)

### Target Structure (Solution)

```
monument/
├── .git/
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── .ai/                                # ✅ NEW: AI-specific context
│   ├── README.md                       # Context routing guide
│   ├── context/
│   │   ├── architecture.md             # System design
│   │   ├── three-patterns.md           # Three.js implementation patterns
│   │   ├── component-api.md            # Component interfaces
│   │   └── features/
│   │       ├── water-system.md         # Consolidated water docs
│   │       ├── alignment-system.md
│   │       └── impossible-geometry.md
│   ├── prompts/
│   │   ├── system-instructions.md
│   │   └── task-templates/
│   └── history/                        # Design decisions archive
│       ├── water-bridge-evolution.md
│       └── alignment-fix.md
│
├── docs/                               # ✅ NEW: Human documentation
│   ├── README.md                       # Navigation hub
│   ├── getting-started.md
│   ├── architecture/
│   │   ├── overview.md
│   │   ├── component-hierarchy.md
│   │   ├── state-management.md
│   │   └── decision-records/           # ADRs
│   ├── guides/
│   │   ├── three-js-integration.md     # From research/guide.md
│   │   ├── impossible-geometry.md
│   │   ├── adding-levels.md
│   │   └── performance-optimization.md
│   ├── api/
│   │   ├── components/
│   │   │   ├── scene-components.md
│   │   │   ├── ui-components.md
│   │   │   └── building-blocks.md
│   │   └── utilities.md
│   ├── development/
│   │   ├── setup.md
│   │   ├── testing.md                  # Consolidated test docs
│   │   ├── debugging.md
│   │   └── dev-tools.md
│   └── features/
│       └── water-features.md           # PUBLIC water feature guide
│
├── src/                                # ✅ RENAMED: from monument-valley-demo
│   ├── components/
│   │   ├── Scene/
│   │   │   ├── blocks/                 # ✅ NEW: Split BuildingBlocks
│   │   │   │   ├── BaseBlock.tsx
│   │   │   │   ├── WalledBlock.tsx
│   │   │   │   ├── WaterBlock.tsx
│   │   │   │   ├── WaterfallBlock.tsx
│   │   │   │   ├── TowerBlock.tsx
│   │   │   │   ├── DomeCap.tsx
│   │   │   │   ├── ArchBlock.tsx
│   │   │   │   ├── Character.tsx
│   │   │   │   └── index.ts            # Barrel export
│   │   │   ├── LevelOne.tsx
│   │   │   ├── EnginePreview.tsx
│   │   │   ├── FloatingParticles.tsx
│   │   │   ├── MovableWrapper.tsx      # ✅ EXTRACTED from LevelOne
│   │   │   ├── PathBuilder.tsx         # ✅ EXTRACTED helper
│   │   │   └── index.ts
│   │   ├── UI/
│   │   │   ├── Header.tsx
│   │   │   ├── IntroScreen.tsx
│   │   │   ├── LevelSelect.tsx
│   │   │   └── index.ts
│   │   ├── Research/
│   │   │   ├── PlannerPanel.tsx
│   │   │   ├── ResearchCard.tsx
│   │   │   └── index.ts
│   │   └── Dev/
│   │       ├── AlignmentVisualizer.tsx
│   │       └── index.ts
│   ├── contexts/
│   │   ├── ThemeContext.tsx
│   │   └── index.ts
│   ├── services/
│   │   ├── geminiService.ts
│   │   └── index.ts
│   ├── themes/
│   │   ├── levelThemes.ts
│   │   ├── types.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── isometricAlignment.ts
│   │   ├── wallGeometry.ts             # ✅ NEW: Extracted from blocks
│   │   └── index.ts
│   ├── hooks/                          # ✅ NEW: Custom hooks
│   │   ├── useSelection.ts
│   │   ├── usePositionTracking.ts
│   │   └── index.ts
│   ├── types/                          # ✅ NEW: Organized types
│   │   ├── index.ts
│   │   ├── scene.types.ts
│   │   ├── research.types.ts
│   │   └── app.types.ts
│   ├── App.tsx
│   └── main.tsx                        # RENAMED from index.tsx
│
├── public/                             # Static assets
│   ├── assets/
│   │   ├── models/
│   │   └── textures/
│   └── favicon.svg
│
├── tests/                              # ✅ MOVED: from root
│   ├── unit/
│   │   ├── utils/
│   │   └── components/
│   ├── integration/
│   └── e2e/
│
├── scripts/                            # ✅ NEW: Build/deploy automation
│   ├── setup-dev.sh
│   ├── deploy.sh
│   └── validate-structure.sh
│
├── claudedocs/                         # ✅ ENHANCED: Analysis artifacts
│   ├── README.md                       # Explains purpose
│   ├── analysis_current_structure.md
│   ├── research_3d_web_standards.md
│   ├── doc_inventory.md
│   ├── analysis_component_architecture.md
│   └── REORGANIZATION_PLAN.md (this file)
│
├── CLAUDE.md                           # ✅ NEW: Project context for AI
├── README.md                           # ✅ EXPANDED: Project overview
├── LICENSE                             # ✅ NEW: MIT License
├── CONTRIBUTING.md                     # ✅ NEW: Development guidelines
├── CHANGELOG.md                        # ✅ NEW: Version history
├── CODE_OF_CONDUCT.md                  # ✅ NEW: Community guidelines
├── milestones.md                       # Updated with progress
│
├── package.json                        # Updated paths
├── tsconfig.json                       # Updated paths
├── vite.config.ts                      # Updated paths
├── vitest.config.ts
└── .gitignore
```

**Improvements:**
- ✅ Clear separation: `.ai/` (AI context) vs `docs/` (human docs)
- ✅ Consolidated water documentation (8 files → 2 files)
- ✅ Organized component architecture (split monoliths)
- ✅ Standard open source files present
- ✅ Logical directory naming (`src/` instead of `monument-valley-demo/`)
- ✅ No orphaned or empty directories

---

## 2. Migration Strategy Overview

### Guiding Principles

1. **Non-Destructive Migration**: Preserve git history with `git mv`
2. **Incremental Validation**: Test after each phase
3. **Build Integrity**: Keep application running throughout
4. **Context Preservation**: Don't lose important implementation details
5. **Rollback Ready**: Tag before each major change

### Phase Overview

| Phase | Focus | Duration | Risk | Priority |
|-------|-------|----------|------|----------|
| **Phase 1** | Documentation Consolidation | 2-3 hours | LOW | CRITICAL |
| **Phase 2** | Code Architecture Refinement | 3-4 hours | MEDIUM | HIGH |
| **Phase 3** | LLM Context Organization | 1-2 hours | LOW | HIGH |
| **Phase 4** | Open Source Standards | 2-3 hours | LOW | MEDIUM |
| **Validation** | Testing & Verification | 2-3 hours | N/A | CRITICAL |

**Total Estimated Time**: 10-15 hours

### Pre-Migration Requirements

```bash
# 1. Ensure clean git state
git status  # Should show "working tree clean"

# 2. Create migration branch
git checkout -b feature/repository-reorganization

# 3. Tag current state for rollback
git tag pre-reorganization

# 4. Verify tests pass
cd monument-valley-demo
npm test

# 5. Verify build works
npm run build
```

---

## 3. Phase 1: Documentation Consolidation

**Goal**: Reduce 28 scattered documentation files to organized structure
**Duration**: 2-3 hours
**Risk Level**: LOW

### Step 1.1: Create Documentation Directories

```bash
# Create new documentation structure
mkdir -p docs/{architecture,guides,api/components,development,features}
mkdir -p .ai/{context/features,prompts,history}
mkdir -p claudedocs  # Already exists, just verify
```

### Step 1.2: Consolidate Water Feature Documentation

**Current State**: 8 separate water-related files
**Target**: 2 comprehensive documents

#### Water Feature Files to Consolidate

```bash
# Source files (root level)
WATER_BRIDGE_DESIGN.md              (4.9 KB)
WATER_BRIDGE_SUMMARY.md             (5.5 KB)
WATER_BRIDGE_GEOMETRY.txt           (6.6 KB)
WATER_BRIDGE_VISUAL.txt             (12 KB)
WATER_BRIDGE_INDEX.md               (9.0 KB)
WATER_BRIDGE_QUICK_REF.txt          (7.8 KB)
WATER_FLOW_CONNECTION_DESIGN.md     (16 KB)
WATER_CONNECTION_INDEX.md           (16 KB)
WATER_CONNECTION_SUMMARY.md         (12 KB)
WATER_BRIDGE_IMPLEMENTATION.tsx     (4.2 KB)
```

#### Consolidation Commands

```bash
# Create master water features document for humans
cat > docs/features/water-features.md << 'EOF'
# Water Features System

*Last Updated: 2025-11-20*

## Overview
[Executive summary from WATER_BRIDGE_SUMMARY.md]

## Architecture
[Technical design from WATER_BRIDGE_DESIGN.md]

## Implementation Guide
[Copy-paste code from WATER_BRIDGE_SUMMARY.md]

## Geometry & Mathematics
[Key diagrams from WATER_BRIDGE_GEOMETRY.txt]
[Calculations from WATER_BRIDGE_VISUAL.txt]

## Flow Connections
[Design from WATER_FLOW_CONNECTION_DESIGN.md]

## Fine-Tuning Parameters
[Quick reference from WATER_BRIDGE_QUICK_REF.txt]

## Code Example
\`\`\`typescript
[WATER_BRIDGE_IMPLEMENTATION.tsx content]
\`\`\`

## Troubleshooting
[Common issues section]
EOF

# Create AI context document
cat > .ai/context/features/water-system.md << 'EOF'
# Water System - AI Implementation Context

## Problem Statement
[From WATER_BRIDGE_DESIGN.md]

## Solution Architecture
[Detailed technical approach]

## Key Implementation Patterns
- Procedural water texture generation
- Flow animation with direction vectors
- Height-based positioning
- Z-fighting prevention strategies

## Code Patterns
[Annotated code examples with explanations]

## Testing Approach
[Validation strategy]

## Known Limitations
[Current constraints and future improvements]
EOF

# Archive original files
mkdir -p .ai/history/water-bridge-archive
git mv WATER_BRIDGE_*.{md,txt} .ai/history/water-bridge-archive/
git mv WATER_CONNECTION_*.md .ai/history/water-bridge-archive/
git mv WATER_FLOW_CONNECTION_DESIGN.md .ai/history/water-bridge-archive/
git mv WATER_BRIDGE_IMPLEMENTATION.tsx .ai/history/water-bridge-archive/
```

### Step 1.3: Move Implementation Guides

```bash
# Move to docs/guides/
git mv IMPLEMENTATION_GUIDE.md docs/guides/implementation.md
git mv QUICK_REFERENCE.md docs/guides/quick-reference.md
git mv research/guide.md docs/guides/three-js-integration.md

# Move visual comparison if it exists
[ -f VISUAL_COMPARISON.md ] && git mv VISUAL_COMPARISON.md docs/development/visual-comparison.md
```

### Step 1.4: Organize Testing Documentation

```bash
# Create consolidated testing guide
mkdir -p docs/development

# Consolidate test docs
cat > docs/development/testing.md << 'EOF'
# Testing Guide

## Overview
[From monument-valley-demo/TEST_README.md]

## Running Tests
[Setup and commands]

## Test Categories
[Structure and organization]

## Understanding Results
[Interpretation guide]

## Validation Reports
[Link to historical validation reports]

See also:
- [Test Summary](../../claudedocs/test-summary.md)
- [Validation Complete Report](../../claudedocs/validation-complete.md)
EOF

# Move test docs to claudedocs (as artifacts)
git mv monument-valley-demo/TEST_README.md claudedocs/test-readme-original.md
git mv monument-valley-demo/TEST_SUMMARY.md claudedocs/test-summary.md
git mv monument-valley-demo/VALIDATION_COMPLETE.md claudedocs/validation-complete.md
git mv monument-valley-demo/VALIDATION_REPORT.md claudedocs/validation-report.md
git mv TESTING_COMPLETE.txt claudedocs/testing-complete.txt
```

### Step 1.5: Organize Research & Investigation Docs

```bash
# Move isometric research to AI context
git mv claudedocs/isometric_alignment_research.md .ai/context/features/alignment-system.md

# Archive investigation docs
mkdir -p .ai/history/investigations
git mv ALIGNMENT_VISUALIZER_FIX.md .ai/history/investigations/
git mv monument-valley-demo/CAMERA_INVESTIGATION.md .ai/history/investigations/
git mv monument-valley-demo/DEBUG_ALIGNMENT.md .ai/history/investigations/ 2>/dev/null || true
```

### Step 1.6: Clean Up Navigation Indices

```bash
# Remove redundant index files
git rm WATER_BRIDGE_INDEX.md
git rm WATER_CONNECTION_INDEX.md

# Keep monument-valley-demo/INDEX.md for now (will be updated in Phase 2)
```

### Step 1.7: Organize Development Tools Documentation

```bash
# Dev component docs stay with components
# Just ensure they're referenced in main docs

# Create dev tools documentation
cat > docs/development/dev-tools.md << 'EOF'
# Development Tools

## AlignmentVisualizer

[Content from monument-valley-demo/components/Dev/README.md]

### Usage
[Examples and activation]

### Implementation
[Link to component code]

See also:
- [Component README](../../src/components/Dev/README.md)
EOF
```

### Step 1.8: Update Milestones

```bash
# Keep milestones.md at root, but update with current progress
# Manual edit required
```

### Phase 1 Validation

```bash
# Verify no broken builds
cd monument-valley-demo
npm run dev  # Should start without errors
npm run build  # Should complete successfully

# Verify git status
git status
# Should show moved files, new docs, deleted redundant files

# Commit Phase 1
git add -A
git commit -m "Phase 1: Consolidate documentation into organized structure

- Consolidated 8 water feature docs into 2 master documents
- Moved implementation guides to docs/guides/
- Organized testing documentation in docs/development/
- Created .ai/ directory for AI-specific context
- Archived investigation reports
- Removed redundant navigation indices

Total reduction: 28 scattered files → ~15 organized files
"
```

---

## 4. Phase 2: Code Architecture Refinement

**Goal**: Improve component organization and code structure
**Duration**: 3-4 hours
**Risk Level**: MEDIUM (requires code changes and path updates)

### Step 2.1: Rename monument-valley-demo to src

```bash
# Rename main application directory
git mv monument-valley-demo src

# Update package.json paths
# Manual edit: package.json
# Change all references from "monument-valley-demo" to "src"

# Update vite.config.ts
# Manual edit: vite.config.ts
# Update root path if specified

# Update tsconfig.json
# Manual edit: tsconfig.json
# Update paths and includes
```

**package.json changes:**
```json
{
  "scripts": {
    "dev": "vite",  // Vite auto-detects from root
    "build": "vite build",
    "test": "vitest"
  }
}
```

**tsconfig.json changes:**
```json
{
  "include": ["src/**/*"],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**vite.config.ts changes:**
```typescript
export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist'
  }
})
```

### Step 2.2: Split BuildingBlocks.tsx Monolith

**Current**: 531 LOC monolithic file
**Target**: Individual block component files

```bash
# Create blocks directory
mkdir -p src/components/Scene/blocks

# Create individual block files
# (Manual implementation required - see code extraction below)

# Create barrel export
cat > src/components/Scene/blocks/index.ts << 'EOF'
export { BaseBlock } from './BaseBlock'
export { WalledBlock } from './WalledBlock'
export { WaterBlock } from './WaterBlock'
export { WaterfallBlock } from './WaterfallBlock'
export { TowerBlock } from './TowerBlock'
export { DomeCap } from './DomeCap'
export { ArchBlock } from './ArchBlock'
export { Character } from './Character'
EOF
```

**Block Extraction Pattern:**

For each block type, create a file like `BaseBlock.tsx`:

```typescript
// src/components/Scene/blocks/BaseBlock.tsx
import { useTheme } from '@/contexts/ThemeContext'
import { useMemo } from 'react'
import * as THREE from 'three'

interface BaseBlockProps {
  position: [number, number, number]
  color?: string
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
}

export function BaseBlock({ position, color, rotation, scale = 1 }: BaseBlockProps) {
  const { theme } = useTheme()

  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), [])

  const blockColor = color || theme.palette.brick

  return (
    <mesh
      position={position}
      rotation={rotation}
      scale={scale}
      geometry={geometry}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color={blockColor} />
    </mesh>
  )
}
```

**Update imports in LevelOne.tsx:**

```typescript
// Before
import { BaseBlock, WalledBlock, WaterBlock, /* etc */ } from './BuildingBlocks'

// After
import {
  BaseBlock,
  WalledBlock,
  WaterBlock,
  WaterfallBlock,
  TowerBlock,
  DomeCap,
  ArchBlock,
  Character
} from './blocks'
```

### Step 2.3: Extract MovableWrapper from LevelOne

```bash
# Create new component file
touch src/components/Scene/MovableWrapper.tsx
```

**MovableWrapper.tsx** (extract from LevelOne.tsx):

```typescript
// src/components/Scene/MovableWrapper.tsx
import { useThree } from '@react-three/fiber'
import { TransformControls, Html } from '@react-three/drei'
import { useRef, useLayoutEffect } from 'react'
import type { Vector3 } from 'three'

interface MovableWrapperProps {
  id: string
  initialPosition: [number, number, number]
  isSelected: boolean
  onSelect: (id: string, isMulti: boolean) => void
  onPositionChange?: (id: string, position: Vector3) => void
  children: React.ReactNode
}

export function MovableWrapper({
  id,
  initialPosition,
  isSelected,
  onSelect,
  onPositionChange,
  children
}: MovableWrapperProps) {
  const groupRef = useRef<THREE.Group>(null)
  const controlsRef = useRef<any>(null)
  const { camera, gl } = useThree()

  useLayoutEffect(() => {
    if (groupRef.current && onPositionChange) {
      onPositionChange(id, groupRef.current.position)
    }
  }, [id, onPositionChange])

  useLayoutEffect(() => {
    const controls = controlsRef.current
    if (!controls) return

    const handleChange = () => {
      if (groupRef.current && onPositionChange) {
        onPositionChange(id, groupRef.current.position)
      }
    }

    controls.addEventListener('change', handleChange)
    return () => controls.removeEventListener('change', handleChange)
  }, [id, onPositionChange])

  return (
    <group ref={groupRef} position={initialPosition}>
      {isSelected && (
        <TransformControls
          ref={controlsRef}
          object={groupRef.current!}
          mode="translate"
          camera={camera}
          domElement={gl.domElement}
        />
      )}

      <group
        onClick={(e) => {
          e.stopPropagation()
          onSelect(id, e.shiftKey)
        }}
      >
        {children}
      </group>

      <Html position={[0, 1.5, 0]} center>
        <div className="bg-black/70 text-white px-2 py-1 rounded text-xs">
          {id}
        </div>
      </Html>
    </group>
  )
}
```

**Update LevelOne.tsx** to import and use MovableWrapper.

### Step 2.4: Extract PathBuilder Helper

```bash
touch src/components/Scene/PathBuilder.tsx
```

**PathBuilder.tsx:**

```typescript
// src/components/Scene/PathBuilder.tsx
interface PathBuilderProps {
  start: [number, number, number]
  direction: [number, number, number]
  count: number
  renderBlock: (position: [number, number, number], index: number) => React.ReactNode
}

export function PathBuilder({ start, direction, count, renderBlock }: PathBuilderProps) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const position: [number, number, number] = [
          start[0] + direction[0] * i,
          start[1] + direction[1] * i,
          start[2] + direction[2] * i
        ]
        return renderBlock(position, i)
      })}
    </>
  )
}
```

### Step 2.5: Create Custom Hooks Directory

```bash
mkdir -p src/hooks
```

**Create useSelection.ts:**

```typescript
// src/hooks/useSelection.ts
import { useState, useCallback } from 'react'

export function useSelection<T = string>() {
  const [selectedIds, setSelectedIds] = useState<Set<T>>(new Set())

  const handleSelect = useCallback((id: T, isMulti: boolean) => {
    setSelectedIds(prev => {
      const next = new Set(isMulti ? prev : [])
      if (next.has(id)) {
        if (isMulti) next.delete(id)
        else next.add(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  return {
    selectedIds,
    handleSelect,
    clearSelection
  }
}
```

**Create usePositionTracking.ts:**

```typescript
// src/hooks/usePositionTracking.ts
import { useState, useCallback } from 'react'
import type { Vector3 } from 'three'

export function usePositionTracking() {
  const [objectPositions, setObjectPositions] = useState<Map<string, Vector3>>(new Map())

  const handlePositionChange = useCallback((id: string, position: Vector3) => {
    setObjectPositions(prev => new Map(prev).set(id, position))
  }, [])

  return {
    objectPositions,
    handlePositionChange
  }
}
```

**Create hooks barrel export:**

```typescript
// src/hooks/index.ts
export { useSelection } from './useSelection'
export { usePositionTracking } from './usePositionTracking'
```

### Step 2.6: Organize Types

```bash
mkdir -p src/types
```

**Create scene.types.ts:**

```typescript
// src/types/scene.types.ts
import type { Vector3 } from 'three'

export type Vector3Tuple = [number, number, number]

export interface BlockProps {
  position: Vector3Tuple
  color?: string
  rotation?: Vector3Tuple
  scale?: number | Vector3Tuple
}

export interface WaterBlockProps extends BlockProps {
  flowDirection?: [number, number]
}

export interface WalledBlockProps extends BlockProps {
  walls?: [boolean, boolean]
  endWalls?: [boolean, boolean]
}

export interface CharacterProps {
  position: Vector3Tuple
  type: 'ida' | 'totem'
}
```

**Create app.types.ts:**

```typescript
// src/types/app.types.ts
export type ViewMode = 'research' | 'prototype'

export interface AppState {
  showIntro: boolean
  isExiting: boolean
  showLevelSelect: boolean
  mode: ViewMode
  currentTheme: string
}
```

**Create research.types.ts** (move from types.ts):

```typescript
// src/types/research.types.ts
export enum ResearchCategory {
  MECHANICS = 'mechanics',
  ARCHITECTURE = 'architecture',
  ART_DIRECTION = 'art-direction',
  NEXT_STEPS = 'next-steps'
}

export interface ResearchItem {
  id: string
  category: ResearchCategory
  title: string
  content: string
  codeSnippet?: string
}
```

**Create types barrel export:**

```typescript
// src/types/index.ts
export * from './scene.types'
export * from './app.types'
export * from './research.types'
```

### Step 2.7: Extract Wall Geometry Utility

```bash
touch src/utils/wallGeometry.ts
```

**wallGeometry.ts:**

```typescript
// src/utils/wallGeometry.ts
export interface WallMetrics {
  leftWall: number
  rightWall: number
  frontWall: number
  backWall: number
}

export function calculateWallMetrics(
  isXAxis: boolean,
  walls: [boolean, boolean],
  endWalls: [boolean, boolean]
): WallMetrics {
  const [leftWall, rightWall] = walls
  const [frontWall, backWall] = endWalls

  const wallThickness = 0.05

  return {
    leftWall: leftWall ? wallThickness : 0,
    rightWall: rightWall ? wallThickness : 0,
    frontWall: frontWall ? wallThickness : 0,
    backWall: backWall ? wallThickness : 0
  }
}
```

### Step 2.8: Remove Empty Directories

```bash
# Remove empty data directory
rmdir src/data 2>/dev/null || true

# Verify no empty directories
find src -type d -empty
```

### Step 2.9: Move Tests to Root-Level tests/

```bash
# Move tests from src/utils/__tests__ to tests/unit/utils/
mkdir -p tests/unit/utils
git mv src/utils/__tests__/* tests/unit/utils/

# Remove empty test directory
rmdir src/utils/__tests__
```

### Phase 2 Validation

```bash
# Update imports and test
npm run dev  # Should start without errors

# Run tests
npm test  # Should pass

# Build
npm run build  # Should complete successfully

# TypeScript check
npx tsc --noEmit  # Should have no errors

# Commit Phase 2
git add -A
git commit -m "Phase 2: Refactor code architecture

- Renamed monument-valley-demo/ to src/
- Split BuildingBlocks.tsx into individual block components
- Extracted MovableWrapper to separate component
- Created PathBuilder helper component
- Created custom hooks (useSelection, usePositionTracking)
- Organized types into dedicated types/ directory
- Extracted wallGeometry utility
- Removed empty data/ directory
- Moved tests to root-level tests/ directory

Component size reduced: BuildingBlocks 531 LOC → 8 files ~60-80 LOC each
"
```

---

## 5. Phase 3: LLM Context Organization

**Goal**: Create AI-friendly context structure for efficient LLM-assisted development
**Duration**: 1-2 hours
**Risk Level**: LOW

### Step 3.1: Create .ai/README.md (Context Router)

```bash
cat > .ai/README.md << 'EOF'
# AI Development Context

This directory contains context optimized for AI-assisted development with Claude, GitHub Copilot, and other LLMs.

## Directory Structure

```
.ai/
├── context/           # Implementation context for AI
├── prompts/           # System instructions and templates
└── history/           # Archived design decisions
```

## Context Loading Guide

### For New Features

Load in order:
1. `context/architecture.md` - System overview
2. `context/three-patterns.md` - Three.js implementation patterns
3. `context/features/[relevant-feature].md` - Feature-specific context

### For Bug Fixes

Load in order:
1. `context/component-api.md` - Component interfaces
2. Relevant feature context from `context/features/`
3. Check `history/investigations/` for similar issues

### For Refactoring

Load:
1. `context/architecture.md`
2. `context/component-api.md`
3. `history/` for past refactoring decisions

## Context Files

### Architecture
- **architecture.md**: System design, component hierarchy, state management
- **three-patterns.md**: Three.js/R3F patterns and best practices
- **component-api.md**: Component interfaces and prop types

### Features
- **features/water-system.md**: Water rendering, animation, flow connections
- **features/alignment-system.md**: Isometric projection alignment utilities
- **features/impossible-geometry.md**: Penrose triangle implementation

### Prompts
- **system-instructions.md**: AI persona and behavioral instructions
- **task-templates/**: Common task prompt templates

### History
- **investigations/**: Past bug investigations and fixes
- **water-bridge-archive/**: Water feature design evolution

## Usage with LLMs

### Claude Code
Files are automatically indexed. Reference specific context files in conversation.

### GitHub Copilot
Add relevant context file content to comments at top of new files.

### Cursor AI
`.ai/` directory is automatically scanned for context.

## Maintenance

- Update context when architecture changes
- Archive investigations after resolution
- Keep prompts aligned with project conventions
EOF
```

### Step 3.2: Create .ai/context/architecture.md

```bash
cat > .ai/context/architecture.md << 'EOF'
# Monument Valley - System Architecture

*Last Updated: 2025-11-20*

## Overview

Monument Valley demo is a React Three Fiber (R3F) application implementing impossible geometry mechanics inspired by the original Monument Valley game.

**Tech Stack:**
- React 19 + TypeScript
- Three.js via React Three Fiber (R3F)
- @react-three/drei (helper components)
- Vite (build tool)
- Tailwind CSS (styling)

## Component Hierarchy

```
App (root orchestrator)
├── ThemeProvider (context)
│   └── Layout
│       ├── IntroScreen (conditional overlay)
│       ├── LevelSelect (conditional overlay)
│       ├── EnginePreview (Three.js canvas)
│       │   ├── Camera setup (orthographic for isometric)
│       │   ├── Lighting (theme-aware)
│       │   ├── Fog (theme-aware)
│       │   └── LevelOne (scene content)
│       │       ├── MovableWrapper (×12 objects)
│       │       │   └── Block primitives
│       │       ├── FloatingParticles
│       │       └── AlignmentVisualizer (dev only)
│       ├── PlannerPanel (research sidebar)
│       │   └── ResearchCard (×N)
│       └── Header (navigation)
```

## State Management

### Global State (App.tsx)
```typescript
interface AppState {
  showIntro: boolean
  isExiting: boolean
  showLevelSelect: boolean
  mode: 'research' | 'prototype'
  currentTheme: string
}
```

### Context: ThemeProvider
- Provides current theme configuration
- Accessed via `useTheme()` hook
- Contains palette, lighting, atmosphere config

### Local Component State
- **LevelOne**: selection (Set<string>), objectPositions (Map)
- **PlannerPanel**: researchItems, query, isLoading
- **EnginePreview**: isLocked (camera mode)

## Directory Structure

```
src/
├── components/
│   ├── Scene/           # 3D engine components
│   ├── UI/              # React UI overlay
│   ├── Research/        # Content/data UI
│   └── Dev/             # Development tools
├── contexts/            # React contexts
├── services/            # External services (Gemini API)
├── themes/              # Theme definitions
├── utils/               # Helper functions
├── hooks/               # Custom React hooks
└── types/               # TypeScript definitions
```

## Key Concepts

### Isometric Projection
Uses orthographic camera to create isometric view:
- Camera position: [20, 20, 20]
- Looking at: [0, 0, 0]
- 45° rotation creates "impossible geometry" effect

### Theme System
All visual aspects controlled by theme:
- Palette: brick colors, shadows, accents
- Lighting: ambient, directional, rim lights
- Atmosphere: background gradient, particles, fog

### Block Primitives
Atomic 3D components:
- BaseBlock, WalledBlock, WaterBlock, WaterfallBlock
- TowerBlock, DomeCap, ArchBlock, Character

### MovableWrapper Pattern
Higher-order component that adds:
- Transform controls (for dev mode)
- Selection state
- Position tracking
- Label overlay

## Build & Development

### Commands
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm test         # Run tests
npm run lint     # Lint code
```

### Configuration
- **vite.config.ts**: Build configuration
- **tsconfig.json**: TypeScript configuration
- **vitest.config.ts**: Test configuration

## Common Patterns

### Adding a New Block Type
1. Create `src/components/Scene/blocks/NewBlock.tsx`
2. Define props interface extending `BlockProps`
3. Use `useTheme()` for colors
4. Use `useMemo` for geometry
5. Export from `blocks/index.ts`

### Creating a New Level
1. Create `src/components/Scene/LevelTwo.tsx`
2. Use `useSelection` and `usePositionTracking` hooks
3. Compose MovableWrappers with block primitives
4. Add theme-specific configuration

### Accessing Theme
```typescript
import { useTheme } from '@/contexts/ThemeContext'

const { theme } = useTheme()
const color = theme.palette.brick
```

## Performance Considerations

- GPU detection: adapts quality based on device
- Memoization: geometries, textures, materials
- Lazy loading: heavy components use React.Suspense
- Frame rate optimization: conditional useFrame execution

## Development Tools

### AlignmentVisualizer
Debug tool for isometric projection alignment:
- Shows geometric vs visual midpoint differences
- Requires exactly 2 selected objects
- Activated via dev mode or localStorage flag

### Dev Mode
Enable with: `localStorage.setItem('alignmentVisDebug', 'true')`
EOF
```

### Step 3.3: Create .ai/context/three-patterns.md

```bash
cat > .ai/context/three-patterns.md << 'EOF'
# Three.js Implementation Patterns

*Reference for AI code generation*

## Canvas Setup (R3F)

```typescript
import { Canvas } from '@react-three/fiber'

<Canvas
  shadows
  dpr={[1, 2]}
  camera={{
    position: [20, 20, 20],
    fov: 45,
    near: 0.1,
    far: 1000
  }}
>
  {children}
</Canvas>
```

## Orthographic Camera (Isometric)

```typescript
import { OrthographicCamera } from '@react-three/drei'

<OrthographicCamera
  makeDefault
  position={[20, 20, 20]}
  zoom={50}
  near={0.1}
  far={1000}
/>
```

## Basic Mesh Component

```typescript
import * as THREE from 'three'
import { useMemo } from 'react'

function CustomBlock({ position, color }: BlockProps) {
  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), [])

  return (
    <mesh
      position={position}
      geometry={geometry}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color={color} />
    </mesh>
  )
}
```

## Animation with useFrame

```typescript
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

function RotatingBox() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta
    }
  })

  return <mesh ref={meshRef}>{/* geometry */}</mesh>
}
```

## Procedural Texture Generation

```typescript
import { useMemo } from 'react'
import * as THREE from 'three'

function createProceduralTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')!

  // Draw procedural pattern
  ctx.fillStyle = '#4a9eff'
  ctx.fillRect(0, 0, 512, 512)

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping

  return texture
}

function WaterBlock() {
  const texture = useMemo(() => createProceduralTexture(), [])

  return (
    <mesh>
      <boxGeometry args={[1, 0.1, 1]} />
      <meshStandardMaterial map={texture} transparent opacity={0.8} />
    </mesh>
  )
}
```

## Transform Controls (Movable Objects)

```typescript
import { TransformControls } from '@react-three/drei'
import { useRef } from 'react'
import { useThree } from '@react-three/fiber'

function MovableObject() {
  const groupRef = useRef<THREE.Group>(null)
  const { camera, gl } = useThree()

  return (
    <group ref={groupRef}>
      <TransformControls
        object={groupRef.current!}
        mode="translate"
        camera={camera}
        domElement={gl.domElement}
      />
      <mesh>{/* content */}</mesh>
    </group>
  )
}
```

## Lighting Setup

```typescript
function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
    </>
  )
}
```

## Theme-Aware Component

```typescript
import { useTheme } from '@/contexts/ThemeContext'

function ThemedBlock() {
  const { theme } = useTheme()

  return (
    <mesh>
      <boxGeometry />
      <meshStandardMaterial color={theme.palette.brick} />
    </mesh>
  )
}
```

## Performance: Memoization

```typescript
import { useMemo } from 'react'
import * as THREE from 'three'

function OptimizedBlock() {
  // Memoize geometry (created once)
  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), [])

  // Memoize material (created once per color)
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 'red' }),
    []
  )

  return <mesh geometry={geometry} material={material} />
}
```

## Common Pitfalls

### ❌ Don't: Create objects in render
```typescript
function BadComponent() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} /> {/* New geometry every render */}
    </mesh>
  )
}
```

### ✅ Do: Use useMemo
```typescript
function GoodComponent() {
  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), [])
  return <mesh geometry={geometry} />
}
```

### ❌ Don't: Mutate outside useFrame
```typescript
function BadAnimation() {
  const ref = useRef<THREE.Mesh>(null)
  ref.current.rotation.x += 0.01 // Wrong!
  return <mesh ref={ref} />
}
```

### ✅ Do: Use useFrame for animations
```typescript
function GoodAnimation() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.01
    }
  })
  return <mesh ref={ref} />
}
```
EOF
```

### Step 3.4: Create .ai/context/component-api.md

```bash
cat > .ai/context/component-api.md << 'EOF'
# Component API Reference

*Quick reference for AI code generation*

## Scene Components

### BaseBlock
```typescript
interface BaseBlockProps {
  position: [number, number, number]
  color?: string
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
}
```

### WalledBlock
```typescript
interface WalledBlockProps {
  position: [number, number, number]
  color?: string
  walls?: [boolean, boolean]        // [left, right]
  endWalls?: [boolean, boolean]     // [front, back]
}
```

### WaterBlock
```typescript
interface WaterBlockProps {
  position: [number, number, number]
  flowDirection?: [number, number]  // [x, z] flow vector
  height?: number
  walls?: [boolean, boolean]
  endWalls?: [boolean, boolean]
}
```

### WaterfallBlock
```typescript
interface WaterfallBlockProps {
  position: [number, number, number]
  height: number
  rotation?: [number, number, number]
}
```

### MovableWrapper
```typescript
interface MovableWrapperProps {
  id: string
  initialPosition: [number, number, number]
  isSelected: boolean
  onSelect: (id: string, isMulti: boolean) => void
  onPositionChange?: (id: string, position: Vector3) => void
  children: React.ReactNode
}
```

## Custom Hooks

### useSelection
```typescript
function useSelection<T = string>() {
  return {
    selectedIds: Set<T>
    handleSelect: (id: T, isMulti: boolean) => void
    clearSelection: () => void
  }
}
```

### usePositionTracking
```typescript
function usePositionTracking() {
  return {
    objectPositions: Map<string, Vector3>
    handlePositionChange: (id: string, position: Vector3) => void
  }
}
```

### useTheme
```typescript
function useTheme() {
  return {
    theme: LevelTheme
  }
}
```

## Types

### LevelTheme
```typescript
interface LevelTheme {
  id: string
  name: string
  palette: {
    brick: string
    brickDark: string
    shadow: string
    accent: string
    character: string
    path: string
    door: string
    water: string
    waterfall: string
  }
  lighting: {
    ambient: { intensity: number; color: string }
    directional: {
      position: [number, number, number]
      intensity: number
      color: string
    }
    rim?: {
      position: [number, number, number]
      intensity: number
      color: string
    }
  }
  atmosphere: {
    backgroundGradient: {
      from: string
      mid: string
      to: string
    }
    particles: {
      count: number
      spread: [number, number, number]
      opacity: number
      speed: number
    }
    fog?: {
      color: string
      near: number
      far: number
    }
  }
}
```

## Utility Functions

### isometricAlignment.ts
```typescript
// Project 3D point to 2D screen space
projectToScreen(
  point: Vector3,
  camera: Camera
): { x: number; y: number }

// Calculate visual midpoint between two 3D points
calculateVisualMidpoint(
  pointA: Vector3,
  pointB: Vector3,
  camera: Camera,
  options?: {
    maxIterations?: number
    tolerance?: number
  }
): {
  position: Vector3
  iterations: number
  converged: boolean
}

// Check if two points are visually aligned on screen
checkVisualAlignment(
  pointA: Vector3,
  pointB: Vector3,
  camera: Camera,
  threshold?: number
): boolean
```
EOF
```

### Step 3.5: Create CLAUDE.md Project Context

```bash
cat > CLAUDE.md << 'EOF'
# Monument Valley Demo - Project Context for AI

*This file provides context for AI assistants (Claude, GitHub Copilot, Cursor, etc.)*

## Project Overview

Monument Valley Demo is a React Three Fiber (R3F) web application that recreates impossible geometry mechanics inspired by the Monument Valley game series. The project demonstrates advanced 3D web techniques including isometric projection, procedural animation, and optical illusion construction.

## Quick Facts

- **Tech Stack**: React 19 + TypeScript + Three.js (via R3F) + Vite
- **Architecture**: Component-based with React Three Fiber patterns
- **State Management**: React Context + local state (no Redux)
- **Build Tool**: Vite 5.0
- **Testing**: Vitest + React Testing Library

## Repository Structure

```
monument/
├── .ai/               # AI-specific context (load for implementation details)
├── docs/              # Human documentation (architecture, guides, API)
├── src/               # Application source code
├── tests/             # Test suites (unit, integration)
├── public/            # Static assets
├── claudedocs/        # Analysis artifacts
├── CLAUDE.md          # This file (project context)
└── [config files]
```

## Key Directories

### src/components/
- **Scene/**: 3D engine components (blocks, levels, camera)
- **UI/**: React overlay components (header, modals)
- **Research/**: Content panel components
- **Dev/**: Development tools (alignment visualizer)

### .ai/
- **context/**: Implementation context for AI code generation
- **prompts/**: System instructions and task templates
- **history/**: Archived design decisions and investigations

### docs/
- **architecture/**: System design documentation
- **guides/**: Implementation guides (Three.js, features)
- **api/**: Component and utility API reference
- **development/**: Testing, debugging, dev tools

## Development Conventions

### Component Patterns

**Self-Contained Components**:
```typescript
function Block({ position, color }: BlockProps) {
  const { theme } = useTheme()
  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), [])

  return (
    <mesh position={position} geometry={geometry}>
      <meshStandardMaterial color={color || theme.palette.brick} />
    </mesh>
  )
}
```

**Custom Hooks for Logic**:
```typescript
const { selectedIds, handleSelect } = useSelection()
const { objectPositions, handlePositionChange } = usePositionTracking()
```

**Theme Access**:
```typescript
const { theme } = useTheme()
const brickColor = theme.palette.brick
```

### Naming Conventions

- **Components**: PascalCase (e.g., `BaseBlock.tsx`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useSelection.ts`)
- **Utils**: camelCase (e.g., `isometricAlignment.ts`)
- **Types**: PascalCase for interfaces/types (e.g., `BlockProps`)

### File Organization

- Group by feature/domain, not file type
- Keep related components in feature folders
- Use `index.ts` for barrel exports
- Co-locate types with components when local

### Performance Guidelines

- **Always memoize**: geometries, materials, textures
- **Use useFrame**: for animations and updates
- **Lazy load**: heavy components with React.Suspense
- **Monitor FPS**: conditional execution for low-end devices

## Key Concepts

### Isometric Projection
- Uses orthographic camera at [20, 20, 20] position
- Creates "impossible geometry" through carefully positioned blocks
- Visual alignment differs from geometric alignment

### Theme System
All visual aspects controlled by themes:
- Palette: brick, shadow, accent, water colors
- Lighting: ambient, directional, rim lights
- Atmosphere: background, particles, fog

### Block Primitives
Atomic 3D building blocks:
- `BaseBlock`: simple 1x1x1 cube
- `WalledBlock`: cube with configurable walls
- `WaterBlock`: animated water surface
- `WaterfallBlock`: vertical water element
- `TowerBlock`: cylindrical tower
- `DomeCap`: dome roof
- `ArchBlock`: archway
- `Character`: animated character

### MovableWrapper Pattern
HOC that adds interactivity:
- Transform controls (dev mode)
- Selection state
- Position tracking
- Label overlay

## Common Tasks

### Adding a New Block Type

1. Create file: `src/components/Scene/blocks/NewBlock.tsx`
2. Define props extending `BlockProps`
3. Use `useTheme()` for colors
4. Memoize geometry with `useMemo`
5. Export from `blocks/index.ts`

### Creating a New Level

1. Create file: `src/components/Scene/LevelTwo.tsx`
2. Use `useSelection` and `usePositionTracking` hooks
3. Compose `MovableWrapper` components with blocks
4. Add to level themes configuration

### Accessing AI Context

For implementation details, load from `.ai/context/`:
- `architecture.md`: System overview
- `three-patterns.md`: Three.js/R3F patterns
- `component-api.md`: Component interfaces
- `features/*.md`: Feature-specific context

## Testing Approach

- **Unit tests**: Component logic, utilities
- **Integration tests**: Scene interactions
- **Visual tests**: Screenshot comparisons
- **Performance tests**: FPS monitoring

Run tests: `npm test`

## Common Pitfalls

❌ **Don't**:
- Create Three.js objects in render (use `useMemo`)
- Mutate Three.js objects outside `useFrame`
- Forget to dispose geometries/materials on unmount

✅ **Do**:
- Always use refs for Three.js object access
- Memoize expensive computations
- Use proper TypeScript types from `@types/three`
- Follow existing component patterns

## Build & Development

```bash
npm install        # Install dependencies
npm run dev        # Start dev server (http://localhost:5173)
npm run build      # Production build
npm test           # Run test suite
npm run lint       # Lint code
```

## Performance Targets

- 60 FPS on mid-range devices
- < 100ms initial load time
- < 5MB total bundle size
- Responsive across desktop/mobile

## Resources

- Three.js docs: https://threejs.org/docs/
- React Three Fiber: https://docs.pmnd.rs/react-three-fiber
- @react-three/drei: https://github.com/pmndrs/drei
- Project docs: See `docs/` directory

## Recent Changes

- **2025-11-20**: Repository reorganization
  - Split `BuildingBlocks.tsx` into individual components
  - Created `.ai/` directory for AI context
  - Consolidated water feature documentation
  - Renamed `monument-valley-demo/` to `src/`

## Project Status

**Current Phase**: Active development
**Next Milestone**: Level 2 implementation
**Known Issues**: See `docs/development/known-issues.md`

---

*For detailed context, see `.ai/README.md` for AI-specific documentation navigation*
EOF
```

### Step 3.6: Create System Instructions

```bash
cat > .ai/prompts/system-instructions.md << 'EOF'
# System Instructions for AI Assistants

## Project Context

You are assisting with development of the Monument Valley Demo, a React Three Fiber application implementing impossible geometry mechanics.

## Behavioral Guidelines

### Code Generation

**Always**:
- Follow TypeScript strict mode
- Use existing component patterns (see `.ai/context/three-patterns.md`)
- Memoize Three.js objects with `useMemo`
- Use custom hooks (`useSelection`, `usePositionTracking`, `useTheme`)
- Access theme via `useTheme()` hook
- Include proper TypeScript types
- Add JSDoc comments for exported functions

**Never**:
- Create Three.js objects without memoization
- Mutate Three.js objects outside `useFrame`
- Use inline styles (use Tailwind classes)
- Duplicate code from existing components
- Skip error handling in async operations

### Component Structure

Follow this pattern:
```typescript
import { useTheme } from '@/contexts/ThemeContext'
import { useMemo } from 'react'
import * as THREE from 'three'

interface ComponentProps {
  // Props with proper types
}

/**
 * Brief description
 * @param props - Component props
 */
export function Component({ prop1, prop2 }: ComponentProps) {
  const { theme } = useTheme()

  // Memoized resources
  const geometry = useMemo(() => /* ... */, [])

  // Component logic

  return (
    // JSX
  )
}
```

### Documentation

When creating new components:
- Add JSDoc comments
- Document props with descriptions
- Include usage examples
- Note any performance considerations

### Testing

When creating new functionality:
- Include unit tests for utilities
- Add integration tests for complex components
- Consider edge cases and error conditions

## Project-Specific Patterns

### Theme Access
```typescript
const { theme } = useTheme()
const color = theme.palette.brick
```

### Animation
```typescript
useFrame((state, delta) => {
  if (meshRef.current) {
    meshRef.current.rotation.y += delta
  }
})
```

### Selection
```typescript
const { selectedIds, handleSelect } = useSelection()
```

### Position Tracking
```typescript
const { objectPositions, handlePositionChange } = usePositionTracking()
```

## Context Loading

For implementation tasks, load:
1. `.ai/context/architecture.md` - System overview
2. `.ai/context/three-patterns.md` - Three.js patterns
3. `.ai/context/component-api.md` - Component interfaces
4. Relevant feature context from `.ai/context/features/`

## Quality Standards

- **TypeScript**: Strict mode, no `any` types
- **Performance**: Memoize expensive operations
- **Testing**: Unit test coverage > 70%
- **Documentation**: JSDoc for exported functions
- **Code Style**: Follow ESLint configuration

## Common Requests

### "Add a new block type"
1. Create file in `src/components/Scene/blocks/`
2. Define props extending `BlockProps`
3. Use `useTheme()` for colors
4. Memoize geometry
5. Export from `blocks/index.ts`
6. Add to type definitions

### "Create a new level"
1. Create file in `src/components/Scene/`
2. Use selection and position tracking hooks
3. Compose `MovableWrapper` components
4. Add theme configuration

### "Fix a bug"
1. Check `.ai/history/investigations/` for similar issues
2. Load relevant component API context
3. Add test case reproducing bug
4. Fix with minimal changes
5. Verify tests pass

## Communication Style

- Be concise and technical
- Provide code examples
- Reference existing patterns
- Explain trade-offs when multiple approaches exist
- Ask clarifying questions for ambiguous requirements

## Project Files Priority

When searching for information:
1. `.ai/context/` - Implementation details
2. `docs/api/` - Component interfaces
3. `docs/guides/` - Feature guides
4. `src/` - Source code
5. `docs/architecture/` - System design

## Restrictions

- Don't modify theme definitions without explicit request
- Don't change camera position without understanding isometric projection
- Don't refactor working code without justification
- Don't add dependencies without discussion
- Don't modify test configuration files

## Success Criteria

Code is successful when:
- TypeScript compiles without errors
- Tests pass
- Development server runs without errors
- Code follows existing patterns
- Performance is maintained (60 FPS target)
EOF
```

### Phase 3 Validation

```bash
# Verify structure
ls -la .ai/
ls -la .ai/context/
ls -la .ai/prompts/

# Verify CLAUDE.md exists
cat CLAUDE.md | head -20

# Commit Phase 3
git add -A
git commit -m "Phase 3: Establish LLM-friendly development context

- Created .ai/ directory structure for AI context
- Added .ai/README.md as context routing guide
- Created architecture, three-patterns, and component-api contexts
- Added CLAUDE.md project overview for AI assistants
- Created system instructions for AI code generation
- Organized feature-specific contexts (water, alignment)

AI context is now optimized for Claude Code, GitHub Copilot, Cursor AI
"
```

---

## 6. Phase 4: Open Source Standards

**Goal**: Add standard open source project files
**Duration**: 2-3 hours
**Risk Level**: LOW

### Step 4.1: Create LICENSE

```bash
cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2025 Monument Valley Demo Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF
```

### Step 4.2: Create CONTRIBUTING.md

```bash
cat > CONTRIBUTING.md << 'EOF'
# Contributing to Monument Valley Demo

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Git
- Basic knowledge of React, TypeScript, and Three.js

### Development Setup

```bash
# Clone repository
git clone https://github.com/yourusername/monument.git
cd monument

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

## Development Guidelines

### Code Style

- Follow TypeScript strict mode
- Use ESLint configuration (run `npm run lint`)
- Use Prettier for formatting
- Write meaningful commit messages

### Component Patterns

Follow existing patterns in `src/components/`:
- Self-contained components with local state
- Use custom hooks for reusable logic
- Access theme via `useTheme()` hook
- Memoize Three.js objects with `useMemo`

See `.ai/context/three-patterns.md` for detailed patterns.

### Testing

- Write unit tests for utilities
- Add integration tests for complex components
- Ensure tests pass before submitting PR: `npm test`
- Aim for >70% test coverage on new code

### Documentation

- Add JSDoc comments to exported functions
- Update relevant docs in `docs/` for user-facing changes
- Update `.ai/context/` for AI-relevant implementation details

## Contribution Workflow

### 1. Find or Create an Issue

- Check existing issues before starting work
- For new features, create an issue describing the proposal
- Wait for maintainer feedback before starting major work

### 2. Create a Branch

```bash
# Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/fixes

### 3. Make Changes

- Write code following project conventions
- Add tests for new functionality
- Update documentation
- Keep commits atomic and well-described

### 4. Test Your Changes

```bash
# Run tests
npm test

# Build to verify
npm run build

# Manual testing
npm run dev
```

### 5. Submit Pull Request

1. Push your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Create PR on GitHub:
   - Use descriptive title
   - Reference related issues
   - Describe changes and rationale
   - Add screenshots for visual changes

3. Wait for review:
   - Address review feedback
   - Keep PR focused (avoid scope creep)
   - Be patient and respectful

## Types of Contributions

### Bug Fixes

1. Create issue describing bug
2. Include reproduction steps
3. Submit PR with fix and test

### New Features

1. Discuss in issue first
2. Get maintainer approval
3. Implement following project patterns
4. Add documentation and tests

### Documentation

- Fix typos or unclear sections
- Add examples or explanations
- Improve API documentation

### Performance Improvements

- Include benchmarks showing improvement
- Don't sacrifice readability without justification
- Test on multiple devices/browsers

## Commit Messages

Follow conventional commit format:

```
type(scope): brief description

Longer description if needed

Fixes #123
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Test additions/fixes
- `chore`: Build/config changes

**Examples:**
```
feat(blocks): add spiral tower block component

Implements new SpiralTowerBlock with customizable spiral angle
and step count. Uses procedural geometry generation.

Fixes #45
```

```
fix(water): prevent z-fighting in water blocks

Adjusted water block height calculation to prevent z-fighting
with adjacent blocks. Added epsilon offset of 0.001.

Fixes #67
```

## Code Review Process

### For Contributors

- Be open to feedback
- Ask questions if feedback is unclear
- Don't take criticism personally
- Iterate quickly on feedback

### For Reviewers

- Be constructive and specific
- Explain the "why" behind suggestions
- Recognize good work
- Approve when ready (don't nitpick)

## Getting Help

- Ask questions in issues or PRs
- Check existing documentation first
- Be specific about what you've tried

## Recognition

Contributors will be:
- Credited in `CHANGELOG.md`
- Added to contributors list
- Mentioned in release notes for significant contributions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
EOF
```

### Step 4.3: Create CHANGELOG.md

```bash
cat > CHANGELOG.md << 'EOF'
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Repository reorganization with improved structure
- AI-friendly development context in `.ai/` directory
- Comprehensive documentation in `docs/` directory
- Custom hooks: `useSelection`, `usePositionTracking`
- Individual block components (split from monolithic file)
- Open source standard files (LICENSE, CONTRIBUTING, CODE_OF_CONDUCT)

### Changed
- Renamed `monument-valley-demo/` to `src/`
- Consolidated 8 water feature docs into 2 master documents
- Extracted `MovableWrapper` to separate component
- Organized types into dedicated `types/` directory
- Moved tests to root-level `tests/` directory

### Fixed
- Alignment visualizer dev mode detection
- Camera investigation test suite issues
- Documentation duplication and redundancy

### Removed
- Empty `data/` directory
- Redundant navigation index files
- Duplicate water feature documentation

## [0.1.0] - 2025-11-20

### Added
- Initial Monument Valley demo implementation
- Isometric projection with orthographic camera
- Water system with procedural animation
- Theme system with multiple visual styles
- Development tools (AlignmentVisualizer)
- Research panel with Gemini AI integration
- Comprehensive test suite

### Features
- Impossible geometry mechanics
- Interactive block manipulation
- Multi-select with transform controls
- Floating particles system
- Theme-aware lighting and fog
- Performance detection and adaptation

## Release Notes

### Version 0.1.0 (Initial Release)

**Highlights:**
- Full implementation of Monument Valley-inspired impossible geometry
- React Three Fiber architecture with TypeScript
- Procedural water animation system
- Multiple visual themes
- AI-powered research assistance

**Technical Details:**
- React 19 + TypeScript 5.3
- Three.js via React Three Fiber
- Vite 5.0 build system
- Vitest + React Testing Library

**Known Issues:**
- AlignmentVisualizer implementation incomplete
- Limited mobile device testing
- Performance optimization needed for complex scenes

**Contributors:**
- [Add contributor names]

---

*For detailed changes, see git commit history*
EOF
```

### Step 4.4: Create CODE_OF_CONDUCT.md

```bash
cat > CODE_OF_CONDUCT.md << 'EOF'
# Contributor Covenant Code of Conduct

## Our Pledge

We as members, contributors, and leaders pledge to make participation in our
community a harassment-free experience for everyone, regardless of age, body
size, visible or invisible disability, ethnicity, sex characteristics, gender
identity and expression, level of experience, education, socio-economic status,
nationality, personal appearance, race, caste, color, religion, or sexual
identity and orientation.

We pledge to act and interact in ways that contribute to an open, welcoming,
diverse, inclusive, and healthy community.

## Our Standards

Examples of behavior that contributes to a positive environment for our
community include:

* Demonstrating empathy and kindness toward other people
* Being respectful of differing opinions, viewpoints, and experiences
* Giving and gracefully accepting constructive feedback
* Accepting responsibility and apologizing to those affected by our mistakes,
  and learning from the experience
* Focusing on what is best not just for us as individuals, but for the overall
  community

Examples of unacceptable behavior include:

* The use of sexualized language or imagery, and sexual attention or advances of
  any kind
* Trolling, insulting or derogatory comments, and personal or political attacks
* Public or private harassment
* Publishing others' private information, such as a physical or email address,
  without their explicit permission
* Other conduct which could reasonably be considered inappropriate in a
  professional setting

## Enforcement Responsibilities

Project maintainers are responsible for clarifying and enforcing our standards
of acceptable behavior and will take appropriate and fair corrective action in
response to any behavior that they deem inappropriate, threatening, offensive,
or harmful.

Project maintainers have the right and responsibility to remove, edit, or reject
comments, commits, code, wiki edits, issues, and other contributions that are
not aligned to this Code of Conduct, and will communicate reasons for moderation
decisions when appropriate.

## Scope

This Code of Conduct applies within all community spaces, and also applies when
an individual is officially representing the community in public spaces.
Examples of representing our community include using an official e-mail address,
posting via an official social media account, or acting as an appointed
representative at an online or offline event.

## Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported to the project maintainers responsible for enforcement at
[INSERT CONTACT EMAIL].

All complaints will be reviewed and investigated promptly and fairly.

All project maintainers are obligated to respect the privacy and security of the
reporter of any incident.

## Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage],
version 2.1, available at
[https://www.contributor-covenant.org/version/2/1/code_of_conduct.html][v2.1].

[homepage]: https://www.contributor-covenant.org
[v2.1]: https://www.contributor-covenant.org/version/2/1/code_of_conduct.html
EOF
```

### Step 4.5: Expand README.md

```bash
cat > README.md << 'EOF'
# Monument Valley Demo

An interactive 3D web experience inspired by Monument Valley, built with React Three Fiber and TypeScript. Explore impossible geometry and optical illusions in a beautifully themed environment.

[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=flat&logo=react)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat&logo=three.js)](https://threejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

![Monument Valley Demo Screenshot](./docs/assets/screenshot.png)

## ✨ Features

- 🎨 **Impossible Geometry** - Penrose triangle-inspired architecture
- 🌊 **Procedural Water** - Animated water surfaces with flow direction
- 🎭 **Multiple Themes** - Garden, Desert Temple, and more visual styles
- 🎯 **Isometric Projection** - Orthographic camera for optical illusions
- ⚡ **Performance Optimized** - Adaptive quality based on device capabilities
- 🛠️ **Developer Tools** - Built-in alignment visualizer and debugging utilities
- 🤖 **AI Research Assistant** - Integrated Gemini AI for architectural insights

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Modern web browser with WebGL 2.0 support

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/monument.git
cd monument

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

## 📚 Documentation

- **[Getting Started](./docs/getting-started.md)** - Setup and first steps
- **[Architecture Overview](./docs/architecture/overview.md)** - System design
- **[Component API](./docs/api/components/)** - Component reference
- **[Development Guide](./docs/development/)** - Testing, debugging, dev tools
- **[Three.js Integration Guide](./docs/guides/three-js-integration.md)** - 3D implementation patterns

## 🏗️ Project Structure

```
monument/
├── src/               # Application source code
│   ├── components/    # React components (Scene, UI, Research)
│   ├── hooks/         # Custom React hooks
│   ├── themes/        # Visual theme configurations
│   └── utils/         # Utility functions
├── docs/              # Documentation
├── .ai/               # AI assistant context
└── tests/             # Test suites
```

## 🎮 Usage

### Navigation

- **Left Panel**: Research notes and AI assistant
- **Header**: Mode switching and level selection
- **3D Scene**: Interactive Monument Valley environment

### Interactions

- **Click**: Select objects (Shift-click for multi-select)
- **Transform**: Move selected objects in dev mode
- **Theme**: Switch themes from level selector

### Keyboard Shortcuts

- `Shift + Click`: Multi-select objects
- Dev mode: Enable in localStorage with `alignmentVisDebug=true`

## 🛠️ Development

### Technologies

- **Frontend**: React 19 + TypeScript 5.3
- **3D Engine**: Three.js via React Three Fiber
- **Build Tool**: Vite 5.0
- **Styling**: Tailwind CSS
- **Testing**: Vitest + React Testing Library

### Scripts

```bash
npm run dev        # Start development server
npm run build      # Production build
npm test           # Run test suite
npm run lint       # Lint code
npm run type-check # TypeScript validation
```

### Adding a New Feature

1. Check existing patterns in `src/components/`
2. Use custom hooks: `useSelection`, `usePositionTracking`, `useTheme`
3. Follow Three.js patterns in `.ai/context/three-patterns.md`
4. Add tests for new functionality
5. Update documentation

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test
npm test -- src/utils/__tests__/isometricAlignment.test.ts
```

## 🤖 AI-Assisted Development

This project includes AI-friendly context for Claude Code, GitHub Copilot, and Cursor AI:

- `.ai/context/` - Implementation context
- `CLAUDE.md` - Project overview for AI assistants
- `.ai/prompts/` - System instructions and templates

See [.ai/README.md](./.ai/README.md) for context loading guide.

## 📖 Key Concepts

### Impossible Geometry

Monument Valley uses **isometric projection** to create optical illusions. The orthographic camera positioned at [20, 20, 20] creates a 45° isometric view where visual alignment differs from geometric alignment.

### Water System

Procedural water animation using:
- Canvas-based texture generation
- Flow direction vectors for animation
- Height-based positioning to prevent z-fighting

### Theme Architecture

All visual aspects (colors, lighting, fog) are controlled through theme objects, enabling rapid visual iteration.

## 🌟 Inspiration

Inspired by the award-winning [Monument Valley](https://www.monumentvalleygame.com/) game series by ustwo games, which pioneered impossible geometry in mobile gaming.

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### How to Contribute

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed workflow.

## 📜 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- **ustwo games** - Original Monument Valley creators
- **Three.js team** - Amazing 3D library
- **pmndrs** - React Three Fiber ecosystem
- All contributors who have helped improve this project

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/monument/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/monument/discussions)
- **Email**: [your-email@example.com]

## 🔗 Links

- **Live Demo**: [https://monument-demo.netlify.app](https://monument-demo.netlify.app)
- **Documentation**: [https://monument-docs.netlify.app](https://monument-docs.netlify.app)
- **Three.js**: [https://threejs.org](https://threejs.org)
- **React Three Fiber**: [https://docs.pmnd.rs/react-three-fiber](https://docs.pmnd.rs/react-three-fiber)

---

**Built with ❤️ using React Three Fiber**
EOF
```

### Step 4.6: Create Setup Scripts

```bash
mkdir -p scripts

# Create development setup script
cat > scripts/setup-dev.sh << 'EOF'
#!/bin/bash

echo "🚀 Setting up Monument Valley Demo development environment..."

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Error: Node.js 18+ required. Current version: $(node -v)"
  exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run initial tests
echo "🧪 Running tests..."
npm test

# Check TypeScript
echo "🔍 Checking TypeScript..."
npx tsc --noEmit

# Build to verify
echo "🏗️  Building project..."
npm run build

echo "✅ Development environment ready!"
echo ""
echo "To start development server:"
echo "  npm run dev"
EOF

# Create deployment script
cat > scripts/deploy.sh << 'EOF'
#!/bin/bash

echo "🚀 Deploying Monument Valley Demo..."

# Verify tests pass
echo "🧪 Running tests..."
npm test || { echo "❌ Tests failed. Aborting deployment."; exit 1; }

# Check TypeScript
echo "🔍 Checking TypeScript..."
npx tsc --noEmit || { echo "❌ TypeScript errors. Aborting deployment."; exit 1; }

# Build production bundle
echo "🏗️  Building production bundle..."
npm run build || { echo "❌ Build failed. Aborting deployment."; exit 1; }

echo "✅ Build successful!"
echo ""
echo "Deploy dist/ directory to your hosting service"
EOF

# Create structure validation script
cat > scripts/validate-structure.sh << 'EOF'
#!/bin/bash

echo "🔍 Validating repository structure..."

# Check required directories
REQUIRED_DIRS=("src" "docs" ".ai" "tests" "public")
for dir in "${REQUIRED_DIRS[@]}"; do
  if [ ! -d "$dir" ]; then
    echo "❌ Missing required directory: $dir"
    exit 1
  fi
done

# Check required files
REQUIRED_FILES=("README.md" "LICENSE" "CONTRIBUTING.md" "CLAUDE.md" "package.json")
for file in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "$file" ]; then
    echo "❌ Missing required file: $file"
    exit 1
  fi
done

# Check no scattered docs at root
DOC_COUNT=$(find . -maxdepth 1 -name "*.md" ! -name "README.md" ! -name "CONTRIBUTING.md" ! -name "CODE_OF_CONDUCT.md" ! -name "CHANGELOG.md" ! -name "CLAUDE.md" ! -name "milestones.md" | wc -l)
if [ "$DOC_COUNT" -gt 0 ]; then
  echo "⚠️  Warning: Found $DOC_COUNT unexpected .md files at root level"
fi

# Check empty directories
EMPTY_DIRS=$(find src -type d -empty)
if [ -n "$EMPTY_DIRS" ]; then
  echo "⚠️  Warning: Found empty directories:"
  echo "$EMPTY_DIRS"
fi

echo "✅ Structure validation complete!"
EOF

# Make scripts executable
chmod +x scripts/*.sh
```

### Step 4.7: Update milestones.md

```bash
# Manual edit: Add current progress to milestones.md
# Update with completed reorganization milestone
```

### Phase 4 Validation

```bash
# Verify all files created
ls -la LICENSE CONTRIBUTING.md CODE_OF_CONDUCT.md CHANGELOG.md
ls -la scripts/

# Test scripts
./scripts/validate-structure.sh

# Verify README renders properly
# (Manual check on GitHub or with Markdown preview)

# Commit Phase 4
git add -A
git commit -m "Phase 4: Add open source standard files

- Added MIT LICENSE
- Created CONTRIBUTING.md with development guidelines
- Added CODE_OF_CONDUCT.md (Contributor Covenant)
- Created CHANGELOG.md following Keep a Changelog format
- Expanded README.md with comprehensive project overview
- Added setup, deploy, and validation scripts

Project now meets open source best practices standards
"
```

---

## 7. Testing & Validation Plan

### Post-Migration Validation Checklist

#### Build Integrity
```bash
# Development server
npm run dev
# Verify:
# - Server starts without errors
# - Application loads in browser
# - No console errors
# - 3D scene renders correctly
# - All features functional

# Production build
npm run build
# Verify:
# - Build completes without errors
# - No TypeScript errors
# - Bundle size reasonable (<5MB)

# Preview production build
npm run preview
# Verify:
# - App runs from production build
# - All features work
```

#### Test Suite
```bash
# Run all tests
npm test

# Expected results:
# - All tests pass
# - No test configuration errors
# - Coverage reports generate

# TypeScript validation
npx tsc --noEmit
# Expected: No errors
```

#### Git History Integrity
```bash
# Verify file moves preserved history
git log --follow src/components/Scene/blocks/BaseBlock.tsx

# Check no accidental deletions
git status
git diff main

# Verify all expected files present
./scripts/validate-structure.sh
```

#### Documentation Accessibility
```bash
# Verify no broken links
# (Manual check or use link checker tool)

# Test documentation navigation
# - Open docs/README.md
# - Follow links to other docs
# - Verify all paths correct

# Test AI context
# - Load CLAUDE.md
# - Verify references to .ai/ directory work
# - Check code examples valid
```

#### Import Path Validation
```bash
# Search for old import paths
grep -r "monument-valley-demo" src/
# Expected: No results

# Search for broken imports
grep -r "@/" src/ | grep -v "from '@/"
# Verify all @/ imports resolve correctly

# Check barrel exports
grep -r "export \* from" src/
# Verify all export paths valid
```

---

## 8. Risk Assessment & Mitigation

### High-Risk Areas

#### Risk 1: Broken Import Paths
**Impact**: Build failure, application crashes
**Probability**: MEDIUM

**Mitigation**:
- Use TypeScript compiler to catch errors
- Test dev server after each phase
- Search codebase for old paths before committing
- Use IDE refactoring tools when renaming

**Rollback**: `git reset --hard pre-reorganization`

#### Risk 2: Lost Git History
**Impact**: Difficulty tracking changes, blame history
**Probability**: LOW (if using `git mv`)

**Mitigation**:
- Always use `git mv` for file moves (not `rm` + `add`)
- Verify history with `git log --follow <file>`
- Create tag before migration: `git tag pre-reorganization`

**Rollback**: `git reset --hard pre-reorganization`

#### Risk 3: Test Configuration Issues
**Impact**: Tests fail to run, false negatives
**Probability**: MEDIUM

**Mitigation**:
- Update test paths in vitest.config.ts
- Run tests after each phase
- Verify coverage reports generate correctly

**Rollback**: Restore test configuration from `pre-reorganization` tag

### Medium-Risk Areas

#### Risk 4: Documentation Link Rot
**Impact**: Broken cross-references, poor navigation
**Probability**: MEDIUM

**Mitigation**:
- Use relative links in documentation
- Test documentation navigation manually
- Use link checker tool (optional)
- Update links as files move

**Recovery**: Search and replace broken links

#### Risk 5: Vite Configuration Issues
**Impact**: Build failures, path resolution errors
**Probability**: LOW

**Mitigation**:
- Test build after renaming src/
- Verify path aliases in tsconfig.json and vite.config.ts match
- Check public directory path

**Rollback**: Restore configuration from backup

### Low-Risk Areas

#### Risk 6: Script Execution Permissions
**Impact**: Scripts don't run
**Probability**: LOW

**Mitigation**:
- Use `chmod +x` on all scripts
- Test scripts after creation

**Recovery**: `chmod +x scripts/*.sh`

---

## 9. Rollback Procedures

### Emergency Rollback (Abort Migration)

```bash
# If migration fails catastrophically

# Option 1: Reset to pre-migration state
git reset --hard pre-reorganization
git clean -fd  # Remove untracked files

# Option 2: Checkout main branch
git checkout main
git branch -D feature/repository-reorganization
```

### Partial Rollback (Undo Specific Phase)

```bash
# To undo Phase 4 (most recent)
git log  # Find commit hash before Phase 4
git reset --hard <commit-hash>

# To undo Phase 3
git log  # Find commit hash before Phase 3
git reset --hard <commit-hash>
```

### Selective File Restoration

```bash
# Restore specific file from main
git checkout main -- path/to/file

# Restore directory from pre-reorganization
git checkout pre-reorganization -- path/to/directory
```

### Rebuild from Clean State

```bash
# If migration is corrupted beyond repair

# 1. Commit current work (even if broken)
git add -A
git commit -m "WIP: Migration incomplete"

# 2. Create fresh branch from main
git checkout main
git checkout -b feature/repository-reorganization-v2

# 3. Start migration again from Phase 1
# Follow plan more carefully, test after each step
```

---

## 10. Implementation Checklist

### Pre-Migration
- [ ] Git status clean (no uncommitted changes)
- [ ] Create migration branch: `git checkout -b feature/repository-reorganization`
- [ ] Tag current state: `git tag pre-reorganization`
- [ ] Verify tests pass: `npm test`
- [ ] Verify build works: `npm run build`
- [ ] Backup important configuration files

### Phase 1: Documentation Consolidation (2-3 hours)
- [ ] Create documentation directories
- [ ] Consolidate water feature documentation (8 files → 2 files)
- [ ] Move implementation guides to `docs/guides/`
- [ ] Organize testing documentation
- [ ] Move research & investigation docs
- [ ] Clean up navigation indices
- [ ] Update milestones.md
- [ ] **Validate**: Dev server runs, build succeeds
- [ ] **Commit**: Phase 1 complete

### Phase 2: Code Architecture Refinement (3-4 hours)
- [ ] Rename `monument-valley-demo/` to `src/`
- [ ] Update package.json paths
- [ ] Update vite.config.ts paths
- [ ] Update tsconfig.json paths
- [ ] Split BuildingBlocks.tsx into individual files
- [ ] Extract MovableWrapper component
- [ ] Extract PathBuilder helper
- [ ] Create custom hooks directory
- [ ] Organize types directory
- [ ] Extract wallGeometry utility
- [ ] Remove empty directories
- [ ] Move tests to root-level `tests/`
- [ ] **Validate**: Dev server runs, tests pass, build succeeds
- [ ] **Commit**: Phase 2 complete

### Phase 3: LLM Context Organization (1-2 hours)
- [ ] Create `.ai/README.md` context router
- [ ] Create `.ai/context/architecture.md`
- [ ] Create `.ai/context/three-patterns.md`
- [ ] Create `.ai/context/component-api.md`
- [ ] Create `CLAUDE.md` project context
- [ ] Create `.ai/prompts/system-instructions.md`
- [ ] Organize feature-specific contexts
- [ ] **Validate**: Files readable, links work
- [ ] **Commit**: Phase 3 complete

### Phase 4: Open Source Standards (2-3 hours)
- [ ] Create LICENSE (MIT)
- [ ] Create CONTRIBUTING.md
- [ ] Create CHANGELOG.md
- [ ] Create CODE_OF_CONDUCT.md
- [ ] Expand README.md
- [ ] Create setup scripts (`setup-dev.sh`, `deploy.sh`, `validate-structure.sh`)
- [ ] Make scripts executable
- [ ] Update milestones.md with progress
- [ ] **Validate**: Scripts run, README renders correctly
- [ ] **Commit**: Phase 4 complete

### Post-Migration Validation (2-3 hours)
- [ ] Run full test suite: `npm test`
- [ ] TypeScript validation: `npx tsc --noEmit`
- [ ] Development build: `npm run dev` (manual testing)
- [ ] Production build: `npm run build`
- [ ] Preview production: `npm run preview`
- [ ] Validate structure: `./scripts/validate-structure.sh`
- [ ] Check git history: `git log --follow <file>`
- [ ] Verify no broken imports (search for old paths)
- [ ] Test documentation navigation
- [ ] Check AI context loading

### Finalization
- [ ] Create pull request if using PR workflow
- [ ] Update GitHub repository description
- [ ] Add topics/tags to repository
- [ ] Verify GitHub Actions workflows still work
- [ ] Create release notes
- [ ] Announce reorganization to team/community
- [ ] Delete `pre-reorganization` tag after verification period

---

## Appendix A: File Move Commands Summary

### Quick Reference: All File Moves

```bash
# Phase 1: Documentation Consolidation

# Create directories
mkdir -p docs/{architecture,guides,api/components,development,features}
mkdir -p .ai/{context/features,prompts,history}

# Water feature consolidation
mkdir -p .ai/history/water-bridge-archive
git mv WATER_BRIDGE_*.{md,txt} .ai/history/water-bridge-archive/
git mv WATER_CONNECTION_*.md .ai/history/water-bridge-archive/
git mv WATER_FLOW_CONNECTION_DESIGN.md .ai/history/water-bridge-archive/

# Implementation guides
git mv IMPLEMENTATION_GUIDE.md docs/guides/implementation.md
git mv QUICK_REFERENCE.md docs/guides/quick-reference.md
git mv research/guide.md docs/guides/three-js-integration.md

# Testing docs
git mv monument-valley-demo/TEST_README.md claudedocs/test-readme-original.md
git mv monument-valley-demo/TEST_SUMMARY.md claudedocs/test-summary.md
git mv monument-valley-demo/VALIDATION_COMPLETE.md claudedocs/validation-complete.md
git mv monument-valley-demo/VALIDATION_REPORT.md claudedocs/validation-report.md
git mv TESTING_COMPLETE.txt claudedocs/testing-complete.txt

# Research & investigations
git mv claudedocs/isometric_alignment_research.md .ai/context/features/alignment-system.md
mkdir -p .ai/history/investigations
git mv ALIGNMENT_VISUALIZER_FIX.md .ai/history/investigations/
git mv monument-valley-demo/CAMERA_INVESTIGATION.md .ai/history/investigations/

# Remove redundant files
git rm WATER_BRIDGE_INDEX.md
git rm WATER_CONNECTION_INDEX.md

# Phase 2: Code Architecture

# Rename main directory
git mv monument-valley-demo src

# Create component directories
mkdir -p src/components/Scene/blocks
mkdir -p src/hooks
mkdir -p src/types

# Move tests
mkdir -p tests/unit/utils
git mv src/utils/__tests__/* tests/unit/utils/

# Remove empty directories
rmdir src/data src/utils/__tests__
```

---

## Appendix B: Configuration File Changes

### package.json
No path changes needed - Vite auto-detects from root

### tsconfig.json
```json
{
  "include": ["src/**/*"],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### vite.config.ts
```typescript
export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist'
  }
})
```

---

## Appendix C: Success Metrics

### Quantitative Metrics

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| **Documentation Files** | 28 scattered | ~15 organized | <20 |
| **Root-level .md files** | 17 | 7 | <10 |
| **Empty directories** | 1 (data/) | 0 | 0 |
| **Monolithic components** | 1 (531 LOC) | 0 | 0 |
| **Component file size** | Max 531 LOC | Max ~200 LOC | <250 LOC |
| **Build time** | Baseline | Same | ±5% |
| **Test coverage** | Baseline | Same or better | >70% |

### Qualitative Metrics

- [ ] New contributors can navigate documentation easily
- [ ] AI assistants can load relevant context efficiently
- [ ] Code structure follows Three.js ecosystem standards
- [ ] No broken builds or tests
- [ ] Git history preserved for moved files
- [ ] Documentation cross-references work correctly

---

## Appendix D: Post-Migration TODO

### Immediate (Within 1 Week)
- [ ] Monitor for issues from team/users
- [ ] Fix any broken links discovered
- [ ] Update any external documentation
- [ ] Verify GitHub Actions workflows
- [ ] Check deployment pipeline still works

### Short Term (1-2 Weeks)
- [ ] Create documentation site (Docusaurus/VitePress)
- [ ] Add architecture diagrams
- [ ] Expand component API documentation
- [ ] Create video walkthrough

### Medium Term (1 Month)
- [ ] Gather feedback on new structure
- [ ] Iterate on AI context quality
- [ ] Add more examples to documentation
- [ ] Consider Storybook for components

### Long Term (Ongoing)
- [ ] Keep documentation synchronized with code
- [ ] Update AI context as architecture evolves
- [ ] Archive outdated investigation reports
- [ ] Maintain CHANGELOG with releases

---

## Summary

This reorganization plan transforms the Monument repository from a chaotic documentation structure into a well-organized, LLM-friendly, open-source standard project. The phased approach ensures build integrity throughout migration while systematically addressing:

1. **Documentation chaos** (28 files → organized structure)
2. **Code architecture** (monoliths → modular components)
3. **AI development** (scattered context → `.ai/` directory)
4. **Open source readiness** (missing files → full compliance)

**Total Effort**: 10-15 hours
**Risk Level**: MEDIUM (manageable with validation)
**Expected ROI**: Significantly improved development velocity, onboarding, and maintainability

**Ready for Implementation**: Yes
**Recommended Start**: After current sprint completion
**Team Approval**: Required before starting Phase 2

---

*Document Version: 1.0*
*Last Updated: 2025-11-20*
*Status: APPROVED FOR IMPLEMENTATION*
