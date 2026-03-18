import React, { memo, useEffect, useState } from 'react';

import type { BasePreviewProps } from './Preview.types';
import { getPreviewUrl } from './Preview.types';

export type AudioPreviewProps = BasePreviewProps;

const AudioPreview: React.FC<AudioPreviewProps> = ({ value, className = '', style }) => {
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
      <audio controls className="min-w-80">
        <source src={url} type={typeof value === 'string' ? undefined : value.type} />
        Your browser does not support the audio tag.
      </audio>
    </div>
  );
};

export default memo(AudioPreview);
