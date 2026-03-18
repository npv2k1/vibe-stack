# FilterBuilder Component

A flexible and powerful filter builder component for creating complex query filters with AND/OR operations, multiple comparison operators, and nested groups.

## Features

- ✅ Support for multiple field types (string, number, date, boolean, select)
- ✅ Various comparison operators (equals, contains, between, greater than, etc.)
- ✅ AND/OR logical operators for combining rules
- ✅ Nested filter groups with configurable depth
- ✅ JSON query export for easy integration with APIs
- ✅ Type-safe with TypeScript
- ✅ Clean and intuitive UI

## Installation

The component is part of the `@vdailyapp/ui` package.

```bash
npm install @vdailyapp/ui
```

## Basic Usage

```tsx
import { FilterBuilder, FilterField } from '@vdailyapp/ui';

const fields: FilterField[] = [
  { name: 'name', label: 'Name', type: 'string' },
  { name: 'age', label: 'Age', type: 'number' },
  { name: 'email', label: 'Email', type: 'string' },
  { name: 'createdAt', label: 'Created Date', type: 'date' },
  { 
    name: 'status', 
    label: 'Status', 
    type: 'select',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
      { label: 'Pending', value: 'pending' }
    ]
  },
];

function MySearchForm() {
  const [filterQuery, setFilterQuery] = useState();

  const handleFilterChange = (query) => {
    console.log('Filter Query:', query);
    setFilterQuery(query);
  };

  return (
    <FilterBuilder
      fields={fields}
      onChange={handleFilterChange}
    />
  );
}
```

## Field Types

The FilterBuilder supports the following field types:

### String
```tsx
{ name: 'name', label: 'Name', type: 'string' }
```
**Available operators:** equals, not_equals, contains, not_contains, starts_with, ends_with, is_null, is_not_null

### Number
```tsx
{ name: 'age', label: 'Age', type: 'number' }
```
**Available operators:** equals, not_equals, greater_than, greater_than_or_equal, less_than, less_than_or_equal, between, not_between, is_null, is_not_null

### Date
```tsx
{ name: 'createdAt', label: 'Created Date', type: 'date' }
```
**Available operators:** equals, not_equals, greater_than, greater_than_or_equal, less_than, less_than_or_equal, between, not_between, is_null, is_not_null

### Boolean
```tsx
{ name: 'isActive', label: 'Is Active', type: 'boolean' }
```
**Available operators:** equals, not_equals

### Select (with options)
```tsx
{ 
  name: 'status', 
  label: 'Status', 
  type: 'select',
  options: [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' }
  ]
}
```
**Available operators:** equals, not_equals, in, not_in, is_null, is_not_null

## Props

### FilterBuilderProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fields` | `FilterField[]` | required | Array of field definitions available for filtering |
| `value` | `FilterQuery` | undefined | Initial or controlled filter query value |
| `onChange` | `(query: FilterQuery) => void` | undefined | Callback when filter query changes |
| `className` | `string` | undefined | Additional CSS classes |
| `showAddGroup` | `boolean` | `true` | Whether to show the add group button |
| `maxDepth` | `number` | `3` | Maximum nesting level for groups |

## Output Format

The FilterBuilder outputs a JSON query object with the following structure:

```json
{
  "operator": "AND",
  "rules": [
    {
      "field": "name",
      "operator": "contains",
      "value": "John"
    },
    {
      "field": "age",
      "operator": "greater_than",
      "value": 25
    }
  ],
  "groups": [
    {
      "operator": "OR",
      "rules": [
        {
          "field": "status",
          "operator": "equals",
          "value": "active"
        },
        {
          "field": "status",
          "operator": "equals",
          "value": "pending"
        }
      ]
    }
  ]
}
```

## Advanced Examples

### Using with Forms

```tsx
import { Form, FilterBuilder } from '@vdailyapp/ui';

function SearchForm() {
  const handleSubmit = (data) => {
    // data.filters will contain the filter query
    console.log('Filters:', data.filters);
    // Send to API or use for local filtering
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item name="filters">
        <FilterBuilder fields={fields} />
      </Form.Item>
      <button type="submit">Search</button>
    </Form>
  );
}
```

### Converting to API Query

```tsx
import { exportFilterQuery } from '@vdailyapp/ui';

function sendToApi(query) {
  const exportedQuery = exportFilterQuery(query);
  
  // Send to your API
  fetch('/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filters: exportedQuery })
  });
}
```

### Using with Analytics Dashboard

```tsx
function AnalyticsDashboard() {
  const [filters, setFilters] = useState();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (filters) {
      // Fetch filtered data
      fetchAnalytics(filters).then(setData);
    }
  }, [filters]);

  return (
    <div>
      <FilterBuilder
        fields={analyticsFields}
        onChange={setFilters}
      />
      <Chart data={data} />
    </div>
  );
}
```

### Controlled Component

```tsx
function ControlledFilterBuilder() {
  const [query, setQuery] = useState({
    operator: 'AND',
    rules: [
      {
        id: '1',
        field: 'name',
        operator: 'contains',
        value: 'test'
      }
    ]
  });

  return (
    <FilterBuilder
      fields={fields}
      value={query}
      onChange={setQuery}
    />
  );
}
```

## Utility Functions

### exportFilterQuery

Exports the filter query to a clean JSON format (removes internal IDs).

```tsx
import { exportFilterQuery } from '@vdailyapp/ui';

const cleanQuery = exportFilterQuery(filterQuery);
```

### validateFilterQuery

Validates a filter query against the provided fields.

```tsx
import { validateFilterQuery } from '@vdailyapp/ui';

const isValid = validateFilterQuery(filterQuery, fields);
```

### createEmptyQuery

Creates an empty filter query with one default rule.

```tsx
import { createEmptyQuery } from '@vdailyapp/ui';

const emptyQuery = createEmptyQuery(fields);
```

## Styling

The FilterBuilder uses Tailwind CSS classes and can be customized using the `className` prop:

```tsx
<FilterBuilder
  fields={fields}
  className="shadow-lg p-6 bg-gray-50"
/>
```

## Best Practices

1. **Provide clear field labels**: Use human-readable labels that make sense to your users
2. **Limit nesting depth**: Don't set `maxDepth` too high to avoid overwhelming users
3. **Validate on submit**: Use `validateFilterQuery` before sending to API
4. **Handle empty states**: Check if the query has rules before processing
5. **Persist filters**: Save filter queries to localStorage or URL params for better UX

## Use Cases

- **Search Forms**: Allow users to build complex search queries
- **Analytics Dashboards**: Filter data visualizations dynamically
- **Data Tables**: Advanced filtering for large datasets
- **Report Builders**: Create custom reports with specific criteria
- **Admin Panels**: Filter records with multiple conditions
