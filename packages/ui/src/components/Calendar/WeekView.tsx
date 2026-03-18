import React from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isToday,
  startOfDay,
  isSameDay,
  setHours,
  differenceInMinutes,
} from 'date-fns';
import { ViewProps, CalendarEvent } from './Calendar.types';
import { cn } from '../utils';

interface WeekSlotProps {
  day: Date;
  hour: number;
  onSelectSlot?: (start: Date, end: Date) => void;
}

const WeekSlot: React.FC<WeekSlotProps> = ({ day, hour, onSelectSlot }) => {
  const slotStart = setHours(startOfDay(day), hour);
  const { setNodeRef, isOver } = useDroppable({
    id: `slot:${format(slotStart, "yyyy-MM-dd'T'HH:mm:ss")}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'h-20 border-b last:border-b-0 cursor-pointer hover:bg-primary/5',
        isOver && 'bg-primary/5 ring-2 ring-primary/20 ring-inset',
      )}
      onClick={() => {
        const slotEnd = setHours(startOfDay(day), hour + 1);
        onSelectSlot?.(slotStart, slotEnd);
      }}
    />
  );
};

interface WeekEventProps {
  event: CalendarEvent;
  day: Date;
  onClick?: (event: CalendarEvent) => void;
  renderEvent?: (event: CalendarEvent) => React.ReactNode;
}

const WeekEvent: React.FC<WeekEventProps> = ({ event, day, onClick, renderEvent }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: event.id,
    data: event,
  });

  const getEventStyle = (event: CalendarEvent, day: Date) => {
    const start = event.start;
    const end = event.end;
    const dayStart = startOfDay(day);

    const startMinutes = differenceInMinutes(start, dayStart);
    const durationMinutes = Math.max(differenceInMinutes(end, start), 30); // Min height 30 mins

    const top = (startMinutes / (24 * 60)) * 100;
    const height = (durationMinutes / (24 * 60)) * 100;

    return {
      top: `${top}%`,
      height: `${height}%`,
      left: '4px',
      right: '4px',
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
        'absolute px-2 py-1 text-xs rounded border truncate cursor-pointer transition-opacity hover:opacity-80 z-[1] shadow-sm',
        event.color || 'bg-blue-50 text-blue-700 border-blue-200',
        isDragging && 'opacity-0',
      )}
      style={getEventStyle(event, day)}
      title={`${format(event.start, 'HH:mm')} - ${event.title}`}
    >
      {renderEvent ? (
        renderEvent(event)
      ) : (
        <div className="flex flex-col h-full overflow-hidden">
          <div className="font-semibold">{event.title}</div>
          <div className="opacity-70 text-[10px]">
            {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
          </div>
        </div>
      )}
    </div>
  );
};

export const WeekView: React.FC<ViewProps> = ({ date, events, onEventClick, onSelectSlot, renderEvent }) => {
  const weekStart = startOfWeek(date);
  const weekEnd = endOfWeek(date);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(event.start, day));
  };

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
      <div className="grid grid-cols-[80px_1fr] border-b bg-gray-50/50 sticky top-0 z-10">
        <div className="border-r py-4 px-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Time
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

      <div className="grid grid-cols-[80px_1fr] flex-1 overflow-y-auto min-h-0">
        <div className="border-r bg-gray-50/30">
          {hours.map((hour) => (
            <div key={hour} className="h-20 border-b last:border-b-0 pr-2 text-right">
              <span className="text-xs text-gray-400 relative -top-3">
                {format(setHours(startOfDay(new Date()), hour), 'ha')}
              </span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 border-l relative h-[1920px]">
          {days.map((day) => (
            <div key={day.toString()} className="relative border-r last:border-r-0 h-full group hover:bg-gray-50/50">
              {hours.map((hour) => (
                <WeekSlot key={hour} day={day} hour={hour} onSelectSlot={onSelectSlot} />
              ))}
              {getEventsForDay(day).map((event) => (
                <WeekEvent key={event.id} event={event} day={day} onClick={onEventClick} renderEvent={renderEvent} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
