import * as THREE from 'three';
import {
  calculateVisualMidpoint,
  projectToScreen,
  analyzeAlignmentError,
} from '../isometricAlignment';

/**
 * Diagnostic script to investigate why the algorithm returns geometric midpoint
 * instead of the corrected visual midpoint for the Water-Spout test case
 */

export function runDiagnostics() {
  // Create camera at isometric position
  const frustumSize = 50;
  const aspect = 1920 / 1080;
  const camera = new THREE.OrthographicCamera(
    (-frustumSize * aspect) / 2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    -frustumSize / 2,
    0.1,
    1000
  );

  camera.position.set(20, 20, 20);
  camera.lookAt(0, 0, 0);
  camera.up.set(0, 1, 0);

  // Water-Spout test case
  const beamA = new THREE.Vector3(2.40, 0.00, -13.00);
  const waterfall = new THREE.Vector3(20.64, 18.38, 5.44);
  const geometricY = 9.19;
  const expectedVisualY = 8.23;

  console.log('\n' + '='.repeat(80));
  console.log('DIAGNOSTIC ANALYSIS: Water-Spout Alignment Algorithm');
  console.log('='.repeat(80));

  // 1. Analyze input points
  console.log('\n1. INPUT POINTS:');
  console.log(`  Beam-A endpoint: [${beamA.x}, ${beamA.y}, ${beamA.z}]`);
  console.log(`  Waterfall top:   [${waterfall.x}, ${waterfall.y}, ${waterfall.z}]`);

  const screenA = projectToScreen(beamA, camera);
  const screenWaterfall = projectToScreen(waterfall, camera);
  console.log(`\n  Screen projection of Beam-A: [${screenA.x.toFixed(4)}, ${screenA.y.toFixed(4)}, ${screenA.z.toFixed(4)}]`);
  console.log(`  Screen projection of Waterfall: [${screenWaterfall.x.toFixed(4)}, ${screenWaterfall.y.toFixed(4)}, ${screenWaterfall.z.toFixed(4)}]`);

  const targetScreenY = (screenA.y + screenWaterfall.y) / 2;
  console.log(`\n  Target screen Y (midpoint): ${targetScreenY.toFixed(4)}`);

  // 2. Test geometric midpoint
  console.log('\n2. GEOMETRIC MIDPOINT TEST:');
  const geometricPoint = new THREE.Vector3(
    (beamA.x + waterfall.x) / 2,
    geometricY,
    (beamA.z + waterfall.z) / 2
  );
  const geometricScreen = projectToScreen(geometricPoint, camera);
  console.log(`  Geometric midpoint (Y=${geometricY}): [${geometricPoint.x.toFixed(2)}, ${geometricPoint.y.toFixed(2)}, ${geometricPoint.z.toFixed(2)}]`);
  console.log(`  Projects to screen: [${geometricScreen.x.toFixed(4)}, ${geometricScreen.y.toFixed(4)}, ${geometricScreen.z.toFixed(4)}]`);
  console.log(`  Screen Y error: ${(geometricScreen.y - targetScreenY).toFixed(6)}`);
  console.log(`  Error magnitude: ${Math.abs(geometricScreen.y - targetScreenY).toFixed(6)}`);

  if (Math.abs(geometricScreen.y - targetScreenY) < 0.001) {
    console.log(`  ⚠️  PROBLEM: Geometric midpoint already projects to target!`);
    console.log(`      This explains why binary search converges in 1 iteration.`);
  }

  // 3. Test expected visual Y
  console.log('\n3. EXPECTED VISUAL MIDPOINT TEST:');
  const visualPoint = new THREE.Vector3(
    (beamA.x + waterfall.x) / 2,
    expectedVisualY,
    (beamA.z + waterfall.z) / 2
  );
  const visualScreen = projectToScreen(visualPoint, camera);
  console.log(`  Visual midpoint (Y=${expectedVisualY}): [${visualPoint.x.toFixed(2)}, ${visualPoint.y.toFixed(2)}, ${visualPoint.z.toFixed(2)}]`);
  console.log(`  Projects to screen: [${visualScreen.x.toFixed(4)}, ${visualScreen.y.toFixed(4)}, ${visualScreen.z.toFixed(4)}]`);
  console.log(`  Screen Y error: ${(visualScreen.y - targetScreenY).toFixed(6)}`);
  console.log(`  Error magnitude: ${Math.abs(visualScreen.y - targetScreenY).toFixed(6)}`);

  // 4. Test different Y values to find which one matches target
  console.log('\n4. BINARY SEARCH SIMULATION:');
  console.log(`  Testing Y range from ${beamA.y} to ${waterfall.y}`);
  console.log(`  Target screen Y: ${targetScreenY.toFixed(4)}\n`);

  const yValues = [
    beamA.y,
    (beamA.y + waterfall.y) / 4,
    (beamA.y + waterfall.y) / 2,
    (beamA.y + waterfall.y) * 0.75,
    waterfall.y,
    expectedVisualY,
    geometricY,
  ].sort((a, b) => a - b);

  const results = yValues.map((y) => {
    const point = new THREE.Vector3((beamA.x + waterfall.x) / 2, y, (beamA.z + waterfall.z) / 2);
    const screen = projectToScreen(point, camera);
    const error = screen.y - targetScreenY;
    return { y, screenY: screen.y, error };
  });

  results.forEach(({ y, screenY, error }) => {
    const match = Math.abs(error) < 0.001 ? '✓ MATCH' : '';
    console.log(`  Y=${y.toFixed(2)}: projects to screen Y=${screenY.toFixed(4)}, error=${error.toFixed(6)} ${match}`);
  });

  // 5. Run actual algorithm
  console.log('\n5. ACTUAL ALGORITHM RESULT:');
  const result = calculateVisualMidpoint(beamA, waterfall, camera);
  console.log(`  Position: [${result.position.x.toFixed(2)}, ${result.position.y.toFixed(2)}, ${result.position.z.toFixed(2)}]`);
  console.log(`  Iterations: ${result.iterations}`);
  console.log(`  Converged: ${result.converged}`);
  console.log(`  Final error (NDC): ${result.error.toFixed(6)}`);

  // 6. Analysis and recommendations
  console.log('\n6. ANALYSIS:');
  console.log(`  The algorithm converges in ${result.iterations} iteration(s).`);
  console.log(`  This is typically caused by the initial testY (geometric midpoint)`);
  console.log(`  already satisfying the convergence criterion (|error| < 0.001).`);

  if (result.position.y === geometricY) {
    console.log(`\n  ✗ BUG IDENTIFIED: Algorithm is returning geometric midpoint!`);
    console.log(`    Expected Y: ${expectedVisualY}`);
    console.log(`    Got Y: ${result.position.y.toFixed(2)}`);
    console.log(`    Difference: ${Math.abs(expectedVisualY - result.position.y).toFixed(2)}`);
  }

  console.log('\n7. RECOMMENDATION:');
  if (geometricScreen.y === targetScreenY || Math.abs(geometricScreen.y - targetScreenY) < 0.001) {
    console.log(`  HYPOTHESIS: The camera setup or coordinate system in tests differs`);
    console.log(`  from the production environment where Y=8.23 was measured.`);
    console.log(`\n  Possible causes:`);
    console.log(`  1. Camera aspect ratio or frustum size differs`);
    console.log(`  2. Camera position is different than (20, 20, 20)`);
    console.log(`  3. Camera look-at target is different`);
    console.log(`  4. The original correction (8.23) was for a different camera setup`);
  }

  console.log('\n' + '='.repeat(80));
  console.log('END DIAGNOSTIC');
  console.log('='.repeat(80) + '\n');

  return { result, results, screenA, screenWaterfall, targetScreenY };
}

// Export for test use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runDiagnostics };
}
