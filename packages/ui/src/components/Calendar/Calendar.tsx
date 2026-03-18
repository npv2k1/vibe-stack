import React, { useState, useCallback } from 'react';
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
  useDndMonitor,
} from '@dnd-kit/core';
import { CalendarEvent, CalendarProps, CalendarView } from './Calendar.types';
import { CalendarHeader } from './CalendarHeader';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { DayView } from './DayView';
import { AgendaView } from './AgendaView';
import { ResourceView } from './ResourceView';
import { cn } from '../utils';

export const Calendar: React.FC<CalendarProps> = ({
  events = [],
  resources = [],
  defaultView = 'month',
  defaultDate = new Date(),
  onEventClick,
  onSelectSlot,
  onEventDrop,
  renderEvent,
  className,
  useInternalDndContext = true,
}) => {
  const [view, setView] = useState<CalendarView>(defaultView);
  const [currentDate, setCurrentDate] = useState<Date>(defaultDate);
  const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null);

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

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const dragEvent = events.find((e) => e.id === active.id) || (active.data.current as CalendarEvent);
      if (dragEvent) {
        setActiveEvent(dragEvent);
      }
    },
    [events],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveEvent(null);

      if (!over) return;

      const dragEvent = events.find((e) => e.id === active.id) || (active.data.current as CalendarEvent);
      if (!dragEvent) return;

      // Handle the drop. The `over.id` should contain information about the target slot.
      // We expect it to be a string like "day:2026-03-02" or "slot:2026-03-02T10:00:00" or "resource:res1:day:2026-03-02"
      const overId = over.id as string;

      let newStart: Date | undefined;
      let newEnd: Date | undefined;

      const duration =
        dragEvent.start && dragEvent.end ? dragEvent.end.getTime() - dragEvent.start.getTime() : 60 * 60 * 1000; // Default 1 hour if not specified

      if (overId.startsWith('day:')) {
        const dateStr = overId.replace('day:', '');
        newStart = new Date(dateStr);

        if (dragEvent.start) {
          newStart.setHours(dragEvent.start.getHours());
          newStart.setMinutes(dragEvent.start.getMinutes());
        } else {
          newStart.setHours(9, 0, 0, 0); // Default to 9 AM
        }
        newEnd = new Date(newStart.getTime() + duration);
      } else if (overId.startsWith('slot:')) {
        const dateStr = overId.replace('slot:', '');
        newStart = new Date(dateStr);
        newEnd = new Date(newStart.getTime() + duration);
      } else if (overId.startsWith('resource:')) {
        const parts = overId.split(':'); // resource:resId:day:dateStr
        const resourceId = parts[1];
        const dateStr = parts[3];
        newStart = new Date(dateStr);

        if (dragEvent.start) {
          newStart.setHours(dragEvent.start.getHours());
          newStart.setMinutes(dragEvent.start.getMinutes());
        } else {
          newStart.setHours(9, 0, 0, 0);
        }
        newEnd = new Date(newStart.getTime() + duration);

        const updatedEvent = { ...dragEvent, resourceId, start: newStart, end: newEnd } as CalendarEvent;
        onEventDrop?.(updatedEvent, newStart, newEnd);
        return;
      }

      if (newStart && newEnd) {
        onEventDrop?.({ ...dragEvent, start: newStart, end: newEnd } as CalendarEvent, newStart, newEnd);
      }
    },
    [events, onEventDrop],
  );

  const handleDragCancel = useCallback(() => {
    setActiveEvent(null);
  }, []);

  const renderView = () => {
    const viewProps = {
      date: currentDate,
      events,
      resources,
      onEventClick,
      onSelectSlot,
      onEventDrop,
      renderEvent,
    };

    switch (view) {
      case 'month':
        return <MonthView {...viewProps} />;
      case 'week':
        return <WeekView {...viewProps} />;
      case 'day':
        return <DayView {...viewProps} />;
      case 'agenda':
        return <AgendaView {...viewProps} />;
      case 'resource':
        return <ResourceView {...viewProps} />;
      default:
        return <MonthView {...viewProps} />;
    }
  };

  const calendarContent = (
    <>
      {renderView()}
      <DragOverlay>
        {activeEvent ? (
          <div className="rotate-3 cursor-grabbing opacity-80 shadow-2xl px-2 py-1 text-xs rounded border truncate bg-blue-50 text-blue-700 border-blue-200">
            <div className="font-semibold">{activeEvent.title}</div>
          </div>
        ) : null}
      </DragOverlay>
    </>
  );

  return (
    <div className={cn('flex flex-col h-full bg-white border rounded-xl overflow-hidden shadow-sm', className)}>
      <CalendarHeader currentDate={currentDate} view={view} onViewChange={setView} onDateChange={setCurrentDate} />
      <div className="flex-1 overflow-hidden min-h-0">
        {useInternalDndContext ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            {calendarContent}
          </DndContext>
        ) : (
          <CalendarDndMonitor onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
            {calendarContent}
          </CalendarDndMonitor>
        )}
      </div>
    </div>
  );
};

const CalendarDndMonitor: React.FC<{
  onDragStart: (event: DragStartEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
  onDragCancel: () => void;
  children: React.ReactNode;
}> = ({ onDragStart, onDragEnd, onDragCancel, children }) => {
  useDndMonitor({
    onDragStart,
    onDragEnd,
    onDragCancel,
  });
  return <>{children}</>;
};
