import { useMemo } from 'react';
import { FieldValues } from 'react-hook-form';
import { z } from 'zod';

import { AvatarInput, Codemirror } from '../Input';

import {
  CheckBoxInput,
  DateInput,
  DateRangeInput,
  DateTimeInput,
  FileInput,
  MonthYearInput,
  NumberInput,
  PasswordInput,
  RadioInput,
  SelectInput,
  SwitchInput,
  TextInput,
} from '../Input';

import { Field } from './Field';
import { Form, FormProps } from './Form';
import { FormConfig, FormType } from './Form.types';
import { cn } from '../utils';
import { makeSchema } from './utils';

export type FormSchemaProps<T extends FieldValues> = FormProps<T> & {
  config: FormConfig[];
  className?: string;
};

export const formTypeToComponent = {
  [FormType.Text]: TextInput,
  [FormType.Number]: NumberInput,
  [FormType.Date]: DateInput,
  [FormType.DateRange]: DateRangeInput,
  [FormType.MonthYear]: MonthYearInput,
  [FormType.Select]: SelectInput,
  [FormType.Checkbox]: CheckBoxInput,
  [FormType.Radio]: RadioInput,
  [FormType.Switch]: SwitchInput,
  [FormType.File]: FileInput,
  [FormType.Markdown]: TextInput,
  [FormType.DateTime]: DateTimeInput,
  [FormType.Code]: Codemirror,
  [FormType.Password]: PasswordInput,
  [FormType.Avatar]: AvatarInput,
};

export const FormSchema = <T extends FieldValues>({ config, layout, className, ...props }: FormSchemaProps<T>) => {
  const schema = useMemo(() => {
    return makeSchema(config);
  }, [config]);

  const renderInput = (item: FormConfig) => {
    const Component: any = formTypeToComponent[item.type ?? FormType.Text] || TextInput;
    return <Component {...item.inputProps} />;
  };

  return (
    <Form validationSchema={schema} showSubmitButton {...props}>
      <div
        className={cn(
          'w-full grid',
          layout === 'horizontal' ? 'grid-cols-3 space-x-2' : 'grid-cols-1 space-y-2',
          className,
        )}
      >
        {config?.map((item) => (
          <Field
            defaultValue={item.defaultValue}
            key={item.name}
            name={item.name}
            label={item.label}
            rules={item.rules}
            layout={layout}
            onChange={item.onChange}
            depsFields={item.depsFields}
            onDepsChange={item.onDepsChange}
          >
            {item.render ? item.render(item) : renderInput(item)}
          </Field>
        ))}
      </div>
    </Form>
  );
};
