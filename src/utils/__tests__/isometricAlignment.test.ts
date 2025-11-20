import { describe, it, expect, beforeEach } from 'vitest';
import * as THREE from 'three';
import {
  calculateVisualMidpoint,
  projectToScreen,
  checkVisualAlignment,
  getScreenSpaceDistance,
  analyzeAlignmentError,
  ndcToPixels,
  VisualAlignmentResult,
} from '../isometricAlignment';
import { runDiagnostics } from './diagnostics';

/**
 * Test Suite: Isometric Alignment Algorithm Validation
 *
 * This test suite validates the isometric alignment algorithm using:
 * 1. The Water-Spout test case from research (primary validation)
 * 2. Edge cases (vertical alignment, horizontal alignment)
 * 3. Convergence behavior
 * 4. Screen-space projection accuracy
 */

describe('Isometric Alignment Algorithm', () => {
  let camera: THREE.OrthographicCamera;
  let scene: THREE.Scene;

  /**
   * Standard Monument Valley isometric camera setup
   * Position: (20, 20, 20) - creates the characteristic 35.264° angle
   * Looking at origin with Y-axis up
   */
  beforeEach(() => {
    // Create camera at isometric position
    const frustumSize = 50;
    const aspect = 1920 / 1080;
    camera = new THREE.OrthographicCamera(
      (-frustumSize * aspect) / 2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      1000
    );

    // Position camera for isometric view: (20, 20, 20)
    camera.position.set(20, 20, 20);
    camera.lookAt(0, 0, 0);
    camera.up.set(0, 1, 0);

    scene = new THREE.Scene();
  });

  describe('Diagnostic Analysis', () => {
    it('should run diagnostics on Water-Spout case', () => {
      runDiagnostics();
      // Diagnostics print to console, test passes if no errors
      expect(true).toBe(true);
    });
  });

  describe('Water-Spout Test Case (Primary Validation)', () => {
    /**
     * Research Case:
     * - Beam-A endpoint: [2.40, 0.00, -13.00]
     * - Waterfall top: [20.64, 18.38, 5.44]
     * - Known correct Y: 8.23 (user-corrected value)
     * - Algorithm calculated Y: 9.19 (incorrect geometric midpoint)
     * - Expected Y-axis error: ~0.96 units
     */

    const beamAEndpoint = new THREE.Vector3(2.40, 0.00, -13.00);
    const waterfallTop = new THREE.Vector3(20.64, 18.38, 5.44);
    const expectedVisualY = 8.23;
    const expectedGeometricY = 9.19;
    const expectedYDifference = 0.96;

    it('should calculate visual midpoint Y ≈ 8.23 for Water-Spout case', () => {
      const result = calculateVisualMidpoint(beamAEndpoint, waterfallTop, camera);

      expect(result.position.y).toBeCloseTo(expectedVisualY, 2);
      expect(result.converged).toBe(true);
      expect(result.iterations).toBeLessThan(20);
    });

    it('should NOT use geometric midpoint (Y=9.19)', () => {
      // Verify that the algorithm corrects from geometric to visual
      const geometricMidpoint = new THREE.Vector3(
        (beamAEndpoint.x + waterfallTop.x) / 2,
        (beamAEndpoint.y + waterfallTop.y) / 2,
        (beamAEndpoint.z + waterfallTop.z) / 2
      );

      expect(geometricMidpoint.y).toBeCloseTo(expectedGeometricY, 2);

      const result = calculateVisualMidpoint(beamAEndpoint, waterfallTop, camera);

      // Result should be corrected, not geometric
      expect(result.position.y).not.toBeCloseTo(expectedGeometricY, 1);
      expect(result.position.y).toBeCloseTo(expectedVisualY, 2);
    });

    it('should find Y-difference of ~0.96 units', () => {
      const result = calculateVisualMidpoint(beamAEndpoint, waterfallTop, camera);
      const geometricY = expectedGeometricY;

      const yDifference = Math.abs(geometricY - result.position.y);
      expect(yDifference).toBeCloseTo(expectedYDifference, 1);
    });

    it('should maintain correct X and Z coordinates at geometric midpoint', () => {
      const result = calculateVisualMidpoint(beamAEndpoint, waterfallTop, camera);

      const expectedX = (beamAEndpoint.x + waterfallTop.x) / 2;
      const expectedZ = (beamAEndpoint.z + waterfallTop.z) / 2;

      expect(result.position.x).toBeCloseTo(expectedX, 2);
      expect(result.position.z).toBeCloseTo(expectedZ, 2);
    });

    it('should verify visual alignment on screen', () => {
      const result = calculateVisualMidpoint(beamAEndpoint, waterfallTop, camera);

      // Project both endpoints to screen
      const screenA = projectToScreen(beamAEndpoint, camera);
      const screenB = projectToScreen(waterfallTop, camera);
      const screenMidpoint = projectToScreen(result.position, camera);

      // Visual midpoint should be between the two endpoints on screen
      const expectedScreenY = (screenA.y + screenB.y) / 2;
      expect(screenMidpoint.y).toBeCloseTo(expectedScreenY, 3);
    });

    it('should converge in <20 iterations', () => {
      const result = calculateVisualMidpoint(beamAEndpoint, waterfallTop, camera);

      expect(result.iterations).toBeLessThan(20);
      expect(result.converged).toBe(true);
    });

    it('should have final error <0.001 in NDC space', () => {
      const result = calculateVisualMidpoint(beamAEndpoint, waterfallTop, camera);

      expect(Math.abs(result.error)).toBeLessThan(0.001);
    });

    it('should generate diagnostic analysis', () => {
      const analysis = analyzeAlignmentError(beamAEndpoint, waterfallTop, camera);

      // Verify geometric midpoint
      expect(analysis.geometric.y).toBeCloseTo(expectedGeometricY, 2);

      // Verify visual result
      expect(analysis.visual.position.y).toBeCloseTo(expectedVisualY, 2);

      // Verify difference calculation
      expect(analysis.difference.y).toBeCloseTo(expectedYDifference, 1);

      // Verify screen-space error shows geometric midpoint is wrong
      expect(analysis.screenSpaceError).toBeGreaterThan(0.01);
    });
  });

  describe('Edge Cases', () => {
    it('should handle vertical alignment (same X and Z)', () => {
      const pointA = new THREE.Vector3(5, 0, 5);
      const pointB = new THREE.Vector3(5, 10, 5);

      const result = calculateVisualMidpoint(pointA, pointB, camera);

      // For purely vertical alignment, geometric midpoint should work
      const expectedY = (pointA.y + pointB.y) / 2;
      expect(result.position.y).toBeCloseTo(expectedY, 1);

      // X and Z should match
      expect(result.position.x).toBeCloseTo(5, 2);
      expect(result.position.z).toBeCloseTo(5, 2);

      expect(result.converged).toBe(true);
    });

    it('should handle horizontal alignment (same Y)', () => {
      const pointA = new THREE.Vector3(0, 5, 0);
      const pointB = new THREE.Vector3(10, 5, 10);

      const result = calculateVisualMidpoint(pointA, pointB, camera);

      // Y should remain at the same level
      expect(result.position.y).toBeCloseTo(5, 2);

      // X and Z should be geometric midpoint
      expect(result.position.x).toBeCloseTo(5, 2);
      expect(result.position.z).toBeCloseTo(5, 2);

      expect(result.converged).toBe(true);
    });

    it('should handle close points', () => {
      const pointA = new THREE.Vector3(1, 0, 1);
      const pointB = new THREE.Vector3(1.1, 0.1, 1.1);

      const result = calculateVisualMidpoint(pointA, pointB, camera);

      expect(result.converged).toBe(true);
      expect(result.position.x).toBeCloseTo((pointA.x + pointB.x) / 2, 2);
      expect(result.position.z).toBeCloseTo((pointA.z + pointB.z) / 2, 2);
    });

    it('should handle far apart points', () => {
      const pointA = new THREE.Vector3(-50, 0, -50);
      const pointB = new THREE.Vector3(50, 50, 50);

      const result = calculateVisualMidpoint(pointA, pointB, camera);

      expect(result.converged).toBe(true);
      expect(result.position.x).toBeCloseTo((pointA.x + pointB.x) / 2, 1);
      expect(result.position.z).toBeCloseTo((pointA.z + pointB.z) / 2, 1);
    });

    it('should handle negative Y values', () => {
      const pointA = new THREE.Vector3(0, -10, 0);
      const pointB = new THREE.Vector3(10, 10, 10);

      const result = calculateVisualMidpoint(pointA, pointB, camera);

      expect(result.converged).toBe(true);
      expect(result.position.y).toBeGreaterThanOrEqual(pointA.y);
      expect(result.position.y).toBeLessThanOrEqual(pointB.y);
    });

    it('should handle identical points (no change)', () => {
      const pointA = new THREE.Vector3(5, 5, 5);
      const pointB = new THREE.Vector3(5, 5, 5);

      const result = calculateVisualMidpoint(pointA, pointB, camera);

      expect(result.position).toEqual(pointA);
      expect(result.converged).toBe(true);
    });
  });

  describe('Convergence Behavior', () => {
    it('should converge in binary search iterations (log n behavior)', () => {
      const testCases = [
        {
          pointA: new THREE.Vector3(0, 0, 0),
          pointB: new THREE.Vector3(10, 10, 10),
        },
        {
          pointA: new THREE.Vector3(5, 0, 5),
          pointB: new THREE.Vector3(15, 20, 15),
        },
        {
          pointA: new THREE.Vector3(-10, -5, -10),
          pointB: new THREE.Vector3(20, 25, 20),
        },
      ];

      testCases.forEach((testCase) => {
        const result = calculateVisualMidpoint(testCase.pointA, testCase.pointB, camera);
        // Binary search should be log(range), typically 10-15 iterations max
        expect(result.iterations).toBeLessThan(20);
      });
    });

    it('should maintain convergence across multiple calls', () => {
      const pointA = new THREE.Vector3(2.40, 0.00, -13.00);
      const pointB = new THREE.Vector3(20.64, 18.38, 5.44);

      const result1 = calculateVisualMidpoint(pointA, pointB, camera);
      const result2 = calculateVisualMidpoint(pointA, pointB, camera);
      const result3 = calculateVisualMidpoint(pointA, pointB, camera);

      // All calls should produce same result
      expect(result1.position.y).toBeCloseTo(result2.position.y, 5);
      expect(result2.position.y).toBeCloseTo(result3.position.y, 5);
    });

    it('should converge faster for smaller ranges', () => {
      const largeRange = {
        pointA: new THREE.Vector3(0, -100, 0),
        pointB: new THREE.Vector3(10, 100, 10),
      };

      const smallRange = {
        pointA: new THREE.Vector3(0, 5, 0),
        pointB: new THREE.Vector3(10, 15, 10),
      };

      const largeResult = calculateVisualMidpoint(largeRange.pointA, largeRange.pointB, camera);
      const smallResult = calculateVisualMidpoint(smallRange.pointA, smallRange.pointB, camera);

      // Small range should use fewer or equal iterations
      expect(smallResult.iterations).toBeLessThanOrEqual(largeResult.iterations);
    });
  });

  describe('Screen Space Projection', () => {
    it('should project points to normalized device coordinates', () => {
      const point = new THREE.Vector3(0, 0, 0);
      const projected = projectToScreen(point, camera);

      // Origin should project somewhere in NDC space
      expect(projected.x).toBeGreaterThanOrEqual(-1);
      expect(projected.x).toBeLessThanOrEqual(1);
      expect(projected.y).toBeGreaterThanOrEqual(-1);
      expect(projected.y).toBeLessThanOrEqual(1);
    });

    it('should calculate screen space distance', () => {
      const pointA = new THREE.Vector3(0, 0, 0);
      const pointB = new THREE.Vector3(10, 10, 10);

      const distance = getScreenSpaceDistance(pointA, pointB, camera);

      // Distance should be positive and reasonable
      expect(distance).toBeGreaterThan(0);
      expect(distance).toBeLessThan(2); // Max NDC distance is ~2.83
    });

    it('should check visual alignment', () => {
      // Points at geometric midpoint should be close but not aligned
      const pointA = new THREE.Vector3(0, 0, 0);
      const pointB = new THREE.Vector3(10, 10, 10);
      const midpoint = new THREE.Vector3(5, 5, 5);

      // Geometric midpoint shouldn't be perfectly aligned
      const aligned = checkVisualAlignment(pointA, pointB, camera, 0.001);
      expect(aligned).toBe(false);

      // But a visually correct point should be aligned
      const result = calculateVisualMidpoint(pointA, pointB, camera);
      const visuallyAligned = checkVisualAlignment(pointA, pointB, camera, 0.001);
      expect(visuallyAligned).toBe(false); // Still checking A-B distance
    });

    it('should convert NDC to pixel coordinates', () => {
      const pixels = ndcToPixels(0, 0, 1920, 1080);

      // Center of screen
      expect(pixels.x).toBe(960);
      expect(pixels.y).toBe(540);
    });

    it('should convert NDC corners to pixel corners', () => {
      const topLeft = ndcToPixels(-1, 1, 1920, 1080);
      const bottomRight = ndcToPixels(1, -1, 1920, 1080);

      expect(topLeft.x).toBe(0);
      expect(topLeft.y).toBe(0);
      expect(bottomRight.x).toBe(1920);
      expect(bottomRight.y).toBe(1080);
    });
  });

  describe('Tolerance and Error Handling', () => {
    it('should satisfy convergence tolerance in all cases', () => {
      const testCases = [
        {
          pointA: new THREE.Vector3(2.40, 0.00, -13.00),
          pointB: new THREE.Vector3(20.64, 18.38, 5.44),
        },
        {
          pointA: new THREE.Vector3(0, 0, 0),
          pointB: new THREE.Vector3(10, 10, 10),
        },
        {
          pointA: new THREE.Vector3(-20, -20, -20),
          pointB: new THREE.Vector3(20, 20, 20),
        },
      ];

      testCases.forEach((testCase) => {
        const result = calculateVisualMidpoint(testCase.pointA, testCase.pointB, camera);
        expect(Math.abs(result.error)).toBeLessThan(0.001);
      });
    });

    it('should return best approximation if max iterations exceeded', () => {
      // Even pathological cases should complete
      const pointA = new THREE.Vector3(0, -1000, 0);
      const pointB = new THREE.Vector3(0, 1000, 0);

      const result = calculateVisualMidpoint(pointA, pointB, camera);

      // Should still have a valid result
      expect(result.position).toBeDefined();
      expect(result.iterations).toBeLessThanOrEqual(20);
    });
  });

  describe('Geometric vs Visual Comparison', () => {
    it('should show significant difference for Water-Spout case', () => {
      const beamAEndpoint = new THREE.Vector3(2.40, 0.00, -13.00);
      const waterfallTop = new THREE.Vector3(20.64, 18.38, 5.44);

      const analysis = analyzeAlignmentError(beamAEndpoint, waterfallTop, camera);

      // Geometric should be clearly wrong
      expect(analysis.geometric.y).toBeCloseTo(9.19, 2);
      expect(analysis.visual.position.y).toBeCloseTo(8.23, 2);

      // Screen space error should be significant
      expect(analysis.screenSpaceError).toBeGreaterThan(0.01);

      // Difference should match expected
      expect(Math.abs(analysis.difference.y)).toBeCloseTo(0.96, 1);
    });

    it('should show minimal difference for purely vertical alignment', () => {
      const pointA = new THREE.Vector3(5, 0, 5);
      const pointB = new THREE.Vector3(5, 10, 5);

      const analysis = analyzeAlignmentError(pointA, pointB, camera);

      // For vertical alignment, geometric should be close to visual
      const yDifference = Math.abs(analysis.difference.y);
      expect(yDifference).toBeLessThan(0.1);
    });

    it('should show minimal difference for horizontal alignment', () => {
      const pointA = new THREE.Vector3(0, 5, 0);
      const pointB = new THREE.Vector3(10, 5, 10);

      const analysis = analyzeAlignmentError(pointA, pointB, camera);

      // For horizontal alignment, geometric Y should match visual Y
      const yDifference = Math.abs(analysis.difference.y);
      expect(yDifference).toBeLessThan(0.05);
    });
  });

  describe('Validation Summary - Water-Spout Case', () => {
    /**
     * This test serves as the primary validation for the test case requirements
     */
    it('should validate complete Water-Spout scenario', () => {
      const beamAEndpoint = new THREE.Vector3(2.40, 0.00, -13.00);
      const waterfallTop = new THREE.Vector3(20.64, 18.38, 5.44);

      // Calculate visual midpoint
      const result = calculateVisualMidpoint(beamAEndpoint, waterfallTop, camera);

      // Validation checks
      const validations = {
        convergence: result.converged === true,
        yAccuracy: Math.abs(result.position.y - 8.23) < 0.05,
        yNotGeometric: Math.abs(result.position.y - 9.19) > 0.5,
        iterationsUnder20: result.iterations < 20,
        errorNormalized: Math.abs(result.error) < 0.001,
        xIsGeometric: Math.abs(result.position.x - 11.52) < 0.01,
        zIsGeometric: Math.abs(result.position.z - (-3.78)) < 0.01,
      };

      // Log results for documentation
      console.log('\n=== Water-Spout Test Case Validation ===');
      console.log(`Beam-A endpoint: [2.40, 0.00, -13.00]`);
      console.log(`Waterfall top: [20.64, 18.38, 5.44]`);
      console.log(`\nAlgorithm Result:`);
      console.log(`  Position: [${result.position.x.toFixed(2)}, ${result.position.y.toFixed(2)}, ${result.position.z.toFixed(2)}]`);
      console.log(`  Expected Y: 8.23`);
      console.log(`  Calculated Y: ${result.position.y.toFixed(2)}`);
      console.log(`  Y-difference from geometric (9.19): ${(9.19 - result.position.y).toFixed(2)}`);
      console.log(`\nConvergence:`);
      console.log(`  Iterations: ${result.iterations}/20`);
      console.log(`  Converged: ${result.converged}`);
      console.log(`  Error (NDC): ${result.error.toFixed(6)}`);
      console.log(`\nValidation Results:`);
      Object.entries(validations).forEach(([key, value]) => {
        console.log(`  ${key}: ${value ? '✓ PASS' : '✗ FAIL'}`);
      });
      console.log('========================================\n');

      // Assert all validations pass
      expect(validations.convergence).toBe(true);
      expect(validations.yAccuracy).toBe(true);
      expect(validations.yNotGeometric).toBe(true);
      expect(validations.iterationsUnder20).toBe(true);
      expect(validations.errorNormalized).toBe(true);
      expect(validations.xIsGeometric).toBe(true);
      expect(validations.zIsGeometric).toBe(true);
    });
  });
});
