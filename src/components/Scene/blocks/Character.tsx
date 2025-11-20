import React from 'react';
import { useTheme } from '../../../contexts';

export const Character: React.FC<{
  position: [number, number, number];
  color?: string;
  type?: 'ida' | 'totem'
}> = ({
  position,
  color,
  type = 'ida'
}) => {
  const { theme } = useTheme();
  const finalColor = color ?? theme.palette.character;
  return (
    <group position={position}>
      {type === 'ida' ? (
        <>
          <mesh castShadow position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.1, 0.25, 0.6, 16]} />
            <meshStandardMaterial color={finalColor} roughness={0.5} />
          </mesh>
          <mesh castShadow position={[0, 0.6, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color={finalColor} roughness={0.5} />
          </mesh>
        </>
      ) : (
        <group position={[0, 0.5, 0]}>
          <mesh castShadow position={[0, -0.2, 0]}>
             <boxGeometry args={[0.5, 0.5, 0.5]} />
             <meshStandardMaterial color={finalColor} roughness={0.5} />
          </mesh>
          <mesh castShadow position={[0, 0.3, 0]}>
             <boxGeometry args={[0.5, 0.5, 0.5]} />
             <meshStandardMaterial color={finalColor} roughness={0.5} />
          </mesh>
           <mesh position={[0.15, 0.3, 0.26]}>
              <circleGeometry args={[0.08, 16]} />
              <meshBasicMaterial color="#000" />
           </mesh>
           <mesh position={[-0.15, 0.3, 0.26]}>
              <circleGeometry args={[0.08, 16]} />
              <meshBasicMaterial color="#000" />
           </mesh>
        </group>
      )}
    </group>
  );
};
