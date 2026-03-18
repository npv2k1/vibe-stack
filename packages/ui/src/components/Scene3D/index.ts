import { Scene3DCanvas } from './Scene3DCanvas';
import { Scene3DBox } from './Scene3DBox';
import { Scene3DSphere } from './Scene3DSphere';
import { Scene3DLight } from './Scene3DLight';

export * from './Scene3D.types';

/**
 * Scene3D component for creating interactive 3D scenes using Three.js
 * 
 * @example
 * ```tsx
 * import { Scene3D } from '@vdailyapp/ui';
 * 
 * function My3DScene() {
 *   return (
 *     <Scene3D.Canvas 
 *       height="600px" 
 *       cameraPosition={[0, 0, 8]}
 *       backgroundColor="#1a1a1a"
 *     >
 *       <Scene3D.Box 
 *         position={[-2, 0, 0]} 
 *         color="#ff0000" 
 *         animate
 *         onClick={() => console.log('Box clicked!')}
 *       />
 *       <Scene3D.Sphere 
 *         position={[2, 0, 0]} 
 *         color="#00ff00" 
 *         radius={1.2}
 *         animate
 *         animationSpeed={0.02}
 *       />
 *       <Scene3D.Light type="point" position={[5, 5, 5]} intensity={1.5} />
 *     </Scene3D.Canvas>
 *   );
 * }
 * ```
 */
export const Scene3D = {
  /**
   * Main canvas container for 3D scenes
   */
  Canvas: Scene3DCanvas,
  
  /**
   * 3D box/cube primitive
   */
  Box: Scene3DBox,
  
  /**
   * 3D sphere primitive
   */
  Sphere: Scene3DSphere,
  
  /**
   * Light source for 3D scenes
   */
  Light: Scene3DLight,
};
