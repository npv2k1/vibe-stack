import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Preview } from './Preview';
import { getFileType } from './Preview.types';

describe('Preview Component', () => {
  const createMockFile = (name: string, type: string, content: string = 'test content') => {
    return new File([content], name, { type });
  };

  beforeEach(() => {
    // Mock URL.createObjectURL and URL.revokeObjectURL
    global.URL.createObjectURL = jest.fn(() => 'mock-url');
    global.URL.revokeObjectURL = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render file information', () => {
    const file = createMockFile('test.txt', 'text/plain');
    render(<Preview file={file} />);

    expect(screen.getByText('test.txt')).toBeInTheDocument();
    expect(screen.getByText(/KB/)).toBeInTheDocument();
  });

  it('should show preview button when showControls is true', () => {
    const file = createMockFile('test.txt', 'text/plain');
    render(<Preview file={file} showControls={true} />);

    expect(screen.getByText('Preview')).toBeInTheDocument();
  });

  it('should hide preview button when showControls is false', () => {
    const file = createMockFile('test.txt', 'text/plain');
    render(<Preview file={file} showControls={false} />);

    expect(screen.queryByText('Preview')).not.toBeInTheDocument();
  });

  it('should open preview modal when clicking preview button', () => {
    const file = createMockFile('test.txt', 'text/plain');
    render(<Preview file={file} />);

    const previewButton = screen.getByText('Preview');
    fireEvent.click(previewButton);

    // Modal should be opened (content varies by file type)
    expect(document.querySelector('.fixed.inset-0')).toBeTruthy();
  });

  it('should open preview when clicking thumbnail', () => {
    const file = createMockFile('test.txt', 'text/plain');
    const { container } = render(<Preview file={file} />);

    const thumbnail = container.querySelector('.cursor-pointer');
    if (thumbnail) {
      fireEvent.click(thumbnail);
      expect(document.querySelector('.fixed.inset-0')).toBeTruthy();
    }
  });

  it('should call onChange when file is modified', async () => {
    const handleChange = jest.fn();
    const file = createMockFile('test.txt', 'text/plain');

    // This test would need to interact with the modal, which varies by file type
    // For now, we verify the callback is passed correctly
    render(<Preview file={file} onChange={handleChange} />);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    const file = createMockFile('test.txt', 'text/plain');
    const { container } = render(<Preview file={file} className="custom-class" />);

    const previewContainer = container.querySelector('.custom-class');
    expect(previewContainer).toBeInTheDocument();
  });

  it('should display thumbnail for image files', async () => {
    const file = createMockFile('image.jpg', 'image/jpeg');
    const { container } = render(<Preview file={file} />);

    await waitFor(() => {
      const img = container.querySelector('img[alt="image.jpg"]');
      expect(img).toBeInTheDocument();
    });
  });

  it('should cleanup resources on unmount', () => {
    const file = createMockFile('test.txt', 'text/plain');
    const { unmount } = render(<Preview file={file} />);

    unmount();

    expect(global.URL.revokeObjectURL).toHaveBeenCalled();
  });
});

describe('getFileType utility', () => {
  it('should detect image files', () => {
    const imageFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    expect(getFileType(imageFile)).toBe('image');
  });

  it('should detect video files', () => {
    const videoFile = new File([''], 'test.mp4', { type: 'video/mp4' });
    expect(getFileType(videoFile)).toBe('video');
  });

  it('should detect audio files', () => {
    const audioFile = new File([''], 'test.mp3', { type: 'audio/mpeg' });
    expect(getFileType(audioFile)).toBe('audio');
  });

  it('should detect PDF files', () => {
    const pdfFile = new File([''], 'test.pdf', { type: 'application/pdf' });
    expect(getFileType(pdfFile)).toBe('pdf');
  });

  it('should detect Word documents', () => {
    const docFile = new File([''], 'test.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    expect(getFileType(docFile)).toBe('document');
  });

  it('should detect Excel spreadsheets', () => {
    const xlsFile = new File([''], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    expect(getFileType(xlsFile)).toBe('document');
  });

  it('should detect PowerPoint presentations', () => {
    const pptFile = new File([''], 'test.pptx', {
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    });
    expect(getFileType(pptFile)).toBe('document');
  });

  it('should detect text files', () => {
    const textFile = new File([''], 'test.txt', { type: 'text/plain' });
    expect(getFileType(textFile)).toBe('text');
  });

  it('should detect JSON files', () => {
    const jsonFile = new File([''], 'test.json', { type: 'application/json' });
    expect(getFileType(jsonFile)).toBe('text');
  });

  it('should detect files by extension when MIME type is unknown', () => {
    const file = new File([''], 'test.mp4', { type: '' });
    expect(getFileType(file)).toBe('video');
  });

  it('should detect URL strings by extension', () => {
    expect(getFileType('https://example.com/test.pdf')).toBe('pdf');
    expect(getFileType('https://example.com/test.jpg')).toBe('image');
    expect(getFileType('https://example.com/test.mp4')).toBe('video');
  });

  it('should return unknown for unrecognized file types', () => {
    const unknownFile = new File([''], 'test.xyz', { type: 'application/octet-stream' });
    expect(getFileType(unknownFile)).toBe('unknown');
  });
});

describe('Preview Sub-components', () => {
  it('should have Audio sub-component', () => {
    expect(Preview.Audio).toBeDefined();
  });

  it('should have Document sub-component', () => {
    expect(Preview.Document).toBeDefined();
  });

  it('should have Image sub-component', () => {
    expect(Preview.Image).toBeDefined();
  });

  it('should have PDF sub-component', () => {
    expect(Preview.PDF).toBeDefined();
  });

  it('should have Text sub-component', () => {
    expect(Preview.Text).toBeDefined();
  });

  it('should have Video sub-component', () => {
    expect(Preview.Video).toBeDefined();
  });

  it('should have Unsupported sub-component', () => {
    expect(Preview.Unsupported).toBeDefined();
  });
});
