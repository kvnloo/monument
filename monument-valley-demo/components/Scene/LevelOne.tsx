import React, { useState, useRef, useLayoutEffect } from 'react';
import { TransformControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { BaseBlock, TowerBlock, DomeCap, Character, WaterBlock, WaterfallBlock, WalledBlock, ArchBlock } from './BuildingBlocks';
import { PALETTE } from '../../constants';

interface MovableWrapperProps {
  id: string;
  initialPos: [number, number, number];
  isSelected: boolean;
  onSelect: (id: string, multi: boolean) => void;
  uiOffsetIndex?: number;
  children: React.ReactNode;
}

const MovableWrapper: React.FC<MovableWrapperProps> = ({ 
  id, 
  initialPos, 
  isSelected, 
  onSelect,
  uiOffsetIndex = 0,
  children 
}) => {
  const groupRef = useRef<THREE.Group>(null!);
  const [displayPos, setDisplayPos] = useState<[number, number, number]>(initialPos);
  const [copyLabel, setCopyLabel] = useState('COPY POS');

  useLayoutEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(...initialPos);
    }
  }, []); 

  const fmt = (n: number) => n.toFixed(2);
  const uiTop = `${40 + (uiOffsetIndex * 25)}%`;

  const handleCopy = (e: React.MouseEvent) => {
      e.stopPropagation();
      const text = `${id}: [${fmt(displayPos[0])}, ${fmt(displayPos[1])}, ${fmt(displayPos[2])}]`;
      navigator.clipboard.writeText(text);
      setCopyLabel('COPIED!');
      setTimeout(() => setCopyLabel('COPY POS'), 1000);
  };

  return (
    <>
      {isSelected && (
        <TransformControls
          object={groupRef}
          mode="translate"
          onObjectChange={() => {
            if (groupRef.current) {
              const { x, y, z } = groupRef.current.position;
              setDisplayPos([x, y, z]);
            }
          }}
        />
      )}

      {isSelected && (
          <Html fullscreen style={{ pointerEvents: 'none' }}>
            <div 
              style={{ 
                  pointerEvents: 'auto',
                  position: 'absolute',
                  right: '2%',
                  top: uiTop,
                  transform: 'translateY(-50%)',
              }}
              className="bg-black/90 text-white p-4 rounded-lg border border-mv-primary shadow-2xl font-mono text-xs min-w-[200px] backdrop-blur-md"
            >
              <div className="flex justify-between items-center border-b border-white/20 pb-2 mb-2">
                <span className="text-mv-primary font-bold truncate mr-2">{id}</span>
                <button 
                    className="text-xs text-gray-500 hover:text-white"
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect(id, true); 
                    }}
                >✕</button>
              </div>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-sm">
                <span className="text-gray-400">X:</span>
                <span className="text-right font-bold text-white">{fmt(displayPos[0])}</span>
                <span className="text-gray-400">Y:</span>
                <span className="text-right font-bold text-white">{fmt(displayPos[1])}</span>
                <span className="text-gray-400">Z:</span>
                <span className="text-right font-bold text-white">{fmt(displayPos[2])}</span>
              </div>

              <button 
                  onClick={handleCopy}
                  className="w-full bg-white/10 hover:bg-white/20 text-mv-primary py-2 rounded transition-colors text-xs font-bold uppercase tracking-wider border border-white/5"
              >
                  {copyLabel}
              </button>
            </div>
          </Html>
      )}

      <group 
        ref={groupRef}
        onClick={(e) => { 
          e.stopPropagation(); 
          onSelect(id, e.shiftKey);
          
          if(groupRef.current) {
              const { x, y, z } = groupRef.current.position;
              setDisplayPos([x, y, z]);
          }
        }}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; }}
      >
        {children}

        {!isSelected && (
            <Html position={[0, 0, 0]} center distanceFactor={10} zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
                <div className="opacity-0 hover:opacity-100 bg-black/50 text-white text-[10px] px-2 py-1 rounded transition-opacity whitespace-nowrap backdrop-blur-sm border border-white/10 pointer-events-none">
                {id}
                </div>
            </Html>
        )}
      </group>
    </>
  );
};

