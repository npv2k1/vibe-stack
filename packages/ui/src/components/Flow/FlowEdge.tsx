import React, { memo } from 'react';
import { BaseEdge, EdgeLabelRenderer, getStraightPath } from '@xyflow/react';
import { cn } from '../utils';
import { FlowEdgeComponentProps } from './Flow.types';

/**
 * Custom Flow Edge component
 * 
 * @example
 * ```tsx
 * const edgeTypes = {
 *   custom: FlowEdge,
 * };
 * 
 * const edges = [
 *   {
 *     id: 'e1-2',
 *     source: '1',
 *     target: '2',
 *     type: 'custom',
 *     label: 'Custom Edge'
 *   }
 * ];
 * 
 * <Flow.Canvas edges={edges} edgeTypes={edgeTypes} />
 * ```
 */
export const FlowEdge = memo<FlowEdgeComponentProps>(function FlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
  style = {},
  markerEnd,
  className,
}) {
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={style}
        className={cn('stroke-gray-400 dark:stroke-gray-500', className)}
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className={cn(
              'nodrag nopan px-2 py-1 text-xs bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 shadow-sm',
              'text-gray-700 dark:text-gray-300'
            )}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
});

FlowEdge.displayName = 'FlowEdge';
