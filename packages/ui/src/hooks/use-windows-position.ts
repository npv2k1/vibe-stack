import { useEffect, useState } from 'react';

/**
 * Custom hook to get the current window position (x and y coordinates).
 *
 * @returns An object containing the x and y coordinates of the window position.
 *
 * @example
 * const { x, y } = useWindowPosition();
 *
 * @remarks
 * This hook listens for window resize and mouse move events to update the position.
 * It initializes the position based on the current window coordinates.
 *
 * @returns {Object} position - The current window position.
 * @returns {number} position.x - The x coordinate of the window position.
 * @returns {number} position.y - The y coordinate of the window position.
 */
export const useWindowPosition = () => {
  const [position, setPosition] = useState({
    x: typeof window !== 'undefined' ? window.screenX || window.screenLeft : 0,
    y: typeof window !== 'undefined' ? window.screenY || window.screenTop : 0,
  });

  useEffect(() => {
    const updatePosition = () => {
      setPosition({
        x: window.screenX || window.screenLeft,
        y: window.screenY || window.screenTop,
      });
    };

    // Update position on resize or move
    window.addEventListener('resize', updatePosition);
    window.addEventListener('mousemove', updatePosition);

    // Initial update
    updatePosition();

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('mousemove', updatePosition);
    };
  }, []);

  return position;
};
