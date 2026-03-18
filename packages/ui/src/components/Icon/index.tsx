import { IconBaseProps } from 'react-icons';
import * as fa5Icons from 'react-icons/fa';
import * as fa6Icons from 'react-icons/fa6';
import * as fcIcons from 'react-icons/fc';
import * as ioIcons from 'react-icons/io';
import * as luIcons from 'react-icons/lu';
import * as luxIcon from 'lucide-react';
import { get, merge } from 'lodash';

import { cn } from '../utils';

// Constants
const DEFAULT_FONT_SIZE = 24;
const DEFAULT_ICON_SET = 'default';

// Icon set definitions with stronger typing
const iconSets = {
  default: luxIcon,
  lu: luIcons,
  fa6: fa6Icons,
  fc: fcIcons,
  fa5: fa5Icons,
  io: ioIcons,
  svg: {},
} as const;

type IconSet = typeof iconSets;
type IconSetKey = keyof IconSet;

export type IconSetName<T extends keyof typeof iconSets> = keyof (typeof iconSets)[T];
export type IconName =
  | `${IconSetName<'lu'>}:lu`
  | `${IconSetName<'fa6'>}:fa6`
  | `${IconSetName<'fc'>}:fc`
  | `${IconSetName<'fa5'>}:fa5`
  | `${IconSetName<'svg'>}:svg`
  | `${IconSetName<'io'>}:io`
  | IconSetName<'default'>;

const getAllIconNames = () =>
  Object.entries(iconSets).flatMap(([set, icons]) => Object.keys(icons).map((icon) => `${icon}:${set}`));

export const allIconName = getAllIconNames();

// Type definitions
type BaseIconProps = {
  name: IconName;
  type?: IconSetKey;
  fontSize?: number;
  width?: number;
  height?: number;
  className?: string;
  fallback?: React.ReactElement;
};

export type IconProps = BaseIconProps & IconBaseProps;

const getIconComponent = (name: string, type: IconSetKey): React.ComponentType<IconBaseProps> | undefined => {
  const iconSet = get(iconSets, type || DEFAULT_ICON_SET);
  return get(iconSet, name);
};

export function Icon({
  name,
  type = DEFAULT_ICON_SET,
  fontSize = DEFAULT_FONT_SIZE,
  width,
  height,
  className,
  fallback = <></>,
  ...props
}: IconProps): React.ReactElement {
  try {
    const [iconName, iconType = type] = name?.split(':') as [string, IconSetKey];

    if (!iconName) {
      console.error('Invalid icon name provided:', name);
      return fallback;
    }

    const IconComponent = getIconComponent(iconName, iconType);

    if (!IconComponent) {
      console.error(`Icon not found: ${name}`);
      return fallback;
    }

    const dimensions = {
      width: width || fontSize,
      height: height || fontSize,
    };

    const iconProps = merge({}, dimensions, props);

    return (
      <div className={cn('inline-flex items-center justify-center', className)}>
        <IconComponent {...iconProps} />
      </div>
    );
  } catch (error) {
    console.error('Error rendering icon:', error);
    return fallback;
  }
}
