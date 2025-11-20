import React, { useRef, useMemo, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingParticlesProps {
  count?: number;
  radius?: number;
  spread?: [number, number, number];
  opacity?: number;
  speed?: number;
}

/**
 * FloatingParticles Component
 *
 * Creates subtle white particles floating in 3D space using InstancedMesh for optimal performance.
 * Perfect for Monument Valley-style atmospheric depth effects.
 *
 * Uses InstancedMesh instead of individual meshes to render multiple particles efficiently.
 * Each particle has individual position and animation state.
 */
export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  count = 15,
  radius = 0.12,
  spread = [30, 20, 30],
  opacity = 0.4,
  speed = 0.5
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const geometryRef = useRef<THREE.SphereGeometry>(null!);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!);

  // Store particle states for animation
  const particlesRef = useRef<Array<{
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    time: number;
  }>>([]);

  /**
   * Initialize particle positions and velocities
   * Particles are randomly positioned within the spread bounds
   * and have random velocities for organic drifting motion
   */
  const initializeParticles = () => {
    const particles = [];

    for (let i = 0; i < count; i++) {
      // Random position within spread bounds, centered at origin
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * spread[0],
        (Math.random() - 0.5) * spread[1],
        (Math.random() - 0.5) * spread[2]
      );

      // Random velocity with low magnitude for subtle drifting
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * speed,
        (Math.random() - 0.5) * speed * 0.5, // Less vertical movement
        (Math.random() - 0.5) * speed
      );

      particles.push({
        position,
        velocity,
        time: Math.random() * Math.PI * 2 // Random animation phase
      });
    }

    particlesRef.current = particles;

    // Set initial transforms in InstancedMesh
    particles.forEach((particle, index) => {
      const matrix = new THREE.Matrix4();
      matrix.setPosition(particle.position);
      meshRef.current.setMatrixAt(index, matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  };

  // Initialize particles on mount
  useLayoutEffect(() => {
    initializeParticles();
  }, [count, spread]);

  /**
   * Animation frame loop
   * Updates particle positions with sine wave oscillation for smooth floating motion
   * Also wraps particles around the scene bounds for continuous movement
   */
  useFrame((state, delta) => {
    const particles = particlesRef.current;

    particles.forEach((particle, index) => {
      // Apply smooth oscillating motion using sine waves at different frequencies
      particle.time += delta * speed;

      // Main drift motion
      particle.position.x += particle.velocity.x * delta;
      particle.position.y += particle.velocity.y * delta;
      particle.position.z += particle.velocity.z * delta;

      // Add subtle sine-wave oscillation to each axis for organic motion
      const oscillationX = Math.sin(particle.time * 0.8) * 0.3;
      const oscillationY = Math.sin(particle.time * 1.2 + particle.position.z * 0.1) * 0.2;
      const oscillationZ = Math.cos(particle.time * 0.6) * 0.3;

      const finalPos = new THREE.Vector3(
        particle.position.x + oscillationX,
        particle.position.y + oscillationY,
        particle.position.z + oscillationZ
      );

      // Wrap particles around bounds for continuous cycling
      const [spreadX, spreadY, spreadZ] = spread;
      const boundX = spreadX / 2;
      const boundY = spreadY / 2;
      const boundZ = spreadZ / 2;

      if (Math.abs(finalPos.x) > boundX) {
        finalPos.x = -Math.sign(finalPos.x) * boundX;
        particle.position.x = finalPos.x;
      }
      if (Math.abs(finalPos.y) > boundY) {
        finalPos.y = -Math.sign(finalPos.y) * boundY;
        particle.position.y = finalPos.y;
      }
      if (Math.abs(finalPos.z) > boundZ) {
        finalPos.z = -Math.sign(finalPos.z) * boundZ;
        particle.position.z = finalPos.z;
      }

      // Update the matrix for this instance
      const matrix = new THREE.Matrix4();
      matrix.setPosition(finalPos);
      meshRef.current.setMatrixAt(index, matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  // Create sphere geometry once and reuse it
  const geometry = useMemo(() => {
    return new THREE.SphereGeometry(radius, 8, 8);
  }, [radius]);

  // Create material with transparency for subtle effect
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#ffffff',
      emissive: '#ffffff',
      emissiveIntensity: 0.2,
      transparent: true,
      opacity: opacity,
      roughness: 0.5,
      metalness: 0.1
    });
  }, [opacity]);

  return (
    <instancedMesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      args={[undefined, undefined, count]}
      castShadow={false}
      receiveShadow={false}
      frustumCulled={true}
    />
  );
};

export default FloatingParticles;
