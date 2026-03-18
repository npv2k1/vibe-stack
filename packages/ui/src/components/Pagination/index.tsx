import { Pagination as AntdPagination } from 'antd';
import React from 'react';
import { cn } from '../utils';

export type PaginationProps = React.ComponentProps<typeof AntdPagination>;

export const Pagination = ({ className, ...props }: PaginationProps) => {
  return <AntdPagination className={cn(className)} {...props}></AntdPagination>;
};

