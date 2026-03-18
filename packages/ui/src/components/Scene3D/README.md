# Scene3D Component

A powerful 3D component library built on Three.js and React Three Fiber, providing an easy-to-use API for creating interactive 3D scenes in React applications.

## Features

- 🎨 Easy-to-use compound component pattern
- 🎮 Built-in orbit controls for camera navigation
- ✨ Interactive objects with hover and click events
- 🔄 Built-in animation support
- 🎯 TypeScript support with full type definitions
- 📦 Minimal setup required

## Installation

The Scene3D component is part of the `@vdailyapp/ui` package. Make sure you have the following peer dependencies installed:

```bash
npm install react react-dom three @react-three/fiber @react-three/drei
# or
pnpm add react react-dom three @react-three/fiber @react-three/drei
```

## Basic Usage

```tsx
import { Scene3D } from '@vdailyapp/ui';

function BasicExample() {
  return (
    <Scene3D.Canvas height="600px">
      <Scene3D.Box position={[0, 0, 0]} color="#ff0000" />
    </Scene3D.Canvas>
  );
}
```

## Components

### Scene3D.Canvas

The main container for 3D scenes.

**Props:**
- `width` (string | number): Canvas width - defaults to '100%'
- `height` (string | number): Canvas height - defaults to '400px'
- `cameraPosition` ([x, y, z]): Camera position - defaults to [0, 0, 5]
- `fov` (number): Camera field of view - defaults to 75
- `backgroundColor` (string): Background color - defaults to '#000000'
- `shadows` (boolean): Enable shadows - defaults to false
- `controls` (boolean): Enable orbit controls - defaults to true
- `className` (string): Additional CSS class

### Scene3D.Box

A 3D box/cube primitive.

**Props:**
- `position` ([x, y, z]): Position in 3D space - defaults to [0, 0, 0]
- `size` ([width, height, depth]): Box dimensions - defaults to [1, 1, 1]
- `color` (string): Box color - defaults to '#ffffff'
- `rotation` ([x, y, z]): Rotation in radians - defaults to [0, 0, 0]
- `animate` (boolean): Enable rotation animation - defaults to false
- `animationSpeed` (number): Animation speed - defaults to 0.01
- `onClick` (function): Click event handler
- `onPointerOver` (function): Hover event handler
- `onPointerOut` (function): Hover end event handler

### Scene3D.Sphere

A 3D sphere primitive.

**Props:**
- `position` ([x, y, z]): Position in 3D space - defaults to [0, 0, 0]
- `radius` (number): Sphere radius - defaults to 1
- `color` (string): Sphere color - defaults to '#ffffff'
- `rotation` ([x, y, z]): Rotation in radians - defaults to [0, 0, 0]
- `animate` (boolean): Enable rotation animation - defaults to false
- `animationSpeed` (number): Animation speed - defaults to 0.01
- `onClick` (function): Click event handler
- `onPointerOver` (function): Hover event handler
- `onPointerOut` (function): Hover end event handler

### Scene3D.Light

Light source for 3D scenes.

**Props:**
- `type` ('ambient' | 'directional' | 'point'): Light type - defaults to 'ambient'
- `position` ([x, y, z]): Light position (for directional and point lights)
- `intensity` (number): Light intensity - defaults to 1
- `color` (string): Light color - defaults to '#ffffff'

## Examples

### Interactive Scene with Multiple Objects

```tsx
import { Scene3D } from '@vdailyapp/ui';
import { useState } from 'react';

function InteractiveScene() {
  const [clicked, setClicked] = useState<string | null>(null);

  return (
    <div>
      <Scene3D.Canvas 
        height="600px" 
        cameraPosition={[0, 0, 8]}
        backgroundColor="#1a1a2e"
      >
        <Scene3D.Box 
          position={[-2, 0, 0]} 
          color="#ff0000" 
          animate
          onClick={() => setClicked('box')}
        />
        <Scene3D.Sphere 
          position={[2, 0, 0]} 
          color="#00ff00" 
          radius={1.2}
          animate
          animationSpeed={0.02}
          onClick={() => setClicked('sphere')}
        />
        <Scene3D.Light type="point" position={[5, 5, 5]} intensity={1.5} />
      </Scene3D.Canvas>
      {clicked && <p>You clicked: {clicked}</p>}
    </div>
  );
}
```

### Custom Lighting

```tsx
import { Scene3D } from '@vdailyapp/ui';

function CustomLighting() {
  return (
    <Scene3D.Canvas height="500px">
      <Scene3D.Light type="ambient" intensity={0.3} />
      <Scene3D.Light type="directional" position={[5, 5, 5]} intensity={1} color="#ffffff" />
      <Scene3D.Light type="point" position={[-5, -5, 5]} intensity={0.5} color="#ff00ff" />
      
      <Scene3D.Box position={[0, 0, 0]} color="#3498db" size={[2, 2, 2]} />
    </Scene3D.Canvas>
  );
}
```

### Animated Rotating Objects

```tsx
import { Scene3D } from '@vdailyapp/ui';

function AnimatedScene() {
  return (
    <Scene3D.Canvas height="600px" cameraPosition={[0, 0, 10]}>
      <Scene3D.Box 
        position={[-3, 0, 0]} 
        color="#e74c3c" 
        animate 
        animationSpeed={0.02}
      />
      <Scene3D.Box 
        position={[0, 0, 0]} 
        color="#f39c12" 
        animate 
        animationSpeed={0.01}
      />
      <Scene3D.Sphere 
        position={[3, 0, 0]} 
        color="#2ecc71" 
        animate 
        animationSpeed={0.015}
      />
    </Scene3D.Canvas>
  );
}
```

## Tips

1. **Camera Controls**: The default orbit controls allow users to rotate, zoom, and pan the camera using mouse interactions.

2. **Performance**: Keep the number of objects reasonable for better performance. Consider using instancing for many similar objects.

3. **Hover Effects**: Objects automatically become slightly transparent on hover for visual feedback.

4. **Animation**: Use the `animate` prop for automatic rotation animation, or use `useFrame` from `@react-three/fiber` for custom animations.

5. **Lighting**: The Canvas includes default ambient and directional lights. You can add more lights using `Scene3D.Light` for custom lighting setups.

## Browser Compatibility

Scene3D uses WebGL under the hood, so it requires a browser that supports WebGL. All modern browsers support WebGL.

## Related

- [Three.js Documentation](https://threejs.org/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Drei Helpers](https://github.com/pmndrs/drei)
