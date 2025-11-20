import * as THREE from 'three';

/**
 * Isometric Alignment Utilities
 *
 * This module provides utilities for calculating visually correct alignment positions
 * in isometric projections, where geometric midpoints in 3D space do not correspond
 * to visual midpoints in 2D screen space.
 *
 * Background:
 * In Monument Valley-style isometric games, the camera's perspective creates a
 * non-linear transformation where Y-axis coordinates are foreshortened. This means
 * that the geometric midpoint between two points in 3D space will NOT appear as
 * the visual midpoint when projected onto the screen.
 *
 * Example from research:
 * - Beam-A endpoint: [2.40, 0.00, -13.00]
 * - Waterfall top: [20.64, 18.38, 5.44]
 * - Geometric midpoint: [11.52, 9.19, -3.78] ❌ Appears misaligned
 * - Visual midpoint: [11.52, 8.23, -3.78] ✓ Appears perfectly centered
 * - Y-axis error: 0.96 units (~10% foreshortening from camera angle)
 *
 * @module isometricAlignment
 */

/**
 * Configuration constants for alignment calculations
 */
const ALIGNMENT_CONFIG = {
  /** Maximum iterations for binary search convergence */
  MAX_ITERATIONS: 20,

  /** Tolerance in Normalized Device Coordinates (NDC space, range -1 to 1) */
  TOLERANCE: 0.001, // ~0.5 pixels on a 1920px display

  /** Threshold for visual alignment detection in NDC space */
  ALIGNMENT_THRESHOLD: 0.01, // ~10 pixels on a 1920px display
} as const;

/**
 * Result of a visual alignment calculation
 */
export interface VisualAlignmentResult {
  /** The calculated position that creates visual alignment */
  position: THREE.Vector3;

  /** Number of iterations required to converge */
  iterations: number;

  /** Final error in screen space (NDC coordinates) */
  error: number;

  /** Whether the algorithm converged within tolerance */
  converged: boolean;
}

/**
 * Projects a 3D point to 2D screen space coordinates
 *
 * This function transforms world coordinates to Normalized Device Coordinates (NDC),
 * which range from -1 to 1 on both X and Y axes. The camera's view and projection
 * matrices are used to perform this transformation.
 *
 * IMPORTANT: This works with both PerspectiveCamera and OrthographicCamera.
 *
 * @param point - The 3D point in world coordinates
 * @param camera - The camera to project through
 * @returns A Vector3 where x,y are in NDC space [-1, 1] and z is depth
 *
 * @example
 * ```typescript
 * const worldPoint = new THREE.Vector3(10, 5, -3);
 * const screenPos = projectToScreen(worldPoint, camera);
 * // screenPos.x, screenPos.y are now in range [-1, 1]
 * ```
 */
export function projectToScreen(
  point: THREE.Vector3,
  camera: THREE.Camera
): THREE.Vector3 {
  // Ensure camera matrices are up to date
  camera.updateMatrixWorld();

  // Clone the point to avoid modifying the original
  const projected = point.clone();

  // Project to Normalized Device Coordinates (NDC)
  // Returns a vector where x,y are in range [-1, 1]
  projected.project(camera);

  return projected;
}

/**
 * Calculates the 2D distance between two points in screen space
 *
 * This measures how far apart two 3D points appear when viewed through the camera,
 * ignoring the Z (depth) component. Useful for determining if objects appear
 * visually connected or aligned.
 *
 * @param pointA - First 3D point
 * @param pointB - Second 3D point
 * @param camera - The camera to project through
 * @returns Distance in NDC space (0.0 to ~2.0 for points on screen)
 *
 * @example
 * ```typescript
 * const distance = getScreenSpaceDistance(beamEnd, waterfallTop, camera);
 * // distance < 0.01 means points appear very close on screen
 * ```
 */
