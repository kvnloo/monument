import React, { useState, useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface AlignmentVisualizerProps {
  selectedIds: Set<string>;
  objectPositions: Map<string, THREE.Vector3>;
}

/**
 * Development-only alignment visualization tool
 * Shows geometric vs visual midpoints for selected object pairs
 */
export const AlignmentVisualizer: React.FC<AlignmentVisualizerProps> = ({
  selectedIds,
  objectPositions,
}) => {
  const [enabled, setEnabled] = useState(false);
  const { camera, size } = useThree();

  // Development mode check - but allow manual override via localStorage
  const forceDevMode = typeof window !== 'undefined' && localStorage.getItem('alignmentVisDebug') === 'true';
  const isDevMode = import.meta.env.DEV || forceDevMode;

  if (!isDevMode) {
    return null;
  }

  // Only show when exactly 2 objects are selected
  const selectedArray = Array.from(selectedIds);
  if (selectedArray.length !== 2) {
    return (
      <Html fullscreen style={{ pointerEvents: 'none' }}>
        <div
          style={{
            pointerEvents: 'auto',
            position: 'absolute',
            left: '2%',
            top: '40%',
          }}
          className="bg-black/90 text-white p-3 rounded-lg border border-yellow-500 font-mono text-xs backdrop-blur-md"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            <span className="text-yellow-500 font-bold">DEV MODE</span>
          </div>
          <button
            onClick={() => setEnabled(!enabled)}
            className={`w-full py-2 px-3 rounded transition-colors text-xs font-bold uppercase ${
              enabled
                ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500'
                : 'bg-white/10 text-gray-400 border border-white/10'
            }`}
          >
            {enabled ? '■ Alignment: ON' : '▶ Alignment: OFF'}
          </button>
          <div className="mt-2 text-[10px] text-gray-500">
            Select 2 objects to visualize
          </div>
        </div>
      </Html>
    );
  }

  const id1 = selectedArray[0];
  const id2 = selectedArray[1];
  const pos1 = objectPositions.get(id1);
  const pos2 = objectPositions.get(id2);

  if (!enabled || !pos1 || !pos2) {
    return (
      <Html fullscreen style={{ pointerEvents: 'none' }}>
        <div
          style={{
            pointerEvents: 'auto',
            position: 'absolute',
            left: '2%',
            top: '40%',
          }}
          className="bg-black/90 text-white p-3 rounded-lg border border-yellow-500 font-mono text-xs backdrop-blur-md"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            <span className="text-yellow-500 font-bold">DEV MODE</span>
          </div>
          <button
            onClick={() => setEnabled(!enabled)}
            className={`w-full py-2 px-3 rounded transition-colors text-xs font-bold uppercase ${
              enabled
                ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500'
                : 'bg-white/10 text-gray-400 border border-white/10'
            }`}
          >
            {enabled ? '■ Alignment: ON' : '▶ Alignment: OFF'}
          </button>
          <div className="mt-2 text-[10px] text-gray-400">
            {id1} + {id2}
          </div>
        </div>
      </Html>
    );
  }

  // Calculate geometric midpoint (3D space)
  const geometricMidpoint = new THREE.Vector3()
    .addVectors(pos1, pos2)
    .multiplyScalar(0.5);

  // Project to screen space with error handling
  const toScreenSpace = (pos: THREE.Vector3) => {
    try {
      if (!camera || !size) {
        console.warn('[AlignmentVisualizer] Camera or size not available');
        return { x: 0, y: 0, z: 0 };
      }
      const projected = pos.clone().project(camera);
      return {
        x: (projected.x * 0.5 + 0.5) * size.width,
        y: (-(projected.y * 0.5) + 0.5) * size.height,
        z: projected.z,
      };
    } catch (error) {
      console.error('[AlignmentVisualizer] Projection error:', error);
      return { x: 0, y: 0, z: 0 };
    }
  };

  const screen1 = toScreenSpace(pos1);
  const screen2 = toScreenSpace(pos2);
  const screenGeometric = toScreenSpace(geometricMidpoint);

  // Calculate visual midpoint (2D screen space)
  const visualMidpoint = {
    x: (screen1.x + screen2.x) / 2,
    y: (screen1.y + screen2.y) / 2,
  };

  // Calculate 2D screen-space distance
  const screenDistance = Math.sqrt(
    Math.pow(screen2.x - screen1.x, 2) + Math.pow(screen2.y - screen1.y, 2)
  );

  // Calculate offset between geometric and visual midpoints
  const midpointOffset = Math.sqrt(
    Math.pow(visualMidpoint.x - screenGeometric.x, 2) +
    Math.pow(visualMidpoint.y - screenGeometric.y, 2)
  );

  const fmt = (n: number) => n.toFixed(2);

  // Debug logging
  useEffect(() => {
    console.log('[AlignmentVisualizer] Rendering with:',  {
      id1,
      id2,
      pos1: pos1 ? { x: fmt(pos1.x), y: fmt(pos1.y), z: fmt(pos1.z) } : null,
      pos2: pos2 ? { x: fmt(pos2.x), y: fmt(pos2.y), z: fmt(pos2.z) } : null,
      screen1: { x: fmt(screen1.x), y: fmt(screen1.y) },
      screen2: { x: fmt(screen2.x), y: fmt(screen2.y) },
      screenGeometric: { x: fmt(screenGeometric.x), y: fmt(screenGeometric.y) },
      visualMidpoint: { x: fmt(visualMidpoint.x), y: fmt(visualMidpoint.y) },
      midpointOffset: fmt(midpointOffset),
    });
  }, [id1, id2, pos1, pos2]);

  return (
    <>
      {/* Control Panel */}
      <Html fullscreen style={{ pointerEvents: 'none' }}>
        <div
          style={{
            pointerEvents: 'auto',
            position: 'absolute',
            left: '2%',
            top: '40%',
          }}
          className="bg-black/90 text-white p-4 rounded-lg border border-yellow-500 shadow-2xl font-mono text-xs min-w-[280px] backdrop-blur-md"
        >
          <div className="flex items-center justify-between border-b border-yellow-500/30 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              <span className="text-yellow-500 font-bold">ALIGNMENT DEV</span>
            </div>
            <button
              onClick={() => setEnabled(false)}
              className="text-xs text-gray-500 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Object Pair Info */}
          <div className="mb-3 p-2 bg-white/5 rounded border border-white/10">
            <div className="text-[10px] text-gray-400 mb-1">SELECTED PAIR:</div>
            <div className="text-xs text-white truncate">{id1}</div>
            <div className="text-xs text-white truncate">{id2}</div>
          </div>

          {/* Screen Space Positions */}
          <div className="mb-3">
            <div className="text-[10px] text-gray-400 mb-2">SCREEN SPACE:</div>
            <div className="grid grid-cols-3 gap-x-3 gap-y-1 text-[10px]">
              <span className="text-gray-500">Obj 1:</span>
              <span className="text-right text-cyan-400">{fmt(screen1.x)}</span>
              <span className="text-right text-cyan-400">{fmt(screen1.y)}</span>

              <span className="text-gray-500">Obj 2:</span>
              <span className="text-right text-cyan-400">{fmt(screen2.x)}</span>
              <span className="text-right text-cyan-400">{fmt(screen2.y)}</span>
            </div>
          </div>

          {/* Midpoints */}
          <div className="mb-3">
            <div className="text-[10px] text-gray-400 mb-2">MIDPOINTS:</div>
            <div className="grid grid-cols-3 gap-x-3 gap-y-1 text-[10px]">
              <span className="text-red-400">3D Mid:</span>
              <span className="text-right text-red-300">{fmt(screenGeometric.x)}</span>
              <span className="text-right text-red-300">{fmt(screenGeometric.y)}</span>

              <span className="text-green-400">2D Mid:</span>
              <span className="text-right text-green-300">{fmt(visualMidpoint.x)}</span>
              <span className="text-right text-green-300">{fmt(visualMidpoint.y)}</span>
            </div>
          </div>

          {/* Distances */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] pt-2 border-t border-white/10">
            <span className="text-gray-400">2D Distance:</span>
            <span className="text-right font-bold text-white">{fmt(screenDistance)}px</span>

            <span className="text-gray-400">Mid Offset:</span>
            <span className="text-right font-bold text-yellow-400">{fmt(midpointOffset)}px</span>
          </div>
        </div>

        {/* Screen-space visualization overlay */}
        <svg
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: 5,
          }}
          width={size.width}
          height={size.height}
        >
          {/* Connection line */}
          <line
            x1={screen1.x}
            y1={screen1.y}
            x2={screen2.x}
            y2={screen2.y}
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="1"
            strokeDasharray="4,4"
          />

          {/* Object positions */}
          <circle
            cx={screen1.x}
            cy={screen1.y}
            r="6"
            fill="rgba(34, 211, 238, 0.6)"
            stroke="rgb(34, 211, 238)"
            strokeWidth="2"
          />
          <circle
            cx={screen2.x}
            cy={screen2.y}
            r="6"
            fill="rgba(34, 211, 238, 0.6)"
            stroke="rgb(34, 211, 238)"
            strokeWidth="2"
          />

          {/* Geometric midpoint (3D) */}
          <circle
            cx={screenGeometric.x}
            cy={screenGeometric.y}
            r="8"
            fill="rgba(239, 68, 68, 0.5)"
            stroke="rgb(239, 68, 68)"
            strokeWidth="2"
          />
          <text
            x={screenGeometric.x}
            y={screenGeometric.y - 15}
            fill="rgb(239, 68, 68)"
            fontSize="11"
            fontFamily="monospace"
            fontWeight="bold"
            textAnchor="middle"
          >
            3D Midpoint
          </text>

          {/* Visual midpoint (2D) */}
          <circle
            cx={visualMidpoint.x}
            cy={visualMidpoint.y}
            r="8"
            fill="rgba(34, 197, 94, 0.5)"
            stroke="rgb(34, 197, 94)"
            strokeWidth="2"
          />
          <text
            x={visualMidpoint.x}
            y={visualMidpoint.y + 25}
            fill="rgb(34, 197, 94)"
            fontSize="11"
            fontFamily="monospace"
            fontWeight="bold"
            textAnchor="middle"
          >
            Screen Midpoint
          </text>

          {/* Offset indicator */}
          {midpointOffset > 1 && (
            <line
              x1={screenGeometric.x}
              y1={screenGeometric.y}
              x2={visualMidpoint.x}
              y2={visualMidpoint.y}
              stroke="rgba(250, 204, 21, 0.8)"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
          )}

          {/* Arrow marker definition */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="8"
              refY="3"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3, 0 6"
                fill="rgba(250, 204, 21, 0.8)"
              />
            </marker>
          </defs>
        </svg>
      </Html>
    </>
  );
};
