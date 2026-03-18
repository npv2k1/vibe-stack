import type { ReactNode } from 'react';
import type * as THREE from 'three';

/**
 * Props for the Scene3D Canvas component
 */
export interface Scene3DCanvasProps {
  /** Child components to render in the 3D scene */
  children?: ReactNode;
  /** Canvas width - defaults to '100%' */
  width?: string | number;
  /** Canvas height - defaults to '400px' */
  height?: string | number;
  /** Camera position [x, y, z] - defaults to [0, 0, 5] */
  cameraPosition?: [number, number, number];
  /** Camera field of view - defaults to 75 */
  fov?: number;
  /** Background color - defaults to '#000000' */
  backgroundColor?: string;
  /** Enable shadows - defaults to false */
  shadows?: boolean;
  /** Enable camera controls (orbit controls) - defaults to true */
  controls?: boolean;
  /** Additional className for styling */
  className?: string;
}

/**
 * Props for the Scene3D Box component
 */
export interface Scene3DBoxProps {
  /** Position [x, y, z] - defaults to [0, 0, 0] */
  position?: [number, number, number];
  /** Size [width, height, depth] - defaults to [1, 1, 1] */
  size?: [number, number, number];
  /** Color - defaults to '#ffffff' */
  color?: string;
  /** Rotation [x, y, z] in radians - defaults to [0, 0, 0] */
  rotation?: [number, number, number];
  /** Enable animation - defaults to false */
  animate?: boolean;
  /** Animation speed - defaults to 0.01 */
  animationSpeed?: number;
  /** Click handler */
  onClick?: (event: any) => void;
  /** Hover handler */
  onPointerOver?: (event: any) => void;
  /** Hover end handler */
  onPointerOut?: (event: any) => void;
}

/**
 * Props for the Scene3D Sphere component
 */
export interface Scene3DSphereProps {
  /** Position [x, y, z] - defaults to [0, 0, 0] */
  position?: [number, number, number];
  /** Radius - defaults to 1 */
  radius?: number;
  /** Color - defaults to '#ffffff' */
  color?: string;
  /** Rotation [x, y, z] in radians - defaults to [0, 0, 0] */
  rotation?: [number, number, number];
  /** Enable animation - defaults to false */
  animate?: boolean;
  /** Animation speed - defaults to 0.01 */
  animationSpeed?: number;
  /** Click handler */
  onClick?: (event: any) => void;
  /** Hover handler */
  onPointerOver?: (event: any) => void;
  /** Hover end handler */
  onPointerOut?: (event: any) => void;
}

/**
 * Props for the Scene3D Light component
 */
export interface Scene3DLightProps {
  /** Light type */
  type?: 'ambient' | 'directional' | 'point';
  /** Position [x, y, z] - for directional and point lights */
  position?: [number, number, number];
  /** Light intensity - defaults to 1 */
  intensity?: number;
  /** Light color - defaults to '#ffffff' */
  color?: string;
}
