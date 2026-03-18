import React, { useMemo } from 'react';

import { Button } from '../Button';
import { Icon } from '../Icon';
import { DateInput } from '../Input/DateInput';
import { NumberInput } from '../Input/NumberInput';
import { SelectInput } from '../Input/SelectInput';
import { TextInput } from '../Input/TextInput';
import { cn } from '../utils';

import { FilterRuleProps } from './FilterBuilder.types';
import {
  getOperatorLabel,
  getOperatorsForFieldType,
  operatorRequiresTwoValues,
  operatorRequiresValue,
} from './utils';

export const FilterRule: React.FC<FilterRuleProps> = ({ rule, fields, onChange, onRemove }) => {
  const selectedField = useMemo(() => fields.find((f) => f.name === rule.field), [fields, rule.field]);

  const availableOperators = useMemo(() => {
    if (!selectedField) return [];
    return getOperatorsForFieldType(selectedField.type);
  }, [selectedField]);

  const handleFieldChange = (fieldName: string) => {
    const newField = fields.find((f) => f.name === fieldName);
    if (!newField) return;

    const operators = getOperatorsForFieldType(newField.type);
    onChange({
      ...rule,
      field: fieldName,
      operator: operators[0],
      value: '',
      value2: undefined,
    });
  };

  const handleOperatorChange = (operator: string) => {
    onChange({
      ...rule,
      operator: operator as any,
      value: operatorRequiresValue(operator as any) ? rule.value : undefined,
      value2: undefined,
    });
  };

  const handleValueChange = (value: any) => {
    onChange({
      ...rule,
      value,
    });
  };

  const handleValue2Change = (value2: any) => {
    onChange({
      ...rule,
      value2,
    });
  };

  const renderValueInput = () => {
    if (!operatorRequiresValue(rule.operator)) {
      return null;
    }

    if (!selectedField) {
      return (
        <TextInput
          value={rule.value || ''}
          onChange={(e) => {
            const value = typeof e === 'string' ? e : e.target.value;
            handleValueChange(value);
          }}
          placeholder="Value"
          className="flex-1"
        />
      );
    }

    const inputProps = {
      value: rule.value || '',
      onChange: handleValueChange,
      placeholder: 'Value',
      className: 'flex-1',
    };

    switch (selectedField.type) {
      case 'number':
        return (
          <NumberInput
            value={rule.value || ''}
            onChange={(value) => handleValueChange(value)}
            placeholder="Value"
            className="flex-1"
          />
        );
      case 'date':
        return (
          <DateInput
            value={rule.value || undefined}
            onChange={(date) => handleValueChange(date)}
            placeholder="Select date"
            className="flex-1"
          />
        );
      case 'boolean':
        return (
          <SelectInput
            value={rule.value}
            onChange={handleValueChange}
            options={[
              { label: 'True', value: true },
              { label: 'False', value: false },
            ]}
            placeholder="Select value"
            className="flex-1"
          />
        );
      case 'select':
        return (
          <SelectInput
            value={rule.value}
            onChange={handleValueChange}
            options={selectedField.options || []}
            placeholder="Select value"
            className="flex-1"
            mode={['in', 'not_in'].includes(rule.operator) ? 'multiple' : undefined}
          />
        );
      case 'string':
      default:
        return (
          <TextInput
            value={rule.value || ''}
            onChange={(e) => {
              const value = typeof e === 'string' ? e : e.target.value;
              handleValueChange(value);
            }}
            placeholder="Value"
            className="flex-1"
          />
        );
    }
  };

  const renderValue2Input = () => {
    if (!operatorRequiresTwoValues(rule.operator) || !selectedField) {
      return null;
    }

    switch (selectedField.type) {
      case 'number':
        return (
          <NumberInput
            value={rule.value2 || ''}
            onChange={(value) => handleValue2Change(value)}
            placeholder="Value 2"
            className="flex-1"
          />
        );
      case 'date':
        return (
          <DateInput
            value={rule.value2 || undefined}
            onChange={(date) => handleValue2Change(date)}
            placeholder="Select end date"
            className="flex-1"
          />
        );
      default:
        return (
          <TextInput
            value={rule.value2 || ''}
            onChange={(e) => {
              const value = typeof e === 'string' ? e : e.target.value;
              handleValue2Change(value);
            }}
            placeholder="Value 2"
            className="flex-1"
          />
        );
    }
  };

  return (
    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
      {/* Field Select */}
      <SelectInput
        value={rule.field}
        onChange={handleFieldChange}
        options={fields.map((f) => ({ label: f.label, value: f.name }))}
        placeholder="Select field"
        className="w-48"
      />

      {/* Operator Select */}
      <SelectInput
        value={rule.operator}
        onChange={handleOperatorChange}
        options={availableOperators.map((op) => ({ label: getOperatorLabel(op), value: op }))}
        placeholder="Select operator"
        className="w-48"
      />

      {/* Value Input */}
      {renderValueInput()}

      {/* Value2 Input (for between operator) */}
      {renderValue2Input()}

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className={cn('text-red-600 hover:text-red-700 hover:bg-red-50 p-2')}
      >
        <Icon name="Trash2" fontSize={18} />
      </Button>
    </div>
  );
};
