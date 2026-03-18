import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import type { ChartProps, ChartType } from './Chart.types';

/**
 * Common props shared across all chart types
 */
interface CommonChartProps {
  height: number;
  data: Array<Record<string, any>>;
  margin: { top: number; right: number; left: number; bottom: number };
}

/**
 * Renders a line chart component
 */
const renderLineChart = (
  commonProps: CommonChartProps,
  xDataKey: string,
  series: ChartProps['series'],
  showGrid: boolean,
  showTooltip: boolean,
  showLegend: boolean
) => (
  <LineChart {...commonProps}>
    {showGrid && <CartesianGrid strokeDasharray="3 3" />}
    <XAxis dataKey={xDataKey} />
    <YAxis />
    {showTooltip && <Tooltip />}
    {showLegend && <Legend />}
    {series?.map((item, index) => (
      <Line
        key={index}
        type="monotone"
        dataKey={item.dataKey}
        stroke={item.color}
        activeDot={{ r: 8 }}
      />
    ))}
  </LineChart>
);

/**
 * Renders a bar chart component
 */
const renderBarChart = (
  commonProps: CommonChartProps,
  xDataKey: string,
  series: ChartProps['series'],
  showGrid: boolean,
  showTooltip: boolean,
  showLegend: boolean,
  stackedBars: boolean
) => (
  <BarChart {...commonProps}>
    {showGrid && <CartesianGrid strokeDasharray="3 3" />}
    <XAxis dataKey={xDataKey} />
    <YAxis />
    {showTooltip && <Tooltip />}
    {showLegend && <Legend />}
    {series?.map((item, index) => (
      <Bar
        key={index}
        dataKey={item.dataKey}
        fill={item.color}
        stackId={stackedBars ? 'stack' : undefined}
      />
    ))}
  </BarChart>
);

/**
 * Renders an area chart component
 */
const renderAreaChart = (
  commonProps: CommonChartProps,
  xDataKey: string,
  series: ChartProps['series'],
  showGrid: boolean,
  showTooltip: boolean,
  showLegend: boolean,
  stackedBars: boolean
) => (
  <AreaChart {...commonProps}>
    {showGrid && <CartesianGrid strokeDasharray="3 3" />}
    <XAxis dataKey={xDataKey} />
    <YAxis />
    {showTooltip && <Tooltip />}
    {showLegend && <Legend />}
    {series?.map((item, index) => (
      <Area
        key={index}
        type="monotone"
        dataKey={item.dataKey}
        fill={item.color}
        stroke={item.color}
        stackId={stackedBars ? 'stack' : undefined}
      />
    ))}
  </AreaChart>
);

/**
 * Renders the appropriate chart based on the type
 */
export const renderChart = ({
  data = [],
  type = 'line' as ChartType,
  height = 400,
  xDataKey = 'name',
  series = [{ dataKey: 'value', color: '#8884d8' }],
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  stackedBars = false,
}: ChartProps): React.ReactElement | null => {
  const commonProps: CommonChartProps = {
    height,
    data,
    margin: { top: 20, right: 30, left: 20, bottom: 5 },
  };

  switch (type) {
    case 'line':
      return renderLineChart(commonProps, xDataKey, series, showGrid, showTooltip, showLegend);

    case 'bar':
      return renderBarChart(commonProps, xDataKey, series, showGrid, showTooltip, showLegend, stackedBars);

    case 'area':
      return renderAreaChart(commonProps, xDataKey, series, showGrid, showTooltip, showLegend, stackedBars);

    default:
      return null;
  }
};