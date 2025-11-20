import React from 'react';
import { UNIT } from '../../../constants';
import { useTheme } from '../../../contexts';

interface BlockProps {
  position: [number, number, number];
  color?: string;
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export const TowerBlock: React.FC<BlockProps & { hasDoor?: boolean }> = ({
  position,
  color,
  scale=[1,1,1],
  rotation=[0,0,0],
  hasDoor = false
}) => {
  const { theme } = useTheme();
  const finalColor = color ?? theme.palette.brick;
  return (
    <group position={position} scale={scale} rotation={rotation}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.4, UNIT, 16]} />
        <meshStandardMaterial color={finalColor} flatShading />
      </mesh>
      {hasDoor && (
        <mesh position={[0, -0.1, 0.35]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.3, 0.5]} />
          <meshBasicMaterial color={theme.palette.door} />
        </mesh>
      )}
    </group>
  );
};
