/**
 * Example usage of ImageGallery component
 * This file demonstrates common use cases and patterns
 */

import React, { useState } from 'react';
import { ImageGallery, type ImageItem } from './index';

// Example 1: Basic Gallery
export const BasicGallery = () => {
  const images: ImageItem[] = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      alt: 'Mountain landscape',
      title: 'Mountain Peak',
      description: 'Beautiful mountain landscape at sunrise',
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=800',
      alt: 'Ocean waves',
      title: 'Ocean View',
      description: 'Peaceful ocean waves',
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
      alt: 'Forest path',
      title: 'Forest Trail',
      description: 'Winding path through the forest',
    },
  ];

  return <ImageGallery images={images} columns={3} gap={4} enablePreview={true} />;
};

// Example 2: Responsive Gallery
export const ResponsiveGallery = () => {
  const images: ImageItem[] = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      alt: 'Mountain landscape',
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=800',
      alt: 'Ocean waves',
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
      alt: 'Forest path',
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
      alt: 'Desert sunset',
    },
  ];

  return (
    <ImageGallery
      images={images}
      columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
      gap={4}
      enablePreview={true}
    />
  );
};

// Example 3: Infinite Scroll Gallery
export const InfiniteScrollGallery = () => {
  const initialImages: ImageItem[] = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      alt: 'Mountain landscape',
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=800',
      alt: 'Ocean waves',
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
      alt: 'Forest path',
    },
  ];

  const [images, setImages] = useState<ImageItem[]>(initialImages);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreImages = async () => {
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Add more images
    const newImages: ImageItem[] = [
      {
        id: images.length + 1,
        src: `https://images.unsplash.com/photo-${Date.now()}?w=800`,
        alt: `Image ${images.length + 1}`,
      },
      {
        id: images.length + 2,
        src: `https://images.unsplash.com/photo-${Date.now() + 1}?w=800`,
        alt: `Image ${images.length + 2}`,
      },
    ];

    setImages([...images, ...newImages]);
    setLoading(false);

    // Stop after reaching 20 images
    if (images.length >= 20) {
      setHasMore(false);
    }
  };

  return (
    <div className="h-screen">
      <ImageGallery
        images={images}
        columns={3}
        gap={4}
        infiniteScroll={true}
        hasMore={hasMore}
        loading={loading}
        onLoadMore={loadMoreImages}
      />
    </div>
  );
};

// Example 4: Compound Components
export const CompoundComponentsGallery = () => {
  const images: ImageItem[] = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      alt: 'Mountain landscape',
      title: 'Mountain Peak',
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=800',
      alt: 'Ocean waves',
      title: 'Ocean View',
    },
  ];

  return (
    <ImageGallery columns={2} gap={4}>
      {images.map((image, index) => (
        <ImageGallery.Item key={image.id} image={image} index={index} enablePreview={true} />
      ))}
    </ImageGallery>
  );
};

// Example 5: With Click Handler
export const GalleryWithClickHandler = () => {
  const images: ImageItem[] = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      alt: 'Mountain landscape',
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=800',
      alt: 'Ocean waves',
    },
  ];

  const handleImageClick = (image: ImageItem, index: number) => {
    console.log('Clicked image:', image.alt, 'at index:', index);
    alert(`Clicked: ${image.title || image.alt}`);
  };

  return <ImageGallery images={images} columns={2} gap={4} onImageClick={handleImageClick} />;
};

// Example 6: Custom Styling
export const CustomStyledGallery = () => {
  const images: ImageItem[] = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      alt: 'Mountain landscape',
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=800',
      alt: 'Ocean waves',
    },
  ];

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Photo Gallery</h2>
      <ImageGallery
        images={images}
        columns={2}
        gap={4}
        className="bg-white p-4 rounded-lg"
        imageClassName="rounded-xl shadow-lg"
      />
    </div>
  );
};
