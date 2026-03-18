/**
 * Preview component type definitions
 */

export type PreviewSource = File | string; // File object or URL string

export interface BasePreviewProps {
  /** The file or URL to preview */
  value: PreviewSource;
  /** Callback when the file is modified (only applicable for editable previews) */
  onChange?: (file: File) => void;
  /** Custom class name */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

export interface ModalPreviewProps extends BasePreviewProps {
  /** Whether the preview modal is open */
  isOpen: boolean;
  /** Callback to close the preview modal */
  onClose: () => void;
  /** Callback when saving changes */
  onSave?: (file: File) => void;
}

export type SupportedFileType =
  | 'image'
  | 'video'
  | 'audio'
  | 'pdf'
  | 'document' // Word, Excel, PowerPoint
  | 'text'
  | 'unknown';

export interface PreviewProps {
  /** The file to preview */
  file: File;
  /** Callback when the file changes */
  onChange?: (file: File) => void;
  /** Custom class name */
  className?: string;
  /** Whether to show preview controls */
  showControls?: boolean;
}

/**
 * Detect file type from MIME type or file extension
 */
export const getFileType = (file: File | string): SupportedFileType => {
  let mimeType = '';
  let fileName = '';

  if (typeof file === 'string') {
    // URL string - try to detect from extension
    fileName = file.toLowerCase();
  } else {
    mimeType = file.type.toLowerCase();
    fileName = file.name.toLowerCase();
  }

  // Image types
  if (mimeType.startsWith('image/') || /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/.test(fileName)) {
    return 'image';
  }

  // Video types
  if (mimeType.startsWith('video/') || /\.(mp4|webm|ogg|avi|mov|wmv|flv)$/.test(fileName)) {
    return 'video';
  }

  // Audio types
  if (mimeType.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|aac|flac)$/.test(fileName)) {
    return 'audio';
  }

  // PDF
  if (mimeType === 'application/pdf' || fileName.endsWith('.pdf')) {
    return 'pdf';
  }

  // Microsoft Office documents
  if (
    mimeType.includes('wordprocessingml') ||
    mimeType.includes('spreadsheetml') ||
    mimeType.includes('presentationml') ||
    mimeType.includes('msword') ||
    mimeType.includes('ms-excel') ||
    mimeType.includes('ms-powerpoint') ||
    /\.(doc|docx|xls|xlsx|ppt|pptx)$/.test(fileName)
  ) {
    return 'document';
  }

  // Text files
  if (
    mimeType.startsWith('text/') ||
    mimeType === 'application/json' ||
    mimeType === 'application/javascript' ||
    /\.(txt|md|json|js|ts|jsx|tsx|css|scss|html|xml|yaml|yml|csv)$/.test(fileName)
  ) {
    return 'text';
  }

  return 'unknown';
};

/**
 * Convert URL string to object URL if needed
 */
export const getPreviewUrl = (source: PreviewSource): string => {
  if (typeof source === 'string') {
    return source;
  }
  return URL.createObjectURL(source);
};
