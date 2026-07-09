'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { User } from '@/types';
import { getUsers, setSession, clearSession, getSession, seedData } from '@/lib/store';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (pin: string) => User | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
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

  const login = (pin: string): User | null => {
    const users = getUsers();
    const found = users.find(u => u.pin === pin);
    if (found) {
      setUser(found);
      setSession({ userId: found.id, name: found.name, role: found.role });
      return found;
    }
    return null;
  };

  const logout = () => {
    setUser(null);
    clearSession();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
