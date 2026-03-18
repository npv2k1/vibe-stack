import React from 'react';
import { cn } from '../utils';

export interface CenteredContentLayoutProps {
  /** Optional header element */
  header?: React.ReactNode;
  /** Optional footer element */
  footer?: React.ReactNode;
  /** Main content */
  children: React.ReactNode;
  /** Max width for content area. Defaults to 'max-w-7xl' */
  maxWidth?: string;
  /** Additional CSS classes for the container */
  className?: string;
}

/**
 * CenteredContentLayout is a versatile layout for landing pages and blogs,
 * featuring a centered content area with optional header and footer.
 */
export const CenteredContentLayout: React.FC<CenteredContentLayoutProps> = ({
  header,
  footer,
  children,
  maxWidth = 'max-w-7xl',
  className,
}) => {
  return (
    <div className={cn('min-h-screen flex flex-col', className)}>
      {header && <header className="w-full">{header}</header>}
      <main className={cn('flex-grow w-full mx-auto px-4 sm:px-6 lg:px-8', maxWidth)}>{children}</main>
      {footer && <footer className="w-full mt-auto">{footer}</footer>}
    </div>
  );
};
