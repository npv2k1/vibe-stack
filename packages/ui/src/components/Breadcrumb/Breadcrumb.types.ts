import { ReactNode } from 'react';

/**
 * Breadcrumb item configuration
 */
export interface BreadcrumbItemConfig {
  /**
   * Label for the breadcrumb item
   */
  label: string;

  /**
   * Path/URL for the breadcrumb item
   */
  path: string;

  /**
   * Optional icon to display before the label
   */
  icon?: ReactNode;

  /**
   * Optional preview content to show on hover
   */
  preview?: ReactNode | string;
}

/**
 * Props for BreadcrumbItem component
 */
export interface BreadcrumbItemProps {
  /**
   * Label for the breadcrumb item
   */
  label: string;

  /**
   * Path/URL for the breadcrumb item
   */
  path?: string;

  /**
   * Optional icon to display before the label
   */
  icon?: ReactNode;

  /**
   * Optional preview content to show on hover
   */
  preview?: ReactNode | string;

  /**
   * Whether this is the last item (current page)
   */
  isLast?: boolean;

  /**
   * Click handler for the breadcrumb item
   */
  onClick?: (path?: string) => void;

  /**
   * Custom className for styling
   */
  className?: string;
}

/**
 * Props for the Breadcrumb container component
 */
export interface BreadcrumbProps {
  /**
   * Breadcrumb items to display
   */
  items?: BreadcrumbItemConfig[];

  /**
   * Child components (BreadcrumbItem)
   */
  children?: ReactNode;

  /**
   * Custom separator between breadcrumb items
   * @default "/"
   */
  separator?: ReactNode;

  /**
   * Enable copy to clipboard functionality
   * @default true
   */
  enableCopy?: boolean;

  /**
   * Enable hover preview
   * @default true
   */
  enablePreview?: boolean;

  /**
   * Custom className for the container
   */
  className?: string;

  /**
   * Handler called when a breadcrumb item is clicked
   */
  onItemClick?: (path: string) => void;

  /**
   * Handler called when route is copied
   */
  onCopy?: (path: string) => void;
}

/**
 * Router integration configuration
 */
export interface RouterConfig {
  /**
   * Type of router being used
   */
  type: 'react-router' | 'next' | 'custom';

  /**
   * Custom function to get current path
   */
  getCurrentPath?: () => string;

  /**
   * Custom function to navigate to a path
   */
  navigate?: (path: string) => void;

  /**
   * Custom function to get path segments
   */
  getPathSegments?: (path: string) => string[];
}
