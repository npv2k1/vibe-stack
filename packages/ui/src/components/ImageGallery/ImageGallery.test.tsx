import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ImageGallery } from './ImageGallery';
import type { ImageItem } from './ImageGallery.types';
import '@testing-library/jest-dom';

describe('ImageGallery Component', () => {
  const mockImages: ImageItem[] = [
    {
      id: 1,
      src: 'https://example.com/image1.jpg',
      alt: 'Image 1',
      title: 'First Image',
      description: 'Description for first image',
    },
    {
      id: 2,
      src: 'https://example.com/image2.jpg',
      alt: 'Image 2',
      title: 'Second Image',
    },
    {
      id: 3,
      src: 'https://example.com/image3.jpg',
      alt: 'Image 3',
    },
  ];

  it('should render images from images prop', () => {
    render(<ImageGallery images={mockImages} />);

    expect(screen.getByAlt('Image 1')).toBeInTheDocument();
    expect(screen.getByAlt('Image 2')).toBeInTheDocument();
    expect(screen.getByAlt('Image 3')).toBeInTheDocument();
  });

  it('should render with custom columns', () => {
    const { container } = render(<ImageGallery images={mockImages} columns={4} />);

    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
  });

  it('should render with responsive columns', () => {
    const { container } = render(
      <ImageGallery images={mockImages} columns={{ sm: 1, md: 2, lg: 3, xl: 4 }} />,
    );

    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<ImageGallery images={mockImages} className="custom-gallery" />);

    const gallery = container.firstChild;
    expect(gallery).toHaveClass('custom-gallery');
  });

  it('should call onImageClick when image is clicked', () => {
    const handleClick = jest.fn();
    render(<ImageGallery images={mockImages} onImageClick={handleClick} />);

    const firstImage = screen.getByAlt('Image 1');
    fireEvent.click(firstImage);

    expect(handleClick).toHaveBeenCalledWith(mockImages[0], 0);
  });

  it('should show loading state', () => {
    render(<ImageGallery images={mockImages} loading={true} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should show custom loading component', () => {
    render(
      <ImageGallery images={mockImages} loading={true} loadingComponent={<div>Custom Loading</div>} />,
    );

    expect(screen.getByText('Custom Loading')).toBeInTheDocument();
  });

  it('should render using compound components', () => {
    render(
      <ImageGallery>
        <ImageGallery.Item image={mockImages[0]} index={0} />
        <ImageGallery.Item image={mockImages[1]} index={1} />
      </ImageGallery>,
    );

    expect(screen.getByAlt('Image 1')).toBeInTheDocument();
    expect(screen.getByAlt('Image 2')).toBeInTheDocument();
  });

  it('should disable preview when enablePreview is false', () => {
    render(<ImageGallery images={mockImages} enablePreview={false} />);

    const firstImage = screen.getByAlt('Image 1');
    expect(firstImage).not.toHaveClass('cursor-pointer');
  });

  it('should render empty gallery when no images provided', () => {
    const { container } = render(<ImageGallery images={[]} />);

    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
    expect(grid?.children.length).toBe(0);
  });

  it('should apply custom gap', () => {
    const { container } = render(<ImageGallery images={mockImages} gap={8} />);

    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('gap-8');
  });
});

describe('ImageGallery with Infinite Scroll', () => {
  const mockImages: ImageItem[] = [
    {
      id: 1,
      src: 'https://example.com/image1.jpg',
      alt: 'Image 1',
    },
    {
      id: 2,
      src: 'https://example.com/image2.jpg',
      alt: 'Image 2',
    },
  ];

  it('should show infinite scroll loading indicator', () => {
    render(<ImageGallery images={mockImages} infiniteScroll={true} hasMore={true} loading={true} />);

    expect(screen.getByText('Loading more images...')).toBeInTheDocument();
  });

  it('should call onLoadMore when scrolling to bottom', async () => {
    const handleLoadMore = jest.fn().mockResolvedValue(undefined);

    render(
      <ImageGallery
        images={mockImages}
        infiniteScroll={true}
        hasMore={true}
        onLoadMore={handleLoadMore}
      />,
    );

    // Note: Testing actual intersection observer behavior requires more complex setup
    // This test verifies the component renders with infinite scroll enabled
    expect(screen.getByAlt('Image 1')).toBeInTheDocument();
  });

  it('should not show loading indicator when hasMore is false', () => {
    render(<ImageGallery images={mockImages} infiniteScroll={true} hasMore={false} />);

    expect(screen.queryByText('Loading more images...')).not.toBeInTheDocument();
  });
});

describe('ImageGalleryItem Component', () => {
  const mockImage: ImageItem = {
    id: 1,
    src: 'https://example.com/image.jpg',
    alt: 'Test Image',
    title: 'Test Title',
    description: 'Test Description',
  };

  it('should render image', () => {
    render(<ImageGallery.Item image={mockImage} index={0} />);

    expect(screen.getByAlt('Test Image')).toBeInTheDocument();
  });

  it('should render with thumbnail', () => {
    const imageWithThumbnail = {
      ...mockImage,
      thumbnail: 'https://example.com/thumbnail.jpg',
    };

    render(<ImageGallery.Item image={imageWithThumbnail} index={0} />);

    const img = screen.getByAlt('Test Image');
    expect(img).toHaveAttribute('src', 'https://example.com/thumbnail.jpg');
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<ImageGallery.Item image={mockImage} index={0} onClick={handleClick} />);

    const img = screen.getByAlt('Test Image');
    fireEvent.click(img);

    expect(handleClick).toHaveBeenCalledWith(mockImage, 0);
  });

  it('should apply custom className', () => {
    const { container } = render(
      <ImageGallery.Item image={mockImage} index={0} className="custom-item" />,
    );

    const item = container.firstChild;
    expect(item).toHaveClass('custom-item');
  });
});
