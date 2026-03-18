import React, { memo, useState, useCallback } from 'react';
import { Modal } from '../Modal';

export interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'onError'> {
  /** Alternative text for the image - required for accessibility */
  alt: string;
  /** Whether to enable preview mode on click */
  isPreview?: boolean;
  /** Custom class name for preview modal */
  previewClassName?: string;
  /** Callback when image fails to load */
  onError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  /** Custom fallback element to show when image fails to load */
  fallback?: React.ReactNode;
}

export const Image = memo(
  ({
    src,
    alt,
    isPreview,
    previewClassName,
    className,
    onError,
    fallback,
    onClick,
    style,
    ...restProps
  }: ImageProps) => {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [hasError, setHasError] = useState(false);

    const handlePreviewOpen = useCallback(
      (e: React.MouseEvent<HTMLImageElement>) => {
        if (isPreview) {
          setIsPreviewOpen(true);
        }
        onClick?.(e);
      },
      [isPreview, onClick],
    );

    const handlePreviewClose = useCallback(() => {
      setIsPreviewOpen(false);
    }, []);

    const handleError = useCallback(
      (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setHasError(true);
        onError?.(e);
      },
      [onError],
    );

    if (hasError && fallback) {
      return <>{fallback}</>;
    }

    return (
      <>
        <img
          src={src}
          alt={alt}
          className={`max-w-full h-auto ${isPreview ? 'cursor-pointer' : ''} ${className || ''}`}
          onClick={handlePreviewOpen}
          onError={handleError}
          style={{ objectFit: 'contain', ...style }}
          loading="lazy"
          {...restProps}
        />

        {isPreview && (
          <Modal
            isOpen={isPreviewOpen}
            onClose={handlePreviewClose}
            className={`max-w-screen-lg ${previewClassName || ''}`}
          >
            <div className="flex items-center justify-center">
              <img src={src} alt={alt} className="max-h-[90vh] w-auto" style={{ objectFit: 'contain' }} />
            </div>
          </Modal>
        )}
      </>
    );
  },
);

Image.displayName = 'Image';
