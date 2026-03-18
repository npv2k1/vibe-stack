import React, { memo, useEffect, useState } from 'react';

import type { BasePreviewProps } from './Preview.types';
import { getPreviewUrl } from './Preview.types';

export type PDFPreviewProps = BasePreviewProps & {
  /** Height of the PDF viewer */
  height?: string | number;
};

const PDFPreview: React.FC<PDFPreviewProps> = ({
  value,
  className = '',
  style,
  height = '600px',
}) => {
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
      <iframe
        src={url}
        className="w-full rounded-lg border border-gray-300"
        style={{ height }}
        title="PDF Preview"
      />
    </div>
  );
};

export default memo(PDFPreview);
