export interface ImageItem {
  /** Unique identifier for the image */
  id: string | number;
  /** Image source URL */
  src: string;
  /** Alternative text for the image - required for accessibility */
  alt: string;
  /** Optional thumbnail URL (if different from src) */
  thumbnail?: string;
  /** Optional title for the image */
  title?: string;
  /** Optional description for the image */
  description?: string;
}

export interface ImageGalleryProps {
  /** Array of image items to display */
  images?: ImageItem[];
  /** Number of columns in the grid (default: 3) */
  columns?: number | { sm?: number; md?: number; lg?: number; xl?: number };
  /** Gap between images in the grid (default: 4) */
  gap?: number;
  /** Enable infinite scroll */
  infiniteScroll?: boolean;
  /** Callback to load more images when infinite scroll is enabled */
  onLoadMore?: () => Promise<void> | void;
  /** Whether more images can be loaded */
  hasMore?: boolean;
  /** Whether images are currently loading */
  loading?: boolean;
  /** Custom loading component */
  loadingComponent?: React.ReactNode;
  /** Enable image preview on click (default: true) */
  enablePreview?: boolean;
  /** Custom class name for the gallery container */
  className?: string;
  /** Custom class name for each image */
  imageClassName?: string;
  /** Callback when an image is clicked */
  onImageClick?: (image: ImageItem, index: number) => void;
  /** Children (for compound component pattern) */
  children?: React.ReactNode;
}

export interface ImageGalleryItemProps {
  /** Image item data */
  image: ImageItem;
  /** Index of the image in the gallery */
  index: number;
  /** Enable image preview on click */
  enablePreview?: boolean;
  /** Custom class name */
  className?: string;
  /** Callback when image is clicked */
  onClick?: (image: ImageItem, index: number) => void;
}
