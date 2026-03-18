# Flow Component

An interactive flow diagram component built on top of [@xyflow/react](https://reactflow.dev/) (ReactFlow) for creating node-based workflows, diagrams, and visual programming interfaces.

## Features

- 🎯 **Interactive Canvas**: Drag, zoom, and pan to navigate your flow
- 🔗 **Node Connections**: Connect nodes with draggable handles
- 🎨 **Customizable**: Custom node and edge types with full styling control
- 📱 **Responsive**: Works across different screen sizes
- 🌓 **Dark Mode**: Built-in dark mode support
- 🎮 **Controls**: Optional minimap, zoom controls, and background grid
- ⚡ **Performance**: Optimized for large diagrams with many nodes

## Installation

The Flow component is part of the `@vdailyapp/ui` package. Make sure you have the package installed:

```bash
pnpm add @vdailyapp/ui
```

Also import the required CSS:

```tsx
import '@vdailyapp/ui/styles.css';
```

## Basic Usage

```tsx
import { Flow } from '@vdailyapp/ui';

const nodes = [
  {
    id: '1',
    data: { label: 'Start', icon: '🚀' },
    position: { x: 0, y: 0 }
  },
  {
    id: '2',
    data: { label: 'Process', icon: '⚙️' },
    position: { x: 200, y: 100 }
  }
];

const edges = [
  { id: 'e1-2', source: '1', target: '2', animated: true }
];

function MyFlow() {
  return (
    <Flow.Canvas
      nodes={nodes}
      edges={edges}
      showControls
      showBackground
      fitView
    />
  );
}
```

## Components

### Flow.Canvas

The main canvas component that renders the flow diagram.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `nodes` | `FlowNode[]` | `[]` | Array of nodes to display |
| `edges` | `FlowEdge[]` | `[]` | Array of edges connecting nodes |
| `onNodesChange` | `OnNodesChange` | - | Callback when nodes change |
| `onEdgesChange` | `OnEdgesChange` | - | Callback when edges change |
| `onConnect` | `OnConnect` | - | Callback when nodes are connected |
| `onNodeClick` | `(event, node) => void` | - | Callback when a node is clicked |
| `onEdgeClick` | `(event, edge) => void` | - | Callback when an edge is clicked |
| `nodeTypes` | `Record<string, Component>` | - | Custom node type components |
| `edgeTypes` | `Record<string, Component>` | - | Custom edge type components |
| `className` | `string` | - | Additional CSS classes |
| `zoomOnScroll` | `boolean` | `true` | Enable zooming with scroll |
| `panOnScroll` | `boolean` | `true` | Enable panning with scroll |
| `nodesDraggable` | `boolean` | `true` | Allow dragging nodes |
| `nodesConnectable` | `boolean` | `true` | Allow connecting nodes |
| `elementsSelectable` | `boolean` | `true` | Allow selecting elements |
| `fitView` | `boolean` | `false` | Fit view to content on load |
| `showMiniMap` | `boolean` | `false` | Show minimap for navigation |
| `showControls` | `boolean` | `true` | Show zoom and fit controls |
| `showBackground` | `boolean` | `true` | Show background grid |
| `backgroundVariant` | `'dots' \| 'lines' \| 'cross'` | `'dots'` | Background pattern style |
| `height` | `string \| number` | `'500px'` | Canvas height |
| `width` | `string \| number` | `'100%'` | Canvas width |

### Flow.Node

Custom node component for rendering nodes with consistent styling.

### Flow.Edge

Custom edge component for rendering connections between nodes.

## Advanced Usage

### Custom Node Types

```tsx
import { Flow } from '@vdailyapp/ui';
import { Handle, Position } from '@xyflow/react';

function CustomNode({ data }) {
  return (
    <div className="p-4 bg-purple-500 text-white rounded-lg">
      <Handle type="target" position={Position.Top} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

const nodeTypes = {
  custom: CustomNode,
};

function MyFlow() {
  const nodes = [
    { id: '1', type: 'custom', data: { label: 'Custom' }, position: { x: 0, y: 0 } }
  ];

  return <Flow.Canvas nodes={nodes} nodeTypes={nodeTypes} />;
}
```

### Controlled State

```tsx
import { Flow } from '@vdailyapp/ui';
import { useState, useCallback } from 'react';
import { Connection, addEdge } from '@xyflow/react';

function MyFlow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const handleConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, []);

  return (
    <Flow.Canvas
      nodes={nodes}
      edges={edges}
      onConnect={handleConnect}
    />
  );
}
```

### Custom Styling

```tsx
const nodes = [
  {
    id: '1',
    data: { label: 'Styled Node' },
    position: { x: 0, y: 0 },
    style: {
      background: '#ff6b6b',
      color: 'white',
      border: '2px solid #ee5a6f',
    },
  },
];

const edges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    style: { stroke: '#ff6b6b' },
    label: 'Custom Edge',
  },
];
```

## Types

### FlowNode

```tsx
interface FlowNode {
  id: string;
  type?: string;
  data: {
    label?: string;
    description?: string;
    icon?: string;
    [key: string]: any;
  };
  position: { x: number; y: number };
  className?: string;
  style?: React.CSSProperties;
}
```

### FlowEdge

```tsx
interface FlowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  label?: string;
  animated?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
```

## Examples

See `FlowExample.tsx` for a complete working example with:
- Multiple nodes with custom icons and descriptions
- Animated edges with labels
- Event handlers for node and edge clicks
- Minimap and controls
- Background grid

## Dependencies

- `@xyflow/react` ^12.7.0 - The underlying React Flow library

## Related Components

- **Kanban** - For task board layouts
- **Dashboard** - For grid-based layouts
- **Table** - For tabular data display

## Resources

- [ReactFlow Documentation](https://reactflow.dev/)
- [ReactFlow Examples](https://reactflow.dev/examples)
- [ReactFlow API Reference](https://reactflow.dev/api-reference)
