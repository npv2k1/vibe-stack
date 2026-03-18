import React, { forwardRef, Ref } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

import { cn } from '../utils';

export interface EChartProps {
  /**
   * ECharts option configuration
   */
  option: EChartsOption;
  /**
   * Additional CSS class name
   */
  className?: string;
  /**
   * Chart style object
   */
  style?: React.CSSProperties;
  /**
   * Chart height
   * @default '400px'
   */
  height?: string | number;
  /**
   * Chart width
   * @default '100%'
   */
  width?: string | number;
  /**
   * Whether to show loading indicator
   * @default false
   */
  showLoading?: boolean;
  /**
   * Loading option configuration
   */
  loadingOption?: object;
  /**
   * Chart theme
   * @default undefined
   */
  theme?: string | object;
  /**
   * Whether to enable chart resize on window resize
   * @default true
   */
  notMerge?: boolean;
  /**
   * Whether to lazy update
   * @default false
   */
  lazyUpdate?: boolean;
  /**
   * Callback when chart is ready
   */
  onChartReady?: (chart: any) => void;
  /**
   * Event handlers for chart events
   */
  onEvents?: Record<string, (params: any) => void>;
}

/**
 * A React wrapper component for ECharts, providing a simple interface to render
 * interactive charts using Apache ECharts.
 * https://echarts.apache.org/examples
 *
 * @param props - The props for the EChart component
 * @param ref - Forwarded ref to the underlying ReactECharts instance
 * @returns A React element containing the ECharts chart
 *
 * @example
 * ```tsx
 * const option = {
 *   title: { text: 'Sample Chart' },
 *   xAxis: { type: 'category', data: ['A', 'B', 'C'] },
 *   yAxis: { type: 'value' },
 *   series: [{ data: [120, 200, 150], type: 'bar' }]
 * };
 *
 * <EChart option={option} height="400px" />
 * ```
 */

export const EChart = forwardRef(function EChart(
  {
    option,
    className,
    style,
    height = '400px',
    width = '100%',
    showLoading = false,
    loadingOption,
    theme,
    notMerge = false,
    lazyUpdate = false,
    onChartReady,
    onEvents,
  }: EChartProps,
  ref: Ref<ReactECharts>,
) {
  const containerStyle: React.CSSProperties = {
    height,
    width,
    ...style,
  };

  return (
    <div className={cn('echart-container', className)} style={containerStyle}>
      <ReactECharts
        ref={ref}
        option={option}
        style={{ height: '100%', width: '100%' }}
        showLoading={showLoading}
        loadingOption={loadingOption}
        theme={theme}
        notMerge={notMerge}
        lazyUpdate={lazyUpdate}
        onChartReady={onChartReady}
        onEvents={onEvents}
      />
    </div>
  );
});
