import React, { memo } from 'react';

import { Icon } from '../Icon';

export type UnsupportedPreviewProps = {
  /** The file or URL that cannot be previewed */
  value: File | string;
  /** Custom class name */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
};

const UnsupportedPreview: React.FC<UnsupportedPreviewProps> = ({ value, className = '', style }) => {
  const fileName = value instanceof File ? value.name : value.split('/').pop() || 'Unknown file';
  const fileSize = value instanceof File ? `${(value.size / 1024).toFixed(2)} KB` : null;

  return (
    <div
      className={`flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 ${className}`}
      style={style}
    >
      <Icon name="FaFileAlt:fa5" className="h-16 w-16 text-gray-400" />
      <div className="text-center">
        <p className="text-lg font-medium text-gray-700">{fileName}</p>
        {fileSize && <p className="mt-1 text-sm text-gray-500">{fileSize}</p>}
        <p className="mt-2 text-sm text-gray-500">Preview not available for this file type.</p>
      </div>
      {value instanceof File && (
        <a
          href={URL.createObjectURL(value)}
          download={fileName}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Download File
        </a>
      )}
    </div>
  );
};

export default memo(UnsupportedPreview);
