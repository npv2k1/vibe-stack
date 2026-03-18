import React from 'react';
import type { ModalProps as AntdModalProps } from 'antd';
import { Modal as AntdModal } from 'antd';

export type ModalProps = Omit<AntdModalProps, 'open'> & {
  isOpen?: boolean;
};

/**
 * Modal component that wraps the AntdModal component.
 *
 * @param {React.ReactNode} children - The content to be displayed inside the modal.
 * @param {boolean} isOpen - Determines whether the modal is open or not.
 * @param {() => void} onClose - Function to be called when the modal is requested to be closed.
 * @param {ModalProps} props - Additional properties to be passed to the AntdModal component.
 *
 * @returns {JSX.Element} The rendered modal component.
 */
export const Modal = ({ children, isOpen, onClose, ...props }: ModalProps) => {
  return (
    <AntdModal width={800} open={isOpen} onCancel={onClose} onClose={onClose} footer={null} {...props}>
      <div className="overflow-y-auto w-full max-h-[50vh] h-full">{children}</div>
    </AntdModal>
  );
};
