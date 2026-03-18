import { FlowCanvas } from './FlowCanvas';
import { FlowNode } from './FlowNode';
import { FlowEdge } from './FlowEdge';

export * from './Flow.types';

/**
 * Flow component for creating interactive node-based diagrams and workflows
 * 
 * @example
 * ```tsx
 * import { Flow } from '@vdailyapp/ui';
 * 
 * const nodes = [
 *   {
 *     id: '1',
 *     data: { label: 'Start', icon: '🚀' },
 *     position: { x: 0, y: 0 }
 *   },
 *   {
 *     id: '2',
 *     data: { label: 'Process', icon: '⚙️' },
 *     position: { x: 200, y: 100 }
 *   },
 *   {
 *     id: '3',
 *     data: { label: 'End', icon: '🏁' },
 *     position: { x: 400, y: 0 }
 *   }
 * ];
 * 
 * const edges = [
 *   { id: 'e1-2', source: '1', target: '2', animated: true },
 *   { id: 'e2-3', source: '2', target: '3', label: 'Complete' }
 * ];
 * 
 * function MyFlow() {
 *   const handleConnect = (connection) => {
 *     console.log('New connection:', connection);
 *   };
 * 
 *   return (
 *     <Flow.Canvas
 *       nodes={nodes}
 *       edges={edges}
 *       onConnect={handleConnect}
 *       showControls
 *       showBackground
 *       fitView
 *     />
 *   );
 * }
 * ```
 */
export const Flow = {
  /**
   * Main Flow canvas component with ReactFlow wrapper
   */
  Canvas: FlowCanvas,
  
  /**
   * Custom node component for rendering nodes
   */
  Node: FlowNode,
  
  /**
   * Custom edge component for rendering connections
   */
  Edge: FlowEdge,
};
