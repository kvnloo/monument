import { LevelTheme } from './types';

export const LEVEL_THEMES: Record<string, LevelTheme> = {
  theGarden: {
    id: 'theGarden',
    name: 'The Garden',
    palette: {
      background: '#0d1418',
      brick: '#E0E0E0',
      brickDark: '#8898A8',
      shadow: '#2A3438',
      accent: '#3DB8B8',
      character: '#F8F8F8',
      path: '#ECECEC',
      door: '#1A2024',
      water: '#38A8A0',
      waterfall: '#68C0B8',
    },
    lighting: {
      ambient: {
        intensity: 0.35,
        color: '#b0c4d4',
      },
      directional: {
        position: [-10, 20, 5],
        intensity: 1.2,
        color: '#fff0dd',
      },
      rim: {
        position: [15, 5, -10],
        intensity: 0.4,
        color: '#4a5f7a',
      },
    },
    atmosphere: {
      backgroundGradient: {
        from: '#0a0f14',
        mid: '#0d1418',
        to: '#1a2430',
      },
      particles: {
        count: 15,
        color: '#ffffff',
        opacity: 0.4,
      },
    },
  },

  desertTemple: {
    id: 'desertTemple',
    name: 'Desert Temple',
    palette: {
      background: '#3D2817',
      brick: '#E8D4B0',
      brickDark: '#C0986F',
      shadow: '#4A3220',
      accent: '#FF9D5C',
      character: '#FFFFFF',
      path: '#F5E6D3',
      door: '#2A1810',
      water: '#B8956A',
      waterfall: '#D4B896',
    },
    lighting: {
      ambient: {
        intensity: 0.45,
        color: '#ffedd5',
      },
      directional: {
        position: [15, 25, 10],
        intensity: 1.4,
        color: '#ffd699',
      },
      rim: {
        position: [-12, 8, -8],
        intensity: 0.5,
        color: '#8b6f47',
      },
    },
    atmosphere: {
      backgroundGradient: {
        from: '#5a3d2b',
        mid: '#3D2817',
        to: '#2a1810',
      },
      particles: {
        count: 20,
        color: '#ffd699',
        opacity: 0.3,
      },
    },
  },

  twilightCove: {
    id: 'twilightCove',
    name: 'Twilight Cove',
    palette: {
      background: '#1a1530',
      brick: '#B8A8D8',
      brickDark: '#7E6FA8',
      shadow: '#2a2040',
      accent: '#E879F9',
      character: '#FFFFFF',
      path: '#D1C4E9',
      door: '#1a1228',
      water: '#9D7BD8',
      waterfall: '#B89FE8',
    },
    lighting: {
      ambient: {
        intensity: 0.3,
        color: '#d0b8ff',
      },
      directional: {
        position: [-15, 18, -10],
        intensity: 0.9,
        color: '#e8d5ff',
      },
      rim: {
        position: [18, 6, 12],
        intensity: 0.6,
        color: '#b89fe8',
      },
    },
    atmosphere: {
      backgroundGradient: {
        from: '#2a1f3d',
        mid: '#1a1530',
        to: '#120f20',
      },
      fog: {
        color: '#302550',
        near: 30,
        far: 100,
      },
      particles: {
        count: 12,
        color: '#e8d5ff',
        opacity: 0.5,
      },
    },
  },
};

export const getTheme = (themeId: string): LevelTheme => {
  const theme = LEVEL_THEMES[themeId];
  if (!theme) {
    console.warn(`Theme "${themeId}" not found, using default (theGarden)`);
    return LEVEL_THEMES.theGarden;
  }
  return theme;
};
