import { useCallback, useMemo } from 'react';
import { BreadcrumbItemConfig, RouterConfig } from './Breadcrumb.types';

/**
 * Hook to automatically generate breadcrumbs from router path
 * Supports React Router, Next.js, and custom router configurations
 */
export function useBreadcrumbs(config?: RouterConfig): {
  items: BreadcrumbItemConfig[];
  currentPath: string;
} {
  const getCurrentPath = useCallback(() => {
    if (config?.getCurrentPath) {
      return config.getCurrentPath();
    }

    // Try Next.js
    if (typeof window !== 'undefined') {
      // Check for Next.js router
      try {
        // @ts-expect-error - Next.js router may not be available
        const { usePathname } = require('next/navigation');
        const pathname = usePathname?.();
        if (pathname) return pathname;
      } catch {
        // Next.js not available
      }

      // Fallback to window.location
      return window.location.pathname;
    }

    return '/';
  }, [config]);

  const currentPath = getCurrentPath();

  const items = useMemo(() => {
    const getSegments = config?.getPathSegments
      ? config.getPathSegments
      : (path: string) => {
          return path
            .split('/')
            .filter(Boolean)
            .map((segment) => ({
              segment,
              label: segment
                .split('-')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' '),
            }));
        };

    const segments = getSegments(currentPath);
    const breadcrumbs: BreadcrumbItemConfig[] = [
      {
        label: 'Home',
        path: '/',
      },
    ];

    let accumulatedPath = '';
    segments.forEach((segment) => {
      if (typeof segment === 'string') {
        accumulatedPath += `/${segment}`;
        breadcrumbs.push({
          label: segment.charAt(0).toUpperCase() + segment.slice(1),
          path: accumulatedPath,
        });
      } else {
        accumulatedPath += `/${segment.segment}`;
        breadcrumbs.push({
          label: segment.label,
          path: accumulatedPath,
        });
      }
    });

    return breadcrumbs;
  }, [currentPath, config]);

  return { items, currentPath };
}

/**
 * Hook to handle breadcrumb navigation
 */
export function useBreadcrumbNavigation(config?: RouterConfig) {
  const navigate = useCallback(
    (path: string) => {
      if (config?.navigate) {
        config.navigate(path);
        return;
      }

      // Try Next.js
      try {
        // @ts-expect-error - Next.js router may not be available
        const { useRouter } = require('next/navigation');
        const router = useRouter?.();
        if (router?.push) {
          router.push(path);
          return;
        }
      } catch {
        // Next.js not available
      }

      // Fallback to window.location
      if (typeof window !== 'undefined') {
        window.location.href = path;
      }
    },
    [config],
  );

  return { navigate };
}

/**
 * Utility to format path segment to readable label
 */
export function formatSegmentLabel(segment: string): string {
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Utility to copy path to clipboard
 */
export async function copyPathToClipboard(path: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(path);
    return true;
  } catch (err) {
    console.error('Failed to copy path:', err);
    return false;
  }
}
