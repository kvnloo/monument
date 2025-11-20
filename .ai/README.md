# AI Context Structure

This directory contains structured context and patterns for AI assistants working on the Monument Valley Demo project. It serves as a machine-readable knowledge base to improve consistency, quality, and efficiency across AI-assisted development.

## Purpose

The `.ai/` directory provides:

- **Project Context**: Critical information about the codebase, architecture, and patterns
- **Development Patterns**: Reusable solutions and best practices for common tasks
- **AI Guidelines**: Instructions for AI assistants on how to approach tasks effectively
- **Documentation Standards**: Templates and conventions for maintaining documentation

## Directory Structure

```
.ai/
├── README.md                 # This file - overview and usage guide
├── context/                  # Project context files
│   ├── PROJECT_CONTEXT.md    # Project overview, architecture, key files
│   ├── ARCHITECTURE.md       # System design and component relationships
│   ├── TECH_STACK.md         # Technologies, versions, dependencies
│   └── GLOSSARY.md           # Project-specific terminology
└── patterns/                 # Development patterns and solutions
    ├── COMMON_TASKS.md       # Frequent development tasks and approaches
    ├── CODE_PATTERNS.md      # Reusable code patterns and examples
    ├── TESTING_PATTERNS.md   # Testing strategies and examples
    └── DOCUMENTATION.md      # How to write and maintain docs
```

### Context Directory

The `context/` directory contains static project information that AI assistants should reference:

#### PROJECT_CONTEXT.md
High-level overview of the Monument Valley Demo:
- Project purpose and goals
- Key features and functionality
- High-level architecture overview
- Main entry points and important files
- Running and building instructions

**When to use**: Before starting any task, review to understand the project scope and goals.

#### ARCHITECTURE.md
Technical architecture and system design:
- Component hierarchy and relationships
- Data flow patterns
- Key systems (rendering, UI, water animations, etc.)
- File organization and module structure
- Important design decisions and trade-offs

**When to use**: When implementing features, refactoring, or understanding how components interact.

#### TECH_STACK.md
Technology stack and dependencies:
- Framework versions (React, Three.js, Vite, etc.)
- Dependencies and their purposes
- Development tools and configurations
- Environment setup requirements
- Known limitations or quirks of specific technologies

**When to use**: When adding dependencies, configuring tools, or troubleshooting version-related issues.

#### GLOSSARY.md
Project-specific terminology:
- Technical terms used in documentation and code
- Domain-specific vocabulary (isometric rendering, water flow, etc.)
- Abbreviations and acronyms
- Key concepts and their definitions

**When to use**: When reading code or documentation, or when writing new documentation to maintain consistency.

### Patterns Directory

The `patterns/` directory contains actionable development patterns:

#### COMMON_TASKS.md
Procedures for frequent development tasks:
- Setting up development environment
- Running tests and builds
- Debugging common issues
- Updating dependencies
- Adding new components or features
- Performance optimization workflows

**When to use**: For implementation guidance on standard development tasks.

#### CODE_PATTERNS.md
Reusable code patterns and solutions:
- React component patterns (hooks, state management)
- Three.js patterns (geometry, materials, animations)
- TypeScript patterns and type definitions
- Styling patterns and conventions
- Common utility functions

**When to use**: When writing new code, to ensure consistency with existing patterns.

#### TESTING_PATTERNS.md
Testing strategies and examples:
- Unit testing patterns
- Integration testing approaches
- Test file organization
- Mock setup and fixtures
- Common test scenarios

**When to use**: When writing or reviewing tests, or when implementing test coverage for new features.

#### DOCUMENTATION.md
Guidelines for writing and maintaining documentation:
- Documentation structure and organization
- File naming conventions
- Markdown style guide
- How to document code and features
- When and how to update documentation

**When to use**: When creating new documentation or updating existing docs.

## How AI Assistants Should Use These Files

### Workflow Integration

1. **Project Understanding** → Read `context/PROJECT_CONTEXT.md` and `context/ARCHITECTURE.md`
2. **Technical Details** → Reference `context/TECH_STACK.md` and `context/GLOSSARY.md` as needed
3. **Implementation** → Follow patterns in `patterns/CODE_PATTERNS.md` and `patterns/COMMON_TASKS.md`
4. **Testing** → Use `patterns/TESTING_PATTERNS.md` for test implementation
5. **Documentation** → Follow `patterns/DOCUMENTATION.md` when writing docs

