import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VideoPlayer, VideoPlayerRef } from './VideoPlayer';
import '@testing-library/jest-dom';
import { createRef } from 'react';
import { vi } from 'vitest';

// Mock the Icon component
vi.mock('../Icon', () => ({
  Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`}>{name}</span>,
}));

describe('VideoPlayer Component', () => {
  const mockSrc = 'https://example.com/video.mp4';
  
  beforeEach(() => {
    // Mock HTMLMediaElement methods
    window.HTMLMediaElement.prototype.play = vi.fn(() => Promise.resolve());
    window.HTMLMediaElement.prototype.pause = vi.fn();
    window.HTMLMediaElement.prototype.load = vi.fn();
  });

  it('should render video element with src', () => {
    const { container } = render(<VideoPlayer src={mockSrc} />);
    const video = container.querySelector('video');
    
    expect(video).toBeInTheDocument();
    const source = video?.querySelector('source');
    expect(source).toHaveAttribute('src', mockSrc);
  });

  it('should render with multiple sources', () => {
    const sources = [
      { src: 'video.mp4', type: 'video/mp4' },
      { src: 'video.webm', type: 'video/webm' },
    ];
    
    const { container } = render(<VideoPlayer src={sources} />);
    const video = container.querySelector('video');
    const sourceElements = video?.querySelectorAll('source');
    
    expect(sourceElements).toHaveLength(2);
    expect(sourceElements?.[0]).toHaveAttribute('src', 'video.mp4');
    expect(sourceElements?.[0]).toHaveAttribute('type', 'video/mp4');
    expect(sourceElements?.[1]).toHaveAttribute('src', 'video.webm');
    expect(sourceElements?.[1]).toHaveAttribute('type', 'video/webm');
  });

  it('should show controls by default', () => {
    render(<VideoPlayer src={mockSrc} />);
    
    // Controls should be visible on hover
    const playButton = screen.getByLabelText('Play');
    expect(playButton).toBeInTheDocument();
  });

  it('should hide controls when showControls is false', () => {
    render(<VideoPlayer src={mockSrc} showControls={false} />);
    
    const playButton = screen.queryByLabelText('Play');
    expect(playButton).not.toBeInTheDocument();
  });

  it('should toggle play/pause when play button is clicked', async () => {
    const { container } = render(<VideoPlayer src={mockSrc} />);
    const video = container.querySelector('video') as HTMLVideoElement;
    const playButton = screen.getByLabelText('Play');
    
    // Click play button
    fireEvent.click(playButton);
    
    await waitFor(() => {
      expect(video.play).toHaveBeenCalled();
    });
  });

  it('should toggle play/pause when video is clicked', async () => {
    const { container } = render(<VideoPlayer src={mockSrc} />);
    const video = container.querySelector('video') as HTMLVideoElement;
    
    // Click video
    fireEvent.click(video);
    
    await waitFor(() => {
      expect(video.play).toHaveBeenCalled();
    });
  });

  it('should call onPlay callback when video starts playing', async () => {
    const handlePlay = vi.fn();
    const { container } = render(<VideoPlayer src={mockSrc} onPlay={handlePlay} />);
    const video = container.querySelector('video') as HTMLVideoElement;
    
    fireEvent.play(video);
    
    await waitFor(() => {
      expect(handlePlay).toHaveBeenCalled();
    });
  });

  it('should call onPause callback when video is paused', async () => {
    const handlePause = vi.fn();
    const { container } = render(<VideoPlayer src={mockSrc} onPause={handlePause} />);
    const video = container.querySelector('video') as HTMLVideoElement;
    
    fireEvent.pause(video);
    
    await waitFor(() => {
      expect(handlePause).toHaveBeenCalled();
    });
  });

  it('should call onEnded callback when video ends', async () => {
    const handleEnded = vi.fn();
    const { container } = render(<VideoPlayer src={mockSrc} onEnded={handleEnded} />);
    const video = container.querySelector('video') as HTMLVideoElement;
    
    fireEvent.ended(video);
    
    await waitFor(() => {
      expect(handleEnded).toHaveBeenCalled();
    });
  });

  it('should update progress on timeupdate', async () => {
    const handleTimeUpdate = vi.fn();
    const { container } = render(<VideoPlayer src={mockSrc} onTimeUpdate={handleTimeUpdate} />);
    const video = container.querySelector('video') as HTMLVideoElement;
    
    // Mock currentTime
    Object.defineProperty(video, 'currentTime', { value: 10, writable: true });
    
    fireEvent.timeUpdate(video);
    
    await waitFor(() => {
      expect(handleTimeUpdate).toHaveBeenCalledWith(10);
    });
  });

  it('should seek when clicking on progress bar', async () => {
    const { container } = render(<VideoPlayer src={mockSrc} />);
    const video = container.querySelector('video') as HTMLVideoElement;
    
    // Mock duration
    Object.defineProperty(video, 'duration', { value: 100, writable: true });
    fireEvent.loadedMetadata(video);
    
    const progressBar = container.querySelector('.bg-gray-600') as HTMLElement;
    
    // Mock getBoundingClientRect
    progressBar.getBoundingClientRect = vi.fn(() => ({
      left: 0,
      width: 100,
      top: 0,
      right: 100,
      bottom: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));
    
    fireEvent.click(progressBar, { clientX: 50 });
    
    await waitFor(() => {
      expect(video.currentTime).toBe(50);
    });
  });

  it('should toggle mute when mute button is clicked', () => {
    const { container } = render(<VideoPlayer src={mockSrc} />);
    const video = container.querySelector('video') as HTMLVideoElement;
    const muteButton = screen.getByLabelText('Mute');
    
    expect(video.muted).toBe(false);
    
    fireEvent.click(muteButton);
    
    expect(video.muted).toBe(true);
  });

  it('should toggle fullscreen when fullscreen button is clicked', () => {
    const { container } = render(<VideoPlayer src={mockSrc} />);
    const fullscreenButton = screen.getByLabelText('Enter fullscreen');
    
    // Mock requestFullscreen
    const containerDiv = container.querySelector('.relative') as HTMLElement;
    containerDiv.requestFullscreen = vi.fn();
    
    fireEvent.click(fullscreenButton);
    
    expect(containerDiv.requestFullscreen).toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    const { container } = render(<VideoPlayer src={mockSrc} className="custom-player" />);
    const playerContainer = container.querySelector('.relative');
    
    expect(playerContainer).toHaveClass('custom-player');
  });

  it('should apply custom videoClassName', () => {
    const { container } = render(<VideoPlayer src={mockSrc} videoClassName="custom-video" />);
    const video = container.querySelector('video');
    
    expect(video).toHaveClass('custom-video');
  });

  it('should set width and height', () => {
    const { container } = render(<VideoPlayer src={mockSrc} width={640} height={360} />);
    const playerContainer = container.querySelector('.relative') as HTMLElement;
    
    expect(playerContainer.style.width).toBe('640px');
    expect(playerContainer.style.height).toBe('360px');
  });

  it('should display poster image', () => {
    const poster = 'https://example.com/poster.jpg';
    const { container } = render(<VideoPlayer src={mockSrc} poster={poster} />);
    const video = container.querySelector('video');
    
    expect(video).toHaveAttribute('poster', poster);
  });

  it('should autoplay when autoPlay is true', () => {
    const { container } = render(<VideoPlayer src={mockSrc} autoPlay />);
    const video = container.querySelector('video');
    
    expect(video).toHaveAttribute('autoplay');
  });

  it('should loop when loop is true', () => {
    const { container } = render(<VideoPlayer src={mockSrc} loop />);
    const video = container.querySelector('video');
    
    expect(video).toHaveAttribute('loop');
  });

  it('should be muted when muted is true', () => {
    const { container } = render(<VideoPlayer src={mockSrc} muted />);
    const video = container.querySelector('video') as HTMLVideoElement;
    
    expect(video.muted).toBe(true);
  });

  describe('VideoPlayer Ref', () => {
    it('should expose play method', async () => {
      const ref = createRef<VideoPlayerRef>();
      const { container } = render(<VideoPlayer ref={ref} src={mockSrc} />);
      const video = container.querySelector('video') as HTMLVideoElement;
      
      await ref.current?.play();
      
      expect(video.play).toHaveBeenCalled();
    });

    it('should expose pause method', () => {
      const ref = createRef<VideoPlayerRef>();
      const { container } = render(<VideoPlayer ref={ref} src={mockSrc} />);
      const video = container.querySelector('video') as HTMLVideoElement;
      
      ref.current?.pause();
      
      expect(video.pause).toHaveBeenCalled();
    });

    it('should expose seek method', () => {
      const ref = createRef<VideoPlayerRef>();
      const { container } = render(<VideoPlayer ref={ref} src={mockSrc} />);
      const video = container.querySelector('video') as HTMLVideoElement;
      
      ref.current?.seek(50);
      
      expect(video.currentTime).toBe(50);
    });

    it('should expose setVolume method', () => {
      const ref = createRef<VideoPlayerRef>();
      const { container } = render(<VideoPlayer ref={ref} src={mockSrc} />);
      const video = container.querySelector('video') as HTMLVideoElement;
      
      ref.current?.setVolume(0.5);
      
      expect(video.volume).toBe(0.5);
    });

    it('should expose toggleMute method', () => {
      const ref = createRef<VideoPlayerRef>();
      const { container } = render(<VideoPlayer ref={ref} src={mockSrc} />);
      const video = container.querySelector('video') as HTMLVideoElement;
      
      expect(video.muted).toBe(false);
      
      ref.current?.toggleMute();
      
      expect(video.muted).toBe(true);
    });

    it('should expose getCurrentTime method', () => {
      const ref = createRef<VideoPlayerRef>();
      const { container } = render(<VideoPlayer ref={ref} src={mockSrc} />);
      const video = container.querySelector('video') as HTMLVideoElement;
      
      Object.defineProperty(video, 'currentTime', { value: 42, writable: true });
      fireEvent.timeUpdate(video);
      
      expect(ref.current?.getCurrentTime()).toBe(42);
    });

    it('should expose getDuration method', () => {
      const ref = createRef<VideoPlayerRef>();
      const { container } = render(<VideoPlayer ref={ref} src={mockSrc} />);
      const video = container.querySelector('video') as HTMLVideoElement;
      
      Object.defineProperty(video, 'duration', { value: 120, writable: true });
      fireEvent.loadedMetadata(video);
      
      expect(ref.current?.getDuration()).toBe(120);
    });

    it('should expose getVideoElement method', () => {
      const ref = createRef<VideoPlayerRef>();
      const { container } = render(<VideoPlayer ref={ref} src={mockSrc} />);
      const video = container.querySelector('video');
      
      expect(ref.current?.getVideoElement()).toBe(video);
    });
  });

  describe('Time formatting', () => {
    it('should display time in MM:SS format for short videos', () => {
      const { container } = render(<VideoPlayer src={mockSrc} />);
      const video = container.querySelector('video') as HTMLVideoElement;
      
      Object.defineProperty(video, 'duration', { value: 90, writable: true });
      Object.defineProperty(video, 'currentTime', { value: 45, writable: true });
      
      fireEvent.loadedMetadata(video);
      fireEvent.timeUpdate(video);
      
      expect(screen.getByText(/0:45 \/ 1:30/)).toBeInTheDocument();
    });

    it('should display time in H:MM:SS format for long videos', () => {
      const { container } = render(<VideoPlayer src={mockSrc} />);
      const video = container.querySelector('video') as HTMLVideoElement;
      
      Object.defineProperty(video, 'duration', { value: 7200, writable: true });
      Object.defineProperty(video, 'currentTime', { value: 3661, writable: true });
      
      fireEvent.loadedMetadata(video);
      fireEvent.timeUpdate(video);
      
      expect(screen.getByText(/1:01:01 \/ 2:00:00/)).toBeInTheDocument();
    });
  });

  describe('Volume slider', () => {
    it('should show volume slider on hover', async () => {
      render(<VideoPlayer src={mockSrc} />);
      const muteButton = screen.getByLabelText('Mute');
      const volumeControl = muteButton.closest('.relative') as HTMLElement;
      
      fireEvent.mouseEnter(volumeControl);
      
      await waitFor(() => {
        const volumeSlider = screen.getByLabelText('Volume');
        expect(volumeSlider).toBeInTheDocument();
      });
    });

    it('should hide volume slider on mouse leave', async () => {
      render(<VideoPlayer src={mockSrc} />);
      const muteButton = screen.getByLabelText('Mute');
      const volumeControl = muteButton.closest('.relative') as HTMLElement;
      
      fireEvent.mouseEnter(volumeControl);
      
      await waitFor(() => {
        expect(screen.getByLabelText('Volume')).toBeInTheDocument();
      });
      
      fireEvent.mouseLeave(volumeControl);
      
      await waitFor(() => {
        expect(screen.queryByLabelText('Volume')).not.toBeInTheDocument();
      });
    });

    it('should change volume when slider is adjusted', async () => {
      const { container } = render(<VideoPlayer src={mockSrc} />);
      const video = container.querySelector('video') as HTMLVideoElement;
      const muteButton = screen.getByLabelText('Mute');
      const volumeControl = muteButton.closest('.relative') as HTMLElement;
      
      fireEvent.mouseEnter(volumeControl);
      
      await waitFor(() => {
        const volumeSlider = screen.getByLabelText('Volume') as HTMLInputElement;
        fireEvent.change(volumeSlider, { target: { value: '0.7' } });
        expect(video.volume).toBe(0.7);
      });
    });
  });

  describe('Keyboard shortcuts', () => {
    beforeEach(() => {
      // Focus the container to enable keyboard shortcuts
      document.body.focus();
    });

    it('should toggle play/pause with space key', async () => {
      const { container } = render(<VideoPlayer src={mockSrc} />);
      const playerContainer = container.querySelector('.relative') as HTMLElement;
      const video = container.querySelector('video') as HTMLVideoElement;
      
      playerContainer.focus();
      fireEvent.keyDown(document, { key: ' ' });
      
      await waitFor(() => {
        expect(video.play).toHaveBeenCalled();
      });
    });

    it('should not respond to keyboard shortcuts when enableKeyboardShortcuts is false', () => {
      const { container } = render(<VideoPlayer src={mockSrc} enableKeyboardShortcuts={false} />);
      const playerContainer = container.querySelector('.relative') as HTMLElement;
      const video = container.querySelector('video') as HTMLVideoElement;
      
      playerContainer.focus();
      fireEvent.keyDown(document, { key: ' ' });
      
      expect(video.play).not.toHaveBeenCalled();
    });
  });
});
