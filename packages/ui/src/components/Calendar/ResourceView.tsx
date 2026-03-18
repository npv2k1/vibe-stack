import React from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isToday,
  isSameDay,
  isWithinInterval,
  startOfDay,
  endOfDay,
} from 'date-fns';
import { ViewProps, CalendarEvent, CalendarResource } from './Calendar.types';
import { cn } from '../utils';

interface ResourceCellProps {
  resourceId: string;
  day: Date;
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onSelectSlot?: (start: Date, end: Date) => void;
  renderEvent?: (event: CalendarEvent) => React.ReactNode;
}

const ResourceCell: React.FC<ResourceCellProps> = ({
  resourceId,
  day,
  events,
  onEventClick,
  onSelectSlot,
  renderEvent,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `resource:${resourceId}:day:${format(day, 'yyyy-MM-dd')}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'relative border-r last:border-r-0 h-full p-1 hover:bg-gray-50/50 cursor-pointer',
        isOver && 'bg-primary/5 ring-2 ring-primary/20 ring-inset',
      )}
      onClick={() => onSelectSlot?.(startOfDay(day), endOfDay(day))}
    >
      <div className="flex flex-col gap-1 overflow-y-auto h-full">
        {events.map((event) => (
          <ResourceEvent
            key={`${event.id}-${day.toString()}`}
            event={event}
            onClick={onEventClick}
            renderEvent={renderEvent}
          />
        ))}
      </div>
    </div>
  );
};

interface ResourceEventProps {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent) => void;
  renderEvent?: (event: CalendarEvent) => React.ReactNode;
}

const ResourceEvent: React.FC<ResourceEventProps> = ({ event, onClick, renderEvent }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: event.id,
    data: event,
  });

  const getEventStyle = (event: CalendarEvent) => {
    return {
      backgroundColor: event.color || 'rgba(59, 130, 246, 0.1)',
      color: event.color ? 'white' : 'rgb(29, 78, 216)',
      borderColor: event.color || 'rgb(191, 219, 254)',
    };
  };

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
        'px-2 py-1 text-[10px] rounded border truncate cursor-pointer transition-opacity hover:opacity-80 z-[1] shadow-sm font-medium',
        isDragging && 'opacity-0',
      )}
      style={getEventStyle(event)}
      title={event.title}
    >
      {renderEvent ? renderEvent(event) : event.title}
    </div>
  );
};

export const ResourceView: React.FC<ViewProps> = ({
  date,
  events,
  resources = [],
  onEventClick,
  onSelectSlot,
  renderEvent,
}) => {
  const weekStart = startOfWeek(date);
  const weekEnd = endOfWeek(date);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getEventsForResourceAndDay = (resourceId: string, day: Date) => {
    return events.filter(
      (event) =>
        event.resourceId === resourceId &&
        (isSameDay(event.start, day) ||
          isSameDay(event.end, day) ||
          isWithinInterval(day, { start: startOfDay(event.start), end: endOfDay(event.end) })),
    );
  };

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[200px_1fr] border-b bg-gray-50/50 sticky top-0 z-10">
        <div className="border-r py-4 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Resources
        </div>
        <div className="grid grid-cols-7 border-l">
          {days.map((day) => (
            <div key={day.toString()} className="py-2 text-center border-r last:border-r-0">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                {format(day, 'EEE')}
              </div>
              <div
                className={cn(
                  'inline-flex items-center justify-center w-8 h-8 text-sm font-medium rounded-full',
                  isToday(day) ? 'bg-primary text-white' : 'text-gray-700',
                )}
              >
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {resources.map((resource) => (
          <div key={resource.id} className="grid grid-cols-[200px_1fr] border-b last:border-b-0 group">
            <div className="border-r bg-gray-50/30 py-4 px-4 flex items-center">
              <span className="text-sm font-medium text-gray-900">{resource.title}</span>
            </div>
            <div className="grid grid-cols-7 border-l relative h-24">
              {days.map((day) => (
                <ResourceCell
                  key={day.toString()}
                  resourceId={resource.id}
                  day={day}
                  events={getEventsForResourceAndDay(resource.id, day)}
                  onEventClick={onEventClick}
                  onSelectSlot={onSelectSlot}
                  renderEvent={renderEvent}
                />
              ))}
            </div>
          </div>
        ))}
        {resources.length === 0 && <div className="p-8 text-center text-gray-500 italic">No resources defined</div>}
      </div>
    </div>
  );
};
