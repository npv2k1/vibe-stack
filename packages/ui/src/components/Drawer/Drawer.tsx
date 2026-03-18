import React, { PropsWithChildren } from 'react';
import { Drawer as AntdDrawer, DrawerProps as AntdDrawerProps, Space } from 'antd';

import { Button } from '../Button';

export type DrawerProps = PropsWithChildren &
  Omit<AntdDrawerProps, 'open' | 'onClose'> & {
    onClose?: () => void;
    isOpen?: boolean;
  };

export const Drawer: React.FC<DrawerProps> = ({ onClose, isOpen, children, ...props }) => {
  return (
    <AntdDrawer
      placement={'right'}
      width={500}
      onClose={onClose}
      open={isOpen}
      footer={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={onClose}>
            OK
          </Button>
        </Space>
      }
      {...props}
    >
      {children}
    </AntdDrawer>
  );
};
