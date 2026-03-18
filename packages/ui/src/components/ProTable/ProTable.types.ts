import type React from 'react';
import type {
  Cell,
  Column,
  ColumnDef,
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  Row,
  SortingState,
  Table,
} from '@tanstack/react-table';

export type ProTableDensity = 'compact' | 'normal' | 'spacious';

export type ProTableLayout = {
  height?: number | string;
  maxHeight?: number | string;
  minHeight?: number | string;
  stickyHeader?: boolean;
  tableLayout?: 'fixed' | 'auto';
  density?: ProTableDensity;
  striped?: boolean;
  bordered?: boolean;
  rowHeight?: number;
  headerHeight?: number;
  minColumnWidth?: number;
  columnWidth?: number;
};

export type ProTableEditorContext<TData> = {
  value: unknown;
  row: Row<TData>;
  column: Column<TData, unknown>;
  table: Table<TData>;
  onChange: (value: unknown) => void;
};

export type ProTableColumnMeta<TData> = {
  editable?: boolean;
  editor?: (context: ProTableEditorContext<TData>) => React.ReactNode;
  filterType?: 'text' | 'number' | 'select' | 'none';
  filterOptions?: Array<{ label: string; value: string | number }>;
  field?: string;
  align?: 'left' | 'center' | 'right';
  headerAlign?: 'left' | 'center' | 'right';
  cellClassName?: string | ((context: { cell: Cell<TData, unknown> }) => string);
  headerClassName?: string | ((context: { column: Column<TData, unknown> }) => string);
  inputType?: React.InputHTMLAttributes<HTMLInputElement>['type'];
  valueParser?: (value: string) => unknown;
};

export type ProTableColumn<TData, TValue = unknown> = ColumnDef<TData, TValue> & {
  meta?: ProTableColumnMeta<TData>;
};

export type ProTableRowActionContext<TData> = {
  row: Row<TData>;
  isEditing: boolean;
  isSaving: boolean;
  startEdit: () => void;
  cancelEdit: () => void;
  saveEdit: () => void;
};

export type ProTableProps<TData> = {
  data: TData[];
  columns: ProTableColumn<TData>[];
  className?: string;
  headerClassName?: string;
  rowClassName?: string | ((row: Row<TData>) => string);
  cellClassName?: string | ((cell: Cell<TData, unknown>) => string);
  layout?: ProTableLayout;
  enableSorting?: boolean;
  enableColumnFilters?: boolean;
  enableGlobalFilter?: boolean;
  enablePagination?: boolean;
  enableVirtualization?: boolean;
  overscan?: number;
  manualSorting?: boolean;
  manualFiltering?: boolean;
  manualPagination?: boolean;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  pageCount?: number;
  totalRows?: number;
  pageSizeOptions?: number[];
  getRowId?: (row: TData, index: number) => string;
  enableRowEditing?: boolean;
  onRowUpdate?: (updatedRow: TData, originalRow: TData) => void | Promise<void>;
  onRowEditStart?: (row: TData) => void;
  onRowEditCancel?: (row: TData) => void;
  renderRowActions?: (context: ProTableRowActionContext<TData>) => React.ReactNode;
  rowActionsHeader?: React.ReactNode;
  rowActionsWidth?: number;
  rowActionsPosition?: 'left' | 'right';
  toolbarActions?: React.ReactNode;
  renderToolbar?: (context: {
    table: Table<TData>;
    globalFilter: string;
    setGlobalFilter: (value: string) => void;
  }) => React.ReactNode;
  renderEmpty?: React.ReactNode;
  emptyText?: string;
  isLoading?: boolean;
};
