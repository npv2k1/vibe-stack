import React, { forwardRef, PropsWithChildren } from 'react';

import { useThemeProps } from '../hooks/use-theme-props';
import { cn } from '../utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends PropsWithChildren, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  /**
   * Button variant that determines the visual style
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Button size variant
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * Optional loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Optional icon to display before the button content
   */
  startIcon?: React.ReactNode;

  /**
   * Optional icon to display after the button content
   */
  endIcon?: React.ReactNode;

  /**
   * Optional title for the button
   */
  title?: string;

  /**
   * Full width mode
   * @default false
   */
  fullWidth?: boolean;
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
};

const spinnerSizes: Record<ButtonSize, string> = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  const {
    children,
    disabled,
    loading,
    title,
    className,
    variant = 'primary',
    size = 'md',
    startIcon,
    endIcon,
    fullWidth,
    onClick,
    ...rest
  } = useThemeProps({
    name: 'Button',
    props: {
      ...props,
      variant: props.variant || 'primary',
      size: props.size || 'md',
    },
  });

  const content = children ?? title;
  const hasContent = content !== undefined && content !== null;
  const isDisabled = disabled || loading;
  const showStartIcon = !loading && startIcon;
  const showEndIcon = !loading && endIcon;

  return (
    <button
      ref={ref}
      className={cn(
        // 'rounded-2xl',
        // Size styles
        sizeStyles[size],

        // Width control
        fullWidth && 'w-full',

        // Custom classes
        className,
      )}
      disabled={isDisabled}
      {...rest}
      onClick={onClick}
      role="button"
      aria-disabled={isDisabled}
      aria-busy={loading}
      title={title}
    >
      {/* Loading spinner */}
      {loading && (
        <svg className={cn('animate-spin', spinnerSizes[size])} fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}

      {/* Start Icon */}
      {showStartIcon && <span className="inline-flex items-center shrink-0">{startIcon}</span>}

      {/* Main Content */}
      {hasContent && <span className="inline-flex items-center">{content}</span>}

      {/* End Icon */}
      {showEndIcon && <span className="inline-flex items-center shrink-0">{endIcon}</span>}
    </button>
  );
});

Button.displayName = 'Button';