export function getScreenSpaceDistance(
  pointA: THREE.Vector3,
  pointB: THREE.Vector3,
  camera: THREE.Camera
): number {
  const screenA = projectToScreen(pointA, camera);
  const screenB = projectToScreen(pointB, camera);

  // Calculate 2D Euclidean distance, ignoring Z (depth)
  const dx = screenB.x - screenA.x;
  const dy = screenB.y - screenA.y;

  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Checks if two 3D points appear visually aligned when viewed through the camera
 *
 * "Visually aligned" means the points appear close enough on screen that they
 * would be perceived as connected or overlapping by a viewer. This is different
 * from 3D geometric distance.
 *
 * @param pointA - First 3D point
 * @param pointB - Second 3D point
 * @param camera - The camera to project through
 * @param threshold - Optional custom threshold in NDC space (default: 0.01)
 * @returns true if points appear aligned within threshold
 *
 * @example
 * ```typescript
 * const aligned = checkVisualAlignment(waterSpout, waterfallTop, camera);
 * if (aligned) {
 *   console.log("Water appears to flow from spout to waterfall!");
 * }
 * ```
 */
export function checkVisualAlignment(
  pointA: THREE.Vector3,
  pointB: THREE.Vector3,
  camera: THREE.Camera,
  threshold: number = ALIGNMENT_CONFIG.ALIGNMENT_THRESHOLD
): boolean {
  const distance = getScreenSpaceDistance(pointA, pointB, camera);
  return distance < threshold;
}

/**
 * Calculates the position that creates perfect visual alignment between two points
 *
 * This is the core algorithm that solves the isometric alignment problem. It uses
 * binary search to find a Y-coordinate that, when combined with the geometric
 * midpoint for X and Z, projects to the screen-space midpoint between the two
 * endpoints.
 *
 * Algorithm:
 * 1. Use geometric midpoint for X and Z (these project linearly in isometric view)
 * 2. Project both endpoints to screen space to find target screen Y-coordinate
 * 3. Binary search for the 3D Y-coordinate that projects to that target
 * 4. Iterate until convergence within tolerance (typically <10 iterations)
 *
 * Why X and Z use geometric midpoint but Y doesn't:
 * - X and Z axes are parallel to the screen plane in isometric projection
 * - Y axis is tilted (typically ~35.264° in standard isometric)
 * - This tilt causes foreshortening, making geometric midpoint appear shifted
 *
 * @param pointA - First endpoint
 * @param pointB - Second endpoint
 * @param camera - The isometric camera
 * @returns Detailed result including position, iterations, error, and convergence status
 *
 * @example
 * ```typescript
 * const beamEnd = new THREE.Vector3(2.40, 0.00, -13.00);
 * const waterfallTop = new THREE.Vector3(20.64, 18.38, 5.44);
 *
 * const result = calculateVisualMidpoint(beamEnd, waterfallTop, camera);
 *
 * if (result.converged) {
 *   // result.position ≈ [11.52, 8.23, -3.78] (not [11.52, 9.19, -3.78])
 *   waterSpout.position.copy(result.position);
 * }
 * ```
 */
export function calculateVisualMidpoint(
  pointA: THREE.Vector3,
  pointB: THREE.Vector3,
  camera: THREE.Camera
): VisualAlignmentResult {
  // Step 1: Calculate geometric midpoint for X and Z
  // These axes project linearly in isometric view, so geometric midpoint works
  const midX = (pointA.x + pointB.x) / 2;
  const midZ = (pointA.z + pointB.z) / 2;

  // Step 2: Project both endpoints to screen space
  const screenA = projectToScreen(pointA, camera);
  const screenB = projectToScreen(pointB, camera);

  // Step 3: Calculate target screen Y-coordinate (midpoint in 2D screen space)
  const targetScreenY = (screenA.y + screenB.y) / 2;

  // Step 4: Binary search for Y-coordinate that projects to targetScreenY
  let minY = Math.min(pointA.y, pointB.y);
  let maxY = Math.max(pointA.y, pointB.y);
  let iterations = 0;
  let finalError = 0;
  let testY = (minY + maxY) / 2;

  while (iterations < ALIGNMENT_CONFIG.MAX_ITERATIONS) {
    // Test the midpoint of current search range
    testY = (minY + maxY) / 2;

    // Create test point with current Y estimate
    const testPoint = new THREE.Vector3(midX, testY, midZ);

    // Project to screen space to see where it appears
    const projectedY = projectToScreen(testPoint, camera).y;

    // Calculate error from target position
    finalError = projectedY - targetScreenY;

    // Check if we've converged within tolerance
    if (Math.abs(finalError) < ALIGNMENT_CONFIG.TOLERANCE) {
      return {
        position: new THREE.Vector3(midX, testY, midZ),
        iterations: iterations + 1,
        error: finalError,
        converged: true,
      };
    }

    // Binary search: narrow down the range
    if (projectedY > targetScreenY) {
      // Test point appears too high in screen space
      // Since Y-axis points up in 3D and up in screen space,
      // we need to reduce the Y-coordinate
      maxY = testY;
    } else {
      // Test point appears too low in screen space
      // Increase the Y-coordinate
      minY = testY;
    }

    iterations++;
  }

  // Failed to converge within max iterations
  // Return best approximation
  return {
    position: new THREE.Vector3(midX, testY, midZ),
    iterations: ALIGNMENT_CONFIG.MAX_ITERATIONS,
    error: finalError,
    converged: false,
  };
}

/**
 * Converts NDC coordinates to pixel coordinates
 *
 * Normalized Device Coordinates (NDC) range from -1 to 1 on both axes.
 * This function converts them to actual pixel positions on the canvas.
 *
 * Note: Screen Y-axis is inverted (0 at top, height at bottom)
 *
 * @param ndcX - X coordinate in NDC space [-1, 1]
 * @param ndcY - Y coordinate in NDC space [-1, 1]
 * @param canvasWidth - Canvas width in pixels
 * @param canvasHeight - Canvas height in pixels
 * @returns Object with x, y pixel coordinates
 *
 * @example
 * ```typescript
 * const screenPos = projectToScreen(worldPoint, camera);
 * const pixels = ndcToPixels(screenPos.x, screenPos.y, 1920, 1080);
 * // pixels.x, pixels.y are now in pixel coordinates
 * ```
 */
export function ndcToPixels(
  ndcX: number,
  ndcY: number,
  canvasWidth: number,
  canvasHeight: number
): { x: number; y: number } {
  const widthHalf = canvasWidth / 2;
  const heightHalf = canvasHeight / 2;

  return {
    x: (ndcX * widthHalf) + widthHalf,
    y: -(ndcY * heightHalf) + heightHalf, // Y is inverted in screen space
  };
}

/**
 * Diagnostic function to compare geometric vs visual midpoint
 *
 * Useful for debugging and understanding why geometric midpoints fail
 * in isometric projections. Returns detailed analysis of the difference.
 *
 * @param pointA - First endpoint
 * @param pointB - Second endpoint
 * @param camera - The camera
 * @returns Diagnostic information about both midpoint methods
 *
 * @example
 * ```typescript
 * const analysis = analyzeAlignmentError(beamEnd, waterfallTop, camera);
 * console.log(`Geometric Y: ${analysis.geometric.y}`);
 * console.log(`Visual Y: ${analysis.visual.position.y}`);
 * console.log(`Difference: ${analysis.difference.y} units`);
 * console.log(`Screen error: ${analysis.screenSpaceError} NDC units`);
 * ```
 */
export function analyzeAlignmentError(
  pointA: THREE.Vector3,
  pointB: THREE.Vector3,
  camera: THREE.Camera
): {
  geometric: THREE.Vector3;
  visual: VisualAlignmentResult;
  difference: THREE.Vector3;
  screenSpaceError: number;
} {
  // Calculate geometric midpoint (naive approach)
  const geometric = new THREE.Vector3(
    (pointA.x + pointB.x) / 2,
    (pointA.y + pointB.y) / 2,
    (pointA.z + pointB.z) / 2
  );

  // Calculate visual midpoint (correct approach)
  const visual = calculateVisualMidpoint(pointA, pointB, camera);

  // Calculate 3D difference
  const difference = new THREE.Vector3().subVectors(visual.position, geometric);

  // Calculate how far off the geometric midpoint appears in screen space
  const screenA = projectToScreen(pointA, camera);
  const screenB = projectToScreen(pointB, camera);
  const targetScreenY = (screenA.y + screenB.y) / 2;
  const geometricScreenY = projectToScreen(geometric, camera).y;
  const screenSpaceError = Math.abs(geometricScreenY - targetScreenY);

  return {
    geometric,
    visual,
    difference,
    screenSpaceError,
  };
}
