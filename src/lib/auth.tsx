'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User } from '@/types';
import { getUsers, setSession, clearSession, getSession, seedData } from '@/lib/store';
import { useSession, signIn } from 'next-auth/react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function toLocalUser(nextAuthUser: { name?: string | null; email?: string | null; image?: string | null; role?: string | null }): User | null {
  if (!nextAuthUser?.email) return null;
  const users = getUsers();
  let found = users.find(u => u.email === nextAuthUser.email);
  if (!found) {
    found = {
      id: nextAuthUser.email,
      name: nextAuthUser.name || 'User',
      email: nextAuthUser.email,
      role: (nextAuthUser.role as User['role']) || 'cashier',
      pin: '',
      createdAt: new Date().toISOString(),
    };
    users.push(found);
  }
  return found;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [localUser, setLocalUser] = useState<User | null>(() => {
    seedData();
    const session = getSession();
    if (session) {
      const users = getUsers();
      const found = users.find(u => u.id === session.userId);
      return found || null;
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const { data: nextAuthSession, status: nextAuthStatus } = useSession();

  useEffect(() => {
    if (nextAuthStatus !== 'loading') {
      setLoading(false);
    }
  }, [nextAuthStatus]);

  const nextAuthUser = nextAuthSession?.user ? toLocalUser(nextAuthSession.user) : null;
  const user = nextAuthUser || localUser;

  const login = async (email: string, password: string): Promise<boolean> => {
    const res = await signIn('credentials', { email, password, redirect: false });
    return !res?.error;
  };

  const logout = () => {
    setLocalUser(null);
    clearSession();
  };

  return (
    <AuthContext.Provider value={{ user, loading: loading || nextAuthStatus === 'loading', login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
