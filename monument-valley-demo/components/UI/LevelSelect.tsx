import React from 'react';

interface LevelSelectProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LevelSelect: React.FC<LevelSelectProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[60] bg-[#1a2a30]/90 backdrop-blur-md flex items-center justify-center">
      <div className="w-full max-w-md px-8">
        
        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
          <h2 className="text-2xl font-serif text-white tracking-widest">SELECT PATH</h2>
          <button 
            onClick={onClose}
            className="text-[10px] font-sans text-gray-400 hover:text-white tracking-widest uppercase transition-colors"
          >
            Close
          </button>
        </div>

        <div className="space-y-4">
          <button className="w-full group text-left">
            <div className="border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-all duration-300 flex items-center justify-between">
              <div>
                <span className="text-2xl font-serif text-white/20 mr-4 group-hover:text-white/40 transition-colors">01</span>
                <span className="text-sm font-bold text-white tracking-widest">THE GARDEN</span>
              </div>
              <span className="text-[10px] text-mv-primary uppercase tracking-wider opacity-50 group-hover:opacity-100">Current Location</span>
            </div>
          </button>

          {/* Placeholder for future levels */}
          <div className="border border-white/5 bg-black/20 p-6 flex items-center justify-between opacity-50 cursor-not-allowed">
             <div>
                <span className="text-2xl font-serif text-white/10 mr-4">02</span>
                <span className="text-sm font-bold text-gray-500 tracking-widest">THE ROOKERY</span>
              </div>
              <span className="text-[10px] text-gray-600 uppercase tracking-wider">LOCKED</span>
          </div>
        </div>

      </div>
    </div>
  );
};