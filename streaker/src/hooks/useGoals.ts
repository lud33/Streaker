import { useState, useEffect, useCallback } from 'react';
import { Goal } from '@/types/habit';
import { toast } from 'sonner';
import { useAuthContext } from '@/contexts/AuthContext';
import { apiRequest, getApiErrorMessage } from '@/lib/api';

interface GoalListResponse {
  data: Goal[];
}

interface GoalResponse {
  data: Goal;
}

export function useGoals() {
  const { user, isLoading: isAuthLoading } = useAuthContext();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    if (isAuthLoading) return;
    if (!user) {
      setGoals([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    apiRequest<GoalListResponse>('/goals')
      .then(({ data }) => {
        if (active) setGoals(data);
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

  const addGoal = useCallback(
    async (goal: Omit<Goal, 'id' | 'createdAt' | 'currentDays' | 'completedAt'>): Promise<Goal> => {
      const { data } = await apiRequest<GoalResponse>('/goals', {
        method: 'POST',
        body: goal,
      });
      setGoals((current) => [...current, data]);
      return data;
    },
    [],
  );

  const updateGoal = useCallback(async (id: string, updates: Partial<Goal>): Promise<void> => {
    const { id: _id, createdAt: _createdAt, currentDays: _currentDays, completedAt: _completedAt, ...attributes } = updates;
    const { data } = await apiRequest<GoalResponse>(`/goals/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: attributes,
    });
    setGoals((current) => current.map((g) => (g.id === id ? data : g)));
  }, []);

  const deleteGoal = useCallback(async (id: string): Promise<void> => {
    await apiRequest<void>(`/goals/${encodeURIComponent(id)}`, { method: 'DELETE' });
    setGoals((current) => current.filter((g) => g.id !== id));
  }, []);

  return {
    goals,
    isLoading,
    addGoal,
    updateGoal,
    deleteGoal,
  };
}
