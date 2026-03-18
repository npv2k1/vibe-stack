/**
 * Chart component types and interfaces
 */

/**
 * Supported chart types
 */
export type ChartType = 'line' | 'bar' | 'area';

/**
 * Configuration for a single data series in the chart
 */
export interface ChartSeries {
  /** The key in the data object to use for this series */
  dataKey: string;
  /** The color to use for this series */
  color: string;
}

/**
 * Props for the Chart component
 */
export interface ChartProps {
  /** Array of data points to display in the chart */
  data?: Array<Record<string, any>>;
  /** Type of chart to render */
  type?: ChartType;
  /** Width of the chart container */
  width?: string | number;
  /** Height of the chart container */
  height?: number;
  /** Key in data objects to use for X-axis values */
  xDataKey?: string;
  /** Array of data series configurations */
  series?: ChartSeries[];
  /** Whether to show the grid lines */
  showGrid?: boolean;
  /** Whether to show the legend */
  showLegend?: boolean;
  /** Whether to show tooltips on hover */
  showTooltip?: boolean;
  /** Whether bars should be stacked (only applies to bar charts) */
  stackedBars?: boolean;
}
