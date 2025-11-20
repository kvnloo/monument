import React, { useState, useRef, useLayoutEffect } from 'react';
import { TransformControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { BaseBlock, TowerBlock, DomeCap, Character, WaterBlock, WaterfallBlock, WalledBlock, ArchBlock } from './BuildingBlocks';
import { PALETTE } from '../../constants';

/**
 * MovableWrapper
 * Supports independent selection and movement.
 */
interface MovableWrapperProps {
  id: string;
  initialPos: [number, number, number];
  isSelected: boolean;
  onSelect: (id: string, multi: boolean) => void;
  uiOffsetIndex?: number; // To stack UI panels if multiple are selected
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

  // Initialize position once on mount. 
  useLayoutEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(...initialPos);
    }
  }, []); 

  // Format for display
  const fmt = (n: number) => n.toFixed(2);

  // Calculate UI Top position based on index to prevent overlap
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

      {/* Coordinate Popup - Pinned to Screen */}
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
                        onSelect(id, true); // effectively toggle off if already selected
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
          // Pass shift key status to handler
          onSelect(id, e.shiftKey);
          
          // Sync display pos on select
          if(groupRef.current) {
              const { x, y, z } = groupRef.current.position;
              setDisplayPos([x, y, z]);
          }
        }}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; }}
      >
        {children}

        {/* Hint Label */}
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

/**
 * Level One: "The Triad"
 */
