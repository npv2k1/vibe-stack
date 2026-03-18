import React, { memo, useCallback, useMemo } from 'react';
import { useInfinitiveScroll } from '../../hooks/use-infinite-scroll';
import { cn } from '../utils';
import { ImageGalleryItem } from './ImageGalleryItem';
import type { ImageGalleryProps } from './ImageGallery.types';

export const ImageGallery = memo(
  ({
    images = [],
    columns = 3,
    gap = 4,
    infiniteScroll = false,
    onLoadMore,
    hasMore = false,
    loading = false,
    loadingComponent,
    enablePreview = true,
    className,
    imageClassName,
    onImageClick,
    children,
  }: ImageGalleryProps) => {
    // Handle infinite scroll
    const handleLoadMore = useCallback(async () => {
      if (onLoadMore && !loading) {
        await onLoadMore();
      }
    }, [onLoadMore, loading]);

    const infiniteScrollRef = useInfinitiveScroll({
      fetchPage: handleLoadMore,
      canFetchMore: infiniteScroll && hasMore && !loading,
    });

    // Helper function to map column count to CSS class
    const getColumnClass = (breakpoint: string, count: number): string => {
      const classMap: Record<string, Record<number, string>> = {
        base: { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4', 5: 'grid-cols-5', 6: 'grid-cols-6' },
        sm: { 1: 'sm:grid-cols-1', 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-4', 5: 'sm:grid-cols-5', 6: 'sm:grid-cols-6' },
        md: { 1: 'md:grid-cols-1', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4', 5: 'md:grid-cols-5', 6: 'md:grid-cols-6' },
        lg: { 1: 'lg:grid-cols-1', 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5', 6: 'lg:grid-cols-6' },
        xl: { 1: 'xl:grid-cols-1', 2: 'xl:grid-cols-2', 3: 'xl:grid-cols-3', 4: 'xl:grid-cols-4', 5: 'xl:grid-cols-5', 6: 'xl:grid-cols-6' },
      };
      return classMap[breakpoint][count] || classMap[breakpoint][3] || '';
    };

    // Calculate grid columns class based on responsive config
    const gridColumnsClass = useMemo(() => {
      if (typeof columns === 'number') {
        const colMap: Record<number, string> = {
          1: 'grid-cols-1',
          2: 'grid-cols-1 sm:grid-cols-2',
          3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
          4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
          5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
          6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
        };
        return colMap[columns] || colMap[3];
      }

      const sm = columns.sm || 1;
      const md = columns.md || 2;
      const lg = columns.lg || 3;
      const xl = columns.xl || columns.lg || 3;

      // Build responsive classes using helper function
      const baseClass = getColumnClass('base', 1);
      const smClass = getColumnClass('sm', sm);
      const mdClass = getColumnClass('md', md);
      const lgClass = getColumnClass('lg', lg);
      const xlClass = getColumnClass('xl', xl);

      return `${baseClass} ${smClass} ${mdClass} ${lgClass} ${xlClass}`;
    }, [columns]);

    // Render images from children or images prop
    const renderImages = () => {
      if (children) {
        return children;
      }

      return images.map((image, index) => (
        <ImageGalleryItem
          key={image.id}
          image={image}
          index={index}
          enablePreview={enablePreview}
          className={imageClassName}
          onClick={onImageClick}
        />
      ));
    };

    // Calculate gap class with static values
    const gapClass = useMemo(() => {
      const gapMap: Record<number, string> = {
        0: 'gap-0',
        1: 'gap-1',
        2: 'gap-2',
        3: 'gap-3',
        4: 'gap-4',
        5: 'gap-5',
        6: 'gap-6',
        7: 'gap-7',
        8: 'gap-8',
      };
      return gapMap[gap] || 'gap-4';
    }, [gap]);

    return (
      <div className={cn('w-full', className)}>
        <div className={cn('grid', gridColumnsClass, gapClass)}>{renderImages()}</div>

        {infiniteScroll && hasMore && (
          <div ref={infiniteScrollRef} className="mt-4 flex justify-center">
            {loading && (loadingComponent || <div className="text-gray-500">Loading more images...</div>)}
          </div>
        )}

        {loading && !infiniteScroll && (
          <div className="mt-4 flex justify-center">
            {loadingComponent || <div className="text-gray-500">Loading...</div>}
          </div>
        )}
      </div>
    );
  },
);

ImageGallery.displayName = 'ImageGallery';

// Attach sub-component
ImageGallery.Item = ImageGalleryItem;
