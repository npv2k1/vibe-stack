import { useCallback, useRef, useState } from 'react';

/**
 * Configuration options for the useCamera hook.
 */
interface UseCameraOptions {
  /** Optional error callback fired when camera operations fail */
  onError?: (error: Error) => void;
}

/**
 * Represents a camera device available on the system.
 */
interface CameraDevice {
  /** Unique identifier for the camera device */
  deviceId: string;
  /** Human-readable label for the camera device */
  label: string;
}

/**
 * Return type for the useCamera hook containing all camera controls and state.
 */
export interface UseCameraReturn {
  /** Ref to attach to the HTML video element for camera display */
  videoRef: React.RefObject<HTMLVideoElement>;
  /** Whether the camera is currently streaming */
  isStreaming: boolean;
  /** Array of available camera devices */
  availableCameras: CameraDevice[];
  /** Device ID of the currently active camera */
  currentCamera: string | null;
  /** Function to start the camera stream */
  startCamera: () => Promise<void>;
  /** Function to stop the camera stream */
  stopCamera: () => void;
  /** Function to switch to a different camera */
  switchCamera: (deviceId: string) => Promise<void>;
  /** Function to start video recording */
  startRecording: () => Promise<void>;
  /** Function to stop video recording and download the file */
  stopRecording: () => Promise<void> | undefined;
  /** Whether video recording is currently active */
  isRecording: boolean;
  /** Function to capture a photo and return it as a data URL */
  capturePhoto: () => string;
}

/**
 * A comprehensive React hook for camera functionality including streaming,
 * recording, photo capture, and camera switching using the MediaDevices API.
 *
 * @param options - Configuration options for the camera hook
 * @returns An object containing camera controls, state, and utilities
 *
 * @example
 * ```tsx
 * const CameraComponent = () => {
 *   const {
 *     videoRef,
 *     isStreaming,
 *     availableCameras,
 *     currentCamera,
 *     startCamera,
 *     stopCamera,
 *     switchCamera,
 *     startRecording,
 *     stopRecording,
 *     isRecording,
 *     capturePhoto
 *   } = useCamera({
 *     onError: (error) => console.error('Camera error:', error)
 *   });
 *
 *   return (
 *     <div>
 *       <video ref={videoRef} autoPlay playsInline />
 *
 *       {!isStreaming ? (
 *         <button onClick={startCamera}>Start Camera</button>
 *       ) : (
 *         <div>
 *           <button onClick={stopCamera}>Stop Camera</button>
 *
 *           <select
 *             value={currentCamera || ''}
 *             onChange={(e) => switchCamera(e.target.value)}
 *           >
 *             {availableCameras.map(camera => (
 *               <option key={camera.deviceId} value={camera.deviceId}>
 *                 {camera.label}
 *               </option>
 *             ))}
 *           </select>
 *
 *           <button onClick={capturePhoto}>Take Photo</button>
 *
 *           {!isRecording ? (
 *             <button onClick={startRecording}>Start Recording</button>
 *           ) : (
 *             <button onClick={stopRecording}>Stop Recording</button>
 *           )}
 *         </div>
 *       )}
 *     </div>
 *   );
 * };
 * ```
 */
export const useCamera = ({ onError }: UseCameraOptions = {}): UseCameraReturn => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [isStreaming, setIsStreaming] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [availableCameras, setAvailableCameras] = useState<CameraDevice[]>([]);
  const [currentCamera, setCurrentCamera] = useState<string | null>(null);

  const handleError = useCallback(
    (error: Error) => {
      console.error('Camera Error:', error);
      onError?.(error);
    },
    [onError],
  );

  const getCameras = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices
        .filter((device) => device.kind === 'videoinput')
        .map((device) => ({
          deviceId: device.deviceId,
          label: device.label || `Camera ${device.deviceId.slice(0, 4)}`,
        }));
      setAvailableCameras(cameras);
    } catch (error) {
      handleError(error as Error);
    }
  }, [handleError]);

  const startCamera = useCallback(async () => {
    try {
      await getCameras();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: currentCamera ? { exact: currentCamera } : undefined,
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsStreaming(true);

        if (!currentCamera) {
          const track = stream.getVideoTracks()[0];
          const settings = track.getSettings();
          setCurrentCamera(settings.deviceId || null);
        }
      }
    } catch (error) {
      handleError(error as Error);
    }
  }, [currentCamera, getCameras, handleError]);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  }, []);

  const switchCamera = useCallback(
    async (deviceId: string) => {
      setCurrentCamera(deviceId);
      stopCamera();
      await startCamera();
    },
    [startCamera, stopCamera],
  );

  const startRecording = useCallback(async () => {
    if (!videoRef.current?.srcObject) return;

    chunksRef.current = [];
    const stream = videoRef.current.srcObject as MediaStream;
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9',
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
  }, []);

  const stopRecording = useCallback(() => {
    if (!mediaRecorderRef.current) return;

    return new Promise<void>((resolve) => {
      mediaRecorderRef.current!.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `recording_${new Date().toISOString()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        setIsRecording(false);
        resolve();
      };

      mediaRecorderRef.current!.stop();
    });
  }, []);

  const capturePhoto = useCallback((): string => {
    if (!videoRef.current) return '';

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const context = canvas.getContext('2d');
    context?.drawImage(videoRef.current, 0, 0);

    return canvas.toDataURL('image/jpeg');
  }, []);

  return {
    videoRef,
    isStreaming,
    availableCameras,
    currentCamera,
    startCamera,
    stopCamera,
    switchCamera,
    startRecording,
    stopRecording,
    isRecording,
    capturePhoto,
  };
};
