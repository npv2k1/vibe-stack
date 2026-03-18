import { ComponentProps, JSXElementConstructor } from 'react';

import * as Components from '../index';

export type ComponentKeys = {
  [Key in keyof typeof Components]: (typeof Components)[Key] extends JSXElementConstructor<any>
    ? Key
    : never;
}[keyof typeof Components];

export type ThemeProps = {
  [K in ComponentKeys]?: {
    default?: any;
    variant: {
      [V in string]?: ComponentProps<(typeof Components)[K]>;
    };
  };
};


