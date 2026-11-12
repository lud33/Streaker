import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useHabitsContext } from '@/contexts/HabitsContext';
import { HabitCard } from '@/components/HabitCard';
import { HabitForm } from '@/components/HabitForm';
import { Button } from '@/components/ui/button';
import { HABIT_CATEGORIES } from '@/types/habit';
import { cn } from '@/lib/utils';
import { Filter, Grid, List } from 'lucide-react';

export default function Habits() {
  const { habits } = useHabitsContext();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredHabits = useMemo(() => {
    return habits.filter((habit) => {
      const matchesCategory = !selectedCategory || habit.category === selectedCategory;
      return matchesCategory;
    });
  }, [habits, selectedCategory]);

  return (
    <DashboardLayout title="My Habits">
      <div className="space-y-6 animate-fade-in">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-3">
            <div className="flex border border-border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className="h-8 w-8"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
                className="h-8 w-8"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <HabitForm />
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {HABIT_CATEGORIES.map((cat) => (
            <Button
              key={cat.value}
              variant={selectedCategory === cat.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.value)}
              className="gap-1"
            >
              <span>{cat.icon}</span>
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        <div>
          {filteredHabits.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <Filter className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No habits found</h3>
              <p className="text-muted-foreground">
                {selectedCategory
                  ? 'Try adjusting your filters.'
                  : 'Create your first habit to get started.'}
              </p>
            </div>
          ) : (
            <div className={cn(
              'gap-4',
              viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'flex flex-col'
            )}>
              {filteredHabits.map((habit) => (
                <HabitCard key={habit.id} habit={habit} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
