import React from 'react';
import { useTheme } from '../../../contexts';

interface BlockProps {
  position: [number, number, number];
  color?: string;
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export const WalledBlock: React.FC<BlockProps & {
  axis?: 'x' | 'z',
  walls?: [boolean, boolean],
  endWalls?: [boolean, boolean]
}> = ({
  position,
  color,
  axis = 'x',
  walls = [true, true],
  endWalls = [false, false]
}) => {
  const { theme } = useTheme();
  const finalColor = color ?? theme.palette.brick;
  const isX = axis === 'x';
  const wallThickness = 0.15;
  const wallHeight = 0.25;

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
        args: [wallThickness, wallHeight, length] as [number, number, number],
        position: [mainAxisOffset, 0.3, offset] as [number, number, number]
      };
    } else {
      return {
        args: [length, wallHeight, wallThickness] as [number, number, number],
        position: [offset, 0.3, mainAxisOffset] as [number, number, number]
      };
    }
  };

  const startMetrics = getEndWallMetrics(true);
  const endMetrics = getEndWallMetrics(false);

  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, -0.1, 0]}>
        <boxGeometry args={[1, 0.8, 1]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>

      {isX ? (
        <>
          {walls[0] && (
            <mesh castShadow receiveShadow position={[0, 0.3, 0.5 - wallThickness/2]}>
              <boxGeometry args={[1, wallHeight, wallThickness]} />
              <meshStandardMaterial color={color} flatShading />
            </mesh>
          )}
          {walls[1] && (
            <mesh castShadow receiveShadow position={[0, 0.3, -0.5 + wallThickness/2]}>
              <boxGeometry args={[1, wallHeight, wallThickness]} />
              <meshStandardMaterial color={color} flatShading />
            </mesh>
          )}
        </>
      ) : (
        <>
          {walls[0] && (
            <mesh castShadow receiveShadow position={[0.5 - wallThickness/2, 0.3, 0]}>
              <boxGeometry args={[wallThickness, wallHeight, 1]} />
              <meshStandardMaterial color={color} flatShading />
            </mesh>
          )}
          {walls[1] && (
            <mesh castShadow receiveShadow position={[-0.5 + wallThickness/2, 0.3, 0]}>
              <boxGeometry args={[wallThickness, wallHeight, 1]} />
              <meshStandardMaterial color={color} flatShading />
            </mesh>
          )}
        </>
      )}

      {endWalls[0] && (
        <mesh castShadow receiveShadow position={startMetrics.position}>
          <boxGeometry args={startMetrics.args} />
          <meshStandardMaterial color={color} flatShading />
        </mesh>
      )}
      {endWalls[1] && (
        <mesh castShadow receiveShadow position={endMetrics.position}>
          <boxGeometry args={endMetrics.args} />
          <meshStandardMaterial color={color} flatShading />
        </mesh>
      )}
    </group>
  );
};
