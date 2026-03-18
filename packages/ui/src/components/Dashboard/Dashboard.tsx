import React, { forwardRef, ReactElement, Ref } from 'react';
import RGL, { Layout, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';

import { cn } from '../utils';

const ReactGridLayout = WidthProvider(RGL);

export type DashboardProps = {
  /** Array of layout objects that describe the position and size of each grid item */
  layout: Layout[];
  /** Number of columns in the grid */
  cols?: number;
  /** Row height in pixels */
  rowHeight?: number;
  /** Whether items can be dragged */
  isDraggable?: boolean;
  /** Whether items can be resized */
  isResizable?: boolean;
  /** Callback when layout changes */
  onLayoutChange?: (layout: Layout[]) => void;
  /** Children components to render in the grid */
  children?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Margin between items [x, y] in pixels */
  margin?: [number, number];
  /** Padding inside the container [x, y] in pixels */
  containerPadding?: [number, number];
  /** Compaction type */
  compactType?: 'vertical' | 'horizontal' | null;
};

/**
 * Dashboard component built on react-grid-layout for creating draggable and resizable grid layouts.
 *
 * @example
 * ```tsx
 * const layout = [
 *   { i: 'a', x: 0, y: 0, w: 1, h: 2 },
 *   { i: 'b', x: 1, y: 0, w: 3, h: 2 },
 *   { i: 'c', x: 4, y: 0, w: 1, h: 2 }
 * ];
 *
 * <Dashboard layout={layout} cols={12} rowHeight={30}>
 *   <div key="a">Widget A</div>
 *   <div key="b">Widget B</div>
 *   <div key="c">Widget C</div>
 * </Dashboard>
 * ```
 */
export const Dashboard = forwardRef(function Dashboard(
  {
    layout,
    cols = 12,
    rowHeight = 30,
    isDraggable = true,
    isResizable = true,
    onLayoutChange,
    children,
    className,
    margin = [10, 10],
    containerPadding = [10, 10],
    compactType = 'vertical',
    ...props
  }: DashboardProps,
  ref: Ref<HTMLDivElement>,
): ReactElement {
  return (
    <div ref={ref} className={cn('dashboard-container', className)}>
      <ReactGridLayout
        layout={layout}
        cols={cols}
        rowHeight={rowHeight}
        isDraggable={isDraggable}
        isResizable={isResizable}
        onLayoutChange={onLayoutChange}
        margin={margin}
        containerPadding={containerPadding}
        compactType={compactType}
        {...props}
      >
        {children}
      </ReactGridLayout>
    </div>
  );
});
