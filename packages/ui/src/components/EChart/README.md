# EChart Component

A React wrapper component for Apache ECharts, built using `echarts-for-react`.

## Installation

The component is part of the `@vdailyapp/ui` package. Make sure you have installed the required dependencies:

```bash
pnpm add echarts echarts-for-react
```

## Usage

### Basic Example

```tsx
import { EChart } from '@vdailyapp/ui';
import type { EChartsOption } from 'echarts';

const option: EChartsOption = {
  title: {
    text: 'Sales Data',
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
    },
  ],
};

function App() {
  return <EChart option={option} height={400} />;
}
```

### With Custom Styling

```tsx
<EChart
  option={option}
  height="500px"
  width="100%"
  className="custom-chart"
  style={{ border: '1px solid #ccc' }}
/>
```

### With Loading State

```tsx
<EChart
  option={option}
  showLoading={true}
  loadingOption={{
    text: 'Loading...',
    color: '#4413c2',
  }}
/>
```

### With Event Handlers

```tsx
const onEvents = {
  click: (params: any) => {
    console.log('Chart clicked:', params);
  },
  legendselectchanged: (params: any) => {
    console.log('Legend selection changed:', params);
  },
};

<EChart option={option} onEvents={onEvents} />;
```

### With Chart Instance Reference

```tsx
import { useRef } from 'react';
import ReactECharts from 'echarts-for-react';

function App() {
  const chartRef = useRef<ReactECharts>(null);

  const handleExport = () => {
    const chart = chartRef.current?.getEchartsInstance();
    if (chart) {
      const img = chart.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#fff',
      });
      // Do something with the image
    }
  };

  return (
    <>
      <EChart ref={chartRef} option={option} />
      <button onClick={handleExport}>Export Chart</button>
    </>
  );
}
```

## Props

| Prop            | Type                                     | Default     | Description                                        |
| --------------- | ---------------------------------------- | ----------- | -------------------------------------------------- |
| option          | `EChartsOption`                          | (required)  | ECharts option configuration                       |
| className       | `string`                                 | -           | Additional CSS class name                          |
| style           | `React.CSSProperties`                    | -           | Chart style object                                 |
| height          | `string \| number`                       | `'400px'`   | Chart height                                       |
| width           | `string \| number`                       | `'100%'`    | Chart width                                        |
| showLoading     | `boolean`                                | `false`     | Whether to show loading indicator                  |
| loadingOption   | `object`                                 | -           | Loading option configuration                       |
| theme           | `string \| object`                       | -           | Chart theme                                        |
| notMerge        | `boolean`                                | `false`     | Whether to enable chart resize on window resize    |
| lazyUpdate      | `boolean`                                | `false`     | Whether to lazy update                             |
| onChartReady    | `(chart: any) => void`                   | -           | Callback when chart is ready                       |
| onEvents        | `Record<string, (params: any) => void>`  | -           | Event handlers for chart events                    |

## Chart Types Supported

EChart supports all chart types provided by Apache ECharts, including:

- **Line Chart**: For trends and time series data
- **Bar Chart**: For comparing values across categories
- **Pie Chart**: For showing proportions
- **Scatter Chart**: For correlation analysis
- **Area Chart**: For cumulative data visualization
- **Radar Chart**: For multivariate data
- **Candlestick**: For financial data
- **Heatmap**: For matrix data
- **Graph**: For network/relationship data
- And many more...

## Resources

- [Apache ECharts Documentation](https://echarts.apache.org/en/index.html)
- [ECharts Examples](https://echarts.apache.org/examples/en/index.html)
- [echarts-for-react](https://github.com/hustcc/echarts-for-react)

## See Also

- Check the Storybook examples for more usage patterns
- View the Chart component (based on Recharts) for an alternative charting solution
