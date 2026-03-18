import { zodResolver } from '@hookform/resolvers/zod';
import { FormHTMLAttributes, PropsWithChildren, RefObject, useEffect, useImperativeHandle } from 'react';
import {
  FieldErrors,
  FieldValues,
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  useFormContext,
  UseFormProps,
  UseFormReturn,
} from 'react-hook-form';
import { ZodSchema } from 'zod';

import { SubmitterButton, SubmitterButtonProps } from '../Button';

import { Field } from './Field';
import { FormRef } from './Form.types';

export type FormProps<T extends FieldValues> = PropsWithChildren &
  Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'onChange'> &
  UseFormProps<T> & {
    /**
     * Additional CSS classes for the form wrapper
     */
    className?: string;
    /**
     * Callback function called when form is submitted successfully
     */
    onSubmit?: (data: T) => void;
    /**
     * Callback function called when form validation fails
     */
    onError?: (errors: FieldErrors<T>) => void;
    /**
     * Reference to access form methods imperatively
     */
    ref?: RefObject<FormRef>;
    /**
     * Zod validation schema for form validation
     */
    validationSchema?: ZodSchema<T>;
    /**
     * Layout direction for form fields
     * @default 'vertical'
     */
    layout?: 'horizontal' | 'vertical';
    /**
     * Callback function called when any form field value changes
     */
    onChange?: (data: T, form?: UseFormReturn<T>) => void;
    /**
     * Custom render function for submit button
     */
    renderSubmitButton?: (props: SubmitterButtonProps) => React.ReactNode;
    /**
     * Whether to show default submit and clear buttons
     * @default true
     */
    showDefaultButtons?: boolean;
    /**
     * Whether the form is in loading state
     * @default false
     */
    loading?: boolean;
    /**
     * Whether the form is disabled
     * @default false
     */
    disabled?: boolean;
  };

export const Form = <T extends FieldValues>({
  children,
  className,
  onSubmit,
  onError,
  ref,
  validationSchema,
  onChange,
  renderSubmitButton,
  showDefaultButtons = true,
  loading = false,
  disabled = false,
  ...config
}: FormProps<T>) => {
  const methods = useForm<T>({
    reValidateMode: 'onSubmit',
    ...(!!validationSchema && { resolver: zodResolver(validationSchema) }),
    ...config,
  });

  const { reset, watch } = methods;

  useEffect(() => {
    if (onChange) {
      const subscription = watch((value) => {
        onChange(value as T, methods);
      });
      return () => subscription.unsubscribe();
    }
  }, [watch, onChange, methods]);

  const handleSubmit = () => {
    methods.handleSubmit(
      (data) => {
        if (onSubmit) onSubmit(data);
      },
      (errors) => {
        if (onError) onError(errors);
      },
    )();
  };

  useImperativeHandle(ref, () => methods);

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <FormProvider<T> {...methods}>
      <form
        className={className}
        onSubmit={onFormSubmit}
        noValidate
        {...(config as any)}
      >
        <fieldset disabled={disabled || loading} className="space-y-4">
          {children}
          {showDefaultButtons &&
            (renderSubmitButton ? (
              renderSubmitButton({
                okTitle: loading ? 'Submitting...' : 'Submit',
                cancelTitle: 'Clear',
                onOk: handleSubmit,
                onCancel: reset,
              })
            ) : (
              <SubmitterButton
                okTitle={loading ? 'Submitting...' : 'Submit'}
                cancelTitle="Clear"
                onOk={() => {
                  handleSubmit();
                }}
                onCancel={() => {
                  reset();
                }}
              />
            ))}
        </fieldset>
      </form>
    </FormProvider>
  );
};

export type SubmitProps<T extends FieldValues> = PropsWithChildren & {
  onSubmit: SubmitHandler<T>;
  onError?: SubmitErrorHandler<T>;
};

export const Submit = <T extends FieldValues>({ children, onSubmit, onError }: SubmitProps<T>) => {
  const { handleSubmit } = useFormContext<T>();
  return <div onClick={() => handleSubmit(onSubmit, onError)()}>{children}</div>;
};

Form.Item = Field;
Form.useForm = useForm;
Form.Submit = Submit;
