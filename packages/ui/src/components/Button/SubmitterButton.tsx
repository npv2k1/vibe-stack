import React from 'react';

import { cn } from '../utils';

import { Button, ButtonSize, ButtonVariant } from './Button';

export type SubmitterButtonProps = {
  onOk?: () => void;
  onCancel?: () => void;
  okTitle?: string;
  cancelTitle?: string;
  okIcon?: React.ReactNode;
  cancelIcon?: React.ReactNode;
  okVariant?: ButtonVariant;
  cancelVariant?: ButtonVariant;
  size?: ButtonSize;
  iconOnly?: boolean;
  className?: string;
};

export const SubmitterButton: React.FC<SubmitterButtonProps> = ({
  onOk,
  onCancel,
  okTitle = 'Done',
  cancelTitle = 'Cancel',
  okIcon,
  cancelIcon,
  okVariant = 'primary',
  cancelVariant = 'secondary',
  size = 'md',
  iconOnly = false,
  className,
}) => {
  const showCancel = !!cancelTitle || !!cancelIcon;
  const showOk = !!okTitle || !!okIcon;
  const cancelIconOnly = iconOnly || (!cancelTitle && !!cancelIcon);
  const okIconOnly = iconOnly || (!okTitle && !!okIcon);
  const iconButtonClass =
    size === 'sm' ? 'h-8 w-8 p-0' : size === 'lg' ? 'h-12 w-12 p-0' : 'h-10 w-10 p-0';

  return (
    <div className={cn('flex items-center justify-center gap-3 py-3 w-full', className)}>
      {showCancel && (
        <Button
          variant={cancelVariant}
          size={size}
          className={cn(cancelIconOnly ? iconButtonClass : 'flex-1')}
          onClick={onCancel}
          aria-label={cancelTitle || 'Cancel'}
        >
          {cancelIcon || cancelTitle}
        </Button>
      )}
      {showOk && (
        <Button
          variant={okVariant}
          size={size}
          className={cn(okIconOnly ? iconButtonClass : 'flex-1')}
          type="submit"
          onClick={onOk}
          aria-label={okTitle || 'Confirm'}
        >
          {okIcon || okTitle}
        </Button>
      )}
    </div>
  );
};
