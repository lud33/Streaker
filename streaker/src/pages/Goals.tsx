import { useState } from 'react';
import { startOfWeek, endOfWeek, parseISO, isWithinInterval } from 'date-fns';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useHabitsContext } from '@/contexts/HabitsContext';
import { useGoals } from '@/hooks/useGoals';
import { Goal } from '@/types/habit';
import { Target, Plus, Trophy, Zap, Check, Trash2, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Goals() {
  const { habits, getHabitStats } = useHabitsContext();
  const { goals, isLoading, addGoal, deleteGoal } = useGoals();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newGoal, setNewGoal] = useState({
    habitId: '',
    title: '',
    description: '',
    targetDays: 30,
    type: 'streak' as 'streak' | 'total' | 'weekly',
  });

  const handleAddGoal = async () => {
    if (!newGoal.title) return;

    setIsSaving(true);
    try {
      await addGoal({
        habitId: newGoal.habitId === 'none' || newGoal.habitId === '' ? undefined : newGoal.habitId,
        title: newGoal.title,
        description: newGoal.description,
        targetDays: newGoal.targetDays,
        type: newGoal.type,
      });
      setNewGoal({ habitId: '', title: '', description: '', targetDays: 30, type: 'streak' });
      setIsDialogOpen(false);
      toast.success('Goal created!');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      await deleteGoal(id);
      toast.success('Goal deleted.');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  // Calculate current progress for linked goals
  const getGoalProgress = (goal: Goal) => {
    if (!goal.habitId) return goal.currentDays;

    const habit = habits.find((h) => h.id === goal.habitId);
    if (!habit) return goal.currentDays;

    const stats = getHabitStats(habit);

    switch (goal.type) {
      case 'streak':
        return stats.currentStreak;
      case 'total':
        return stats.totalCompleted;
      case 'weekly': {
        const now = new Date();
        const weekInterval = {
          start: startOfWeek(now, { weekStartsOn: 1 }),
          end: endOfWeek(now, { weekStartsOn: 1 }),
        };
        return habit.completedDates.filter((d) =>
          isWithinInterval(parseISO(d), weekInterval)
        ).length;
      }
      default:
        return goal.currentDays;
    }
  };

  const activeGoals = goals.filter((g) => !g.completedAt);
  const completedGoals = goals.filter((g) => g.completedAt);

  return (
    <DashboardLayout title="Goals">
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Your Goals</h2>
            <p className="text-muted-foreground">Set targets and track your progress</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gradient" className="gap-2">
                <Plus className="w-4 h-4" />
                New Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a New Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Goal Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., 30-Day Streak Challenge"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Describe your goal..."
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="habit">Link to Habit (Optional)</Label>
                  <Select
                    value={newGoal.habitId}
                    onValueChange={(value) => setNewGoal({ ...newGoal, habitId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a habit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No habit linked</SelectItem>
                      {habits.map((habit) => (
                        <SelectItem key={habit.id} value={habit.id}>
                          {habit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Goal Type</Label>
                    <Select
                      value={newGoal.type}
                      onValueChange={(value: 'streak' | 'total' | 'weekly') =>
                        setNewGoal({ ...newGoal, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="streak">Streak Goal</SelectItem>
                        <SelectItem value="total">Total Days</SelectItem>
                        <SelectItem value="weekly">Weekly Target</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="target">Target Days</Label>
                    <Input
                      id="target"
                      type="number"
                      min={1}
                      value={newGoal.targetDays}
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, targetDays: parseInt(e.target.value) || 1 })
                      }
                    />
                  </div>
                </div>

                <Button
                  onClick={handleAddGoal}
                  className="w-full"
                  variant="gradient"
                  disabled={isSaving || !newGoal.title}
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create Goal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Active Goals */}
            {activeGoals.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Active Goals</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeGoals.map((goal) => {
                    const progress = getGoalProgress(goal);
                    const percentage = Math.min(100, Math.round((progress / goal.targetDays) * 100));
                    const linkedHabit = habits.find((h) => h.id === goal.habitId);

                    return (
                      <div key={goal.id} className="glass-card p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                              {goal.type === 'streak' ? (
                                <Zap className="w-5 h-5 text-primary" />
                              ) : goal.type === 'total' ? (
                                <Calendar className="w-5 h-5 text-primary" />
                              ) : (
                                <Target className="w-5 h-5 text-primary" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold">{goal.title}</h4>
                              {linkedHabit && (
                                <p className="text-xs text-muted-foreground">
                                  Linked to: {linkedHabit.name}
                                </p>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDeleteGoal(goal.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        {goal.description && (
                          <p className="text-sm text-muted-foreground">{goal.description}</p>
                        )}

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-semibold">
                              {progress} / {goal.targetDays} days
                            </span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                          <p className="text-xs text-muted-foreground text-right">
                            {percentage}% complete
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="glass-card p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Target className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Set Your First Goal</h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Create goals to challenge yourself. Track streaks, total days, or weekly targets!
                </p>
                <Button
                  variant="gradient"
                  size="lg"
                  className="gap-2"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="w-5 h-5" />
                  Create Goal
                </Button>
              </div>
            )}

            {/* Goal Type Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-6">
                <Trophy className="w-8 h-8 text-warning mb-4" />
                <h3 className="font-semibold mb-2">Streak Goals</h3>
                <p className="text-sm text-muted-foreground">
                  Challenge yourself to maintain a streak for a set number of consecutive days.
                </p>
              </div>
              <div className="glass-card p-6">
                <Calendar className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Total Days Goals</h3>
                <p className="text-sm text-muted-foreground">
                  Set a target for total completed days, regardless of streaks.
                </p>
              </div>
              <div className="glass-card p-6">
                <Target className="w-8 h-8 text-secondary mb-4" />
                <h3 className="font-semibold mb-2">Weekly Targets</h3>
                <p className="text-sm text-muted-foreground">
                  Complete your habit a certain number of times per week.
                </p>
              </div>
            </div>

            {/* Completed Goals */}
            {completedGoals.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Check className="w-5 h-5 text-secondary" />
                  Completed Goals
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {completedGoals.map((goal) => (
                    <div key={goal.id} className="glass-card p-4 opacity-70">
                      <div className="flex items-center gap-2 mb-2">
                        <Check className="w-4 h-4 text-secondary" />
                        <h4 className="font-medium">{goal.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Completed {goal.targetDays} days
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
