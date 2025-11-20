/**
 * WATER BRIDGE IMPLEMENTATION
 *
 * Minimal architectural connector between Beam-A and Waterfall
 *
 * Geometry:
 * - Beam-A endpoint:      [2.40, 0.00, -13.00]
 * - Water-Spout position: [11.52, 9.19, -3.78]  (midpoint at elevation)
 * - Waterfall top:        [20.64, 18.38, 5.44]
 *
 * This single WaterBlock acts as an "optical spout" that bridges the gap
 * using Monument Valley's illusion-as-physics principle.
 */

import React from 'react';
import { WaterBlock } from './BuildingBlocks';

/**
 * Add this to LevelOne.tsx within the main return statement,
 * after the "Beam-A" MovableWrapper and before "Waterfall":
 */

export const WaterBridgeComponent = ({
  selectedIds,
  onSelect,
  getUiIndex,
  theme
}: {
  selectedIds: Set<string>;
  onSelect: (id: string, multi: boolean) => void;
  getUiIndex: (id: string) => number;
  theme: any;
}) => {
  return (
    <MovableWrapper
      id="Water-Spout"
      initialPos={[11.52, 9.19, -3.78]}
      isSelected={selectedIds.has('Water-Spout')}
      onSelect={onSelect}
      uiOffsetIndex={getUiIndex('Water-Spout')}
    >
      <WaterBlock
        position={[0, 0, 0]}
        color={theme.palette.brick}
        axis="x"
        walls={[false, false]}        // Open channel on both sides
        endWalls={[false, false]}     // Open at both ends
        flowDirection={[1, 0]}        // Flow direction: toward positive X (waterfall)
      />
    </MovableWrapper>
  );
};

/**
 * EXACT PLACEMENT IN LevelOne.tsx:
 *
 * After line 340 (end of Beam-A MovableWrapper), add:
 *
 * <MovableWrapper
 *   id="Water-Spout"
 *   initialPos={[11.52, 9.19, -3.78]}
 *   isSelected={selectedIds.has('Water-Spout')}
 *   onSelect={handleSelect}
 *   uiOffsetIndex={getUiIndex('Water-Spout')}
 * >
 *   <WaterBlock
 *     position={[0, 0, 0]}
 *     color={theme.palette.brick}
 *     axis="x"
 *     walls={[false, false]}
 *     endWalls={[false, false]}
 *     flowDirection={[1, 0]}
 *   />
 * </MovableWrapper>
 */

/**
 * VISUAL DESCRIPTION:
 *
 * ┌─────────────────────────────────────────────┐
 * │  ISOMETRIC VIEW: Water Bridge Arc             │
 * ├─────────────────────────────────────────────┤
 * │                                               │
 * │              [Waterfall ◄]                   │
 * │              [Height: 18.38]                 │
 * │                    ▲                         │
 * │                   ╱  ╲                       │
 * │                  ╱    ╲                      │
 * │             [Spout]    Water arc             │
 * │        [9.19 height]   optical path          │
 * │              ▲ ╱        ╲                    │
 * │             ╱  ╲         ╲                   │
 * │            ╱    ╲         ▼                  │
 * │     [Beam-A] ─────► [Flow direction]        │
 * │  [0.00 height]                              │
 * │                                               │
 * │  Key: Minimal geometry, maximum elegance     │
 * │        Single WaterBlock = optical bridge    │
 * └─────────────────────────────────────────────┘
 *
 * The water appears to:
 * 1. Exit Beam-A at [2.40, 0.00, -13.00]
 * 2. Arc through the Spout Platform
 * 3. Enter Waterfall at [20.64, 18.38, 5.44]
 *
 * All visible in isometric projection as a continuous flow.
 */

/**
 * FINE-TUNING GUIDE:
 *
 * If water appears to miss the waterfall in isometric view:
 * - Adjust X: 11.52 ± 0.5
 * - Adjust Y: 9.19 ± 0.5 (elevation)
 * - Adjust Z: -3.78 ± 0.5
 *
 * Current position is calculated as:
 * - X: Midpoint between Beam-A (2.40) and Waterfall (20.64)
 *   = (2.40 + 20.64) / 2 = 11.52
 * - Y: Midpoint elevation (0.00 + 18.38) / 2 = 9.19
 * - Z: Midpoint between Beam-A (-13.00) and Waterfall (5.44)
 *   = (-13.00 + 5.44) / 2 = -3.78
 *
 * This ensures the arc appears centered and balanced in isometric space.
 */
