'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User } from '@/types';
import { getUsers, setSession, clearSession, getSession, seedData } from '@/lib/store';
import { useSession } from 'next-auth/react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (pin: string) => User | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function toLocalUser(nextAuthUser: { name?: string | null; email?: string | null; image?: string | null }): User | null {
  if (!nextAuthUser?.email) return null;
  const users = getUsers();
  let found = users.find(u => u.email === nextAuthUser.email);
  if (!found) {
    found = {
      id: `google-${nextAuthUser.email}`,
      name: nextAuthUser.name || 'Google User',
      email: nextAuthUser.email,
      role: 'cashier',
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
  const [loading] = useState(false);
  const { data: nextAuthSession, status: nextAuthStatus } = useSession();

  const nextAuthUser = nextAuthSession?.user ? toLocalUser(nextAuthSession.user) : null;
  const user = nextAuthUser || localUser;

  const login = (pin: string): User | null => {
    const users = getUsers();
    const found = users.find(u => u.pin === pin);
    if (found) {
      setLocalUser(found);
      setSession({ userId: found.id, name: found.name, role: found.role });
      return found;
    }
    return null;
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
