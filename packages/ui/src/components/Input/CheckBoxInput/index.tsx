import React, { useEffect, useState } from 'react';

import { InputProps } from '../Input.type';

export type CheckBoxOption = {
  label: string;
  value: string;
};

export type CheckBoxInputProps = InputProps<string[]> & {
  options: CheckBoxOption[];
};

export const CheckBoxInput: React.FC<CheckBoxInputProps> = ({ value = [], onChange, options, ...props }) => {
  const [allChecked, setAllChecked] = useState(false);

  useEffect(() => {
    setAllChecked(options.length > 0 && value.length === options.length);
  }, [value, options]);

  const handleCheckAll = () => {
    const newCheckedState = !allChecked;
    setAllChecked(newCheckedState);
    onChange?.(newCheckedState ? options.map((option) => option.value) : []);
  };

  const handleOptionChange = (optionValue: string) => {
    const newValue = value.includes(optionValue) ? value.filter((v) => v !== optionValue) : [...value, optionValue];
    onChange?.(newValue);
  };

  return (
    <div className="space-y-3" {...props}>
      <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 transition-colors hover:bg-gray-100">
        <input
          type="checkbox"
          checked={allChecked}
          onChange={handleCheckAll}
          className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 transition-colors focus:ring-2 focus:ring-blue-500/20"
        />
        <span className="text-sm font-medium text-gray-700">{allChecked ? 'Uncheck All' : 'Check All'}</span>
      </label>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 transition-all hover:border-gray-300 hover:bg-gray-50"
          >
            <input
              type="checkbox"
              checked={value.includes(option.value)}
              onChange={() => handleOptionChange(option.value)}
              className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 transition-colors focus:ring-2 focus:ring-blue-500/20"
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
