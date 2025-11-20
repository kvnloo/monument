import React from 'react';
import { useTheme } from '../../../contexts';

interface BlockProps {
  position: [number, number, number];
  color?: string;
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export const PillarBlock: React.FC<BlockProps & { height?: number }> = ({
  position,
  color,
  height = 6
}) => {
  const { theme } = useTheme();
  const finalColor = color ?? theme.palette.shadow;
  return (
    <mesh castShadow receiveShadow position={position}>
      <boxGeometry args={[0.8, height, 0.8]} />
      <meshStandardMaterial color={finalColor} flatShading />
    </mesh>
  );
};
