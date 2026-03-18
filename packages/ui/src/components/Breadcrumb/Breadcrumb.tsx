import React, { forwardRef, Children, isValidElement, cloneElement, ReactElement } from 'react';
import { BreadcrumbProps, BreadcrumbItemProps } from './Breadcrumb.types';
import { BreadcrumbItem } from './BreadcrumbItem';
import { cn } from '../utils';

/**
 * Breadcrumb component for navigation hierarchy display
 * 
 * @example
 * ```tsx
 * // Using items prop
 * <Breadcrumb items={[
 *   { label: 'Home', path: '/', icon: <HomeIcon /> },
 *   { label: 'Products', path: '/products' },
 *   { label: 'Details', path: '/products/123' }
 * ]} />
 * 
 * // Using children (compound components)
 * <Breadcrumb>
 *   <Breadcrumb.Item label="Home" path="/" icon={<HomeIcon />} />
 *   <Breadcrumb.Item label="Products" path="/products" />
 *   <Breadcrumb.Item label="Details" path="/products/123" />
 * </Breadcrumb>
 * ```
 */
export const BreadcrumbComponent = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  {
    items,
    children,
    separator = '/',
    enableCopy = true,
    enablePreview = true,
    className,
    onItemClick,
    onCopy,
  },
  ref,
) {
  const handleItemClick = (path?: string) => {
    if (path && onItemClick) {
      onItemClick(path);
    }
  };

  const handleCopy = (path: string) => {
    if (onCopy) {
      onCopy(path);
    }
  };

  // Render from items prop
  if (items && items.length > 0) {
    return (
      <nav
        ref={ref}
        className={cn('flex items-center space-x-2 text-sm', className)}
        aria-label="Breadcrumb"
      >
        <ol className="inline-flex items-center space-x-2">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <React.Fragment key={item.path || index}>
                <BreadcrumbItem
                  label={item.label}
                  path={item.path}
                  icon={item.icon}
                  preview={enablePreview ? item.preview : undefined}
                  isLast={isLast}
                  onClick={handleItemClick}
                />
                {!isLast && (
                  <li className="inline-flex items-center text-gray-400 dark:text-gray-600" aria-hidden="true">
                    {separator}
                  </li>
                )}
              </React.Fragment>
            );
          })}
        </ol>
      </nav>
    );
  }

  // Render from children
  if (children) {
    const childArray = Children.toArray(children);
    const validChildren = childArray.filter(
      (child): child is ReactElement<BreadcrumbItemProps> => isValidElement(child),
    );

    return (
      <nav
        ref={ref}
        className={cn('flex items-center space-x-2 text-sm', className)}
        aria-label="Breadcrumb"
      >
        <ol className="inline-flex items-center space-x-2">
          {validChildren.map((child, index) => {
            const isLast = index === validChildren.length - 1;
            return (
              <React.Fragment key={child.key || index}>
                {cloneElement(child, {
                  isLast,
                  onClick: handleItemClick,
                  ...child.props,
                })}
                {!isLast && (
                  <li className="inline-flex items-center text-gray-400 dark:text-gray-600" aria-hidden="true">
                    {separator}
                  </li>
                )}
              </React.Fragment>
            );
          })}
        </ol>
      </nav>
    );
  }

  return null;
});

BreadcrumbComponent.displayName = 'Breadcrumb';

// Compound component pattern
export const Breadcrumb = Object.assign(BreadcrumbComponent, {
  Item: BreadcrumbItem,
});
