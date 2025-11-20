import React, { useMemo, useRef, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../../../contexts';
import { createWaterTexture } from './utils';

interface BlockProps {
  position: [number, number, number];
  color?: string;
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

/**
 * WaterBlock
 * Supports directional flow animation.
 * flowDirection: [x, z] vector.
 */
export const WaterBlock: React.FC<BlockProps & {
  axis?: 'x' | 'z',
  walls?: [boolean, boolean],
  endWalls?: [boolean, boolean],
  flowDirection?: [number, number]
}> = ({
  position,
  color,
  axis = 'x',
  walls = [true, true],
  endWalls = [false, false],
  flowDirection = [0, 0]
}) => {
  const { theme } = useTheme();
  const finalColor = color ?? theme.palette.brickDark;
  const waterRef = useRef<THREE.Mesh>(null);
  const isX = axis === 'x';

  // Procedural texture generation
  const waterTexture = useMemo(() => createWaterTexture(), []);
  const textureInstance = useMemo(() => waterTexture.clone(), [waterTexture]);

  const wallThickness = 0.15;
  const floorHeight = 0.2;
  const waterBaseHeight = 0.15;
  const waterHeight = 0.7;

  // Dynamic Water Sizing with Gap to prevent Z-Fighting
  const waterWidth = 0.68;
  const gap = 0.01; // Gap to prevent overlapping faces
  let waterLength = 1;
  let waterOffset = 0;

  if (endWalls[0]) {
    waterLength -= (wallThickness + gap);
    waterOffset += (wallThickness + gap) / 2;
  }
  if (endWalls[1]) {
    waterLength -= (wallThickness + gap);
    waterOffset -= (wallThickness + gap) / 2;
  }

  const waterArgs: [number, number, number] = isX
    ? [waterLength, waterHeight, waterWidth]
    : [waterWidth, waterHeight, waterLength];

  const waterPos: [number, number, number] = isX
    ? [waterOffset, waterBaseHeight, 0]
    : [0, waterBaseHeight, waterOffset];

  // Fix Texture Stretching by Repeating it based on length
  useLayoutEffect(() => {
    // Calculate repeat count based on actual length to maintain consistent texture density
    const repeatX = isX ? waterArgs[0] : 1;
    const repeatY = !isX ? waterArgs[2] : 1;

    // Ensure at least 1 repeat so it doesn't stretch weirdly on small blocks
    textureInstance.repeat.set(Math.max(1, repeatX), Math.max(1, repeatY));
  }, [waterArgs, isX, textureInstance]);

  useFrame((state, delta) => {
    if (waterRef.current) {
      waterRef.current.position.y = waterBaseHeight + Math.sin(state.clock.elapsedTime * 3 + position[0] * 0.5 + position[2] * 0.5) * 0.02;

      const speed = 1.5;
      // Adjust offset based on flow direction
      // Texture mapping: U is typically X-aligned in box mapping for top face.
      textureInstance.offset.x += flowDirection[0] * speed * delta;
      textureInstance.offset.y -= flowDirection[1] * speed * delta;
    }
  });

  // Recalculate End Wall geometry
  const getEndWallMetrics = (isStart: boolean) => {
    let length = 1;
    let offset = 0;
    if (walls[0] && walls[1]) {
      length = 1 - (2 * wallThickness);
      offset = 0;
    } else if (walls[0]) {
      length = 1 - wallThickness;
      offset = -wallThickness / 2;
    } else if (walls[1]) {
      length = 1 - wallThickness;
      offset = wallThickness / 2;
    }
    const mainAxisOffset = isStart ? -0.5 + wallThickness/2 : 0.5 - wallThickness/2;
    if (isX) {
      return {
        args: [wallThickness, 1, length] as [number, number, number],
        position: [mainAxisOffset, 0, offset] as [number, number, number]
      };
    } else {
      return {
        args: [length, 1, wallThickness] as [number, number, number],
        position: [offset, 0, mainAxisOffset] as [number, number, number]
      };
    }
  };

  const startMetrics = getEndWallMetrics(true);
  const endMetrics = getEndWallMetrics(false);

  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, -0.5 + floorHeight/2, 0]}>
        <boxGeometry args={[1, floorHeight, 1]} />
        <meshStandardMaterial color={finalColor} flatShading />
      </mesh>

      {isX ? (
        <>
          {walls[0] && (
            <mesh castShadow receiveShadow position={[0, 0, 0.5 - wallThickness/2]}>
              <boxGeometry args={[1, 1, wallThickness]} />
              <meshStandardMaterial color={finalColor} flatShading />
            </mesh>
          )}
          {walls[1] && (
            <mesh castShadow receiveShadow position={[0, 0, -0.5 + wallThickness/2]}>
              <boxGeometry args={[1, 1, wallThickness]} />
              <meshStandardMaterial color={finalColor} flatShading />
            </mesh>
          )}
        </>
      ) : (
        <>
          {walls[0] && (
            <mesh castShadow receiveShadow position={[0.5 - wallThickness/2, 0, 0]}>
              <boxGeometry args={[wallThickness, 1, 1]} />
              <meshStandardMaterial color={finalColor} flatShading />
            </mesh>
          )}
          {walls[1] && (
            <mesh castShadow receiveShadow position={[-0.5 + wallThickness/2, 0, 0]}>
              <boxGeometry args={[wallThickness, 1, 1]} />
              <meshStandardMaterial color={finalColor} flatShading />
            </mesh>
          )}
        </>
      )}

      {endWalls[0] && (
        <mesh castShadow receiveShadow position={startMetrics.position}>
          <boxGeometry args={startMetrics.args} />
          <meshStandardMaterial color={finalColor} flatShading />
        </mesh>
      )}
      {endWalls[1] && (
        <mesh castShadow receiveShadow position={endMetrics.position}>
          <boxGeometry args={endMetrics.args} />
          <meshStandardMaterial color={finalColor} flatShading />
        </mesh>
      )}

      <mesh ref={waterRef} position={waterPos}>
        <boxGeometry args={waterArgs} />
        {/* Subtle water effect with visible flowing streaks */}
        <meshStandardMaterial
          color="#D0F0F0"
          roughness={0.2}
          metalness={0.3}
          emissive={theme.palette.water}
          emissiveIntensity={0.28}
          transparent
          opacity={0.4}
          map={textureInstance}
        />
      </mesh>
    </group>
  );
};
