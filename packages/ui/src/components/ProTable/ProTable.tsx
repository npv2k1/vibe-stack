import React, { useMemo, useRef, useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Cell,
  type Column,
  type FilterFn,
  type Row,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';

import { Button } from '../Button';
import { TextInput } from '../Input';
import { Loading } from '../Loading';
import { Pagination } from '../Pagination';
import { cn } from '../utils';
import type { ProTableColumn, ProTableColumnMeta, ProTableProps } from './ProTable.types';

const densityDefaults = {
  compact: { rowHeight: 32, headerHeight: 34, cellPadding: 'px-2 py-1' },
  normal: { rowHeight: 44, headerHeight: 40, cellPadding: 'px-3 py-2' },
  spacious: { rowHeight: 56, headerHeight: 48, cellPadding: 'px-4 py-3' },
};

type DraftRowMap<TData> = Record<string, TData>;

const textFilter: FilterFn<unknown> = (row, columnId, filterValue) => {
  const value = row.getValue(columnId);
  if (filterValue === undefined || filterValue === null || filterValue === '') return true;
  return String(value ?? '').toLowerCase().includes(String(filterValue).toLowerCase());
};

const numberFilter: FilterFn<unknown> = (row, columnId, filterValue) => {
  if (filterValue === undefined || filterValue === null || filterValue === '') return true;
  const parsed = Number(filterValue);
  if (Number.isNaN(parsed)) return true;
  const value = Number(row.getValue(columnId));
  return Number.isNaN(value) ? false : value === parsed;
};

const selectFilter: FilterFn<unknown> = (row, columnId, filterValue) => {
  if (filterValue === undefined || filterValue === null || filterValue === '') return true;
  return row.getValue(columnId) === filterValue;
};

const filterFns = {
  text: textFilter,
  number: numberFilter,
  select: selectFilter,
};

const getAlignClass = (align?: 'left' | 'center' | 'right') => {
  if (align === 'center') return 'justify-center text-center';
  if (align === 'right') return 'justify-end text-right';
  return 'justify-start text-left';
};

const getByPath = (obj: unknown, path: string | undefined) => {
  if (!path) return undefined;
  const keys = path.split('.').filter(Boolean);
  return keys.reduce<any>((acc, key) => (acc == null ? undefined : acc[key]), obj);
};

const setByPath = <TData,>(obj: TData, path: string, value: unknown): TData => {
  const keys = path.split('.').filter(Boolean);
  if (keys.length === 0) return obj;

  const clone: any = Array.isArray(obj) ? [...(obj as unknown[])] : { ...(obj as any) };
  let cursor = clone;

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      cursor[key] = value;
      return;
    }

    const next = cursor[key];
    cursor[key] = Array.isArray(next) ? [...next] : { ...(next ?? {}) };
    cursor = cursor[key];
  });

  return clone as TData;
};

const getColumnField = <TData,>(column: Column<TData, unknown>): string | undefined => {
  const meta = column.columnDef.meta as ProTableColumnMeta<TData> | undefined;
  if (meta?.field) return meta.field;
  const accessorKey = column.columnDef.accessorKey;
  return typeof accessorKey === 'string' ? accessorKey : undefined;
};

