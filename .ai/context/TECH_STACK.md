# Tech Stack: Monument Valley Demo

## Technology Overview

The Monument Valley Demo uses a modern web stack optimized for 3D graphics rendering, interactive UI, and development productivity.

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | React | 18.x | Component-based UI |
| **3D Graphics** | Three.js | r150+ | WebGL rendering |
| **React Binding** | React Three Fiber | Latest | Declarative 3D in React |
| **Build Tool** | Vite | 4.x+ | Fast bundling and dev server |
| **Language** | TypeScript | 5.x | Type-safe development |
| **Styling** | Tailwind CSS | 3.x | Utility-first CSS |
| **Testing** | Vitest | 1.x | Unit testing framework |
| **Package Manager** | npm | Latest | Dependency management |
| **API (Optional)** | Gemini API | Current | AI integration support |

## Core Dependencies

### Frontend Framework

#### React (18.x)
- **Purpose**: Component-based UI framework
- **Key Features**: Hooks, functional components, fast re-rendering
- **Usage**: All UI components and state management
- **Installation**: `npm install react react-dom`

#### React Three Fiber (r150+)
- **Purpose**: React renderer for Three.js
- **Key Features**:
  - Declarative 3D object creation
  - useFrame() hook for animation
  - useRef() for Three.js object access
  - Canvas component for WebGL context
