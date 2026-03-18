import { get, merge } from 'lodash';
import { useMemo } from 'react';
import { ClassValue } from 'clsx';

import { theme } from '../theme';
import { cn } from '../utils';
import { ComponentKeys } from '../types';

interface BaseThemeProps {
  className?: string;
  variant?: string;
}

interface ThemeVariantProps extends BaseThemeProps {
  [key: string]: any;
}

interface UseThemePropsOptions<T> {
  name: ComponentKeys;
  props: T;
}

function isThemeVariantProps(obj: unknown): obj is ThemeVariantProps {
  return typeof obj === 'object' && obj !== null;
}

export const useThemeProps = <T extends BaseThemeProps>({ name, props }: UseThemePropsOptions<T>): T => {
  return useMemo(() => {
    try {
      // If no theme exists for component, return original props
      if (!theme?.[name]) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`Theme not found for component: ${name}`);
        }
        return props;
      }

      const variant = props.variant || 'default';

      // Get theme properties with type checking
      const themeConfig = theme[name];
      const defaultTheme = themeConfig.default;
      const variantTheme = variant !== 'default' && themeConfig.variant ? themeConfig.variant[variant] : undefined;

      // Apply type guards
      const defaultProps = isThemeVariantProps(defaultTheme) ? defaultTheme : {};
      const variantProps = isThemeVariantProps(variantTheme) ? variantTheme : {};

      // Create props without className to avoid duplication
      const propsWithoutClassName = {
        ...props,
        className: undefined,
      };

      // Merge all props except className
      const baseProps = merge({}, defaultProps, variantProps, propsWithoutClassName) as T;

      // Merge classNames separately using cn utility
      const className = cn(defaultProps.className, variantProps.className, props.className);

      // Return final merged props with className
      return {
        ...baseProps,
        className: className || undefined,
      };
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(`Error in useThemeProps for ${name}:`, error);
      }
      return props;
    }
  }, [name, props]);
};
