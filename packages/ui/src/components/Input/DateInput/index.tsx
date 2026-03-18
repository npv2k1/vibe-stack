import React, { ComponentProps } from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { InputProps } from '../Input.type';
import { cn } from '../../utils';
import { antdDatePickerClass } from '../inputStyles';

export type DateInputProps = Omit<ComponentProps<typeof DatePicker>, 'value' | 'onChange' | 'maxDate' | 'minDate'> & {
  dateFormat?: string;
  maxDate?: string;
  minDate?: string;
} & InputProps<string>;

export const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  dateFormat = 'DD/MM/YYYY',
  maxDate,
  minDate,
  className,
  ...props
}) => {
  return (
    <DatePicker
      className={cn(antdDatePickerClass, className)}
      value={value ? dayjs(value, dateFormat) : null}
      onChange={(date) => {
        onChange?.(date ? date.format(dateFormat) : '');
      }}
      format={dateFormat}
      maxDate={maxDate ? dayjs(maxDate, dateFormat) : undefined}
      minDate={minDate ? dayjs(minDate, dateFormat) : undefined}
      {...props}
    />
  );
};
