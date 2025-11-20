export interface LevelTheme {
  id: string;
  name: string;
  palette: ColorPalette;
  lighting: LightingConfig;
  atmosphere: AtmosphereConfig;
}

export interface ColorPalette {
  // Surface colors
  background: string;
  brick: string;
  brickDark: string;
  shadow: string;

  // Interactive elements
  accent: string;
  character: string;
  path: string;
  door: string;

  // Special effects
  water: string;
  waterfall: string;
}

export interface LightingConfig {
  ambient: {
    intensity: number;
    color: string;
  };
  directional: {
    position: [number, number, number];
    intensity: number;
    color: string;
  };
  rim?: {
    position: [number, number, number];
    intensity: number;
    color: string;
  };
}

export interface AtmosphereConfig {
  backgroundGradient: {
    from: string;
    mid: string;
    to: string;
  };
  fog?: {
    color: string;
    near: number;
    far: number;
  };
  particles?: {
    count: number;
    color: string;
    opacity: number;
  };
}
