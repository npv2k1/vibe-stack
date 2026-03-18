import { ReactNode } from 'react';
import {
  Node as XYFlowNode,
  Edge as XYFlowEdge,
  NodeProps as XYFlowNodeProps,
  EdgeProps as XYFlowEdgeProps,
  Connection,
  NodeChange,
  EdgeChange,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from '@xyflow/react';

/**
 * Represents a node in the Flow diagram
 */
export interface FlowNode extends XYFlowNode {
  /**
   * Unique identifier for the node
   */
  id: string;

  /**
   * Node type (e.g., 'default', 'input', 'output', custom types)
   */
  type?: string;

  /**
   * Node data containing custom properties
   */
  data: {
    /**
     * Label or title of the node
     */
    label?: string;

    /**
     * Optional description
     */
    description?: string;

    /**
     * Optional icon name
     */
    icon?: string;

    /**
     * Custom data
     */
    [key: string]: any;
  };

  /**
   * Position of the node on the canvas
   */
  position: {
    x: number;
    y: number;
  };

  /**
   * Optional CSS classes for the node
   */
  className?: string;

  /**
   * Optional inline styles
   */
  style?: React.CSSProperties;
}

/**
 * Represents an edge (connection) between nodes
 */
export interface FlowEdge extends XYFlowEdge {
  /**
   * Unique identifier for the edge
   */
  id: string;

  /**
   * Source node ID
   */
  source: string;

  /**
   * Target node ID
   */
  target: string;

  /**
   * Edge type (e.g., 'default', 'straight', 'step', 'smoothstep')
   */
  type?: string;

  /**
   * Optional label for the edge
   */
  label?: string;

  /**
   * Optional animated edge
   */
  animated?: boolean;

  /**
   * Optional CSS classes for the edge
   */
  className?: string;

  /**
   * Optional inline styles
   */
  style?: React.CSSProperties;
}

/**
 * Props for the Flow Canvas component
 */
export interface FlowCanvasProps {
  /**
   * Nodes to display in the flow
   */
  nodes: FlowNode[];

  /**
   * Edges connecting the nodes
   */
  edges: FlowEdge[];

  /**
   * Callback when nodes change (position, selection, etc.)
   */
  onNodesChange?: OnNodesChange<FlowNode>;

  /**
   * Callback when edges change (selection, removal, etc.)
   */
  onEdgesChange?: OnEdgesChange<FlowEdge>;

  /**
   * Callback when a new connection is created
   */
  onConnect?: OnConnect;

  /**
   * Callback when a node is clicked
   */
  onNodeClick?: (event: React.MouseEvent, node: FlowNode) => void;

  /**
   * Callback when an edge is clicked
   */
  onEdgeClick?: (event: React.MouseEvent, edge: FlowEdge) => void;

  /**
   * Custom node types mapping
   */
  nodeTypes?: Record<string, React.ComponentType<XYFlowNodeProps>>;

  /**
   * Custom edge types mapping
   */
  edgeTypes?: Record<string, React.ComponentType<XYFlowEdgeProps>>;

  /**
   * Additional CSS classes for the canvas container
   */
  className?: string;

  /**
   * Enable/disable zooming
   * @default true
   */
  zoomOnScroll?: boolean;

  /**
   * Enable/disable panning
   * @default true
   */
  panOnScroll?: boolean;

  /**
   * Enable/disable dragging nodes
   * @default true
   */
  nodesDraggable?: boolean;

  /**
   * Enable/disable connecting nodes
   * @default true
   */
  nodesConnectable?: boolean;

  /**
   * Enable/disable node selection
   * @default true
   */
  elementsSelectable?: boolean;

  /**
   * Fit view on load
   * @default false
   */
  fitView?: boolean;

  /**
   * Show minimap
   * @default false
   */
  showMiniMap?: boolean;

  /**
   * Show controls (zoom, fit view)
   * @default true
   */
  showControls?: boolean;

  /**
   * Show background
   * @default true
   */
  showBackground?: boolean;

  /**
   * Background variant ('dots' | 'lines' | 'cross')
   * @default 'dots'
   */
  backgroundVariant?: 'dots' | 'lines' | 'cross';

  /**
   * Height of the canvas
   * @default '500px'
   */
  height?: string | number;

  /**
   * Width of the canvas
   * @default '100%'
   */
  width?: string | number;
}

/**
 * Props for custom Flow Node component
 */
export interface FlowNodeComponentProps extends XYFlowNodeProps<FlowNode> {
  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Custom render function for node content
   */
  renderContent?: (node: FlowNode) => ReactNode;
}

/**
 * Props for custom Flow Edge component
 */
export interface FlowEdgeComponentProps extends XYFlowEdgeProps<FlowEdge> {
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Export XYFlow types for advanced usage
 */
export type {
  Connection,
  NodeChange,
  EdgeChange,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
};
