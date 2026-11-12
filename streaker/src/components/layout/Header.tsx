import { useAuthContext } from '@/contexts/AuthContext';
import { useHabitsContext } from '@/contexts/HabitsContext';
import { FlameIcon } from '@/components/icons/FlameIcon';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const { user } = useAuthContext();
  const { habits, getHabitStats } = useHabitsContext();

  const totalStreak = habits.reduce((acc, habit) => {
    const stats = getHabitStats(habit);
    return acc + stats.currentStreak;
  }, 0);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-40">
      <div className="h-full px-6 flex items-center justify-between gap-4">
        <div className="flex-1">
          {title ? (
            <h1 className="text-xl font-bold">{title}</h1>
          ) : (
            <div>
              <h1 className="text-xl font-bold">
                {getGreeting()}, {user?.username || 'there'}! 👋
              </h1>
              <p className="text-sm text-muted-foreground">
                {format(new Date(), 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Total streak */}
          {totalStreak > 0 && (
            <div className="hidden md:flex items-center gap-2 bg-accent/20 px-4 py-2 rounded-xl">
              <FlameIcon size={20} />
              <span className="font-bold text-accent">{totalStreak} day streak</span>
            </div>
          )}

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
          </Button>
        </div>
      </div>
    </header>
  );
}
