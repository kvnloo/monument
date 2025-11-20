import React, { useState } from 'react';
import * as THREE from 'three';
import { BaseBlock, TowerBlock, DomeCap, Character, WaterBlock, WaterfallBlock, WalledBlock, ArchBlock } from './BuildingBlocks';
import { FloatingParticles } from './FloatingParticles';
import { MovableWrapper } from './MovableWrapper';
import { useTheme } from '../../contexts';
import { AlignmentVisualizer } from '../Dev';

export const LevelOne: React.FC = () => {
  const { theme } = useTheme();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [objectPositions, setObjectPositions] = useState<Map<string, THREE.Vector3>>(new Map());

  const handleSelect = (id: string, isMulti: boolean) => {
      setSelectedIds(prev => {
          const next = new Set(isMulti ? prev : []);
          if (next.has(id)) {
              if (isMulti) next.delete(id);
              else next.add(id);
          } else {
              next.add(id);
          }
          return next;
      });
  };

  const handlePositionChange = (id: string, position: THREE.Vector3) => {
    setObjectPositions(prev => new Map(prev).set(id, position));
  };
  
  const Path = ({ 
      start, 
      length, 
      axis, 
      color, 
      type = 'brick',
      customBlocks = {},
      flowDirection = [0, 0]
  }: { 
      start: [number, number, number], 
      length: number, 
      axis: 'x' | 'y' | 'z' | 'negZ', 
      color: string,
      type?: 'brick' | 'water' | 'walled',
      customBlocks?: { [key: number]: { walls?: [boolean, boolean], endWalls?: [boolean, boolean] } },
      flowDirection?: [number, number]
  }) => {
      const blocks = [];
      for(let i=0; i<length; i++) {
          const pos: [number, number, number] = [...start];
          if(axis === 'x') pos[0] += i;
          if(axis === 'y') pos[1] += i;
          if(axis === 'z') pos[2] += i;
          if(axis === 'negZ') pos[2] -= i;
          
          const overrides = customBlocks[i] || {};
          const walls = overrides.walls;
          const endWalls = overrides.endWalls;

          if (type === 'water') {
              const waterAxis = (axis === 'x') ? 'x' : 'z';
              blocks.push(
                <WaterBlock 
                    key={`${axis}-${i}`} 
                    position={pos} 
                    color={color} 
                    axis={waterAxis} 
                    walls={walls} 
                    endWalls={endWalls}
                    flowDirection={flowDirection}
                />
              );
          } else if (type === 'walled') {
              const wallAxis = (axis === 'x') ? 'x' : 'z';
              blocks.push(
                  <WalledBlock
                    key={`${axis}-${i}`}
                    position={pos}
                    color={color}
                    axis={wallAxis}
                    walls={walls}
                    endWalls={endWalls}
                  />
              );
          } else {
              blocks.push(<BaseBlock key={`${axis}-${i}`} position={pos} color={color} />);
          }
      }
      return <group>{blocks}</group>;
  };

  const ORIGIN: [number, number, number] = [0, -4, 0];
  const SIZE = 8; 

  const getUiIndex = (id: string) => {
      const arr = Array.from(selectedIds);
      return arr.indexOf(id);
  };

  return (
    <group position={[0, 0, 0]} onClick={() => setSelectedIds(new Set())}>
      {/* Development alignment visualizer */}
      <AlignmentVisualizer selectedIds={selectedIds} objectPositions={objectPositions} />

      {/* Floating particles for atmospheric depth effect */}
      <FloatingParticles
        count={15}
        spread={[30, 20, 30]}
        opacity={0.4}
        speed={0.5}
      />

      <MovableWrapper
        id="Main-Pillar"
        initialPos={ORIGIN}
        isSelected={selectedIds.has('Main-Pillar')}
        onSelect={handleSelect}
        uiOffsetIndex={getUiIndex('Main-Pillar')}
        onPositionChange={handlePositionChange}
      >
        <group>
            {/* Stack of blocks going up. */}
            <Path 
                start={[0,0,0]} 
                length={SIZE-1} // 0 to 6
                axis="y" 
                color={theme.palette.brickDark} 
            />
            {/* Doorway moved to index 3 to match visual alignment request. Rotated to face Right (X-axis) */}
            <ArchBlock 
                position={[0, 3, 0]} 
                color={theme.palette.brickDark} 
                rotation={[0, Math.PI/2, 0]} 
            />
        </group>
      </MovableWrapper>
      
      <MovableWrapper
        id="Tower-Top"
        initialPos={[ORIGIN[0], ORIGIN[1] + SIZE, ORIGIN[2]]}
        isSelected={selectedIds.has('Tower-Top')}
        onSelect={handleSelect}
        uiOffsetIndex={getUiIndex('Tower-Top')}
        onPositionChange={handlePositionChange}
      >
          <group>
            <BaseBlock position={[0, 0, 0]} color={theme.palette.brick} />
            {/* Tower door also rotated to face Right (X-axis) */}
            <TowerBlock 
                position={[0, 1, 0]} 
                color={theme.palette.brick} 
                hasDoor={true} 
                rotation={[0, Math.PI/2, 0]} 
            />
            <DomeCap position={[0, 2.5, 0]} color={theme.palette.brick} />
          </group>
      </MovableWrapper>

      <MovableWrapper
        id="Top-Beam"
        initialPos={[ORIGIN[0] + 1, ORIGIN[1] + SIZE - 1, ORIGIN[2]]}
        isSelected={selectedIds.has('Top-Beam')}
        onSelect={handleSelect}
        uiOffsetIndex={getUiIndex('Top-Beam')}
        onPositionChange={handlePositionChange}
      >
        <Path 
            start={[0,0,0]} 
            length={SIZE - 1}
            axis="x" 
            color={theme.palette.brick} 
            type="walled"
        />
      </MovableWrapper>
      
      <MovableWrapper
        id="Corner-Block"
        initialPos={[ORIGIN[0] + SIZE, ORIGIN[1] + SIZE - 1, ORIGIN[2]]}
        isSelected={selectedIds.has('Corner-Block')}
        onSelect={handleSelect}
        uiOffsetIndex={getUiIndex('Corner-Block')}
        onPositionChange={handlePositionChange}
      >
         <WalledBlock 
            position={[0, 0, 0]} 
            color={theme.palette.brick} 
            axis="x"
            walls={[false, true]} 
            endWalls={[false, true]}
         />
      </MovableWrapper>

      <MovableWrapper
        id="Return-Beam"
        initialPos={[ORIGIN[0] + SIZE, ORIGIN[1] + SIZE - 1, ORIGIN[2] + 1]}
        isSelected={selectedIds.has('Return-Beam')}
        onSelect={handleSelect}
        uiOffsetIndex={getUiIndex('Return-Beam')}
        onPositionChange={handlePositionChange}
      >
        <Path 
            start={[0,0,0]} 
            length={SIZE - 1}
            axis="z" 
            color={theme.palette.brickDark} 
            type="walled"
        />
      </MovableWrapper>

      {/* Beam A: The Long Diagonal (Neg Z) -> Flows to Positive Z (Away from waterfall?) */}
      {/* Previous was [0, -1]. Reversed to [0, 1]. */}
      <MovableWrapper
        id="Beam-A"
        initialPos={[2.40, 0.00, -1.00]}
        isSelected={selectedIds.has('Beam-A')}
        onSelect={handleSelect}
        uiOffsetIndex={getUiIndex('Beam-A')}
        onPositionChange={handlePositionChange}
      >
          <Path
            start={[0, 0, 0]}
            length={12}
            axis="negZ"
            color={theme.palette.brick} 
            type="water"
            flowDirection={[0, 1]} 
            customBlocks={{
              0: { endWalls: [false, false] }, 
              11: { walls: [false, true], endWalls: [true, false] } 
            }}
          />
      </MovableWrapper>

      <MovableWrapper
        id="Water-Spout"
        initialPos={[11.52, 8.23, -3.78]}
        isSelected={selectedIds.has('Water-Spout')}
        onSelect={handleSelect}
        uiOffsetIndex={getUiIndex('Water-Spout')}
        onPositionChange={handlePositionChange}
      >
        <WaterBlock
          position={[0, 0, 0]}
          color={theme.palette.brick}
          axis="x"
          walls={[false, false]}
          endWalls={[false, false]}
          flowDirection={[1, 0]}
        />
      </MovableWrapper>

      <MovableWrapper
        id="Waterfall"
        initialPos={[20.64, 17.88, 5.44]}
        isSelected={selectedIds.has('Waterfall')}
        onSelect={handleSelect}
        uiOffsetIndex={getUiIndex('Waterfall')}
        onPositionChange={handlePositionChange}
      >
        <WaterfallBlock height={14} />
      </MovableWrapper>

      {/* Beam B: The Short Corner (X Axis) -> Flows to Positive X */}
      <MovableWrapper
        id="Beam-B"
        initialPos={[7.90, 5.50, 5.44]}
        isSelected={selectedIds.has('Beam-B')}
        onSelect={handleSelect}
        uiOffsetIndex={getUiIndex('Beam-B')}
        onPositionChange={handlePositionChange}
      >
          <Path
            start={[0, 0, 0]}
            length={16}
            axis="x"
            color={theme.palette.brickDark}
            type="water"
            flowDirection={[1, 0]} 
            customBlocks={{
                0: { walls: [true, false], endWalls: [true, false] }, 
                15: { endWalls: [false, true] }
            }}
          />
      </MovableWrapper>
      
      <MovableWrapper
        id="End-Platform"
        initialPos={[ORIGIN[0] + SIZE, ORIGIN[1] + SIZE - 1, ORIGIN[2] + SIZE]}
        isSelected={selectedIds.has('End-Platform')}
        onSelect={handleSelect}
        uiOffsetIndex={getUiIndex('End-Platform')}
        onPositionChange={handlePositionChange}
      >
         <group>
            <WalledBlock 
                position={[0, 0, 0]} 
                color={theme.palette.brickDark} 
                axis="z"
                walls={[true, true]}
                endWalls={[false, true]}
            />
            <Character position={[0, 1, 0]} color={theme.palette.accent} type="totem" />
         </group>
      </MovableWrapper>

      <MovableWrapper
        id="Character-Ida"
        initialPos={[ORIGIN[0] + 2, ORIGIN[1] + SIZE - 1, ORIGIN[2]]}
        isSelected={selectedIds.has('Character-Ida')}
        onSelect={handleSelect}
        uiOffsetIndex={getUiIndex('Character-Ida')}
        onPositionChange={handlePositionChange}
      >
          <Character 
              position={[0,0,0]} 
              color={theme.palette.character} 
              type="ida" 
          />
      </MovableWrapper>

    </group>
  );
};