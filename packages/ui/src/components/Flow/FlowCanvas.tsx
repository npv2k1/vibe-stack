import React, { forwardRef, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { cn } from '../utils';
import { FlowCanvasProps, FlowNode, FlowEdge } from './Flow.types';

/**
 * Main Flow Canvas component with ReactFlow wrapper
 * 
 * @example
 * ```tsx
 * const nodes = [
 *   { id: '1', data: { label: 'Node 1' }, position: { x: 0, y: 0 } },
 *   { id: '2', data: { label: 'Node 2' }, position: { x: 200, y: 0 } }
 * ];
 * 
 * const edges = [
 *   { id: 'e1-2', source: '1', target: '2' }
 * ];
 * 
 * <Flow.Canvas
 *   nodes={nodes}
 *   edges={edges}
 *   onConnect={(connection) => console.log('Connected:', connection)}
 * />
 * ```
 */
export const FlowCanvas = forwardRef<HTMLDivElement, FlowCanvasProps>(function FlowCanvas(
  {
    nodes: nodesProp = [],
    edges: edgesProp = [],
    onNodesChange: onNodesChangeProp,
    onEdgesChange: onEdgesChangeProp,
    onConnect: onConnectProp,
    onNodeClick,
    onEdgeClick,
    nodeTypes,
    edgeTypes,
    className,
    zoomOnScroll = true,
    panOnScroll = true,
    nodesDraggable = true,
    nodesConnectable = true,
    elementsSelectable = true,
    fitView = false,
    showMiniMap = false,
    showControls = true,
    showBackground = true,
    backgroundVariant = 'dots',
    height = '500px',
    width = '100%',
  },
  ref
) {
  // Use internal state if no external handlers are provided
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>(nodesProp);
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>(edgesProp);

  // Use external handlers if provided, otherwise use internal state handlers
  const handleNodesChange = onNodesChangeProp || onNodesChange;
  const handleEdgesChange = onEdgesChangeProp || onEdgesChange;

  // Handle new connections
  const handleConnect = useCallback(
    (connection: any) => {
      if (onConnectProp) {
        onConnectProp(connection);
      } else {
        setEdges((eds) => addEdge(connection, eds));
      }
    },
    [onConnectProp, setEdges]
  );

  // Sync external nodes and edges with internal state
  React.useEffect(() => {
    setNodes(nodesProp);
  }, [nodesProp, setNodes]);

  React.useEffect(() => {
    setEdges(edgesProp);
  }, [edgesProp, setEdges]);

  return (
    <div
      ref={ref}
      className={cn('border border-gray-300 rounded-lg overflow-hidden', className)}
      style={{ height, width }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes as any}
        edgeTypes={edgeTypes as any}
        zoomOnScroll={zoomOnScroll}
        panOnScroll={panOnScroll}
        nodesDraggable={nodesDraggable}
        nodesConnectable={nodesConnectable}
        elementsSelectable={elementsSelectable}
        fitView={fitView}
        fitViewOptions={{ padding: 0.2 }}
      >
        {showBackground && (
          <Background
            variant={backgroundVariant as any}
            gap={12}
            size={1}
          />
        )}
        {showControls && <Controls />}
        {showMiniMap && (
          <MiniMap
            nodeStrokeWidth={3}
            zoomable
            pannable
          />
        )}
      </ReactFlow>
    </div>
  );
});

FlowCanvas.displayName = 'FlowCanvas';
