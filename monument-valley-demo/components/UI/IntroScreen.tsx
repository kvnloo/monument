import React from 'react';

interface IntroScreenProps {
  onStart: () => void;
  isExiting?: boolean;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onStart, isExiting = false }) => {
  return (
    <div className={`absolute inset-0 z-[100] bg-[#FFF0F5] flex flex-col items-center justify-center transition-all duration-1000 ${
      isExiting
        ? 'opacity-0 scale-95 blur-sm pointer-events-none'
        : 'opacity-100 scale-100 blur-0'
    }`}>
      {/* Logo Container */}
      <div className={`mb-12 relative w-32 h-32 md:w-48 md:h-48 transition-all duration-700 ${
        isExiting ? 'scale-110 opacity-0' : 'scale-100 opacity-100'
      }`}>
        {/* Outer Diamond */}
        <div className="absolute inset-0 border-2 border-[#FF69B4] rotate-45 transform origin-center" />
        {/* Inner Diamond */}
        <div className="absolute inset-4 border border-[#FF69B4]/50 rotate-45 transform origin-center" />
        {/* Center Circle */}
        <div className="absolute inset-0 m-auto w-8 h-8 md:w-12 md:h-12 bg-[#FF69B4] rounded-full shadow-[0_0_20px_rgba(255,105,180,0.5)]" />
      </div>

      {/* Typography */}
      <h1 className={`text-3xl md:text-5xl font-serif text-[#D81B60] tracking-[0.2em] mb-4 text-center px-4 transition-all duration-800 ${
        isExiting ? 'translate-y-[-30px] opacity-0' : 'translate-y-0 opacity-100'
      }`}>
        VALLEY OF PATHS
      </h1>

      <p className={`text-[10px] md:text-xs font-sans text-[#D81B60]/60 tracking-[0.4em] uppercase mb-16 transition-all duration-800 delay-100 ${
        isExiting ? 'translate-y-[-20px] opacity-0' : 'translate-y-0 opacity-100'
      }`}>
        Perspective is Reality
      </p>

      {/* Interaction */}
      <button
        onClick={onStart}
        className={`px-8 py-3 md:px-12 md:py-4 border border-[#D81B60] rounded-full text-[#D81B60] text-xs md:text-sm font-bold tracking-widest hover:bg-[#D81B60] hover:text-white transition-all duration-500 uppercase ${
          isExiting ? 'scale-90 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        Begin Journey
      </button>
      
      <div className="absolute bottom-8 text-[9px] text-[#D81B60]/30 font-sans tracking-widest">
        INSPIRED BY MONUMENT VALLEY • AI STORYTELLING
      </div>
    </div>
  );
};