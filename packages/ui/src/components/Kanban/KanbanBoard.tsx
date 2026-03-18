import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
  PointerSensor,
} from '@dnd-kit/core';

import { cn } from '../utils';

import { KanbanCard } from './KanbanCard';
import { KanbanColumn } from './KanbanColumn';
import { CardMoveEvent, KanbanBoardProps, KanbanCard as KanbanCardType, KanbanColumn as KanbanColumnType } from './Kanban.types';

/**
 * Main Kanban Board component with drag-and-drop functionality
 * 
 * @example
 * ```tsx
 * const columns = [
 *   { id: 'todo', title: 'To Do', cards: [...] },
 *   { id: 'in-progress', title: 'In Progress', cards: [...] },
 *   { id: 'done', title: 'Done', cards: [...] }
 * ];
 * 
 * <Kanban.Board
 *   columns={columns}
 *   onCardMove={(event) => console.log('Card moved:', event)}
 * />
 * ```
 */
export const KanbanBoard = forwardRef<HTMLDivElement, KanbanBoardProps>(function KanbanBoard(
  {
    columns: columnsProp,
    onCardMove,
    onCardClick,
    renderCard,
    renderColumnHeader,
    className,
    columnClassName,
    cardClassName,
    showCardCount = true,
    disabled = false,
    animated = true,
  },
  ref,
) {
  const [columns, setColumns] = useState(columnsProp);
  const [activeCard, setActiveCard] = useState<KanbanCardType | null>(null);

  // Update columns when prop changes
  React.useEffect(() => {
    setColumns(columnsProp);
  }, [columnsProp]);

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before dragging starts
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    }),
  );

  // Find card and its column
  const findCard = useCallback(
    (cardId: string): { card: KanbanCardType; columnId: string; index: number } | null => {
      for (const column of columns) {
        const index = column.cards.findIndex((card) => card.id === cardId);
        if (index !== -1) {
          return { card: column.cards[index], columnId: column.id, index };
        }
      }
      return null;
    },
    [columns],
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const result = findCard(active.id as string);
      if (result) {
        setActiveCard(result.card);
      }
    },
    [findCard],
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) return;

      const activeResult = findCard(active.id as string);
      if (!activeResult) return;

      const { columnId: activeColumnId, index: activeIndex } = activeResult;

      // Check if dragging over a column
      const overColumn = columns.find((col) => col.id === over.id);
      if (overColumn) {
        // Moving to a different column
        if (activeColumnId !== overColumn.id) {
          // Check max cards limit
          if (overColumn.maxCards !== undefined && overColumn.cards.length >= overColumn.maxCards) {
            return;
          }

          setColumns((prevColumns) => {
            const newColumns = prevColumns.map((col) => ({ ...col, cards: [...col.cards] }));
            const sourceColumn = newColumns.find((col) => col.id === activeColumnId);
            const destColumn = newColumns.find((col) => col.id === overColumn.id);

            if (sourceColumn && destColumn) {
              const [movedCard] = sourceColumn.cards.splice(activeIndex, 1);
              destColumn.cards.push(movedCard);
            }

            return newColumns;
          });
        }
        return;
      }

      // Check if dragging over another card
      const overResult = findCard(over.id as string);
      if (!overResult) return;

      const { columnId: overColumnId, index: overIndex } = overResult;

      if (activeColumnId === overColumnId) {
        // Reordering within the same column
        if (activeIndex !== overIndex) {
          setColumns((prevColumns) => {
            const newColumns = prevColumns.map((col) => ({ ...col, cards: [...col.cards] }));
            const column = newColumns.find((col) => col.id === activeColumnId);

            if (column) {
              const [movedCard] = column.cards.splice(activeIndex, 1);
              column.cards.splice(overIndex, 0, movedCard);
            }

            return newColumns;
          });
        }
      } else {
        // Moving to a different column at a specific position
        const destColumn = columns.find((col) => col.id === overColumnId);
        if (destColumn?.maxCards !== undefined && destColumn.cards.length >= destColumn.maxCards) {
          return;
        }

        setColumns((prevColumns) => {
          const newColumns = prevColumns.map((col) => ({ ...col, cards: [...col.cards] }));
          const sourceColumn = newColumns.find((col) => col.id === activeColumnId);
          const destColumn = newColumns.find((col) => col.id === overColumnId);

          if (sourceColumn && destColumn) {
            const [movedCard] = sourceColumn.cards.splice(activeIndex, 1);
            destColumn.cards.splice(overIndex, 0, movedCard);
          }

          return newColumns;
        });
      }
    },
    [columns, findCard],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      setActiveCard(null);

      if (!over) return;

      const activeResult = findCard(active.id as string);
      if (!activeResult) return;

      const { card, columnId: fromColumnId, index: oldIndex } = activeResult;

      // Find the final position after all drag over operations
      const finalResult = findCard(card.id);
      if (!finalResult) return;

      const { columnId: toColumnId, index: newIndex } = finalResult;

      // Only trigger callback if there was an actual change
      if (fromColumnId !== toColumnId || oldIndex !== newIndex) {
        const moveEvent: CardMoveEvent = {
          card,
          fromColumnId,
          toColumnId,
          newIndex,
          oldIndex,
        };

        onCardMove?.(moveEvent);
      }
    },
    [findCard, onCardMove],
  );

  const handleDragCancel = useCallback(() => {
    setActiveCard(null);
    // Reset to original state
    setColumns(columnsProp);
  }, [columnsProp]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div ref={ref} className={cn('flex gap-4 overflow-x-auto p-4', className)}>
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            cards={column.cards}
            onCardClick={(card) => onCardClick?.(card, column.id)}
            renderCard={renderCard ? (card) => renderCard(card, column.id) : undefined}
            renderColumnHeader={renderColumnHeader}
            className={columnClassName}
            cardClassName={cardClassName}
            showCardCount={showCardCount}
            disabled={disabled}
          />
        ))}
      </div>

      {/* Drag Overlay */}
      {animated && (
        <DragOverlay>
          {activeCard ? (
            <div className="rotate-3 cursor-grabbing opacity-80 shadow-2xl">
              <KanbanCard 
                card={activeCard} 
                renderCard={renderCard ? (card) => renderCard(card, '') : undefined}
                isDragging 
                disabled 
              />
            </div>
          ) : null}
        </DragOverlay>
      )}
    </DndContext>
  );
});
