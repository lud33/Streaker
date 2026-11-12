import { useState, useEffect, useCallback } from 'react';
import { Habit, HabitStats } from '@/types/habit';
import { format, parseISO, differenceInDays, isToday, isYesterday, startOfDay } from 'date-fns';
import { toast } from 'sonner';
import { useAuthContext } from '@/contexts/AuthContext';
import { apiRequest, getApiErrorMessage } from '@/lib/api';

interface HabitListResponse {
  data: Habit[];
}

interface HabitResponse {
  data: Habit;
}

export function useHabits() {
  const { user, isLoading: isAuthLoading } = useAuthContext();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    if (isAuthLoading) return;
    if (!user) {
      setHabits([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    apiRequest<HabitListResponse>('/habits')
      .then(({ data }) => {
        if (active) {
          setHabits(data.map((habit) => ({
            ...habit,
            completionCounts: habit.completionCounts || {},
            completionTimes: habit.completionTimes || {},
          })));
        }
      })
      .catch((error: unknown) => {
        if (active) toast.error(getApiErrorMessage(error));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isAuthLoading, user]);

  const addHabit = useCallback(async (habit: Omit<Habit, 'id' | 'createdAt' | 'completedDates' | 'completionCounts' | 'completionTimes'>) => {
    const { data } = await apiRequest<HabitResponse>('/habits', {
      method: 'POST',
      body: habit,
    });
    setHabits((current) => [...current, data]);
    return data;
  }, []);

  const updateHabit = useCallback(async (id: string, updates: Partial<Habit>) => {
    const { id: _id, createdAt: _createdAt, ...attributes } = updates;
    const { data } = await apiRequest<HabitResponse>(`/habits/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: attributes,
    });
    setHabits((current) => current.map((habit) => habit.id === id ? data : habit));
  }, []);

  const deleteHabit = useCallback(async (id: string) => {
    await apiRequest<void>(`/habits/${encodeURIComponent(id)}`, { method: 'DELETE' });
    setHabits((current) => current.filter((habit) => habit.id !== id));
  }, []);

  const incrementHabitCompletion = useCallback(async (id: string, date: string = format(new Date(), 'yyyy-MM-dd')) => {
    const { data } = await apiRequest<HabitResponse>(`/habits/${encodeURIComponent(id)}/completions`, {
      method: 'POST',
      body: { date, hour: new Date().getHours() },
    });
    setHabits((current) => current.map((habit) => habit.id === id ? data : habit));
  }, []);

  const toggleHabitCompletion = useCallback((id: string, date: string = format(new Date(), 'yyyy-MM-dd')) => {
    return incrementHabitCompletion(id, date);
  }, [incrementHabitCompletion]);

  const getHabitStats = useCallback((habit: Habit): HabitStats => {
    const sortedDates = [...habit.completedDates]
      .map(d => parseISO(d))
      .sort((a, b) => b.getTime() - a.getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    if (sortedDates.length > 0) {
      const mostRecent = startOfDay(sortedDates[0]);
      
      // Check if streak is active (completed today or yesterday)
      if (isToday(mostRecent) || isYesterday(mostRecent)) {
        currentStreak = 1;
        
        for (let i = 1; i < sortedDates.length; i++) {
          const diff = differenceInDays(sortedDates[i - 1], sortedDates[i]);
          if (diff === 1) {
            currentStreak++;
          } else {
            break;
          }
        }
      }

      // Calculate longest streak
      tempStreak = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        const diff = differenceInDays(sortedDates[i - 1], sortedDates[i]);
        if (diff === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak, currentStreak);
    }

    const createdDate = parseISO(habit.createdAt);
    const daysSinceCreation = Math.max(1, differenceInDays(new Date(), createdDate) + 1);
    const completionRate = Math.round((habit.completedDates.length / daysSinceCreation) * 100);

    return {
      currentStreak,
      longestStreak,
      totalCompleted: habit.completedDates.length,
      completionRate: Math.min(100, completionRate),
    };
  }, []);

  const isHabitCompletedToday = useCallback((habit: Habit): boolean => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return habit.completedDates.includes(today);
  }, []);

  const getTodayCompletionCount = useCallback((habit: Habit): number => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return habit.completionCounts[today] || 0;
  }, []);

  return {
    habits,
    isLoading,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    incrementHabitCompletion,
    getHabitStats,
    isHabitCompletedToday,
    getTodayCompletionCount,
  };
}
