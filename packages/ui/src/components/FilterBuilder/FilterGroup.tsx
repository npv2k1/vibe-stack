import React from 'react';

import { Button } from '../Button';
import { Icon } from '../Icon';
import { SelectInput } from '../Input/SelectInput';
import { cn } from '../utils';

import { FilterGroupProps, FilterLogicalOperator } from './FilterBuilder.types';
import { FilterRule } from './FilterRule';
import { createEmptyGroup, createEmptyRule } from './utils';

export const FilterGroup: React.FC<FilterGroupProps> = ({
  group,
  fields,
  onChange,
  onRemove,
  depth,
  maxDepth,
  showAddGroup,
}) => {
  const handleOperatorChange = (operator: FilterLogicalOperator) => {
    onChange({
      ...group,
      operator,
    });
  };

  const handleAddRule = () => {
    const newRule = createEmptyRule(fields);
    onChange({
      ...group,
      rules: [...group.rules, newRule],
    });
  };

  const handleRuleChange = (index: number, updatedRule: any) => {
    const newRules = [...group.rules];
    newRules[index] = updatedRule;
    onChange({
      ...group,
      rules: newRules,
    });
  };

  const handleRemoveRule = (index: number) => {
    // Don't allow removing the last rule
    if (group.rules.length === 1 && (!group.groups || group.groups.length === 0)) {
      return;
    }

    onChange({
      ...group,
      rules: group.rules.filter((_, i) => i !== index),
    });
  };

  const handleAddGroup = () => {
    const newGroup = createEmptyGroup(fields);
    onChange({
      ...group,
      groups: [...(group.groups || []), newGroup],
    });
  };

  const handleGroupChange = (index: number, updatedGroup: any) => {
    const newGroups = [...(group.groups || [])];
    newGroups[index] = updatedGroup;
    onChange({
      ...group,
      groups: newGroups,
    });
  };

  const handleRemoveGroup = (index: number) => {
    onChange({
      ...group,
      groups: (group.groups || []).filter((_, i) => i !== index),
    });
  };

  const canAddGroup = depth < maxDepth && showAddGroup;

  return (
    <div
      className={cn(
        'p-4 rounded-lg border space-y-3',
        depth === 0 ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50',
      )}
    >
      {/* Header with operator and remove button */}
      <div className="flex items-center gap-3">
        <SelectInput
          value={group.operator}
          onChange={handleOperatorChange}
          options={[
            { label: 'AND', value: 'AND' },
            { label: 'OR', value: 'OR' },
          ]}
          className="w-32"
        />
        {depth > 0 && onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="ml-auto text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Icon name="Trash2" fontSize={16} className="mr-1" />
            Remove Group
          </Button>
        )}
      </div>

      {/* Rules */}
      <div className="space-y-2">
        {group.rules.map((rule, index) => (
          <FilterRule
            key={rule.id}
            rule={rule}
            fields={fields}
            onChange={(updatedRule) => handleRuleChange(index, updatedRule)}
            onRemove={() => handleRemoveRule(index)}
          />
        ))}
      </div>

      {/* Nested Groups */}
      {group.groups && group.groups.length > 0 && (
        <div className="space-y-3 pl-4 border-l-2 border-gray-300">
          {group.groups.map((subGroup, index) => (
            <FilterGroup
              key={subGroup.id}
              group={subGroup}
              fields={fields}
              onChange={(updatedGroup) => handleGroupChange(index, updatedGroup)}
              onRemove={() => handleRemoveGroup(index)}
              depth={depth + 1}
              maxDepth={maxDepth}
              showAddGroup={showAddGroup}
            />
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        <Button variant="secondary" size="sm" onClick={handleAddRule} className="text-blue-600 hover:text-blue-700">
          <Icon name="Plus" fontSize={16} className="mr-1" />
          Add Rule
        </Button>
        {canAddGroup && (
          <Button variant="secondary" size="sm" onClick={handleAddGroup} className="text-green-600 hover:text-green-700">
            <Icon name="FolderPlus" fontSize={16} className="mr-1" />
            Add Group
          </Button>
        )}
      </div>
    </div>
  );
};
