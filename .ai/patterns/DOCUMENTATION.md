# Documentation: Monument Valley Demo

This document provides guidelines for writing and maintaining documentation in the Monument Valley Demo project.

## Documentation Philosophy

**Core Principles**:
1. **Clarity Over Completeness**: A clear, focused document beats a comprehensive but confusing one
2. **Practical Examples**: Every concept should have working code examples
3. **Scannable Structure**: Readers should find what they need quickly
4. **Maintainability**: Keep docs updated with code changes
5. **Audience-Focused**: Write for your target reader's skill level

## Documentation Types

### Context Documentation (`.ai/context/`)

**Purpose**: Static project information for reference
**Update Frequency**: When project fundamentals change
**Examples**:
- `PROJECT_CONTEXT.md` - Project overview
- `ARCHITECTURE.md` - System design
- `TECH_STACK.md` - Technologies and versions
- `GLOSSARY.md` - Terminology definitions

**Characteristics**:
- Reference material, not tutorials
- Stable information that doesn't change frequently
- Comprehensive coverage of topics
- Cross-references to related documents

### Pattern Documentation (`.ai/patterns/`)

**Purpose**: Actionable guidance and reusable solutions
**Update Frequency**: When new patterns emerge or old ones change
**Examples**:
- `COMMON_TASKS.md` - Step-by-step procedures
- `CODE_PATTERNS.md` - Reusable code solutions
- `TESTING_PATTERNS.md` - Testing strategies
- `DOCUMENTATION.md` - This file

**Characteristics**:
- Procedural and practical
- Include working examples
- Task-focused sections
- Clear prerequisites and verification steps

### Code Comments

**Purpose**: Explain complex code or non-obvious decisions
**Scope**: Within source files
**Frequency**: Whenever code isn't self-documenting

### README Files

**Purpose**: Quick start and overview for specific directories
**Location**: Root directory and major subdirectories
**Update Frequency**: When setup changes

## File Structure and Naming

### Naming Conventions

**Markdown Files**:
- Use UPPER_SNAKE_CASE: `PROJECT_CONTEXT.md`
- Be descriptive: `WATER_ANIMATION_GUIDE.md` (not `guide.md`)
- Use numbers for sequences: `STEP_1_SETUP.md`

**Sections/Headings**:
- Use Title Case with H1-H3: `# Main Title`, `## Section`
- Use H4+ sparingly (creates depth)
- Start with nouns or verbs: `## Setting Up Environment`

**Files Linked**:
- Use relative paths: `[Link](./context/ARCHITECTURE.md)`
- Prefer exact file references over directory links

### Directory Organization

```
.ai/
├── README.md                    # Overview and index
├── context/                     # Static reference information
│   ├── PROJECT_CONTEXT.md       # Project overview
│   ├── ARCHITECTURE.md          # System design
│   ├── TECH_STACK.md            # Technologies
│   └── GLOSSARY.md              # Terminology
└── patterns/                    # Actionable patterns
    ├── COMMON_TASKS.md          # Procedures
    ├── CODE_PATTERNS.md         # Code solutions
    ├── TESTING_PATTERNS.md      # Testing strategies
    └── DOCUMENTATION.md         # This file
```

## Documentation Template

### Context Document Template

```markdown
# [Title]: [Subtitle]

## Overview
[One paragraph explaining what this document covers and why it matters]

## Quick Reference
[Optional: Summary table or checklist for quick lookup]

## Table of Contents
[Optional: For documents >2000 words]

## Section 1: [Topic]
[Detailed explanation with examples]

### Subsection 1.1
[More specific information]

## Section 2: [Topic]
[Continue main sections]

## Examples
[Practical examples demonstrating concepts]

## Related Documentation
- [Link to related file](./RELATED.md)
- [Link to context file](../context/FILE.md)

## FAQ / Troubleshooting
[Common questions and solutions]

---

**Last Updated**: [Date - YYYY-MM-DD]
**Scope**: [What this document covers]
**Audience**: [Who should read this]
```

### Pattern Document Template

```markdown
# [Pattern Category]: [Brief Description]

## Purpose
[Why this pattern exists and when to use it]

## Overview
[High-level explanation of the pattern]

## Step-by-Step Procedure

**Time**: [Estimated duration]
**Difficulty**: [Beginner/Intermediate/Advanced]
**Prerequisites**: [What's needed before starting]

### Step 1: [Action]
[Detailed explanation]
```bash
code example
```

### Step 2: [Action]
[Detailed explanation]

## Common Variations

### Variation A: [Alternative Approach]
[When and why to use this variation]
```typescript
code example
```

## Troubleshooting

### Problem: [Common Issue]
**Cause**: [Why it happens]
**Solution**: [How to fix it]

## Related Patterns
- [Related Pattern](./RELATED.md)

## Examples
[Complete, working code examples]

---

**Last Updated**: [Date]
**Related**: [Linked documents]
```

