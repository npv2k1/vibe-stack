import React from 'react';
import moment from 'moment';

import { SelectInput } from '../SelectInput';
import { inputLabelClass } from '../inputStyles';

export type MonthYearValueType = {
  month?: number;
  year: number;
};

export type MonthYearInputProps = {
  value?: MonthYearValueType;
  onChange?: (value: MonthYearValueType) => void;
  minYear?: number;
  maxYear?: number;
  hideLabel?: boolean;
  isHideMonth?: boolean;
};

// create month options
const monthOptions = Array.from({ length: 12 }, (_, index) => ({
  label: `Tháng ${index + 1}`,
  value: index + 1,
}));

// create year options
const yearOptions = (minYear?: number, maxYear?: number) => {
  const currentYear = new Date().getFullYear();
  const startYear = minYear ?? currentYear - 10;
  const endYear = maxYear ?? currentYear;

  const years = [];
  for (let i = startYear; i <= endYear; i++) {
    years.push({
      label: `Năm ${i}`,
      value: i,
    });
  }
  return years;
};
export const MonthYearInput: React.FC<MonthYearInputProps> = ({
  value,
  onChange,
  minYear = new Date().getFullYear() - 10,
  maxYear = new Date().getFullYear(),
  hideLabel,
  isHideMonth,
}) => {
  return (
    <div className="flex w-full flex-wrap items-center gap-2 sm:gap-3">
      {!hideLabel && !isHideMonth && <span className={inputLabelClass}>Tháng</span>}
      {!isHideMonth && (
        <SelectInput
          className="min-w-[140px] flex-1"
          options={monthOptions}
          value={value?.month}
          onChange={(month) => {
            onChange?.({
              month: month,
              year: value?.year ?? moment().year(),
            });
          }}
          allowClear={false}
        />
      )}

      {!hideLabel && <span className={inputLabelClass}>Năm</span>}
      <SelectInput
        className="min-w-[160px] flex-1"
        options={yearOptions(minYear, maxYear)}
        value={value?.year}
        onChange={(year) =>
          onChange?.({
            month: value?.month ?? moment().month() + 1,
            year: year,
          })
        }
        allowClear={false}
      />
    </div>
  );
};
