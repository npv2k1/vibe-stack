import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';
import type { Scene3DBoxProps } from './Scene3D.types';

/**
 * Scene3D Box component - A 3D box/cube primitive
 * 
 * @example
 * ```tsx
 * <Scene3D.Box 
 *   position={[0, 0, 0]} 
 *   size={[1, 1, 1]} 
 *   color="#ff0000"
 *   animate
 * />
 * ```
 */
export const Scene3DBox: React.FC<Scene3DBoxProps> = ({
  position = [0, 0, 0],
  size = [1, 1, 1],
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
      <boxGeometry args={size} />
      <meshStandardMaterial 
        color={hovered ? `${color}cc` : color} 
        opacity={hovered ? 0.8 : 1}
        transparent={hovered}
      />
    </mesh>
  );
};
