import { ControllerProps, UseFormReturn } from 'react-hook-form';
import { ZodSchema } from 'zod';

export enum FormType {
  Text = 'Text',
  Number = 'Number',
  Date = 'Date',
  DateRange = 'DateRange',
  MonthYear = 'MonthYear',
  Select = 'Select',
  Checkbox = 'Checkbox',
  Radio = 'Radio',
  Switch = 'Switch',
  Markdown = 'Markdown',
  File = 'File',
  DateTime = 'DateTime',
  Code = 'Code',
  Password = 'Password',
  Avatar = 'Avatar',
}

export type FormRef<T extends import('react-hook-form').FieldValues = any> =
  import('react-hook-form').UseFormReturn<T>;

export type FormConfig = {
  label?: string;
  name: string;
  type?: FormType;
  defaultValue?: any;
  rules?: ControllerProps['rules'];
  inputProps?: any;
  render?: (item: FormConfig) => React.ReactNode;
  onChange?: (value: any, methods?: UseFormReturn) => void;
  onDepsChange?: (value: any, methods?: UseFormReturn) => void;
  depsFields?: string[];
  InputComponent?: React.ElementType;
  schema?: ZodSchema;
  layout?: 'horizontal' | 'vertical' | 'inline';
};
