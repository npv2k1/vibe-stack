# Kanban Component

A dynamic, draggable Kanban board component with smooth animations built with React, TypeScript, and @dnd-kit.

## Features

- 🎯 **Drag and Drop**: Intuitive drag-and-drop functionality for cards between columns
- ✨ **Smooth Animations**: Beautiful animations powered by Motion (Framer Motion)
- 🎨 **Customizable**: Fully customizable cards, columns, and styling
- 📱 **Responsive**: Works on desktop and mobile devices
- ♿ **Accessible**: Built with accessibility in mind
- 🔒 **TypeScript**: Fully typed for better development experience
- 🎛️ **Flexible**: Support for custom render functions and callbacks

## Installation

The component is part of the `@vdailyapp/ui` package. The required drag-and-drop libraries are already included as dependencies.

```bash
# Install the UI package (includes all dependencies)
pnpm add @vdailyapp/ui

# Peer dependencies (usually already installed)
pnpm add react react-dom clsx
```

## Basic Usage

```tsx
import { Kanban } from '@vdailyapp/ui';

const columns = [
  {
    id: 'todo',
    title: 'To Do',
    cards: [
      { id: '1', title: 'Task 1', description: 'First task description' },
      { id: '2', title: 'Task 2', description: 'Second task description' }
    ]
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    cards: [
      { id: '3', title: 'Task 3', description: 'Third task description' }
    ]
  },
  {
    id: 'done',
    title: 'Done',
    cards: []
  }
];

function MyKanban() {
  const handleCardMove = (event) => {
    console.log('Card moved:', event);
    // Update your state here
  };

  return (
    <Kanban.Board
      columns={columns}
      onCardMove={handleCardMove}
    />
  );
}
```

## Advanced Usage

### Custom Card Rendering

```tsx
<Kanban.Board
  columns={columns}
  renderCard={(card, columnId) => (
    <div>
      <h4>{card.title}</h4>
      <p>{card.description}</p>
      <span className="badge">{columnId}</span>
      {card.data?.priority && (
        <span className={`priority-${card.data.priority}`}>
          {card.data.priority}
        </span>
      )}
    </div>
  )}
/>
```

### Custom Column Headers

```tsx
<Kanban.Board
  columns={columns}
  renderColumnHeader={(column) => (
    <div style={{ color: column.color }}>
      <h3>{column.title}</h3>
      <button onClick={() => addCard(column.id)}>+ Add Card</button>
    </div>
  )}
/>
```

### With State Management

```tsx
import { useState } from 'react';
import { Kanban, CardMoveEvent } from '@vdailyapp/ui';

function KanbanWithState() {
  const [columns, setColumns] = useState(initialColumns);

  const handleCardMove = (event: CardMoveEvent) => {
    setColumns((prevColumns) => {
      const newColumns = prevColumns.map(col => ({
        ...col,
        cards: [...col.cards]
      }));

      const sourceColumn = newColumns.find(col => col.id === event.fromColumnId);
      const destColumn = newColumns.find(col => col.id === event.toColumnId);

      if (sourceColumn && destColumn) {
        // Remove from source
        const [movedCard] = sourceColumn.cards.splice(event.oldIndex, 1);
        
        // Add to destination
        destColumn.cards.splice(event.newIndex, 0, movedCard);
      }

      return newColumns;
    });
  };

  const handleCardClick = (card, columnId) => {
    console.log('Card clicked:', card, 'in column:', columnId);
    // Open modal, navigate, etc.
  };

  return (
    <Kanban.Board
      columns={columns}
      onCardMove={handleCardMove}
      onCardClick={handleCardClick}
    />
  );
}
```

### With Maximum Card Limits

```tsx
const columns = [
  {
    id: 'in-progress',
    title: 'In Progress',
    maxCards: 3, // Limit to 3 cards
    cards: [...]
  }
];

<Kanban.Board columns={columns} />
```

### Disabled State

```tsx
<Kanban.Board
  columns={columns}
  disabled={true} // Disable all drag and drop
/>
```

### Custom Styling

```tsx
<Kanban.Board
  columns={columns}
  className="my-kanban-board"
  columnClassName="my-column"
  cardClassName="my-card"
/>
```

## API Reference

