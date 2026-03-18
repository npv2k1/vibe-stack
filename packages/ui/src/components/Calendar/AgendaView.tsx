import React from 'react';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { ViewProps, CalendarEvent } from './Calendar.types';
import { cn } from '../utils';

export const AgendaView: React.FC<ViewProps> = ({ date, events, onEventClick, renderEvent }) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);

  const monthEvents = events
    .filter(
      (event) =>
        isWithinInterval(event.start, { start: monthStart, end: monthEnd }) ||
        isWithinInterval(event.end, { start: monthStart, end: monthEnd }),
    )
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  // Group events by day
  const groupedEvents = monthEvents.reduce(
    (acc, event) => {
      const dayKey = format(event.start, 'yyyy-MM-dd');
      if (!acc[dayKey]) acc[dayKey] = [];
      acc[dayKey].push(event);
      return acc;
    },
    {} as Record<string, CalendarEvent[]>,
  );

  const sortedDays = Object.keys(groupedEvents).sort();

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto p-6">
      {sortedDays.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 py-20">
          <p className="text-lg font-medium">No events scheduled for this month</p>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto w-full space-y-10">
          {sortedDays.map((dayKey) => {
            const dayEvents = groupedEvents[dayKey];
            const dayDate = new Date(dayKey + 'T00:00:00'); // Ensure local time

            return (
              <div key={dayKey} className="flex gap-8">
                <div className="w-16 shrink-0 text-center pt-1">
                  <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">
                    {format(dayDate, 'EEE')}
                  </div>
                  <div className="text-3xl font-black text-gray-900 tabular-nums">{format(dayDate, 'd')}</div>
                </div>
                <div className="flex-1 space-y-4">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => onEventClick?.(event)}
                      className="group flex items-start p-4 rounded-xl border border-gray-100 bg-white hover:border-primary/20 hover:shadow-md hover:shadow-primary/5 transition-all cursor-pointer"
                    >
                      <div className="w-20 shrink-0 pt-0.5">
                        <span className="text-sm font-bold text-gray-400 group-hover:text-primary/70 transition-colors">
                          {format(event.start, 'HH:mm')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors truncate">
                          {event.title}
                        </h4>
                        {event.description && (
                          <p className="mt-1 text-sm text-gray-500 line-clamp-2 leading-relaxed">{event.description}</p>
                        )}
                      </div>
                      {renderEvent && <div className="ml-4 shrink-0">{renderEvent(event)}</div>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
