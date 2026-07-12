'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import DashboardLayoutClient from './layout-client';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [orderCount, setOrderCount] = useState(0);
  const [tableCount, setTableCount] = useState(0);
  const [reservationCount, setReservationCount] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const db = supabase;
    if (!db) return;
    const load = async () => {
      const [{ count: oc }, { count: tc }, { count: rc }] = await Promise.all([
        db.from('orders').select('*', { count: 'exact', head: true }).neq('status', 'completed').neq('status', 'cancelled'),
        db.from('tables').select('*', { count: 'exact', head: true }),
        db.from('tables').select('*', { count: 'exact', head: true }).eq('status', 'reserved'),
      ]);
      setOrderCount(oc || 0);
      setTableCount(tc || 0);
      setReservationCount(rc || 0);
    };
    load();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayoutClient
      user={{ name: user.name, email: user.email, role: user.role }}
      orderCount={orderCount}
      tableCount={tableCount}
      reservationCount={reservationCount}
    >
      {children}
    </DashboardLayoutClient>
  );
}
