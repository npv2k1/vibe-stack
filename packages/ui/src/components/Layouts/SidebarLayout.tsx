import React from 'react';
import { cn } from '../utils';

export interface SidebarLayoutProps {
  /** The sidebar content */
  sidebar: React.ReactNode;
  /** Main content area */
  children: React.ReactNode;
  /** Header slot */
  header?: React.ReactNode;
  /** Footer slot */
  footer?: React.ReactNode;
  /** Position of the sidebar. Defaults to 'left' */
  sidebarPosition?: 'left' | 'right';
  /** Width of the sidebar. Defaults to 'w-64' */
  sidebarWidth?: string;
  /** Whether the sidebar is sticky. Defaults to true */
  stickySidebar?: boolean;
  /** Additional CSS classes for the container */
  className?: string;
}

/**
 * SidebarLayout is a flexible layout with a sidebar (left or right) and a main content area.
 * It's ideal for documentation or settings pages.
 */
export const SidebarLayout: React.FC<SidebarLayoutProps> = ({
  sidebar,
  children,
  header,
  footer,
  sidebarPosition = 'left',
  sidebarWidth = 'w-64',
  stickySidebar = true,
  className,
}) => {
  const isLeft = sidebarPosition === 'left';

  return (
    <div className={cn('min-h-screen flex flex-col', className)}>
      {header && <header className="w-full">{header}</header>}

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <aside
          className={cn(
            sidebarWidth,
            'hidden md:block bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800',
            stickySidebar && 'sticky top-0 h-screen overflow-y-auto',
            !isLeft && 'order-last border-l border-r-0',
          )}
        >
          {sidebar}
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>

      {footer && <footer className="w-full mt-auto">{footer}</footer>}
    </div>
  );
};