## Writing Guidelines

### Structure for Clarity

**Use Clear Headings**:
```markdown
# Main Topic
## Key Concept
### Specific Detail
```

**Front-load Important Information**:
- Lead with conclusion, then details
- Put critical info in first paragraph
- Use summaries and key points boxes

**Break into Scannable Chunks**:
- Paragraphs: 2-3 sentences maximum
- Use bullet points for lists
- Use numbered lists for sequences

### Code Examples

**Guidelines**:
1. Every code example should be complete and runnable
2. Include language syntax highlight: ` ```typescript `
3. Explain what the code does before showing it
4. Point out key lines if needed

**Example Structure**:
```markdown
## Creating a Component

To create a new selectable component:

```typescript
import React, { useRef } from 'react';
import * as THREE from 'three';

function SelectableBlock({ id, onSelect }) {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={meshRef} onClick={() => onSelect(id)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial />
    </mesh>
  );
}
```

Key points:
- `meshRef` allows access to the Three.js object
- `onClick` handles selection
- Component accepts props for ID and callback
```

### Terminology and Consistency

**Use the Glossary**:
- Reference `GLOSSARY.md` for consistent terminology
- Use defined terms consistently throughout
- Explain acronyms on first use: "Frames Per Second (FPS)"

**Avoid Jargon**:
- Define technical terms where used
- Use plain language when possible
- Provide context for unfamiliar concepts

### Tables for Comparison

**Use tables for structured information**:

```markdown
| Type | Purpose | Performance |
|------|---------|-------------|
| Stone | Base structure | High |
| Water | Animations | Medium |
| Special | Effects | Variable |
```

**Use tables to show properties**:

```markdown
| Property | Type | Default | Purpose |
|----------|------|---------|---------|
| position | Array | [0,0,0] | 3D location |
| color | String | "#888" | Visual appearance |
| isSelected | Boolean | false | Selection state |
```

## Markdown Style Guide

### Formatting Standards

**Bold** for emphasis: `**important**`
```markdown
This is **very important** to understand.
```

**Code formatting** for technical terms:
```markdown
The `useFrame` hook runs every animation frame.
```

**Inline code blocks** for variables/props:
```markdown
Set the `flowDirection` prop to control water flow.
```

**Code blocks** for complete examples:
```typescript
// Complete, executable code
```

### Lists

**Bullet points** for unordered information:
```markdown
- Item one
- Item two
- Item three
```

**Numbered lists** for sequences:
```markdown
1. Do this first
2. Then do this
3. Finally do this
```

**Definition lists** for terms:
```markdown
Term
: Definition of the term

