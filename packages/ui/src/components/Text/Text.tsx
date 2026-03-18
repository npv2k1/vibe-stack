import React, { useState } from 'react';

export type TextProps = {
  children: React.ReactNode;
  copyable?:
    | boolean
    | {
        text?: string;
        tooltipText?: string;
        onCopy?: () => void;
        copiedTooltipText?: string;
      };
} & React.HTMLAttributes<HTMLSpanElement>;

export const Text = ({ children, copyable = false, ...props }: TextProps) => {
  const [copied, setCopied] = useState(false);

  const copyConfig = typeof copyable === 'object' ? copyable : {};
  const {
    text: copyText,
    tooltipText = 'Click to copy',
    copiedTooltipText = 'Copied!',
    onCopy,
  } = copyConfig;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!copyable) return;

    const textToCopy = copyText || (typeof children === 'string' ? children : '');
    if (!textToCopy) return;

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopied(true);
        onCopy?.();
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error('Failed to copy text: ', err));
  };

  return (
    <span
      style={{
        cursor: copyable ? 'pointer' : 'inherit',
        position: 'relative',
        display: 'inline-block',
      }}
      title={copied ? copiedTooltipText : copyable ? tooltipText : undefined}
      onClick={handleCopy}
      {...props}
    >
      {children}
      {copied && copyable && (
        <span
          style={{
            position: 'absolute',
            top: '-1.5em',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#333',
            color: '#fff',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '0.75em',
            whiteSpace: 'nowrap',
            zIndex: '10',
          }}
        >
          {copiedTooltipText}
        </span>
      )}
    </span>
  );
};
