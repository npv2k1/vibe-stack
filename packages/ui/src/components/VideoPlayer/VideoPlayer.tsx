import React, { forwardRef, useRef, useState, useEffect, useCallback, useImperativeHandle, memo } from 'react';
import { Icon } from '../Icon';
import { cn } from '../utils';

export interface VideoPlayerProps extends Omit<React.VideoHTMLAttributes<HTMLVideoElement>, 'controls' | 'src' | 'onPlay' | 'onPause' | 'onEnded' | 'onTimeUpdate' | 'onVolumeChange'> {
  /**
   * Video source URL or array of source objects
   */
  src: string | { src: string; type: string }[];

  /**
   * Whether to show video controls
   * @default true
   */
  showControls?: boolean;

  /**
   * Whether to autoplay the video
   * @default false
   */
  autoPlay?: boolean;

  /**
   * Whether to loop the video
   * @default false
   */
  loop?: boolean;

  /**
   * Whether to mute the video
   * @default false
   */
  muted?: boolean;

  /**
   * Custom class name for the container
   */
  className?: string;

  /**
   * Custom class name for the video element
   */
  videoClassName?: string;

  /**
   * Width of the video player
   */
  width?: string | number;

  /**
   * Height of the video player
   */
  height?: string | number;

  /**
   * Poster image URL
   */
  poster?: string;

  /**
   * Callback when video starts playing
   */
  onPlay?: () => void;

  /**
   * Callback when video is paused
   */
  onPause?: () => void;

  /**
   * Callback when video ends
   */
  onEnded?: () => void;

  /**
   * Callback when video time updates
   */
  onTimeUpdate?: (currentTime: number) => void;

  /**
   * Callback when volume changes
   */
  onVolumeChange?: (volume: number) => void;

  /**
   * Whether to enable keyboard shortcuts
   * @default true
   */
  enableKeyboardShortcuts?: boolean;
}

export interface VideoPlayerRef {
  /**
   * Play the video
   */
  play: () => Promise<void>;

  /**
   * Pause the video
   */
  pause: () => void;

  /**
   * Toggle play/pause
   */
  togglePlay: () => void;

  /**
   * Seek to a specific time
   */
  seek: (time: number) => void;

  /**
   * Set volume (0-1)
   */
  setVolume: (volume: number) => void;

  /**
   * Toggle mute
   */
  toggleMute: () => void;

  /**
   * Enter fullscreen
   */
  requestFullscreen: () => void;

  /**
   * Exit fullscreen
   */
  exitFullscreen: () => void;

  /**
   * Toggle fullscreen
   */
  toggleFullscreen: () => void;

  /**
   * Get current time
   */
  getCurrentTime: () => number;

  /**
   * Get duration
   */
  getDuration: () => number;

  /**
   * Get video element
   */
  getVideoElement: () => HTMLVideoElement | null;
}

