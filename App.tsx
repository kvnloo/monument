import React, { useState } from 'react';
import { ViewMode } from './types';
import { Header } from './components/UI/Header';
import { PlannerPanel } from './components/Research/PlannerPanel';
import { EnginePreview } from './components/Scene/EnginePreview';
import { IntroScreen } from './components/UI/IntroScreen';
import { LevelSelect } from './components/UI/LevelSelect';

const App: React.FC = () => {
  // State
  const [showIntro, setShowIntro] = useState(true);
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [mode, setMode] = useState<ViewMode>('research');

  const handleStart = () => {
    setShowIntro(false);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#1a1a1a]">
      
      {/* Intro Overlay */}
      {showIntro && <IntroScreen onStart={handleStart} />}

      {/* Level Select Overlay */}
      <LevelSelect isOpen={showLevelSelect} onClose={() => setShowLevelSelect(false)} />

      {/* Background 3D Engine - Pass 'mode' to toggle the Penrose overlay inside */}
      <EnginePreview showOverlay={mode === 'prototype'} />

      {/* Overlay Panel - Visual "Fog" when in research mode */}
      <div 
        className={`absolute inset-0 bg-[#1a1a1a]/80 backdrop-blur-sm transition-opacity duration-500 pointer-events-none ${
          mode === 'prototype' ? 'opacity-0' : 'opacity-100'
        }`} 
      />

      {/* Main Content Layout */}
      <div className="absolute inset-0 flex pointer-events-none">
        
        {/* Left Sidebar - Research & Planning */}
        <div 
          className={`relative z-10 h-full pointer-events-auto transition-all duration-500 ease-in-out ${
            mode === 'research' ? 'w-full md:w-1/2 lg:w-5/12 translate-x-0' : '-translate-x-full w-0'
          }`}
        >
          <div className="h-full px-8 border-r border-white/10 bg-gradient-to-r from-black/80 to-transparent">
             <PlannerPanel />
          </div>
        </div>

        {/* Right Side - Open space */}
        <div className="flex-1" />
      </div>

      {/* Header - Pass Level Open Handler */}
      <Header 
        activeMode={mode} 
        setMode={setMode} 
        onOpenLevels={() => setShowLevelSelect(true)}
      />
    </div>
  );
};

export default App;