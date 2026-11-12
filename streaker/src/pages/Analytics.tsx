import { useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useHabitsContext } from '@/contexts/HabitsContext';
import { StatsCard } from '@/components/StatsCard';
import { FlameIcon } from '@/components/icons/FlameIcon';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { format, subDays, parseISO } from 'date-fns';
import { TrendingUp, Calendar, Target, Award } from 'lucide-react';

export default function Analytics() {
  const { habits, getHabitStats, isHabitCompletedToday } = useHabitsContext();

  const weeklyData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const completed = habits.filter(h => h.completedDates.includes(dateStr)).length;
      days.push({
        day: format(date, 'EEE'),
        completed,
        total: habits.length,
        percentage: habits.length > 0 ? Math.round((completed / habits.length) * 100) : 0,
      });
    }
    return days;
  }, [habits]);

  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {};
    habits.forEach((habit) => {
      categories[habit.category] = (categories[habit.category] || 0) + 1;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [habits]);

  const streakData = useMemo(() => {
    return habits
      .map((habit) => ({
        name: habit.name,
        streak: getHabitStats(habit).currentStreak,
        color: habit.color,
      }))
      .sort((a, b) => b.streak - a.streak)
      .slice(0, 5);
  }, [habits, getHabitStats]);

  const overallStats = useMemo(() => {
    const totalCompleted = habits.reduce((acc, h) => acc + h.completedDates.length, 0);
    const totalStreak = habits.reduce((acc, h) => acc + getHabitStats(h).currentStreak, 0);
    const longestStreak = habits.reduce((acc, h) => Math.max(acc, getHabitStats(h).longestStreak), 0);
    const avgCompletion = habits.length > 0
      ? Math.round(habits.reduce((acc, h) => acc + getHabitStats(h).completionRate, 0) / habits.length)
      : 0;

    return { totalCompleted, totalStreak, longestStreak, avgCompletion };
  }, [habits, getHabitStats]);

  const COLORS = ['#6366f1', '#10b981', '#ff6b35', '#f59e0b', '#ec4899', '#8b5cf6'];

  return (
    <DashboardLayout title="Analytics">
      <div className="space-y-8 animate-fade-in">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Completions"
            value={overallStats.totalCompleted}
            subtitle="All time"
            icon={<Calendar className="w-6 h-6" />}
          />
          <StatsCard
            title="Combined Streak"
            value={overallStats.totalStreak}
            subtitle="Current"
            icon={<FlameIcon size={24} animated />}
          />
          <StatsCard
            title="Longest Streak"
            value={overallStats.longestStreak}
            subtitle="Personal best"
            icon={<Award className="w-6 h-6" />}
          />
          <StatsCard
            title="Avg. Completion"
            value={`${overallStats.avgCompletion}%`}
            subtitle="Overall rate"
            icon={<Target className="w-6 h-6" />}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Progress */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Weekly Progress
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="day"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Bar
                    dataKey="completed"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Habits by Category</h3>
            <div className="h-64">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-3 justify-center mt-4">
              {categoryData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm capitalize">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Streaks */}
          <div className="glass-card p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FlameIcon size={20} animated />
              Top Streaks
            </h3>
            {streakData.length > 0 ? (
              <div className="space-y-4">
                {streakData.map((habit, index) => (
                  <div key={habit.name} className="flex items-center gap-4">
                    <span className="text-lg font-bold text-muted-foreground w-6">
                      #{index + 1}
                    </span>
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: habit.color }}
                    />
                    <span className="flex-1 font-medium truncate">{habit.name}</span>
                    <div className="flex items-center gap-2">
                      <FlameIcon size={16} animated={habit.streak >= 7} />
                      <span className="font-bold">{habit.streak} days</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Complete habits to build streaks!
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
