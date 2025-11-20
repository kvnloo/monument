import React, { useMemo } from 'react';
import * as THREE from 'three';
import { UNIT } from '../../../constants';
import { useTheme } from '../../../contexts';

interface BlockProps {
  position: [number, number, number];
  color?: string;
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export const BaseBlock: React.FC<BlockProps> = ({
  position,
  color,
  rotation = [0, 0, 0],
  scale = [1, 1, 1]
}) => {
  const { theme } = useTheme();
  const finalColor = color ?? theme.palette.brick;
  const geometry = useMemo(() => new THREE.BoxGeometry(UNIT, UNIT, UNIT), []);

  return (
    <mesh
      castShadow
      receiveShadow
      geometry={geometry}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      <meshStandardMaterial
        color={finalColor}
        roughness={0.8}
        metalness={0.0}
        flatShading={true}
      />
    </mesh>
  );
};
