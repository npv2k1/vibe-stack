import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';
import type { Scene3DSphereProps } from './Scene3D.types';

/**
 * Scene3D Sphere component - A 3D sphere primitive
 * 
 * @example
 * ```tsx
 * <Scene3D.Sphere 
 *   position={[2, 0, 0]} 
 *   radius={1} 
 *   color="#00ff00"
 *   animate
 * />
 * ```
 */
export const Scene3DSphere: React.FC<Scene3DSphereProps> = ({
  position = [0, 0, 0],
  radius = 1,
  color = '#ffffff',
  rotation = [0, 0, 0],
  animate = false,
  animationSpeed = 0.01,
  onClick,
  onPointerOver,
  onPointerOut,
}) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current && animate) {
      meshRef.current.rotation.x += animationSpeed;
      meshRef.current.rotation.y += animationSpeed;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      onClick={onClick}
      onPointerOver={(e) => {
        setHovered(true);
        onPointerOver?.(e);
      }}
      onPointerOut={(e) => {
        setHovered(false);
        onPointerOut?.(e);
      }}
    >
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial 
        color={hovered ? `${color}cc` : color} 
        opacity={hovered ? 0.8 : 1}
        transparent={hovered}
      />
    </mesh>
  );
};
