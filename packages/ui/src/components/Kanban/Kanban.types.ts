import { ReactNode } from 'react';
import { DraggableAttributes } from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

/**
 * Represents a single card in a Kanban column
 */
export interface KanbanCard {
  /**
   * Unique identifier for the card
   */
  id: string;
  
  /**
   * Optional title for the card
   */
  title?: string;
  
  /**
   * Optional description for the card
   */
  description?: string;
  
  /**
   * Optional custom data for the card
   */
  data?: Record<string, any>;
}

/**
 * Represents a column in the Kanban board
 */
export interface KanbanColumn {
  /**
   * Unique identifier for the column
   */
  id: string;
  
  /**
   * Title of the column
   */
  title: string;
  
  /**
   * Cards contained in this column
   */
  cards: KanbanCard[];
  
  /**
   * Optional maximum number of cards allowed in this column
   */
  maxCards?: number;
  
  /**
   * Optional color for the column header
   */
  color?: string;
}

/**
 * Event data when a card is moved
 */
export interface CardMoveEvent {
  /**
   * The card that was moved
   */
  card: KanbanCard;
  
  /**
   * Source column ID
   */
  fromColumnId: string;
  
  /**
   * Destination column ID
   */
  toColumnId: string;
  
  /**
   * New position in the destination column
   */
  newIndex: number;
  
  /**
   * Old position in the source column
   */
  oldIndex: number;
}

/**
 * Props for the Kanban Board component
 */
export interface KanbanBoardProps {
  /**
   * Columns to display in the board
   */
  columns: KanbanColumn[];
  
  /**
   * Callback when a card is moved between columns or reordered within a column
   */
  onCardMove?: (event: CardMoveEvent) => void;
  
  /**
   * Callback when a card is clicked
   */
  onCardClick?: (card: KanbanCard, columnId: string) => void;
  
  /**
   * Custom render function for card content
   */
  renderCard?: (card: KanbanCard, columnId: string) => ReactNode;
  
  /**
   * Custom render function for column header
   */
  renderColumnHeader?: (column: KanbanColumn) => ReactNode;
  
  /**
   * Additional CSS classes for the board container
   */
  className?: string;
  
  /**
   * Additional CSS classes for columns
   */
  columnClassName?: string;
  
  /**
   * Additional CSS classes for cards
   */
  cardClassName?: string;
  
  /**
   * Whether to show card count in column headers
   * @default true
   */
  showCardCount?: boolean;
  
  /**
   * Disable drag and drop functionality
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Enable animations for drag operations
   * @default true
   */
  animated?: boolean;
}

/**
 * Props for the Kanban Column component
 */
export interface KanbanColumnProps {
  /**
   * The column data
   */
  column: KanbanColumn;
  
  /**
   * Cards to display in this column
   */
  cards: KanbanCard[];
  
  /**
   * Callback when a card is clicked
   */
  onCardClick?: (card: KanbanCard) => void;
  
  /**
   * Custom render function for card content
   */
  renderCard?: (card: KanbanCard) => ReactNode;
  
  /**
   * Custom render function for column header
   */
  renderColumnHeader?: (column: KanbanColumn) => ReactNode;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Additional CSS classes for cards
   */
  cardClassName?: string;
  
  /**
   * Whether to show card count in header
   * @default true
   */
  showCardCount?: boolean;
  
  /**
   * Whether drag and drop is disabled
   * @default false
   */
  disabled?: boolean;
}

/**
 * Props for the Kanban Card component
 */
export interface KanbanCardProps {
  /**
   * The card data
   */
  card: KanbanCard;
  
  /**
   * Callback when the card is clicked
   */
  onClick?: () => void;
  
  /**
   * Custom render function for card content
   */
  renderCard?: (card: KanbanCard) => ReactNode;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Whether the card is being dragged
   */
  isDragging?: boolean;
  
  /**
   * Whether drag and drop is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Drag attributes from dnd-kit
   */
  attributes?: DraggableAttributes;
  
  /**
   * Drag listeners from dnd-kit
   */
  listeners?: SyntheticListenerMap;
}
