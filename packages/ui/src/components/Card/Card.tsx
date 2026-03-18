import React, { forwardRef, HTMLAttributes, ReactElement, Ref } from 'react';

import { cn } from '../utils';

export type CardProps = {
  color?: 'white' | 'sky' | 'gray';
  children?: React.ReactNode;
  title?: string;
  renderFooter?: () => React.ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef(function Card(
  { color = 'white', children, className, title, renderFooter, ...props }: CardProps,
  ref: Ref<HTMLDivElement>,
): ReactElement {
  return (
    <div
      ref={ref}
      className={cn(
        'relative flex flex-col space-y-2 rounded-sm border px-3 py-2 shadow-sm transition-shadow hover:shadow-md',
        {
          'bg-white': color === 'white',
          'bg-sky-50': color === 'sky',
          'bg-gray-50': color === 'gray',
        },
        className,
      )}
      {...props}
    >
      {title && <h3 className="text-2xl font-semibold">{title}</h3>}
      {children}
      {renderFooter?.()}
    </div>
  );
});
