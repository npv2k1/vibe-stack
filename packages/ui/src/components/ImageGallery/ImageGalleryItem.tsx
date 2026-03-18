import React, { memo, useCallback } from 'react';
import { Image } from '../Image';
import { cn } from '../utils';
import type { ImageGalleryItemProps } from './ImageGallery.types';

export const ImageGalleryItem = memo(
  ({ image, index, enablePreview = true, className, onClick }: ImageGalleryItemProps) => {
    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLImageElement>) => {
        onClick?.(image, index);
      },
      [image, index, onClick],
    );

    return (
      <div
        className={cn(
          'group relative overflow-hidden rounded-lg bg-gray-100 transition-transform hover:scale-105',
          className,
        )}
      >
        <Image
          src={image.thumbnail || image.src}
          alt={image.alt}
          isPreview={enablePreview}
          className="h-full w-full object-cover"
          onClick={handleClick}
        />
        {(image.title || image.description) && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white opacity-0 transition-opacity group-hover:opacity-100">
            {image.title && <h3 className="text-sm font-semibold">{image.title}</h3>}
            {image.description && <p className="text-xs">{image.description}</p>}
          </div>
        )}
      </div>
    );
  },
);

ImageGalleryItem.displayName = 'ImageGalleryItem';