export const ProTable = <TData,>({
  data,
  columns,
  className,
  headerClassName,
  rowClassName,
  cellClassName,
  layout,
  enableSorting = true,
  enableColumnFilters = true,
  enableGlobalFilter = true,
  enablePagination = true,
  enableVirtualization = true,
  overscan = 6,
  manualSorting,
  manualFiltering,
  manualPagination,
  sorting: sortingProp,
  onSortingChange,
  columnFilters: columnFiltersProp,
  onColumnFiltersChange,
  globalFilter: globalFilterProp,
  onGlobalFilterChange,
  pagination: paginationProp,
  onPaginationChange,
  pageCount,
  totalRows,
  pageSizeOptions = [20, 50, 100, 200],
  getRowId,
  enableRowEditing,
  onRowUpdate,
  onRowEditStart,
  onRowEditCancel,
  renderRowActions,
  rowActionsHeader,
  rowActionsWidth = 140,
  rowActionsPosition = 'right',
  toolbarActions,
  renderToolbar,
  renderEmpty,
  emptyText = 'No data',
  isLoading,
}: ProTableProps<TData>) => {
  const density = layout?.density ?? 'normal';
  const densityConfig = densityDefaults[density];
  const rowHeight = layout?.rowHeight ?? densityConfig.rowHeight;
  const headerHeight = layout?.headerHeight ?? densityConfig.headerHeight;
  const cellPadding = densityConfig.cellPadding;

  const resolvedLayout = {
    height: layout?.height,
    maxHeight: layout?.maxHeight ?? (enableVirtualization ? 480 : undefined),
    minHeight: layout?.minHeight,
    stickyHeader: layout?.stickyHeader ?? true,
    tableLayout: layout?.tableLayout ?? 'fixed',
    striped: layout?.striped ?? true,
    bordered: layout?.bordered ?? true,
    minColumnWidth: layout?.minColumnWidth ?? 120,
    columnWidth: layout?.columnWidth ?? 160,
  };

  const [internalSorting, setInternalSorting] = useState(sortingProp ?? []);
  const [internalColumnFilters, setInternalColumnFilters] = useState(columnFiltersProp ?? []);
  const [internalGlobalFilter, setInternalGlobalFilter] = useState(globalFilterProp ?? '');
  const [internalPagination, setInternalPagination] = useState(
    paginationProp ?? {
      pageIndex: 0,
      pageSize: pageSizeOptions[0] ?? 20,
    },
  );

  const sorting = sortingProp ?? internalSorting;
  const columnFilters = columnFiltersProp ?? internalColumnFilters;
  const globalFilter = globalFilterProp ?? internalGlobalFilter;
  const pagination = paginationProp ?? internalPagination;

  const handleSortingChange = onSortingChange ?? setInternalSorting;
  const handleColumnFiltersChange = onColumnFiltersChange ?? setInternalColumnFilters;
  const handleGlobalFilterChange = onGlobalFilterChange ?? setInternalGlobalFilter;
  const handlePaginationChange = onPaginationChange ?? setInternalPagination;

  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [rowDrafts, setRowDrafts] = useState<DraftRowMap<TData>>({});
  const [savingRowId, setSavingRowId] = useState<string | null>(null);

  const normalizedColumns = useMemo(() => {
    return columns.map((column) => {
      const meta = column.meta as ProTableColumnMeta<TData> | undefined;
      if (meta?.filterType && !column.filterFn && meta.filterType !== 'none') {
        return { ...column, filterFn: meta.filterType } as ProTableColumn<TData>;
      }
      return column;
    });
  }, [columns]);

  const showActionsColumn = Boolean(enableRowEditing || renderRowActions);

  const columnsWithActions = useMemo(() => {
    if (!showActionsColumn) return normalizedColumns;

    const actionColumn: ProTableColumn<TData> = {
      id: '__actions',
      header: rowActionsHeader ?? 'Actions',
      size: rowActionsWidth,
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ row }) => {
        const isEditing = editingRowId === row.id;
        const isSaving = savingRowId === row.id;

        const context = {
          row,
          isEditing,
          isSaving,
          startEdit: () => {
            if (!enableRowEditing) return;
            setEditingRowId(row.id);
            setRowDrafts((prev) => ({ ...prev, [row.id]: row.original }));
            onRowEditStart?.(row.original);
          },
          cancelEdit: () => {
            setEditingRowId(null);
            setRowDrafts((prev) => {
              const next = { ...prev };
              delete next[row.id];
              return next;
            });
            onRowEditCancel?.(row.original);
          },
          saveEdit: async () => {
            if (!onRowUpdate) return;
            const draft = rowDrafts[row.id] ?? row.original;
            setSavingRowId(row.id);
            try {
              await onRowUpdate(draft, row.original);
              setEditingRowId(null);
              setRowDrafts((prev) => {
                const next = { ...prev };
                delete next[row.id];
                return next;
              });
            } catch (error) {
              if (process.env.NODE_ENV !== 'production') {
                console.error('Failed to update row', error);
              }
            } finally {
              setSavingRowId(null);
            }
          },
        };

        if (renderRowActions) {
          return renderRowActions(context);
        }

        if (!enableRowEditing) return null;

        return (
          <div className="flex items-center justify-end gap-2">
            {isEditing ? (
              <>
                <Button size="sm" onClick={context.saveEdit} disabled={isSaving || !onRowUpdate}>
                  Save
                </Button>
                <Button size="sm" variant="ghost" onClick={context.cancelEdit} disabled={isSaving}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button size="sm" variant="ghost" onClick={context.startEdit} disabled={!onRowUpdate}>
                Edit
              </Button>
            )}
          </div>
        );
      },
      meta: {
        align: 'right',
      },
    };

    return rowActionsPosition === 'left'
      ? [actionColumn, ...normalizedColumns]
      : [...normalizedColumns, actionColumn];
  }, [
    normalizedColumns,
    showActionsColumn,
    rowActionsHeader,
    rowActionsWidth,
    rowActionsPosition,
    enableRowEditing,
    renderRowActions,
    editingRowId,
    savingRowId,
    rowDrafts,
    onRowEditStart,
    onRowEditCancel,
    onRowUpdate,
  ]);

  const table = useReactTable({
    data,
    columns: columnsWithActions,
    defaultColumn: {
      size: resolvedLayout.columnWidth,
      minSize: resolvedLayout.minColumnWidth,
      maxSize: 600,
    },
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: handleColumnFiltersChange,
    onGlobalFilterChange: handleGlobalFilterChange,
    onPaginationChange: handlePaginationChange,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting && !manualSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel:
      (enableColumnFilters || enableGlobalFilter) && !manualFiltering ? getFilteredRowModel() : undefined,
    getPaginationRowModel: enablePagination && !manualPagination ? getPaginationRowModel() : undefined,
    getFacetedRowModel: enableColumnFilters && !manualFiltering ? getFacetedRowModel() : undefined,
    getFacetedUniqueValues: enableColumnFilters && !manualFiltering ? getFacetedUniqueValues() : undefined,
    filterFns,
    globalFilterFn: 'text',
    enableSorting,
    enableColumnFilters,
    enableGlobalFilter,
    manualSorting,
    manualFiltering,
    manualPagination,
    pageCount,
  });

  const rows = table.getRowModel().rows;
  const resolvedTotalRows =
    manualPagination || manualFiltering ? totalRows ?? data.length : table.getFilteredRowModel().rows.length;
  const resolvedPageCount = manualPagination
    ? pageCount ?? Math.max(1, Math.ceil(resolvedTotalRows / pagination.pageSize))
    : table.getPageCount();

  const scrollRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => rowHeight,
    overscan,
  });

  const leafColumns = table.getVisibleLeafColumns();
  const gridTemplateColumns =
    resolvedLayout.tableLayout === 'auto'
      ? `repeat(${leafColumns.length}, minmax(${resolvedLayout.minColumnWidth}px, 1fr))`
      : leafColumns.map((column) => `${column.getSize()}px`).join(' ');
  const minTableWidth =
    resolvedLayout.tableLayout === 'auto'
      ? leafColumns.length * resolvedLayout.minColumnWidth
      : leafColumns.reduce((total, column) => total + column.getSize(), 0);

  const emptyState = renderEmpty ?? (
    <div className="flex h-32 items-center justify-center text-sm text-gray-500">{emptyText}</div>
  );

  const renderFilterInput = (column: Column<TData, unknown>) => {
    if (!column.getCanFilter()) return null;
    const meta = column.columnDef.meta as ProTableColumnMeta<TData> | undefined;
    const filterType = meta?.filterType ?? 'text';
    if (filterType === 'none') return null;

    const filterValue = column.getFilterValue();

    if (filterType === 'select') {
      const options =
        meta?.filterOptions ??
        Array.from(column.getFacetedUniqueValues().keys())
          .slice(0, 100)
          .map((value) => ({ label: String(value), value: value as string | number }));

      return (
        <select
          className={cn(
            'h-8 w-full rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700',
            'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
          )}
          value={(filterValue ?? '') as string | number | ''}
          onChange={(event) => column.setFilterValue(event.target.value)}
        >
          <option value="">All</option>
          {options.map((option) => (
            <option key={`${option.value}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    const inputType = filterType === 'number' ? 'number' : 'text';

    return (
      <TextInput
        value={(filterValue ?? '') as string | number}
        onChange={(value) => column.setFilterValue(value)}
        type={inputType}
        className="h-8 text-xs"
        placeholder="Filter..."
      />
    );
  };

  const renderCellContent = (row: Row<TData>, cell: Cell<TData, unknown>) => {
    const column = cell.column;
    const meta = column.columnDef.meta as ProTableColumnMeta<TData> | undefined;
    const field = getColumnField(column);
    const isEditing = enableRowEditing && editingRowId === row.id;
    const isEditable = isEditing && meta?.editable !== false && Boolean(field);

    if (isEditable && field) {
      const draft = rowDrafts[row.id] ?? row.original;
      const currentValue = getByPath(draft, field) ?? cell.getValue();

      if (meta?.editor) {
        return meta.editor({
          value: currentValue,
          row,
          column,
          table,
          onChange: (value) => {
            setRowDrafts((prev) => ({
              ...prev,
              [row.id]: setByPath(prev[row.id] ?? row.original, field, value),
            }));
          },
        });
      }

      const inputType = meta?.inputType ?? (typeof currentValue === 'number' ? 'number' : 'text');

      return (
        <TextInput
          value={currentValue as string | number}
          type={inputType}
          onChange={(value) => {
            const nextValue = meta?.valueParser
              ? meta.valueParser(value)
              : inputType === 'number'
                ? value === ''
                  ? undefined
                  : Number(value)
                : value;

            setRowDrafts((prev) => ({
              ...prev,
              [row.id]: setByPath(prev[row.id] ?? row.original, field, nextValue),
            }));
          }}
          className="h-8"
        />
      );
    }

    return flexRender(cell.column.columnDef.cell, cell.getContext());
  };

  const renderRow = (row: Row<TData>, index: number, virtualStart?: number) => {
    const rowClass = typeof rowClassName === 'function' ? rowClassName(row) : rowClassName;
    const stripedClass = resolvedLayout.striped && index % 2 === 1 ? 'bg-gray-50/60' : '';

    return (
      <div
        key={row.id}
        className={cn(
          'grid items-center text-sm text-gray-900',
          stripedClass,
          'hover:bg-gray-50',
          rowClass,
        )}
        style={{
          gridTemplateColumns,
          minWidth: minTableWidth,
          height: rowHeight,
          position: virtualStart === undefined ? 'relative' : 'absolute',
          transform: virtualStart === undefined ? undefined : `translateY(${virtualStart}px)`,
        }}
      >
        {row.getVisibleCells().map((cell, cellIndex) => {
          const meta = cell.column.columnDef.meta as ProTableColumnMeta<TData> | undefined;
          const alignClass = getAlignClass(meta?.align);
          const extraCellClass = typeof cellClassName === 'function' ? cellClassName(cell) : cellClassName;
          const metaCellClass =
            typeof meta?.cellClassName === 'function' ? meta.cellClassName({ cell }) : meta?.cellClassName;

          return (
            <div
              key={cell.id}
              className={cn(
                'flex items-center truncate',
                cellPadding,
                alignClass,
                resolvedLayout.bordered && 'border-b border-gray-200',
                resolvedLayout.bordered && cellIndex !== row.getVisibleCells().length - 1 && 'border-r border-gray-200',
                extraCellClass,
                metaCellClass,
              )}
            >
              {renderCellContent(row, cell)}
            </div>
          );
        })}
      </div>
    );
  };

  const toolbarContent = renderToolbar
    ? renderToolbar({
        table,
        globalFilter,
        setGlobalFilter: (value: string) => handleGlobalFilterChange(value),
      })
    : enableGlobalFilter || toolbarActions
      ? (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white px-3 py-2">
            {enableGlobalFilter ? (
              <TextInput
                value={globalFilter}
                onChange={(value) => handleGlobalFilterChange(value)}
                placeholder="Search..."
                className="h-9 w-64"
              />
            ) : (
              <div />
            )}
            {toolbarActions}
          </div>
        )
      : null;

  return (
    <div className={cn('w-full rounded-lg bg-white text-sm text-gray-900', resolvedLayout.bordered && 'border border-gray-200', className)}>
      {toolbarContent}
      <div
        ref={scrollRef}
        className={cn('relative w-full overflow-auto', resolvedLayout.bordered && 'rounded-b-lg')}
        style={{
          height: resolvedLayout.height,
          maxHeight: resolvedLayout.maxHeight,
          minHeight: resolvedLayout.minHeight,
        }}
      >
        <div
          className={cn(
            'z-10',
            resolvedLayout.stickyHeader && 'sticky top-0',
            resolvedLayout.bordered && 'border-b border-gray-200',
          )}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <div
              key={headerGroup.id}
              className={cn('grid bg-gray-50 text-xs font-semibold text-gray-600', headerClassName)}
              style={{
                gridTemplateColumns,
                minWidth: minTableWidth,
                height: headerHeight,
              }}
            >
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta as ProTableColumnMeta<TData> | undefined;
                const alignClass = getAlignClass(meta?.headerAlign ?? meta?.align);
                const canSort = enableSorting && header.column.getCanSort();
                const metaHeaderClass =
                  typeof meta?.headerClassName === 'function'
                    ? meta.headerClassName({ column: header.column })
                    : meta?.headerClassName;

                return (
                  <div
                    key={header.id}
                    className={cn(
                      'flex items-center',
                      cellPadding,
                      alignClass,
                      canSort && 'cursor-pointer select-none',
                      resolvedLayout.bordered && 'border-b border-gray-200',
                      resolvedLayout.bordered && 'border-r border-gray-200',
                      metaHeaderClass,
                    )}
                    style={{
                      gridColumn: `span ${header.colSpan}`,
                    }}
                    onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {canSort && (
                          <span className="text-xs">
                            {header.column.getIsSorted() === 'asc'
                              ? '↑'
                              : header.column.getIsSorted() === 'desc'
                                ? '↓'
                                : '↕'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
          {enableColumnFilters && (
            <div
              className="grid bg-white"
              style={{
                gridTemplateColumns,
                minWidth: minTableWidth,
              }}
            >
              {leafColumns.map((column, index) => (
                <div
                  key={column.id}
                  className={cn(
                    'flex items-center',
                    cellPadding,
                    resolvedLayout.bordered && 'border-b border-gray-200',
                    resolvedLayout.bordered && index !== leafColumns.length - 1 && 'border-r border-gray-200',
                  )}
                >
                  {renderFilterInput(column)}
                </div>
              ))}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loading />
          </div>
        ) : rows.length === 0 ? (
          emptyState
        ) : enableVirtualization ? (
          <div
            style={{
              height: rowVirtualizer.getTotalSize(),
              minWidth: minTableWidth,
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index];
              return renderRow(row, virtualRow.index, virtualRow.start);
            })}
          </div>
        ) : (
          <div>
            {rows.map((row, index) => {
              return renderRow(row, index);
            })}
          </div>
        )}
      </div>

      {enablePagination && (
        <div className="flex items-center justify-between gap-3 border-t border-gray-200 px-3 py-2 text-xs text-gray-600">
          <div>
            Page {pagination.pageIndex + 1} of {resolvedPageCount}
          </div>
          <Pagination
            current={pagination.pageIndex + 1}
            pageSize={pagination.pageSize}
            total={resolvedTotalRows}
            onChange={(page, pageSize) => {
              handlePaginationChange({
                pageIndex: page - 1,
                pageSize,
              });
            }}
            showSizeChanger
            pageSizeOptions={pageSizeOptions}
          />
        </div>
      )}
    </div>
  );
};
