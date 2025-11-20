import * as THREE from 'three';

/**
 * Generates a procedural noise texture for water.
 * Uses an off-screen canvas to create a seamless noise pattern.
 * Includes visible flowing streaks on a subtle dark water base.
 */
export const createWaterTexture = (): THREE.CanvasTexture => {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // 1. Dark water base (teal-green) for subtle, natural effect
    ctx.fillStyle = '#2a6860';
    ctx.fillRect(0, 0, size, size);

    // 2. Higher-contrast flowing streaks for visible animation
    // Create distinct lighter streaks with higher opacity
    for (let i = 0; i < 500; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      // Mix of bright and subtle streaks: 60% bright, 40% subtle
      const isBrightStreak = Math.random() < 0.6;
      const alpha = isBrightStreak
        ? Math.random() * 0.4 + 0.5    // Bright: 0.5-0.9 opacity
        : Math.random() * 0.25 + 0.15; // Subtle: 0.15-0.4 opacity
      const length = Math.random() * 80 + 30;    // 30-110 px for more visible streaks
      const thickness = Math.random() * 3 + 1.5; // 1.5-4.5 px, thicker for visibility

      // Use lighter cyan/turquoise colors for the streaks instead of pure white
      const streakColors = [
        `rgba(136, 232, 224, ${alpha})`, // #88e8e0 - Light cyan
        `rgba(109, 216, 207, ${alpha})`, // #6dd8cf - Medium cyan
        `rgba(200, 245, 240, ${alpha})`, // #c8f5f0 - Very light cyan
        `rgba(255, 255, 255, ${alpha})`  // White for highest contrast
      ];

      const color = streakColors[Math.floor(Math.random() * streakColors.length)];
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.rect(x, y, length, thickness);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
};
