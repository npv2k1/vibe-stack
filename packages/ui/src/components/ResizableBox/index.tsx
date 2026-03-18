import React, { PropsWithChildren, useRef, useState } from 'react';

/**
 * Props for the ResizableBox component.
 */
export type ResizableBoxProps = PropsWithChildren<{
  /** Initial width of the resizable box (default: 200) */
  initialWidth?: number;
  /** Initial height of the resizable box (default: 200) */
  initialHeight?: number;
  /** Minimum width the box can be resized to (default: 50) */
  minWidth?: number;
  /** Minimum height the box can be resized to (default: 50) */
  minHeight?: number;
  /** Maximum width the box can be resized to (optional) */
  maxWidth?: number;
  /** Maximum height the box can be resized to (optional) */
  maxHeight?: number;
  /** Callback fired when dimensions change */
  onResize?: (dimensions: { width: number; height: number }) => void;
}>;

/**
 * A resizable container component that allows users to dynamically adjust its dimensions
 * by dragging the resize handles on its edges and corners.
 *
 * The component provides 8 resize handles:
 * - 4 edge handles (north, south, east, west)
 * - 4 corner handles (northeast, northwest, southeast, southwest)
 *
 * @param props - The component props
 * @param props.children - The content to be displayed inside the resizable box
 * @param props.initialWidth - Initial width of the resizable box (default: 200)
 * @param props.initialHeight - Initial height of the resizable box (default: 200)
 * @param props.minWidth - Minimum width the box can be resized to (default: 50)
 * @param props.minHeight - Minimum height the box can be resized to (default: 50)
 * @param props.maxWidth - Maximum width the box can be resized to (optional)
 * @param props.maxHeight - Maximum height the box can be resized to (optional)
 * @param props.onResize - Callback fired when dimensions change
 *
 * @example
 * ```tsx
 * <ResizableBox
 *   initialWidth={300}
 *   initialHeight={250}
 *   minWidth={100}
 *   minHeight={100}
 *   maxWidth={800}
 *   maxHeight={600}
 *   onResize={(dimensions) => console.log('Resized to:', dimensions)}
 * >
 *   <div style={{ padding: '20px', background: 'lightblue' }}>
 *     Resize me by dragging the edges!
 *   </div>
 * </ResizableBox>
 * ```
 */
const ResizableBox: React.FC<ResizableBoxProps> = ({
  children,
  initialWidth = 200,
  initialHeight = 200,
  minWidth = 50,
  minHeight = 50,
  maxWidth,
  maxHeight,
  onResize,
}) => {
  const [dimensions, setDimensions] = useState({ width: initialWidth, height: initialHeight });
  const boxRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, direction: string) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = dimensions.width;
    const startHeight = dimensions.height;

    const handleMouseMove = (e: MouseEvent) => {
      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction.includes('e')) {
        newWidth = startWidth + e.clientX - startX;
      }
      if (direction.includes('s')) {
        newHeight = startHeight + e.clientY - startY;
      }
      if (direction.includes('w')) {
        newWidth = startWidth - (e.clientX - startX);
      }
      if (direction.includes('n')) {
        newHeight = startHeight - (e.clientY - startY);
      }

      // Apply constraints
      newWidth = Math.max(minWidth, newWidth);
      newHeight = Math.max(minHeight, newHeight);
      if (maxWidth) newWidth = Math.min(maxWidth, newWidth);
      if (maxHeight) newHeight = Math.min(maxHeight, newHeight);

      const newDimensions = { width: newWidth, height: newHeight };
      setDimensions(newDimensions);
      onResize?.(newDimensions);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={boxRef}
      style={{
        position: 'relative',
        width: dimensions.width,
        height: dimensions.height,
        // border: '1px solid black',
        // padding: '10px',
        boxSizing: 'border-box',
        // background: 'lightgrey',
      }}
    >
      <div className="w-full h-full">{children}</div>
      <div
        onMouseDown={(e) => handleMouseDown(e, 'e')}
        style={{
          width: '10px',
          height: '100%',
          background: 'transparent',
          position: 'absolute',
          right: '0',
          top: '0',
          cursor: 'e-resize',
        }}
      />
      <div
        onMouseDown={(e) => handleMouseDown(e, 's')}
        style={{
          width: '100%',
          height: '10px',
          background: 'transparent',
          position: 'absolute',
          bottom: '0',
          left: '0',
          cursor: 's-resize',
        }}
      />
      <div
        onMouseDown={(e) => handleMouseDown(e, 'w')}
        style={{
          width: '10px',
          height: '100%',
          background: 'transparent',
          position: 'absolute',
          left: '0',
          top: '0',
          cursor: 'w-resize',
        }}
      />
      <div
        onMouseDown={(e) => handleMouseDown(e, 'n')}
        style={{
          width: '100%',
          height: '10px',
          background: 'transparent',
          position: 'absolute',
          top: '0',
          left: '0',
          cursor: 'n-resize',
        }}
      />
      <div
        onMouseDown={(e) => handleMouseDown(e, 'se')}
        style={{
          width: '10px',
          height: '10px',
          background: 'transparent',
          position: 'absolute',
          right: '0',
          bottom: '0',
          cursor: 'se-resize',
        }}
      />
      <div
        onMouseDown={(e) => handleMouseDown(e, 'sw')}
        style={{
          width: '10px',
          height: '10px',
          background: 'transparent',
          position: 'absolute',
          left: '0',
          bottom: '0',
          cursor: 'sw-resize',
        }}
      />
      <div
        onMouseDown={(e) => handleMouseDown(e, 'ne')}
        style={{
          width: '10px',
          height: '10px',
          background: 'transparent',
          position: 'absolute',
          right: '0',
          top: '0',
          cursor: 'ne-resize',
        }}
      />
      <div
        onMouseDown={(e) => handleMouseDown(e, 'nw')}
        style={{
          width: '10px',
          height: '10px',
          background: 'transparent',
          position: 'absolute',
          left: '0',
          top: '0',
          cursor: 'nw-resize',
        }}
      />
    </div>
  );
};

export { ResizableBox };
