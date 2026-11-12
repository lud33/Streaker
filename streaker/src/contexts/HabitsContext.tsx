import React, { createContext, useContext, ReactNode } from 'react';
import { useHabits } from '@/hooks/useHabits';
import { Habit, HabitStats } from '@/types/habit';

interface HabitsContextType {
  habits: Habit[];
  isLoading: boolean;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'completedDates' | 'completionCounts' | 'completionTimes'>) => Promise<Habit>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleHabitCompletion: (id: string, date?: string) => Promise<void>;
  incrementHabitCompletion: (id: string, date?: string) => Promise<void>;
  getHabitStats: (habit: Habit) => HabitStats;
  isHabitCompletedToday: (habit: Habit) => boolean;
  getTodayCompletionCount: (habit: Habit) => number;
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

export function HabitsProvider({ children }: { children: ReactNode }) {
  const habitsData = useHabits();
  
  return (
    <HabitsContext.Provider value={habitsData}>
      {children}
    </HabitsContext.Provider>
  );
}

export function useHabitsContext() {
  const context = useContext(HabitsContext);
  if (context === undefined) {
    throw new Error('useHabitsContext must be used within a HabitsProvider');
  }
  return context;
}
