import React, { useState } from 'react';
import { Scene3D } from './index';

/**
 * Scene3D Example Component
 * Demonstrates various features of the Scene3D component
 */
export const Scene3DExample: React.FC = () => {
  const [clickedObject, setClickedObject] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">3D Scene Example</h2>
        <p className="text-gray-600 mb-4">
          Click and drag to rotate the camera. Scroll to zoom. Click on objects to interact.
        </p>
      </div>

      <Scene3D.Canvas
        height="600px"
        cameraPosition={[0, 0, 8]}
        backgroundColor="#1a1a2e"
        className="rounded-lg shadow-lg"
      >
        {/* Animated red box on the left */}
        <Scene3D.Box
          position={[-2.5, 0, 0]}
          size={[1.5, 1.5, 1.5]}
          color="#ff0000"
          animate
          animationSpeed={0.01}
          onClick={() => setClickedObject('Red Box')}
        />

        {/* Static blue box in the center */}
        <Scene3D.Box
          position={[0, 0, 0]}
          size={[1, 1, 1]}
          color="#0000ff"
          onClick={() => setClickedObject('Blue Box')}
        />

        {/* Animated green sphere on the right */}
        <Scene3D.Sphere
          position={[2.5, 0, 0]}
          radius={0.8}
          color="#00ff00"
          animate
          animationSpeed={0.015}
          onClick={() => setClickedObject('Green Sphere')}
        />

        {/* Additional lighting */}
        <Scene3D.Light type="point" position={[5, 5, 5]} intensity={1.5} />
        <Scene3D.Light type="point" position={[-5, -5, 5]} intensity={0.5} color="#ff00ff" />
      </Scene3D.Canvas>

      {clickedObject && (
        <div className="mt-4 p-4 bg-blue-100 border border-blue-300 rounded">
          <p className="text-blue-800 font-semibold">
            You clicked: {clickedObject}
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * Simple Scene3D Example - Minimal setup
 */
export const SimpleScene3DExample: React.FC = () => {
  return (
    <Scene3D.Canvas height="400px">
      <Scene3D.Box position={[0, 0, 0]} color="#ff6b6b" animate />
    </Scene3D.Canvas>
  );
};

/**
 * Custom Lighting Example
 */
export const CustomLightingExample: React.FC = () => {
  return (
    <Scene3D.Canvas height="500px" backgroundColor="#000000">
      <Scene3D.Light type="ambient" intensity={0.2} />
      <Scene3D.Light type="directional" position={[10, 10, 5]} intensity={1} color="#ffffff" />
      <Scene3D.Light type="point" position={[-5, 5, 5]} intensity={0.8} color="#ff0000" />
      <Scene3D.Light type="point" position={[5, -5, 5]} intensity={0.8} color="#0000ff" />

      <Scene3D.Sphere position={[0, 0, 0]} radius={1.5} color="#ffffff" />
    </Scene3D.Canvas>
  );
};