Another Term
: Its definition
```

### Special Callouts

Use blockquotes for important notes:
```markdown
> **Important**: This will affect performance
> if used incorrectly.
```

Use lists for checklists:
```markdown
**Verification**:
- [ ] Component renders
- [ ] Selection works
- [ ] No console errors
```

## Linking and References

### Internal Links

**Link to other documents**:
```markdown
See [Architecture](./context/ARCHITECTURE.md) for system design.
```

**Link to sections**:
```markdown
See [Testing Patterns](./TESTING_PATTERNS.md#unit-testing-patterns)
```

**Link within document**:
```markdown
[Jump to Examples](#examples)

## Examples
...
```

### External Links

**Link with descriptive text**:
```markdown
[React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
```

**Avoid "click here"**:
```markdown
❌ For more info, [click here](url)
✅ [React Three Fiber documentation](url) explains this in detail.
```

## Maintaining Documentation

### Update Triggers

**Update context files when**:
- Project structure changes significantly
- Major features are added or removed
- Technologies are upgraded substantially
- Architecture decisions change

**Update pattern files when**:
- New, common patterns emerge
- Old patterns become deprecated
- Better solutions are discovered
- Feedback indicates confusion

**Update code comments when**:
- Code logic changes
- Non-obvious decisions are made
- Performance optimizations are applied
- Workarounds are implemented

### Version Control

**Commit Documentation Changes**:
```bash
git commit -m "docs: update [filename] - [description]"
```

**Examples**:
```bash
git commit -m "docs: update ARCHITECTURE.md - add water flow explanation"
git commit -m "docs: add COMMON_TASKS.md with development procedures"
git commit -m "docs: update GLOSSARY.md - add new terminology"
```

### Documentation Audit

**Monthly Review**:
1. Check "Last Updated" dates
2. Review for outdated information
3. Update examples if code changed
4. Fix broken links
5. Verify code examples still work

**Trigger for Audit**:
- Major code changes
- New team member onboarding
- Quarterly review cycle

## Documentation Anti-patterns

**Avoid**:

1. **Outdated Information**
   - Dates older than project changes
   - References to deleted files
   - Obsolete version numbers

2. **Over-Documentation**
   - Documenting obvious code
   - Excessive comments
   - Duplicate information

3. **Unclear Examples**
   - Incomplete code snippets
   - Without explanation
   - Using unclear variable names

4. **Poor Organization**
   - No clear structure
   - Inconsistent heading levels
   - Scattered related information

5. **Dead Links**
   - Links to deleted files
   - References to moved sections
   - External links that go stale

## Quick Checklist for New Documentation

Before finalizing a new documentation file:

- [ ] **Content**
  - [ ] Purpose is clear in overview
  - [ ] All code examples are tested and working
  - [ ] Terminology is consistent with glossary
  - [ ] Examples match current codebase version

- [ ] **Structure**
  - [ ] Logical flow from simple to complex
  - [ ] Clear section headings
  - [ ] Quick reference available (if applicable)
  - [ ] Related documentation linked

- [ ] **Style**
  - [ ] Markdown formatting is clean
  - [ ] No spelling or grammar errors
  - [ ] Code examples properly highlighted
  - [ ] Tables are aligned and readable

- [ ] **Maintenance**
  - [ ] "Last Updated" date included
  - [ ] Scope clearly defined
  - [ ] Audience identified
  - [ ] Indexed in parent README

- [ ] **Integration**
  - [ ] Added to `.ai/README.md` index
  - [ ] Linked from related documents
  - [ ] Committed to git with proper message
  - [ ] Version control history is clean

## Documentation Tools and Tips

### Markdown Editors
- **VS Code**: Built-in Markdown preview
- **Markdown Preview Enhanced**: Enhanced preview features
- **Typora**: WYSIWYG Markdown editor

### Validation
```bash
# Check for broken links (if using markdown-link-check)
markdown-link-check FILE.md

# Spell check
npm install -D cspell
cspell FILE.md
```

### Preview Before Committing
```bash
# VS Code: Cmd+Shift+V (or Ctrl+Shift+V)
# GitHub: Commit message preview shows rendering
```

### Documentation Hosting
- **GitHub**: Rendered automatically
- **Vercel/Netlify**: Can host documentation sites
- **Read the Docs**: Professional documentation hosting

## Examples of Good Documentation

### Well-Documented Function
```typescript
/**
 * Convert world coordinates to isometric screen coordinates.
 *
 * Uses the isometric projection formula where:
 * - X and Z axes are mapped to screen X
 * - Y axis is mapped to screen Y (inverted)
 *
 * @param x - World X coordinate
 * @param y - World Y coordinate (height)
 * @param z - World Z coordinate
 * @returns [screenX, screenY] screen coordinates
 *
 * @example
 * ```typescript
 * const [x, y] = worldToIsometric(5, 0, 3);
 * // Returns approximately [2, 4]
 * ```
 */
function worldToIsometric(
  x: number,
  y: number,
  z: number
): [number, number] {
  const isoX = x - z;
  const isoY = (x + z) * 0.5 - y;
  return [isoX, isoY];
}
```

### Well-Documented Section
```markdown
## Water Flow Animation

Water flows along directional paths using texture offset animation.

### Key Concept
The water texture continuously scrolls in a direction specified by `flowDirection` [x, y]:
- `[0, 1]`: Upward flow
- `[0, -1]`: Downward flow (toward waterfall)
- `[1, 0]`: Rightward flow
- `[-1, 0]`: Leftward flow

### Implementation
```typescript
useFrame((state, delta) => {
  textureInstance.offset.x += flowDir[0] * speed * delta;
  textureInstance.offset.y += flowDir[1] * speed * delta;
});
```

### Performance Consideration
Animation speed affects perceived flow intensity:
- `speed = 1.0`: Subtle, slow flow
- `speed = 1.5`: Normal, balanced flow
- `speed = 2.0`: Fast, dynamic flow

### Synchronization
Synchronize water speed across connected elements:
```typescript
// All water elements should use same speed
const speed = 1.5;
```
```

---

## Related Documentation

- [README](../README.md) - Main index
- [Common Tasks](./COMMON_TASKS.md) - Procedures
- [Project Context](../context/PROJECT_CONTEXT.md) - Project overview

---

**Last Updated**: November 20, 2025
**Scope**: Documentation writing standards and guidelines
**Audience**: Documentation authors and maintainers