### Before Starting a Task

- Read relevant context files to understand the system
- Check for existing patterns that apply to your task
- Review the glossary to use consistent terminology
- Look for documented solutions to similar problems

### During Implementation

- Reference code patterns for consistency
- Follow established conventions
- Check testing patterns before writing tests
- Use terminology from the glossary in comments and documentation

### When Facing Issues

- Search context files for relevant information
- Check common tasks documentation for troubleshooting steps
- Review architecture documentation to understand component relationships
- Consult glossary for terminology clarification

## Index of Available Context Files

Quick reference to find information:

| Topic | File | Key Sections |
|-------|------|--------------|
| Project overview | `PROJECT_CONTEXT.md` | Goals, features, entry points |
| System design | `ARCHITECTURE.md` | Components, data flow, modules |
| Dependencies | `TECH_STACK.md` | Versions, libraries, setup |
| Terminology | `GLOSSARY.md` | Terms, acronyms, concepts |
| Development tasks | `COMMON_TASKS.md` | Setup, debugging, optimization |
| Code solutions | `CODE_PATTERNS.md` | React, Three.js, TypeScript patterns |
| Testing approach | `TESTING_PATTERNS.md` | Unit, integration, fixtures |
| Writing docs | `DOCUMENTATION.md` | Style, structure, conventions |

## Guidelines for Maintaining AI Documentation

### For AI Assistants

When updating or creating context files:

1. **Keep Information Current**: Update files when project structure, technologies, or patterns change
2. **Use Consistent Terminology**: Reference the glossary to maintain consistent language
3. **Provide Examples**: Include code examples for patterns and common tasks
4. **Link Related Information**: Cross-reference related sections in different files
5. **Document Trade-offs**: Explain why certain patterns are used and what alternatives exist
6. **Test Your Documentation**: Verify that instructions work by following them
7. **Update the Index**: Add new files to the index and this README

### File Maintenance

**When to Create New Files**:
- A topic doesn't fit existing categories
- Documentation exceeds 2000 lines (split into smaller files)
- A new major pattern or system is introduced

**When to Update Existing Files**:
- Project structure changes
- New patterns emerge or old ones are deprecated
- Technology versions update
- Documentation becomes out of date

**When to Archive Files**:
- A feature is removed
- A pattern is no longer used
- Technology is deprecated
- Move to a separate `archived/` directory with date

### Documentation Standards

Each context/pattern file should include:

```markdown
# [Title]

## Overview
Brief description of what this file covers.

## Quick Reference
Quick lookup table or checklist if applicable.

## Detailed Content
Organized sections with clear headings.

## Examples
Code examples or practical demonstrations.

## Related Files
Links to other relevant context files.

## Last Updated
[Date] - [Brief description of update]
```

### Validation Checklist

Before considering a documentation file complete:

- [ ] Information is accurate and current
- [ ] Examples are tested and working
- [ ] Terminology is consistent with glossary
- [ ] Cross-references to related files work
- [ ] File is indexed in this README
- [ ] Format follows documentation standards
- [ ] No outdated or deprecated information remains

## Getting Started

New AI assistants should:

1. Read this README to understand the structure
2. Review `context/PROJECT_CONTEXT.md` for project overview
3. Skim `context/ARCHITECTURE.md` to understand the system
4. Bookmark `context/GLOSSARY.md` for terminology reference
5. Check `patterns/` for relevant patterns before starting tasks

## Contributing Improvements

AI assistants are encouraged to:

- Suggest documentation improvements
- Add patterns for new workflows discovered
- Update outdated information
- Improve clarity and examples
- Create new files for new systems or patterns

When making significant changes:
1. Document what changed and why
2. Update the "Last Updated" section
3. Update this README if structure changes
4. Note any files that should be archived

## Quick Links

- [Project Context](./context/PROJECT_CONTEXT.md)
- [Architecture](./context/ARCHITECTURE.md)
- [Tech Stack](./context/TECH_STACK.md)
- [Glossary](./context/GLOSSARY.md)
- [Common Tasks](./patterns/COMMON_TASKS.md)
- [Code Patterns](./patterns/CODE_PATTERNS.md)
- [Testing Patterns](./patterns/TESTING_PATTERNS.md)
- [Documentation Guide](./patterns/DOCUMENTATION.md)

---

**Last Updated**: November 20, 2025
**Maintained By**: Monument Valley Demo Project Team
**Purpose**: AI-assisted development context and patterns