export const LevelOne: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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

      <MovableWrapper
        id="Main-Pillar"
        initialPos={ORIGIN}
        isSelected={selectedIds.has('Main-Pillar')}
        onSelect={handleSelect}
        uiOffsetIndex={getUiIndex('Main-Pillar')}
      >
        <group>
            {/* Stack of blocks going up. */}
            <Path 
                start={[0,0,0]} 
                length={SIZE-1} // 0 to 6
                axis="y" 
                color={PALETTE.brickDark} 
            />
            {/* Doorway moved to index 3 to match visual alignment request. Rotated to face Right (X-axis) */}
            <ArchBlock 
                position={[0, 3, 0]} 
                color={PALETTE.brickDark} 
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
      >
          <group>
            <BaseBlock position={[0, 0, 0]} color={PALETTE.brick} />
            {/* Tower door also rotated to face Right (X-axis) */}
            <TowerBlock 
                position={[0, 1, 0]} 
                color={PALETTE.brick} 
                hasDoor={true} 
                rotation={[0, Math.PI/2, 0]} 
            />
            <DomeCap position={[0, 2.5, 0]} color={PALETTE.brick} />
          </group>
      </MovableWrapper>

      <MovableWrapper
        id="Top-Beam"
        initialPos={[ORIGIN[0] + 1, ORIGIN[1] + SIZE - 1, ORIGIN[2]]}
        isSelected={selectedIds.has('Top-Beam')}
        onSelect={handleSelect}
        uiOffsetIndex={getUiIndex('Top-Beam')}
      >
        <Path 
            start={[0,0,0]} 
            length={SIZE - 1}
            axis="x" 
            color={PALETTE.brick} 
            type="walled"
        />
      </MovableWrapper>
      
      <MovableWrapper
        id="Corner-Block"
        initialPos={[ORIGIN[0] + SIZE, ORIGIN[1] + SIZE - 1, ORIGIN[2]]}
        isSelected={selectedIds.has('Corner-Block')}
        onSelect={handleSelect}
        uiOffsetIndex={getUiIndex('Corner-Block')}
      >
         <WalledBlock 
            position={[0, 0, 0]} 
            color={PALETTE.brick} 
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
      >
        <Path 
            start={[0,0,0]} 
            length={SIZE - 1}
            axis="z" 
            color={PALETTE.brickDark} 
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
      >
          <Path
            start={[0, 0, 0]}
            length={12}
            axis="negZ"
            color={PALETTE.brick} 
            type="water"
            flowDirection={[0, 1]} 
            customBlocks={{
              0: { endWalls: [false, false] }, 
              11: { walls: [false, true], endWalls: [true, false] } 
            }}
          />
      </MovableWrapper>

      <MovableWrapper
        id="Waterfall"
        initialPos={[20.64, 18.06, 5.44]}
        isSelected={selectedIds.has('Waterfall')}
        onSelect={handleSelect}
        uiOffsetIndex={getUiIndex('Waterfall')}
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
      >
          <Path
            start={[0, 0, 0]}
            length={16}
            axis="x"
            color={PALETTE.brickDark}
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
      >
         <group>
            <WalledBlock 
                position={[0, 0, 0]} 
                color={PALETTE.brickDark} 
                axis="z"
                walls={[true, true]}
                endWalls={[false, true]}
            />
            <Character position={[0, 1, 0]} color={PALETTE.accent} type="totem" />
         </group>
      </MovableWrapper>

      <MovableWrapper
        id="Character-Ida"
        initialPos={[ORIGIN[0] + 2, ORIGIN[1] + SIZE - 1, ORIGIN[2]]}
        isSelected={selectedIds.has('Character-Ida')}
        onSelect={handleSelect}
        uiOffsetIndex={getUiIndex('Character-Ida')}
      >
          <Character 
              position={[0,0,0]} 
              color={PALETTE.character} 
              type="ida" 
          />
      </MovableWrapper>

    </group>
  );
};