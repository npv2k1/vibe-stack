import React, { forwardRef } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion } from 'motion/react';

import { cn } from '../utils';

import { KanbanCard } from './KanbanCard';
import { KanbanColumnProps } from './Kanban.types';

/**
 * Kanban column component that contains sortable cards
 */
export const KanbanColumn = forwardRef<HTMLDivElement, KanbanColumnProps>(function KanbanColumn(
  { column, cards, onCardClick, renderCard, renderColumnHeader, className, cardClassName, showCardCount = true, disabled = false },
  ref,
) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    disabled,
  });

  const isMaxReached = column.maxCards !== undefined && cards.length >= column.maxCards;

  const defaultColumnHeader = (
    <div className="flex items-center justify-between">
      <h3 className="text-base font-semibold text-gray-900">{column.title}</h3>
      {showCardCount && (
        <span className="rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700">
          {cards.length}
          {column.maxCards && ` / ${column.maxCards}`}
        </span>
      )}
    </div>
  );

  return (
    <motion.div
      ref={ref}
      className={cn('flex min-w-[280px] flex-col rounded-lg bg-gray-50 p-4', className)}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Column Header */}
      <div
        className={cn('mb-4 border-b pb-3', {
          'border-gray-300': !column.color,
        })}
        style={column.color ? { borderColor: column.color } : undefined}
      >
        {renderColumnHeader ? renderColumnHeader(column) : defaultColumnHeader}
      </div>

      {/* Droppable Area */}
      <SortableContext id={column.id} items={cards.map((card) => card.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={cn(
            'flex min-h-[200px] flex-1 flex-col gap-3 rounded-md p-2 transition-colors',
            {
              'bg-blue-50 ring-2 ring-blue-400': isOver && !isMaxReached && !disabled,
              'bg-red-50 ring-2 ring-red-400': isOver && isMaxReached,
              'opacity-50': disabled,
            },
          )}
        >
          {cards.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-4 text-center text-sm text-gray-500">
              Drop cards here
            </div>
          ) : (
            cards.map((card) => (
              <KanbanCard
                key={card.id}
                card={card}
                onClick={() => onCardClick?.(card)}
                renderCard={renderCard}
                className={cardClassName}
                disabled={disabled}
              />
            ))
          )}
        </div>
      </SortableContext>

      {/* Max cards warning */}
      {isMaxReached && (
        <motion.div
          className="mt-2 rounded-md bg-yellow-50 p-2 text-xs text-yellow-800"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          Maximum cards reached
        </motion.div>
      )}
    </motion.div>
  );
});
