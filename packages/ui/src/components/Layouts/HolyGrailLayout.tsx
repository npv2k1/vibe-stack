import React from 'react';
import { cn } from '../utils';

export interface HolyGrailLayoutProps {
  /** The header content */
  header: React.ReactNode;
  /** The footer content */
  footer: React.ReactNode;
  /** Left sidebar content */
  leftSidebar?: React.ReactNode;
  /** Right sidebar content */
  rightSidebar?: React.ReactNode;
  /** Main content area */
  children: React.ReactNode;
  /** Width of the left sidebar. Defaults to 'w-64' */
  leftSidebarWidth?: string;
  /** Width of the right sidebar. Defaults to 'w-64' */
  rightSidebarWidth?: string;
  /** Additional CSS classes for the container */
  className?: string;
}

/**
 * HolyGrailLayout is a classic three-column layout with a header, footer,
 * and optional left and right sidebars.
 */
export const HolyGrailLayout: React.FC<HolyGrailLayoutProps> = ({
  header,
  footer,
  leftSidebar,
  rightSidebar,
  children,
  leftSidebarWidth = 'w-64',
  rightSidebarWidth = 'w-64',
  className,
}) => {
  return (
    <div className={cn('min-h-screen flex flex-col', className)}>
      <header className="w-full shrink-0 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        {header}
      </header>

      <div className="flex flex-1 overflow-hidden">
        {leftSidebar && (
          <aside
            className={cn(
              leftSidebarWidth,
              'hidden md:block shrink-0 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 overflow-y-auto',
            )}
          >
            {leftSidebar}
          </aside>
        )}

        <main className="flex-1 overflow-y-auto min-w-0">{children}</main>

        {rightSidebar && (
          <aside
            className={cn(
              rightSidebarWidth,
              'hidden lg:block shrink-0 border-l border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 overflow-y-auto',
            )}
          >
            {rightSidebar}
          </aside>
        )}
      </div>

      <footer className="w-full shrink-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        {footer}
      </footer>
    </div>
  );
};
