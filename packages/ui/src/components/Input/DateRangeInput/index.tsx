import React from 'react';

import { cn } from '../../utils';
import { DateInput } from '../DateInput';
import { inputLabelClass } from '../inputStyles';

type DateRange = [string, string];

export type DateRangeInputProps = {
  value?: DateRange;
  onChange?: (value: DateRange) => void;
  disableFormDate?: boolean;
  disableToDate?: boolean;
  dateFormat?: string;
  className?: string;
};

export const DateRangeInput: React.FC<DateRangeInputProps> = ({
  value: valueProps,
  onChange,
  disableFormDate,
  disableToDate,
  className,
  dateFormat = 'DD/MM/YYYY',
}) => {
  const fromDate = valueProps?.[0] ? valueProps?.[0] : '';
  const toDate = valueProps?.[1] ? valueProps[1] : '';

  return (
    <div className={cn('flex flex-wrap items-center gap-2 sm:gap-3', className)}>
      <span className={inputLabelClass}>Từ</span>
      <DateInput
        value={fromDate}
        maxDate={toDate}
        onChange={(date) => {
          onChange?.([date, toDate]);
        }}
        className="min-w-[160px] flex-1"
        dateFormat={dateFormat}
        disabled={disableFormDate}
      />
      <span className={inputLabelClass}>Đến</span>
      <DateInput
        value={toDate}
        minDate={fromDate}
        onChange={(date) => {
          onChange?.([fromDate, date]);
        }}
        className="min-w-[160px] flex-1"
        dateFormat={dateFormat}
        disabled={disableToDate}
      />
    </div>
  );
};
