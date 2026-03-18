import React, { useCallback, useState } from 'react';
import { Flow } from './index';
import { FlowNode, FlowEdge } from './Flow.types';
import { Connection } from '@xyflow/react';

const initialNodes: FlowNode[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Start', icon: '🚀', description: 'Begin workflow' },
    position: { x: 250, y: 0 },
  },
  {
    id: '2',
    data: { label: 'Process Data', icon: '⚙️', description: 'Transform input' },
    position: { x: 250, y: 100 },
  },
  {
    id: '3',
    data: { label: 'Validate', icon: '✓', description: 'Check quality' },
    position: { x: 100, y: 200 },
  },
  {
    id: '4',
    data: { label: 'Store', icon: '💾', description: 'Save results' },
    position: { x: 400, y: 200 },
  },
  {
    id: '5',
    type: 'output',
    data: { label: 'End', icon: '🏁', description: 'Complete workflow' },
    position: { x: 250, y: 300 },
  },
];

const initialEdges: FlowEdge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', label: 'Check' },
  { id: 'e2-4', source: '2', target: '4', label: 'Store' },
  { id: 'e3-5', source: '3', target: '5' },
  { id: 'e4-5', source: '4', target: '5' },
];

/**
 * Example usage of Flow component
 */
export function FlowExample() {
  const [nodes, setNodes] = useState<FlowNode[]>(initialNodes);
  const [edges, setEdges] = useState<FlowEdge[]>(initialEdges);

  const handleConnect = useCallback(
    (connection: Connection) => {
      const newEdge: FlowEdge = {
        id: `e${connection.source}-${connection.target}`,
        source: connection.source!,
        target: connection.target!,
        animated: true,
      };
      setEdges((eds) => [...eds, newEdge]);
    },
    []
  );

  const handleNodeClick = useCallback((_event: React.MouseEvent, node: FlowNode) => {
    console.log('Node clicked:', node);
  }, []);

  const handleEdgeClick = useCallback((_event: React.MouseEvent, edge: FlowEdge) => {
    console.log('Edge clicked:', edge);
  }, []);

  return (
    <div className="p-6 space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Flow Component Example</h2>
        <p className="text-gray-600 dark:text-gray-400">
          An interactive flow diagram with draggable nodes and connectable edges.
        </p>
      </div>
      
      <Flow.Canvas
        nodes={nodes}
        edges={edges}
        onConnect={handleConnect}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        showControls
        showBackground
        showMiniMap
        fitView
        height="600px"
        className="bg-gray-50 dark:bg-gray-900"
      />

      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold mb-2">Features:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <li>Drag nodes to reposition them</li>
          <li>Connect nodes by dragging from handles</li>
          <li>Zoom in/out with mouse wheel</li>
          <li>Pan by dragging the canvas</li>
          <li>Click nodes and edges to see console logs</li>
        </ul>
      </div>
    </div>
  );
}
