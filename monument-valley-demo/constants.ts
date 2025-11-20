import { ResearchItem, ResearchCategory } from './types';

export const INITIAL_RESEARCH: ResearchItem[] = [
  {
    id: 'tech-1',
    category: ResearchCategory.ARCHITECTURE,
    title: 'Technology Stack',
    content: 'This project leverages a modern, component-based 3D stack:\n• React 19: For state management and UI logic.\n• React Three Fiber (R3F): A React renderer for Three.js, allowing declarative scene composition.\n• Three.js: The core WebGL library.\n• Tailwind CSS: For rapid, responsive HUD styling.\n• Google Gemini API: For the intelligent "Architect" agent.',
  },
  {
    id: 'ai-1',
    category: ResearchCategory.ARCHITECTURE,
    title: 'Prompt Engineering Strategy',
    content: 'To ensure high-quality code generation, the AI "Architect" operates under strict constraints:\n1. Persona Adoption: Acts as a "Senior Technical Lead".\n2. Constraint Enforcement: Forbidding "novel-writing" in favor of concise technical specs.\n3. Context Windowing: The entire file structure is provided to minimize hallucinations.\n4. Chain-of-Thought: Complex requests are broken down into specifications before code implementation.',
  },
  {
    id: 'mec-1',
    category: ResearchCategory.MECHANICS,
    title: 'Impossible Geometry & Perspective',
    content: 'The core mechanic of Monument Valley is "optical illusion as physics." Objects that appear connected in the 2D screen space allow traversal, even if they are distant in 3D space. Implementation requires decoupling the "Visual World" (what is rendered) from the "Logical Graph" (the pathfinding nodes).',
    codeSnippet: `// Concept: Raycast from camera to check 2D alignment
function checkVisualConnection(nodeA, nodeB, camera) {
  const screenA = nodeA.position.project(camera);
  const screenB = nodeB.position.project(camera);
  return distance(screenA, screenB) < THRESHOLD;
}`
  },
  {
    id: 'mec-3',
    category: ResearchCategory.MECHANICS,
    title: 'Challenge: Z-Fighting & Overlap',
    content: 'A major hurdle in tile-based 3D environments is Z-fighting (flickering surfaces) when modular assets meet. We solved this not by manual placement, but by creating "Smart Blocks" (WalledBlock). These components dynamically calculate their geometry based on neighbors, shortening their end-caps to butt against adjacent walls rather than overlapping them.',
  },
  {
    id: 'mec-2',
    category: ResearchCategory.MECHANICS,
    title: 'Isometric Projection',
    content: 'The game strictly uses an Orthographic Camera. Unlike a Perspective camera, parallel lines never converge. This is critical for the illusions to work. The standard isometric angle typically rotates the X and Y axes by 45 degrees and tilts the camera by approx 35.264 degrees.',
  },
  {
    id: 'arch-1',
    category: ResearchCategory.ARCHITECTURE,
    title: 'Component Entity System',
    content: 'We avoid a monolithic "Game" class. Instead, we use React components to represent world entities.\n1. <Level>: Container for state.\n2. <Block>: The atomic unit of ground.\n3. <MovableWrapper>: A Higher-Order Component that gives any block selection, drag, and coordinate-tracking capabilities.',
  },
  {
    id: 'arch-3',
    category: ResearchCategory.ARCHITECTURE,
    title: 'State Management: React vs. Three.js',
    content: 'One specific challenge is bridging the "React Render Cycle" (UI updates) with the "Frame Loop" (60fps animation). We use R3F hooks like useFrame for animations (water ripples) while using React state (useState) for logic (selection, level progression). This separation ensures high performance without blocking the main thread.',
  },
  {
    id: 'art-1',
    category: ResearchCategory.ART_DIRECTION,
    title: 'Atmosphere & Lighting',
    content: 'Monument Valley uses baked ambient occlusion (simulated via vertex colors or textures in a web clone) and soft, non-directional ambient light paired with a strong directional light for casting shadows that emphasize the geometry. Gradients are used heavily in the background to convey depth without perspective.',
  },
  {
    id: 'ux-1',
    category: ResearchCategory.ART_DIRECTION,
    title: 'Feature: Dual-Mode Visualization',
    content: 'The UX is designed for Engineering Transparency. The application features two distinct modes:\n1. "Research Mode": Overlays the Game Design Document and AI Console, treating the 3D world as a backdrop.\n2. "Engine Preview": Removes UI clutter to focus on visual fidelity and mechanics debugging.',
  }
];

export const GEMINI_SYSTEM_INSTRUCTION = `You are a Senior Technical Lead and Game Designer specializing in WebGL and React. 
Your goal is to assist in architecting a clone of Monument Valley using React Three Fiber.
Focus on high-level architecture, mathematical concepts (orthographic projection, graph theory for pathfinding), and code structure.
Do not write the full game. Write the *plan* and the *architectural patterns*.
Use strict TypeScript syntax in examples.`;

// Grid unit size
export const UNIT = 1;