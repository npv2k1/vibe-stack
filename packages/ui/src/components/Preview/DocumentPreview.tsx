import React, { memo, useEffect, useState } from 'react';

import { Icon } from '../Icon';

import type { BasePreviewProps } from './Preview.types';
import { getPreviewUrl } from './Preview.types';

export type DocumentPreviewProps = BasePreviewProps & {
  /** Height of the document viewer */
  height?: string | number;
};

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  value,
  className = '',
  style,
  height = '600px',
}) => {
  const [url, setUrl] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');

  useEffect(() => {
    const previewUrl = getPreviewUrl(value);
    setUrl(previewUrl);

    if (value instanceof File) {
      setFileName(value.name);
    } else {
      // Extract filename from URL
      const urlParts = value.split('/');
      setFileName(urlParts[urlParts.length - 1] || 'document');
    }

    // Cleanup function to revoke object URL if it was created from a File
    return () => {
      if (value instanceof File) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [value]);

  if (!url) return null;

  // Use Microsoft Office Online Viewer for document preview
  const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;

  // For File objects, we can't use Office viewer (it needs a public URL)
  // Instead, show a download option
  if (value instanceof File) {
    return (
      <div
        className={`flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 ${className}`}
        style={{ height, ...style }}
      >
        <Icon name="FaFileAlt:fa5" className="h-16 w-16 text-gray-400" />
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">{fileName}</p>
          <p className="mt-2 text-sm text-gray-500">
            Document preview is not available for uploaded files.
          </p>
          <p className="text-sm text-gray-500">Click the button below to download and view.</p>
        </div>
        <a
          href={url}
          download={fileName}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Download Document
        </a>
      </div>
    );
  }

  // For URL strings, use Office viewer
  return (
    <div className={`flex items-center justify-center ${className}`} style={style}>
      <iframe
        src={officeViewerUrl}
        className="w-full rounded-lg border border-gray-300"
        style={{ height }}
        title="Document Preview"
      />
    </div>
  );
};

export default memo(DocumentPreview);
