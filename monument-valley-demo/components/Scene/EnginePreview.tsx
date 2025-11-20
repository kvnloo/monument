import React, { useLayoutEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrthographicCamera, OrbitControls } from '@react-three/drei';
import { LevelOne } from './LevelOne';
import { PALETTE } from '../../constants';

/**
 * IsoCameraRig
 * Forces the camera to look at the center of the world (0,0,0)
 * regardless of its position. This ensures the isometric angle is perfectly targeted.
 */
const IsoCameraRig = () => {
  const { camera } = useThree();
  
  useLayoutEffect(() => {
    // Standard Isometric setup:
    // Position at equal distances on all axes (e.g. 20,20,20)
    // Look at origin (0,0,0)
    camera.position.set(20, 20, 20);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return null;
};

interface EnginePreviewProps {
    showOverlay?: boolean;
}

export const EnginePreview: React.FC<EnginePreviewProps> = ({ showOverlay = false }) => {
  const [isLocked, setIsLocked] = useState(true);

  return (
    <div className="w-full h-full absolute top-0 left-0" style={{ background: `linear-gradient(to bottom, #2a2a2a, ${PALETTE.background})` }}>
      <Canvas shadows dpr={[1, 2]}>
        
        {/* Camera Configuration */}
        <OrthographicCamera 
          makeDefault 
          zoom={40} // Optimal zoom for 10-unit wide structures
          near={-100} 
          far={200}
        />

        {/* Conditional Camera Control */}
        {isLocked ? (
            <IsoCameraRig />
        ) : (
            <OrbitControls 
                enableZoom={true} 
                enablePan={true} 
                enableRotate={true} 
                minZoom={10}
                maxZoom={100}
            />
        )}

        {/* 
            LIGHTING STRATEGY:
            Soft ambient to avoid pitch black shadows on the "hidden" faces.
            Directional light aligned to highlight top faces and cast shape-defining shadows.
        */}
        <ambientLight intensity={0.7} color="#cceeff" />
        
        <directionalLight 
          position={[-10, 20, 5]} 
          intensity={0.8} 
          castShadow 
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0005}
          color="#fff0dd"
        />

        {/* Level Content */}
        <LevelOne />
        
      </Canvas>
      
      {/* Penrose Tribute Overlay (Visible in Engine Mode) */}
      {showOverlay && (
        <div className="absolute top-24 left-8 pointer-events-none z-40">
            <h2 className="text-5xl font-serif text-white tracking-widest mb-2 drop-shadow-2xl">PENROSE</h2>
            <p className="text-xs font-sans text-mv-accent tracking-[0.3em] uppercase font-semibold">
                Monument Valley Tribute
            </p>
        </div>
      )}

      {/* Camera Control Toggle */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-auto z-50 flex flex-col items-center group">
         <p className="text-[10px] font-sans text-gray-500 uppercase tracking-widest mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
             Perspective Control
         </p>
         <button 
            onClick={() => setIsLocked(!isLocked)}
            className={`w-12 h-12 rounded-full border border-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/10 ${!isLocked ? 'bg-mv-primary/20 border-mv-primary shadow-[0_0_15px_rgba(255,126,103,0.3)]' : 'bg-black/30'}`}
         >
            {/* Icon changes based on state */}
            {isLocked ? (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            ) : (
                <svg className="w-5 h-5 text-mv-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            )}
         </button>
      </div>

      <div className="absolute bottom-8 right-8 pointer-events-none z-40">
        <div className="bg-black/60 backdrop-blur px-4 py-2 rounded-lg border border-white/10">
            <p className="text-xs font-mono text-mv-accent">ENGINE: ACTIVE</p>
            <p className="text-[10px] font-mono text-gray-400">Cam: {isLocked ? 'Iso Rig (Locked)' : 'Free Orbit'}</p>
        </div>
      </div>
    </div>
  );
};