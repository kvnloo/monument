import React, { useLayoutEffect, useState, useMemo, ReactNode } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrthographicCamera, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../contexts';

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

/**
 * ThemedLighting
 * Applies lighting configuration from the current theme
 */
const ThemedLighting: React.FC = () => {
  const { theme } = useTheme();

  return (
    <>
      <ambientLight
        intensity={theme.lighting.ambient.intensity}
        color={theme.lighting.ambient.color}
      />

      <directionalLight
        position={theme.lighting.directional.position}
        intensity={theme.lighting.directional.intensity}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0005}
        color={theme.lighting.directional.color}
      />

      {theme.lighting.rim && (
        <directionalLight
          position={theme.lighting.rim.position}
          intensity={theme.lighting.rim.intensity}
          color={theme.lighting.rim.color}
          castShadow={false}
        />
      )}
    </>
  );
};

/**
 * ThemedFog
 * Applies fog configuration from the current theme
 */
const ThemedFog: React.FC = () => {
  const { theme } = useTheme();
  const { scene } = useThree();

  useLayoutEffect(() => {
    if (theme.atmosphere.fog) {
      scene.fog = new THREE.Fog(
        theme.atmosphere.fog.color,
        theme.atmosphere.fog.near,
        theme.atmosphere.fog.far
      );
    } else {
      scene.fog = null;
    }

    return () => {
      scene.fog = null;
    };
  }, [theme, scene]);

  return null;
};

interface EnginePreviewProps {
    showOverlay?: boolean;
    children: ReactNode;
}

export const EnginePreview: React.FC<EnginePreviewProps> = ({ showOverlay = false, children }) => {
  const { theme } = useTheme();
  const [isLocked, setIsLocked] = useState(true);

  // GPU Capability Heuristic
  // Check if the device has high pixel ratio (Retina) or decent CPU core count as proxy for GPU power
  const isHighPerf = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const pixelRatio = window.devicePixelRatio || 1;
    const cores = navigator.hardwareConcurrency || 2;
    return pixelRatio > 1 || cores >= 4;
  }, []);

  const backgroundStyle = {
    background: `linear-gradient(to bottom, ${theme.atmosphere.backgroundGradient.from} 0%, ${theme.atmosphere.backgroundGradient.mid} 50%, ${theme.atmosphere.backgroundGradient.to} 100%)`
  };

  return (
    <div className="w-full h-full absolute top-0 left-0" style={backgroundStyle}>
      <Canvas 
        shadows 
        dpr={isHighPerf ? [1, 2] : 1}
        gl={{ 
          powerPreference: isHighPerf ? "high-performance" : "default",
          antialias: true,
          stencil: false,
          depth: true 
        }}
      >
        
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

        {/* Theme-aware lighting */}
        <ThemedLighting />
        <ThemedFog />

        {/* Level Content */}
        {children}
        
      </Canvas>
      
      {/* Level Name Overlay (Visible in Engine Mode) */}
      {showOverlay && (
        <div className="absolute top-24 left-8 pointer-events-none z-40">
            <h2 className="text-5xl font-serif text-white tracking-widest mb-2 drop-shadow-2xl">{theme.name.toUpperCase()}</h2>
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

      <div className="absolute bottom-8 right-8 pointer-events-none z-40 flex flex-col items-end space-y-2">
        <div className="bg-black/60 backdrop-blur px-4 py-2 rounded-lg border border-white/10">
            <p className="text-xs font-mono text-mv-accent">ENGINE: ACTIVE</p>
            <p className="text-[10px] font-mono text-gray-400">Cam: {isLocked ? 'Iso Rig (Locked)' : 'Free Orbit'}</p>
            <p className="text-[10px] font-mono text-gray-400">Theme: {theme.name}</p>
        </div>
        
        {/* GPU Status Indicator */}
        <div className="bg-black/60 backdrop-blur px-3 py-1 rounded-lg border border-white/5 flex items-center space-x-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isHighPerf ? 'bg-green-400 shadow-[0_0_5px_rgba(74,222,128,0.5)]' : 'bg-yellow-500'}`} />
            <span className="text-[9px] font-mono text-gray-400 uppercase">
                GPU: {isHighPerf ? 'High Perf' : 'Standard'}
            </span>
        </div>
      </div>
    </div>
  );
};