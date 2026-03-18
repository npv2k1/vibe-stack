import React, { ComponentProps, useEffect, useState } from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { cn } from '../../utils';
import { antdDatePickerClass } from '../inputStyles';

export type DateTimeInputProps = Omit<ComponentProps<typeof DatePicker>, 'value' | 'onChange'> & {
  value?: ComponentProps<typeof DatePicker>['value'] | string | null;
  dateFormat?: string;
  onChange?: (value: string | null) => void;
};

export const DateTimeInput: React.FC<DateTimeInputProps> = ({
  value,
  onChange,
  dateFormat = 'MM/DD/YYYY HH:mm:ss',
  className,
  ...props
}) => {
  const [innerValue, setInnerValue] = useState<any>(
    value ? (dayjs.isDayjs(value) ? value : dayjs(value, dateFormat)) : null,
  );

  useEffect(() => {
    if (value === undefined) return;
    setInnerValue(value ? (dayjs.isDayjs(value) ? value : dayjs(value, dateFormat)) : null);
  }, [value, dateFormat]);

  return (
    <DatePicker
      value={innerValue}
      onChange={(date) => {
        setInnerValue(date);
        onChange?.(date ? date.format(dateFormat) : null);
      }}
      className={cn(antdDatePickerClass, className)}
      format={dateFormat}
      showTime
      {...props}
    />
  );
};
