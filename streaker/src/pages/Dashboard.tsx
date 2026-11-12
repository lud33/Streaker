import { useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useHabitsContext } from '@/contexts/HabitsContext';
import { HabitCard } from '@/components/HabitCard';
import { StatsCard } from '@/components/StatsCard';
import { FlameIcon } from '@/components/icons/FlameIcon';
import { ListTodo, Target, TrendingUp, Plus } from 'lucide-react';
import { HabitForm } from '@/components/HabitForm';
import { format } from 'date-fns';

export default function Dashboard() {
  const { habits, getHabitStats, isHabitCompletedToday } = useHabitsContext();
  
  const stats = useMemo(() => {
    const totalHabits = habits.length;
    const completedToday = habits.filter(isHabitCompletedToday).length;
    const totalStreak = habits.reduce((acc, h) => acc + getHabitStats(h).currentStreak, 0);
    const avgCompletion = habits.length > 0
      ? Math.round(habits.reduce((acc, h) => acc + getHabitStats(h).completionRate, 0) / habits.length)
      : 0;

    return { totalHabits, completedToday, totalStreak, avgCompletion };
  }, [habits, getHabitStats, isHabitCompletedToday]);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Habits"
            value={stats.totalHabits}
            subtitle="Active habits"
            icon={<ListTodo className="w-6 h-6" />}
          />
          <StatsCard
            title="Completed Today"
            value={`${stats.completedToday}/${stats.totalHabits}`}
            subtitle={`${stats.totalHabits > 0 ? Math.round((stats.completedToday / stats.totalHabits) * 100) : 0}% done`}
            icon={<Target className="w-6 h-6" />}
          />
          <StatsCard
            title="Total Streak"
            value={stats.totalStreak}
            subtitle="Combined days"
            icon={<FlameIcon size={24} animated={stats.totalStreak > 0} />}
          />
          <StatsCard
            title="Avg. Completion"
            value={`${stats.avgCompletion}%`}
            subtitle="Completion rate"
            icon={<TrendingUp className="w-6 h-6" />}
            trend={stats.avgCompletion > 50 ? { value: 12, positive: true } : undefined}
          />
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Today's Habits</h2>
              <p className="text-sm text-muted-foreground">
                {format(new Date(), 'EEEE, MMMM d')}
              </p>
            </div>
          </div>

          {habits.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No habits yet</h3>
              <p className="text-muted-foreground mb-4">
                Start building your daily routine by creating your first habit.
              </p>
              <HabitForm />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {habits.map((habit) => (
                <HabitCard key={habit.id} habit={habit} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
