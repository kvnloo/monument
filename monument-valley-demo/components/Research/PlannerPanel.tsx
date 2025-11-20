import React, { useState } from 'react';
import { ResearchItem, ResearchCategory } from '../../types';
import { ResearchCard } from './ResearchCard';
import { generateResearch } from '../../services/geminiService';
import { INITIAL_RESEARCH } from '../../constants';

export const PlannerPanel: React.FC = () => {
  const [researchItems, setResearchItems] = useState<ResearchItem[]>(INITIAL_RESEARCH);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAskArchitect = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    
    const prompt = `Context: Planning a Monument Valley clone.
    User Query: ${query}
    
    Provide a concise, technical answer. If relevant, include a small TypeScript code snippet demonstrating the concept.`;

    const response = await generateResearch(prompt);
    
    const newItem: ResearchItem = {
      id: Date.now().toString(),
      category: ResearchCategory.NEXT_STEPS,
      title: `Query: ${query}`,
      content: response,
    };

    setResearchItems([newItem, ...researchItems]);
    setQuery('');
    setIsLoading(false);
  };

  return (
    <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto pr-2 pt-24 pb-24">
            <div className="mb-8">
                <h2 className="text-2xl font-serif text-mv-primary mb-2">Architecture & Strategy</h2>
                <p className="text-sm text-gray-400">
                    Initial phase analysis for implementing non-Euclidean geometry in a WebGL context.
                </p>
            </div>

            {researchItems.map((item) => (
                <ResearchCard key={item.id} item={item} />
            ))}
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/90 to-transparent p-6 z-20">
            <div className="relative">
                <input 
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAskArchitect()}
                    placeholder="Ask the Architect (e.g. 'How to implement rotatable pivot?')"
                    className="w-full bg-white/10 border border-white/20 rounded-full py-3 pl-5 pr-12 text-sm text-white focus:outline-none focus:ring-2 focus:ring-mv-primary placeholder-gray-500 backdrop-blur-md"
                />
                <button 
                    onClick={handleAskArchitect}
                    disabled={isLoading}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-mv-primary rounded-full flex items-center justify-center hover:bg-white transition-colors disabled:opacity-50"
                >
                    {isLoading ? (
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    )}
                </button>
            </div>
        </div>
    </div>
  );
};