export const LevelOne: React.FC = () => {
  // Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSelect = (id: string, isMulti: boolean) => {
      setSelectedIds(prev => {
          const next = new Set(isMulti ? prev : []);
          if (next.has(id)) {
              // If multi-select, toggle off. If single select, clicking again keeps it selected.
              if (isMulti) next.delete(id);
              else next.add(id); 
          } else {
              next.add(id);
          }
          return next;
      });
  };
  
  // Helper to create linear paths
  const Path = ({ 
      start, 
      length, 
      axis, 
      color, 
      type = 'brick',
      customBlocks = {}
  }: { 
      start: [number, number, number], 
      length: number, 
      axis: 'x' | 'y' | 'z' | 'negZ', 
      color: string,
      type?: 'brick' | 'water' | 'walled',
      customBlocks?: { [key: number]: { walls?: [boolean, boolean], endWalls?: [boolean, boolean] } }
  }) => {
      const blocks = [];
      for(let i=0; i<length; i++) {
          const pos: [number, number, number] = [...start];
          if(axis === 'x') pos[0] += i;
          if(axis === 'y') pos[1] += i;
          if(axis === 'z') pos[2] += i;
          if(axis === 'negZ') pos[2] -= i;
          
          // Check for override configs
          const overrides = customBlocks[i] || {};
          const walls = overrides.walls; // undefined means default [true, true]
          const endWalls = overrides.endWalls;

          if (type === 'water') {
              // Determine orientation for water channel walls
              const waterAxis = (axis === 'x') ? 'x' : 'z';
              blocks.push(
                <WaterBlock 
                    key={`${axis}-${i}`} 
                    position={pos} 
                    color={color} 
                    axis={waterAxis} 
                    walls={walls} 
                    endWalls={endWalls}
                />
              );
          } else if (type === 'walled') {
              // Determine orientation for walkways
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

  // Config
  const ORIGIN: [number, number, number] = [0, -4, 0];
  const SIZE = 8; 

  // Helper to calculate UI index for stacking
  const getUiIndex = (id: string) => {
      const arr = Array.from(selectedIds);
      return arr.indexOf(id);
  };

  return (
    <group position={[0, 0, 0]} onClick={() => setSelectedIds(new Set()) /* Deselect all on BG click */}> 

      {/* --- 1. BLUE LINE: VERTICAL PILLAR (Y-Axis) --- */}
      <MovableWrapper
        id="Main-Pillar"
        initialPos={ORIGIN}
        isSelected={selectedIds.has('Main-Pillar')}
        onSelect={handleSelect}
        uiOffsetIndex={getUiIndex('Main-Pillar')}
      >
        {/* Manually constructed pillar to allow ArchBlock at base */}
        <group>
            {/* Bottom Doorway Block */}
            <ArchBlock position={[0,0,0]} color={PALETTE.brickDark} rotation={[0, 0, 0]} />
            {/* Rest of the stack */}
            <Path 
                start={[0,1,0]} 
                length={SIZE-1} 
                axis="y" 
                color={PALETTE.brickDark} 
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
            {/* Added hasDoor prop for the top doorway */}
            <TowerBlock position={[0, 1, 0]} color={PALETTE.brick} hasDoor={true} />
            <DomeCap position={[0, 2.5, 0]} color={PALETTE.brick} />
          </group>
      </MovableWrapper>

      {/* --- 2. RED LINE (TOP): HORIZONTAL BEAM (X-Axis) --- */}
      <MovableWrapper
        id="Top-Beam"
        initialPos={[ORIGIN[0] + 1, ORIGIN[1] + SIZE - 1, ORIGIN[2]]}
        isSelected={selectedIds.has('Top-Beam')}
        onSelect={handleSelect}
        uiOffsetIndex={getUiIndex('Top-Beam')}
      >
        <Path 
            start={[0,0,0]} 
            length={SIZE - 1} // Reduced length to prevent overlap with Corner-Block
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
         {/* Changed to WalledBlock to handle corner walls and match height */}
         <WalledBlock 
            position={[0, 0, 0]} 
            color={PALETTE.brick} 
            axis="x"
            walls={[false, true]} // Open Z+ (turn), Keep Z- (outer wall)
            endWalls={[false, true]} // Open X- (connect), Keep X+ (outer wall)
         />
      </MovableWrapper>

      {/* --- 3. RED LINE (RETURN): DEPTH BEAM (Z-Axis) --- */}
      <MovableWrapper
        id="Return-Beam"
        initialPos={[ORIGIN[0] + SIZE, ORIGIN[1] + SIZE - 1, ORIGIN[2] + 1]}
        isSelected={selectedIds.has('Return-Beam')}
        onSelect={handleSelect}
        uiOffsetIndex={getUiIndex('Return-Beam')}
      >
        <Path 
            start={[0,0,0]} 
            length={SIZE - 1} // Reduced length to prevent overlap with End-Platform
            axis="z" 
            color={PALETTE.brickDark} 
            type="walled"
        />
      </MovableWrapper>

      {/* --- 4. THE GREEN VOID STRUCTURE (MOVABLE & SPLIT) --- */}
      
      {/* Beam A: The Long Diagonal (Neg Z) -> NOW WATER */}
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
            customBlocks={{
              // Index 0 (Z=-1): Was previously capped. Now OPENING it per user request.
              0: { endWalls: [false, false] }, 
              // Index 11 (Z=-12): Remove Side 1 (X+) wall, AND ADD END CAP to Z- side (endWalls[0])
              11: { walls: [false, true], endWalls: [true, false] } 
            }}
          />
      </MovableWrapper>

      {/* Waterfall Object */}
      <MovableWrapper
        id="Waterfall"
        initialPos={[20.64, 18.06, 5.44]}
        isSelected={selectedIds.has('Waterfall')}
        onSelect={handleSelect}
        uiOffsetIndex={getUiIndex('Waterfall')}
      >
        <WaterfallBlock height={14} />
      </MovableWrapper>

      {/* Beam B: The Short Corner (X Axis) -> NOW WATER */}
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
            customBlocks={{
                // Beam-B Index 0: 
                // Walls: [true, false] -> Close Z+, Open Z- (Entry from Beam-A)
                // EndWalls: [true, false] -> Close X- (Start Cap), Open X+ (Flow)
                0: { walls: [true, false], endWalls: [true, false] }, 
                15: { endWalls: [false, true] } // Cap the end of the water channel
            }}
          />
      </MovableWrapper>
      
      {/* Visual "End" of the Z-beam */}
      <MovableWrapper
        id="End-Platform"
        initialPos={[ORIGIN[0] + SIZE, ORIGIN[1] + SIZE - 1, ORIGIN[2] + SIZE]}
        isSelected={selectedIds.has('End-Platform')}
        onSelect={handleSelect}
        uiOffsetIndex={getUiIndex('End-Platform')}
      >
         <group>
            {/* Changed to WalledBlock to match surrounding architecture */}
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

      {/* Character IDA */}
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