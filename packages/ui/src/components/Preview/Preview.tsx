import React, { useEffect, useState } from 'react';
import moment from 'moment';

import { Icon } from '../Icon';

import AudioPreview from './AudioPreview';
import DocumentPreview from './DocumentPreview';
import ImagePreview from './ImagePreview';
import PDFPreview from './PDFPreview';
import type { PreviewProps, PreviewSource } from './Preview.types';
import { getFileType, getPreviewUrl } from './Preview.types';
import TextPreview from './TextPreview';
import UnsupportedPreview from './UnsupportedPreview';
import VideoPreview from './VideoPreview';

export type { PreviewProps };

export const Preview: React.FC<PreviewProps> = ({ file, onChange, className = '', showControls = true }) => {
  const [openPreview, setOpenPreview] = useState<boolean>(false);
  const [thumbnail, setThumbnail] = useState<string>('');

  useEffect(() => {
    // Generate thumbnail for certain file types
    if (file.type.startsWith('image/') || file.type.startsWith('video/') || file.type.startsWith('audio/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setThumbnail(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }

    return () => {
      if (thumbnail) {
        URL.revokeObjectURL(thumbnail);
      }
    };
  }, [file]);

  const fileType = getFileType(file);

  const renderPreview = () => {
    switch (fileType) {
      case 'image':
        return (
          <ImagePreview
            isOpen={openPreview}
            onClose={() => setOpenPreview(false)}
            value={file}
            onSave={(file) => {
              onChange?.(file);
            }}
          />
        );

      case 'video':
        if (openPreview) {
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
              <div className="relative max-h-[90vh] max-w-[90vw]">
                <button
                  onClick={() => setOpenPreview(false)}
                  className="absolute -right-4 -top-4 rounded-full bg-white p-2 text-gray-800 hover:bg-gray-200"
                >
                  <Icon name="FaTimes:fa5" className="h-6 w-6" />
                </button>
                <VideoPreview value={file} />
              </div>
            </div>
          );
        }
        return null;

      case 'audio':
        if (openPreview) {
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
              <div className="relative rounded-lg bg-white p-8">
                <button
                  onClick={() => setOpenPreview(false)}
                  className="absolute -right-4 -top-4 rounded-full bg-white p-2 text-gray-800 hover:bg-gray-200"
                >
                  <Icon name="FaTimes:fa5" className="h-6 w-6" />
                </button>
                <AudioPreview value={file} />
              </div>
            </div>
          );
        }
        return null;

      case 'pdf':
        if (openPreview) {
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-8">
              <div className="relative h-full w-full max-w-6xl">
                <button
                  onClick={() => setOpenPreview(false)}
                  className="absolute -right-4 -top-4 rounded-full bg-white p-2 text-gray-800 hover:bg-gray-200"
                >
                  <Icon name="FaTimes:fa5" className="h-6 w-6" />
                </button>
                <PDFPreview value={file} height="100%" />
              </div>
            </div>
          );
        }
        return null;

      case 'document':
        if (openPreview) {
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-8">
              <div className="relative h-full w-full max-w-6xl">
                <button
                  onClick={() => setOpenPreview(false)}
                  className="absolute -right-4 -top-4 rounded-full bg-white p-2 text-gray-800 hover:bg-gray-200"
                >
                  <Icon name="FaTimes:fa5" className="h-6 w-6" />
                </button>
                <DocumentPreview value={file} height="100%" />
              </div>
            </div>
          );
        }
        return null;

      case 'text':
        return (
          <TextPreview
            isOpen={openPreview}
            onClose={() => setOpenPreview(false)}
            value={file}
            onSave={(file) => {
              onChange?.(file);
            }}
          />
        );

      case 'unknown':
      default:
        if (openPreview) {
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-8">
              <div className="relative">
                <button
                  onClick={() => setOpenPreview(false)}
                  className="absolute -right-4 -top-4 rounded-full bg-white p-2 text-gray-800 hover:bg-gray-200"
                >
                  <Icon name="FaTimes:fa5" className="h-6 w-6" />
                </button>
                <UnsupportedPreview value={file} />
              </div>
            </div>
          );
        }
        return null;
    }
  };

  return (
    <>
      <div className={`mt-2 flex items-center justify-between rounded-lg border border-gray-300 bg-white p-2 shadow ${className}`}>
        <div className="flex items-center space-x-4">
          <div
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200"
            onClick={() => {
              if (showControls) {
                setOpenPreview(true);
              }
            }}
          >
            {thumbnail ? (
              <img src={thumbnail} alt={file.name} className="h-12 w-12 rounded-md object-cover" />
            ) : (
              <Icon name="FaFileAlt:fa5" className="h-6 w-6 text-gray-400" />
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">{file.name}</p>
            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
          </div>
        </div>
        {showControls && (
          <button
            onClick={() => setOpenPreview(true)}
            className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
          >
            Preview
          </button>
        )}
      </div>
      {renderPreview()}
    </>
  );
};
