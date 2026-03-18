import { useCallback, useState } from 'react';

/**
 * A custom React hook for managing modal state and actions.
 *
 * @returns An object containing:
 * - `isOpen`: boolean indicating if the modal is currently open
 * - `onClose`: function to close the modal (sets isOpen to false)
 * - `toggle`: function to toggle the modal state
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { isOpen, onClose, toggle } = useModal();
 *
 *   return (
 *     <div>
 *       <button onClick={toggle}>Open Modal</button>
 *       {isOpen && (
 *         <div className="modal">
 *           <button onClick={onClose}>Close</button>
 *           <p>Modal content</p>
 *         </div>
 *       )}
 *     </div>
 *   );
 * };
 * ```
 */
export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const onClose = useCallback(() => setIsOpen(false), []);
  return { isOpen, onClose, toggle };
};
