import React from 'react';
import type { InputNumberProps as AntdInputNumberProps } from 'antd';
import { InputNumber as AntdInputNumber } from 'antd';

import { cn } from '../../utils';
import { InputProps } from '../Input.type';
import { antdInputNumberClass } from '../inputStyles';

export type NumberInputProps = InputProps<number> & AntdInputNumberProps;

export const NumberInput: React.FC<NumberInputProps> = ({ value, onChange, className, ...props }) => {
  return (
    <AntdInputNumber
      className={cn(
        antdInputNumberClass,
        className,
      )}
      value={value}
      onChange={(e) => onChange?.(e)}
      {...props}
    ></AntdInputNumber>
  );
};
