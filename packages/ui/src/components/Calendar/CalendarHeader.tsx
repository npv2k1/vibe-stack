import React from 'react';
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarView } from './Calendar.types';
import { cn } from '../utils';
import { Button } from '../Button/Button';

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onDateChange: (date: Date) => void;
  className?: string;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  view,
  onViewChange,
  onDateChange,
  className,
}) => {
  const navigate = (direction: 'prev' | 'next' | 'today') => {
    if (direction === 'today') {
      onDateChange(new Date());
      return;
    }

    const modifier = direction === 'prev' ? -1 : 1;

    switch (view) {
      case 'month':
        onDateChange(addMonths(currentDate, modifier));
        break;
      case 'week':
        onDateChange(addWeeks(currentDate, modifier));
        break;
      case 'day':
        onDateChange(addDays(currentDate, modifier));
        break;
      case 'agenda':
      case 'resource':
        onDateChange(addMonths(currentDate, modifier));
        break;
    }
  };

  const getHeaderLabel = () => {
    switch (view) {
      case 'month':
        return format(currentDate, 'MMMM yyyy');
      case 'week':
        return `Week of ${format(currentDate, 'MMM d, yyyy')}`;
      case 'day':
        return format(currentDate, 'MMMM d, yyyy');
      case 'agenda':
        return `Agenda for ${format(currentDate, 'MMMM yyyy')}`;
      case 'resource':
        return `Resources - Week of ${format(currentDate, 'MMM d, yyyy')}`;
    }
  };

  const views: CalendarView[] = ['month', 'week', 'day', 'agenda', 'resource'];

  return (
    <div className={cn('flex items-center justify-between p-4 bg-white border-b', className)}>
      <div className="flex items-center space-x-2">
        <h2 className="text-xl font-semibold mr-4 min-w-[200px]">{getHeaderLabel()}</h2>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" onClick={() => navigate('prev')} title="Previous">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="sm" onClick={() => navigate('today')}>
            Today
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('next')} title="Next">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center bg-gray-100 p-1 rounded-md">
        {views.map((v) => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            className={cn(
              'px-3 py-1 text-sm rounded-md transition-all capitalize',
              view === v ? 'bg-white shadow-sm font-medium' : 'text-gray-600 hover:text-gray-900',
            )}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
};
