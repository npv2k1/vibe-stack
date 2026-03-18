import { KanbanBoard } from './KanbanBoard';
import { KanbanCard } from './KanbanCard';
import { KanbanColumn } from './KanbanColumn';

export * from './Kanban.types';

/**
 * Kanban component for creating drag-and-drop task boards
 * 
 * @example
 * ```tsx
 * import { Kanban } from '@vdailyapp/ui';
 * 
 * const columns = [
 *   {
 *     id: 'todo',
 *     title: 'To Do',
 *     cards: [
 *       { id: '1', title: 'Task 1', description: 'Description 1' },
 *       { id: '2', title: 'Task 2', description: 'Description 2' }
 *     ]
 *   },
 *   {
 *     id: 'in-progress',
 *     title: 'In Progress',
 *     cards: [
 *       { id: '3', title: 'Task 3', description: 'Description 3' }
 *     ]
 *   },
 *   {
 *     id: 'done',
 *     title: 'Done',
 *     cards: []
 *   }
 * ];
 * 
 * function MyKanban() {
 *   const handleCardMove = (event) => {
 *     console.log('Card moved:', event);
 *   };
 * 
 *   return (
 *     <Kanban.Board
 *       columns={columns}
 *       onCardMove={handleCardMove}
 *       onCardClick={(card) => console.log('Clicked:', card)}
 *     />
 *   );
 * }
 * ```
 */
export const Kanban = {
  /**
   * Main Kanban board component
   */
  Board: KanbanBoard,
  
  /**
   * Individual column component (usually used internally by Board)
   */
  Column: KanbanColumn,
  
  /**
   * Individual card component (usually used internally by Column)
   */
  Card: KanbanCard,
};
