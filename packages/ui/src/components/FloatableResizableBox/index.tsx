import React, { useRef, useState } from 'react';

const FloatableResizableBox = () => {
  const [dimensions, setDimensions] = useState({ width: 200, height: 200 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const boxRef = useRef(null);
  const resizeHandleRef = useRef(null);
  const dragHandleRef = useRef(null);

  const handleMouseDownResize = (e) => {
    e.preventDefault();
    document.addEventListener('mousemove', handleMouseMoveResize);
    document.addEventListener('mouseup', handleMouseUpResize);
  };

  const handleMouseMoveResize = (e) => {
    const newWidth = e.clientX - boxRef.current.getBoundingClientRect().left;
    const newHeight = e.clientY - boxRef.current.getBoundingClientRect().top;
    setDimensions({ width: newWidth, height: newHeight });
  };

  const handleMouseUpResize = () => {
    document.removeEventListener('mousemove', handleMouseMoveResize);
    document.removeEventListener('mouseup', handleMouseUpResize);
  };

  const handleMouseDownDrag = (e) => {
    e.preventDefault();
    document.addEventListener('mousemove', handleMouseMoveDrag);
    document.addEventListener('mouseup', handleMouseUpDrag);
  };

  const handleMouseMoveDrag = (e) => {
    setPosition({
      x: e.clientX - dragHandleRef.current.offsetWidth / 2,
      y: e.clientY - dragHandleRef.current.offsetHeight / 2,
    });
  };

  const handleMouseUpDrag = () => {
    document.removeEventListener('mousemove', handleMouseMoveDrag);
    document.removeEventListener('mouseup', handleMouseUpDrag);
  };

  return (
    <div
      ref={boxRef}
      style={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        width: dimensions.width,
        height: dimensions.height,
        border: '1px solid black',
        padding: '10px',
        boxSizing: 'border-box',
        background: 'lightgrey',
      }}
    >
      <div
        ref={dragHandleRef}
        onMouseDown={handleMouseDownDrag}
        style={{
          cursor: 'move',
          background: 'darkgrey',
          padding: '5px',
          textAlign: 'center',
        }}
      >
        Drag me
      </div>
      <div>Resize me!</div>
      <div
        ref={resizeHandleRef}
        onMouseDown={handleMouseDownResize}
        style={{
          width: '10px',
          height: '10px',
          background: 'blue',
          position: 'absolute',
          right: '0',
          bottom: '0',
          cursor: 'se-resize',
        }}
      />
    </div>
  );
};

export { FloatableResizableBox };