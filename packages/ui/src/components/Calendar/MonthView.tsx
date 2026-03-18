import React from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  format,
  isToday,
} from 'date-fns';
import { ViewProps, CalendarEvent } from './Calendar.types';
import { cn } from '../utils';

interface MonthDayProps {
  day: Date;
  isCurrentMonth: boolean;
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onSelectSlot?: (start: Date, end: Date) => void;
  renderEvent?: (event: CalendarEvent) => React.ReactNode;
}

const MonthDay: React.FC<MonthDayProps> = ({
  day,
  isCurrentMonth,
  events,
  onEventClick,
  onSelectSlot,
  renderEvent,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `day:${format(day, 'yyyy-MM-dd')}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'min-h-[120px] p-2 border-r border-b relative group hover:bg-gray-50/50 transition-colors',
        !isCurrentMonth && 'bg-gray-50/30 text-gray-400',
        isOver && 'bg-primary/5 ring-2 ring-primary/20 ring-inset',
      )}
      onClick={() => onSelectSlot?.(day, day)}
    >
      <div className="flex justify-between items-start mb-1">
        <div
          className={cn(
            'flex items-center justify-center w-7 h-7 text-sm font-medium rounded-full',
            isToday(day) ? 'bg-primary text-white' : 'text-gray-700',
          )}
        >
          {format(day, 'd')}
        </div>
      </div>
      <div className="space-y-1 overflow-y-auto max-h-[85px] scrollbar-none">
        {events.map((event) => (
          <MonthEvent key={event.id} event={event} onClick={onEventClick} renderEvent={renderEvent} />
        ))}
      </div>
    </div>
  );
};

interface MonthEventProps {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent) => void;
  renderEvent?: (event: CalendarEvent) => React.ReactNode;
}

const MonthEvent: React.FC<MonthEventProps> = ({ event, onClick, renderEvent }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: event.id,
    data: event,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(event);
      }}
      className={cn(
        'px-2 py-0.5 text-xs rounded border truncate cursor-pointer transition-opacity hover:opacity-80',
        event.color || 'bg-blue-50 text-blue-700 border-blue-200',
        isDragging && 'opacity-0',
      )}
      title={`${format(event.start, 'HH:mm')} - ${event.title}`}
    >
      {renderEvent ? (
        renderEvent(event)
      ) : (
        <div className="flex items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 shrink-0" />
          {event.title}
        </div>
      )}
    </div>
  );
};

export const MonthView: React.FC<ViewProps> = ({ date, events, onEventClick, onSelectSlot, renderEvent }) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(event.start, day));
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="grid grid-cols-7 border-b bg-gray-50/50">
        {weekDays.map((day) => (
          <div key={day} className="py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 flex-1 border-l">
        {days.map((day) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, monthStart);

          return (
            <MonthDay
              key={day.toISOString()}
              day={day}
              isCurrentMonth={isCurrentMonth}
              events={dayEvents}
              onEventClick={onEventClick}
              onSelectSlot={onSelectSlot}
              renderEvent={renderEvent}
            />
          );
        })}
      </div>
    </div>
  );
};
