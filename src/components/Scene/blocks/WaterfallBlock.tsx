import React, { useMemo } from 'react';
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

export const WaterfallBlock: React.FC<Partial<BlockProps> & { height?: number }> = ({
  position = [0, 0, 0],
  height = 6,
  color
}) => {
  const { theme } = useTheme();
  const finalColor = color ?? theme.palette.waterfall;
  const waterTexture = useMemo(() => createWaterTexture(), []);
  const textureInstance = useMemo(() => {
    const t = waterTexture.clone();
    // Vertically repeat based on height to prevent stretching
    t.repeat.set(1, height * 0.5); // 0.5 multiplier to stretch it a bit, but not too much
    return t;
  }, [waterTexture, height]);

  useFrame((state, delta) => {
    textureInstance.offset.y += 1.5 * delta;
  });

  return (
    <group position={position}>
      <mesh position={[0, -height/2, 0]}>
        <boxGeometry args={[0.68, height, 0.68]} />
        <meshStandardMaterial
          color="white"
          emissive={finalColor}
          emissiveIntensity={0.2}
          map={textureInstance}
        />
      </mesh>

      <mesh position={[0, -height + 0.1, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <ringGeometry args={[0.4, 0.7, 16]} />
        <meshBasicMaterial color="white" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};
