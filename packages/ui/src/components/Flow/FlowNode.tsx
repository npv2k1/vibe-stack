import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { cn } from '../utils';
import { FlowNodeComponentProps } from './Flow.types';

/**
 * Custom Flow Node component
 * 
 * @example
 * ```tsx
 * const nodeTypes = {
 *   custom: FlowNode,
 * };
 * 
 * const nodes = [
 *   {
 *     id: '1',
 *     type: 'custom',
 *     data: { label: 'Custom Node', description: 'This is a custom node' },
 *     position: { x: 0, y: 0 }
 *   }
 * ];
 * 
 * <Flow.Canvas nodes={nodes} nodeTypes={nodeTypes} />
 * ```
 */
export const FlowNode = memo<FlowNodeComponentProps>(function FlowNode({
  data,
  isConnectable,
  className,
  renderContent,
}) {
  const content = renderContent ? (
    renderContent(data as any)
  ) : (
    <div className="space-y-1">
      {data.icon && (
        <div className="flex items-center justify-center text-blue-500 mb-2">
          <span className="text-2xl">{data.icon}</span>
        </div>
      )}
      {data.label && (
        <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">
          {data.label}
        </div>
      )}
      {data.description && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {data.description}
        </div>
      )}
    </div>
  );

  return (
    <div
      className={cn(
        'px-4 py-3 shadow-md rounded-lg bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600',
        'min-w-[150px] max-w-[250px]',
        className
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-blue-500"
      />
      {content}
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-blue-500"
      />
    </div>
  );
});

FlowNode.displayName = 'FlowNode';
