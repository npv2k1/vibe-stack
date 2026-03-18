import { v4 as uuidv4 } from 'uuid';

import { FilterField, FilterFieldType, FilterGroup, FilterOperator, FilterQuery, FilterRule } from './FilterBuilder.types';

/**
 * Get available operators for a given field type
 */
export const getOperatorsForFieldType = (fieldType: FilterFieldType): FilterOperator[] => {
  switch (fieldType) {
    case 'string':
      return [
        'equals',
        'not_equals',
        'contains',
        'not_contains',
        'starts_with',
        'ends_with',
        'is_null',
        'is_not_null',
      ];
    case 'number':
      return [
        'equals',
        'not_equals',
        'greater_than',
        'greater_than_or_equal',
        'less_than',
        'less_than_or_equal',
        'between',
        'not_between',
        'is_null',
        'is_not_null',
      ];
    case 'date':
      return [
        'equals',
        'not_equals',
        'greater_than',
        'greater_than_or_equal',
        'less_than',
        'less_than_or_equal',
        'between',
        'not_between',
        'is_null',
        'is_not_null',
      ];
    case 'boolean':
      return ['equals', 'not_equals'];
    case 'select':
      return ['equals', 'not_equals', 'in', 'not_in', 'is_null', 'is_not_null'];
    default:
      return ['equals', 'not_equals'];
  }
};

/**
 * Get operator label for display
 */
export const getOperatorLabel = (operator: FilterOperator): string => {
  const labels: Record<FilterOperator, string> = {
    equals: 'Equals',
    not_equals: 'Not Equals',
    contains: 'Contains',
    not_contains: 'Does Not Contain',
    starts_with: 'Starts With',
    ends_with: 'Ends With',
    greater_than: 'Greater Than',
    greater_than_or_equal: 'Greater Than or Equal',
    less_than: 'Less Than',
    less_than_or_equal: 'Less Than or Equal',
    between: 'Between',
    not_between: 'Not Between',
    in: 'In',
    not_in: 'Not In',
    is_null: 'Is Null',
    is_not_null: 'Is Not Null',
  };
  return labels[operator] || operator;
};

/**
 * Check if operator requires a value input
 */
export const operatorRequiresValue = (operator: FilterOperator): boolean => {
  return !['is_null', 'is_not_null'].includes(operator);
};

/**
 * Check if operator requires two value inputs (e.g., between)
 */
export const operatorRequiresTwoValues = (operator: FilterOperator): boolean => {
  return ['between', 'not_between'].includes(operator);
};

/**
 * Create a new empty filter rule
 */
export const createEmptyRule = (fields: FilterField[]): FilterRule => {
  const firstField = fields[0];
  const operators = firstField ? getOperatorsForFieldType(firstField.type) : ['equals'];

  return {
    id: uuidv4(),
    field: firstField?.name || '',
    operator: (operators[0] || 'equals') as FilterOperator,
    value: '',
  };
};

/**
 * Create a new empty filter group
 */
export const createEmptyGroup = (fields: FilterField[]): FilterGroup => {
  return {
    id: uuidv4(),
    operator: 'AND',
    rules: [createEmptyRule(fields)],
    groups: [],
  };
};

/**
 * Create an empty filter query
 */
export const createEmptyQuery = (fields: FilterField[]): FilterQuery => {
  return {
    operator: 'AND',
    rules: [createEmptyRule(fields)],
    groups: [],
  };
};

/**
 * Convert filter query to a simplified JSON format
 */
export const exportFilterQuery = (query: FilterQuery): any => {
  const exportRules = (rules: FilterRule[]) => {
    return rules.map((rule) => {
      const exported: any = {
        field: rule.field,
        operator: rule.operator,
      };

      if (operatorRequiresValue(rule.operator)) {
        exported.value = rule.value;
        if (operatorRequiresTwoValues(rule.operator)) {
          exported.value2 = rule.value2;
        }
      }

      return exported;
    });
  };

  const exportGroup = (group: FilterGroup): any => {
    const exported: any = {
      operator: group.operator,
    };

    if (group.rules && group.rules.length > 0) {
      exported.rules = exportRules(group.rules);
    }

    if (group.groups && group.groups.length > 0) {
      exported.groups = group.groups.map(exportGroup);
    }

    return exported;
  };

  return exportGroup(query);
};

/**
 * Validate filter query
 */
export const validateFilterQuery = (query: FilterQuery, fields: FilterField[]): boolean => {
  const fieldNames = new Set(fields.map((f) => f.name));

  const validateRule = (rule: FilterRule): boolean => {
    if (!fieldNames.has(rule.field)) {
      return false;
    }

    const field = fields.find((f) => f.name === rule.field);
    if (!field) {
      return false;
    }

    const validOperators = getOperatorsForFieldType(field.type);
    if (!validOperators.includes(rule.operator)) {
      return false;
    }

    if (operatorRequiresValue(rule.operator)) {
      if (rule.value === undefined || rule.value === null || rule.value === '') {
        return false;
      }

      if (operatorRequiresTwoValues(rule.operator)) {
        if (rule.value2 === undefined || rule.value2 === null || rule.value2 === '') {
          return false;
        }
      }
    }

    return true;
  };

  const validateGroup = (group: FilterGroup): boolean => {
    if (group.rules) {
      for (const rule of group.rules) {
        if (!validateRule(rule)) {
          return false;
        }
      }
    }

    if (group.groups) {
      for (const subGroup of group.groups) {
        if (!validateGroup(subGroup)) {
          return false;
        }
      }
    }

    return true;
  };

  return validateGroup(query);
};
