import React, { useCallback, useEffect, useState } from 'react';

import { cn } from '../utils';

import { FilterBuilderProps, FilterQuery } from './FilterBuilder.types';
import { FilterGroup } from './FilterGroup';
import { createEmptyQuery } from './utils';

/**
 * FilterBuilder Component
 *
 * A flexible filter builder that allows users to create complex filter queries
 * with AND/OR operations, multiple comparison operators, and nested groups.
 *
 * Features:
 * - Support for multiple field types (string, number, date, boolean, select)
 * - Various comparison operators (equals, contains, between, etc.)
 * - AND/OR logical operators
 * - Nested filter groups
 * - JSON query export
 *
 * @example
 * ```tsx
 * const fields = [
 *   { name: 'name', label: 'Name', type: 'string' },
 *   { name: 'age', label: 'Age', type: 'number' },
 *   { name: 'status', label: 'Status', type: 'select', options: [
 *     { label: 'Active', value: 'active' },
 *     { label: 'Inactive', value: 'inactive' }
 *   ]},
 * ];
 *
 * <FilterBuilder
 *   fields={fields}
 *   onChange={(query) => console.log(query)}
 * />
 * ```
 */
export const FilterBuilder: React.FC<FilterBuilderProps> = ({
  fields,
  value,
  onChange,
  className,
  showAddGroup = true,
  maxDepth = 3,
}) => {
  const [query, setQuery] = useState<FilterQuery>(() => {
    if (value) {
      return value;
    }
    return createEmptyQuery(fields);
  });

  // Update internal state when value prop changes
  useEffect(() => {
    if (value) {
      setQuery(value);
    }
  }, [value]);

  const handleChange = useCallback(
    (updatedQuery: FilterQuery) => {
      setQuery(updatedQuery);
      onChange?.(updatedQuery);
    },
    [onChange],
  );

  if (!fields || fields.length === 0) {
    return (
      <div className={cn('p-4 text-center text-gray-500 border border-gray-300 rounded-lg', className)}>
        No fields available. Please provide fields to build filters.
      </div>
    );
  }

  return (
    <div className={cn('filter-builder', className)}>
      <FilterGroup
        group={query}
        fields={fields}
        onChange={handleChange}
        depth={0}
        maxDepth={maxDepth}
        showAddGroup={showAddGroup}
      />
    </div>
  );
};
