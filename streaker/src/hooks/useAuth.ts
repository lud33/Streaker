import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types/habit';
import { ApiError, apiRequest, clearApiToken, getApiToken, setApiToken } from '@/lib/api';

const AUTH_KEY = 'Streaker_auth';

interface AuthResponse {
  user: User;
  token: string;
}

function saveSession({ user, token }: AuthResponse): User {
  setApiToken(token);
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return user;
}

function getCachedUser(): User | null {
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) as User : null;
  } catch {
    localStorage.removeItem(AUTH_KEY);
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const token = getApiToken();

    if (!token) {
      localStorage.removeItem(AUTH_KEY);
      setIsLoading(false);
      return () => {
        active = false;
      };
    }

    apiRequest<{ user: User }>('/user')
      .then(({ user: authenticatedUser }) => {
        if (active) {
          localStorage.setItem(AUTH_KEY, JSON.stringify(authenticatedUser));
          setUser(authenticatedUser);
        }
      })
      .catch((error: unknown) => {
        if (!active) return;

        if (error instanceof ApiError && error.status === 401) {
          clearApiToken();
          localStorage.removeItem(AUTH_KEY);
          setUser(null);
        } else {
          setUser(getCachedUser());
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const response = await apiRequest<AuthResponse>('/login', {
      method: 'POST',
      body: { email, password },
    });
    setUser(saveSession(response));
    return true;
  }, []);

  const signup = useCallback(async (username: string, email: string, password: string): Promise<boolean> => {
    const response = await apiRequest<AuthResponse>('/register', {
      method: 'POST',
      body: { username, email, password },
    });
    setUser(saveSession(response));
    return true;
  }, []);

  const demoLogin = useCallback(async (): Promise<void> => {
    const email = `demo+${crypto.randomUUID()}@Streaker.app`;
    await signup('Demo User', email, crypto.randomUUID());
  }, [signup]);

  const logout = useCallback(() => {
    if (getApiToken()) {
      void apiRequest('/logout', { method: 'POST' }).catch(() => undefined);
    }

    clearApiToken();
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (fields: {
    username?: string;
    email?: string;
    password?: string;
    currentPassword?: string;
  }): Promise<void> => {
    const { user: updatedUser } = await apiRequest<{ user: User }>('/user', {
      method: 'PATCH',
      body: fields,
    });
    localStorage.setItem(AUTH_KEY, JSON.stringify(updatedUser));
    setUser(updatedUser);
  }, []);

  const deleteAccount = useCallback(async (password: string): Promise<void> => {
    await apiRequest<void>('/user', {
      method: 'DELETE',
      body: { password },
    });
    clearApiToken();
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    demoLogin,
    logout,
    updateProfile,
    deleteAccount,
  };
}
