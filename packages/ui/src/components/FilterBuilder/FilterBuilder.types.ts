/**
 * Comparison operators for filter rules
 */
export type FilterOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'greater_than'
  | 'greater_than_or_equal'
  | 'less_than'
  | 'less_than_or_equal'
  | 'between'
  | 'not_between'
  | 'in'
  | 'not_in'
  | 'is_null'
  | 'is_not_null';

/**
 * Logical operators for combining filter groups
 */
export type FilterLogicalOperator = 'AND' | 'OR';

/**
 * Field types for filter rules
 */
export type FilterFieldType = 'string' | 'number' | 'date' | 'boolean' | 'select';

/**
 * Field definition for filter builder
 */
export interface FilterField {
  name: string;
  label: string;
  type: FilterFieldType;
  options?: Array<{ label: string; value: any }>;
}

/**
 * Single filter rule
 */
export interface FilterRule {
  id: string;
  field: string;
  operator: FilterOperator;
  value: any;
  value2?: any; // For 'between' operator
}

/**
 * Filter group containing multiple rules
 */
export interface FilterGroup {
  id?: string;
  operator: FilterLogicalOperator;
  rules: FilterRule[];
  groups?: FilterGroup[];
}

/**
 * Complete filter query structure (alias for FilterGroup)
 */
export type FilterQuery = FilterGroup;

/**
 * Props for FilterBuilder component
 */
export interface FilterBuilderProps {
  /**
   * Available fields for filtering
   */
  fields: FilterField[];
  /**
   * Initial filter query
   */
  value?: FilterQuery;
  /**
   * Callback when filter query changes
   */
  onChange?: (query: FilterQuery) => void;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether to show the add group button
   * @default true
   */
  showAddGroup?: boolean;
  /**
   * Maximum nesting level for groups
   * @default 3
   */
  maxDepth?: number;
}

/**
 * Props for FilterGroup component
 */
export interface FilterGroupProps {
  group: FilterGroup;
  fields: FilterField[];
  onChange: (group: FilterGroup) => void;
  onRemove?: () => void;
  depth: number;
  maxDepth: number;
  showAddGroup: boolean;
}

/**
 * Props for FilterRule component
 */
export interface FilterRuleProps {
  rule: FilterRule;
  fields: FilterField[];
  onChange: (rule: FilterRule) => void;
  onRemove: () => void;
}
