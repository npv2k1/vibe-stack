import React, { forwardRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'motion/react';

import { cn } from '../utils';

import { KanbanCardProps } from './Kanban.types';

/**
 * Individual Kanban card component with drag functionality
 */
export const KanbanCard = forwardRef<HTMLDivElement, KanbanCardProps>(function KanbanCard(
  { card, onClick, renderCard, className, isDragging: isDraggingProp, disabled = false, attributes, listeners },
  ref,
) {
  const { setNodeRef, transform, transition, isDragging: isDraggingInternal } = useSortable({
    id: card.id,
    disabled,
  });

  const isDragging = isDraggingProp ?? isDraggingInternal;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const defaultCardContent = (
    <>
      {card.title && <h4 className="text-sm font-semibold text-gray-900">{card.title}</h4>}
      {card.description && <p className="mt-1 text-xs text-gray-600">{card.description}</p>}
    </>
  );

  return (
    <motion.div
      ref={(node) => {
        setNodeRef(node);
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      style={style}
      className={cn(
        'group relative cursor-grab rounded-lg border bg-white p-3 shadow-sm transition-all',
        'hover:shadow-md',
        {
          'cursor-grabbing opacity-50': isDragging,
          'cursor-not-allowed opacity-60': disabled,
        },
        className,
      )}
      onClick={onClick}
      {...attributes}
      {...listeners}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      {renderCard ? renderCard(card) : defaultCardContent}
    </motion.div>
  );
});
