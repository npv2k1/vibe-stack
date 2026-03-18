# FilterBuilder Component - Usage Examples

This document provides practical examples of how to use the FilterBuilder component in different scenarios.

## Installation

```bash
npm install @vdailyapp/ui
# or
yarn add @vdailyapp/ui
# or
pnpm add @vdailyapp/ui
```

## Basic Example - Simple Search Form

```tsx
import { FilterBuilder, FilterField, exportFilterQuery } from '@vdailyapp/ui';
import { useState } from 'react';

function UserSearchForm() {
  const fields: FilterField[] = [
    { name: 'name', label: 'Name', type: 'string' },
    { name: 'email', label: 'Email', type: 'string' },
    { name: 'age', label: 'Age', type: 'number' },
  ];

  const [query, setQuery] = useState<FilterQuery | undefined>();

  const handleSearch = () => {
    if (!query) return;
    
    const exportedQuery = exportFilterQuery(query);
    console.log('Search with query:', exportedQuery);
    // Send to API or use for local filtering
  };

  return (
    <div>
      <FilterBuilder fields={fields} onChange={setQuery} />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}
```

## Example - Analytics Dashboard

```tsx
import { FilterBuilder, FilterField, FilterQuery } from '@vdailyapp/ui';
import { useState, useEffect } from 'react';

function AnalyticsDashboard() {
  const analyticsFields: FilterField[] = [
    { name: 'event', label: 'Event Name', type: 'string' },
    { name: 'userId', label: 'User ID', type: 'string' },
    { name: 'timestamp', label: 'Date', type: 'date' },
    { name: 'value', label: 'Value', type: 'number' },
    {
      name: 'platform',
      label: 'Platform',
      type: 'select',
      options: [
        { label: 'Web', value: 'web' },
        { label: 'Mobile', value: 'mobile' },
        { label: 'Desktop', value: 'desktop' },
      ],
    },
  ];

  const [filters, setFilters] = useState<FilterQuery | undefined>();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (filters) {
      fetchAnalyticsData(filters).then(setData);
    }
  }, [filters]);

  return (
    <div>
      <h1>Analytics Dashboard</h1>
      <FilterBuilder fields={analyticsFields} onChange={setFilters} />
      <AnalyticsChart data={data} />
    </div>
  );
}
```

## Example - E-commerce Product Filter

```tsx
import { FilterBuilder, FilterField } from '@vdailyapp/ui';

function ProductFilter({ onFilterChange }: { onFilterChange: (query: FilterQuery | undefined) => void }) {
  const productFields: FilterField[] = [
    { name: 'name', label: 'Product Name', type: 'string' },
    { name: 'price', label: 'Price', type: 'number' },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      options: [
        { label: 'Electronics', value: 'electronics' },
        { label: 'Clothing', value: 'clothing' },
        { label: 'Books', value: 'books' },
        { label: 'Home & Garden', value: 'home' },
      ],
    },
    {
      name: 'brand',
      label: 'Brand',
      type: 'select',
      options: [
        { label: 'Apple', value: 'apple' },
        { label: 'Samsung', value: 'samsung' },
        { label: 'Nike', value: 'nike' },
        { label: 'Adidas', value: 'adidas' },
      ],
    },
    { name: 'inStock', label: 'In Stock', type: 'boolean' },
    { name: 'rating', label: 'Rating', type: 'number' },
  ];

  return (
    <div className="product-filter">
      <h2>Filter Products</h2>
      <FilterBuilder
        fields={productFields}
        onChange={onFilterChange}
        showAddGroup={true}
        maxDepth={2}
      />
    </div>
  );
}
```

## Example - Data Table with Advanced Filtering

```tsx
import { FilterBuilder, FilterField, validateFilterQuery, exportFilterQuery } from '@vdailyapp/ui';
import { useState } from 'react';

function DataTable() {
  const tableFields: FilterField[] = [
    { name: 'id', label: 'ID', type: 'string' },
    { name: 'customer', label: 'Customer Name', type: 'string' },
    { name: 'email', label: 'Email', type: 'string' },
    { name: 'total', label: 'Total Amount', type: 'number' },
    { name: 'orderDate', label: 'Order Date', type: 'date' },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
  ];

  const [filterQuery, setFilterQuery] = useState<FilterQuery | undefined>();
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const applyFilters = () => {
    if (!filterQuery || !validateFilterQuery(filterQuery, tableFields)) {
      alert('Invalid filter query');
      return;
    }

    const query = exportFilterQuery(filterQuery);
    
    // Send to API
    fetch('/api/orders/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filters: query }),
    })
      .then((res) => res.json())
      .then((data) => setFilteredData(data));
  };

  return (
    <div>
      <div className="filter-section">
        <FilterBuilder fields={tableFields} onChange={setFilterQuery} />
        <button onClick={applyFilters}>Apply Filters</button>
      </div>
      <table>
        {/* Render filtered data */}
      </table>
    </div>
  );
}
```

