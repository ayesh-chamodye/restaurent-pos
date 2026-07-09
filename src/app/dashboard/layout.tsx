import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import DashboardLayoutClient from './layout-client';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const metadata: Metadata = {
  title: 'Dashboard - Nearfood resto',
  description: 'Restaurant POS Dashboard',
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/login');

  const supabase = await createSupabaseServerClient();
  let orderCount = 0;
  let tableCount = 0;
  let reservationCount = 0;
  if (supabase) {
    const [{ count: oc }, { count: tc }, { count: rc }] = await Promise.all([
      supabase.from('orders').select('*', { count: 'exact', head: true }).neq('status', 'completed').neq('status', 'cancelled'),
      supabase.from('tables').select('*', { count: 'exact', head: true }),
      supabase.from('tables').select('*', { count: 'exact', head: true }).eq('status', 'reserved'),
    ]);
    orderCount = oc || 0;
    tableCount = tc || 0;
    reservationCount = rc || 0;
  }

  return (
    <DashboardLayoutClient
      user={session.user || { name: '', email: '', image: '', role: '' }}
      orderCount={orderCount}
      tableCount={tableCount}
      reservationCount={reservationCount}
    >
      {children}
    </DashboardLayoutClient>
  );
}
