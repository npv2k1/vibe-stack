import React, { ComponentProps } from 'react';
import { Select } from 'antd';

import { cn } from '../../utils';
import { antdSelectClass } from '../inputStyles';

export type SelectInputProps = Omit<ComponentProps<typeof Select>, 'onChange'> & {
  onChange?: (value: any) => void;
};

export const SelectInput: React.FC<SelectInputProps> = ({ value, onChange, options, className, ...props }) => {
  return (
    <Select
      allowClear
      value={value}
      onChange={(data: any) => {
        onChange?.(data);
      }}
      options={options}
      className={cn(
        antdSelectClass,
        className,
      )}
      {...props}
    ></Select>
  );
};
