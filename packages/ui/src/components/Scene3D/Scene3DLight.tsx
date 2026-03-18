import React from 'react';
import type { Scene3DLightProps } from './Scene3D.types';

/**
 * Scene3D Light component - Lighting for 3D scenes
 * 
 * @example
 * ```tsx
 * <Scene3D.Light type="point" position={[5, 5, 5]} intensity={1} />
 * ```
 */
export const Scene3DLight: React.FC<Scene3DLightProps> = ({
  type = 'ambient',
  position = [10, 10, 5],
  intensity = 1,
  color = '#ffffff',
}) => {
  switch (type) {
    case 'ambient':
      return <ambientLight intensity={intensity} color={color} />;
    case 'directional':
      return <directionalLight position={position} intensity={intensity} color={color} />;
    case 'point':
      return <pointLight position={position} intensity={intensity} color={color} />;
    default:
      return <ambientLight intensity={intensity} color={color} />;
  }
};
