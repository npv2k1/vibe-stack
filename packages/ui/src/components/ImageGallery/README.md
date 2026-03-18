# ImageGallery Component

A flexible and performant image gallery component with grid layout, infinite scroll, and preview capabilities.

## Features

- ✅ Grid layout with responsive columns
- ✅ Infinite scroll support
- ✅ Image preview on click
- ✅ Lazy loading images
- ✅ Compound component pattern
- ✅ TypeScript support
- ✅ Customizable styling
- ✅ Hover effects with title/description overlay

## Installation

The component is part of the `@vdailyapp/ui` package.

```bash
npm install @vdailyapp/ui
```

## Basic Usage

```tsx
import { ImageGallery, type ImageItem } from '@vdailyapp/ui';

const images: ImageItem[] = [
  {
    id: 1,
    src: 'https://example.com/image1.jpg',
    alt: 'Image 1',
    title: 'First Image',
    description: 'Description for first image',
  },
  {
    id: 2,
    src: 'https://example.com/image2.jpg',
    alt: 'Image 2',
  },
];

function MyGallery() {
  return <ImageGallery images={images} columns={3} gap={4} />;
}
```

## Props

### ImageGalleryProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `ImageItem[]` | `[]` | Array of image items to display |
| `columns` | `number \| ResponsiveColumns` | `3` | Number of columns in the grid |
| `gap` | `number` | `4` | Gap between images (0-8) |
| `infiniteScroll` | `boolean` | `false` | Enable infinite scroll |
| `onLoadMore` | `() => Promise<void> \| void` | - | Callback to load more images |
| `hasMore` | `boolean` | `false` | Whether more images can be loaded |
| `loading` | `boolean` | `false` | Loading state |
| `loadingComponent` | `React.ReactNode` | - | Custom loading component |
| `enablePreview` | `boolean` | `true` | Enable image preview on click |
| `className` | `string` | - | Custom class name for container |
| `imageClassName` | `string` | - | Custom class name for images |
| `onImageClick` | `(image: ImageItem, index: number) => void` | - | Callback when image is clicked |
| `children` | `React.ReactNode` | - | For compound component pattern |

### ImageItem

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `string \| number` | ✅ | Unique identifier |
| `src` | `string` | ✅ | Image source URL |
| `alt` | `string` | ✅ | Alt text (accessibility) |
| `thumbnail` | `string` | - | Optional thumbnail URL |
| `title` | `string` | - | Optional title |
| `description` | `string` | - | Optional description |

### ResponsiveColumns

```typescript
{
  sm?: number;  // Small screens
  md?: number;  // Medium screens
  lg?: number;  // Large screens
  xl?: number;  // Extra large screens
}
```

## Examples

### Responsive Grid

```tsx
<ImageGallery
  images={images}
  columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
  gap={4}
/>
```

### Infinite Scroll

```tsx
function InfiniteGallery() {
  const [images, setImages] = useState<ImageItem[]>(initialImages);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    setLoading(true);
    const newImages = await fetchMoreImages();
    setImages([...images, ...newImages]);
    setLoading(false);
    setHasMore(newImages.length > 0);
  };

  return (
    <ImageGallery
      images={images}
      columns={3}
      infiniteScroll={true}
      hasMore={hasMore}
      loading={loading}
      onLoadMore={loadMore}
    />
  );
}
```

### With Click Handler

```tsx
<ImageGallery
  images={images}
  columns={3}
  onImageClick={(image, index) => {
    console.log('Clicked:', image.title, 'at index:', index);
  }}
/>
```

### Custom Loading Component

```tsx
<ImageGallery
  images={images}
  columns={3}
  loading={true}
  loadingComponent={
    <div className="flex items-center gap-2">
      <Spinner />
      <span>Loading images...</span>
    </div>
  }
/>
```

### Compound Components

```tsx
<ImageGallery columns={3} gap={4}>
  {images.map((image, index) => (
    <ImageGallery.Item
      key={image.id}
      image={image}
      index={index}
      enablePreview={true}
    />
  ))}
</ImageGallery>
```

### Without Preview

```tsx
<ImageGallery images={images} columns={3} enablePreview={false} />
```

### Custom Styling

```tsx
<ImageGallery
  images={images}
  columns={3}
  className="bg-gray-50 p-4 rounded-lg"
  imageClassName="rounded-xl shadow-lg"
/>
```

## Accessibility

- All images must have `alt` text for screen readers
- Preview modal can be closed with ESC key
- Keyboard navigation supported through the underlying Image component

## Performance

- Images use lazy loading by default
- Infinite scroll uses Intersection Observer API
- Responsive grid adapts to screen size
- Component is memoized to prevent unnecessary re-renders

## Dependencies

- `react-intersection-observer` - For infinite scroll
- Existing `Image` component - For individual images with preview
- Existing `useInfinitiveScroll` hook - For scroll detection

## Browser Support

Modern browsers that support:
- CSS Grid
- Intersection Observer API
- ES6+ features