## Example - Saving and Loading Filters

```tsx
import { FilterBuilder, FilterQuery } from '@vdailyapp/ui';
import { useState, useEffect } from 'react';

function SaveableFilterBuilder({ fields }: { fields: FilterField[] }) {
  const [query, setQuery] = useState<FilterQuery>();

  // Load saved filter on mount
  useEffect(() => {
    const savedFilter = localStorage.getItem('myFilter');
    if (savedFilter) {
      try {
        setQuery(JSON.parse(savedFilter));
      } catch (error) {
        console.error('Failed to load saved filter', error);
      }
    }
  }, []);

  // Save filter when it changes
  const handleFilterChange = (newQuery: FilterQuery) => {
    setQuery(newQuery);
    localStorage.setItem('myFilter', JSON.stringify(newQuery));
  };

  const clearFilter = () => {
    setQuery(undefined);
    localStorage.removeItem('myFilter');
  };

  return (
    <div>
      <FilterBuilder fields={fields} value={query} onChange={handleFilterChange} />
      <button onClick={clearFilter}>Clear Saved Filter</button>
    </div>
  );
}
```

## Example - Backend Integration (Node.js/Express)

```typescript
// Server-side: Convert filter query to database query
import { FilterQuery } from '@vdailyapp/ui';

function convertFilterToMongoQuery(filterQuery: FilterQuery): any {
  const convertRule = (rule: any) => {
    const { field, operator, value, value2 } = rule;
    
    switch (operator) {
      case 'equals':
        return { [field]: value };
      case 'not_equals':
        return { [field]: { $ne: value } };
      case 'contains':
        return { [field]: { $regex: value, $options: 'i' } };
      case 'not_contains':
        return { [field]: { $not: { $regex: value, $options: 'i' } } };
      case 'starts_with':
        return { [field]: { $regex: `^${value}`, $options: 'i' } };
      case 'ends_with':
        return { [field]: { $regex: `${value}$`, $options: 'i' } };
      case 'greater_than':
        return { [field]: { $gt: value } };
      case 'greater_than_or_equal':
        return { [field]: { $gte: value } };
      case 'less_than':
        return { [field]: { $lt: value } };
      case 'less_than_or_equal':
        return { [field]: { $lte: value } };
      case 'between':
        return { [field]: { $gte: value, $lte: value2 } };
      case 'not_between':
        return { [field]: { $not: { $gte: value, $lte: value2 } } };
      case 'in':
        return { [field]: { $in: Array.isArray(value) ? value : [value] } };
      case 'not_in':
        return { [field]: { $nin: Array.isArray(value) ? value : [value] } };
      case 'is_null':
        return { [field]: null };
      case 'is_not_null':
        return { [field]: { $ne: null } };
      default:
        return {};
    }
  };

  const convertGroup = (group: FilterQuery): any => {
    const conditions: any[] = [];
    
    if (group.rules) {
      conditions.push(...group.rules.map(convertRule));
    }
    
    if (group.groups) {
      conditions.push(...group.groups.map(convertGroup));
    }
    
    if (conditions.length === 0) return {};
    if (conditions.length === 1) return conditions[0];
    
    return group.operator === 'AND'
      ? { $and: conditions }
      : { $or: conditions };
  };

  return convertGroup(filterQuery);
}

// Express route example
app.post('/api/search', async (req, res) => {
  const { filters } = req.body;
  const mongoQuery = convertFilterToMongoQuery(filters);
  
  const results = await db.collection('users').find(mongoQuery).toArray();
  res.json(results);
});
```

## Tips and Best Practices

1. **Always validate filter queries before sending to API**
   ```tsx
   if (validateFilterQuery(query, fields)) {
     // Send to API
   }
   ```

2. **Use `exportFilterQuery` to get clean JSON without internal IDs**
   ```tsx
   const cleanQuery = exportFilterQuery(query);
   ```

3. **Provide clear, user-friendly field labels**
   ```tsx
   { name: 'createdAt', label: 'Created Date', type: 'date' }
   ```

4. **Limit nesting depth for better UX**
   ```tsx
   <FilterBuilder maxDepth={2} />
   ```

5. **Save filters to localStorage or URL params for persistence**
   ```tsx
   localStorage.setItem('filter', JSON.stringify(query));
   ```

6. **For select fields, provide meaningful options**
   ```tsx
   options: [
     { label: 'Active Users', value: 'active' },
     { label: 'Inactive Users', value: 'inactive' }
   ]
   ```
