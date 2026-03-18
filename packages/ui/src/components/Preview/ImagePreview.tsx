import React, { memo, useEffect, useRef, useState } from 'react';

import { Modal } from '../Modal';
import { dataURLtoFile } from '../utils';

import type { ModalPreviewProps } from './Preview.types';
import { getPreviewUrl } from './Preview.types';

export type ImagePreviewProps = ModalPreviewProps;

type Box = {
  x: number;
  y: number;
  w: number;
  h: number;
};

const ImagePreview: React.FC<ImagePreviewProps> = ({ isOpen, onClose, value, onSave }) => {
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const [url, setUrl] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [boxes, setBoxes] = useState<Box[]>([]);
  const imageRef = useRef<HTMLImageElement>(new Image());

  useEffect(() => {
    const _url = getPreviewUrl(value);
    setUrl(_url);

    const img = new Image();
    img.src = _url;
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
      imageRef.current = img;
      drawCanvas();
    };

    return () => {
      // Only revoke if it was created from a File
      if (value instanceof File) {
        URL.revokeObjectURL(_url);
      }
    };
  }, [value]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !imageRef.current) return;

    // Draw image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);

    // Draw existing boxes
    ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
    boxes.forEach(box => {
      ctx.fillRect(box.x, box.y, box.w, box.h);
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setStartPos({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    // Redraw canvas and boxes
    drawCanvas();

    // Draw current rectangle
    ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
    const width = currentX - startPos.x;
    const height = currentY - startPos.y;
    ctx.fillRect(startPos.x, startPos.y, width, height);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    // Calculate box dimensions
    const x = Math.min(startPos.x, endX);
    const y = Math.min(startPos.y, endY);
    const w = Math.abs(endX - startPos.x);
    const h = Math.abs(endY - startPos.y);

    // Add new box
    setBoxes([...boxes, { x, y, w, h }]);
    setIsDrawing(false);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataURL = canvas.toDataURL('image/png', 1.0);
      const fileName = value instanceof File ? value.name : 'edited-image.png';
      const newFile = dataURLtoFile(dataURL, fileName);
      onSave?.(newFile);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <div className="flex justify-end">
          <button
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      }
    >
      <div className="h-full w-full">
        <canvas
          ref={canvasRef}
          width={imageDimensions.width}
          height={imageDimensions.height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{
            cursor: 'crosshair',
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        />
      </div>
    </Modal>
  );
};

export default memo(ImagePreview);
