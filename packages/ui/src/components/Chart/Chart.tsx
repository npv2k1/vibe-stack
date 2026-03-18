import React from 'react';
import { ResponsiveContainer } from 'recharts';
import { renderChart } from './ChartRenderer';
import type { ChartProps } from './Chart.types';

/**
 * A flexible chart component that supports line, bar, and area charts using Recharts.
 *
 * @example
 * ```tsx
 * <Chart
 *   data={[
 *     { name: 'Jan', value: 400 },
 *     { name: 'Feb', value: 300 },
 *   ]}
 *   type="line"
 *   series={[{ dataKey: 'value', color: '#8884d8' }]}
 * />
 * ```
 */
export const Chart: React.FC<ChartProps> = ({
  data = [],
  type = 'line',
  width = '100%',
  height = 400,
  xDataKey = 'name',
  series = [{ dataKey: 'value', color: '#8884d8' }],
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  stackedBars = false,
}) => {
  const chartElement = renderChart({
    data,
    type,
    height,
    xDataKey,
    series,
    showGrid,
    showLegend,
    showTooltip,
    stackedBars,
  });

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width={width} height={height}>
        {chartElement || <div>No chart type specified</div>}
      </ResponsiveContainer>
    </div>
  );
};
