import { ReactNode } from 'react';

export type CalendarView = 'month' | 'week' | 'day' | 'agenda' | 'resource';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  color?: string;
  resourceId?: string;
  [key: string]: any;
}

export interface CalendarResource {
  id: string;
  title: string;
  [key: string]: any;
}

export interface CalendarProps {
  events?: CalendarEvent[];
  resources?: CalendarResource[];
  defaultView?: CalendarView;
  defaultDate?: Date;
  onEventClick?: (event: CalendarEvent) => void;
  onSelectSlot?: (start: Date, end: Date) => void;
  onEventDrop?: (event: CalendarEvent, newStart: Date, newEnd: Date) => void;
  renderEvent?: (event: CalendarEvent) => ReactNode;
  className?: string;
  useInternalDndContext?: boolean;
}

export interface ViewProps {
  date: Date;
  events: CalendarEvent[];
  resources?: CalendarResource[];
  onEventClick?: (event: CalendarEvent) => void;
  onSelectSlot?: (start: Date, end: Date) => void;
  onEventDrop?: (event: CalendarEvent, newStart: Date, newEnd: Date) => void;
  renderEvent?: (event: CalendarEvent) => ReactNode;
}
