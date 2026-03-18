import React, { memo, useEffect, useState } from 'react';

import { CodeInput } from '../Input';
import { Modal } from '../Modal';

import type { ModalPreviewProps } from './Preview.types';

export type TextPreviewProps = ModalPreviewProps;

const TextPreview: React.FC<TextPreviewProps> = ({ isOpen, onClose, value, onSave }) => {
  const [textContent, setTextContent] = useState<string>('');

  useEffect(() => {
    const loadContent = async () => {
      if (value instanceof File) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          if (result && typeof result === 'string') {
            setTextContent(result);
          }
        };
        reader.readAsText(value);
      } else {
        // Load from URL
        try {
          const response = await fetch(value);
          const text = await response.text();
          setTextContent(text);
        } catch (error) {
          console.error('Failed to load text from URL:', error);
          setTextContent('Error loading content from URL');
        }
      }
    };

    loadContent();
  }, [value]);

  const handleSave = () => {
    const fileName = value instanceof File ? value.name : 'edited-text.txt';
    const fileType = value instanceof File ? value.type : 'text/plain';
    const newFile = new File([textContent], fileName, { type: fileType });
    onSave?.(newFile);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div
        className="h-[500px]"
        style={{
          width: 'calc(100vw - 5rem)',
        }}
      >
        <CodeInput
          value={textContent}
          onChange={(value) => {
            if (value !== undefined) {
              setTextContent(value);
            }
          }}
        />
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <button
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          onClick={handleSave}
        >
          Save Changes
        </button>
      </div>
    </Modal>
  );
};

export default memo(TextPreview);
