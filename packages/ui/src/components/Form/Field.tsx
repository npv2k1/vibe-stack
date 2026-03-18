import React, { ComponentProps, PropsWithChildren, ReactElement, useEffect } from 'react';
import { Controller, useFormContext, UseFormReturn, useWatch } from 'react-hook-form';

import { cn } from '../utils';

export type FieldProps = Omit<ComponentProps<typeof Controller>, 'render'> & {
  /**
   * Label text for the field
   */
  label?: string;
  /**
   * Description or helper text displayed below the field
   */
  description?: string;
  /**
   * Custom render function for the label
   */
  renderLabel?: (props: any) => ReactElement;
  /**
   * Custom render function for the field (not currently used, kept for backward compatibility)
   */
  renderField?: (props: any) => ReactElement;
  /**
   * Border radius for the input (deprecated, use containerProps.className instead)
   * @deprecated
   */
  rounded?: number;
  /**
   * Props passed to the container div element
   */
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  /**
   * CSS properties for the input container
   */
  inputContainerStyle?: React.CSSProperties;
  /**
   * Layout direction for label and input
   * @default 'vertical'
   */
  layout?: 'horizontal' | 'vertical';
  /**
   * Callback function called when field value changes
   */
  onChange?: (value: any, methods?: UseFormReturn) => void;
  /**
   * Array of field names that this field depends on
   */
  depsFields?: string[];
  /**
   * Callback function called when dependent fields change
   */
  onDepsChange?: (value: any, methods?: UseFormReturn) => void;
  /**
   * Whether to show an asterisk for required fields
   * @default true
   */
  showRequiredIndicator?: boolean;
  /**
   * Tooltip text to show on label hover
   */
  tooltip?: string;
};

export const Field: React.FC<PropsWithChildren<FieldProps>> = ({
  rules,
  name,
  label,
  description,
  children,
  rounded,
  containerProps,
  inputContainerStyle,
  renderLabel,
  layout = 'vertical',
  onChange: _onChange,
  depsFields,
  onDepsChange,
  showRequiredIndicator = true,
  tooltip,
  ...props
}) => {
  const methods = useFormContext();

  const { control, setValue } = methods;

  const watchDeps = useWatch({
    control: control,
    name: depsFields ? depsFields : [],
  });

  useEffect(() => {
    if (!depsFields || depsFields.length === 0) {
      return;
    }

    const deps = watchDeps.reduce((acc, cur, index) => {
      acc[depsFields[index]] = cur;
      return acc;
    }, {});

    const res = onDepsChange?.(deps, methods);
    setValue(name, res);
  }, [watchDeps]);

  const _renderTitle = () => {
    if (renderLabel) {
      return renderLabel({ label, rules, tooltip, description });
    }

    if (!label) return null;

    const isRequired = rules?.required === true;

    return (
      <div className="form-label flex-0 inline-block w-auto">
        <label htmlFor={name} className="text-sm font-semibold leading-4 text-gray-600">
          {label}
          {isRequired && showRequiredIndicator && <span className="ml-1 text-red-500">*</span>}
        </label>
        {tooltip && (
          <span className="ml-1 cursor-help text-xs text-gray-400" title={tooltip}>
            ⓘ
          </span>
        )}
      </div>
    );
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState, formState }) => {
        const hasError = !!fieldState.error;
        const inputStyle = hasError ? 'border-red-500 border-[1px]' : '';

        const handleOnChange = (value: any) => {
          onChange(value);
          _onChange?.(value, methods);
        };

        return (
          <div
            className={cn(
              'flex',
              layout === 'horizontal'
                ? 'flex-row items-start space-x-3'
                : 'flex-col items-stretch space-y-1.5',
              containerProps?.className,
            )}
            {...containerProps}
          >
            {label && _renderTitle()}

            <div className={cn('block flex-1', inputContainerStyle)}>
              <div className="space-y-1">
                {React.Children.map(children, (child) => {
                  if (React.isValidElement(child)) {
                    const { className, ...resProps } = child.props;
                    return React.cloneElement(child as ReactElement, {
                      id: name,
                      onChange: handleOnChange,
                      onBlur,
                      value,
                      className: cn(child.props.className, inputStyle),
                      'aria-invalid': hasError,
                      'aria-describedby': hasError ? `${name}-error` : description ? `${name}-description` : undefined,
                      ...resProps,
                    });
                  }
                  return child;
                })}

                {description && !hasError && (
                  <p id={`${name}-description`} className="text-xs text-gray-500">
                    {description}
                  </p>
                )}

                {hasError && fieldState.error && (
                  <p id={`${name}-error`} className="text-xs font-medium text-red-600" role="alert">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      }}
      {...props}
    />
  );
};
