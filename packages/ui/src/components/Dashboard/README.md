# Dashboard Component

A flexible and interactive dashboard component built on top of `react-grid-layout` that enables creating draggable and resizable grid layouts for building customizable dashboards.

## Features

- ✨ Draggable grid items
- 📏 Resizable widgets
- 🎯 Configurable layout
- 📱 Responsive width handling
- 🔒 Static items support
- 👁️ Read-only mode
- 📊 Layout persistence via callbacks
- 🎨 Customizable styling
- 📝 Full TypeScript support

## Installation

The Dashboard component is part of the `@vdailyapp/ui` package:

```bash
npm install @vdailyapp/ui
# or
pnpm add @vdailyapp/ui
```

## Basic Usage

```tsx
import { Dashboard } from '@vdailyapp/ui';
import '@vdailyapp/ui/styles.css';

const layout = [
  { i: 'a', x: 0, y: 0, w: 1, h: 2 },
  { i: 'b', x: 1, y: 0, w: 3, h: 2 },
  { i: 'c', x: 4, y: 0, w: 1, h: 2 },
];

function MyDashboard() {
  return (
    <Dashboard layout={layout} cols={12} rowHeight={30}>
      <div key="a">Widget A</div>
      <div key="b">Widget B</div>
      <div key="c">Widget C</div>
    </Dashboard>
  );
}
```

## Props

| Prop               | Type                                 | Default      | Description                                                            |
| ------------------ | ------------------------------------ | ------------ | ---------------------------------------------------------------------- |
| `layout`           | `Layout[]`                           | **required** | Array of layout objects describing position and size of each grid item |
| `cols`             | `number`                             | `12`         | Number of columns in the grid                                          |
| `rowHeight`        | `number`                             | `30`         | Row height in pixels                                                   |
| `isDraggable`      | `boolean`                            | `true`       | Whether items can be dragged                                           |
| `isResizable`      | `boolean`                            | `true`       | Whether items can be resized                                           |
| `onLayoutChange`   | `(layout: Layout[]) => void`         | `undefined`  | Callback when layout changes                                           |
| `children`         | `React.ReactNode`                    | `undefined`  | Children components to render in the grid                              |
| `className`        | `string`                             | `undefined`  | Additional CSS classes                                                 |
| `margin`           | `[number, number]`                   | `[10, 10]`   | Margin between items [x, y] in pixels                                  |
| `containerPadding` | `[number, number]`                   | `[10, 10]`   | Padding inside the container [x, y] in pixels                          |
| `compactType`      | `'vertical' \| 'horizontal' \| null` | `'vertical'` | Compaction type                                                        |

## Layout Object

Each layout object has the following structure:

```typescript
{
  i: string;      // Unique identifier (must match child key)
  x: number;      // X position in grid units
  y: number;      // Y position in grid units
  w: number;      // Width in grid units
  h: number;      // Height in grid units
  static?: boolean; // Whether the item is static (cannot be moved/resized)
}
```

## Examples

### Interactive Dashboard with State

```tsx
import { Dashboard } from '@vdailyapp/ui';
import { useState } from 'react';
import type { Layout } from 'react-grid-layout';

function InteractiveDashboard() {
  const [layout, setLayout] = useState<Layout[]>([
    { i: 'stats', x: 0, y: 0, w: 4, h: 2 },
    { i: 'chart', x: 4, y: 0, w: 8, h: 4 },
    { i: 'activity', x: 0, y: 2, w: 4, h: 2 },
  ]);

  return (
    <Dashboard
      layout={layout}
      cols={12}
      rowHeight={50}
      onLayoutChange={setLayout}
    >
      <div key="stats" className="bg-blue-100 p-4 rounded">
        <h3>Statistics</h3>
      </div>
      <div key="chart" className="bg-green-100 p-4 rounded">
        <h3>Chart</h3>
      </div>
      <div key="activity" className="bg-purple-100 p-4 rounded">
        <h3>Recent Activity</h3>
      </div>
    </Dashboard>
  );
}
```

### Read-Only Dashboard

```tsx
<Dashboard
  layout={layout}
  cols={12}
  rowHeight={40}
  isDraggable={false}
  isResizable={false}
>
  {/* children */}
</Dashboard>
```

### Dashboard with Static Items

```tsx
const layout = [
  { i: 'header', x: 0, y: 0, w: 12, h: 1, static: true }, // Fixed header
  { i: 'widget1', x: 0, y: 1, w: 6, h: 2 }, // Draggable
  { i: 'widget2', x: 6, y: 1, w: 6, h: 2 }, // Draggable
];

<Dashboard layout={layout} cols={12} rowHeight={50}>
  <div key="header">Fixed Header</div>
  <div key="widget1">Widget 1</div>
  <div key="widget2">Widget 2</div>
</Dashboard>;
```

### Persisting Layout to LocalStorage

```tsx
function PersistentDashboard() {
  const [layout, setLayout] = useState<Layout[]>(() => {
    const saved = localStorage.getItem('dashboard-layout');
    return saved ? JSON.parse(saved) : defaultLayout;
  });

  const handleLayoutChange = (newLayout: Layout[]) => {
    setLayout(newLayout);
    localStorage.setItem('dashboard-layout', JSON.stringify(newLayout));
  };

  return (
    <Dashboard
      layout={layout}
      cols={12}
      rowHeight={50}
      onLayoutChange={handleLayoutChange}
    >
      {/* children */}
    </Dashboard>
  );
}
```

## Styling

The Dashboard component uses the react-grid-layout CSS which is automatically imported. You can customize the appearance of individual widgets using Tailwind CSS or custom CSS:

```tsx
<Dashboard layout={layout}>
  <div
    key="widget1"
    className="bg-white shadow-lg rounded-lg p-4 border border-gray-200"
  >
    <h3 className="font-bold text-lg mb-2">Custom Styled Widget</h3>
    <p>Content goes here</p>
  </div>
</Dashboard>
```

## TypeScript Support

The component is fully typed with TypeScript:

```typescript
import type { DashboardProps } from '@vdailyapp/ui';
import type { Layout } from 'react-grid-layout';

// All types are exported and available for use
```

## Demo

To see the Dashboard component in action:

1. **Storybook**: Run `pnpm storybook` and navigate to UI/Dashboard
2. **Demo Page**: Access `/dashboard-demo` in the web app

## Notes

- Each child element must have a `key` prop that matches the `i` property in the layout
- The component uses `WidthProvider` from react-grid-layout to automatically handle responsive widths
- Grid items will automatically compact according to the `compactType` setting
- The `onLayoutChange` callback is useful for persisting layout changes

## Related Components

- `Card` - For creating card-based widgets
- `Chart` - For adding charts to dashboard widgets
- `ResizableBox` - For custom resizable containers

## License

MIT