const formatTime = (seconds: number): string => {
  if (isNaN(seconds)) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const VideoPlayer = memo(
  forwardRef<VideoPlayerRef, VideoPlayerProps>(function VideoPlayer(props, ref) {
    const {
      src,
      showControls = true,
      autoPlay = false,
      loop = false,
      muted: initialMuted = false,
      className,
      videoClassName,
      width,
      height,
      poster,
      onPlay,
      onPause,
      onEnded,
      onTimeUpdate,
      onVolumeChange,
      enableKeyboardShortcuts = true,
      ...restProps
    } = props;

    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolumeState] = useState(1);
    const [isMuted, setIsMuted] = useState(initialMuted);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [isSeeking, setIsSeeking] = useState(false);

    // Play/Pause handlers
    const handlePlay = useCallback(() => {
      setIsPlaying(true);
      onPlay?.();
    }, [onPlay]);

    const handlePause = useCallback(() => {
      setIsPlaying(false);
      onPause?.();
    }, [onPause]);

    const handleEnded = useCallback(() => {
      setIsPlaying(false);
      onEnded?.();
    }, [onEnded]);

    const togglePlay = useCallback(async () => {
      if (!videoRef.current) return;
      
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        try {
          await videoRef.current.play();
        } catch (error) {
          console.error('Error playing video:', error);
        }
      }
    }, [isPlaying]);

    // Time handlers
    const handleTimeUpdate = useCallback(() => {
      if (!videoRef.current || isSeeking) return;
      
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      onTimeUpdate?.(time);
    }, [onTimeUpdate, isSeeking]);

    const handleLoadedMetadata = useCallback(() => {
      if (!videoRef.current) return;
      setDuration(videoRef.current.duration);
    }, []);

    const seek = useCallback((time: number) => {
      if (!videoRef.current) return;
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }, []);

    const handleProgressBarClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressBarRef.current || !videoRef.current) return;
      
      const rect = progressBarRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const time = pos * duration;
      seek(time);
    }, [duration, seek]);

    const handleProgressBarMouseDown = useCallback(() => {
      setIsSeeking(true);
    }, []);

    const handleProgressBarMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      if (!isSeeking || !progressBarRef.current) return;
      
      const rect = progressBarRef.current.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const time = pos * duration;
      setCurrentTime(time);
    }, [isSeeking, duration]);

    const handleProgressBarMouseUp = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      if (!isSeeking || !progressBarRef.current || !videoRef.current) return;
      
      const rect = progressBarRef.current.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const time = pos * duration;
      seek(time);
      setIsSeeking(false);
    }, [isSeeking, duration, seek]);

    useEffect(() => {
      if (!isSeeking) return;
      
      const handleMouseUp = () => {
        setIsSeeking(false);
      };
      
      document.addEventListener('mouseup', handleMouseUp);
      return () => document.removeEventListener('mouseup', handleMouseUp);
    }, [isSeeking]);

    // Volume handlers
    const handleVolumeChange = useCallback(() => {
      if (!videoRef.current) return;
      setVolumeState(videoRef.current.volume);
      setIsMuted(videoRef.current.muted);
      onVolumeChange?.(videoRef.current.volume);
    }, [onVolumeChange]);

    const setVolume = useCallback((vol: number) => {
      if (!videoRef.current) return;
      const clampedVolume = Math.max(0, Math.min(1, vol));
      videoRef.current.volume = clampedVolume;
      setVolumeState(clampedVolume);
      if (clampedVolume > 0) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }, []);

    const toggleMute = useCallback(() => {
      if (!videoRef.current) return;
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }, []);

    // Fullscreen handlers
    const requestFullscreen = useCallback(() => {
      if (!containerRef.current) return;
      
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    }, []);

    const exitFullscreen = useCallback(() => {
      if (document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen();
      }
    }, []);

    const toggleFullscreen = useCallback(() => {
      if (document.fullscreenElement) {
        exitFullscreen();
      } else {
        requestFullscreen();
      }
    }, [requestFullscreen, exitFullscreen]);

    useEffect(() => {
      const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
      };
      
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
      if (!enableKeyboardShortcuts) return;
      
      const handleKeyDown = (e: KeyboardEvent) => {
        // Only handle shortcuts if the container or video is focused
        if (!containerRef.current?.contains(document.activeElement)) return;
        
        switch (e.key) {
          case ' ':
          case 'k':
            e.preventDefault();
            togglePlay();
            break;
          case 'ArrowLeft':
            e.preventDefault();
            seek(Math.max(0, currentTime - 5));
            break;
          case 'ArrowRight':
            e.preventDefault();
            seek(Math.min(duration, currentTime + 5));
            break;
          case 'ArrowUp':
            e.preventDefault();
            setVolume(Math.min(1, volume + 0.1));
            break;
          case 'ArrowDown':
            e.preventDefault();
            setVolume(Math.max(0, volume - 0.1));
            break;
          case 'm':
            e.preventDefault();
            toggleMute();
            break;
          case 'f':
            e.preventDefault();
            toggleFullscreen();
            break;
          default:
            break;
        }
      };
      
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [enableKeyboardShortcuts, togglePlay, seek, currentTime, duration, setVolume, volume, toggleMute, toggleFullscreen]);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      play: async () => {
        if (videoRef.current) {
          await videoRef.current.play();
        }
      },
      pause: () => {
        if (videoRef.current) {
          videoRef.current.pause();
        }
      },
      togglePlay,
      seek,
      setVolume,
      toggleMute,
      requestFullscreen,
      exitFullscreen,
      toggleFullscreen,
      getCurrentTime: () => currentTime,
      getDuration: () => duration,
      getVideoElement: () => videoRef.current,
    }), [togglePlay, seek, setVolume, toggleMute, requestFullscreen, exitFullscreen, toggleFullscreen, currentTime, duration]);

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
      <div
        ref={containerRef}
        className={cn('relative bg-black group', className)}
        style={{ width, height }}
        tabIndex={0}
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          className={cn('w-full h-full', videoClassName)}
          autoPlay={autoPlay}
          loop={loop}
          muted={initialMuted}
          poster={poster}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onVolumeChange={handleVolumeChange}
          onClick={togglePlay}
          {...restProps}
        >
          {Array.isArray(src) ? (
            src.map((source, index) => (
              <source key={index} src={source.src} type={source.type} />
            ))
          ) : (
            <source src={src} />
          )}
          Your browser does not support the video tag.
        </video>

        {/* Controls */}
        {showControls && (
          <div className={cn(
            'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4',
            'opacity-0 group-hover:opacity-100 transition-opacity duration-300'
          )}>
            {/* Progress Bar */}
            <div
              ref={progressBarRef}
              className="w-full h-1 bg-gray-600 rounded cursor-pointer mb-3 relative group/progress"
              onClick={handleProgressBarClick}
              onMouseDown={handleProgressBarMouseDown}
              onMouseMove={handleProgressBarMouseMove}
              onMouseUp={handleProgressBarMouseUp}
            >
              <div
                className="absolute top-0 left-0 h-full bg-blue-500 rounded transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity"
                style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
              />
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between text-white">
              {/* Left Controls */}
              <div className="flex items-center space-x-3">
                {/* Play/Pause Button */}
                <button
                  onClick={togglePlay}
                  className="hover:bg-white/20 p-2 rounded transition-colors"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  <Icon
                    name={isPlaying ? 'Pause' : 'Play'}
                    fontSize={20}
                    className="text-white"
                  />
                </button>

                {/* Time Display */}
                <div className="text-sm font-medium">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              {/* Right Controls */}
              <div className="flex items-center space-x-3">
                {/* Volume Control */}
                <div
                  className="relative flex items-center"
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  <button
                    onClick={toggleMute}
                    className="hover:bg-white/20 p-2 rounded transition-colors"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    <Icon
                      name={isMuted || volume === 0 ? 'VolumeX' : volume < 0.5 ? 'Volume1' : 'Volume2'}
                      fontSize={20}
                      className="text-white"
                    />
                  </button>

                  {/* Volume Slider */}
                  {showVolumeSlider && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black/90 p-2 rounded">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-20 h-1 accent-blue-500 cursor-pointer"
                        style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
                        aria-label="Volume"
                      />
                    </div>
                  )}
                </div>

                {/* Fullscreen Button */}
                <button
                  onClick={toggleFullscreen}
                  className="hover:bg-white/20 p-2 rounded transition-colors"
                  aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                >
                  <Icon
                    name={isFullscreen ? 'Minimize' : 'Maximize'}
                    fontSize={20}
                    className="text-white"
                  />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  })
);

VideoPlayer.displayName = 'VideoPlayer';
