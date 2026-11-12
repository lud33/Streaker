import { useMemo } from 'react';
import { format, subDays, startOfWeek, addDays } from 'date-fns';
import { cn } from '@/lib/utils';

interface ContributionCalendarProps {
  completedDates: string[];
  color?: string;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function ContributionCalendar({
  completedDates,
  color = 'hsl(var(--primary))',
}: ContributionCalendarProps) {
  const completedSet = useMemo(() => new Set(completedDates), [completedDates]);

  // Generate 52 weeks of data (like GitHub/LeetCode)
  const { weeks, monthLabels } = useMemo(() => {
    const today = new Date();
    const totalDays = 365;
    const startDate = subDays(today, totalDays - 1);
    const adjustedStart = startOfWeek(startDate);
    
    const weeksArray: (Date | null)[][] = [];
    const labels: { month: string; weekIndex: number }[] = [];
    
    let currentDate = adjustedStart;
    let weekIndex = 0;
    let lastMonth = -1;
    
    while (currentDate <= today || weeksArray.length < 53) {
      const week: (Date | null)[] = [];
      
      for (let day = 0; day < 7; day++) {
        const date = addDays(currentDate, day);
        if (date <= today && date >= startDate) {
          week.push(date);
          
          // Track month labels
          const month = date.getMonth();
          if (month !== lastMonth && date.getDate() <= 7) {
            labels.push({ month: MONTHS[month], weekIndex });
            lastMonth = month;
          }
        } else if (date > today) {
          week.push(null);
        } else {
          week.push(null);
        }
      }
      
      weeksArray.push(week);
      currentDate = addDays(currentDate, 7);
      weekIndex++;
      
      if (weeksArray.length >= 53) break;
    }
    
    return { weeks: weeksArray, monthLabels: labels };
  }, []);

  const getCompletionLevel = (date: Date | null): number => {
    if (!date) return -1;
    const dateStr = format(date, 'yyyy-MM-dd');
    return completedSet.has(dateStr) ? 4 : 0;
  };

  const totalCompleted = completedDates.length;

  return (
    <div className="glass-card p-6 space-y-4 overflow-x-auto">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {totalCompleted} contributions in the last year
        </h3>
      </div>

      <div className="min-w-fit">
        {/* Month labels */}
        <div className="flex mb-2 ml-8">
          {monthLabels.map((label, index) => (
            <div
              key={index}
              className="text-xs text-muted-foreground"
              style={{
                marginLeft: index === 0 ? `${label.weekIndex * 14}px` : undefined,
                width: index < monthLabels.length - 1 
                  ? `${(monthLabels[index + 1].weekIndex - label.weekIndex) * 14}px` 
                  : 'auto',
              }}
            >
              {label.month}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="flex gap-[2px]">
          {/* Weekday labels */}
          <div className="flex flex-col gap-[2px] mr-2">
            {WEEKDAYS.map((day, index) => (
              <div
                key={day}
                className={cn(
                  "text-xs text-muted-foreground h-[12px] w-6 flex items-center",
                  index % 2 === 0 ? "opacity-100" : "opacity-0"
                )}
              >
                {day.charAt(0)}
              </div>
            ))}
          </div>

          {/* Weeks */}
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[2px]">
              {week.map((day, dayIndex) => {
                const level = getCompletionLevel(day);
                const isToday = day && format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                
                return (
                  <div
                    key={dayIndex}
                    className={cn(
                      'w-[12px] h-[12px] rounded-sm transition-all duration-200',
                      level === -1 && 'opacity-0',
                      level === 0 && 'bg-muted/40',
                      level === 4 && 'shadow-sm',
                      isToday && 'ring-1 ring-primary ring-offset-1 ring-offset-background',
                      day && 'hover:ring-1 hover:ring-primary/50 cursor-pointer'
                    )}
                    style={level === 4 ? { backgroundColor: color } : undefined}
                    title={day ? `${format(day, 'MMM d, yyyy')}${level === 4 ? ' - Completed' : ''}` : ''}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-[2px]">
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={cn(
                'w-[12px] h-[12px] rounded-sm',
                level === 0 && 'bg-muted/40',
              )}
              style={level > 0 ? { backgroundColor: color, opacity: 0.25 + level * 0.2 } : undefined}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}