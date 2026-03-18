import React, { forwardRef, memo, useState, useCallback } from 'react';
import { BreadcrumbItemProps } from './Breadcrumb.types';
import { cn } from '../utils';

/**
 * BreadcrumbItem component displays a single item in the breadcrumb trail
 */
export const BreadcrumbItem = memo(
  forwardRef<HTMLLIElement, BreadcrumbItemProps>(function BreadcrumbItem(
    { label, path, icon, preview, isLast = false, onClick, className },
    ref,
  ) {
    const [showPreview, setShowPreview] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        if (!isLast && onClick) {
          onClick(path);
        }
      },
      [isLast, onClick, path],
    );

    const handleCopy = useCallback(
      async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (path) {
          try {
            await navigator.clipboard.writeText(path);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch (err) {
            console.error('Failed to copy:', err);
          }
        }
      },
      [path],
    );

    const handleMouseEnter = useCallback(() => {
      if (preview) {
        setShowPreview(true);
      }
    }, [preview]);

    const handleMouseLeave = useCallback(() => {
      setShowPreview(false);
    }, []);

    return (
      <li ref={ref} className={cn('inline-flex items-center', className)}>
        <div className="relative inline-flex items-center group">
          {isLast ? (
            <span className="inline-flex items-center text-gray-900 dark:text-gray-100 font-medium">
              {icon && <span className="mr-2">{icon}</span>}
              {label}
            </span>
          ) : (
            <a
              href={path}
              onClick={handleClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={cn(
                'inline-flex items-center',
                'text-gray-600 dark:text-gray-400',
                'hover:text-blue-600 dark:hover:text-blue-400',
                'transition-colors duration-200',
                'cursor-pointer',
              )}
            >
              {icon && <span className="mr-2">{icon}</span>}
              {label}
            </a>
          )}

          {/* Copy button */}
          {path && !isLast && (
            <button
              onClick={handleCopy}
              className={cn(
                'ml-2 p-1 rounded',
                'opacity-0 group-hover:opacity-100',
                'transition-opacity duration-200',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                'text-gray-500 dark:text-gray-400',
                'text-xs',
              )}
              title="Copy path"
            >
              {copied ? (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
              )}
            </button>
          )}

          {/* Preview tooltip */}
          {preview && showPreview && (
            <div
              className={cn(
                'absolute top-full left-0 mt-2 z-50',
                'p-3 rounded-lg shadow-lg',
                'bg-white dark:bg-gray-800',
                'border border-gray-200 dark:border-gray-700',
                'min-w-[200px] max-w-[400px]',
                'text-sm text-gray-700 dark:text-gray-300',
              )}
            >
              {typeof preview === 'string' ? <p>{preview}</p> : preview}
            </div>
          )}
        </div>
      </li>
    );
  }),
);

BreadcrumbItem.displayName = 'BreadcrumbItem';
