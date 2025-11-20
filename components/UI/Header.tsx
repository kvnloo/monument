import React from 'react';
import { ViewMode } from '../../types';

interface HeaderProps {
  activeMode: ViewMode;
  setMode: (mode: ViewMode) => void;
  onOpenLevels: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeMode, setMode, onOpenLevels }) => {
  return (
    <header className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-6 pointer-events-none">
      
      {/* Title Container - Fades out in Prototype Mode */}
      <div className={`transition-opacity duration-500 ${activeMode === 'prototype' ? 'opacity-0' : 'opacity-100'}`}>
        <h1 className="text-3xl font-serif font-bold tracking-widest text-white drop-shadow-lg">
          MONUMENTAL <span className="text-mv-primary">ARCHITECT</span>
        </h1>
        <p className="text-xs text-gray-400 font-sans tracking-wider uppercase mt-1">
          AI-Assisted Engineering Portfolio
        </p>
      </div>

      <div className="pointer-events-auto flex items-center space-x-4">
        {/* Levels Button */}
        <button 
            onClick={onOpenLevels}
            className="px-4 py-2 rounded-full bg-black/50 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-all backdrop-blur-md"
        >
            LEVELS
        </button>

        {/* Mode Switcher */}
        <div className="flex space-x-2 bg-mv-panel backdrop-blur-md rounded-full p-1 border border-white/10">
            <button
            onClick={() => setMode('research')}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeMode === 'research'
                ? 'bg-white text-black shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
            >
            Research
            </button>
            <button
            onClick={() => setMode('prototype')}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeMode === 'prototype'
                ? 'bg-white text-black shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
            >
            Engine Preview
            </button>
        </div>
      </div>
    </header>
  );
};