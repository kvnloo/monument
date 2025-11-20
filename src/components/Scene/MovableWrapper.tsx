import React, { useState, useRef, useLayoutEffect } from 'react';
import { TransformControls, Html } from '@react-three/drei';
import * as THREE from 'three';

export interface MovableWrapperProps {
  id: string;
  initialPos: [number, number, number];
  isSelected: boolean;
  onSelect: (id: string, multi: boolean) => void;
  uiOffsetIndex?: number;
  children: React.ReactNode;
  onPositionChange?: (id: string, position: THREE.Vector3) => void;
}

export const MovableWrapper: React.FC<MovableWrapperProps> = ({
  id,
  initialPos,
  isSelected,
  onSelect,
  uiOffsetIndex = 0,
  children,
  onPositionChange
}) => {
  const groupRef = useRef<THREE.Group>(null!);
  const [displayPos, setDisplayPos] = useState<[number, number, number]>(initialPos);
  const [copyLabel, setCopyLabel] = useState('COPY POS');

  useLayoutEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(...initialPos);
      // Notify parent of initial position
      if (onPositionChange) {
        onPositionChange(id, groupRef.current.position.clone());
      }
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
              // Notify parent of position change
              if (onPositionChange) {
                onPositionChange(id, groupRef.current.position.clone());
              }
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
