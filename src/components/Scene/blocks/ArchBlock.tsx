import React from 'react';
import { UNIT } from '../../../constants';
import { useTheme } from '../../../contexts';

interface BlockProps {
  position: [number, number, number];
  color?: string;
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export const ArchBlock: React.FC<BlockProps> = ({ position, color, rotation=[0,0,0] }) => {
  const { theme } = useTheme();
  const finalColor = color ?? theme.palette.brick;
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow receiveShadow position={[0, 0.35, 0]}>
         <boxGeometry args={[UNIT, 0.3, UNIT]} />
         <meshStandardMaterial color={finalColor} roughness={0.8} flatShading />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.35, -0.15, 0]}>
         <boxGeometry args={[0.3, 0.7, UNIT]} />
         <meshStandardMaterial color={finalColor} roughness={0.8} flatShading />
      </mesh>
      <mesh castShadow receiveShadow position={[0.35, -0.15, 0]}>
         <boxGeometry args={[0.3, 0.7, UNIT]} />
         <meshStandardMaterial color={finalColor} roughness={0.8} flatShading />
      </mesh>
      <mesh position={[0, -0.15, 0.4]}>
          <planeGeometry args={[0.38, 0.7]} />
          <meshBasicMaterial color={theme.palette.door} />
      </mesh>
    </group>
  );
};
