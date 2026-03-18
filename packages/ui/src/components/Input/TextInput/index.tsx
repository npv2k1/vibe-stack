import React from 'react';

import { cn } from '../../utils';
import { InputProps } from '../Input.type';
import { baseInputClass } from '../inputStyles';

export type TextInputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> &
  InputProps<string>;

export const TextInput: React.FC<TextInputProps> = ({ value, onChange, className, disabled, ...props }) => {
  return (
    <input
      value={value ?? ''}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
      className={cn(
        baseInputClass,
        className,
      )}
      {...props}
    />
  );
};
