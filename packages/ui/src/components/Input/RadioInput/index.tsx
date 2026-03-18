import React from 'react';

import { InputProps } from '../Input.type';

export type RadioInputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> &
  InputProps<string> & {
    options: { label: string; value: string }[];
  };

export const RadioInput: React.FC<RadioInputProps> = ({ value, onChange, options, ...props }) => {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3" {...props}>
      {options?.map((option) => (
        <label
          key={option.value}
          className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 transition-all hover:border-gray-300 hover:bg-gray-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50"
        >
          <input
            type="radio"
            checked={value === option.value}
            onChange={() => onChange?.(option.value)}
            value={option.value}
            className="h-4 w-4 cursor-pointer border-gray-300 text-blue-600 transition-colors focus:ring-2 focus:ring-blue-500/20"
          />
          <span className="text-sm text-gray-700">{option.label}</span>
        </label>
      ))}
    </div>
  );
};