### Kanban.Board Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `KanbanColumn[]` | Required | Array of columns to display |
| `onCardMove` | `(event: CardMoveEvent) => void` | - | Callback when a card is moved |
| `onCardClick` | `(card: KanbanCard, columnId: string) => void` | - | Callback when a card is clicked |
| `renderCard` | `(card: KanbanCard, columnId: string) => ReactNode` | - | Custom card renderer |
| `renderColumnHeader` | `(column: KanbanColumn) => ReactNode` | - | Custom column header renderer |
| `className` | `string` | - | CSS class for board container |
| `columnClassName` | `string` | - | CSS class for columns |
| `cardClassName` | `string` | - | CSS class for cards |
| `showCardCount` | `boolean` | `true` | Show card count in column headers |
| `disabled` | `boolean` | `false` | Disable drag and drop |
| `animated` | `boolean` | `true` | Enable animations |

### KanbanColumn

```typescript
interface KanbanColumn {
  id: string;              // Unique identifier
  title: string;           // Column title
  cards: KanbanCard[];     // Cards in this column
  maxCards?: number;       // Optional max cards limit
  color?: string;          // Optional color for header
}
```

### KanbanCard

```typescript
interface KanbanCard {
  id: string;                    // Unique identifier
  title?: string;                // Optional title
  description?: string;          // Optional description
  data?: Record<string, any>;    // Optional custom data
}
```

### CardMoveEvent

```typescript
interface CardMoveEvent {
  card: KanbanCard;        // The moved card
  fromColumnId: string;    // Source column ID
  toColumnId: string;      // Destination column ID
  newIndex: number;        // New position in destination
  oldIndex: number;        // Old position in source
}
```

## Styling

The Kanban component uses Tailwind CSS classes by default. You can customize the appearance using:

1. **CSS Classes**: Pass custom classes via `className`, `columnClassName`, and `cardClassName` props
2. **Custom Renderers**: Use `renderCard` and `renderColumnHeader` for complete control
3. **Column Colors**: Set the `color` property on columns for custom header colors

### Example Custom Styles

```css
.my-kanban-board {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
}

.my-column {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
}

.my-card {
  border-left: 4px solid #667eea;
  transition: transform 0.2s;
}

.my-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

## TypeScript Support

The component is fully typed with TypeScript. Import the types as needed:

```typescript
import {
  Kanban,
  KanbanCard,
  KanbanColumn,
  KanbanBoardProps,
  CardMoveEvent
} from '@vdailyapp/ui';
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

The component includes:
- Keyboard navigation support (via @dnd-kit)
- Touch support for mobile devices
- Screen reader friendly structure
- Focus management during drag operations

## Performance Tips

1. **Memoize Custom Renderers**: Use `useCallback` for custom `renderCard` and `renderColumnHeader` functions to prevent unnecessary re-renders
2. **Virtual Lists**: For columns with many cards (>100), consider implementing virtual scrolling
3. **Optimize Card Data**: Keep card data structures lightweight and avoid deeply nested objects

## Examples

### Project Management Board

```tsx
const projectColumns = [
  {
    id: 'backlog',
    title: '📋 Backlog',
    cards: tasks.filter(t => t.status === 'backlog'),
    color: '#6B7280'
  },
  {
    id: 'todo',
    title: '📝 To Do',
    cards: tasks.filter(t => t.status === 'todo'),
    color: '#3B82F6'
  },
  {
    id: 'in-progress',
    title: '🚀 In Progress',
    cards: tasks.filter(t => t.status === 'in-progress'),
    maxCards: 3,
    color: '#F59E0B'
  },
  {
    id: 'review',
    title: '👀 Review',
    cards: tasks.filter(t => t.status === 'review'),
    color: '#8B5CF6'
  },
  {
    id: 'done',
    title: '✅ Done',
    cards: tasks.filter(t => t.status === 'done'),
    color: '#10B981'
  }
];
```

### Bug Tracker

```tsx
<Kanban.Board
  columns={bugColumns}
  renderCard={(card) => (
    <div className="bug-card">
      <div className="flex items-center justify-between">
        <span className={`severity-${card.data.severity}`}>
          {card.data.severity}
        </span>
        <span className="text-xs text-gray-500">
          #{card.id}
        </span>
      </div>
      <h4 className="font-semibold mt-2">{card.title}</h4>
      <p className="text-sm text-gray-600">{card.description}</p>
      <div className="mt-2 flex gap-2">
        {card.data.tags?.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
    </div>
  )}
/>
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
