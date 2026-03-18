/**
 * Type declarations for React Three Fiber JSX elements
 * React Three Fiber extends JSX.IntrinsicElements to include Three.js objects
 */

import { ThreeElements } from '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

export {};