- **Documentation**: [Docs](https://docs.pmnd.rs/react-three-fiber)
- **Usage**: All 3D rendering in Scene component

#### Three.js (r150+)
- **Purpose**: Low-level 3D graphics library
- **Key Classes**:
  - `Scene`: Container for 3D objects
  - `Geometry`: Shape definition
  - `Material`: Surface properties
  - `Mesh`: Combination of geometry + material
  - `Light`: Illumination sources
  - `Camera`: Viewpoint definition
  - `Renderer`: Renders scene to canvas
- **Installation**: `npm install three`
- **Version Compatibility**: Works with React Three Fiber v8+

### Build and Development

#### Vite (4.x+)
- **Purpose**: Next-generation build tool
- **Key Features**:
  - ES modules-based development
  - HMR (Hot Module Replacement)
  - Optimized production builds
  - Fast server startup
- **Config File**: `vite.config.ts`
- **Benefits**: ~10x faster than Webpack for development

#### TypeScript (5.x)
- **Purpose**: Static typing for JavaScript
- **Config File**: `tsconfig.json`
- **Features**:
  - Type checking at compile time
  - Better IDE support and autocomplete
  - Refactoring assistance
  - Self-documenting code
- **Strict Mode**: Enabled for better type safety

### Styling

#### Tailwind CSS (3.x)
- **Purpose**: Utility-first CSS framework
- **Key Files**:
  - Configuration in `tailwind.config.ts`
  - Global imports in component files
- **Features**:
  - Rapid UI development
  - Responsive design utilities
  - Custom theme configuration
  - PurgeCSS for optimal bundle size
- **Custom Theme**: Extended in `vite.config.ts`

#### Custom CSS
- **Main File**: `styles/main.css`
- **Contents**:
  - CSS custom properties (variables)
  - Color palette definitions
  - Typography settings
  - Animation keyframes

### Testing

#### Vitest (1.x)
- **Purpose**: Unit testing framework (Vite-native)
- **Features**:
  - Zero config setup with Vite
  - Jest-compatible API
  - Fast test execution
  - ESM support
- **Test Files**: Located in `/tests` directory
- **Commands**:
  ```bash
  npm run test        # Run all tests
  npm run test:ui     # Run with UI dashboard
  npm run test:watch  # Watch mode
  ```

### Optional/Integration

#### Gemini API
- **Purpose**: Optional AI integration
- **API Key**: Set in `.env.local`
- **Environment Variable**: `VITE_GEMINI_API_KEY`
- **Note**: Not required for core functionality

## Development Dependencies

Key development dependencies (installed as `devDependencies`):

- **@types/react**: TypeScript definitions for React
- **@types/react-dom**: TypeScript definitions for React DOM
- **@types/three**: TypeScript definitions for Three.js
- **@vitejs/plugin-react**: React support in Vite
- **typescript**: TypeScript compiler

## Package.json Scripts

### Available Commands

```json
{
  "scripts": {
    "dev": "vite",                    // Start development server
    "build": "tsc && vite build",     // Build for production
    "preview": "vite preview",        // Preview production build locally
    "test": "vitest",                 // Run tests
    "test:ui": "vitest --ui",        // Run tests with UI
    "test:watch": "vitest --watch"   // Run tests in watch mode
  }
}
```

### Running Applications

**Development**:
```bash
npm install                # Install dependencies
npm run dev               # Start local dev server at localhost:5173
```

**Production Build**:
```bash
npm run build             # Creates /dist directory
npm run preview           # Test production build locally
```

## Configuration Files

### vite.config.ts
- **Build configuration**: Entry point, output directory, optimization
- **Plugin configuration**: React plugin setup
- **Tailwind CSS**: Integrated configuration
- **Environment variables**: Loading and exposure

**Key Settings**:
- `root`: Source directory
- `base`: URL base path
- `build.outDir`: Output directory (default: `dist`)
- `server.port`: Development server port (default: 5173)

### tsconfig.json
- **Compilation targets**: ES version and module system
- **Strict type checking**: All type checks enabled
- **Module resolution**: Path mapping and resolution strategy
- **JSX**: React 18 automatic JSX runtime

**Key Options**:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "jsx": "react-jsx",
    "strict": true,
    "skipLibCheck": true
  }
}
```

### .env.local
- **Purpose**: Local environment variables (not committed to git)
- **Variables**:
  - `VITE_GEMINI_API_KEY`: Gemini API key for AI features
- **Access in Code**: `import.meta.env.VITE_*`

**Example**:
```
VITE_GEMINI_API_KEY=your_api_key_here
```

## Dependency Management

### Adding New Dependencies

**For Production**:
```bash
npm install package-name
```

**For Development**:
```bash
npm install --save-dev package-name
```

### Updating Dependencies

```bash
npm update                    # Update all to latest compatible
npm outdated                  # Check for outdated packages
npm install package@latest    # Update specific package
```

### Three.js Ecosystem Packages

Common Three.js utilities that may be useful:

| Package | Purpose |
|---------|---------|
| `three` | Core Three.js library |
| `@react-three/fiber` | React renderer for Three.js |
| `@react-three/drei` | Collection of useful helpers |
| `@react-three/postprocessing` | Post-processing effects |
| `@react-three/cannon` | Physics engine binding |

## Known Compatibility Issues

### Three.js Versions
- Works with r150+
- Newer versions (r160+) may require code updates
- Always test after major version upgrades

### React Version
- Requires React 18+ for latest Three Fiber
- React 17 compatibility untested

### Browser Support
- Requires WebGL support (most modern browsers)
- IE 11: Not supported
- Mobile browsers: Generally supported (with potential performance limitations)

### Vite Compatibility
- Node.js 14.18+ required
- Package manager: npm, yarn, pnpm all supported

## Performance Considerations

### Build Optimization
- **Tree-shaking**: Removes unused code in production
- **Code splitting**: Automatic for lazy-loaded components
- **Minification**: Applied to JS, CSS, and HTML
- **Asset optimization**: Images and fonts optimized

### Runtime Optimization
- **Lazy loading**: Load components on-demand
- **Memoization**: React.memo for expensive components
- **RequestAnimationFrame**: useFrame hook for animations
- **Viewport culling**: Three.js handles automatically

### Bundle Size
- Monitor with: `npm run build` (shows bundle stats)
- Three.js: ~600KB (minified)
- React: ~40KB (minified)
- Total typical app: 700-1000KB (gzipped: 200-300KB)

## Development Tools

### Browser DevTools
- **Chrome DevTools**: Built-in, excellent Three.js support
- **React DevTools**: Browser extension for component inspection
- **Three.js Inspector**: Extension for scene debugging

### VS Code Extensions (Recommended)
- **ES7+ React/Redux/React-Native snippets**: Code generation
- **TypeScript Vue Plugin**: Better TypeScript support
- **Three Inspector**: Three.js scene visualization
- **Prettier**: Code formatting

### Debugging Tips
- `useFrame` provides access to `THREE` global
- Use `console.log()` in render loops carefully (performance)
- Three.js `scene.traverse()` for inspecting scene graph
- DevTools Performance tab for render bottlenecks

## API Integration

### Gemini API (Optional)
- **Provider**: Google AI
- **Setup**: Set `VITE_GEMINI_API_KEY` in `.env.local`
- **Type**: RESTful API
- **Use Case**: AI-powered features (not currently used)

### Environment Variable Access
```typescript
// In React component
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
```

## Troubleshooting Common Issues

### Module Not Found Errors
- Ensure `import` paths match `tsconfig.json` paths
- Check file extensions (TypeScript requires `.ts` or `.tsx`)
- Verify package is installed: `npm list package-name`

### Type Errors with Three.js
- Install `@types/three` for TypeScript definitions
- Check Three.js version compatibility
- Use proper TypeScript generics for geometries and materials

### Hot Reload Not Working
- Check Vite server is running
- Clear browser cache
- Restart development server: `npm run dev`

### Build Failures
- Run `npm run build` locally to test
- Check for unused imports (TypeScript strict mode)
- Review console errors for missing dependencies

## Version Update Strategy

### Minor Updates (Safe)
- Run `npm update` periodically
- Test thoroughly before deployment
- Minor versions should not break functionality

### Major Updates (Test First)
- Create feature branch: `git checkout -b update/major-version`
- Update specific package: `npm install package@latest`
- Run full test suite: `npm run test`
- Test application: `npm run dev`
- Create PR and review changes

### Keeping Dependencies Fresh
- Check for security updates: `npm audit`
- Review changelog for breaking changes
- Update on regular schedule (monthly recommended)

## Resources and Documentation

### Official Documentation
- [React Docs](https://react.dev)
- [Three.js Docs](https://threejs.org/docs)
- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Vite Guide](https://vitejs.dev/guide)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Helpful Resources
- [Three.js Forum](https://discourse.threejs.org)
- [React Three Fiber Discussions](https://github.com/pmndrs/react-three-fiber/discussions)
- [Shadertoy](https://www.shadertoy.com) - Shader examples
- [WebGL Fundamentals](https://webglfundamentals.org)

---

**Last Updated**: November 20, 2025
**Scope**: Technology stack, versions, and configuration
**Audience**: Developers setting up environments or adding dependencies

