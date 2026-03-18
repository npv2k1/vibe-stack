import React, { useState } from 'react';
import { Kanban, KanbanColumn as KanbanColumnType, CardMoveEvent } from './index';

/**
 * Example usage of the Kanban component
 * This can be used as a reference for implementing the Kanban board
 */
export function KanbanExample() {
  const [columns, setColumns] = useState<KanbanColumnType[]>([
    {
      id: 'todo',
      title: '📝 To Do',
      cards: [
        { 
          id: '1', 
          title: 'Design new landing page', 
          description: 'Create wireframes and mockups for the new landing page',
          data: { priority: 'high', tags: ['design', 'ui'] }
        },
        { 
          id: '2', 
          title: 'Set up CI/CD pipeline', 
          description: 'Configure automated testing and deployment',
          data: { priority: 'medium', tags: ['devops'] }
        },
        { 
          id: '3', 
          title: 'Write API documentation', 
          description: 'Document all REST API endpoints',
          data: { priority: 'low', tags: ['docs'] }
        },
      ],
      color: '#3B82F6'
    },
    {
      id: 'in-progress',
      title: '🚀 In Progress',
      cards: [
        { 
          id: '4', 
          title: 'Implement authentication', 
          description: 'Add JWT-based authentication system',
          data: { priority: 'high', tags: ['backend', 'security'] }
        },
        { 
          id: '5', 
          title: 'Update user dashboard', 
          description: 'Redesign the user dashboard with new metrics',
          data: { priority: 'medium', tags: ['frontend', 'ui'] }
        },
      ],
      maxCards: 3,
      color: '#F59E0B'
    },
    {
      id: 'review',
      title: '👀 Review',
      cards: [
        { 
          id: '6', 
          title: 'Fix responsive issues', 
          description: 'Address mobile layout problems',
          data: { priority: 'high', tags: ['frontend', 'bug'] }
        },
      ],
      color: '#8B5CF6'
    },
    {
      id: 'done',
      title: '✅ Done',
      cards: [
        { 
          id: '7', 
          title: 'Database migration', 
          description: 'Successfully migrated to PostgreSQL',
          data: { priority: 'high', tags: ['database'] }
        },
        { 
          id: '8', 
          title: 'Setup monitoring', 
          description: 'Configured application monitoring with Grafana',
          data: { priority: 'medium', tags: ['devops'] }
        },
      ],
      color: '#10B981'
    },
  ]);

  const handleCardMove = (event: CardMoveEvent) => {
    console.log('Card moved:', event);
    
    // Update state after move
    setColumns((prevColumns) => {
      const newColumns = prevColumns.map(col => ({
        ...col,
        cards: [...col.cards]
      }));

      const sourceColumn = newColumns.find(col => col.id === event.fromColumnId);
      const destColumn = newColumns.find(col => col.id === event.toColumnId);

      if (sourceColumn && destColumn) {
        // The card has already been moved in the component state
        // This is just for persistence/API calls
        console.log(`Moved "${event.card.title}" from "${event.fromColumnId}" to "${event.toColumnId}"`);
      }

      return newColumns;
    });
  };

  const handleCardClick = (card: any, columnId: string) => {
    console.log('Card clicked:', card, 'in column:', columnId);
    alert(`Clicked: ${card.title}\nColumn: ${columnId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">
          Project Management Board
        </h1>
        <p className="mb-4 text-gray-600">
          Drag and drop cards between columns to update their status.
        </p>
        
        <Kanban.Board
          columns={columns}
          onCardMove={handleCardMove}
          onCardClick={handleCardClick}
          renderCard={(card, columnId) => (
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h4 className="text-sm font-semibold text-gray-900">{card.title}</h4>
                {card.data?.priority && (
                  <span
                    className={`rounded px-2 py-1 text-xs font-medium ${
                      card.data.priority === 'high'
                        ? 'bg-red-100 text-red-700'
                        : card.data.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {card.data.priority}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600">{card.description}</p>
              {card.data?.tags && (
                <div className="flex flex-wrap gap-1">
                  {card.data.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
}
