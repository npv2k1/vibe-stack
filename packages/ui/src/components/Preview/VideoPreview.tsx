import React, { memo, useEffect, useState } from 'react';

import type { BasePreviewProps, PreviewSource } from './Preview.types';
import { getPreviewUrl } from './Preview.types';

export type VideoPreviewProps = BasePreviewProps;

const VideoPreview: React.FC<VideoPreviewProps> = ({ value, className = '', style }) => {
  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    const previewUrl = getPreviewUrl(value);
    setUrl(previewUrl);

    // Cleanup function to revoke object URL if it was created from a File
    return () => {
      if (value instanceof File) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [value]);

  if (!url) return null;

  return (
    <div className={`flex items-center justify-center ${className}`} style={style}>
      <video controls className="max-h-full max-w-full rounded-lg">
        <source src={url} type={typeof value === 'string' ? undefined : value.type} />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default memo(VideoPreview);
