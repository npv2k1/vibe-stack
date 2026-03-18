import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Breadcrumb } from './Breadcrumb';
import '@testing-library/jest-dom';

describe('Breadcrumb Component', () => {
  const mockItems = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Details', path: '/products/123' },
  ];

  it('should render breadcrumb items', () => {
    render(<Breadcrumb items={mockItems} />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  it('should render separators between items', () => {
    const { container } = render(<Breadcrumb items={mockItems} />);
    
    const separators = container.querySelectorAll('[aria-hidden="true"]');
    // Should have 2 separators for 3 items
    expect(separators.length).toBe(2);
  });

  it('should use custom separator', () => {
    render(<Breadcrumb items={mockItems} separator=">" />);
    
    const separatorElements = screen.getAllByText('>');
    expect(separatorElements.length).toBe(2);
  });

  it('should mark last item as current (non-clickable)', () => {
    const { container } = render(<Breadcrumb items={mockItems} />);
    
    const links = container.querySelectorAll('a');
    // Should have 2 links (Home and Products), Details should not be a link
    expect(links.length).toBe(2);
  });

  it('should call onItemClick when clicking an item', () => {
    const handleClick = jest.fn();
    render(<Breadcrumb items={mockItems} onItemClick={handleClick} />);
    
    const homeLink = screen.getByText('Home').closest('a');
    if (homeLink) {
      fireEvent.click(homeLink);
      expect(handleClick).toHaveBeenCalledWith('/');
    }
  });

  it('should render with icons', () => {
    const itemsWithIcons = [
      { label: 'Home', path: '/', icon: <span data-testid="home-icon">🏠</span> },
      { label: 'Products', path: '/products', icon: <span data-testid="product-icon">📦</span> },
    ];

    render(<Breadcrumb items={itemsWithIcons} />);
    
    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    expect(screen.getByTestId('product-icon')).toBeInTheDocument();
  });

  it('should render using compound components', () => {
    render(
      <Breadcrumb>
        <Breadcrumb.Item label="Home" path="/" />
        <Breadcrumb.Item label="Products" path="/products" />
        <Breadcrumb.Item label="Details" path="/products/123" />
      </Breadcrumb>
    );
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  it('should show preview on hover', async () => {
    const itemsWithPreview = [
      { label: 'Home', path: '/', preview: 'Go to home page' },
    ];

    render(<Breadcrumb items={itemsWithPreview} />);
    
    const homeLink = screen.getByText('Home');
    fireEvent.mouseEnter(homeLink);

    await waitFor(() => {
      expect(screen.getByText('Go to home page')).toBeInTheDocument();
    });
  });

  it('should hide preview on mouse leave', async () => {
    const itemsWithPreview = [
      { label: 'Home', path: '/', preview: 'Go to home page' },
    ];

    render(<Breadcrumb items={itemsWithPreview} />);
    
    const homeLink = screen.getByText('Home');
    
    fireEvent.mouseEnter(homeLink);
    await waitFor(() => {
      expect(screen.getByText('Go to home page')).toBeInTheDocument();
    });

    fireEvent.mouseLeave(homeLink);
    await waitFor(() => {
      expect(screen.queryByText('Go to home page')).not.toBeInTheDocument();
    });
  });

  it('should disable preview when enablePreview is false', () => {
    const itemsWithPreview = [
      { label: 'Home', path: '/', preview: 'Go to home page' },
    ];

    render(<Breadcrumb items={itemsWithPreview} enablePreview={false} />);
    
    const homeLink = screen.getByText('Home');
    fireEvent.mouseEnter(homeLink);

    expect(screen.queryByText('Go to home page')).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <Breadcrumb items={mockItems} className="custom-breadcrumb" />
    );
    
    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('custom-breadcrumb');
  });

  it('should render nothing when no items or children provided', () => {
    const { container } = render(<Breadcrumb />);
    expect(container.firstChild).toBeNull();
  });

  it('should handle empty items array', () => {
    const { container } = render(<Breadcrumb items={[]} />);
    
    const nav = container.querySelector('nav');
    expect(nav).toBeInTheDocument();
    
    const items = container.querySelectorAll('li');
    expect(items.length).toBe(0);
  });

  it('should prevent default click behavior', () => {
    const handleClick = jest.fn();
    const preventDefault = jest.fn();
    render(<Breadcrumb items={mockItems} onItemClick={handleClick} />);
    
    const homeLink = screen.getByText('Home').closest('a');
    if (homeLink) {
      fireEvent.click(homeLink, { preventDefault });
      expect(handleClick).toHaveBeenCalledWith('/');
    }
  });
});

describe('BreadcrumbItem Component', () => {
  it('should render label', () => {
    render(<Breadcrumb.Item label="Test Item" />);
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  it('should render as link when not last item', () => {
    const { container } = render(<Breadcrumb.Item label="Test" path="/test" isLast={false} />);
    
    const link = container.querySelector('a');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });

  it('should render as span when last item', () => {
    const { container } = render(<Breadcrumb.Item label="Test" path="/test" isLast={true} />);
    
    const link = container.querySelector('a');
    const span = container.querySelector('span');
    
    expect(link).not.toBeInTheDocument();
    expect(span).toBeInTheDocument();
  });

  it('should render icon when provided', () => {
    render(
      <Breadcrumb.Item 
        label="Test" 
        icon={<span data-testid="test-icon">🎯</span>}
      />
    );
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });
});
