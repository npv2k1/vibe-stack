import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { Scene3DCanvasProps } from './Scene3D.types';

/**
 * Scene3D Canvas component - Main container for 3D scenes
 * 
 * @example
 * ```tsx
 * <Scene3D.Canvas>
 *   <Scene3D.Box position={[0, 0, 0]} color="#ff0000" />
 * </Scene3D.Canvas>
 * ```
 */
export const Scene3DCanvas: React.FC<Scene3DCanvasProps> = ({
  children,
  width = '100%',
  height = '400px',
  cameraPosition = [0, 0, 5],
  fov = 75,
  backgroundColor = '#000000',
  shadows = false,
  controls = true,
  className = '',
}) => {
  return (
    <div 
      style={{ 
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }} 
      className={className}
    >
      <Canvas
        shadows={shadows}
        camera={{ position: cameraPosition, fov }}
        style={{ background: backgroundColor }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        {children}
        {controls && <OrbitControls />}
      </Canvas>
    </div>
  );
};
