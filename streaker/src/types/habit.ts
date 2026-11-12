export interface Habit {
  id: string;
  name: string;
  color: string;
  category: string;
  createdAt: string;
  completedDates: string[];
  // Track completion count per day for intensity
  completionCounts: Record<string, number>;
  // Track completion time for time-based intensity (hour of day 0-23)
  completionTimes: Record<string, number[]>;
}

export interface HabitStats {
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
  completionRate: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export type HabitCategory = 
  | 'health'
  | 'fitness'
  | 'productivity'
  | 'learning'
  | 'mindfulness'
  | 'social'
  | 'creativity'
  | 'other';

export const HABIT_COLORS = [
  '#6366f1', // Indigo
  '#10b981', // Emerald
  '#ff6b35', // Orange
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#84cc16', // Lime
] as const;

export const HABIT_CATEGORIES: { value: HabitCategory; label: string; icon: string }[] = [
  { value: 'health', label: 'Health', icon: '❤️' },
  { value: 'fitness', label: 'Fitness', icon: '💪' },
  { value: 'productivity', label: 'Productivity', icon: '⚡' },
  { value: 'learning', label: 'Learning', icon: '📚' },
  { value: 'mindfulness', label: 'Mindfulness', icon: '🧘' },
  { value: 'social', label: 'Social', icon: '👥' },
  { value: 'creativity', label: 'Creativity', icon: '🎨' },
  { value: 'other', label: 'Other', icon: '✨' },
];

export interface Goal {
  id: string;
  habitId?: string;
  title: string;
  description: string;
  targetDays: number;
  currentDays: number;
  type: 'streak' | 'total' | 'weekly';
  createdAt: string;
  completedAt?: string;
}
