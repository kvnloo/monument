import React from 'react';
import { useTheme } from '../../../contexts';

interface BlockProps {
  position: [number, number, number];
  color?: string;
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export const DomeCap: React.FC<BlockProps> = ({ position, color }) => {
  const { theme } = useTheme();
  const finalColor = color ?? theme.palette.brickDark;
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, 0.2, 0]}>
         <sphereGeometry args={[0.45, 16, 16, 0, Math.PI * 2, 0, Math.PI/2]} />
         <meshStandardMaterial color={finalColor} flatShading />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.7, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#F0F0F0" flatShading />
      </mesh>
    </group>
  );
};
