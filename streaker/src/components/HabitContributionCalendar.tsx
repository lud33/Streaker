import { useMemo } from 'react';
import { format, subDays, startOfWeek, addDays, getMonth } from 'date-fns';
import { cn } from '@/lib/utils';

interface HabitContributionCalendarProps {
  completedDates: string[];
  completionCounts: Record<string, number>;
  completionTimes?: Record<string, number[]>;
  color: string;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function HabitContributionCalendar({
  completedDates,
  completionCounts,
  completionTimes = {},
  color,
}: HabitContributionCalendarProps) {
  const completedSet = useMemo(() => new Set(completedDates), [completedDates]);

  // Generate 52 weeks of data (LeetCode-style)
  const { weeks, monthLabels } = useMemo(() => {
    const today = new Date();
    const totalDays = 365;
    const startDate = subDays(today, totalDays - 1);
    const adjustedStart = startOfWeek(startDate);
    
    const weeksArray: (Date | null)[][] = [];
    const monthPositions: { month: number; weekIndex: number }[] = [];
    let currentDate = adjustedStart;
    let lastMonth = -1;
    
    while (currentDate <= today || weeksArray.length < 53) {
      const week: (Date | null)[] = [];
      
      for (let day = 0; day < 7; day++) {
        const date = addDays(currentDate, day);
        if (date <= today && date >= startDate) {
          week.push(date);
          
          // Track month changes for labels
          const month = getMonth(date);
          if (month !== lastMonth && day === 0) {
            monthPositions.push({ month, weekIndex: weeksArray.length });
            lastMonth = month;
          }
        } else {
          week.push(null);
        }
      }
      
      weeksArray.push(week);
      currentDate = addDays(currentDate, 7);
      
      if (weeksArray.length >= 53) break;
    }
    
    return { weeks: weeksArray, monthLabels: monthPositions };
  }, []);

  // Get intensity based on time of day (morning = light, night = dark)
  const getTimeBasedIntensity = (date: Date | null): number => {
    if (!date) return 0;
    const dateStr = format(date, 'yyyy-MM-dd');
    const times = completionTimes[dateStr];
    
    if (!times || times.length === 0) {
      // Fallback to just checking if completed
      const count = completionCounts[dateStr] || 0;
      if (count === 0) return 0;
      return 2; // Default medium intensity if no time data
    }
    
    // Get the latest completion time for that day
    const latestHour = Math.max(...times);
    
    // Map hour to intensity: 
    // 5-9 AM (early morning) = 1 (lightest)
    // 9-12 PM (morning) = 2
    // 12-17 PM (afternoon) = 3
    // 17-24/0-5 (evening/night) = 4 (darkest)
    if (latestHour >= 5 && latestHour < 9) return 1;
    if (latestHour >= 9 && latestHour < 12) return 2;
    if (latestHour >= 12 && latestHour < 17) return 3;
    return 4; // Evening/night (5PM onwards or late night before 5AM)
  };

  const getOpacity = (intensity: number): number => {
    const opacities = [0, 0.3, 0.5, 0.75, 1];
    return opacities[intensity] || 0;
  };

  return (
    <div className="w-full overflow-x-auto">
      {/* Month labels */}
      <div className="flex mb-1 ml-0">
        <div className="flex relative" style={{ width: `${weeks.length * 12}px` }}>
          {monthLabels.map(({ month, weekIndex }, idx) => (
            <span
              key={idx}
              className="text-[10px] text-muted-foreground absolute"
              style={{ left: `${weekIndex * 12}px` }}
            >
              {MONTHS[month]}
            </span>
          ))}
        </div>
      </div>
      
      {/* Calendar grid */}
      <div className="flex gap-[2px] pt-3">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-[2px]">
            {week.map((day, dayIndex) => {
              const intensity = getTimeBasedIntensity(day);
              const isToday = day && format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
              const isEmpty = !day;
              const dateStr = day ? format(day, 'yyyy-MM-dd') : '';
              const times = day ? (completionTimes[dateStr] || []) : [];
              const latestTime = times.length > 0 ? Math.max(...times) : null;
              const timeLabel = latestTime !== null 
                ? `at ${latestTime.toString().padStart(2, '0')}:00` 
                : '';
              
              return (
                <div
                  key={dayIndex}
                  className={cn(
                    'w-[10px] h-[10px] rounded-[2px] transition-all duration-200',
                    isEmpty && 'opacity-0',
                    intensity === 0 && !isEmpty && 'bg-muted/40',
                    isToday && 'ring-1 ring-foreground/50 ring-offset-1 ring-offset-background'
                  )}
                  style={intensity > 0 ? { 
                    backgroundColor: color,
                    opacity: getOpacity(intensity),
                    boxShadow: intensity >= 3 ? `0 0 4px ${color}60` : undefined
                  } : undefined}
                  title={day ? `${format(day, 'MMM d, yyyy')}${intensity > 0 ? ` - completed ${timeLabel}` : ''}` : ''}
                />
              );
            })}
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground">
        <span>Morning</span>
        <div className="w-[10px] h-[10px] rounded-[2px] bg-muted/40" />
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className="w-[10px] h-[10px] rounded-[2px]"
            style={{ 
              backgroundColor: color,
              opacity: getOpacity(level)
            }}
          />
        ))}
        <span>Night</span>
      </div>
    </div>
  );
}
