# Breadcrumb Component

A flexible breadcrumb navigation component for React applications with support for automatic route detection, icons, hover previews, and copy-to-clipboard functionality.

## Features

- 🎯 **Auto Route Detection**: Automatically reads routes from React Router, Next.js, or custom configuration
- 🎨 **Icon Support**: Add icons to breadcrumb items
- 👁️ **Hover Preview**: Show additional information on hover
- 📋 **Copy Route**: Copy route paths to clipboard
- 🎭 **Compound Pattern**: Use as compound components or with items prop
- 🌗 **Dark Mode**: Full dark mode support
- ♿ **Accessible**: ARIA-compliant navigation structure

## Installation

The component is part of the `@vdailyapp/ui` package.

```bash
npm install @vdailyapp/ui
# or
pnpm add @vdailyapp/ui
# or
yarn add @vdailyapp/ui
```

## Basic Usage

### Using Items Prop

```tsx
import { Breadcrumb } from '@vdailyapp/ui';

function MyComponent() {
  const items = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Details', path: '/products/123' }
  ];

  return <Breadcrumb items={items} />;
}
```

### Using Compound Components

```tsx
import { Breadcrumb } from '@vdailyapp/ui';

function MyComponent() {
  return (
    <Breadcrumb>
      <Breadcrumb.Item label="Home" path="/" />
      <Breadcrumb.Item label="Products" path="/products" />
      <Breadcrumb.Item label="Details" path="/products/123" />
    </Breadcrumb>
  );
}
```

## Advanced Usage

### With Icons

```tsx
import { Breadcrumb } from '@vdailyapp/ui';
import { Home, Package, Info } from 'lucide-react';

function MyComponent() {
  const items = [
    { label: 'Home', path: '/', icon: <Home size={16} /> },
    { label: 'Products', path: '/products', icon: <Package size={16} /> },
    { label: 'Details', path: '/products/123', icon: <Info size={16} /> }
  ];

  return <Breadcrumb items={items} />;
}
```

### With Hover Preview

```tsx
import { Breadcrumb } from '@vdailyapp/ui';

function MyComponent() {
  const items = [
    { 
      label: 'Home', 
      path: '/',
      preview: 'Navigate to home page'
    },
    { 
      label: 'Products', 
      path: '/products',
      preview: 'Browse all products'
    },
    { 
      label: 'Details', 
      path: '/products/123',
      preview: <div><strong>Product ID:</strong> 123</div>
    }
  ];

  return <Breadcrumb items={items} />;
}
```

### Auto-Generate from Router

```tsx
import { Breadcrumb, useBreadcrumbs } from '@vdailyapp/ui';

function MyComponent() {
  // Automatically generates breadcrumbs from current route
  const { items } = useBreadcrumbs();

  return <Breadcrumb items={items} />;
}
```

### Custom Router Configuration

```tsx
import { Breadcrumb, useBreadcrumbs } from '@vdailyapp/ui';
import { useNavigate, useLocation } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  const location = useLocation();

  const { items } = useBreadcrumbs({
    type: 'react-router',
    getCurrentPath: () => location.pathname,
    navigate: (path) => navigate(path),
  });

  const handleItemClick = (path: string) => {
    navigate(path);
  };

  return <Breadcrumb items={items} onItemClick={handleItemClick} />;
}
```

### Custom Separator

```tsx
import { Breadcrumb } from '@vdailyapp/ui';
import { ChevronRight } from 'lucide-react';

function MyComponent() {
  const items = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Details', path: '/products/123' }
  ];

  return <Breadcrumb items={items} separator={<ChevronRight size={14} />} />;
}
```

## API Reference

### Breadcrumb Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `BreadcrumbItemConfig[]` | `undefined` | Array of breadcrumb items |
| `children` | `ReactNode` | `undefined` | Child BreadcrumbItem components |
| `separator` | `ReactNode` | `"/"` | Custom separator between items |
| `enableCopy` | `boolean` | `true` | Enable copy to clipboard |
| `enablePreview` | `boolean` | `true` | Enable hover preview |
| `className` | `string` | `undefined` | Custom CSS classes |
| `onItemClick` | `(path: string) => void` | `undefined` | Click handler |
| `onCopy` | `(path: string) => void` | `undefined` | Copy handler |

### BreadcrumbItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | **required** | Item label |
| `path` | `string` | `undefined` | Item path/URL |
| `icon` | `ReactNode` | `undefined` | Icon element |
| `preview` | `ReactNode \| string` | `undefined` | Preview content on hover |
| `isLast` | `boolean` | `false` | Whether this is the last item |
| `onClick` | `(path?: string) => void` | `undefined` | Click handler |
| `className` | `string` | `undefined` | Custom CSS classes |

### useBreadcrumbs Hook

Returns automatically generated breadcrumb items from the current route.

```tsx
const { items, currentPath } = useBreadcrumbs(config?);
```

**Parameters:**
- `config` (optional): `RouterConfig` object

**Returns:**
- `items`: Array of `BreadcrumbItemConfig`
- `currentPath`: Current path string

### RouterConfig

| Prop | Type | Description |
|------|------|-------------|
| `type` | `'react-router' \| 'next' \| 'custom'` | Router type |
| `getCurrentPath` | `() => string` | Custom function to get current path |
| `navigate` | `(path: string) => void` | Custom navigation function |
| `getPathSegments` | `(path: string) => string[]` | Custom path parsing function |

## Examples

### Next.js App Router

```tsx
'use client';

import { Breadcrumb, useBreadcrumbs } from '@vdailyapp/ui';
import { useRouter, usePathname } from 'next/navigation';

export function NavigationBreadcrumb() {
  const router = useRouter();
  const pathname = usePathname();

  const { items } = useBreadcrumbs({
    type: 'next',
    getCurrentPath: () => pathname,
    navigate: (path) => router.push(path),
  });

  return (
    <Breadcrumb 
      items={items}
      onItemClick={(path) => router.push(path)}
    />
  );
}
```

### React Router v6

```tsx
import { Breadcrumb, useBreadcrumbs } from '@vdailyapp/ui';
import { useNavigate, useLocation } from 'react-router-dom';

export function NavigationBreadcrumb() {
  const navigate = useNavigate();
  const location = useLocation();

  const { items } = useBreadcrumbs({
    type: 'react-router',
    getCurrentPath: () => location.pathname,
  });

  return (
    <Breadcrumb 
      items={items}
      onItemClick={(path) => navigate(path)}
    />
  );
}
```

### Static Configuration

```tsx
import { Breadcrumb } from '@vdailyapp/ui';

const breadcrumbConfig = {
  '/': { label: 'Dashboard', icon: <DashboardIcon /> },
  '/users': { label: 'Users', icon: <UsersIcon /> },
  '/users/:id': { label: 'User Details', icon: <UserIcon /> },
};

export function NavigationBreadcrumb() {
  // Use config to generate breadcrumbs
  return <Breadcrumb items={[...]} />;
}
```

## Styling

The component uses Tailwind CSS classes and supports dark mode. You can customize the appearance using the `className` prop:

```tsx
<Breadcrumb 
  items={items}
  className="text-lg font-semibold"
/>
```

## Accessibility

The component follows ARIA best practices:
- Uses semantic `<nav>` and `<ol>` elements
- Includes `aria-label="Breadcrumb"`
- Marks separator items with `aria-hidden="true"`
- Provides proper link semantics

## Browser Support

The component supports all modern browsers. The copy-to-clipboard feature requires the Clipboard API.
