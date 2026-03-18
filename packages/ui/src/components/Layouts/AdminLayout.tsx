import React from 'react';
import { cn } from '../utils';

export interface AdminLayoutProps {
  /** Sidebar navigation items */
  sidebar: React.ReactNode;
  /** Top navigation or header */
  topbar: React.ReactNode;
  /** Main content area */
  children: React.ReactNode;
  /** Sidebar width. Defaults to 'w-64' */
  sidebarWidth?: string;
  /** Additional CSS classes for the container */
  className?: string;
}

/**
 * AdminLayout provides a professional dashboard structure with a
 * fixed sidebar, a top navigation bar, and a scrollable content area.
 */
export const AdminLayout: React.FC<AdminLayoutProps> = ({
  sidebar,
  topbar,
  children,
  sidebarWidth = 'w-64',
  className,
}) => {
  return (
    <div className={cn('flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950', className)}>
      {/* Fixed Sidebar */}
      <aside
        className={cn(
          sidebarWidth,
          'hidden h-full flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 md:flex',
        )}
      >
        <div className="flex-1 overflow-y-auto">{sidebar}</div>
      </aside>

      {/* Main Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 flex items-center shrink-0">
          {topbar}
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};
