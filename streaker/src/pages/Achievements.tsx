import { useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useHabitsContext } from '@/contexts/HabitsContext';
import { FlameIcon } from '@/components/icons/FlameIcon';
import { cn } from '@/lib/utils';
import {
  Trophy,
  Star,
  Zap,
  Calendar,
  Target,
  Award,
  Flame,
  Crown,
  Medal,
  Gem,
  Lock,
} from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  requirement: number;
  type: 'streak' | 'completion' | 'habits' | 'special';
  color: string;
}

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_habit', name: 'Getting Started', description: 'Create your first habit', icon: Star, requirement: 1, type: 'habits', color: '#f59e0b' },
  { id: 'five_habits', name: 'Habit Builder', description: 'Create 5 habits', icon: Target, requirement: 5, type: 'habits', color: '#10b981' },
  { id: 'ten_habits', name: 'Habit Master', description: 'Create 10 habits', icon: Crown, requirement: 10, type: 'habits', color: '#6366f1' },
  { id: 'streak_3', name: 'On Fire', description: 'Maintain a 3-day streak', icon: Flame, requirement: 3, type: 'streak', color: '#ff6b35' },
  { id: 'streak_7', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: Zap, requirement: 7, type: 'streak', color: '#ec4899' },
  { id: 'streak_14', name: 'Fortnight Champion', description: 'Maintain a 14-day streak', icon: Trophy, requirement: 14, type: 'streak', color: '#f59e0b' },
  { id: 'streak_30', name: 'Monthly Legend', description: 'Maintain a 30-day streak', icon: Medal, requirement: 30, type: 'streak', color: '#10b981' },
  { id: 'streak_100', name: 'Unstoppable', description: 'Maintain a 100-day streak', icon: Gem, requirement: 100, type: 'streak', color: '#8b5cf6' },
  { id: 'complete_10', name: 'Consistent', description: 'Complete habits 10 times', icon: Calendar, requirement: 10, type: 'completion', color: '#06b6d4' },
  { id: 'complete_50', name: 'Dedicated', description: 'Complete habits 50 times', icon: Award, requirement: 50, type: 'completion', color: '#6366f1' },
  { id: 'complete_100', name: 'Centurion', description: 'Complete habits 100 times', icon: Crown, requirement: 100, type: 'completion', color: '#ff6b35' },
  { id: 'complete_500', name: 'Legendary', description: 'Complete habits 500 times', icon: Gem, requirement: 500, type: 'completion', color: '#f59e0b' },
];

export default function Achievements() {
  const { habits, getHabitStats } = useHabitsContext();

  const progress = useMemo(() => {
    const totalHabits = habits.length;
    const longestStreak = habits.reduce((max, h) => Math.max(max, getHabitStats(h).longestStreak), 0);
    const totalCompletions = habits.reduce((sum, h) => sum + h.completedDates.length, 0);

    return { totalHabits, longestStreak, totalCompletions };
  }, [habits, getHabitStats]);

  const isUnlocked = (achievement: Achievement): boolean => {
    switch (achievement.type) {
      case 'habits':
        return progress.totalHabits >= achievement.requirement;
      case 'streak':
        return progress.longestStreak >= achievement.requirement;
      case 'completion':
        return progress.totalCompletions >= achievement.requirement;
      default:
        return false;
    }
  };

  const getProgress = (achievement: Achievement): number => {
    let current = 0;
    switch (achievement.type) {
      case 'habits':
        current = progress.totalHabits;
        break;
      case 'streak':
        current = progress.longestStreak;
        break;
      case 'completion':
        current = progress.totalCompletions;
        break;
    }
    return Math.min(100, (current / achievement.requirement) * 100);
  };

  const unlockedCount = ACHIEVEMENTS.filter(isUnlocked).length;

  return (
    <DashboardLayout title="Achievements">
      <div className="space-y-8 animate-fade-in">
        {/* Header stats */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {unlockedCount} / {ACHIEVEMENTS.length} Unlocked
              </h2>
              <p className="text-muted-foreground">
                Keep building habits to unlock more achievements!
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-warning/10 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-warning" />
            </div>
          </div>
          <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${(unlockedCount / ACHIEVEMENTS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Achievement grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACHIEVEMENTS.map((achievement) => {
            const unlocked = isUnlocked(achievement);
            const progressValue = getProgress(achievement);
            const Icon = achievement.icon;

            return (
              <div
                key={achievement.id}
                className={cn(
                  'glass-card p-6 transition-all duration-300',
                  unlocked ? 'hover-lift' : 'opacity-60 grayscale'
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      'w-14 h-14 rounded-2xl flex items-center justify-center shrink-0',
                      unlocked ? 'shadow-lg' : 'bg-muted'
                    )}
                    style={unlocked ? {
                      backgroundColor: achievement.color,
                      boxShadow: `0 0 30px ${achievement.color}40`,
                    } : undefined}
                  >
                    {unlocked ? (
                      <Icon className="w-7 h-7 text-primary-foreground" />
                    ) : (
                      <Lock className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{achievement.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {achievement.description}
                    </p>
                    {!unlocked && (
                      <div className="space-y-1">
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${progressValue}%`,
                              backgroundColor: achievement.color,
                            }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {Math.round(progressValue)}% complete
                        </p>
                      </div>
                    )}
                    {unlocked && (
                      <div className="flex items-center gap-1 text-sm text-secondary">
                        <FlameIcon size={14} animated={false} />
                        Unlocked!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
