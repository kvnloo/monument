import React from 'react';
import { ResearchItem } from '../../types';

interface ResearchCardProps {
  item: ResearchItem;
}

export const ResearchCard: React.FC<ResearchCardProps> = ({ item }) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-4 hover:bg-white/10 transition-colors duration-300 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-serif font-bold text-white">{item.title}</h3>
        <span className="text-xs font-mono bg-black/30 px-2 py-1 rounded text-mv-accent uppercase">
          {item.category}
        </span>
      </div>
      <p className="text-gray-300 text-sm leading-relaxed mb-4 font-sans whitespace-pre-line">
        {item.content}
      </p>
      {item.codeSnippet && (
        <div className="bg-black/50 rounded-lg p-4 overflow-x-auto border border-white/5">
          <pre className="text-xs font-mono text-mv-primary">
            <code>{item.codeSnippet}</code>
          </pre>
        </div>
      )}
    </div>
  );
};