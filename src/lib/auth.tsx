'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User } from '@/types';
import { useSession } from 'next-auth/react';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: nextAuthSession, status: nextAuthStatus } = useSession();

  useEffect(() => {
    if (nextAuthStatus !== 'loading') setLoading(false);
  }, [nextAuthStatus]);

  const nextAuthUser = nextAuthSession?.user ? { id: nextAuthSession.user.email || '', name: nextAuthSession.user.name || 'User', email: nextAuthSession.user.email || '', role: 'admin' as const, pin: '', createdAt: '' } : null;

  useEffect(() => {
    if (nextAuthUser) setUser(nextAuthUser);
  }, [nextAuthUser]);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!supabase) return false;
    const { data, error } = await supabase.from('profiles').select('*').eq('email', email).maybeSingle();
    if (error || !data) return false;
    if (password !== 'admin123' && password !== 'cashier123') return false;
    const u = { id: data.id, name: data.name, email: data.email, role: data.role, pin: '', createdAt: data.created_at } as User;
    setUser(u);
    return true;
  };

  const logout = () => {
    setUser(null);
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
