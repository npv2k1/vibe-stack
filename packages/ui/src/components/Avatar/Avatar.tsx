import { memo, useMemo } from 'react';
import cn from 'classnames';
import { Image } from '../Image';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** URL of the avatar image */
  src: string;
  /** Alt text for the avatar - required for accessibility */
  title: string;
  /** Custom className for the avatar container */
  className?: string;
  /** Size of the avatar - can be predefined or custom number in pixels */
  size?: AvatarSize;
  /** Whether to show border around avatar */
  showBorder?: boolean;
  /** Custom border color className */
  borderColorClass?: string;
  /** Whether to enable image preview on click */
  enablePreview?: boolean;
  /** Custom fallback element when image fails to load */
  fallback?: React.ReactNode;
  /** Status indicator to show on avatar (online/offline/away) */
  status?: 'online' | 'offline' | 'away';
}

const sizeMap: Record<Exclude<AvatarSize, number>, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 56,
};

const getDefaultFallback = (title: string) => {
  const initials = title
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-600">
      <span className="text-sm font-medium">{initials}</span>
    </div>
  );
};

export const Avatar = memo(
  ({
    src,
    title,
    className,
    size = 'md',
    showBorder = true,
    borderColorClass = 'border-border-100',
    enablePreview = false,
    fallback,
    status,
    ...rest
  }: AvatarProps) => {
    const dimensionStyle = useMemo(() => {
      const dimension = typeof size === 'number' ? size : sizeMap[size];
      return {
        width: dimension,
        height: dimension,
      };
    }, [size]);

    const statusColorClass = useMemo(() => {
      switch (status) {
        case 'online':
          return 'bg-green-500';
        case 'offline':
          return 'bg-gray-400';
        case 'away':
          return 'bg-yellow-500';
        default:
          return '';
      }
    }, [status]);

    return (
      <div
        className={cn(
          'relative inline-flex shrink-0 overflow-hidden rounded-full',
          showBorder && `border ${borderColorClass}`,
          className,
        )}
        style={dimensionStyle}
        {...rest}
      >
        <Image
          src={src}
          alt={title}
          className="h-full w-full object-cover"
          preview={enablePreview}
          fallback={fallback || getDefaultFallback(title)}
          aria-label={`Avatar for ${title}`}
        />

        {status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 z-30 h-2.5 w-2.5 rounded-full ring-2 ring-white',
              statusColorClass,
            )}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    );
  },
);

Avatar.displayName = 'Avatar';
