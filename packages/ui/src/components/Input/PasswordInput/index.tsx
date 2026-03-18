import React from 'react';

import { cn } from '../../utils';
import { InputProps } from '../Input.type';
import { baseInputClass } from '../inputStyles';

export type PasswordInputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> &
  InputProps<string>;

export const PasswordInput = ({ value, onChange, className, disabled, ...props }: PasswordInputProps) => {
  return (
    <input
      value={value ?? ''}
      type="password"
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
