import React from 'react';
import { motion } from 'motion/react';

import { cn } from '../../utils';
import { InputProps } from '../Input.type';

export type SwitchInputProps = InputProps<boolean> & {
  disabled?: boolean;
  label?: string;
};

export const SwitchInput: React.FC<SwitchInputProps> = ({ value, onChange, disabled = false, label }) => {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={value}
        disabled={disabled}
        onClick={() => !disabled && onChange?.(!value)}
        className={cn(
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-300 ease-in-out',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          value ? 'bg-blue-600' : 'bg-gray-300',
          disabled && 'cursor-not-allowed opacity-50',
          !disabled && 'hover:shadow-md',
        )}
      >
        <motion.span
          className="inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0"
          animate={{
            x: value ? 20 : 0,
            transition: {
              type: 'spring',
              stiffness: 400,
              damping: 25,
            },
          }}
        />
      </button>
      {label && (
        <span className={cn('text-sm font-medium', disabled ? 'text-gray-400' : 'text-gray-700')}>{label}</span>
      )}
    </div>
  );
};
