import { useState } from 'react';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api';
import { Habit } from '@/types/habit';
import { useHabitsContext } from '@/contexts/HabitsContext';
import { FlameIcon } from '@/components/icons/FlameIcon';
import { HabitContributionCalendar } from '@/components/HabitContributionCalendar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Trash2, MoreVertical, Plus, Trophy, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface HabitCardProps {
  habit: Habit;
}

export function HabitCard({ habit }: HabitCardProps) {
  const { toggleHabitCompletion, getHabitStats, isHabitCompletedToday, deleteHabit, getTodayCompletionCount } = useHabitsContext();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const isCompleted = isHabitCompletedToday(habit);
  const todayCount = getTodayCompletionCount(habit);
  const stats = getHabitStats(habit);

  const handleToggle = async () => {
    try {
      await toggleHabitCompletion(habit.id);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteHabit(habit.id);
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <>
      <div className="glass-card p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className="w-4 h-4 rounded-full shrink-0"
              style={{ backgroundColor: habit.color }}
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{habit.name}</h3>
              <p className="text-xs text-muted-foreground capitalize">{habit.category}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Show longest streak (max streak) */}
            {stats.longestStreak > 0 && (
              <div className="flex items-center gap-1 bg-accent/20 px-2 py-1 rounded-lg" title="Best Streak">
                <Trophy className="w-4 h-4 text-accent" />
                <span className="text-sm font-bold text-accent">{stats.longestStreak}</span>
              </div>
            )}
            
            {/* Show current streak if active */}
            {stats.currentStreak > 0 && (
              <div className="flex items-center gap-1 bg-primary/20 px-2 py-1 rounded-lg" title="Current Streak">
                <FlameIcon size={16} animated={stats.currentStreak >= 7} />
                <span className="text-sm font-bold text-primary">{stats.currentStreak}</span>
              </div>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Contribution Calendar */}
        <div className="rounded-lg bg-background/50 p-3">
          <HabitContributionCalendar
            completedDates={habit.completedDates}
            completionCounts={habit.completionCounts || {}}
            completionTimes={habit.completionTimes || {}}
            color={habit.color}
          />
        </div>

        {/* Footer with stats and button */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span><strong className="text-foreground">{stats.totalCompleted}</strong> days</span>
            <span><strong className="text-foreground">{stats.longestStreak}</strong> best</span>
            <span><strong className="text-foreground">{stats.completionRate}%</strong> rate</span>
          </div>

          {isCompleted ? (
            <Button
              size="sm"
              disabled
              className="transition-all duration-300 gap-2 font-semibold text-primary-foreground opacity-80"
              style={{ 
                backgroundColor: habit.color,
              }}
            >
              <Check className="w-4 h-4" />
              Marked
            </Button>
          ) : (
            <Button
              onClick={handleToggle}
              size="sm"
              className="transition-all duration-300 gap-2 font-semibold text-primary-foreground"
              style={{ 
                backgroundColor: habit.color,
                boxShadow: `0 0 20px ${habit.color}40`
              }}
            >
              <Plus className="w-4 h-4" />
              Mark Today
            </Button>
          )}
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Habit</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{habit.name}"? This action cannot be undone and all your progress will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
