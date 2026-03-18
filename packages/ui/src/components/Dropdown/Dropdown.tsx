import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { Card } from '../Card';
import { cn } from '../utils';

interface DropdownProps {
  renderLabel: () => React.ReactNode;
  renderContent: () => React.ReactNode;
  position?: 'left' | 'right';
  className?: string;
}

export const Dropdown = ({ renderLabel, renderContent, position = 'left', className = '' }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [topPosition, setTopPosition] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (labelRef.current) {
      const labelHeight = labelRef.current.offsetHeight;
      setTopPosition(labelHeight + 4);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      <div className="cursor-pointer" ref={labelRef} onClick={() => setIsOpen(!isOpen)}>
        {renderLabel()}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ top: topPosition }}
            className={cn('absolute z-50 min-w-[8rem] whitespace-nowrap', position === 'right' ? 'right-0' : 'left-0')}
          >
            <Card>{renderContent()}</Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
