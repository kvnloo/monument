export enum ResearchCategory {
  MECHANICS = 'mechanics',
  ARCHITECTURE = 'architecture',
  ART_DIRECTION = 'art_direction',
  NEXT_STEPS = 'next_steps'
}

export interface ResearchItem {
  id: string;
  category: ResearchCategory;
  title: string;
  content: string;
  codeSnippet?: string;
}

export interface GameConfig {
  debugMode: boolean;
  gridSize: number;
  isoAngle: number;
}

export type ViewMode = 'research' | 'prototype';