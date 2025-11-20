import React, { useMemo, useRef, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { UNIT } from '../../constants';
import { useTheme } from '../../contexts';

interface BlockProps {
  position: [number, number, number];
  color?: string;
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

/**
 * Generates a procedural noise texture for water.
 * Uses an off-screen canvas to create a seamless noise pattern.
 * Includes visible flowing streaks on a subtle dark water base.
 */
const createWaterTexture = (): THREE.CanvasTexture => {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // 1. Dark water base (teal-green) for subtle, natural effect
    ctx.fillStyle = '#2a6860';
    ctx.fillRect(0, 0, size, size);

    // 2. Higher-contrast flowing streaks for visible animation
    // Create distinct lighter streaks with higher opacity
    for (let i = 0; i < 500; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      // Mix of bright and subtle streaks: 60% bright, 40% subtle
      const isBrightStreak = Math.random() < 0.6;
      const alpha = isBrightStreak
        ? Math.random() * 0.4 + 0.5    // Bright: 0.5-0.9 opacity
        : Math.random() * 0.25 + 0.15; // Subtle: 0.15-0.4 opacity
      const length = Math.random() * 80 + 30;    // 30-110 px for more visible streaks
      const thickness = Math.random() * 3 + 1.5; // 1.5-4.5 px, thicker for visibility

      // Use lighter cyan/turquoise colors for the streaks instead of pure white
      const streakColors = [
        `rgba(136, 232, 224, ${alpha})`, // #88e8e0 - Light cyan
        `rgba(109, 216, 207, ${alpha})`, // #6dd8cf - Medium cyan
        `rgba(200, 245, 240, ${alpha})`, // #c8f5f0 - Very light cyan
        `rgba(255, 255, 255, ${alpha})`  // White for highest contrast
      ];

      const color = streakColors[Math.floor(Math.random() * streakColors.length)];
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.rect(x, y, length, thickness);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
};

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

export const WalledBlock: React.FC<BlockProps & { axis?: 'x' | 'z', walls?: [boolean, boolean], endWalls?: [boolean, boolean] }> = ({
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

export const TowerBlock: React.FC<BlockProps & { hasDoor?: boolean }> = ({ position, color, scale=[1,1,1], rotation=[0,0,0], hasDoor = false }) => {
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

export const Character: React.FC<{ position: [number, number, number], color?: string, type?: 'ida' | 'totem' }> = ({
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