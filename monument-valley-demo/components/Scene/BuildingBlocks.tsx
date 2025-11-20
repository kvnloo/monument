import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PALETTE, UNIT } from '../../constants';

interface BlockProps {
  position: [number, number, number];
  color?: string;
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

/**
 * BaseBlock
 * The atomic unit of the world.
 */
export const BaseBlock: React.FC<BlockProps> = ({ 
  position, 
  color = PALETTE.brick, 
  rotation = [0, 0, 0],
  scale = [1, 1, 1]
}) => {
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
        color={color} 
        roughness={0.1} 
        flatShading={true}
      />
    </mesh>
  );
};

/**
 * WalledBlock
 * A walkway with walls on the sides.
 * walls: [side1, side2] (Longitudinal walls)
 * endWalls: [start, end] (Perpendicular caps)
 */
export const WalledBlock: React.FC<BlockProps & { axis?: 'x' | 'z', walls?: [boolean, boolean], endWalls?: [boolean, boolean] }> = ({ 
    position, 
    color = PALETTE.brick, 
    axis = 'x',
    walls = [true, true],
    endWalls = [false, false]
}) => {
    const isX = axis === 'x';
    const wallThickness = 0.15;
    const wallHeight = 0.25; // Height above floor

    /**
     * Helper to calculate EndWall dimensions and position to avoid Z-fighting with SideWalls.
     * If a side wall exists, the end wall must be shortened to butt against it, rather than overlap.
     */
    const getEndWallMetrics = (isStart: boolean) => {
        // Start wall interacts with the 'start' of the side walls? 
        // Actually, side walls run the full length of the block (from -0.5 to 0.5).
        // So both Start and End caps interact with the same Side walls.
        
        // Determine length of the end cap based on presence of side walls
        let length = 1;
        let offset = 0;

        if (walls[0] && walls[1]) {
            // Both sides present: Shorten from both ends
            length = 1 - (2 * wallThickness);
            offset = 0;
        } else if (walls[0]) {
            // Side 0 present: Shorten from Side 0
            length = 1 - wallThickness;
            // If isX: Side 0 is Z+. We shift towards Z- (negative offset)
            // If isZ: Side 0 is X+. We shift towards X- (negative offset)
            offset = -wallThickness / 2; 
        } else if (walls[1]) {
            // Side 1 present: Shorten from Side 1
            length = 1 - wallThickness;
            // If isX: Side 1 is Z-. We shift towards Z+ (positive offset)
            // If isZ: Side 1 is X-. We shift towards X+ (positive offset)
            offset = wallThickness / 2;
        }

        // Position relative to the block center
        // isStart determines if it's at the -0.5 or +0.5 end of the primary axis
        const mainAxisOffset = isStart ? -0.5 + wallThickness/2 : 0.5 - wallThickness/2;
        
        if (isX) {
            // Primary axis X. End wall sits at X- or X+.
            // End wall runs along Z.
            return {
                args: [wallThickness, wallHeight, length] as [number, number, number],
                position: [mainAxisOffset, 0.3, offset] as [number, number, number]
            };
        } else {
            // Primary axis Z. End wall sits at Z- or Z+.
            // End wall runs along X.
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
            {/* Floor - slightly recessed to imply walls */}
            <mesh castShadow receiveShadow position={[0, -0.1, 0]}>
                <boxGeometry args={[1, 0.8, 1]} />
                <meshStandardMaterial color={color} flatShading />
            </mesh>

            {/* Longitudinal Side Walls (Full Length) */}
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

            {/* End Cap Walls (Perpendicular) - Dynamically Sized */}
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
 * A container block with moving water inside.
 * walls prop: [side1, side2] boolean flags.
 * endWalls prop: [start, end] boolean flags for caps.
 */
export const WaterBlock: React.FC<BlockProps & { axis?: 'x' | 'z', walls?: [boolean, boolean], endWalls?: [boolean, boolean] }> = ({ 
  position, 
  color = PALETTE.brickDark,
  axis = 'x',
  walls = [true, true],
  endWalls = [false, false]
}) => {
    const waterRef = useRef<THREE.Mesh>(null);
    const isX = axis === 'x';

    // Dimensions
    const wallThickness = 0.15;
    const floorHeight = 0.2;
    // Water Setup
    const waterBaseHeight = 0.15; // Center Y of water
    const waterHeight = 0.7;      // Height of water volume
    
    // Animate the water level slightly to make it feel "active"
    useFrame((state) => {
        if (waterRef.current) {
            // Oscillate around the high water mark (approx 0.15 base + sine wave)
            waterRef.current.position.y = waterBaseHeight + Math.sin(state.clock.elapsedTime * 3 + position[0] * 0.5 + position[2] * 0.5) * 0.02;
        }
    });

    /**
     * Helper to calculate EndWall dimensions and position to avoid Z-fighting with SideWalls.
     * Identical logic to WalledBlock, but adapted for WaterBlock heights.
     */
    const getEndWallMetrics = (isStart: boolean) => {
        let length = 1;
        let offset = 0;

        if (walls[0] && walls[1]) {
            length = 1 - (2 * wallThickness);
            offset = 0;
        } else if (walls[0]) {
            // Side 0 present
            length = 1 - wallThickness;
            // isX: Side 0 is Z+ -> offset neg
            // isZ: Side 0 is X+ -> offset neg
            offset = -wallThickness / 2; 
        } else if (walls[1]) {
            // Side 1 present
            length = 1 - wallThickness;
            // isX: Side 1 is Z- -> offset pos
            // isZ: Side 1 is X- -> offset pos
            offset = wallThickness / 2;
        }

        // Position relative to the block center (longitudinal axis)
        const mainAxisOffset = isStart ? -0.5 + wallThickness/2 : 0.5 - wallThickness/2;
        
        if (isX) {
            // Primary axis X. End wall runs along Z.
            // args: [thickness, height, length]
            return {
                args: [wallThickness, 1, length] as [number, number, number],
                position: [mainAxisOffset, 0, offset] as [number, number, number]
            };
        } else {
            // Primary axis Z. End wall runs along X.
            // args: [length, height, thickness]
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
            {/* 1. The Container Floor */}
            <mesh castShadow receiveShadow position={[0, -0.5 + floorHeight/2, 0]}>
                <boxGeometry args={[1, floorHeight, 1]} />
                <meshStandardMaterial color={color} flatShading />
            </mesh>

            {/* 2. Side Walls (Longitudinal) */}
            {isX ? (
                <>
                    {/* Side 1: Z+ */}
                    {walls[0] && (
                        <mesh castShadow receiveShadow position={[0, 0, 0.5 - wallThickness/2]}>
                            <boxGeometry args={[1, 1, wallThickness]} />
                            <meshStandardMaterial color={color} flatShading />
                        </mesh>
                    )}
                    {/* Side 2: Z- */}
                    {walls[1] && (
                        <mesh castShadow receiveShadow position={[0, 0, -0.5 + wallThickness/2]}>
                            <boxGeometry args={[1, 1, wallThickness]} />
                            <meshStandardMaterial color={color} flatShading />
                        </mesh>
                    )}
                </>
            ) : (
                <>
                    {/* Side 1: X+ */}
                    {walls[0] && (
                        <mesh castShadow receiveShadow position={[0.5 - wallThickness/2, 0, 0]}>
                            <boxGeometry args={[wallThickness, 1, 1]} />
                            <meshStandardMaterial color={color} flatShading />
                        </mesh>
                    )}
                    {/* Side 2: X- */}
                    {walls[1] && (
                        <mesh castShadow receiveShadow position={[-0.5 + wallThickness/2, 0, 0]}>
                            <boxGeometry args={[wallThickness, 1, 1]} />
                            <meshStandardMaterial color={color} flatShading />
                        </mesh>
                    )}
                </>
            )}

            {/* 3. End Cap Walls (Perpendicular) - Dynamically Sized */}
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

            {/* 4. The Active Water Surface */}
            <mesh ref={waterRef} position={[0, waterBaseHeight, 0]}>
                {/* Reduced width from 0.7 to 0.68 to prevent Z-fighting with walls */}
                <boxGeometry args={[isX ? 1 : 0.68, waterHeight, isX ? 0.68 : 1]} />
                <meshStandardMaterial 
                    color={PALETTE.water} 
                    roughness={0.0}
                    metalness={0.2}
                    emissive={PALETTE.water}
                    emissiveIntensity={0.4}
                    transparent
                    opacity={0.9}
                />
            </mesh>
        </group>
    );
};

/**
 * WaterfallBlock
 * A vertical sheet of water.
 */
export const WaterfallBlock: React.FC<BlockProps & { height?: number }> = ({ 
    position, 
    height = 6, 
    color = PALETTE.waterfall 
}) => {
    return (
        <group position={position}>
            {/* The main water column */}
            {/* Positioned so the 'position' prop is the top center of the waterfall */}
            <mesh position={[0, -height/2, 0]}>
                <boxGeometry args={[0.7, height, 0.7]} />
                <meshStandardMaterial 
                    color={color} 
                    emissive={color} 
                    emissiveIntensity={0.6} 
                    transparent 
                    opacity={0.85} 
                />
            </mesh>
            
            {/* Splash ring at the bottom */}
            <mesh position={[0, -height + 0.1, 0]} rotation={[-Math.PI/2, 0, 0]}>
                <ringGeometry args={[0.4, 0.7, 16]} />
                <meshBasicMaterial color="white" transparent opacity={0.4} side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
};

/**
 * PillarBlock
 * Long vertical support.
 */
export const PillarBlock: React.FC<BlockProps & { height?: number }> = ({ 
  position, 
  color = PALETTE.shadow,
  height = 6 
}) => {
    return (
        <mesh castShadow receiveShadow position={position}>
            <boxGeometry args={[0.8, height, 0.8]} />
            <meshStandardMaterial color={color} flatShading />
        </mesh>
    );
};

/**
 * TowerBlock
 * Cylindrical minaret body.
 */
export const TowerBlock: React.FC<BlockProps & { hasDoor?: boolean }> = ({ position, color = PALETTE.brick, scale=[1,1,1], hasDoor = false }) => {
    return (
        <group position={position} scale={scale}>
            <mesh castShadow receiveShadow>
                <cylinderGeometry args={[0.4, 0.4, UNIT, 16]} />
                <meshStandardMaterial color={color} flatShading />
            </mesh>
            {hasDoor && (
                <mesh position={[0, -0.1, 0.35]} rotation={[0, 0, 0]}>
                    <planeGeometry args={[0.3, 0.5]} />
                    <meshBasicMaterial color={PALETTE.door} />
                </mesh>
            )}
        </group>
    );
};

/**
 * DomeCap
 * The minaret roof.
 */
export const DomeCap: React.FC<BlockProps> = ({ position, color = PALETTE.brickDark }) => {
    return (
      <group position={position}>
        <mesh castShadow receiveShadow position={[0, 0.2, 0]}>
           <sphereGeometry args={[0.45, 16, 16, 0, Math.PI * 2, 0, Math.PI/2]} />
           <meshStandardMaterial color={color} flatShading />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.7, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#F0F0F0" flatShading />
        </mesh>
      </group>
    );
};

/**
 * ArchBlock
 * A decorative doorway structure.
 */
export const ArchBlock: React.FC<BlockProps> = ({ position, color = PALETTE.brick, rotation=[0,0,0] }) => {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow receiveShadow position={[0, 0.35, 0]}>
         <boxGeometry args={[UNIT, 0.3, UNIT]} />
         <meshStandardMaterial color={color} roughness={0.1} flatShading />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.35, -0.15, 0]}>
         <boxGeometry args={[0.3, 0.7, UNIT]} />
         <meshStandardMaterial color={color} roughness={0.1} flatShading />
      </mesh>
      <mesh castShadow receiveShadow position={[0.35, -0.15, 0]}>
         <boxGeometry args={[0.3, 0.7, UNIT]} />
         <meshStandardMaterial color={color} roughness={0.1} flatShading />
      </mesh>
      <mesh position={[0, -0.15, 0.4]}>
          <planeGeometry args={[0.38, 0.7]} />
          <meshBasicMaterial color={PALETTE.door} />
      </mesh>
    </group>
  );
};

/**
 * Character (Princess Ida / Totem)
 */
export const Character: React.FC<{ position: [number, number, number], color?: string, type?: 'ida' | 'totem' }> = ({ 
    position, 
    color = PALETTE.character,
    type = 'ida'
}) => {
    return (
        <group position={position}>
            {type === 'ida' ? (
                <>
                    <mesh castShadow position={[0, 0.2, 0]}>
                        <cylinderGeometry args={[0.1, 0.25, 0.6, 16]} />
                        <meshStandardMaterial color={color} roughness={0.5} />
                    </mesh>
                    <mesh castShadow position={[0, 0.6, 0]}>
                        <sphereGeometry args={[0.12, 16, 16]} />
                        <meshStandardMaterial color={color} roughness={0.5} />
                    </mesh>
                </>
            ) : (
                <group position={[0, 0.5, 0]}>
                    <mesh castShadow position={[0, -0.2, 0]}>
                         <boxGeometry args={[0.5, 0.5, 0.5]} />
                         <meshStandardMaterial color={color} roughness={0.5} />
                    </mesh>
                    <mesh castShadow position={[0, 0.3, 0]}>
                         <boxGeometry args={[0.5, 0.5, 0.5]} />
                         <meshStandardMaterial color={color} roughness={0.5} />
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